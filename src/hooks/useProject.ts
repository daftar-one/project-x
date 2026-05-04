"use client";
import { useState } from "react";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import type { ProjectWithStats } from "@/lib/types";

export function useProject(id: string) {
  const project = MOCK_PROJECTS.find(p => p.id === id) ?? null;
  const [data] = useState<ProjectWithStats | null>(project);
  return { data, loading: false, error: null, refetch: () => {} };
}
