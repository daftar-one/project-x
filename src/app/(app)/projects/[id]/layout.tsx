import { ReactNode } from 'react';

export function generateStaticParams() {
  return [{ id: 'tvf-pitchers' }, { id: 'permanent-roommates' }];
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
