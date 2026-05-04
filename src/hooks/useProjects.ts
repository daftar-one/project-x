"use client";
import { useState } from "react";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import type { ProjectWithStats } from "@/lib/types";

export function useProjects() {
  const [data] = useState<ProjectWithStats[]>(MOCK_PROJECTS);
  return { data, loading: false, error: null, refetch: () => {} };
}
