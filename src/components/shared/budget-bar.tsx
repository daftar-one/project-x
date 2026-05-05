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
    <div className="flex flex-col gap-1">
      <div className="progress" style={{ height }}>
        <div
          className={`progress-fill${over ? ' over' : warn ? ' warn' : ''}`}
          style={{ width: displayPct + '%' }}
        />
        {over && (
          <div
            className="absolute top-0 right-0 h-full rounded-[999px]"
            style={{
              width: Math.min(pct - 100, 40) + '%',
              background: 'repeating-linear-gradient(45deg,#ef4444,#ef4444 3px,#fca5a5 3px,#fca5a5 6px)',
            }}
          />
        )}
      </div>
    </div>
  );
}
