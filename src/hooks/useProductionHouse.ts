"use client";
import { useState } from "react";
import type { ProductionHouse } from "@/lib/types";

const MOCK_PH: ProductionHouse = {
  id: "ph-1",
  name: "My Production House",
  logo_url: null,
  created_by: "u-1",
  created_at: "2025-01-01T00:00:00Z",
};

export function useProductionHouse() {
  const [data] = useState<ProductionHouse>(MOCK_PH);
  return { data, loading: false, error: null, refetch: () => {} };
}
