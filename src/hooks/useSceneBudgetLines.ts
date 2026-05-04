"use client";
import { useState } from "react";
import { getMockBudgetLines } from "@/lib/mock-data";
import type { SceneBudgetLine } from "@/lib/types";

export function useSceneBudgetLines(projectId: string, sceneId: string) {
  const [data] = useState<SceneBudgetLine[]>(getMockBudgetLines(projectId, sceneId));
  return { data, loading: false, error: null, refetch: () => {} };
}
