"use client";
import { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  sub?: string;
  right?: ReactNode;
}

export function PageTitle({ title, sub, right }: PageTitleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-.02em', color: '#f0f2f5' }}>{title}</h1>
        {sub && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}
