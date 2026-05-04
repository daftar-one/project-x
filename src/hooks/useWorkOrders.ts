"use client";
import { useState } from "react";
import type { WorkOrder } from "@/lib/types";

export function useWorkOrders(_projectId: string, _sceneId: string) {
  const [data] = useState<WorkOrder[]>([]);
  return { data, loading: false, error: null, refetch: () => {} };
}
