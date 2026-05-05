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
    <div className="card card-pad flex-1 min-w-0" style={{ borderColor: t?.border, background: t?.bg }}>
      <div className="flex items-center gap-2 mb-[10px]">
        {icon && <Icon name={icon} size={14} style={{ color: t?.color ?? '#6b7280' }} />}
        <div className="label mb-0" style={{ color: t?.color ?? '#6b7280' }}>{label}</div>
      </div>
      <div className="num text-[22px] font-semibold tracking-[-0.02em]" style={{ color: t?.color ?? '#f0f2f5' }}>{value}</div>
      {sub && <div className="num text-[12px] text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}
