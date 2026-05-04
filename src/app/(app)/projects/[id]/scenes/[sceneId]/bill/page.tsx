"use client";

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { AppFrame } from '@/components/shared/app-frame';
import { Icon } from '@/components/shared/icon';
import { PageTitle } from '@/components/shared/page-title';
import { LoadingCard, ErrorCard } from '@/components/shared/loading-card';
import { useSceneBills } from '@/hooks/useSceneBills';
import { useProject } from '@/hooks/useProject';
import { fmt } from '@/lib/format';

export default function BillReviewPage() {
  const router = useRouter();
  const { id, sceneId } = useParams<{ id: string; sceneId: string }>();
  const searchParams = useSearchParams();
  const billId = searchParams.get('billId');

  const [mode, setMode] = useState<null | 'reject'>(null);
  const [reason, setReason] = useState('');

  const { data: bills, loading, error } = useSceneBills(id, sceneId);
  const { data: project } = useProject(id);

  if (loading) return <AppFrame><LoadingCard message="Loading bill…" /></AppFrame>;
  if (error) return <AppFrame><ErrorCard message={error} /></AppFrame>;

  const bill = billId ? bills.find(b => b.id === billId) : bills[0];

  if (!bill) {
    return (
      <AppFrame>
        <ErrorCard message="Bill not found" />
      </AppFrame>
    );
  }

  const woAmount = null; // work order amount not available without separate fetch
  const diff = woAmount !== null ? bill.amount - woAmount : 0;
  const over = diff > 0;

  const handleApprove = () => {
    setMode(null);
  };

  const handleReject = () => {
    if (!reason.trim()) return;
    router.push(`/projects/${id}/scenes/${sceneId}`);
  };

  const handlePay = () => {};

  return (
    <AppFrame>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, color: '#9ca3af', fontSize: 12 }}>
        <span style={{ cursor: 'pointer' }} onClick={() => router.push('/projects')}>Movies</span>
        <Icon name="chevronRight" size={12} />
        <span style={{ cursor: 'pointer' }} onClick={() => router.push(`/projects/${id}`)}>{project?.name ?? '…'}</span>
        <Icon name="chevronRight" size={12} />
        <span style={{ cursor: 'pointer' }} onClick={() => router.push(`/projects/${id}/scenes/${sceneId}`)}>Scene</span>
        <Icon name="chevronRight" size={12} />
        <span style={{ color: '#fff' }}>Bill Review</span>
      </div>

      <PageTitle
        title="Bill Review"
        sub={`${bill.vendor_name ?? '—'} · ${bill.bill_type} · ${bill.bill_date ?? '—'}`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20 }}>
        {/* Bill detail */}
        <div className="card card-pad">
          <div className="label" style={{ marginBottom: 16 }}>Bill Summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
            {[
              ['Vendor', bill.vendor_name ?? '—'],
              ['Bill Type', bill.bill_type],
              ['Bill Date', bill.bill_date ?? '—'],
              ['Status', bill.status],
              ['Submitted By', bill.submitted_by ?? '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="label">{label}</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{value}</div>
              </div>
            ))}
            <div>
              <div className="label">Amount</div>
              <div className="num" style={{ fontSize: 20, fontWeight: 700, color: '#f0f2f5', marginTop: 2 }}>{fmt(bill.amount)}</div>
            </div>
          </div>
          {bill.rejection_reason && (
            <div style={{ marginTop: 16, background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 6, padding: 10, fontSize: 12, color: '#fca5a5' }}>
              <strong>Rejection reason:</strong> {bill.rejection_reason}
            </div>
          )}
        </div>

        {/* Actions */}
        <div>
          {bill.status === 'Pending' && (
            <>
              {mode === 'reject' ? (
                <div className="card card-pad">
                  <div className="label">Rejection Reason</div>
                  <textarea
                    className="input-box" rows={4}
                    placeholder="Explain why this bill is being rejected…"
                    value={reason} onChange={e => setReason(e.target.value)}
                    style={{ marginTop: 6, marginBottom: 12 }}
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={() => setMode(null)}>Cancel</button>
                    <button
                      style={{ flex: 1, background: '#ef4444', color: '#fff', borderRadius: 6, fontWeight: 500, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', padding: '10px 16px' }}
                      disabled={!reason}
                      onClick={handleReject}
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setMode('reject')}>
                    <Icon name="x" size={14} /> Reject
                  </button>
                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleApprove}>
                    <Icon name="check" size={14} /> Approve Bill
                  </button>
                </div>
              )}
            </>
          )}

          {bill.status === 'Approved' && (
            <div className="card card-pad">
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                This bill has been approved. Record payment when funds are transferred.
              </div>
              <button className="btn btn-primary btn-full" onClick={handlePay}>
                <Icon name="check" size={14} /> Mark as Paid
              </button>
            </div>
          )}

          {bill.status === 'Paid' && (
            <div className="card card-pad" style={{ textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                <Icon name="check" size={16} /> Payment Recorded
              </div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>This bill has been paid.</div>
            </div>
          )}

          {bill.status === 'Rejected' && (
            <div className="card card-pad" style={{ textAlign: 'center' }}>
              <div style={{ color: '#ef4444', fontWeight: 600, fontSize: 14 }}>Bill Rejected</div>
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
