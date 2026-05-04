"use client";
import { useState } from "react";
import { PH_WALLET, PROJECT_WALLETS, getMockSceneWallet } from "@/lib/mock-data";
import type { Wallet } from "@/lib/types";

export function usePHWallet() {
  const [data] = useState<Wallet>(PH_WALLET);
  return { data, loading: false, error: null, refetch: () => {} };
}

export function useProjectWallet(projectId: string) {
  const [data] = useState<Wallet | null>(PROJECT_WALLETS[projectId] ?? null);
  return { data, loading: false, error: null, refetch: () => {} };
}

export function useSceneWallet(projectId: string, sceneId: string | null) {
  const [data] = useState<Wallet | null>(sceneId ? getMockSceneWallet(sceneId) : null);
  return { data, loading: false, error: null, refetch: () => {} };
}
