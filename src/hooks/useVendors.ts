"use client";
import { useState } from "react";
import { getMockVendors } from "@/lib/mock-data";
import type { Vendor } from "@/lib/types";

export function useVendors() {
  const [data] = useState<Vendor[]>(getMockVendors());
  return { data, loading: false, error: null, refetch: () => {} };
}
