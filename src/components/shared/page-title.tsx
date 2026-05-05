"use client";
import { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  sub?: string;
  right?: ReactNode;
}

export function PageTitle({ title, sub, right }: PageTitleProps) {
  return (
    <div className="flex items-end mb-5 gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <h1 className="text-[22px] font-semibold m-0 tracking-[-0.02em] text-[#f0f2f5]">{title}</h1>
        {sub && <div className="text-[13px] text-gray-500 mt-1">{sub}</div>}
      </div>
      {right}
    </div>
  );
}
