"use client";
import { useState } from "react";
import type { AuditTrail } from "@/lib/types";

export function useAuditTrail(_projectId: string, _sceneId: string) {
  const [data] = useState<AuditTrail[]>([]);
  return { data, loading: false, error: null, refetch: () => {} };
}
