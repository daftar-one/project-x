"use client";
import { useState } from "react";
import type { TeamMember } from "@/lib/types";

const MOCK_TEAM: TeamMember[] = [];

export function useTeam(_projectId: string) {
  const [data] = useState<TeamMember[]>(MOCK_TEAM);
  return { data, loading: false, error: null, refetch: () => {} };
}
