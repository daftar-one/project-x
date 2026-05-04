"use client";
import { useState } from "react";
import type { ExpenseTimeline } from "@/lib/types";

export type Timeframe = "weekly" | "monthly";

export function useExpenseTimeline(
  _scope: "project" | "ph",
  _id: string,
  _timeframe: Timeframe
) {
  const [data] = useState<ExpenseTimeline | null>(null);
  return { data, loading: false };
}
