"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppFrame, ModalNewProject } from '@/components/shared/app-frame';
import { KPI } from '@/components/shared/kpi';
import { PageTitle } from '@/components/shared/page-title';
import { LoadingCard, ErrorCard } from '@/components/shared/loading-card';
import { useProjects } from '@/hooks/useProjects';
import { useProductionHouse } from '@/hooks/useProductionHouse';
import { useBills } from '@/hooks/useBills';
import { usePHWallet } from '@/hooks/useWallet';
import { useAuthStore } from '@/store/auth';
import { fmtShort } from '@/lib/format';
import { Icon } from '@/components/shared/icon';
import { AddFundsDialog } from '@/components/shared/add-funds-dialog';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const { data: projects, loading, error } = useProjects();
  const { data: house } = useProductionHouse();
  const { data: pendingBills } = useBills('Pending');
  const { data: wallet, refetch: refetchWallet } = usePHWallet();
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly'>('monthly');
  void timeframe; void setTimeframe; void pendingBills; void wallet; void refetchWallet;
  const isLP = user?.role === 'line_producer';
  const [createOpen, setCreateOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'line_producer') {
      router.replace('/projects');
    }
  }, [user, router]);

  if (user && user.role !== 'line_producer') return null;
  if (loading) return <AppFrame><LoadingCard message="Loading dashboard…" /></AppFrame>;
  if (error) return <AppFrame><ErrorCard message={error} /></AppFrame>;

  const totalSpent = projects.reduce((a, p) => a + p.spent, 0);
  const avgVariance = projects.length > 0
    ? projects.reduce((a, p) => a + (p.total_budget > 0 ? p.spent / p.total_budget : 0), 0) / projects.length
    : 0;

  return (
    <AppFrame>
      <div className="flex flex-row justify-between">
        <PageTitle
          title="Dashboard"
          // sub={`${house?.name ?? 'Loading…'} · Line Producer Overview`}
        />
        <div className="flex flex-row items-center gap-2">
          {isLP && (
            <button
              onClick={() => setCreateOpen(true)}
              className="btn btn-primary btn-sm w-32 flex-1 justify-center"
            >
              <Icon name="plus" size={13} />
              <span>New Movie</span>
            </button>
          )}
          <button
            className="btn btn-primary btn-sm flex-1 justify-center"
            onClick={() => setAddFundsOpen(true)}
          >
            <Icon name="plus" size={13} /> Add Money
          </button>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-4">
          {/* KPI Strip */}
          <div className="grid grid-cols-3 gap-3">
            <KPI label="Portfolio" value={fmtShort(totalSpent)} sub="Total actual spent" icon="wallet" />
            <KPI label="Movies" value={projects.length} sub="Across portfolio" icon="film" />
            <KPI label="Budget Variance" value={`${avgVariance.toFixed(1)}x`} sub="Average spent vs planned" icon="trend" />
          </div>

          {/* Projects Overview table */}
          <div className="card mt-4">
            <table className="tbl">
              <thead>
                <tr>
                  <th className="w-full">Movies</th>
                  <th className="text-right whitespace-nowrap">Planned</th>
                  <th className="text-right whitespace-nowrap">Spent</th>
                  <th className="text-right whitespace-nowrap">Wallet</th>
                  <th className="text-right whitespace-nowrap">Pending</th>
                  <th className="text-right whitespace-nowrap">Over Budget</th>
                  <th className="text-right whitespace-nowrap">Actual Spent</th>
                  <th className="text-right whitespace-nowrap">Variance</th>
                  <th className="text-right whitespace-nowrap">Scenes</th>
                  <th className="text-right whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr><td colSpan={10} className="text-center text-gray-500 px-5 py-6">No movies yet</td></tr>
                ) : projects.map(p => {
                  const variance = p.total_budget > 0 ? p.spent / p.total_budget : 0;
                  const varianceLabel = `${variance.toFixed(1)}x`;
                  const varianceColor = variance > 1 ? '#f87171' : '#34d399';
                  return (
                    <tr key={p.id} onClick={() => router.push(`/projects/${p.id}`)} className="cursor-pointer">
                      <td className="w-full">
                        <div className="font-semibold text-[#f0f2f5]">{p.name}</div>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{fmtShort(p.total_budget)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{fmtShort(p.spent)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{p.id === '1' ? 0 : fmtShort(p.wallet_balance)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{fmtShort(p.pending)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{p.id === 'D1' ? 0 : fmtShort(p.over_budget)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{p.id === 'D1' ? 0 : fmtShort(p.total_budget + p.over_budget)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] font-semibold" style={{ color: varianceColor }}>{varianceLabel}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-gray-400">{p.wrapped_scenes}/{p.scene_count}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-gray-400">{p.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalNewProject open={createOpen} onClose={() => setCreateOpen(false)} />
      <AddFundsDialog open={addFundsOpen} onClose={() => setAddFundsOpen(false)} />
    </AppFrame>
  );
}
