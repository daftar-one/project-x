"use client";
import { useState } from "react";
import type { Collaborator } from "@/lib/types";

export function useCollaborators(_projectId: string) {
  const [data] = useState<Collaborator[]>([]);
  return { data, loading: false };
}
