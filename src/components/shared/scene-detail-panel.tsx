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

export function SceneDetailPanel({ projectId, sceneId, isLP, onSceneUpdated }: SceneDetailPanelProps) {
  const { data: scene } = useScene(projectId, sceneId);
  const { data: bills } = useSceneBills(projectId, sceneId);
  const { data: lines } = useSceneBudgetLines(projectId, sceneId);
  const { data: vendors } = useVendors();

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#4b5563', fontSize: 13 }}>
        Loading scene…
      </div>
    );
  }

  const totalActual = bills.reduce((a, b) => a + b.amount, 0);
  const totalVendors = new Set([
    ...lines.filter(l => l.vendor_id).map(l => l.vendor_id),
    ...bills.map(b => b.vendor_id),
  ]).size;

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 7, padding: '8px 12px', color: '#f0f2f5', fontSize: 13,
    outline: 'none', width: '100%', boxSizing: 'border-box',
    transition: 'border-color .15s, box-shadow .15s',
  };
  const fieldLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase',
    letterSpacing: '.07em', marginBottom: 5, display: 'block',
  };

  const billStatusColor = (status: string) => {
    if (status === 'Paid') return { bg: 'rgba(99,102,241,.15)', color: '#a5b4fc' };
    if (status === 'Approved') return { bg: 'rgba(16,185,129,.15)', color: '#34d399' };
    if (status === 'Rejected') return { bg: 'rgba(239,68,68,.15)', color: '#f87171' };
    return { bg: 'rgba(245,158,11,.15)', color: '#fbbf24' };
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', height: '100%' }}>
      {/* Scene header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: 'rgba(99,102,241,.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#a5b4fc', fontSize: 12, fontWeight: 700,
          }}>{scene.num}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f2f5', lineHeight: 1.2 }}>{scene.name}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>
              {[scene.location, scene.scene_type].filter(Boolean).join(' · ')}
            </div>
          </div>
          <StatusBadge status={scene.status} />
        </div>

        {/* KPIs: Total Budget, Actual Amount, Total Vendors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Total Budget', value: fmtShort(scene.budget), color: '#f0f2f5' },
            { label: 'Actual Amount', value: fmtShort(totalActual), color: totalActual > scene.budget ? '#f87171' : '#34d399' },
            { label: 'Total Vendors', value: String(totalVendors), color: '#a5b4fc' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{label}</div>
              <div className="num" style={{ fontSize: 14, fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Budget Breakdown */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Budget Breakdown
          </div>
          {isLP && !addingLine && (
            <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => setAddingLine(true)}>
              <Icon name="plus" size={11} /> Add Line
            </button>
          )}
        </div>

        {addingLine && (
          <div style={{
            background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.2)',
            borderRadius: 10, padding: 16, marginBottom: 12,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#a5b4fc', marginBottom: 2 }}>New Budget Line</div>

            <div>
              <label style={fieldLabel}>Reason / Description *</label>
              <input
                style={inputStyle}
                placeholder="e.g. Location rent, Equipment hire…"
                value={lineReason}
                onChange={e => setLineReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={fieldLabel}>Allocated Amount (₹) *</label>
                <input
                  style={inputStyle}
                  placeholder="0"
                  type="number"
                  value={lineAmount}
                  onChange={e => setLineAmount(e.target.value)}
                />
              </div>
              <div>
                <label style={fieldLabel}>Advance Amount (₹)</label>
                <input
                  style={inputStyle}
                  placeholder="0"
                  type="number"
                  value={lineAdvance}
                  onChange={e => setLineAdvance(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={fieldLabel}>Vendor</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={lineVendorId} onChange={e => setLineVendorId(e.target.value)}>
                <option value="">No vendor</option>
                {vendors.map((v: Vendor) => <option key={v.id} value={v.id}>{v.name}{v.category ? ` (${v.category})` : ''}</option>)}
              </select>
            </div>

            <div>
              <label style={fieldLabel}>Expected Bill Date</label>
              <input
                style={inputStyle}
                placeholder="YYYY-MM-DD"
                value={lineDate}
                onChange={e => setLineDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleAddLine}
              >
                <><Icon name="plus" size={13} /> Add Line</>
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
          <div style={{ fontSize: 12, color: '#4b5563', padding: '12px 0' }}>No budget lines yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {lines.map(line => {
              const lineBills = bills.filter(b => b.vendor_id === line.vendor_id && line.vendor_id);
              return (
                <div key={line.id} style={{
                  background: 'rgba(255,255,255,.03)', borderRadius: 6, overflow: 'hidden',
                }}>
                  {/* Line row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: '#e5e7eb', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {line.reason}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                        {line.vendor_name && (
                          <span style={{ fontSize: 11, color: '#6b7280' }}>{line.vendor_name}</span>
                        )}
                        {line.advance_amount > 0 && (
                          <span style={{ fontSize: 11, color: '#fbbf24' }}>Advance: {fmtShort(line.advance_amount)}</span>
                        )}
                        {line.bill_date && (
                          <span style={{ fontSize: 11, color: '#6b7280' }}>{fmtDate(line.bill_date)}</span>
                        )}
                      </div>
                    </div>
                    <div className="num" style={{ fontSize: 12, fontWeight: 600, color: '#f0f2f5', flexShrink: 0 }}>
                      {fmtShort(line.allocated_amount)}
                    </div>
                    {isLP && (
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: 2 }}
                        onClick={() => handleDeleteLine(line.id)}
                        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
                      >
                        <Icon name="x" size={11} />
                      </button>
                    )}
                  </div>

                  {/* Bill info per breakdown (when vendor matches) */}
                  {lineBills.length > 0 && lineBills.map(bill => {
                    const sc = billStatusColor(bill.status);
                    return (
                      <div key={bill.id} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px 6px 22px',
                        background: 'rgba(0,0,0,.15)',
                        borderTop: '1px solid rgba(255,255,255,.04)',
                      }}>
                        <Icon name="file" size={10} style={{ color: '#4b5563', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>
                            {bill.bill_type}{bill.bill_date ? ` · ${fmtDate(bill.bill_date)}` : ''}
                          </div>
                        </div>
                        <div className="num" style={{ fontSize: 11, fontWeight: 600, color: '#d1d5db', flexShrink: 0 }}>
                          {fmtShort(bill.amount)}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 999, background: sc.bg, color: sc.color, flexShrink: 0 }}>
                          {bill.status}
                        </span>
                        {isLP && bill.status === 'Pending' && (
                          <button className="btn btn-primary btn-sm" style={{ fontSize: 10, padding: '2px 7px' }} onClick={() => handleApproveBill(bill.id)}>
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
            <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
              Other Bills ({orphanBills.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {orphanBills.map(bill => {
                const sc = billStatusColor(bill.status);
                return (
                  <div key={bill.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                    background: 'rgba(255,255,255,.03)', borderRadius: 6,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: '#e5e7eb', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {bill.vendor_name}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{bill.bill_type}{bill.bill_date ? ` · ${fmtDate(bill.bill_date)}` : ''}</div>
                    </div>
                    <div className="num" style={{ fontSize: 12, fontWeight: 600, color: '#f0f2f5', flexShrink: 0 }}>
                      {fmtShort(bill.amount)}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, background: sc.bg, color: sc.color, flexShrink: 0 }}>
                      {bill.status}
                    </span>
                    {isLP && bill.status === 'Pending' && (
                      <button className="btn btn-primary btn-sm" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => handleApproveBill(bill.id)}>
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
