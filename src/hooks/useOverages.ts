"use client";
import { useState } from "react";
import type { OverageRequest } from "@/lib/types";

export function useOverages(_projectId: string) {
  const [data] = useState<OverageRequest[]>([]);
  return { data, loading: false, error: null, refetch: () => {} };
}
