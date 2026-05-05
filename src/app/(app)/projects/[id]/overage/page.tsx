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
      <div className="flex items-center gap-[10px] mb-[6px] text-gray-400 text-[12px]">
        <span className="cursor-pointer" onClick={() => router.push('/projects')}>Movies</span>
        <Icon name="chevronRight" size={12} />
        <span className="cursor-pointer" onClick={() => router.push(`/projects/${id}`)}>{project.name}</span>
        <Icon name="chevronRight" size={12} />
        <span className="text-white">Overage Approval</span>
      </div>
      <PageTitle title="Overage Approval" sub="Scene 07 · Crawford Market Chase" />

      <div className="grid grid-cols-[1.4fr_1fr] gap-5">
        <div>
          <div className="card card-pad mb-4" style={{ borderLeft: '3px solid #ef4444' }}>
            <div className="flex items-center gap-[10px] mb-[14px]">
              <Icon name="alert" size={18} style={{ color: '#ef4444' }} />
              <div className="text-[14px] font-semibold">Scene has exceeded its locked budget</div>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {[
                { label: 'Budgeted', value: fmt(800000), color: '#111827' },
                { label: 'Actual',   value: fmt(940000), color: '#ef4444' },
                { label: 'Overage',  value: '+' + fmt(140000), color: '#ef4444', sub: '+17.5%' },
              ].map(m => (
                <div key={m.label}>
                  <div className="label">{m.label}</div>
                  <div className="num text-[20px] font-bold" style={{ color: m.color }}>{m.value}</div>
                  {m.sub && <div className="num text-[11px]" style={{ color: m.color }}>{m.sub}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad mb-4">
            <div className="label mb-3">Bills Driving the Overage</div>
            <table className="tbl mt-1">
              <thead><tr>
                <th>Vendor</th><th className="text-right">WO</th>
                <th className="text-right">Billed</th><th className="text-right">Δ</th>
              </tr></thead>
              <tbody>
                {sceneBills.map(b => (
                  <tr key={b.id} style={{ background: b.variance > 0 ? 'rgba(239,68,68,.12)' : 'transparent' }}>
                    <td className="font-medium">{b.vendor}</td>
                    <td className="num text-right">{fmt(b.wo)}</td>
                    <td className="num text-right font-semibold">{fmt(b.amount)}</td>
                    <td className="num text-right font-semibold" style={{ color: b.variance > 0 ? '#ef4444' : b.variance < 0 ? '#10b981' : '#6b7280' }}>
                      {b.variance > 0 ? '+' : ''}{b.variance === 0 ? '0' : fmt(b.variance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card card-pad">
            <label className="label">Approval Reason (required)</label>
            <textarea className="input-box mt-[6px]" rows={4} value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="card card-pad" style={{ background: 'linear-gradient(180deg,#fffbeb 0%,#fff 100%)', borderColor: '#fde68a' }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="shield" size={16} style={{ color: '#b45309' }} />
              <div className="text-[11px] text-[#b45309] font-bold uppercase tracking-[.08em]">Safety Budget Impact</div>
            </div>
            <div className="text-[13px] text-[#78350f] mb-4">
              Approving draws <strong className="num">{fmt(overage)}</strong> from the Safety Budget for Sholay.
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[12px]">
                <span>Before</span><span className="num font-semibold">{fmt(safetyBefore)}</span>
              </div>
              <div className="relative h-[10px] rounded-[999px] bg-[#fef3c7] overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-full bg-[#fbbf24]" />
                <div className="absolute right-0 top-0 bottom-0 w-[1.6%] bg-[#ef4444]" />
              </div>
              <div className="flex justify-between text-[12px]">
                <span>After</span><span className="num font-semibold">{fmt(safetyAfter)}</span>
              </div>
              <div className="text-[11px] text-[#78350f] py-[10px] px-3 bg-[rgba(255,255,255,.6)] rounded-[6px]">
                98.4% of Safety Budget remains after this draw. 4 over-budget scenes total · ₹2,80,000 drawn so far this project.
              </div>
            </div>
          </div>

          <div className="flex gap-[10px] mt-4">
            <button className="btn btn-secondary flex-1" onClick={() => router.push(`/projects/${id}/scenes/s7`)}>
              <Icon name="x" size={14} /> Reject
            </button>
            <button className="btn btn-primary [flex:2]" disabled={!reason.trim()} onClick={() => {
              toast.success('Overage approved · Safety Budget drawn');
              router.push(`/projects/${id}`);
            }}>
              <Icon name="check" size={14} /> Approve Overage
            </button>
          </div>
          <p className="text-[11px] text-[#c4c7ce] text-center mt-[10px]">
            Requires Line Producer sign-off · audit trail captured
          </p>
        </div>
      </div>
    </AppFrame>
  );
}
