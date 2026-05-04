import { ReactNode } from 'react';

export function generateStaticParams() {
  return [{ id: 'dhurandhar-1' }, { id: 'dhurandhar-2' }];
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
