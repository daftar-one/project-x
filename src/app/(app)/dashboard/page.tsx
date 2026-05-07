"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppFrame, ModalNewProject } from '@/components/shared/app-frame';
import { KPI } from '@/components/shared/kpi';
import { PageTitle } from '@/components/shared/page-title';
import { Modal } from '@/components/shared/modal';
import { LoadingCard, ErrorCard } from '@/components/shared/loading-card';
import { useProjects } from '@/hooks/useProjects';
import { useProductionHouse } from '@/hooks/useProductionHouse';
import { useBills } from '@/hooks/useBills';
import { usePHWallet } from '@/hooks/useWallet';
import { useAuthStore } from '@/store/auth';
import { fmtShortCur } from '@/lib/format';
import { Icon } from '@/components/shared/icon';
import { AddFundsDialog } from '@/components/shared/add-funds-dialog';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const { data: projects, loading, error } = useProjects();
  const { data: pendingBills } = useBills('Pending');
  const { data: wallet, refetch: refetchWallet } = usePHWallet();
  void pendingBills; void wallet; void refetchWallet;
  const { data: house } = useProductionHouse(); void house;
  const isLP = user?.role === 'line_producer';
  const [createOpen, setCreateOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'line_producer') {
      router.replace('/projects');
    }
  }, [user, router]);

  if (user && user.role !== 'line_producer') return null;
  if (loading) return <AppFrame><LoadingCard message="Loading dashboard…" /></AppFrame>;
  if (error) return <AppFrame><ErrorCard message={error} /></AppFrame>;

  const visibleProjects = projects.filter(p => !deletedIds.has(p.id));
  const totalSpent = visibleProjects.reduce((a, p) => a + p.spent, 0);
  const totalBudget = visibleProjects.reduce((a, p) => a + p.total_budget, 0);
  const netBudget = totalBudget - totalSpent;

  const deleteMovie = (id: string) => {
    const name = projects.find(p => p.id === id)?.name ?? 'Movie';
    setDeletedIds(prev => new Set([...prev, id]));
    setDeleteConfirmId(null);
    toast.success(`"${name}" deleted`);
  };

  return (
    <AppFrame>
      <div className="flex flex-row justify-between">
        <PageTitle title="Dashboard" />
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
            <KPI label="Portfolio" value={fmtShortCur(totalBudget)} sub="Total portfolio budget" icon="wallet" />
            <KPI label="Movies" value={visibleProjects.length} sub="Across portfolio" icon="film" />
            <KPI
              label="Budget Health"
              value={fmtShortCur(netBudget)}
              sub={netBudget >= 0 ? 'Remaining from portfolio budget' : 'Exceeded portfolio budget'}
              icon="trend"
            />
          </div>

          {/* Projects Overview table */}
          <div className="card mt-4">
            <table className="tbl">
              <thead>
                <tr>
                  <th className="w-full">Movies</th>
                  <th className="text-right whitespace-nowrap">Currency</th>
                  <th className="text-right whitespace-nowrap">Planned Budget</th>
                  <th className="text-right whitespace-nowrap">Wallet</th>
                  <th className="text-right whitespace-nowrap">Pending Bills</th>
                  <th className="text-right whitespace-nowrap">Actual Spent</th>
                  <th className="text-right whitespace-nowrap">Over Budget</th>
                  <th className="text-right whitespace-nowrap">Scenes</th>
                  <th className="text-right whitespace-nowrap">Status</th>
                  {isLP && <th className="w-8" />}
                </tr>
              </thead>
              <tbody>
                {visibleProjects.length === 0 ? (
                  <tr><td colSpan={isLP ? 10 : 9} className="text-center text-gray-500 px-5 py-6">No movies yet</td></tr>
                ) : visibleProjects.map(p => {
                  const cur = p.currency ?? 'INR';
                  const fmt = (n: number) => fmtShortCur(n, cur);
                  return (
                    <tr key={p.id} onClick={() => router.push(`/projects/${p.id}`)} className="cursor-pointer">
                      <td className="w-full">
                        <div className="font-semibold text-[#f0f2f5]">{p.name}</div>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[12px] text-gray-400">{cur}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{fmt(p.total_budget)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{p.id === '1' ? 0 : fmt(p.wallet_balance)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{fmt(p.pending)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{fmt(p.spent)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-[#f0f2f5]">{fmt(p.over_budget)}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-gray-400">{p.wrapped_scenes}/{p.scene_count}</span>
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <span className="num text-[13px] text-gray-400">{p.status}</span>
                      </td>
                      {isLP && (
                        <td className="text-right">
                          <button
                            className="btn btn-danger-ghost btn-sm"
                            onClick={e => { e.stopPropagation(); setDeleteConfirmId(p.id); }}
                            title="Delete movie"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        </td>
                      )}
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

      {/* Delete movie confirmation */}
      <Modal open={deleteConfirmId !== null} onClose={() => setDeleteConfirmId(null)}>
        <div className="p-8">
          <div className="w-[52px] h-[52px] rounded-[14px] mb-5 bg-[rgba(239,68,68,.1)] border border-[rgba(239,68,68,.2)] flex items-center justify-center">
            <Icon name="trash" size={22} style={{ color: '#f87171' }} />
          </div>
          <div className="text-[17px] font-bold text-[#f9fafb] mb-2 tracking-[-0.01em]">Delete Movie?</div>
          <p className="text-[13px] text-gray-400 m-0 mb-4 leading-[1.7]">
            This will permanently delete &ldquo;{projects.find(p => p.id === deleteConfirmId)?.name ?? 'this movie'}&rdquo; and all its data. This action cannot be undone.
          </p>
          <div className="h-px bg-[rgba(255,255,255,.06)] mb-5" />
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm flex-1 justify-center" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
            <button
              className="btn btn-danger btn-sm flex-1 justify-center"
              onClick={() => deleteConfirmId && deleteMovie(deleteConfirmId)}
            >
              <Icon name="trash" size={13} /> Delete Movie
            </button>
          </div>
        </div>
      </Modal>
    </AppFrame>
  );
}
