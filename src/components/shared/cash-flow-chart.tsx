"use client";

import { useRef, useState, useEffect } from 'react';
import { fmtShort } from '@/lib/format';

type Timeframe = 'monthly' | 'weekly';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatPeriodLabel(period: string, timeframe: Timeframe): string {
  if (timeframe === 'monthly') {
    const [, mon] = period.split('-');
    return MONTH_LABELS[parseInt(mon, 10) - 1] ?? period;
  }
  const d = new Date(period + 'T00:00:00');
  return `${MONTH_LABELS[d.getMonth()]} ${d.getDate()}`;
}

interface Props {
  periods: string[];
  planned: number[];
  actual: number[];
  timeframe: Timeframe;
  onTimeframeChange: (t: Timeframe) => void;
  height?: number;
}

function getDummyData(timeframe: Timeframe): { periods: string[]; planned: number[]; actual: number[] } {
  const now = new Date();
  if (timeframe === 'weekly') {
    const periods: string[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7 - d.getDay() + 1);
      periods.push(d.toISOString().slice(0, 10));
    }
    return {
      periods,
      planned: [320000, 480000, 410000, 560000, 390000, 620000, 510000, 450000],
      actual:  [290000, 520000, 380000, 490000, 430000, 580000, 470000, 410000],
    };
  }
  const periods: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return {
    periods,
    planned: [1200000, 1800000, 1500000, 2100000, 1700000, 2400000],
    actual:  [1050000, 1950000, 1380000, 1860000, 1920000, 2200000],
  };
}

export function CashFlowChart({ periods, planned, actual, timeframe, onTimeframeChange, height = 220 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dummy = getDummyData(timeframe);
  const displayPeriods = periods.length > 0 ? periods : dummy.periods;
  const displayPlanned = planned.length > 0 ? planned : dummy.planned;
  const displayActual  = actual.length  > 0 ? actual  : dummy.actual;

  const maxVal = Math.max(...displayPlanned, ...displayActual, 1);

  const PAD_L = 52;
  const PAD_R = 12;
  const PAD_T = 12;
  const PAD_B = 28;
  const H = height;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const cols = Math.max(displayPeriods.length, 1);
  const colW = chartW / cols;

  function yVal(val: number) {
    return PAD_T + chartH * (1 - val / maxVal);
  }

  function xPos(i: number) {
    return PAD_L + colW * i + colW / 2;
  }

  function pathD(vals: number[]) {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${xPos(i)},${yVal(v)}`).join(' ');
  }

  function areaD(vals: number[]) {
    const base = PAD_T + chartH;
    return `${pathD(vals)} L${xPos(cols - 1)},${base} L${xPos(0)},${base} Z`;
  }

  const labels = displayPeriods.map(p => formatPeriodLabel(p, timeframe));

  const yGridValues = [0.25, 0.5, 0.75, 1].map(f => ({
    f,
    label: fmtShort(maxVal * f),
    y: PAD_T + chartH * (1 - f),
  }));

  const btnBase: React.CSSProperties = {
    padding: '3px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
    fontSize: 11, fontWeight: 600, transition: 'background .12s, color .12s',
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header: title + toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div className="label" style={{ marginBottom: 2 }}>Planned vs Actual Expenses</div>
          {/* <div style={{ fontSize: 11, color: '#6b7280' }}>
            {timeframe === 'monthly' ? 'Last 6 months' : 'Last 8 weeks'}
          </div> */}
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.06)', borderRadius: 7, padding: 3 }}>
          {(['monthly', 'weekly'] as Timeframe[]).map(t => (
            <button
              key={t}
              onClick={() => onTimeframeChange(t)}
              style={{
                ...btnBase,
                background: timeframe === t ? 'rgba(99,102,241,.25)' : 'transparent',
                color: timeframe === t ? '#a5b4fc' : '#6b7280',
              }}
            >
              {t === 'monthly' ? 'Monthly' : 'Weekly'}
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} style={{ width: '100%' }}>
        <svg width={W} height={H} style={{ display: 'block' }}>
          {/* y-axis grid lines + labels */}
          {yGridValues.map(({ f, label, y }) => (
            <g key={f}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(255,255,255,.06)" strokeWidth="1" />
              <text x={PAD_L - 6} y={y + 4} textAnchor="end" fill="#4b5563" fontSize="11" fontFamily="ui-sans-serif,sans-serif">
                {label}
              </text>
            </g>
          ))}

          {/* Planned area + line */}
          <path d={areaD(displayPlanned)} fill="rgba(52,211,153,.08)" />
          <path d={pathD(displayPlanned)} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />

          {/* Actual area + line */}
          <path d={areaD(displayActual)} fill="rgba(248,113,113,.07)" />
          <path d={pathD(displayActual)} fill="none" stroke="#f87171" strokeWidth="2" strokeLinejoin="round" />

          {/* Data points */}
          {displayPlanned.map((v, i) => v > 0 && (
            <circle key={`p${i}`} cx={xPos(i)} cy={yVal(v)} r="3" fill="#34d399" />
          ))}
          {displayActual.map((v, i) => v > 0 && (
            <circle key={`a${i}`} cx={xPos(i)} cy={yVal(v)} r="3" fill="#f87171" />
          ))}

          {/* x-axis labels */}
          {labels.map((label, i) => (
            <text key={i} x={xPos(i)} y={H - 6} textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="ui-sans-serif,sans-serif">
              {label}
            </text>
          ))}

          {/* x-axis baseline */}
          <line x1={PAD_L} y1={PAD_T + chartH} x2={W - PAD_R} y2={PAD_T + chartH} stroke="rgba(255,255,255,.1)" strokeWidth="1" />
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 2, background: '#34d399', borderRadius: 1 }} />
          <span style={{ fontSize: 12, color: '#6b7280' }}>Planned</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 2, background: '#f87171', borderRadius: 1 }} />
          <span style={{ fontSize: 12, color: '#6b7280' }}>Actual</span>
        </div>
      </div>
    </div>
  );
}
