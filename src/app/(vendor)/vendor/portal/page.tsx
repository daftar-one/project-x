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

interface SceneData {
  scenes: {
    [scene: string]: Breakdown[];
  };
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

// Breakdowns assigned to this vendor, keyed by project name → scene name
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
  // Preserve first-seen insertion order at every level
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
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [modalOpen, setModalOpen] = useState(false);

  // form state — each field resets downstream fields when changed
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
    setMpScene("");
    setMpBdId("");
    setMpAmount("");
    setMpUnit("L");
    setMpFile(null);
  }

  function handleSubmit() {
    if (!canSubmit || !selectedBreakdown || !mpFile) return;
    const newPayment: Payment = {
      id: `p-${Date.now()}`,
      project:     mpProject,
      scene:       mpScene,
      breakdownId: selectedBreakdown.id,
      breakdown:   selectedBreakdown.reason,
      amount:      mpAmountVal,
      status:      "Pending",
      submittedAt: new Date().toISOString(),
      statusChangedAt: null,
      billFileName: mpFile.name,
    };
    setPayments(prev => [newPayment, ...prev]);
    resetForm();
    setModalOpen(false);
    toast.success("Bill submitted");
  }

  const unitSelectStyle: React.CSSProperties = {
    background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 4, padding: "2px 4px", fontSize: 10, fontWeight: 700,
    color: "#a5b4fc", outline: "none", cursor: "pointer", flexShrink: 0,
  };

  return (
    <VendorFrame>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

        {/* Fixed header */}
        <div style={{ flexShrink: 0 }}>
          <PageTitle
            title="Payment History"
            right={
              <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                {/* <Icon name="plus" size={13} />  */}
                Request Payment
              </button>
            }
          />
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          {payments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#4b5563", fontSize: 13 }}>
              No payment requests yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {groupPayments(payments).map(({ project, scenes }) => (
                <div key={project}>
                  {/* Movie header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                      background: "linear-gradient(135deg,#6366f1,#e83e8c)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name="film" size={13} stroke={1.5} style={{ color: "#fff" }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#f0f2f5", letterSpacing: "-.01em" }}>{project}</span>
                  </div>

                  {/* Scenes */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {scenes.map(({ scene, total, breakdowns }) => (
                      <div key={scene} className="card" style={{ overflow: "hidden" }}>

                        {/* Scene header */}
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "10px 16px",
                          borderBottom: "1px solid rgba(255,255,255,.06)",
                          background: "rgba(255,255,255,.02)",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Icon name="camera" size={13} stroke={1.5} style={{ color: "#6b7280" }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>{scene}</span>
                          </div>
                          <span className="num" style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>
                            {fmtShort(total)}
                          </span>
                        </div>

                        {/* Breakdowns */}
                        {breakdowns.map(({ breakdown, rows }, bIdx) => (
                          <div
                            key={breakdown}
                            style={{ borderTop: bIdx > 0 ? "1px solid rgba(255,255,255,.06)" : "none" }}
                          >
                            {/* Breakdown label */}
                            <div style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "8px 16px 6px",
                              background: "rgba(255,255,255,.015)",
                            }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em" }}>
                                {breakdown}
                              </span>
                              <span className="num" style={{ fontSize: 11, color: "#4b5563" }}>
                                {fmtShort(rows.reduce((s, r) => s + r.amount, 0))}
                              </span>
                            </div>

                            {/* Payment rows */}
                            {rows.map((p, i) => (
                              <div
                                key={p.id}
                                style={{
                                  display: "flex", alignItems: "center", gap: 14,
                                  padding: "10px 16px 10px 20px",
                                  borderTop: "1px solid rgba(255,255,255,.04)",
                                }}
                              >
                                <div style={{
                                  width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                                  background: STATUS_CONFIG[p.status].color,
                                }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className={BADGE_CLASS[p.status]}>{p.status}</span>
                                    <span style={{ fontSize: 11, color: "#6b7280" }}>
                                      {fmt(p.submittedAt)}
                                      {p.statusChangedAt && <> → {fmt(p.statusChangedAt)}</>}
                                    </span>
                                  </div>
                                  {p.billFileName && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                                      <Icon name="file" size={11} style={{ color: "#4b5563", flexShrink: 0 }} />
                                      <span style={{ fontSize: 11, color: "#4b5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {p.billFileName}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="num" style={{ fontSize: 14, fontWeight: 700, color: "#f0f2f5", flexShrink: 0 }}>
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
        <div style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Submit Bill</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => { setModalOpen(false); resetForm(); }}>
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Project */}
          <div className="field">
            <label className="label">Movie</label>
            <div className="input-underline">
              <Icon name="film" size={16} />
              <select
                value={mpProject}
                onChange={e => { setMpProject(e.target.value); setMpScene(""); setMpBdId(""); }}
              >
                {PROJECTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          </div>

          {/* Scene */}
          <div className="field">
            <label className="label">Scene</label>
            <div className="input-underline">
              <Icon name="camera" size={16} />
              <select
                value={mpScene}
                onChange={e => { setMpScene(e.target.value); setMpBdId(""); }}
              >
                <option value="">Select scene…</option>
                {availableScenes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Breakdown — only visible once scene is selected */}
          <div className="field">
            <label className="label">Breakdown</label>
            <div className="input-underline" style={{ opacity: mpScene ? 1 : 0.4, pointerEvents: mpScene ? "auto" : "none" }}>
              <Icon name="list" size={16} />
              <select
                value={mpBdId}
                onChange={e => setMpBdId(e.target.value)}
                disabled={!mpScene}
              >
                <option value="">Select breakdown…</option>
                {availableBreakdowns.map(b => <option key={b.id} value={b.id}>{b.reason}</option>)}
              </select>
            </div>
            {mpScene && availableBreakdowns.length === 0 && (
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>No breakdowns assigned to you for this scene.</div>
            )}
          </div>

          {/* Amount */}
          <div className="field">
            <label className="label">Amount</label>
            <div className="input-underline">
              <Icon name="rupee" size={16} />
              <input
                type="number"
                value={mpAmount}
                onChange={e => setMpAmount(e.target.value)}
                placeholder="0"
              />
              <select value={mpUnit} onChange={e => setMpUnit(e.target.value as AmountUnit)} style={unitSelectStyle}>
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="Cr">Cr</option>
              </select>
            </div>
            {mpAmountVal > 0 && (
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>= {fmtShort(mpAmountVal)}</div>
            )}
          </div>

          {/* Bill / Invoice upload */}
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label">Invoice / Bill</label>
            {mpFile ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px",
                background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.2)",
                borderRadius: 6,
              }}>
                <Icon name="file" size={15} style={{ color: "#a5b4fc", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: "#e5e7eb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {mpFile.name}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ padding: 0, width: 22, height: 22, flexShrink: 0 }}
                  onClick={() => setMpFile(null)}
                >
                  <Icon name="x" size={13} />
                </button>
              </div>
            ) : (
              <label style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", cursor: "pointer",
                border: "1px dashed rgba(255,255,255,.15)", borderRadius: 6,
                transition: "border-color .15s ease, background .15s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,.4)"; e.currentTarget.style.background = "rgba(99,102,241,.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.15)"; e.currentTarget.style.background = "transparent"; }}
              >
                <Icon name="upload" size={15} style={{ color: "#6b7280", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#6b7280" }}>Click to attach PDF or image…</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  style={{ display: "none" }}
                  onChange={e => setMpFile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button className="btn btn-secondary" onClick={() => { setModalOpen(false); resetForm(); }}>
              Cancel
            </button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
              Submit Request
            </button>
          </div>
        </div>
      </Modal>
    </VendorFrame>
  );
}
