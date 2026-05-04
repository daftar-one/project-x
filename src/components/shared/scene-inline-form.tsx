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

  /* ── shared cell styles ── */
  const th: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase',
    letterSpacing: '.07em', padding: '8px 10px', whiteSpace: 'nowrap',
    background: 'rgba(255,255,255,.03)', borderBottom: '1px solid rgba(255,255,255,.07)',
    textAlign: 'left',
  };
  const thR: React.CSSProperties = { ...th, textAlign: 'right' };
  const thC: React.CSSProperties = { ...th, textAlign: 'center' };

  const td: React.CSSProperties = {
    fontSize: 12, color: '#e5e7eb', padding: '9px 10px',
    borderBottom: '1px solid rgba(255,255,255,.05)', verticalAlign: 'top',
  };
  const tdR: React.CSSProperties = { ...td, textAlign: 'right', fontFamily: 'monospace' };
  const tdC: React.CSSProperties = { ...td, textAlign: 'center' };

  const statusColor = (s: BillEntry['status']) =>
    s === 'Paid' ? '#34d399' : s === 'Rejected' ? '#f87171' : '#6b7280';

  const inputBase: React.CSSProperties = {
    background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,.18)',
    color: '#f0f2f5', fontSize: 12, padding: '2px 0', outline: 'none',
  };

  const unitSel: React.CSSProperties = {
    background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 4, padding: '2px 3px', fontSize: 10, fontWeight: 700,
    color: '#a5b4fc', outline: 'none', cursor: 'pointer', flexShrink: 0,
  };

  const lbl: React.CSSProperties = {
    fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase',
    letterSpacing: '.07em', marginBottom: 4, display: 'block',
  };

  const roVal: React.CSSProperties = { fontSize: 12, color: '#e5e7eb', padding: '3px 0' };
  const roMuted: React.CSSProperties = { ...roVal, color: '#9ca3af' };

  const colCount = isLP && !locked ? 10 : 9;
  const fmtFactor = (f: number) => `${f.toFixed(2)}x`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>


      {/* ── Row 1: Basic Details (left) + Wallet (right) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 14, alignItems: 'stretch' }}>

        {/* Basic Details — compact card, min-width:0 prevents overflow */}
        <div className="card" style={{ padding: '12px 14px', minWidth: 0 }}>
          {/* <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em' }}>
            {locked && (
              <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(99,102,241,.15)', color: '#a5b4fc', padding: '2px 7px', borderRadius: 999, fontSize: 9, fontWeight: 600 }}>
                <Icon name="lock" size={9} /> Locked
              </span>
            )}
          </div> */}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px 20px' }}>

            <div className='col-span-2'>
              <label style={lbl}>Scene Name</label>
              {locked
                ? <div style={{ ...roVal, fontWeight: 600 }}>{sceneName || '—'}</div>
                : (
                  <div className="input-underline" style={{ padding: '6px 0' }}>
                    <Icon name="film" size={14} />
                    <input
                      value={sceneName}
                      onChange={e => handleNameChange(e.target.value)}
                      placeholder="e.g. Gateway Chase…"
                      style={{ fontSize: 13, color: '#f0f2f5' }}
                    />
                  </div>
                )
              }
            </div>
            <div className='grid grid-cols-6'>
              <div>
                <label style={lbl}>Budget (₹)</label>
                <div style={{ ...roVal, fontFamily: 'monospace' }}>{budget > 0 ? fmtShort(budget) : '—'}</div>
              </div>
              <div>
                <label style={lbl}>Pending Payment (₹)</label>
                <div style={{ ...roVal, fontFamily: 'monospace' }}>{totalPending > 0 ? fmtShort(totalPending) : '—'}</div>
              </div>
              <div>
                <label style={lbl}>Rejected Payment (₹)</label>
                <div style={{ ...roVal, fontFamily: 'monospace' }}>{totalRejected > 0 ? fmtShort(totalRejected) : '—'}</div>
              </div>

              <div>
                <label style={lbl}>Actual Spent (₹)</label>
                <div style={{ ...roVal, fontFamily: 'monospace' }}>{totalActual > 0 ? fmtShort(totalActual) : '—'}</div>
              </div>

              <div>
                <label style={lbl}>Over Budget</label>
                <div style={{ ...roVal, fontFamily: 'monospace', color: overBudget > 0 ? '#f87171' : '#ffffff'}}>
                  {overBudget > 0 ? fmtShort(overBudget) : '—'}
                </div>
              </div>

              <div>
                <label style={lbl}>Variance</label>
                <div style={{ ...roVal, fontFamily: 'monospace', color: totalVarFactor != null && totalVarFactor > 1 ? '#f87171' : '#ffffff' }}>
                  {totalVarFactor != null ? fmtFactor(totalVarFactor) : '—'}
                </div>
              </div>
            </div>

            <div >
              <label style={lbl}>Budget Approved By</label>
              <div style={{...roVal}}>{scene ? 'Arjun Mehta' : '—'}</div>
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

      {/* ── Row 2: Breakdown Table — full available width ── */}
      <div className="card">
        <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="label">Budget Breakdown</div>
          <div className='flex flex-row gap-2'>
          {isLP && !addingRow && (
            <button className="btn btn-ghost btn-sm" onClick={() => setAddingRow(true)}>
              <Icon name="plus" size={13} /> Add
            </button>
          )}
          {isLP && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {!locked ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => setLockConfirmOpen(true)}>
                <Icon name="lock" size={13} /> Lock Budget
              </button>
            </>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#a5b4fc', fontSize: 12 }}>
              <Icon name="lock" size={13} /> Budget locked
            </span>
          )}
        </div>
      )}
      </div>
        </div>

        {/* Horizontally scrollable if table overflows */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
            <thead>
              <tr>
                <th style={{ ...thC, width: 36 }}>#</th>
                <th style={th}>Reason</th>
                <th style={thR}>Amount</th>
                <th style={th}>Vendor</th>
                <th style={thR}>Pending Payment</th>
                <th style={thC}>Status</th>
                <th style={thR}>Actual</th>
                <th style={{ ...thC, width: 48 }}>Bill</th>
                <th style={thR}>Variance</th>
                {isLP && !locked && <th style={{ ...th, width: 28 }} />}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !addingRow && (
                <tr>
                  <td colSpan={colCount} style={{ ...td, textAlign: 'center', color: '#4b5563', padding: '28px 16px' }}>
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
                      <td colSpan={colCount} style={{ padding: '10px 12px 4px', background: 'rgba(255,255,255,.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icon name="lock" size={11} style={{ color: '#a5b4fc' }} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                            Budget is Locked
                          </span>
                        </div>
                      </td>
                    </tr>,
                    <tr key={`separator-${rowIdx}`}>
                      <td colSpan={colCount} style={{ padding: 0 }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '7px 12px',
                          background: 'rgba(251,191,36,.06)',
                          borderTop: '2px dashed rgba(251,191,36,.35)',
                          borderBottom: '2px dashed rgba(251,191,36,.35)',
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '.08em' }}>
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
                  const subTd = (base: React.CSSProperties): React.CSSProperties =>
                    billIdx > 0 ? { ...base, borderTop: '1px solid rgba(255,255,255,.03)', borderBottom: '1px solid rgba(255,255,255,.03)' } : base;

                  return (
                    <tr key={bill ? bill.id : `${row.id}-empty`}>
                      {isFirst && <>
                        <td rowSpan={span} style={{ ...tdC, fontWeight: 700, color: '#6b7280', fontSize: 11, verticalAlign: 'top' }}>{rowIdx + 1}</td>
                        <td rowSpan={span} style={{ ...td, minWidth: 140, verticalAlign: 'top' }}>{row.reason}</td>
                        <td rowSpan={span} style={{ ...tdR, verticalAlign: 'top' }}>{fmtShort(row.amount)}</td>
                        <td rowSpan={span} style={{ ...td, color: '#9ca3af', fontSize: 11, minWidth: 90, verticalAlign: 'top' }}>{row.vendorName || 'Self'}</td>
                      </>}

                      {/* Pending Payment */}
                      <td style={subTd(tdR)}>
                        {pendingAmt > 0 ? fmtShort(pendingAmt) : <span style={{ color: '#374151' }}>—</span>}
                      </td>

                      {/* Bill file icon */}
                      

                      {/* Status */}
                      <td style={subTd(tdC)}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          {!bill ? (
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280' }}>NA</span>
                          ) : bill.status === 'NA' ? (
                            <select
                              onChange={e => updateBillStatus(row.id, bill.id, e.target.value as 'Paid' | 'Rejected')}
                              defaultValue=""
                              disabled={!isLP}
                              style={{
                                background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.08)',
                                borderRadius: 4, padding: '3px 5px', fontSize: 10, fontWeight: 700,
                                color: '#f59e0b', outline: 'none', cursor: isLP ? 'pointer' : 'default',
                              }}
                            >
                              <option value="" disabled>Action…</option>
                              <option value="Paid">Paid</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          ) : (
                            <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(bill.status) }}>{bill.status}</span>
                          )}
                          {(bill?.status === 'Paid' || bill?.status === 'Rejected') && (
                            <span style={{ fontSize: 10, color: '#9ca3af' }}>{bill.paidBy}</span>
                          )}
                        </div>
                      </td>

                      {/* Actual (per bill) */}
                      <td style={subTd(tdR)}>
                        {billActual > 0 ? fmtShort(billActual) : <span style={{ color: '#374151' }}>—</span>}
                      </td>

                      <td style={subTd(tdC)}>
                        {bill?.billFileName
                          ? <span style={{ color: '#a5b4fc' }}><Icon name="file" size={14} /></span>
                          : <span style={{ color: '#374151' }}>—</span>
                        }
                      </td>

                      {/* Variance + Delete — rowspanned on first bill row */}
                      {isFirst && <>
                        <td rowSpan={span} style={{ ...tdR, verticalAlign: 'top', color: varFactor != null && varFactor > 1 ? '#f87171' : varFactor != null ? '#34d399' : '#374151' }}>
                          {varFactor != null ? fmtFactor(varFactor) : '—'}
                        </td>
                        {isLP && !locked && (
                          <td rowSpan={span} style={{ ...tdC, verticalAlign: 'top' }}>
                            <button
                              onClick={() => deleteRow(row.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 2 }} 
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
                <tr style={{ background: 'rgba(99,102,241,.05)' }}>
                  <td style={{ ...tdC, color: '#6b7280', fontSize: 11 }}>{rows.length + 1}</td>
                  <td style={td}>
                    <textarea
                      autoFocus
                      value={newReason}
                      onChange={e => setNewReason(e.target.value)}
                      placeholder="Reason / description…"
                      rows={2}
                      style={{ ...inputBase, width: '100%', resize: 'none', lineHeight: 1.45, verticalAlign: 'top' }}
                    />
                  </td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <input
                        type="number"
                        value={newAmount}
                        onChange={e => setNewAmount(e.target.value)}
                        placeholder="0"
                        style={{ ...inputBase, width: 46, textAlign: 'right' }}
                      />
                      <select value={newAmountUnit} onChange={e => setNewAmountUnit(e.target.value as AmountUnit)} style={unitSel}>
                        <option value="K">K</option>
                        <option value="L">L</option>
                        <option value="Cr">Cr</option>
                      </select>
                    </div>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <select
                        value={newVendorId}
                        onChange={e => setNewVendorId(e.target.value)}
                        style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 4, padding: '3px 5px', fontSize: 11, color: '#e5e7eb', outline: 'none' }}
                      >
                        <option value="">Self</option>
                        {localVendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                      <button
                        onClick={() => { setNvError(''); setVendorModalOpen(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontSize: 10, fontWeight: 600, padding: 0, width: 'fit-content' }}
                      >
                        <Icon name="plus" size={10} /> Add New
                      </button>
                    </div>
                  </td>
                  {/* Empty cells for remaining columns */}
                  <td style={td} /><td style={td} /><td style={td} /><td style={td} /><td style={td} />
                  <td style={tdC}>
                    <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                      <button className="btn btn-primary btn-sm" style={{ padding: '3px 7px' }} onClick={handleAddRow}>
                        <Icon name="check" size={11} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '3px 7px' }} onClick={() => { setAddingRow(false); setNewReason(''); setNewAmount(''); setNewAmountUnit('L'); setNewVendorId(''); }}>
                        <Icon name="x" size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Total row */}
              {rows.length > 0 && (
                <tr style={{ background: 'rgba(255,255,255,.04)' }}>
                  <td colSpan={2} style={{ ...td, fontWeight: 700, color: '#6b7280', fontSize: 10, textAlign: 'right' }}>TOTAL</td>
                  <td style={{ ...tdR, fontWeight: 700, color: '#f0f2f5' }}>{fmtShort(totalPlanned)}</td>
                  <td style={td} /><td style={td} /><td style={td} />
                  <td style={{ ...tdR, fontWeight: 700, color: '#f0f2f5' }}>{fmtShort(totalActual)}</td>
                  <td style={td} />
                  <td style={{ ...tdR, fontWeight: 700, color: totalVarFactor == null ? '#374151' : totalVarFactor > 1 ? '#f87171' : '#34d399' }}>
                    {totalVarFactor != null ? fmtFactor(totalVarFactor) : '—'}
                  </td>
                  {isLP && !locked && <td style={td} />}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Actions ── */}
      {/* {isLP && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {!locked ? (
            <>
              <button className="btn btn-ghost btn-sm">
                <Icon name="check" size={13} /> Save Draft
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setLockConfirmOpen(true)}>
                <Icon name="lock" size={13} /> Lock Budget
              </button>
            </>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#a5b4fc', fontSize: 12 }}>
              <Icon name="lock" size={13} /> Budget locked
            </span>
          )}
        </div>
      )} */}

      {/* ── New Vendor Modal ── */}
      <Modal open={vendorModalOpen} onClose={() => setVendorModalOpen(false)} size="lg">
        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f9fafb' }}>Invite Vendor</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setVendorModalOpen(false)}>
              <Icon name="x" size={15} />
            </button>
          </div>

          {nvError && (
            <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 6, padding: '9px 13px', marginBottom: 14, fontSize: 12, color: '#fca5a5' }}>
              {nvError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
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

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setVendorModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleCreateVendor} disabled={!nvName.trim()}>
              <Icon name="plus" size={13} /> Invite
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Lock Confirmation ── */}
      <Modal open={lockConfirmOpen} onClose={() => setLockConfirmOpen(false)}>
        <div style={{ padding: 32 }}>

          {/* Icon */}
          <div style={{
            width: 52, height: 52, borderRadius: 14, marginBottom: 20,
            background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="lock" size={22} style={{ color: '#a5b4fc' }} />
          </div>

          {/* Title */}
          <div style={{ fontSize: 17, fontWeight: 700, color: '#f9fafb', marginBottom: 8, letterSpacing: '-.01em' }}>
            Lock Budget?
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 16px', lineHeight: 1.7 }}>
            Once the budget is locked, you won't be able to make any changes to it. You'll have to delete the breakdown and start over.
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,.06)', marginBottom: 20 }} />

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setLockConfirmOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
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
