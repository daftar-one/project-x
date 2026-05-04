"use client";
import { useState } from "react";
import { getMockSceneBills } from "@/lib/mock-data";
import type { Bill } from "@/lib/types";

export function useSceneBills(projectId: string, sceneId: string) {
  const [data] = useState<Bill[]>(getMockSceneBills(sceneId));
  return { data, loading: false, error: null, refetch: () => {} };
}
