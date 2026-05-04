"use client";

interface BudgetBarProps {
  budget: number;
  actual: number;
  height?: number;
}

export function BudgetBar({ budget, actual, height = 6 }: BudgetBarProps) {
  const pct = budget > 0 ? Math.min((actual / budget) * 100, 140) : 0;
  const displayPct = Math.min(pct, 100);
  const over = pct > 100;
  const warn = pct > 85 && pct <= 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="progress" style={{ height }}>
        <div
          className={`progress-fill${over ? ' over' : warn ? ' warn' : ''}`}
          style={{ width: displayPct + '%' }}
        />
        {over && (
          <div style={{
            position: 'absolute', top: 0, right: 0, height: '100%',
            width: Math.min(pct - 100, 40) + '%',
            background: 'repeating-linear-gradient(45deg,#ef4444,#ef4444 3px,#fca5a5 3px,#fca5a5 6px)',
            borderRadius: 999,
          }} />
        )}
      </div>
    </div>
  );
}
