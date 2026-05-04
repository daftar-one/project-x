"use client";
import { Icon } from './icon';

type Tone = 'over' | 'warn' | 'ok' | 'info';

const TONE_MAP: Record<Tone, { bg: string; border: string; color: string }> = {
  over:  { bg: 'rgba(239,68,68,.15)',   border: 'rgba(239,68,68,.3)',   color: '#f87171' },
  warn:  { bg: 'rgba(245,158,11,.15)',  border: 'rgba(245,158,11,.3)',  color: '#fbbf24' },
  ok:    { bg: 'rgba(16,185,129,.15)',  border: 'rgba(16,185,129,.3)',  color: '#34d399' },
  info:  { bg: 'rgba(99,102,241,.15)', border: 'rgba(99,102,241,.3)', color: '#818cf8' },
};

interface KPIProps {
  label: string;
  value: string | number;
  sub?: string;
  tone?: Tone;
  icon?: string;
}

export function KPI({ label, value, sub, tone, icon }: KPIProps) {
  const t = tone ? TONE_MAP[tone] : undefined;
  return (
    <div className="card card-pad" style={{
      borderColor: t?.border,
      background: t?.bg,
      flex: 1, minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {icon && <Icon name={icon} size={14} style={{ color: t?.color ?? '#6b7280' }} />}
        <div className="label" style={{ marginBottom: 0, color: t?.color ?? '#6b7280' }}>{label}</div>
      </div>
      <div className="num" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', color: t?.color ?? '#f0f2f5' }}>{value}</div>
      {sub && <div className="num" style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
