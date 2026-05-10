"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppFrame } from '@/components/shared/app-frame';
import { Icon } from '@/components/shared/icon';
import { KPI } from '@/components/shared/kpi';
import { Modal } from '@/components/shared/modal';
import { Avatar } from '@/components/shared/avatar';
import { Tabs } from '@/components/shared/tabs';
import { LoadingCard, ErrorCard } from '@/components/shared/loading-card';
import { SceneInlineForm } from '@/components/shared/scene-inline-form';

import { useProject } from '@/hooks/useProject';
import { useScenes } from '@/hooks/useScenes';
import { useVendors } from '@/hooks/useVendors';
import { useTeam } from '@/hooks/useTeam';
import { useCollaborators } from '@/hooks/useCollaborators';
import { useProjectWallet } from '@/hooks/useWallet';

import { useAuthStore } from '@/store/auth';
import { fmtShort } from '@/lib/format';
import { getMockBills, MOCK_LOCKED_SCENE_IDS } from '@/lib/mock-data';
import { toast } from 'sonner';
import type { Collaborator, Vendor } from '@/lib/types';

/* ─── constants ─────────────────────────────────────────────────── */

const ROLE_LABELS: Record<string, string> = {
  line_producer: 'Line Producer',
  executive_producer: 'Executive Producer',
  accounts_manager: 'Accounts Manager',
};

/* ─── types ──────────────────────────────────────────────────────── */

type View = 'overview' | 'team' | { sceneId: string; isDraft?: boolean };

/* ─── Team content (inline) ──────────────────────────────────────── */

const STATIC_TEAM = [
  { id: 's1', project_id: '', user_id: 'u1', role: 'executive_producer', status: 'pending'   as const, user_email: 'priya.sharma@studioos.in', user_full_name: 'Priya Sharma', joined_at: '2026-05-12' },
  { id: 's2', project_id: '', user_id: 'u2', role: 'line_producer',      status: 'accepted'  as const, user_email: 'arjun.mehta@studioos.in',  user_full_name: 'Arjun Mehta',  joined_at: '2026-05-10' },
  { id: 's3', project_id: '', user_id: 'u3', role: 'accounts_manager',   status: 'accepted'  as const, user_email: 'rahul.nair@studioos.in',   user_full_name: 'Rahul Nair',   joined_at: '2026-05-15' },
];

function TeamContent({ projectId, isLP }: { projectId: string; isLP: boolean }) {
  const [tab, setTab] = useState('team');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('executive_producer');
  const [inviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [colSearch, setColSearch] = useState('');
  const [colOpen, setColOpen] = useState(false);
  const [selectedCol, setSelectedCol] = useState<Collaborator | null>(null);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorLocation, setVendorLocation] = useState('');
  const [savingVendor] = useState(false);
  const [vendorError, setVendorError] = useState('');

  const [vendorLogos, setVendorLogos] = useState<Record<string, string>>({});
  const handleVendorLogoChange = (vendorId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setVendorLogos(prev => ({ ...prev, [vendorId]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const { data: teamFromApi, loading: teamLoading } = useTeam(projectId);
  const team = [...STATIC_TEAM, ...teamFromApi];
  const { data: vendors, loading: vendorLoading, error: vendorError2 } = useVendors();
  const { data: collaborators } = useCollaborators(projectId);

  const resetInviteModal = () => { setInviteEmail(''); setInviteRole('executive_producer'); setInviteError(''); setColSearch(''); setColOpen(false); setSelectedCol(null); };
  const handleInvite = () => {
    if (!inviteEmail.trim()) { setInviteError('Email is required'); return; }
    const email = inviteEmail.trim();
    setInviteOpen(false); resetInviteModal();
    toast.success(`Invitation sent to ${email}`);
  };
  const filteredCollaborators = collaborators.filter(c => {
    const q = colSearch.toLowerCase();
    return c.email.toLowerCase().includes(q) || (c.full_name ?? '').toLowerCase().includes(q);
  });
  const openNewVendor = () => { setVendorName(''); setVendorEmail(''); setVendorLocation(''); setVendorError(''); setVendorModalOpen(true); };
  const handleSaveVendor = () => {
    if (!vendorName.trim()) { setVendorError('Vendor name is required'); return; }
    const name = vendorName.trim();
    setVendorModalOpen(false);
    toast.success(`${name} invited as vendor`);
  };
  const handleRemoveMember = (_memberId: string, _name: string) => {};
  const handleDeleteVendor = (_v: Vendor) => {};

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Tabs tabs={[{ id: 'team', label: 'Team', count: team.length }, { id: 'vendors', label: 'Vendors', count: vendors.length }]} active={tab} onChange={setTab} />
        {isLP && (
          tab === 'team'
            ? <button className="btn btn-primary btn-sm" onClick={() => setInviteOpen(true)}><Icon name="plus" size={13} /> Invite</button>
            : <button className="btn btn-primary btn-sm" onClick={openNewVendor}><Icon name="plus" size={13} /> Invite</button>
        )}
      </div>

      {tab === 'team' && (
        teamLoading ? <LoadingCard message="Loading team…" /> : (
          <div className="card">
            <table className="tbl">
              <thead><tr><th>Member</th><th>Email</th><th>Designation</th><th>Status</th>{isLP && <th></th>}</tr></thead>
              <tbody>
                {team.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 p-8">No team members yet</td></tr>
                ) : team.map(m => {
                  const displayName = m.user_full_name || m.user_email;
                  const roleLabel = ROLE_LABELS[m.role] ?? m.role;
                  const isAccepted = m.status === 'accepted';
                  return (
                    <tr key={m.id} style={{ opacity: isAccepted ? 1 : 0.45 }}>
                      <td>
                        <div className="flex items-center gap-[10px]">
                          <div className="w-[28px] h-[28px] rounded-[8px] shrink-0 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-[11px] font-bold">
                            {displayName.charAt(0)}
                          </div>
                          <div className="font-semibold">{displayName}</div>
                        </div>
                      </td>
                      <td className="text-gray-500">{m.user_email}</td>
                      <td className="text-gray-400">{roleLabel}</td>
                      <td className="text-gray-400">{isAccepted ? 'Accepted' : 'Invited'}</td>
                      {isLP && <td className="text-right"><button className="btn btn-danger-ghost btn-sm" onClick={() => handleRemoveMember(m.id, displayName)} title="Remove"><Icon name="trash" size={13} /></button></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === 'vendors' && (
        vendorLoading ? <LoadingCard message="Loading vendors…" /> : vendorError2 ? <ErrorCard message={vendorError2} /> : (
          <div className="card">
            <table className="tbl">
              <thead><tr><th>Name</th><th>Location</th><th>Email</th><th>Status</th>{isLP && <th></th>}</tr></thead>
              <tbody>
                {vendors.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-gray-400 p-8">No vendors yet</td></tr>
                ) : vendors.map(v => {
                  const isAccepted = v.status === 'Active';
                  return (
                    <tr key={v.id} style={{ opacity: isAccepted ? 1 : 0.45 }}>
                      <td>
                        <div className="flex items-center gap-[10px]">
                          <label className="w-[28px] h-[28px] rounded-[8px] shrink-0 cursor-pointer relative group overflow-hidden" title={isLP ? 'Upload logo' : undefined}>
                            {vendorLogos[v.id] ? (
                              <img src={vendorLogos[v.id]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white text-[11px] font-bold">
                                {v.name.charAt(0)}
                              </div>
                            )}
                            {isLP && (
                              <>
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[8px]">
                                  <Icon name="upload" size={10} style={{ color: 'white' }} />
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={e => handleVendorLogoChange(v.id, e)} />
                              </>
                            )}
                          </label>
                          <div className="font-semibold">{v.name}</div>
                        </div>
                      </td>
                      <td className="text-gray-500">{v.location ?? '—'}</td>
                      <td className="text-gray-500">{v.email ?? '—'}</td>
                      <td className="text-gray-400">{isAccepted ? 'Accepted' : v.status}</td>
                      {isLP && <td className="text-right"><button className="btn btn-danger-ghost btn-sm" onClick={() => handleDeleteVendor(v)} title="Remove"><Icon name="trash" size={13} /></button></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Invite modal */}
      <Modal open={inviteOpen} onClose={() => { setInviteOpen(false); resetInviteModal(); }}>
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="m-0 text-[18px] font-semibold">Invite Member</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => { setInviteOpen(false); resetInviteModal(); }}><Icon name="x" size={16} /></button>
          </div>
          {inviteError && <div className="bg-[rgba(239,68,68,.12)] border border-[rgba(239,68,68,.25)] rounded-[6px] px-[14px] py-[10px] mb-[14px] text-[13px] text-[#fca5a5]">{inviteError}</div>}
          {collaborators.length > 0 && (
            <div className="field relative">
              <label className="label">Previous collaborators</label>
              {selectedCol ? (
                <div className="flex items-center gap-[10px] py-2 px-3 rounded-lg bg-[rgba(99,102,241,.12)] border border-[rgba(99,102,241,.3)]">
                  <Avatar name={selectedCol.full_name || selectedCol.email} size={28} />
                  <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold text-[#f0f2f5]">{selectedCol.full_name || selectedCol.email}</div><div className="text-[11px] text-gray-400">{selectedCol.email}</div></div>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedCol(null); setInviteEmail(''); setColSearch(''); }}><Icon name="x" size={13} /></button>
                </div>
              ) : (
                <>
                  <div className="input-underline"><Icon name="users" size={16} /><input value={colSearch} onChange={e => { setColSearch(e.target.value); setColOpen(true); }} onFocus={() => setColOpen(true)} placeholder="Search by name or email…" /></div>
                  {colOpen && filteredCollaborators.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-[#1a2235] border border-[rgba(255,255,255,.1)] rounded-lg mt-1 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,.4)] max-h-[180px] overflow-y-auto">
                      {filteredCollaborators.map(c => (
                        <div key={c.id} onClick={() => { setSelectedCol(c); setInviteEmail(c.email); setInviteRole(c.role === 'line_producer' ? 'executive_producer' : c.role); setColOpen(false); setColSearch(''); }} className="flex items-center gap-[10px] py-[9px] px-[14px] cursor-pointer hover:bg-[rgba(255,255,255,.06)]">
                          <Avatar name={c.full_name || c.email} size={26} />
                          <div className="flex-1 min-w-0"><div className="text-[12px] font-semibold text-[#f0f2f5]">{c.full_name || c.email}</div></div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <div className="field"><label className="label">Email</label><div className="input-underline"><Icon name="mail" size={16} /><input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="name@company.in" /></div></div>
          <div className="field"><label className="label">Role</label><div className="input-underline"><Icon name="user" size={16} /><select value={inviteRole} onChange={e => setInviteRole(e.target.value)}><option value="executive_producer">Executive Producer</option><option value="accounts_manager">Accounts Manager</option></select></div></div>
          <button className="btn btn-primary btn-full mt-[10px]" onClick={handleInvite} disabled={inviting}>{inviting ? 'Inviting…' : 'Send Invite'}</button>
        </div>
      </Modal>

      {/* Invite vendor modal */}
      <Modal open={vendorModalOpen} onClose={() => setVendorModalOpen(false)}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="m-0 text-[18px] font-semibold">Invite Vendor</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setVendorModalOpen(false)}><Icon name="x" size={16} /></button>
          </div>
          {vendorError && <div className="bg-[rgba(239,68,68,.12)] border border-[rgba(239,68,68,.25)] rounded-[6px] px-[14px] py-[10px] mb-[14px] text-[13px] text-[#fca5a5]">{vendorError}</div>}
          <div className="flex flex-col gap-1">
            <div className="field"><label className="label">Vendor Name</label><div className="input-underline"><Icon name="building" size={16} /><input value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="e.g. Mumbai Location Services" autoFocus /></div></div>
            <div className="field"><label className="label">Location</label><div className="input-underline"><Icon name="map" size={16} /><input value={vendorLocation} onChange={e => setVendorLocation(e.target.value)} placeholder="e.g. Mumbai, Maharashtra" /></div></div>
            <div className="field"><label className="label">Email</label><div className="input-underline"><Icon name="mail" size={16} /><input type="email" value={vendorEmail} onChange={e => setVendorEmail(e.target.value)} placeholder="vendor@example.com" /></div></div>
          </div>
          <div className="flex gap-[10px] mt-6"><button className="btn btn-secondary" onClick={() => setVendorModalOpen(false)} disabled={savingVendor}>Cancel</button><div className="flex-1" /><button className="btn btn-primary" onClick={handleSaveVendor} disabled={savingVendor || !vendorName.trim()}>{savingVendor ? 'Saving…' : 'Invite'}</button></div>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Main project page ──────────────────────────────────────────── */

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [view, setViewState] = useState<View>(() => {
    if (typeof window !== 'undefined') {
      const sceneId = new URLSearchParams(window.location.search).get('scene');
      if (sceneId) return { sceneId };
    }
    return 'overview';
  });

  function setView(v: View) {
    setViewState(v);
    const base = `/projects/${id}`;
    if (typeof v === 'object' && v.sceneId && !v.isDraft) {
      router.replace(`${base}?scene=${v.sceneId}`);
    } else {
      router.replace(base);
    }
  }
  const [draftSceneId, setDraftSceneId] = useState<string | null>(null);
  const [draftSceneName, setDraftSceneName] = useState('New Scene');

  const user = useAuthStore(s => s.user);
  const isLP = user?.role === 'line_producer';

  const activeSceneId = typeof view === 'object' ? view.sceneId : null;
  const isDraftView = typeof view === 'object' ? (view.isDraft ?? false) : false;

  const [projectWrapped, setProjectWrapped] = useState(false);
  const [wrapConfirmOpen, setWrapConfirmOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [wrappedSceneIds, setWrappedSceneIds] = useState<Set<string>>(new Set());
  const [deletedSceneIds, setDeletedSceneIds] = useState<Set<string>>(new Set());
  const [lockedSceneIds, setLockedSceneIds] = useState<Set<string>>(new Set());
  const [deleteSceneConfirmOpen, setDeleteSceneConfirmOpen] = useState(false);
  const [pendingDeleteSceneId, setPendingDeleteSceneId] = useState<string | null>(null);

  const { data: project, loading: projLoading, error: projError } = useProject(id);
  const { data: scenes, loading: scenesLoading } = useScenes(id);
  const [orderedScenes, setOrderedScenes] = useState(scenes);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragSrcIdx = useRef<number | null>(null);
  const { data: vendors } = useVendors();
  const { data: projectWallet } = useProjectWallet(id);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    setWalletBalance(projectWallet?.balance ?? 0);
  }, [projectWallet]);

  // Reset view whenever the project ID changes (switching projects)
  useEffect(() => {
    const sceneId = new URLSearchParams(window.location.search).get('scene');
    setViewState(sceneId ? { sceneId } : 'overview');
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-select first scene: on initial load OR when current sceneId is from a different project
  useEffect(() => {
    if (scenes.length === 0) return;
    if (view === 'overview') {
      setView({ sceneId: scenes[0].id });
      return;
    }
    if (typeof view === 'object' && !view.isDraft) {
      const valid = scenes.some(s => s.id === view.sceneId);
      if (!valid) setView({ sceneId: scenes[0].id });
    }
  }, [scenes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep ordered list in sync when project changes (scenes array gets replaced)
  useEffect(() => {
    setOrderedScenes(scenes);
    // Pre-mark locked scenes from mock constant and wrapped scenes
    const combinedLocked = new Set(MOCK_LOCKED_SCENE_IDS);
    scenes.forEach(s => {
      if (s.status === 'Wrapped') combinedLocked.add(s.id);
    });
    setLockedSceneIds(new Set(
      [...combinedLocked].filter(id => scenes.some(s => s.id === id))
    ));
  }, [scenes]); // eslint-disable-line react-hooks/exhaustive-deps

  if (projLoading) return <AppFrame><LoadingCard message="Loading project…" /></AppFrame>;
  if (projError || !project) return <AppFrame><ErrorCard message={projError ?? 'Project not found'} /></AppFrame>;

  const p = project;

  // KPIs derived from live scene data
  const kpiPlanned    = scenes.reduce((a, s) => a + s.budget, 0);
  const kpiActual     = scenes.reduce((a, s) => a + s.actual, 0);
  const kpiPending    = getMockBills('Pending').filter(b => b.project_id === id).reduce((a, b) => a + b.amount, 0);
  const kpiWrapped    = scenes.filter(s => s.status === 'Wrapped' || wrappedSceneIds.has(s.id)).length;
  const kpiSceneTotal = scenes.length;

  const isProjectLocked = projectWrapped || p.status === 'Wrapped';

  const visibleScenes = orderedScenes.filter(s => !deletedSceneIds.has(s.id));

  const handleAddScene = () => {
    if (isProjectLocked) {
      toast.warning('Project is wrapped — new scenes will be tracked as over budget.');
    }
    if (draftSceneId) {
      setView({ sceneId: draftSceneId, isDraft: true });
      return;
    }
    const newId = `draft-${Date.now()}`;
    setDraftSceneId(newId);
    setDraftSceneName('New Scene');
    setView({ sceneId: newId, isDraft: true });
    toast.success('Added a new scene to "' + p.name+'"');
  };

  const handleWrapProject = () => {
    const allWrapped = visibleScenes.every(s => s.status === 'Wrapped' || wrappedSceneIds.has(s.id));
    if (!allWrapped) {
      toast.error('Some scenes are not wrapped. Please wrap all scenes before wrapping the project.');
      return;
    }
    setWrapConfirmOpen(true);
  };

  /* ── project subnav (renders in primary sidebar below project list) ── */
  const projectSubnav = (
    <div className="pb-1">
      {/* Nav items */}
      <div className={`side-subnav-item${view === 'team' ? ' active' : ''}`} onClick={() => setView('team')}>
        <Icon name="users" size={13} /> Team & Vendors
      </div>

      <div className="h-px bg-[rgba(255,255,255,.06)] mt-[6px] mr-[6px] mb-[6px]" />

      {/* Scenes label */}
      <div className="pt-[2px] pr-2 pb-[3px] pl-[10px] text-[9.5px] font-semibold text-[#4b5563] uppercase tracking-[.07em]">
        Scenes
      </div>

      {/* Add Scene */}
      {isLP && (
        <div className="side-subnav-item mt-[4px]" onClick={handleAddScene}>
          <Icon name="plus" size={13} /> Add Scene
        </div>
      )}

      {/* Draft scene */}
      {draftSceneId && (
        <div
          className={`side-subnav-scene${isDraftView ? ' active' : ''}`}
          onClick={() => setView({ sceneId: draftSceneId, isDraft: true })}
        >
          <span className="text-[9px] font-bold shrink-0 uppercase" style={{ color: isDraftView ? '#a5b4fc' : '#4b5563' }}>New</span>
          <span className="overflow-hidden text-ellipsis flex-1 italic" style={{ color: isDraftView ? '#c4b5fd' : '#6b7280' }}>{draftSceneName || 'New Scene'}</span>
        </div>
      )}

      {scenesLoading ? (
        <div className="pt-[6px] pr-2 pb-[6px] pl-[10px] text-[11px] text-[#6b7280]">Loading…</div>
      ) : visibleScenes.length === 0 && !draftSceneId ? (
        <div className="pt-1 pr-2 pb-[6px] pl-[10px] text-[11px] text-[#4b5563]">No scenes yet</div>
      ) : visibleScenes.map((s, idx) => {
        const isSelected = activeSceneId === s.id && !isDraftView;
        const isDragTarget = dragOverIdx === idx;
        return (
          <div
            key={s.id}
            draggable
            onDragStart={e => {
              dragSrcIdx.current = idx;
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={e => {
              e.preventDefault();
              if (dragSrcIdx.current !== null && dragOverIdx !== idx) setDragOverIdx(idx);
            }}
            onDrop={e => {
              e.preventDefault();
              const from = dragSrcIdx.current;
              if (from === null || from === idx) { setDragOverIdx(null); return; }
              const next = [...visibleScenes];
              const [moved] = next.splice(from, 1);
              next.splice(idx, 0, moved);
              setOrderedScenes(next);
              dragSrcIdx.current = null;
              setDragOverIdx(null);
            }}
            onDragEnd={() => { dragSrcIdx.current = null; setDragOverIdx(null); }}
            className={`side-subnav-scene${isSelected ? ' active' : ''}${isDragTarget ? ' drag-over' : ''}`}
            onClick={() => setView({ sceneId: s.id })}
          >
            <Icon name="grip" size={11} stroke={2.5} className="drag-handle" />
            <span className="text-[10px] font-bold shrink-0" style={{ color: isSelected ? '#a5b4fc' : '#4b5563' }}>{String(idx + 1).padStart(2, '0')}</span>
            <span className="overflow-hidden text-ellipsis flex-1">{s.name}</span>
          </div>
        );
      })}
    </div>
  );

  /* ── main content ── */
  return (
    <AppFrame projectSubnav={projectSubnav}>

      {/* ── Project header ── */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-0.5">
          {/* Title + badge grouped together */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="text-[20px] font-bold tracking-[-0.02em] text-[#f0f2f5] truncate">{p.name}</div>
            {/* Status badge */}
            {(projectWrapped || p.status === 'Wrapped') ? (
              <span className="inline-flex items-center gap-1 px-[9px] py-[3px] rounded-full text-[11px] font-semibold shrink-0" style={{ background: 'rgba(16,185,129,.15)', color: '#34d399' }}>
                Wrapped
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-[9px] py-[3px] rounded-full text-[11px] font-semibold shrink-0" style={{ background: 'rgba(16,185,129,.15)', color: '#34d399' }}>
                Live
              </span>
            )}
          </div>
          {/* Action buttons on the right */}
          <div className="flex items-center gap-2 shrink-0">
            {isLP && !(projectWrapped || p.status === 'Wrapped') && (
              <button className="btn btn-secondary btn-sm" onClick={handleWrapProject}>
                Wrap Project
              </button>
            )}
            {isLP && (
              <button
                className="btn btn-danger-ghost btn-sm"
                onClick={() => setDeleteProjectOpen(true)}
                title="Delete project"
              >
                <Icon name="trash" size={13} />
                Delete Project
              </button>
            )}
          </div>
        </div>
        {p.genre && <div className="text-[13px] text-gray-500 mb-[10px]">{p.genre}</div>}

        {/* Project Dashboard KPIs */}
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[.08em] mb-2">Project Dashboard</div>
        <div className="grid grid-cols-5 gap-3">
          <KPI label="Planned Budget"  value={kpiPlanned > 0 ? fmtShort(kpiPlanned) : '—'} icon="wallet" />
          <KPI label="Actual Spent"    value={kpiActual  > 0 ? fmtShort(kpiActual)  : '—'} icon="trend"  />
          <KPI label="Funds in Wallet" value={fmtShort(walletBalance)}                       icon="wallet" />
          <KPI label="Pending Bills"   value={kpiPending > 0 ? fmtShort(kpiPending) : '—'} icon="rupee"  />
          <KPI label="Scenes Wrapped"  value={`${kpiWrapped}/${kpiSceneTotal}`}              icon="film"   />
        </div>
      </div>

      {/* ── Content ── */}

      {/* Team */}
      {view === 'team' && (
        <>
          <div className="text-[16px] font-bold tracking-[-0.02em] text-[#f0f2f5] mb-4">Team & Vendors</div>
          <TeamContent projectId={id} isLP={isLP} />
        </>
      )}

      {/* Scene inline form */}
      {activeSceneId && (
        <div>
          {/* Scene header row */}
          {(() => {
            const activeScene = !isDraftView ? scenes.find(s => s.id === activeSceneId) : null;
            return (
              <div className="flex items-center gap-3 mb-4">
                <div className="text-[16px] font-bold tracking-[-0.02em] text-[#f0f2f5] flex-1">
                  {isDraftView ? (draftSceneName || 'New Scene') : (activeScene?.name ?? 'Scene')}
                </div>
                {!isDraftView && isLP && (
                  <button
                    className="btn btn-danger-ghost btn-sm"
                    onClick={() => {
                      setPendingDeleteSceneId(activeSceneId!);
                      setDeleteSceneConfirmOpen(true);
                    }}
                    title="Delete scene"
                  >
                    <Icon name="trash" size={13} />
                    Delete Scene
                  </button>
                )}
              </div>
            );
          })()}
          <SceneInlineForm
            key={activeSceneId}
            projectId={id}
            sceneId={activeSceneId}
            isDraft={isDraftView}
            isLP={isLP}
            vendors={vendors}
            projectCurrency={p.currency ?? 'INR'}
            onSceneNameChange={isDraftView ? setDraftSceneName : undefined}
            onFundsAdded={amount => setWalletBalance(prev => prev + amount)}
            isSceneWrapped={
              scenes.find(s => s.id === activeSceneId)?.status === 'Wrapped' ||
              wrappedSceneIds.has(activeSceneId)
            }
            initialLocked={lockedSceneIds.has(activeSceneId)}
            onWrapScene={() => {
              const wrappedName = scenes.find(s => s.id === activeSceneId)?.name ?? 'Scene';
              setWrappedSceneIds(prev => new Set([...prev, activeSceneId!]));
              toast.success(`"${wrappedName}" marked as wrapped`);
            }}
            onSceneLocked={() => {
              setLockedSceneIds(prev => new Set([...prev, activeSceneId!]));
            }}
          />
        </div>
      )}

      {/* ── Delete Scene Confirmation ── */}
      <Modal open={deleteSceneConfirmOpen} onClose={() => setDeleteSceneConfirmOpen(false)}>
        <div className="p-8">
          <div className="w-[52px] h-[52px] rounded-[14px] mb-5 bg-[rgba(239,68,68,.1)] border border-[rgba(239,68,68,.2)] flex items-center justify-center">
            <Icon name="trash" size={22} style={{ color: '#f87171' }} />
          </div>
          <div className="text-[17px] font-bold text-[#f9fafb] mb-2 tracking-[-0.01em]">Delete Scene?</div>
          <p className="text-[13px] text-gray-400 m-0 mb-4 leading-[1.7]">
            This action cannot be undone. The scene and all its data will be permanently removed.
          </p>
          <div className="h-px bg-[rgba(255,255,255,.06)] mb-5" />
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm flex-1 justify-center" onClick={() => setDeleteSceneConfirmOpen(false)}>Cancel</button>
            <button
              className="btn btn-danger btn-sm flex-1 justify-center"
              onClick={() => {
                const deletedName = scenes.find(s => s.id === pendingDeleteSceneId)?.name ?? 'Scene';
                setDeletedSceneIds(prev => new Set([...prev, pendingDeleteSceneId!]));
                if (activeSceneId === pendingDeleteSceneId) setView('overview');
                setDeleteSceneConfirmOpen(false);
                setPendingDeleteSceneId(null);
                toast.success(`"${deletedName}" deleted`);
              }}
            >
              <Icon name="trash" size={13} /> Delete Scene
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Project Confirmation ── */}
      <Modal open={deleteProjectOpen} onClose={() => setDeleteProjectOpen(false)}>
        <div className="p-8">
          <div className="w-[52px] h-[52px] rounded-[14px] mb-5 bg-[rgba(239,68,68,.1)] border border-[rgba(239,68,68,.2)] flex items-center justify-center">
            <Icon name="trash" size={22} style={{ color: '#f87171' }} />
          </div>
          <div className="text-[17px] font-bold text-[#f9fafb] mb-2 tracking-[-0.01em]">Delete Project?</div>
          <p className="text-[13px] text-gray-400 m-0 mb-4 leading-[1.7]">
            Are you sure you want to delete &ldquo;{p.name}&rdquo;? This action cannot be undone and all project data will be permanently removed.
          </p>
          <div className="h-px bg-[rgba(255,255,255,.06)] mb-5" />
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm flex-1 justify-center" onClick={() => setDeleteProjectOpen(false)}>Cancel</button>
            <button
              className="btn btn-danger btn-sm flex-1 justify-center"
              onClick={() => {
                setDeleteProjectOpen(false);
                toast.success(`"${p.name}" deleted`);
                router.replace('/dashboard');
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Wrap Project Confirmation ── */}
      <Modal open={wrapConfirmOpen} onClose={() => setWrapConfirmOpen(false)}>
        <div className="p-8">
          <div className="w-[52px] h-[52px] rounded-[14px] mb-5 bg-[rgba(16,185,129,.1)] border border-[rgba(16,185,129,.2)] flex items-center justify-center">
            <Icon name="film" size={22} style={{ color: '#34d399' }} />
          </div>
          <div className="text-[17px] font-bold text-[#f9fafb] mb-2 tracking-[-0.01em]">Wrap Project?</div>
          <p className="text-[13px] text-gray-400 m-0 mb-4 leading-[1.7]">
            Are you sure you want to wrap &ldquo;{p.name}&rdquo;? This will mark the project as complete. This action cannot be undone.
          </p>
          <div className="h-px bg-[rgba(255,255,255,.06)] mb-5" />
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm flex-1 justify-center" onClick={() => setWrapConfirmOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm flex-1 justify-center" style={{ background: '#059669' }} onClick={() => { setProjectWrapped(true); setWrapConfirmOpen(false); toast.success(`"${p.name}" marked as wrapped`); }}>
              Wrap Project
            </button>
          </div>
        </div>
      </Modal>

    </AppFrame>
  );
}
