"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

export default function AppLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore(s => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || !user.is_onboarded) {
      useAuthStore.getState().setAuth({
        id: "u-1",
        email: "demo@projectx.in",
        full_name: "Demo User",
        role: "line_producer",
        is_onboarded: true,
      });
    }
  }, [hydrated, user]);

  if (!hydrated) return null;
  if (!user || !user.is_onboarded) return null;

  return <>{children}</>;
}
