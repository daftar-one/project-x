"use client";

import { useRouter, useParams } from 'next/navigation';

import { AppFrame } from '@/components/shared/app-frame';
import { Icon } from '@/components/shared/icon';
import { PageTitle } from '@/components/shared/page-title';
import { projects, scenes } from '@/lib/data';
import { fmt, fmtShort } from '@/lib/format';

function Stat({ label, value, sub, tone, border }: { label: string; value: string; sub?: string; tone?: 'over' | 'ok'; border?: boolean }) {
  const color = tone === 'over' ? '#ef4444' : tone === 'ok' ? '#10b981' : '#111827';
  return (
    <div className="p-[18px]" style={{ borderLeft: border ? '1px solid #e5e7eb' : '0' }}>
      <div className="label">{label}</div>
      <div className="num text-[20px] font-bold mt-1 tracking-[-0.02em]" style={{ color }}>{value}</div>
      {sub && <div className="num text-[11px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function ClosurePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const p = projects.find(proj => proj.id === id) || projects[0];
  const finalCost = 82800000;
  const variance = finalCost - p.totalBudget;

  return (
    <AppFrame>
      <PageTitle title={`Movie Closure · ${p.name}`} sub="All 42 scenes wrapped. All bills settled. Ready to archive." />

      <div className="card text-center py-10 px-6 mb-5">
        <div className="w-16 h-16 rounded-[16px] mx-auto mb-[18px] bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white">
          <Icon name="check" size={32} stroke={2} />
        </div>
        <h2 className="m-0 text-[22px] font-semibold tracking-[-0.02em]">Shoot wrapped — congratulations.</h2>
        <p className="mt-[6px] mb-0 text-gray-500 text-[13px]">
          Jan 14 → Apr 18, 2026 · 95 days · 42 scenes · 58 vendors · 186 bills settled
        </p>
        <div className="grid grid-cols-4 mt-[30px] border border-[#e5e7eb] rounded-[10px] overflow-hidden">
          <Stat label="Budget"         value={fmtShort(p.totalBudget)} />
          <Stat label="Final Cost"     value={fmtShort(finalCost)} border />
          <Stat label="Final Variance" value={(variance < 0 ? '−' : '+') + fmtShort(Math.abs(variance))} tone={variance < 0 ? 'ok' : 'over'} border />
          <Stat label="Safety Used"    value="33%" sub="₹2.8 L of ₹8.5 L" border />
        </div>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-4">
        <div className="card card-pad">
          <div className="label mb-3">Scene-by-Scene Summary</div>
          <table className="tbl">
            <thead><tr>
              <th>Scene</th>
              <th className="text-right">Budget</th>
              <th className="text-right">Actual</th>
              <th>Variance</th>
            </tr></thead>
            <tbody>
              {scenes.slice(0, 8).map(s => {
                const actual = s.actual ?? s.budget * 0.95;
                const v = actual - s.budget;
                return (
                  <tr key={s.id}>
                    <td><div className="font-semibold text-[12px]">{s.num} · {s.name}</div></td>
                    <td className="num text-right">{fmtShort(s.budget)}</td>
                    <td className="num text-right font-semibold">{fmtShort(actual)}</td>
                    <td className="num font-semibold text-[12px]" style={{ color: v > 0 ? '#ef4444' : '#10b981' }}>
                      {v > 0 ? '+' : ''}{Math.round(v / s.budget * 100)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card card-pad">
          <div className="label mb-3">Top 5 Vendors by Spend</div>
          {[
            { v: 'Aperture Camera Rentals',  amt: 4820000 },
            { v: 'Mumbai Location Services', amt: 3240000 },
            { v: 'Chhaya Catering Co.',      amt: 2180000 },
            { v: 'Setworks Art Dept.',       amt: 1940000 },
            { v: 'Bolt Action Stunts',       amt: 1720000 },
          ].map((r, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-[12px] mb-[5px]">
                <span className="font-medium">{i + 1}. {r.v}</span>
                <span className="num font-semibold">{fmtShort(r.amt)}</span>
              </div>
              <div className="h-1 bg-[rgba(255,255,255,.1)] rounded-[999px] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#a5b4fc]" style={{ width: (100 - i * 12) + '%' }} />
              </div>
            </div>
          ))}

          <div className="mt-6 p-[14px] bg-[rgba(255,255,255,.05)] rounded-lg">
            <div className="label">What happens on close?</div>
            <ul className="mt-2 mb-0 pl-[18px] text-[12px] text-gray-500 leading-[1.6]">
              <li>Movie moves to Archived state (read-only)</li>
              <li>Full audit trail + reports locked</li>
              <li>Vendor links deactivated</li>
              <li>Team access preserved for 180 days</li>
            </ul>
          </div>

          <button className="btn btn-primary btn-full mt-4" onClick={() => router.push('/dashboard')}>
            <Icon name="archive" size={14} /> Close & Archive Project
          </button>
        </div>
      </div>
    </AppFrame>
  );
}
