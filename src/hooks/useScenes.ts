"use client";
import { useState } from "react";
import { MOCK_SCENES } from "@/lib/mock-data";
import type { SceneWithActual } from "@/lib/types";

export function useScenes(projectId: string) {
  const [data] = useState<SceneWithActual[]>(MOCK_SCENES[projectId] ?? []);
  return { data, loading: false, error: null, refetch: () => {} };
}
