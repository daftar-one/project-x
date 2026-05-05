"use client";

import { useState } from 'react';
import { Icon } from './icon';
import { StatusBadge } from './status-badge';
import { fmtShort, fmtDate } from '@/lib/format';
import { useScene } from '@/hooks/useScene';
import { useSceneBills } from '@/hooks/useSceneBills';
import { useSceneBudgetLines } from '@/hooks/useSceneBudgetLines';
import { useVendors } from '@/hooks/useVendors';
import type { Vendor } from '@/lib/types';

interface SceneDetailPanelProps {
  projectId: string;
  sceneId: string;
  isLP: boolean;
  onSceneUpdated?: () => void;
}

const inputCls = "bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.1)] rounded-[7px] px-3 py-2 text-[#f0f2f5] text-[13px] outline-none w-full transition-[border-color,box-shadow]";
const fieldLabelCls = "text-[10px] font-semibold text-gray-500 uppercase tracking-[0.07em] mb-[5px] block";

const billStatusColor = (status: string) => {
  if (status === 'Paid') return { bg: 'rgba(99,102,241,.15)', color: '#a5b4fc' };
  if (status === 'Approved') return { bg: 'rgba(16,185,129,.15)', color: '#34d399' };
  if (status === 'Rejected') return { bg: 'rgba(239,68,68,.15)', color: '#f87171' };
  return { bg: 'rgba(245,158,11,.15)', color: '#fbbf24' };
};

export function SceneDetailPanel({ projectId, sceneId, isLP, onSceneUpdated }: SceneDetailPanelProps) {
  const { data: scene } = useScene(projectId, sceneId);
  const { data: bills } = useSceneBills(projectId, sceneId);
  const { data: lines } = useSceneBudgetLines(projectId, sceneId);
  const { data: vendors } = useVendors();
  void onSceneUpdated;

  const [addingLine, setAddingLine] = useState(false);
  const [lineReason, setLineReason] = useState('');
  const [lineAmount, setLineAmount] = useState('');
  const [lineVendorId, setLineVendorId] = useState('');
  const [lineAdvance, setLineAdvance] = useState('');
  const [lineDate, setLineDate] = useState('');

  function handleAddLine() {
    const amt = parseInt(lineAmount, 10);
    if (!lineReason.trim() || !amt) return;
    setAddingLine(false);
    setLineReason(''); setLineAmount(''); setLineVendorId(''); setLineAdvance(''); setLineDate('');
  }

  function handleDeleteLine(_lineId: string) {}

  function handleApproveBill(_billId: string) {}

  if (!scene) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-600 text-[13px]">
        Loading scene…
      </div>
    );
  }

  const totalActual = bills.reduce((a, b) => a + b.amount, 0);
  const totalVendors = new Set([
    ...lines.filter(l => l.vendor_id).map(l => l.vendor_id),
    ...bills.map(b => b.vendor_id),
  ]).size;

  return (
    <div className="p-5 flex flex-col gap-5 overflow-y-auto h-full">
      {/* Scene header */}
      <div>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg shrink-0 bg-[rgba(99,102,241,.2)] flex items-center justify-center text-[#a5b4fc] text-[12px] font-bold">
            {scene.num}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-bold text-[#f0f2f5] leading-[1.2]">{scene.name}</div>
            <div className="text-[12px] text-gray-500 mt-[3px]">
              {[scene.location, scene.scene_type].filter(Boolean).join(' · ')}
            </div>
          </div>
          <StatusBadge status={scene.status} />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Total Budget', value: fmtShort(scene.budget), color: '#f0f2f5' },
            { label: 'Actual Amount', value: fmtShort(totalActual), color: totalActual > scene.budget ? '#f87171' : '#34d399' },
            { label: 'Total Vendors', value: String(totalVendors), color: '#a5b4fc' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[rgba(255,255,255,.04)] rounded-lg px-3 py-[10px]">
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.06em] mb-1">{label}</div>
              <div className="num text-[14px] font-bold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-[10px]">
          <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-[0.06em]">
            Budget Breakdown
          </div>
          {isLP && !addingLine && (
            <button className="btn btn-ghost btn-sm text-[11px]" onClick={() => setAddingLine(true)}>
              <Icon name="plus" size={11} /> Add Line
            </button>
          )}
        </div>

        {addingLine && (
          <div className="bg-[rgba(99,102,241,.06)] border border-[rgba(99,102,241,.2)] rounded-[10px] p-4 mb-3 flex flex-col gap-3">
            <div className="text-[12px] font-semibold text-[#a5b4fc] mb-0.5">New Budget Line</div>

            <div>
              <label className={fieldLabelCls}>Reason / Description *</label>
              <input
                className={inputCls}
                placeholder="e.g. Location rent, Equipment hire…"
                value={lineReason}
                onChange={e => setLineReason(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <label className={fieldLabelCls}>Allocated Amount (₹) *</label>
                <input
                  className={inputCls}
                  placeholder="0"
                  type="number"
                  value={lineAmount}
                  onChange={e => setLineAmount(e.target.value)}
                />
              </div>
              <div>
                <label className={fieldLabelCls}>Advance Amount (₹)</label>
                <input
                  className={inputCls}
                  placeholder="0"
                  type="number"
                  value={lineAdvance}
                  onChange={e => setLineAdvance(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={fieldLabelCls}>Vendor</label>
              <select className={`${inputCls} cursor-pointer`} value={lineVendorId} onChange={e => setLineVendorId(e.target.value)}>
                <option value="">No vendor</option>
                {vendors.map((v: Vendor) => <option key={v.id} value={v.id}>{v.name}{v.category ? ` (${v.category})` : ''}</option>)}
              </select>
            </div>

            <div>
              <label className={fieldLabelCls}>Expected Bill Date</label>
              <input
                className={inputCls}
                placeholder="YYYY-MM-DD"
                value={lineDate}
                onChange={e => setLineDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                className="btn btn-primary btn-sm flex-1 justify-center"
                onClick={handleAddLine}
              >
                <Icon name="plus" size={13} /> Add Line
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setAddingLine(false); setLineReason(''); setLineAmount(''); setLineAdvance(''); setLineDate(''); setLineVendorId(''); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {lines.length === 0 && !addingLine ? (
          <div className="text-[12px] text-gray-600 py-3">No budget lines yet</div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {lines.map(line => {
              const lineBills = bills.filter(b => b.vendor_id === line.vendor_id && line.vendor_id);
              return (
                <div key={line.id} className="bg-[rgba(255,255,255,.03)] rounded-[6px] overflow-hidden">
                  {/* Line row */}
                  <div className="flex items-center gap-2 px-[10px] py-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-[#e5e7eb] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        {line.reason}
                      </div>
                      <div className="flex gap-2 mt-0.5 flex-wrap">
                        {line.vendor_name && (
                          <span className="text-[11px] text-gray-500">{line.vendor_name}</span>
                        )}
                        {line.advance_amount > 0 && (
                          <span className="text-[11px] text-[#fbbf24]">Advance: {fmtShort(line.advance_amount)}</span>
                        )}
                        {line.bill_date && (
                          <span className="text-[11px] text-gray-500">{fmtDate(line.bill_date)}</span>
                        )}
                      </div>
                    </div>
                    <div className="num text-[12px] font-semibold text-[#f0f2f5] shrink-0">
                      {fmtShort(line.allocated_amount)}
                    </div>
                    {isLP && (
                      <button
                        className="bg-transparent border-0 cursor-pointer text-gray-600 p-0.5 hover:text-[#f87171]"
                        onClick={() => handleDeleteLine(line.id)}
                      >
                        <Icon name="x" size={11} />
                      </button>
                    )}
                  </div>

                  {/* Bill info per breakdown */}
                  {lineBills.length > 0 && lineBills.map(bill => {
                    const sc = billStatusColor(bill.status);
                    return (
                      <div key={bill.id} className="flex items-center gap-2 px-[10px] py-[6px] pl-[22px] bg-[rgba(0,0,0,.15)] border-t border-[rgba(255,255,255,.04)]">
                        <Icon name="file" size={10} className="text-gray-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] text-gray-400">
                            {bill.bill_type}{bill.bill_date ? ` · ${fmtDate(bill.bill_date)}` : ''}
                          </div>
                        </div>
                        <div className="num text-[11px] font-semibold text-[#d1d5db] shrink-0">
                          {fmtShort(bill.amount)}
                        </div>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[999px] shrink-0" style={{ background: sc.bg, color: sc.color }}>
                          {bill.status}
                        </span>
                        {isLP && bill.status === 'Pending' && (
                          <button className="btn btn-primary btn-sm text-[10px] px-[7px] py-0.5" onClick={() => handleApproveBill(bill.id)}>
                            Approve
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bills without a matching budget line */}
      {(() => {
        const lineVendorIds = new Set(lines.filter(l => l.vendor_id).map(l => l.vendor_id));
        const orphanBills = bills.filter(b => !lineVendorIds.has(b.vendor_id));
        if (orphanBills.length === 0) return null;
        return (
          <div>
            <div className="text-[12px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-[10px]">
              Other Bills ({orphanBills.length})
            </div>
            <div className="flex flex-col gap-0.5">
              {orphanBills.map(bill => {
                const sc = billStatusColor(bill.status);
                return (
                  <div key={bill.id} className="flex items-center gap-2 px-[10px] py-2 bg-[rgba(255,255,255,.03)] rounded-[6px]">
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-[#e5e7eb] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        {bill.vendor_name}
                      </div>
                      <div className="text-[11px] text-gray-500">{bill.bill_type}{bill.bill_date ? ` · ${fmtDate(bill.bill_date)}` : ''}</div>
                    </div>
                    <div className="num text-[12px] font-semibold text-[#f0f2f5] shrink-0">
                      {fmtShort(bill.amount)}
                    </div>
                    <span className="text-[10px] font-semibold px-[7px] py-0.5 rounded-[999px] shrink-0" style={{ background: sc.bg, color: sc.color }}>
                      {bill.status}
                    </span>
                    {isLP && bill.status === 'Pending' && (
                      <button className="btn btn-primary btn-sm text-[10px] px-2 py-[3px]" onClick={() => handleApproveBill(bill.id)}>
                        Approve
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
