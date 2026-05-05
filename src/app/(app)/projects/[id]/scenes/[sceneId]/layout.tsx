import { ReactNode } from 'react';

export function generateStaticParams() {
  const d1Scenes = ['d1-sc-01','d1-sc-02'];
  const d2Scenes = ['d2-sc-01','d2-sc-02'];
  return [
    ...d1Scenes.map(sceneId => ({ id: 'dhurandhar-1', sceneId })),
    ...d2Scenes.map(sceneId => ({ id: 'dhurandhar-2', sceneId })),
  ];
}

export default function SceneLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
