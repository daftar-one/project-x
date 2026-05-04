"use client";

type StatusKey =
  | 'Draft' | 'Active' | 'Over Budget' | 'Pending Approval'
  | 'Pending Review' | 'Wrapped' | 'Closed' | 'Paid'
  | 'Approved' | 'Bill Submitted' | 'Pending Bill' | 'Rejected';

const STATUS_MAP: Record<string, { cls: string; label: string }> = {
  'Draft':            { cls: 'badge-draft',      label: 'Draft' },
  'Scheduled':        { cls: 'badge-scheduled',  label: 'Scheduled' },
  'In Progress':      { cls: 'badge-active',     label: 'In Progress' },
  'Delayed':          { cls: 'badge-over',       label: 'Delayed' },
  'Active':           { cls: 'badge-active',     label: 'Active' },
  'Over Budget':      { cls: 'badge-over',       label: 'Over Budget' },
  'OverBudget':       { cls: 'badge-over',       label: 'Over Budget' },
  'Pending Approval': { cls: 'badge-pending',    label: 'Pending Approval' },
  'PendingApproval':  { cls: 'badge-pending',    label: 'Pending Approval' },
  'Pending Review':   { cls: 'badge-pending',    label: 'Pending Review' },
  'Wrapped':          { cls: 'badge-wrapped',    label: 'Wrapped' },
  'Closed':           { cls: 'badge-wrapped',    label: 'Closed' },
  'Paid':             { cls: 'badge-paid',       label: 'Paid' },
  'Approved':         { cls: 'badge-active',     label: 'Approved' },
  'Bill Submitted':   { cls: 'badge-pending',    label: 'Bill In' },
  'Pending Bill':     { cls: 'badge-draft',      label: 'No Bill Yet' },
  'Rejected':         { cls: 'badge-over',       label: 'Rejected' },
};

export function StatusBadge({ status }: { status: string }) {
  const m = STATUS_MAP[status] || { cls: 'badge-draft', label: status };
  return (
    <span className={`badge ${m.cls}`}>
      <span className="badge-dot" />
      {m.label}
    </span>
  );
}
