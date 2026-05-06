"use client";
import { useMemo } from "react";
import type { ProductionHouse } from "@/lib/types";
import { useAuthStore } from "@/store/auth";

const MOCK_PH: ProductionHouse = {
  id: "ph-1",
  name: "Studio One Films",
  brand_name: "SOF Entertainment",
  logo_url: null,
  created_by: "u-1",
  created_at: "2025-01-01T00:00:00Z",
};

export function useProductionHouse() {
  const customName = useAuthStore(s => s.production_house_name);
  const data = useMemo<ProductionHouse>(
    () => customName ? { ...MOCK_PH, name: customName, brand_name: customName } : MOCK_PH,
    [customName]
  );
  return { data, loading: false, error: null, refetch: () => {} };
}
