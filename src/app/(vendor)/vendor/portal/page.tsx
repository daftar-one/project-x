"use client";

import { useState, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { Modal } from "@/components/shared/modal";
import { VendorFrame } from "@/components/shared/vendor-frame";
import { PageTitle } from "@/components/shared/page-title";
import { KPI } from "@/components/shared/kpi";
import { useVendorStore } from "@/store/vendor-auth";
import { fmtShort, fmtDateTime } from "@/lib/format";
import { toast } from "sonner";

/* ─── types ──────────────────────────────────────────────────────────── */

const UNIT_MULT = { K: 1_000, L: 1_00_000, Cr: 1_00_00_000 } as const;
type AmountUnit = keyof typeof UNIT_MULT;

interface Breakdown {
  id: string;
  reason: string;
}

interface Payment {
  id: string;
  project: string;
  scene: string;
  location: string;
  breakdownId: string;
  breakdown: string;
  amount: number;
  status: "Paid" | "Rejected" | "Pending";
  submittedAt: string;
  statusChangedAt: string | null;
  billFileName: string | null;
}

/* ─── mock catalogue — Prime VFX Studios (Active) budget lines ──────── */

const VENDOR_BREAKDOWNS: Record<string, Record<string, Breakdown[]>> = {
  "Dhurandhar 1": {
    "SC-02 – Mumbai Port Explosion": [
      { id: "bl-d1-02-1", reason: "VFX & digital effects" },
    ],
  },
  "Bhoot Bangla": {
    "SC-02 – Police HQ Infiltration": [
      { id: "bl-d2-02-4", reason: "VFX cleanup & compositing" },
    ],
  },
};

const PROJECTS = Object.keys(VENDOR_BREAKDOWNS).map(name => ({ name }));

function scenesForProject(project: string) {
  return Object.keys(VENDOR_BREAKDOWNS[project] ?? {});
}

function breakdownsForScene(project: string, scene: string): Breakdown[] {
  return VENDOR_BREAKDOWNS[project]?.[scene] ?? [];
}

const INITIAL_PAYMENTS: Payment[] = [
  { id: "b-d1-02-1r1", project: "Dhurandhar 1", scene: "SC-02 – Mumbai Port Explosion",   location: "Mumbai", breakdownId: "bl-d1-02-1", breakdown: "VFX & digital effects",    amount: 30_000_000, status: "Rejected", submittedAt: "2024-11-10", statusChangedAt: "2024-11-15", billFileName: "vfx_invoice_v1.pdf"     },
  { id: "b-d1-02-1r2", project: "Dhurandhar 1", scene: "SC-02 – Mumbai Port Explosion",   location: "Mumbai", breakdownId: "bl-d1-02-1", breakdown: "VFX & digital effects",    amount: 25_000_000, status: "Rejected", submittedAt: "2024-11-20", statusChangedAt: "2024-11-25", billFileName: "vfx_invoice_v2.pdf"     },
  { id: "b-d1-02-1",   project: "Dhurandhar 1", scene: "SC-02 – Mumbai Port Explosion",   location: "Mumbai", breakdownId: "bl-d1-02-1", breakdown: "VFX & digital effects",    amount: 76_000_000, status: "Paid",     submittedAt: "2024-12-05", statusChangedAt: "2024-12-08", billFileName: "vfx_invoice_final.pdf"  },
  { id: "b-d2-02-4",   project: "Bhoot Bangla",  scene: "SC-02 – Police HQ Infiltration", location: "Mumbai", breakdownId: "bl-d2-02-4", breakdown: "VFX cleanup & compositing", amount: 12_000_000, status: "Pending",  submittedAt: "2024-11-23", statusChangedAt: null,         billFileName: "vfx_compositing_inv.pdf" },
];

/* ─── bill viewer ─────────────────────────────────────────────────────── */

const STATUS_STYLE: Record<"Paid" | "Rejected" | "Pending", { bg: string; color: string }> = {
  Paid:     { bg: "rgba(16,185,129,.15)",  color: "#34d399" },
  Rejected: { bg: "rgba(239,68,68,.15)",   color: "#f87171" },
  Pending:  { bg: "rgba(245,158,11,.15)",  color: "#fbbf24" },
};

function BillViewerDialog({ payment, onClose }: { payment: Payment; onClose: () => void }) {
  const sc = STATUS_STYLE[payment.status];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,.72)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-[14px] overflow-hidden"
        style={{ background: "#1a1d23", border: "1px solid rgba(255,255,255,.1)", width: "min(760px, 94vw)", height: "min(640px, 90vh)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(255,255,255,.07)]">
          <div className="w-8 h-8 rounded-lg bg-[rgba(99,102,241,.18)] flex items-center justify-center text-[#a5b4fc]">
            <Icon name="file-text" size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-[#f0f2f5]">{payment.breakdown}</div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[13px] font-bold text-[#34d399]">{fmtShort(payment.amount)}</span>
              <span className="text-[13px] text-gray-400">{payment.scene}</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full" style={{ background: sc.bg, color: sc.color }}>
            {payment.status}
          </span>
          <button onClick={onClose} className="ml-1 text-gray-500 hover:text-[#f0f2f5] transition-colors">
            <Icon name="x" size={16} />
          </button>
        </div>
        {/* PDF */}
        <div className="flex-1 overflow-hidden bg-[#111317]">
          <iframe src="/sample_invoice.pdf" className="w-full h-full border-0" title="Bill document" />
        </div>
      </div>
    </div>
  );
}

/* ─── grouping ───────────────────────────────────────────────────────── */

function getGroupedPayments(payments: Payment[]) {
  // Sort payments: Project -> Scene -> Breakdown -> SubmittedAt (desc)
  const sorted = [...payments].sort((a, b) => {
    if (a.project !== b.project) return a.project.localeCompare(b.project);
    if (a.scene !== b.scene) return a.scene.localeCompare(b.scene);
    if (a.breakdown !== b.breakdown) return a.breakdown.localeCompare(b.breakdown);
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  const grouped: {
    payment: Payment;
    projectSpan: number;
    sceneSpan: number;
    breakdownSpan: number;
  }[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i];
    let projectSpan = 0;
    let sceneSpan = 0;
    let breakdownSpan = 0;

    // Is this the start of a project group?
    if (i === 0 || sorted[i - 1].project !== p.project) {
      for (let j = i; j < sorted.length && sorted[j].project === p.project; j++) projectSpan++;
    }

    // Is this the start of a scene group?
    if (i === 0 || sorted[i - 1].project !== p.project || sorted[i - 1].scene !== p.scene) {
      for (let j = i; j < sorted.length && sorted[j].project === p.project && sorted[j].scene === p.scene; j++) sceneSpan++;
    }

    // Is this the start of a breakdown group?
    if (i === 0 || sorted[i - 1].project !== p.project || sorted[i - 1].scene !== p.scene || sorted[i - 1].breakdown !== p.breakdown) {
      for (let j = i; j < sorted.length && sorted[j].project === p.project && sorted[j].scene === p.scene && sorted[j].breakdown === p.breakdown; j++) breakdownSpan++;
    }

    grouped.push({ payment: p, projectSpan, sceneSpan, breakdownSpan });
  }

  return grouped;
}

/* ─── constants ──────────────────────────────────────────────────────── */

const thCls = "text-[10px] font-bold text-gray-500 uppercase tracking-[0.07em] px-[12px] py-2.5 whitespace-nowrap bg-[rgba(255,255,255,.03)] border-b border-[rgba(255,255,255,.07)] text-left";
const thRCls = `${thCls} text-right`;
const thCCls = `${thCls} text-center`;

const tdCls = "text-[12px] text-[#e5e7eb] px-[12px] py-[12px] border-b border-[rgba(255,255,255,.05)] align-top";
const tdRCls = `${tdCls} text-right font-mono`;
const tdCCls = `${tdCls} text-center`;

const STATUS_COLORS: Record<string, string> = {
  Paid: "#34d399",
  Rejected: "#f87171",
  Pending: "#f59e0b",
};

/* ─── component ──────────────────────────────────────────────────────── */

const DEMO_VENDOR = { name: "Prime VFX Studios", email: "contact@primevfx.com" };

function VendorPortalPage() {
  const searchParams = useSearchParams();
  const selectedMovie = searchParams.get("movie");
  const { name, email } = useVendorStore();
  const displayName  = name  || DEMO_VENDOR.name;
  const displayEmail = email || DEMO_VENDOR.email;
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingBill, setViewingBill] = useState<Payment | null>(null);

  const [mpProject,  setMpProject]  = useState(PROJECTS[0].name);
  const [mpScene,    setMpScene]    = useState("");
  const [mpBdId,     setMpBdId]     = useState("");
  const [mpLocation, setMpLocation] = useState("");
  const [mpAmount,   setMpAmount]   = useState("");
  const [mpUnit,     setMpUnit]     = useState<AmountUnit>("L");
  const [mpFiles,    setMpFiles]    = useState<File[]>([]);

  const availableScenes     = scenesForProject(mpProject);
  const availableBreakdowns = mpScene ? breakdownsForScene(mpProject, mpScene) : [];
  const selectedBreakdown   = availableBreakdowns.find(b => b.id === mpBdId) ?? null;
  const mpAmountVal         = (parseFloat(mpAmount) || 0) * UNIT_MULT[mpUnit];
  const canSubmit           = mpScene && mpBdId && mpAmountVal > 0 && mpFiles.length > 0;

  function resetForm() {
    setMpProject(PROJECTS[0].name);
    setMpScene(""); setMpBdId(""); setMpLocation(""); setMpAmount(""); setMpUnit("L"); setMpFiles([]);
  }

  function handleSubmit() {
    if (!canSubmit || !selectedBreakdown) return;
    const submittedAt = new Date().toISOString();
    const newPayments: Payment[] = mpFiles.map((file, i) => ({
      id: `p-${Date.now()}-${i}`,
      project: mpProject,
      scene: mpScene,
      location: mpLocation,
      breakdownId: selectedBreakdown.id,
      breakdown: selectedBreakdown.reason,
      amount: mpAmountVal,
      status: "Pending",
      submittedAt,
      statusChangedAt: null,
      billFileName: file.name,
    }));
    setPayments(prev => [...newPayments, ...prev]);
    resetForm();
    setModalOpen(false);
    toast.success(`${mpFiles.length} bill${mpFiles.length > 1 ? 's' : ''} submitted`);
  }

  function addFile(file: File) {
    setMpFiles(prev => [...prev, file]);
  }

  function removeFile(idx: number) {
    setMpFiles(prev => prev.filter((_, i) => i !== idx));
  }

  const allMovies       = PROJECTS.map(p => p.name);
  const scopedPayments  = selectedMovie ? payments.filter(p => p.project === selectedMovie) : payments;

  const totalSettled     = scopedPayments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const totalPending     = scopedPayments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const totalRejectedAmt = scopedPayments.filter(p => p.status === "Rejected").reduce((s, p) => s + p.amount, 0);
  const paidCount        = scopedPayments.filter(p => p.status === "Paid").length;
  const rejectedCount    = scopedPayments.filter(p => p.status === "Rejected").length;
  const pendingCount     = scopedPayments.filter(p => p.status === "Pending").length;
  const movieCount       = new Set(payments.map(p => p.project)).size;
  const sceneCount       = selectedMovie ? new Set(scopedPayments.map(p => p.scene)).size : 0;

  const groupedPayments = getGroupedPayments(scopedPayments);

  return (
    <VendorFrame movies={allMovies} selectedMovie={selectedMovie}>
      <div className="flex flex-col h-full">

        {/* Fixed header */}
        <div className="shrink-0">
          <PageTitle
            title="Payment Insights"
            right={
              <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                Request Payment
              </button>
            }
          />

          {/* Vendor profile with logo upload */}
          <div className="flex items-center gap-3 mb-4">
            <label className="w-[44px] h-[44px] rounded-[12px] shrink-0 cursor-pointer relative group overflow-hidden shadow-lg" title="Upload logo">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center text-white font-bold text-[16px]">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[12px]">
                <Icon name="upload" size={13} style={{ color: 'white' }} />
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
            <div>
              <div className="text-[14px] font-semibold text-[#f0f2f5]">{displayName}</div>
              <div className="text-[11px] text-gray-500">{displayEmail}</div>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <KPI label="Total Settled"  value={fmtShort(totalSettled)}    sub={`${paidCount} bills`}     icon="wallet"    />
            <KPI label="Total Pending"  value={fmtShort(totalPending)}    sub={`${pendingCount} bills`}  icon="rupee"     />
            <KPI label="Total Rejected" value={fmtShort(totalRejectedAmt)} sub={`${rejectedCount} bills`} icon="trendDown" />
            {selectedMovie
              ? <KPI label="Scenes"  value={sceneCount}  sub="In this movie"     icon="camera" />
              : <KPI label="Movies"  value={movieCount}  sub="Across portfolio"  icon="film"   />
            }
          </div>
        </div>

        {/* Scrollable list — only shown when a movie is selected */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {!selectedMovie ? (
            <div className="text-center py-[60px] px-5 text-gray-500 text-[13px]">
              Select a movie from the sidebar to view payment history.
            </div>
          ) : scopedPayments.length === 0 ? (
            <div className="text-center py-[60px] px-5 text-gray-600 text-[13px]">
              No payment requests yet.
            </div>
          ) : (
            <>
              <div className="text-[13px] font-semibold text-[#f0f2f5] mb-3">Payment History</div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[900px]">
                  <thead>
                    <tr>
                      <th className={thCls}>Movie Name</th>
                      <th className={thCls}>Scene Name</th>
                      <th className={thCls}>Reason</th>
                      <th className={thRCls}>Requested Amount</th>
                      <th className={thCCls}>Bill</th>
                      <th className={thCls}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedPayments.map(({ payment: p, projectSpan, sceneSpan, breakdownSpan }, idx) => {
                      const isLastOfProject = idx === groupedPayments.length - 1 || groupedPayments[idx + 1].payment.project !== p.project;
                      const projectTotal = isLastOfProject ? scopedPayments.filter(pay => pay.project === p.project).reduce((s, r) => s + r.amount, 0) : 0;

                      return (
                        <Fragment key={p.id}>
                          <tr>
                            {projectSpan > 0 && (
                              <td rowSpan={projectSpan} className={`${tdCls} font-bold text-[#f0f2f5] max-w-[180px]`}>
                                <span className="truncate" title={p.project}>{p.project}</span>
                              </td>
                            )}
                            {sceneSpan > 0 && (
                              <td rowSpan={sceneSpan} className={`${tdCls} text-gray-400 font-semibold max-w-[180px]`}>
                                <span className="truncate" title={p.scene}>{p.scene}</span>
                              </td>
                            )}
                            {breakdownSpan > 0 && (
                              <td rowSpan={breakdownSpan} className={`${tdCls} text-gray-400 max-w-[200px]`}>
                                <span className="line-clamp-2" title={p.breakdown}>{p.breakdown}</span>
                              </td>
                            )}
                            <td className={`${tdRCls} font-bold text-[#f0f2f5]`}>
                              {fmtShort(p.amount)}
                            </td>
                            <td className={tdCCls}>
                              {p.billFileName ? (
                                <button
                                  onClick={() => setViewingBill(p)}
                                  className="bg-transparent border-0 cursor-pointer text-[#a5b4fc] hover:text-[#c4b5fd] transition-colors p-0"
                                  title={p.billFileName}
                                >
                                  <Icon name="file" size={14} />
                                </button>
                              ) : (
                                <span className="text-gray-600">—</span>
                              )}
                            </td>
                            <td className={tdCls}>
                              <div className="flex flex-col items-start gap-1">
                                <span className="text-[11px] font-bold" style={{ color: STATUS_COLORS[p.status] }}>{p.status}</span>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                  {fmtDateTime(p.statusChangedAt ?? p.submittedAt)}
                                </span>
                              </div>
                            </td>
                          </tr>
                          {isLastOfProject && (
                            <tr className="bg-[rgba(255,255,255,.04)]">
                              <td colSpan={3} className={`${tdCls} font-bold text-gray-500 text-[10px] text-right tracking-[0.05em]`}>Movie Total</td>
                              <td className={`${tdRCls} font-bold text-[#f0f2f5]`}>{fmtShort(projectTotal)}</td>
                              <td colSpan={2} className={tdCls} />
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </>
          )}
        </div>
      </div>

      {/* Bill viewer */}
      {viewingBill && <BillViewerDialog payment={viewingBill} onClose={() => setViewingBill(null)} />}

      {/* Submit Bill modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="m-0 text-[16px] font-bold">Submit Bill</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => { setModalOpen(false); resetForm(); }}>
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Project */}
          <div className="field">
            <label className="label">Movie</label>
            <div className="input-underline">
              <Icon name="film" size={16} />
              <select value={mpProject} onChange={e => { setMpProject(e.target.value); setMpScene(""); setMpBdId(""); }}>
                {PROJECTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* Scene */}
          <div className="field">
            <label className="label">Scene</label>
            <div className="input-underline">
              <Icon name="camera" size={16} />
              <select value={mpScene} onChange={e => { setMpScene(e.target.value); setMpBdId(""); }}>
                <option value="">Select scene…</option>
                {availableScenes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="field">
            <label className="label">Location</label>
            <div className="input-underline">
              <Icon name="map" size={16} />
              <input
                value={mpLocation}
                onChange={e => setMpLocation(e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra"
              />
            </div>
          </div>

          {/* Breakdown */}
          <div className="field">
            <label className="label">Breakdown</label>
            <div className="input-underline" style={{ opacity: mpScene ? 1 : 0.4, pointerEvents: mpScene ? "auto" : "none" }}>
              <Icon name="list" size={16} />
              <select value={mpBdId} onChange={e => setMpBdId(e.target.value)} disabled={!mpScene}>
                <option value="">Select breakdown…</option>
                {availableBreakdowns.map(b => <option key={b.id} value={b.id}>{b.reason}</option>)}
              </select>
            </div>
            {mpScene && availableBreakdowns.length === 0 && (
              <div className="text-[11px] text-gray-500 mt-1">No breakdowns assigned to you for this scene.</div>
            )}
          </div>

          {/* Amount */}
          <div className="field">
            <label className="label">Amount</label>
            <div className="input-underline">
              <Icon name="rupee" size={16} />
              <input type="number" value={mpAmount} onChange={e => setMpAmount(e.target.value)} placeholder="0" />
              <select
                value={mpUnit}
                onChange={e => setMpUnit(e.target.value as AmountUnit)}
                className="bg-[rgba(255,255,255,.07)] border border-[rgba(255,255,255,.12)] rounded text-[10px] font-bold text-[#a5b4fc] outline-none cursor-pointer shrink-0 py-0.5 px-1"
              >
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="Cr">Cr</option>
              </select>
            </div>
            {mpAmountVal > 0 && (
              <div className="text-[11px] text-gray-500 mt-1">= {fmtShort(mpAmountVal)}</div>
            )}
          </div>

          {/* Bill / Invoice upload */}
          <div className="field mb-0">
            <label className="label">Invoice / Bill</label>

            {mpFiles.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-2">
                {mpFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 px-3 py-[9px] bg-[rgba(99,102,241,.08)] border border-[rgba(99,102,241,.2)] rounded-[6px]">
                    <Icon name="file" size={14} className="text-[#a5b4fc] shrink-0" />
                    <span className="flex-1 text-[12px] text-[#e5e7eb] overflow-hidden text-ellipsis whitespace-nowrap">{file.name}</span>
                    <button className="btn btn-ghost btn-sm p-0 w-[20px] h-[20px] shrink-0" onClick={() => removeFile(idx)}>
                      <Icon name="x" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-2.5 px-3 py-[10px] cursor-pointer border border-dashed border-[rgba(255,255,255,.15)] rounded-[6px] transition-[border-color,background] hover:border-[rgba(99,102,241,.4)] hover:bg-[rgba(99,102,241,.04)]">
              <Icon name="upload" size={15} className="text-gray-500 shrink-0" />
              <span className="text-[13px] text-gray-500">
                {mpFiles.length > 0 ? "Add another file…" : "Click to attach PDF or image…"}
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) addFile(f); e.target.value = ""; }}
              />
            </label>
          </div>

          <div className="flex gap-2.5 mt-6">
            <button className="btn btn-secondary" onClick={() => { setModalOpen(false); resetForm(); }}>
              Cancel
            </button>
            <div className="flex-1" />
            <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
              Submit Request
            </button>
          </div>
        </div>
      </Modal>
    </VendorFrame>
  );
}

import { Suspense } from "react";
export default function VendorPortalPageWrapper() {
  return <Suspense><VendorPortalPage /></Suspense>;
}
