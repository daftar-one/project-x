"use client";

import { useState } from 'react';
import { Icon } from './icon';
import { Modal } from './modal';
import { fmtShort } from '@/lib/format';
import { MOCK_SCENES, getMockBudgetLines, getMockSceneBills, getMockSceneWallet } from '@/lib/mock-data';
import { TransactionHistory, type WalletCredit } from './transaction-history';
import { useAuthStore } from '@/store/auth';
import type { Vendor } from '@/lib/types';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

/* ─── internal types ─────────────────────────────────────────────── */

interface BillEntry {
  id: string;
  status: 'NA' | 'Paid' | 'Rejected';
  paidBy: string;
  billFileName: string;
  actualAmount: number;
}

interface BreakdownRow {
  id: string;
  reason: string;
  amount: number;
  vendorId: string;
  vendorName: string;
  bills: BillEntry[];
}

/* ─── currency unit helpers ──────────────────────────────────────── */

const UNIT_MULT = { K: 1_000, L: 1_00_000, Cr: 1_00_00_000 } as const;
type AmountUnit = keyof typeof UNIT_MULT;

/* ─── helpers ─────────────────────────────────────────────────────── */

function toPayStatus(s: string): 'NA' | 'Paid' | 'Rejected' {
  if (s === 'Approved' || s === 'Paid') return 'Paid';
  if (s === 'Rejected') return 'Rejected';
  return 'NA';
}

function initRows(projectId: string, sceneId: string, isDraft: boolean): BreakdownRow[] {
  if (isDraft) return [];
  const lines = getMockBudgetLines(projectId, sceneId);
  const bills = getMockSceneBills(sceneId);

  return lines.map(bl => {
    const matching = bills.filter(b => bl.vendor_id && b.vendor_id === bl.vendor_id);
    const billEntries: BillEntry[] = matching.length > 0
      ? matching.map(b => ({
        id: b.id,
        status: toPayStatus(b.status),
        paidBy: (b.status === 'Rejected' || b.status === 'Paid') ? 'Arjun Mehta' : '',
        billFileName: b.file_url ? 'bill.pdf' : '',
        actualAmount: b.amount,
      }))
      : [{ id: `draft-${bl.id}`, status: 'NA' as const, paidBy: '', billFileName: '', actualAmount: 0 }];

    return {
      id: bl.id,
      reason: bl.reason,
      amount: bl.allocated_amount,
      vendorId: bl.vendor_id ?? '',
      vendorName: bl.vendor_name ?? '',
      bills: billEntries,
    };
  });
}

function rowActual(row: BreakdownRow): number {
  return row.bills.filter(b => b.status === 'Paid').reduce((s, b) => s + b.actualAmount, 0);
}

/* ─── shared table cell class strings ───────────────────────────── */

const thCls = "text-[10px] font-bold text-gray-500 uppercase tracking-[0.07em] px-[10px] py-2 whitespace-nowrap bg-[rgba(255,255,255,.03)] border-b border-[rgba(255,255,255,.07)] text-left";
const thRCls = `${thCls} text-right`;
const thCCls = `${thCls} text-center`;

const tdCls = "text-[12px] text-[#e5e7eb] px-[10px] py-[9px] border-b border-[rgba(255,255,255,.05)] align-top";
const tdRCls = `${tdCls} text-right font-mono`;
const tdCCls = `${tdCls} text-center`;

const inputBaseCls = "bg-transparent border-0 border-b border-[rgba(255,255,255,.18)] text-[#f0f2f5] text-[12px] py-0.5 outline-none";
const unitSelCls = "bg-[rgba(255,255,255,.07)] border border-[rgba(255,255,255,.12)] rounded text-[10px] font-bold text-[#a5b4fc] outline-none cursor-pointer shrink-0 py-0.5 px-[3px]";
const lblCls = "text-[9px] font-bold text-gray-500 uppercase tracking-[0.07em] mb-1 block";
const roValCls = "text-[12px] text-[#e5e7eb] py-[3px]";

/* ─── component ────────────────────────────────────────────────────── */

interface Props {
  projectId: string;
  sceneId: string;
  isDraft: boolean;
  isLP: boolean;
  vendors: Vendor[];
  onSceneNameChange?: (name: string) => void;
  onFundsAdded?: (amount: number) => void;
}

export function SceneInlineForm({ projectId, sceneId, isDraft, isLP, vendors, onSceneNameChange, onFundsAdded }: Props) {
  const user = useAuthStore(s => s.user);
  const scene = isDraft ? null : (MOCK_SCENES[projectId] ?? []).find(s => s.id === sceneId) ?? null;

  /* ── form state ── */
  const [sceneName, setSceneName] = useState(scene?.name ?? '');
  const [budget, setBudget] = useState(scene?.budget ?? 0);
  const [locked, setLocked] = useState(false);
  const [lockConfirmOpen, setLockConfirmOpen] = useState(false);
  const [lockedRowCount, setLockedRowCount] = useState<number | null>(null);

  /* ── local vendor list (props + any newly created) ── */
  const [localVendors, setLocalVendors] = useState<Vendor[]>(vendors);

  /* ── new vendor modal ── */
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [nvName, setNvName] = useState('');
  const [nvLocation, setNvLocation] = useState('');
  const [nvEmail, setNvEmail] = useState('');
  const [nvError, setNvError] = useState('');

  /* ── wallet state ── */
  const [walletBalance, setWalletBalance] = useState(() =>
    isDraft ? 0 : (getMockSceneWallet(sceneId)?.balance ?? 0)
  );
  const [walletCredits, setWalletCredits] = useState<WalletCredit[]>([]);

  /* ── breakdown state ── */
  const [rows, setRows] = useState<BreakdownRow[]>(() => initRows(projectId, sceneId, isDraft));
  const [addingRow, setAddingRow] = useState(false);
  const [newReason, setNewReason] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newAmountUnit, setNewAmountUnit] = useState<AmountUnit>('L');
  const [newVendorId, setNewVendorId] = useState('');

  /* ── derived ── */
  const totalPlanned = rows.reduce((a, r) => a + r.amount, 0);
  const totalActual = rows.reduce((a, r) => a + rowActual(r), 0);
  const totalPending = rows.reduce((a, r) => a + r.bills.filter(b => b.status === 'NA').reduce((s, b) => s + b.actualAmount, 0), 0);
  const totalRejected = rows.reduce((a, r) => a + r.bills.filter(b => b.status === 'Rejected').reduce((s, b) => s + b.actualAmount, 0), 0);
  const overBudget = Math.max(0, totalActual - budget);
  const totalVarFactor = totalPlanned > 0 && totalActual > 0 ? totalActual / totalPlanned : null;
  const newAmountVal = (parseFloat(newAmount) || 0) * UNIT_MULT[newAmountUnit];

  /* ── handlers ── */
  const handleNameChange = (v: string) => { setSceneName(v); onSceneNameChange?.(v); };

  const updateBillStatus = (rowId: string, billId: string, status: 'Paid' | 'Rejected') => {
    if (status === 'Paid') {
      const row = rows.find(r => r.id === rowId);
      const bill = row?.bills.find(b => b.id === billId);
      const needed = bill?.actualAmount ?? 0;
      if (needed > 0 && needed > walletBalance) {
        const diff = needed - walletBalance;
        toast.error(`Not enough funds in wallet. Add ${fmtShort(diff)} more to proceed.`);
        return;
      }
      if (needed > 0) setWalletBalance(prev => prev - needed);
    }
    const userName = user?.full_name || user?.email || '';
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const bills = r.bills.map(b =>
        b.id === billId ? { ...b, status, paidBy: status === 'Paid' ? userName : '' } : b
      );
      return { ...r, bills };
    }));
  };

  function handleAddMoney(amount: number) {
    const addedBy = user?.full_name || user?.email || '';
    setWalletBalance(prev => prev + amount);
    setWalletCredits(prev => [...prev, { id: `wc-${Date.now()}`, amount, createdAt: new Date().toISOString(), addedBy }]);
    onFundsAdded?.(amount);
    toast.success(`Added ${fmtShort(amount)} to wallet`);
  }

  const handleCreateVendor = () => {
    if (!nvName.trim()) { setNvError('Vendor name is required'); return; }
    const newVendor: Vendor = {
      id: `local-vendor-${Date.now()}`,
      production_house_id: 'ph-1',
      name: nvName.trim(),
      category: null,
      rep_name: null,
      email: nvEmail.trim() || null,
      phone: null,
      location: nvLocation.trim() || null,
      status: 'Active',
      created_at: new Date().toISOString(),
    };
    setLocalVendors(prev => [...prev, newVendor]);
    setNewVendorId(newVendor.id);
    setNvName(''); setNvLocation(''); setNvEmail(''); setNvError('');
    setVendorModalOpen(false);
  };

  const handleAddRow = () => {
    const amt = newAmountVal;
    if (!newReason.trim() || amt <= 0) return;
    const vName = newVendorId === '' ? '' : (localVendors.find(v => v.id === newVendorId)?.name ?? '');
    setRows(prev => [...prev, {
      id: `row-${Date.now()}`,
      reason: newReason,
      amount: amt,
      vendorId: newVendorId === '__new__' ? '' : newVendorId,
      vendorName: vName,
      bills: [{ id: `bill-${Date.now()}`, status: 'NA', paidBy: '', billFileName: '', actualAmount: 0 }],
    }]);
    setBudget(prev => prev + amt);
    setNewReason(''); setNewAmount(''); setNewAmountUnit('L'); setNewVendorId('');
    setAddingRow(false);
  };

  const deleteRow = (rowId: string) => setRows(prev => prev.filter(r => r.id !== rowId));

  const statusColor = (s: BillEntry['status']) =>
    s === 'Paid' ? '#34d399' : s === 'Rejected' ? '#f87171' : '#6b7280';

  const colCount = isLP && !locked ? 10 : 9;
  const fmtFactor = (f: number) => `${f.toFixed(2)}x`;

  return (
    <div className="flex flex-col gap-[14px]">
      {/* ── Row 1: Basic Details (left) + Wallet (right) ── */}
      <div className="grid grid-cols-[1fr_260px] gap-[14px] items-stretch">

        {/* Basic Details */}
        <div className="card px-[14px] py-3 min-w-0">
          <div className="grid grid-cols-1 gap-x-5 gap-y-[10px]">
            <div className="col-span-2">
              <label className={lblCls}>Scene Name</label>
              {locked
                ? <div className={`${roValCls} font-semibold`}>{sceneName || '—'}</div>
                : (
                  <div className="input-underline py-1.5">
                    <Icon name="film" size={14} />
                    <input
                      value={sceneName}
                      onChange={e => handleNameChange(e.target.value)}
                      placeholder="e.g. Gateway Chase…"
                      className="text-[13px] text-[#f0f2f5]"
                    />
                  </div>
                )
              }
            </div>
            <div className="grid grid-cols-6">
              <div>
                <label className={lblCls}>Budget (₹)</label>
                <div className={`${roValCls} font-mono`}>{budget > 0 ? fmtShort(budget) : '—'}</div>
              </div>
              <div>
                <label className={lblCls}>Pending Payment (₹)</label>
                <div className={`${roValCls} font-mono`}>{totalPending > 0 ? fmtShort(totalPending) : '—'}</div>
              </div>
              <div>
                <label className={lblCls}>Rejected Payment (₹)</label>
                <div className={`${roValCls} font-mono`}>{totalRejected > 0 ? fmtShort(totalRejected) : '—'}</div>
              </div>
              <div>
                <label className={lblCls}>Actual Spent (₹)</label>
                <div className={`${roValCls} font-mono`}>{totalActual > 0 ? fmtShort(totalActual) : '—'}</div>
              </div>
              <div>
                <label className={lblCls}>Over Budget</label>
                <div className={`${roValCls} font-mono`} style={{ color: overBudget > 0 ? '#f87171' : '#ffffff' }}>
                  {overBudget > 0 ? fmtShort(overBudget) : '—'}
                </div>
              </div>
              <div>
                <label className={lblCls}>Variance</label>
                <div className={`${roValCls} font-mono`} style={{ color: totalVarFactor != null && totalVarFactor > 1 ? '#f87171' : '#ffffff' }}>
                  {totalVarFactor != null ? fmtFactor(totalVarFactor) : '—'}
                </div>
              </div>
            </div>
            <div>
              <label className={lblCls}>Budget Approved By</label>
              <div className={roValCls}>{scene ? 'Arjun Mehta' : '—'}</div>
            </div>
          </div>
        </div>

        {/* Wallet */}
        <TransactionHistory
          walletBalance={walletBalance}
          walletCredits={walletCredits}
          onAddMoney={handleAddMoney}
          isDraft={isDraft}
        />
      </div>

      {/* ── Row 2: Breakdown Table ── */}
      <div className="card">
        <div className="px-[14px] pt-3 pb-[10px] border-b border-[rgba(255,255,255,.06)] flex items-center justify-between">
          <div className="label">Budget Breakdown</div>
          <div className="flex flex-row gap-2">
            {isLP && !addingRow && (
              <button className="btn btn-ghost btn-sm" onClick={() => setAddingRow(true)}>
                <Icon name="plus" size={13} /> Add
              </button>
            )}
            {isLP && (
              <div className="flex gap-2 justify-end">
                {!locked ? (
                  <button className="btn btn-primary btn-sm" onClick={() => setLockConfirmOpen(true)}>
                    <Icon name="lock" size={13} /> Lock Budget
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[#a5b4fc] text-[12px]">
                    <Icon name="lock" size={13} /> Budget locked
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[820px]">
            <thead>
              <tr>
                <th className={`${thCCls} w-9`}>#</th>
                <th className={thCls}>Reason</th>
                <th className={thRCls}>Amount</th>
                <th className={thCls}>Vendor</th>
                <th className={thRCls}>Pending Payment</th>
                <th className={thCCls}>Status</th>
                <th className={thRCls}>Actual</th>
                <th className={`${thCCls} w-12`}>Bill</th>
                <th className={thRCls}>Variance</th>
                {isLP && !locked && <th className={`${thCls} w-7`} />}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !addingRow && (
                <tr>
                  <td colSpan={colCount} className={`${tdCls} text-center text-gray-600 py-7`}>
                    No breakdown rows yet. Click "Add" to start.
                  </td>
                </tr>
              )}

              {rows.flatMap((row, rowIdx) => {
                const billsWithFiles = row.bills.filter(b => b.billFileName !== '');
                const billRows: (BillEntry | null)[] = billsWithFiles.length > 0 ? billsWithFiles : [null];
                const actual = rowActual(row);
                const varFactor = row.amount > 0 && actual > 0 ? actual / row.amount : null;
                const span = billRows.length;
                const isFirstPostLock = locked && lockedRowCount !== null && rowIdx === lockedRowCount;

                return [
                  ...(isFirstPostLock ? [
                    <tr key={`lock-label-${rowIdx}`}>
                      <td colSpan={colCount} className="px-3 pt-[10px] pb-1 bg-[rgba(255,255,255,.02)]">
                        <div className="flex items-center gap-1.5">
                          <Icon name="lock" size={11} style={{ color: '#a5b4fc' }} />
                          <span className="text-[10px] font-bold text-[#a5b4fc] uppercase tracking-[0.08em]">
                            Budget is Locked
                          </span>
                        </div>
                      </td>
                    </tr>,
                    <tr key={`separator-${rowIdx}`}>
                      <td colSpan={colCount} className="p-0">
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '7px 12px',
                          background: 'rgba(251,191,36,.06)',
                          borderTop: '2px dashed rgba(251,191,36,.35)',
                          borderBottom: '2px dashed rgba(251,191,36,.35)',
                        }}>
                          <span className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-[0.08em]">
                            Unplanned Budget
                          </span>
                        </div>
                      </td>
                    </tr>,
                  ] : []),
                  ...billRows.map((bill, billIdx) => {
                    const isFirst = billIdx === 0;
                    const pendingAmt = bill?.status === 'NA' || bill?.status === 'Rejected' ? bill.actualAmount : 0;
                    const billActual = bill?.status === 'Paid' ? bill.actualAmount : 0;
                    const subTdCls = billIdx > 0
                      ? `${tdCls} border-t border-[rgba(255,255,255,.03)] border-b border-[rgba(255,255,255,.03)]`
                      : tdCls;
                    const subTdRCls = billIdx > 0
                      ? `${tdRCls} border-t border-[rgba(255,255,255,.03)] border-b border-[rgba(255,255,255,.03)]`
                      : tdRCls;
                    const subTdCCls = billIdx > 0
                      ? `${tdCCls} border-t border-[rgba(255,255,255,.03)] border-b border-[rgba(255,255,255,.03)]`
                      : tdCCls;

                    return (
                      <tr key={bill ? bill.id : `${row.id}-empty`}>
                        {isFirst && <>
                          <td rowSpan={span} className={`${tdCCls} font-bold text-gray-500 text-[11px] align-top`}>{rowIdx + 1}</td>
                          <td rowSpan={span} className={`${tdCls} min-w-[140px] align-top`}>{row.reason}</td>
                          <td rowSpan={span} className={`${tdRCls} align-top`}>{fmtShort(row.amount)}</td>
                          <td rowSpan={span} className={`${tdCls} text-gray-400 text-[11px] min-w-[90px] align-top`}>{row.vendorName || 'Self'}</td>
                        </>}

                        {/* Pending Payment */}
                        <td className={subTdRCls}>
                          {pendingAmt > 0 ? fmtShort(pendingAmt) : <span className="text-[#374151]">—</span>}
                        </td>

                        {/* Status */}
                        <td className={subTdCCls}>
                          <div className="flex flex-col items-center gap-1">
                            {!bill ? (
                              <span className="text-[11px] font-bold text-gray-500">NA</span>
                            ) : bill.status === 'NA' ? (
                              <select
                                onChange={e => updateBillStatus(row.id, bill.id, e.target.value as 'Paid' | 'Rejected')}
                                defaultValue=""
                                disabled={!isLP}
                                className="bg-[rgba(255,255,255,.07)] border border-[rgba(255,255,255,.08)] rounded text-[10px] font-bold text-[#f59e0b] outline-none px-[5px] py-[3px]"
                                style={{ cursor: isLP ? 'pointer' : 'default' }}
                              >
                                <option value="" disabled>Action…</option>
                                <option value="Paid">Paid</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            ) : (
                              <span className="text-[11px] font-bold" style={{ color: statusColor(bill.status) }}>{bill.status}</span>
                            )}
                            {(bill?.status === 'Paid' || bill?.status === 'Rejected') && (
                              <span className="text-[10px] text-gray-400">{bill.paidBy}</span>
                            )}
                          </div>
                        </td>

                        {/* Actual (per bill) */}
                        <td className={subTdRCls}>
                          {billActual > 0 ? fmtShort(billActual) : <span className="text-[#374151]">—</span>}
                        </td>

                        <td className={subTdCCls}>
                          {bill?.billFileName
                            ? <span className="text-[#a5b4fc]"><Icon name="file" size={14} /></span>
                            : <span className="text-[#374151]">—</span>
                          }
                        </td>

                        {/* Variance + Delete — rowspanned on first bill row */}
                        {isFirst && <>
                          <td rowSpan={span} className={`${tdRCls} align-top`} style={{ color: varFactor != null && varFactor > 1 ? '#f87171' : varFactor != null ? '#34d399' : '#374151' }}>
                            {varFactor != null ? fmtFactor(varFactor) : '—'}
                          </td>
                          {isLP && !locked && (
                            <td rowSpan={span} className={`${tdCCls} align-top`}>
                              <button
                                onClick={() => deleteRow(row.id)}
                                className="bg-transparent border-0 cursor-pointer text-[#f87171] p-0.5"
                              >
                                <Trash2Icon name="x" size={12} />
                              </button>
                            </td>
                          )}
                        </>}
                      </tr>
                    );
                  }),
                ];
              })}

              {/* Add Row inline form */}
              {addingRow && (
                <tr className="bg-[rgba(99,102,241,.05)]">
                  <td className={`${tdCCls} text-gray-500 text-[11px]`}>{rows.length + 1}</td>
                  <td className={tdCls}>
                    <textarea
                      autoFocus
                      value={newReason}
                      onChange={e => setNewReason(e.target.value)}
                      placeholder="Reason / description…"
                      rows={2}
                      className={`${inputBaseCls} w-full resize-none leading-[1.45] align-top`}
                    />
                  </td>
                  <td className={`${tdCls} text-right`}>
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        placeholder="0"
                        className={`${inputBaseCls} w-[46px] text-right`}
                      />
                      <select value={newAmountUnit} onChange={e => setNewAmountUnit(e.target.value as AmountUnit)} className={unitSelCls}>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="Cr">Cr</option>
                      </select>
                    </div>
                  </td>
                  <td className={tdCls}>
                    <div className="flex flex-col gap-[5px]">
                      <select
                        value={newVendorId}
                        onChange={e => setNewVendorId(e.target.value)}
                        className="bg-[rgba(255,255,255,.07)] border border-[rgba(255,255,255,.1)] rounded text-[11px] text-[#e5e7eb] outline-none px-[5px] py-[3px]"
                      >
                        <option value="">Self</option>
                        {localVendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                      {/* <button
                        onClick={() => { setNvError(''); setVendorModalOpen(true); }}
                        className="flex items-center gap-[3px] bg-transparent border-0 cursor-pointer text-[#6366f1] text-[10px] font-semibold p-0 w-fit"
                      >
                        <Icon name="plus" size={10} /> Add New
                      </button> */}
                    </div>
                  </td>
                  {/* Empty cells for remaining columns */}
                  <td className={tdCls} /><td className={tdCls} /><td className={tdCls} /><td className={tdCls} /><td className={tdCls} />
                  <td className={tdCCls}>
                    <div className="flex gap-[3px] justify-center">
                      <button className="btn btn-primary btn-sm px-[7px] py-[3px]" onClick={handleAddRow}>
                        <Icon name="check" size={11} />
                      </button>
                      <button className="btn btn-ghost btn-sm px-[7px] py-[3px]" onClick={() => { setAddingRow(false); setNewReason(''); setNewAmount(''); setNewAmountUnit('L'); setNewVendorId(''); }}>
                        <Icon name="x" size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Total row */}
              {rows.length > 0 && (
                <tr className="bg-[rgba(255,255,255,.04)]">
                  <td colSpan={2} className={`${tdCls} font-bold text-gray-500 text-[10px] text-right`}>TOTAL</td>
                  <td className={`${tdRCls} font-bold text-[#f0f2f5]`}>{fmtShort(totalPlanned)}</td>
                  <td className={tdCls} /><td className={tdCls} /><td className={tdCls} />
                  <td className={`${tdRCls} font-bold text-[#f0f2f5]`}>{fmtShort(totalActual)}</td>
                  <td className={tdCls} />
                  <td className={`${tdRCls} font-bold`} style={{ color: totalVarFactor == null ? '#374151' : totalVarFactor > 1 ? '#f87171' : '#34d399' }}>
                    {totalVarFactor != null ? fmtFactor(totalVarFactor) : '—'}
                  </td>
                  {isLP && !locked && <td className={tdCls} />}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── New Vendor Modal ── */}
      <Modal open={vendorModalOpen} onClose={() => setVendorModalOpen(false)} size="lg">
        <div className="p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[15px] font-bold text-[#f9fafb]">Invite Vendor</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setVendorModalOpen(false)}>
              <Icon name="x" size={15} />
            </button>
          </div>

          {nvError && (
            <div className="bg-[rgba(239,68,68,.12)] border border-[rgba(239,68,68,.25)] rounded-[6px] px-[13px] py-[9px] mb-[14px] text-[12px] text-[#fca5a5]">
              {nvError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="field col-span-full">
              <label className="label">Vendor Name *</label>
              <div className="input-underline">
                <Icon name="building" size={15} />
                <input
                  autoFocus
                  value={nvName}
                  onChange={e => setNvName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateVendor()}
                  placeholder="e.g. Mumbai Location Services"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Location</label>
              <div className="input-underline">
                <Icon name="map" size={15} />
                <input value={nvLocation} onChange={e => setNvLocation(e.target.value)} placeholder="e.g. Mumbai, Maharashtra" />
              </div>
            </div>
            <div className="field">
              <label className="label">Email</label>
              <div className="input-underline">
                <Icon name="mail" size={15} />
                <input type="email" value={nvEmail} onChange={e => setNvEmail(e.target.value)} placeholder="vendor@example.com" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button className="btn btn-ghost btn-sm" onClick={() => setVendorModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleCreateVendor} disabled={!nvName.trim()}>
              <Icon name="plus" size={13} /> Invite
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Lock Confirmation ── */}
      <Modal open={lockConfirmOpen} onClose={() => setLockConfirmOpen(false)}>
        <div className="p-8">
          <div className="w-[52px] h-[52px] rounded-[14px] mb-5 bg-[rgba(99,102,241,.12)] border border-[rgba(99,102,241,.22)] flex items-center justify-center">
            <Icon name="lock" size={22} style={{ color: '#a5b4fc' }} />
          </div>

          <div className="text-[17px] font-bold text-[#f9fafb] mb-2 tracking-[-0.01em]">
            Lock Budget?
          </div>

          <p className="text-[13px] text-gray-400 m-0 mb-4 leading-[1.7]">
            Once the budget is locked, you won't be able to make any changes to it. You'll need to delete the budget and start over.
          </p>

          <div className="h-px bg-[rgba(255,255,255,.06)] mb-5" />

          <div className="flex gap-2">
            <button
              className="btn btn-secondary btn-sm flex-1 justify-center"
              onClick={() => setLockConfirmOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm flex-1 justify-center"
              onClick={() => { setLocked(true); setLockedRowCount(rows.length); setLockConfirmOpen(false); }}
            >
              <Icon name="lock" size={13} /> Lock Budget
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
