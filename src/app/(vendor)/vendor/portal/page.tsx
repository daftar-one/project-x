"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Modal } from "@/components/shared/modal";
import { VendorFrame } from "@/components/shared/vendor-frame";
import { PageTitle } from "@/components/shared/page-title";
import { useVendorStore } from "@/store/vendor-auth";
import { fmtShort } from "@/lib/format";
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
  breakdownId: string;
  breakdown: string;
  amount: number;
  status: "Paid" | "Rejected" | "Pending";
  submittedAt: string;
  statusChangedAt: string | null;
  billFileName: string | null;
}

/* ─── mock catalogue ─────────────────────────────────────────────────── */

const VENDOR_BREAKDOWNS: Record<string, Record<string, Breakdown[]>> = {
  "Dhurandhar": {
    "Scene 01 – Action":  [{ id: "bd-a1", reason: "Equipment Rental" }, { id: "bd-a2", reason: "Stunt Coordinator" }],
    "Scene 02 – Drama":   [{ id: "bd-b1", reason: "Location Fee" }],
    "Scene 03 – VFX":     [{ id: "bd-c1", reason: "VFX Software License" }, { id: "bd-c2", reason: "3D Artist" }],
    "Scene 04 – Climax":  [{ id: "bd-d1", reason: "Pyrotechnics" }, { id: "bd-d2", reason: "Safety Equipment" }],
  },
  "Dhurandhar 2": {
    "Scene 01 – Intro":   [{ id: "bd-e1", reason: "Costume Design" }],
    "Scene 02 – Chase":   [{ id: "bd-f1", reason: "Vehicle Hire" }, { id: "bd-f2", reason: "Fuel & Transport" }],
    "Scene 03 – Finale":  [{ id: "bd-g1", reason: "Orchestra" }],
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
  { id: "p1",  project: "Dhurandhar",   scene: "Scene 01 – Action",  breakdownId: "bd-a1", breakdown: "Equipment Rental",      amount: 2_50_000, status: "Paid",     submittedAt: "2025-01-10", statusChangedAt: "2025-01-14", billFileName: "equipment_jan.pdf"   },
  { id: "p2",  project: "Dhurandhar",   scene: "Scene 01 – Action",  breakdownId: "bd-a2", breakdown: "Stunt Coordinator",     amount: 75_000,   status: "Paid",     submittedAt: "2025-01-18", statusChangedAt: "2025-01-20", billFileName: "stunt_invoice.pdf"  },
  { id: "p3",  project: "Dhurandhar",   scene: "Scene 02 – Drama",   breakdownId: "bd-b1", breakdown: "Location Fee",          amount: 1_20_000, status: "Paid",     submittedAt: "2025-02-03", statusChangedAt: "2025-02-06", billFileName: "location_feb.pdf"   },
  { id: "p4",  project: "Dhurandhar",   scene: "Scene 02 – Drama",   breakdownId: "bd-b1", breakdown: "Location Fee",          amount: 45_000,   status: "Rejected", submittedAt: "2025-02-05", statusChangedAt: "2025-02-07", billFileName: "location_extra.pdf" },
  { id: "p5",  project: "Dhurandhar",   scene: "Scene 03 – VFX",     breakdownId: "bd-c1", breakdown: "VFX Software License",  amount: 4_80_000, status: "Paid",     submittedAt: "2025-02-20", statusChangedAt: "2025-02-25", billFileName: "vfx_license.pdf"    },
  { id: "p6",  project: "Dhurandhar",   scene: "Scene 03 – VFX",     breakdownId: "bd-c2", breakdown: "3D Artist",             amount: 1_10_000, status: "Paid",     submittedAt: "2025-02-28", statusChangedAt: "2025-03-02", billFileName: "artist_invoice.pdf" },
  { id: "p7",  project: "Dhurandhar",   scene: "Scene 04 – Climax",  breakdownId: "bd-d1", breakdown: "Pyrotechnics",          amount: 3_20_000, status: "Paid",     submittedAt: "2025-03-07", statusChangedAt: "2025-03-10", billFileName: "pyro_bill.pdf"      },
  { id: "p8",  project: "Dhurandhar",   scene: "Scene 04 – Climax",  breakdownId: "bd-d2", breakdown: "Safety Equipment",      amount: 85_000,   status: "Rejected", submittedAt: "2025-03-12", statusChangedAt: "2025-03-13", billFileName: "safety_equip.pdf"   },
  { id: "p9",  project: "Dhurandhar 2", scene: "Scene 01 – Intro",   breakdownId: "bd-e1", breakdown: "Costume Design",        amount: 95_000,   status: "Paid",     submittedAt: "2025-03-22", statusChangedAt: "2025-03-26", billFileName: "costume_mar.pdf"    },
  { id: "p10", project: "Dhurandhar 2", scene: "Scene 01 – Intro",   breakdownId: "bd-e1", breakdown: "Costume Design",        amount: 60_000,   status: "Paid",     submittedAt: "2025-03-25", statusChangedAt: "2025-03-28", billFileName: "costume_extra.pdf"  },
  { id: "p11", project: "Dhurandhar 2", scene: "Scene 02 – Chase",   breakdownId: "bd-f1", breakdown: "Vehicle Hire",          amount: 2_10_000, status: "Pending",  submittedAt: "2025-04-01", statusChangedAt: null,         billFileName: "vehicle_apr.pdf"    },
  { id: "p12", project: "Dhurandhar 2", scene: "Scene 02 – Chase",   breakdownId: "bd-f2", breakdown: "Fuel & Transport",      amount: 55_000,   status: "Pending",  submittedAt: "2025-04-03", statusChangedAt: null,         billFileName: "fuel_apr.pdf"       },
  { id: "p13", project: "Dhurandhar 2", scene: "Scene 03 – Finale",  breakdownId: "bd-g1", breakdown: "Orchestra",             amount: 1_80_000, status: "Pending",  submittedAt: "2025-04-10", statusChangedAt: null,         billFileName: "orchestra_bill.pdf" },
];

/* ─── grouping ───────────────────────────────────────────────────────── */

function groupPayments(payments: Payment[]) {
  const projectOrder: string[] = [];
  const byProject = new Map<string, Map<string, Map<string, Payment[]>>>();

  for (const p of payments) {
    if (!byProject.has(p.project)) {
      byProject.set(p.project, new Map());
      projectOrder.push(p.project);
    }
    const byScene = byProject.get(p.project)!;
    if (!byScene.has(p.scene)) byScene.set(p.scene, new Map());
    const byBreakdown = byScene.get(p.scene)!;
    const key = p.breakdown;
    if (!byBreakdown.has(key)) byBreakdown.set(key, []);
    byBreakdown.get(key)!.push(p);
  }

  return projectOrder.map(project => ({
    project,
    scenes: [...byProject.get(project)!.entries()].map(([scene, byBreakdown]) => ({
      scene,
      total: [...byBreakdown.values()].flat().reduce((s, r) => s + r.amount, 0),
      breakdowns: [...byBreakdown.entries()].map(([breakdown, rows]) => ({ breakdown, rows })),
    })),
  }));
}

/* ─── constants ──────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  Paid:     { color: "#34d399" },
  Pending:  { color: "#f59e0b" },
  Rejected: { color: "#f87171" },
};

const BADGE_CLASS = {
  Paid:     "badge badge-paid",
  Pending:  "badge badge-pending",
  Rejected: "badge badge-over",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── component ──────────────────────────────────────────────────────── */

export default function VendorPortalPage() {
  const { name, email } = useVendorStore();
  void name; void email;
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [modalOpen, setModalOpen] = useState(false);

  const [mpProject, setMpProject] = useState(PROJECTS[0].name);
  const [mpScene,   setMpScene]   = useState("");
  const [mpBdId,    setMpBdId]    = useState("");
  const [mpAmount,  setMpAmount]  = useState("");
  const [mpUnit,    setMpUnit]    = useState<AmountUnit>("L");
  const [mpFile,    setMpFile]    = useState<File | null>(null);

  const availableScenes     = scenesForProject(mpProject);
  const availableBreakdowns = mpScene ? breakdownsForScene(mpProject, mpScene) : [];
  const selectedBreakdown   = availableBreakdowns.find(b => b.id === mpBdId) ?? null;
  const mpAmountVal         = (parseFloat(mpAmount) || 0) * UNIT_MULT[mpUnit];
  const canSubmit           = mpScene && mpBdId && mpAmountVal > 0 && !!mpFile;

  function resetForm() {
    setMpProject(PROJECTS[0].name);
    setMpScene(""); setMpBdId(""); setMpAmount(""); setMpUnit("L"); setMpFile(null);
  }

  function handleSubmit() {
    if (!canSubmit || !selectedBreakdown || !mpFile) return;
    const newPayment: Payment = {
      id: `p-${Date.now()}`,
      project: mpProject, scene: mpScene,
      breakdownId: selectedBreakdown.id, breakdown: selectedBreakdown.reason,
      amount: mpAmountVal, status: "Pending",
      submittedAt: new Date().toISOString(), statusChangedAt: null,
      billFileName: mpFile.name,
    };
    setPayments(prev => [newPayment, ...prev]);
    resetForm(); setModalOpen(false);
    toast.success("Bill submitted");
  }

  return (
    <VendorFrame>
      <div className="flex flex-col h-full">

        {/* Fixed header */}
        <div className="shrink-0">
          <PageTitle
            title="Payment History"
            right={
              <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                Request Payment
              </button>
            }
          />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {payments.length === 0 ? (
            <div className="text-center py-[60px] px-5 text-gray-600 text-[13px]">
              No payment requests yet.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {groupPayments(payments).map(({ project, scenes }) => (
                <div key={project}>
                  {/* Movie header */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-[26px] h-[26px] rounded-[7px] shrink-0 bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center">
                      <Icon name="film" size={13} stroke={1.5} className="text-white" />
                    </div>
                    <span className="text-[14px] font-bold text-[#f0f2f5] tracking-[-0.01em]">{project}</span>
                  </div>

                  {/* Scenes */}
                  <div className="flex flex-col gap-3">
                    {scenes.map(({ scene, total, breakdowns }) => (
                      <div key={scene} className="card overflow-hidden">

                        {/* Scene header */}
                        <div className="flex items-center justify-between px-4 py-[10px] border-b border-[rgba(255,255,255,.06)] bg-[rgba(255,255,255,.02)]">
                          <div className="flex items-center gap-2">
                            <Icon name="camera" size={13} stroke={1.5} className="text-gray-500" />
                            <span className="text-[12px] font-semibold text-gray-400">{scene}</span>
                          </div>
                          <span className="num text-[12px] font-semibold text-gray-500">
                            {fmtShort(total)}
                          </span>
                        </div>

                        {/* Breakdowns */}
                        {breakdowns.map(({ breakdown, rows }, bIdx) => (
                          <div
                            key={breakdown}
                            className={bIdx > 0 ? "border-t border-[rgba(255,255,255,.06)]" : ""}
                          >
                            {/* Breakdown label */}
                            <div className="flex items-center justify-between px-4 py-2 pb-1.5 bg-[rgba(255,255,255,.015)]">
                              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.06em]">
                                {breakdown}
                              </span>
                              <span className="num text-[11px] text-gray-600">
                                {fmtShort(rows.reduce((s, r) => s + r.amount, 0))}
                              </span>
                            </div>

                            {/* Payment rows */}
                            {rows.map(p => (
                              <div key={p.id} className="flex items-center gap-[14px] px-4 py-[10px] pl-5 border-t border-[rgba(255,255,255,.04)]">
                                <div
                                  className="w-1.5 h-1.5 rounded-full shrink-0"
                                  style={{ background: STATUS_CONFIG[p.status].color }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className={BADGE_CLASS[p.status]}>{p.status}</span>
                                    <span className="text-[11px] text-gray-500">
                                      {fmt(p.submittedAt)}
                                      {p.statusChangedAt && <> → {fmt(p.statusChangedAt)}</>}
                                    </span>
                                  </div>
                                  {p.billFileName && (
                                    <div className="flex items-center gap-[5px] mt-[3px]">
                                      <Icon name="file" size={11} className="text-gray-600 shrink-0" />
                                      <span className="text-[11px] text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                                        {p.billFileName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="num text-[14px] font-bold text-[#f0f2f5] shrink-0">
                                  {fmtShort(p.amount)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
            {mpFile ? (
              <div className="flex items-center gap-2.5 px-3 py-[10px] bg-[rgba(99,102,241,.08)] border border-[rgba(99,102,241,.2)] rounded-[6px]">
                <Icon name="file" size={15} className="text-[#a5b4fc] shrink-0" />
                <span className="flex-1 text-[13px] text-[#e5e7eb] overflow-hidden text-ellipsis whitespace-nowrap">
                  {mpFile.name}
                </span>
                <button
                  className="btn btn-ghost btn-sm p-0 w-[22px] h-[22px] shrink-0"
                  onClick={() => setMpFile(null)}
                >
                  <Icon name="x" size={13} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2.5 px-3 py-[10px] cursor-pointer border border-dashed border-[rgba(255,255,255,.15)] rounded-[6px] transition-[border-color,background] hover:border-[rgba(99,102,241,.4)] hover:bg-[rgba(99,102,241,.04)]">
                <Icon name="upload" size={15} className="text-gray-500 shrink-0" />
                <span className="text-[13px] text-gray-500">Click to attach PDF or image…</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={e => setMpFile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
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
