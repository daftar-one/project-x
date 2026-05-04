import { ReactNode } from 'react';

export function generateStaticParams() {
  const d1Scenes = ['d1-sc-01','d1-sc-02','d1-sc-03','d1-sc-04','d1-sc-05','d1-sc-06','d1-sc-07','d1-sc-08'];
  const d2Scenes = ['d2-sc-01','d2-sc-02','d2-sc-03','d2-sc-04','d2-sc-05','d2-sc-06'];
  return [
    ...d1Scenes.map(sceneId => ({ id: 'dhurandhar-1', sceneId })),
    ...d2Scenes.map(sceneId => ({ id: 'dhurandhar-2', sceneId })),
  ];
}

export default function SceneLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
