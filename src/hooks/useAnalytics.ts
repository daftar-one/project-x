"use client";
import { useState } from "react";
import type { AnalyticsData } from "@/lib/types";

export function useAnalytics(_projectId: string) {
  const [data] = useState<AnalyticsData | null>(null);
  return { data, loading: false, error: null, refetch: () => {} };
}
