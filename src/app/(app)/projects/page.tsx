"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function ProjectsRedirectPage() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (user?.role === 'line_producer') {
      router.replace('/dashboard');
    }
    // Non-LP users: redirect to first project if available, or just stay
    // Since we can't easily fetch projects here without causing loops,
    // non-LP users accessing /projects get redirected to dashboard which
    // will then redirect them to /projects if needed. For now, do nothing
    // since the sidebar shows their projects directly.
  }, [user, router]);

  return null;
}
