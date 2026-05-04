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
    <div style={{ padding: 18, borderLeft: border ? '1px solid #e5e7eb' : '0' }}>
      <div className="label">{label}</div>
      <div className="num" style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color, letterSpacing: '-.02em' }}>{value}</div>
      {sub && <div className="num" style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{sub}</div>}
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

      <div className="card card-pad" style={{ marginBottom: 20, textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 18px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Icon name="check" size={32} stroke={2} />
        </div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em' }}>Shoot wrapped — congratulations.</h2>
        <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 13 }}>
          Jan 14 → Apr 18, 2026 · 95 days · 42 scenes · 58 vendors · 186 bills settled
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginTop: 30, border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
          <Stat label="Budget"         value={fmtShort(p.totalBudget)} />
          <Stat label="Final Cost"     value={fmtShort(finalCost)} border />
          <Stat label="Final Variance" value={(variance < 0 ? '−' : '+') + fmtShort(Math.abs(variance))} tone={variance < 0 ? 'ok' : 'over'} border />
          <Stat label="Safety Used"    value="33%" sub="₹2.8 L of ₹8.5 L" border />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16 }}>
        <div className="card card-pad">
          <div className="label" style={{ marginBottom: 12 }}>Scene-by-Scene Summary</div>
          <table className="tbl">
            <thead><tr>
              <th>Scene</th>
              <th style={{ textAlign: 'right' }}>Budget</th>
              <th style={{ textAlign: 'right' }}>Actual</th>
              <th>Variance</th>
            </tr></thead>
            <tbody>
              {scenes.slice(0, 8).map(s => {
                const actual = s.actual ?? s.budget * 0.95;
                const v = actual - s.budget;
                return (
                  <tr key={s.id}>
                    <td><div style={{ fontWeight: 600, fontSize: 12 }}>{s.num} · {s.name}</div></td>
                    <td className="num" style={{ textAlign: 'right' }}>{fmtShort(s.budget)}</td>
                    <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>{fmtShort(actual)}</td>
                    <td className="num" style={{ color: v > 0 ? '#ef4444' : '#10b981', fontWeight: 600, fontSize: 12 }}>
                      {v > 0 ? '+' : ''}{Math.round(v / s.budget * 100)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card card-pad">
          <div className="label" style={{ marginBottom: 12 }}>Top 5 Vendors by Spend</div>
          {[
            { v: 'Aperture Camera Rentals',  amt: 4820000 },
            { v: 'Mumbai Location Services', amt: 3240000 },
            { v: 'Chhaya Catering Co.',      amt: 2180000 },
            { v: 'Setworks Art Dept.',       amt: 1940000 },
            { v: 'Bolt Action Stunts',       amt: 1720000 },
          ].map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ fontWeight: 500 }}>{i + 1}. {r.v}</span>
                <span className="num" style={{ fontWeight: 600 }}>{fmtShort(r.amt)}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,.1)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: (100 - i * 12) + '%', height: '100%', background: 'linear-gradient(90deg,#6366f1,#a5b4fc)' }} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, padding: 14, background: 'rgba(255,255,255,.05)', borderRadius: 8 }}>
            <div className="label">What happens on close?</div>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
              <li>Movie moves to Archived state (read-only)</li>
              <li>Full audit trail + reports locked</li>
              <li>Vendor links deactivated</li>
              <li>Team access preserved for 180 days</li>
            </ul>
          </div>

          <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={() => router.push('/dashboard')}>
            <Icon name="archive" size={14} /> Close & Archive Project
          </button>
        </div>
      </div>
    </AppFrame>
  );
}
