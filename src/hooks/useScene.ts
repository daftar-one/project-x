"use client";
import { useState } from "react";
import { MOCK_SCENES } from "@/lib/mock-data";
import type { SceneWithActual } from "@/lib/types";

export function useScene(projectId: string, sceneId: string) {
  const scenes = MOCK_SCENES[projectId] ?? [];
  const scene = scenes.find(s => s.id === sceneId) ?? null;
  const [data] = useState<SceneWithActual | null>(scene);
  return { data, loading: false, error: null, refetch: () => {} };
}
