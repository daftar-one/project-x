"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppFrame, ModalNewProject } from '@/components/shared/app-frame';
import { KPI } from '@/components/shared/kpi';
import { PageTitle } from '@/components/shared/page-title';
import { LoadingCard, ErrorCard } from '@/components/shared/loading-card';
import { WalletPanel } from '@/components/shared/wallet-panel';
import { CashFlowChart } from '@/components/shared/cash-flow-chart';
import { useProjects } from '@/hooks/useProjects';
import { useProductionHouse } from '@/hooks/useProductionHouse';
import { useBills } from '@/hooks/useBills';
import { usePHWallet } from '@/hooks/useWallet';
import { useAuthStore } from '@/store/auth';
import { fmtShort } from '@/lib/format';
import { Icon } from '@/components/shared/icon';
import { AddFundsDialog } from '@/components/shared/add-funds-dialog';
import { MOCK_SCENES } from '@/lib/mock-data';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const { data: projects, loading, error } = useProjects();
  const { data: house } = useProductionHouse();
  const { data: pendingBills, refetch: refetchBills } = useBills('Pending');
  const { data: wallet, refetch: refetchWallet } = usePHWallet();
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly'>('monthly');
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

  const totalBudget = projects.reduce((a, p) => a + p.total_budget, 0);
  const totalSpent = projects.reduce((a, p) => a + p.spent, 0);
  const spentPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const topup = wallet?.transactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0) ?? 0;

  return (
    <AppFrame>
      <div className='flex flex-row justify-between'>
        <PageTitle
          title="Dashboard"
          sub={`${house?.name ?? 'Loading…'} · Line Producer Overview`}
        />
        <div className='flex flex-row items-center gap-2'>
          {isLP && (
            <button
              onClick={() => setCreateOpen(true)}
              className="btn btn-primary btn-sm w-32"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Icon name="plus" size={13} />
              <span>New Movie</span>
            </button>
          )}
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setAddFundsOpen(true)}
          >
            <Icon name="plus" size={13} /> Add Money
          </button>
          
        </div>
      </div>

      {/* Main layout: content + wallet panel */}
      {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}> */}
      <div>

        {/* Left: KPIs + Projects + Cash Flow + Pending Bills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>


          {/* KPI Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <KPI label="Portfolio" value="600 Cr" sub="Total actual spent" icon="wallet" />
            <KPI label="Movies" value={projects.length} sub="Across portfolio" icon="film" />
            <KPI label="Budget Variance" value="1.7x" sub="Average over budget" icon="trend" />
          </div>

          {/* Expense chart */}
          {/* <div className="card card-pad">
            <CashFlowChart
              periods={[]}
              planned={[]}
              actual={[]}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              height={220}
            />
          </div> */}

          {/* Projects Overview table */}
          <div className="card">
            {/* <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="label">Projects Overview</div>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{projects.length} productions</span>
              </div> */}
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: '100%' }}>Movies</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Planned</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Spent</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Wallet</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Pending</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Over Budget</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Actual Spent</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Variance</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Scenes</th>
                  <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: 'center', color: '#6b7280', padding: '24px 20px' }}>No movies yet</td></tr>
                ) : projects.map(p => {
                  const isOver = p.total_budget > 0 && p.spent > p.total_budget;
                  const variance = p.total_budget > 0 ? p.spent / p.total_budget : 0;
                  const varianceLabel = `${variance.toFixed(1)}x`;
                  const varianceColor = variance > 1 ? '#f87171' : '#34d399';
                  return (
                    <tr
                      key={p.id}
                      onClick={() => router.push(`/projects/${p.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ width: '100%' }}>
                        <div style={{ fontWeight: 600, color: '#f0f2f5' }}>{p.name}</div>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, color: '#f0f2f5' }}>{fmtShort(p.total_budget)}</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, color: '#f0f2f5' }}>{fmtShort(p.spent)}</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, color: '#f0f2f5' }}>{p.id === '1' ? 0 : fmtShort(p.wallet_balance)}</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, color: '#f0f2f5' }}>{fmtShort(p.pending)}</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, color: '#f0f2f5' }}>{p.id === 'D1' ? 0 : fmtShort(p.over_budget)}</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, color: '#f0f2f5' }}>{p.id === 'D1' ? 0 : fmtShort(p.total_budget + p.over_budget)}</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, fontWeight: 600, color: varianceColor }}>{varianceLabel}</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, color: '#9ca3af' }}>{p.wrapped_scenes}/{p.scene_count}</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <span className="num" style={{ fontSize: 13, color: '#9ca3af' }}>{p.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>



          {/* Pending Bill Approvals */}
          {/* {pendingBills.length > 0 && (
            <div className="card">
              <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="label">Pending Bill Approvals</div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                  background: 'rgba(245,158,11,.15)', color: '#fbbf24',
                }}>{pendingBills.length}</span>
              </div>
              <div>
                {pendingBills.slice(0, 5).map(bill => {
                  const movie = projects.find(p => p.id === bill.project_id);
                  const scene = bill.project_id
                    ? (MOCK_SCENES[bill.project_id] ?? []).find((s: { id: string }) => s.id === bill.scene_id)
                    : undefined;
                  return (
                  <div key={bill.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                    borderBottom: '1px solid rgba(255,255,255,.04)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f2f5' }}>
                        {movie?.name ?? '—'}{scene ? ` · ${scene.name}` : ''}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{bill.vendor_name} · {bill.bill_date ?? '—'}</div>
                    </div>
                    <div className="num" style={{ fontSize: 13, fontWeight: 600, color: '#f0f2f5', flexShrink: 0 }}>
                      {fmt(bill.amount)}
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApproveBill(bill.id)}
                    >
                      Approve
                    </button>
                  </div>
                  );
                })}
              </div>
            </div>
          )} */}
        </div>

        {/* Right: Wallet Panel */}
        {/* <div className="card" style={{ overflow: 'hidden', position: 'sticky', top: 24 }}>
          <WalletPanel
            wallet={wallet}
            scope="ph"
            onRefresh={refetchWallet}
          />
        </div> */}
      </div>
      <ModalNewProject open={createOpen} onClose={() => setCreateOpen(false)} />
      <AddFundsDialog open={addFundsOpen} onClose={() => setAddFundsOpen(false)} />
    </AppFrame>
  );
}
