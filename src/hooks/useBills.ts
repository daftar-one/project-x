"use client";
import { useState } from "react";
import { getMockBills } from "@/lib/mock-data";
import type { Bill } from "@/lib/types";

export function useBills(status?: string) {
  const [data] = useState<Bill[]>(getMockBills(status));
  return { data, loading: false, error: null, refetch: () => {} };
}
