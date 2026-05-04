"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppFrame } from '@/components/shared/app-frame';
import { Icon } from '@/components/shared/icon';
import { PageTitle } from '@/components/shared/page-title';
import { projects, bills } from '@/lib/data';
import { toast } from 'sonner';
import { fmt } from '@/lib/format';

export default function OveragePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [reason, setReason] = useState('Additional permit day required for crowd management after production extended shoot by 1 day. Location services charged extended scope. Unavoidable.');

  const overage = 140000;
  const safetyBefore = 8500000;
  const safetyAfter = safetyBefore - overage;
  const sceneBills = bills.filter(b => b.sceneId === 's7');
  const project = projects.find(p => p.id === id) || projects[0];

  return (
    <AppFrame>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, color: '#9ca3af', fontSize: 12 }}>
        <span style={{ cursor: 'pointer' }} onClick={() => router.push('/projects')}>Movies</span>
        <Icon name="chevronRight" size={12} />
        <span style={{ cursor: 'pointer' }} onClick={() => router.push(`/projects/${id}`)}>{project.name}</span>
        <Icon name="chevronRight" size={12} />
        <span style={{ color: '#fff' }}>Overage Approval</span>
      </div>
      <PageTitle title="Overage Approval" sub="Scene 07 · Crawford Market Chase" />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <div>
          <div className="card card-pad" style={{ marginBottom: 16, borderLeft: '3px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Icon name="alert" size={18} style={{ color: '#ef4444' }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Scene has exceeded its locked budget</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              {[
                { label: 'Budgeted', value: fmt(800000), color: '#111827' },
                { label: 'Actual',   value: fmt(940000), color: '#ef4444' },
                { label: 'Overage',  value: '+' + fmt(140000), color: '#ef4444', sub: '+17.5%' },
              ].map(m => (
                <div key={m.label}>
                  <div className="label">{m.label}</div>
                  <div className="num" style={{ fontSize: 20, fontWeight: 700, color: m.color }}>{m.value}</div>
                  {m.sub && <div className="num" style={{ fontSize: 11, color: m.color }}>{m.sub}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div className="label" style={{ marginBottom: 12 }}>Bills Driving the Overage</div>
            <table className="tbl" style={{ marginTop: 4 }}>
              <thead><tr>
                <th>Vendor</th><th style={{ textAlign: 'right' }}>WO</th>
                <th style={{ textAlign: 'right' }}>Billed</th><th style={{ textAlign: 'right' }}>Δ</th>
              </tr></thead>
              <tbody>
                {sceneBills.map(b => (
                  <tr key={b.id} style={{ background: b.variance > 0 ? 'rgba(239,68,68,.12)' : 'transparent' }}>
                    <td style={{ fontWeight: 500 }}>{b.vendor}</td>
                    <td className="num" style={{ textAlign: 'right' }}>{fmt(b.wo)}</td>
                    <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(b.amount)}</td>
                    <td className="num" style={{ textAlign: 'right', color: b.variance > 0 ? '#ef4444' : b.variance < 0 ? '#10b981' : '#6b7280', fontWeight: 600 }}>
                      {b.variance > 0 ? '+' : ''}{b.variance === 0 ? '0' : fmt(b.variance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card card-pad">
            <label className="label">Approval Reason (required)</label>
            <textarea className="input-box" rows={4} value={reason} onChange={e => setReason(e.target.value)} style={{ marginTop: 6 }} />
          </div>
        </div>

        <div>
          <div className="card card-pad" style={{ background: 'linear-gradient(180deg,#fffbeb 0%,#fff 100%)', borderColor: '#fde68a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Icon name="shield" size={16} style={{ color: '#b45309' }} />
              <div style={{ fontSize: 11, color: '#b45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Safety Budget Impact</div>
            </div>
            <div style={{ fontSize: 13, color: '#78350f', marginBottom: 16 }}>
              Approving draws <strong className="num">{fmt(overage)}</strong> from the Safety Budget for Sholay.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>Before</span><span className="num" style={{ fontWeight: 600 }}>{fmt(safetyBefore)}</span>
              </div>
              <div style={{ position: 'relative', height: 10, borderRadius: 999, background: '#fef3c7', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: '#fbbf24' }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '1.6%', background: '#ef4444' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>After</span><span className="num" style={{ fontWeight: 600 }}>{fmt(safetyAfter)}</span>
              </div>
              <div style={{ fontSize: 11, color: '#78350f', padding: '10px 12px', background: 'rgba(255,255,255,.6)', borderRadius: 6 }}>
                98.4% of Safety Budget remains after this draw. 4 over-budget scenes total · ₹2,80,000 drawn so far this project.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => router.push(`/projects/${id}/scenes/s7`)}>
              <Icon name="x" size={14} /> Reject
            </button>
            <button className="btn btn-primary" style={{ flex: 2 }} disabled={!reason.trim()} onClick={() => {
              toast.success('Overage approved · Safety Budget drawn');
              router.push(`/projects/${id}`);
            }}>
              <Icon name="check" size={14} /> Approve Overage
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#c4c7ce', textAlign: 'center', marginTop: 10 }}>
            Requires Line Producer sign-off · audit trail captured
          </p>
        </div>
      </div>
    </AppFrame>
  );
}
