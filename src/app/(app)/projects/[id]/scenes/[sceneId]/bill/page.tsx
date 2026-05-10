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
      <div className="flex items-center gap-[10px] mb-[6px] text-gray-400 text-[12px]">
        <span className="cursor-pointer" onClick={() => router.push('/projects')}>Projects</span>
        <Icon name="chevronRight" size={12} />
        <span className="cursor-pointer" onClick={() => router.push(`/projects/${id}`)}>{project?.name ?? '…'}</span>
        <Icon name="chevronRight" size={12} />
        <span className="cursor-pointer" onClick={() => router.push(`/projects/${id}/scenes/${sceneId}`)}>Scene</span>
        <Icon name="chevronRight" size={12} />
        <span className="text-white">Bill Review</span>
      </div>

      <PageTitle
        title="Bill Review"
        sub={`${bill.vendor_name ?? '—'} · ${bill.bill_type} · ${bill.bill_date ?? '—'}`}
      />

      <div className="grid grid-cols-[1.1fr_1fr] gap-5">
        {/* Bill detail */}
        <div className="card card-pad">
          <div className="label mb-4">Bill Summary</div>
          <div className="grid grid-cols-2 gap-4 text-[13px]">
            {[
              ['Vendor', bill.vendor_name ?? '—'],
              ['Bill Type', bill.bill_type],
              ['Bill Date', bill.bill_date ?? '—'],
              ['Status', bill.status],
              ['Submitted By', bill.submitted_by ?? '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="label">{label}</div>
                <div className="font-semibold mt-0.5">{value}</div>
              </div>
            ))}
            <div>
              <div className="label">Amount</div>
              <div className="num text-[20px] font-bold text-[#f0f2f5] mt-0.5">{fmt(bill.amount)}</div>
            </div>
          </div>
          {bill.rejection_reason && (
            <div className="mt-4 bg-[rgba(239,68,68,.12)] border border-[rgba(239,68,68,.25)] rounded-[6px] p-[10px] text-[12px] text-[#fca5a5]">
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
                    className="input-box mt-[6px] mb-3" rows={4}
                    placeholder="Explain why this bill is being rejected…"
                    value={reason} onChange={e => setReason(e.target.value)}
                  />
                  <div className="flex gap-[10px]">
                    <button className="btn btn-secondary" onClick={() => setMode(null)}>Cancel</button>
                    <button
                      className="flex-1 bg-[#ef4444] text-white rounded-[6px] font-medium text-[13px] cursor-pointer flex items-center justify-center border-0 px-4 py-[10px]"
                      disabled={!reason}
                      onClick={handleReject}
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-[10px]">
                  <button className="btn btn-secondary flex-1" onClick={() => setMode('reject')}>
                    <Icon name="x" size={14} /> Reject
                  </button>
                  <button className="btn btn-primary [flex:2]" onClick={handleApprove}>
                    <Icon name="check" size={14} /> Approve Bill
                  </button>
                </div>
              )}
            </>
          )}

          {bill.status === 'Approved' && (
            <div className="card card-pad">
              <div className="text-[13px] text-gray-500 mb-4">
                This bill has been approved. Record payment when funds are transferred.
              </div>
              <button className="btn btn-primary btn-full" onClick={handlePay}>
                <Icon name="check" size={14} /> Mark as Paid
              </button>
            </div>
          )}

          {bill.status === 'Paid' && (
            <div className="card card-pad text-center">
              <div className="text-[#10b981] font-semibold text-[14px] mb-2">
                <Icon name="check" size={16} /> Payment Recorded
              </div>
              <div className="text-[13px] text-gray-500">This bill has been paid.</div>
            </div>
          )}

          {bill.status === 'Rejected' && (
            <div className="card card-pad text-center">
              <div className="text-[#ef4444] font-semibold text-[14px]">Bill Rejected</div>
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
