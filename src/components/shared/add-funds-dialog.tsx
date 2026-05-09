"use client";

import { useState } from 'react';
import { MOCK_PROJECTS, MOCK_SCENES } from '@/lib/mock-data';
import { fmtShort } from '@/lib/format';
import { toast } from 'sonner';
import { Icon } from './icon';
import { Modal } from './modal';

interface Props {
  open: boolean;
  onClose: () => void;
  scope?: 'ph' | 'project' | 'scene';
  projectId?: string;
  sceneId?: string;
}

const inputCls = "w-full bg-transparent border-0 border-b border-[rgba(255,255,255,.15)] text-[#f9fafb] text-[14px] py-2 pl-7 pr-0 outline-none transition-[border-color] appearance-none";
const readonlyCls = "w-full bg-transparent border-0 border-b border-[rgba(255,255,255,.07)] text-gray-500 text-[14px] py-2 pl-7 pr-0 cursor-default";

export function AddFundsDialog({ open, onClose, scope = 'ph', projectId, sceneId }: Props) {
  const [selectedMovieId, setSelectedMovieId] = useState(projectId ?? '');
  const [selectedSceneId, setSelectedSceneId] = useState(sceneId ?? '');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('L');
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!open) return null;

  const prefilledMovie = scope !== 'ph' ? MOCK_PROJECTS.find(p => p.id === projectId) : null;
  const prefilledScene = scope === 'scene'
    ? (MOCK_SCENES[projectId ?? ''] ?? []).find(s => s.id === sceneId)
    : null;

  const movieIdForScenes = scope === 'ph' ? selectedMovieId : (projectId ?? '');
  const scenes = movieIdForScenes ? (MOCK_SCENES[movieIdForScenes] ?? []) : [];

  function handleMovieChange(id: string) {
    setSelectedMovieId(id);
    setSelectedSceneId('');
  }

  function getMultiplier(u: string) {
    if (u === 'k') return 1_000;
    if (u === 'L') return 100_000;
    if (u === 'Cr') return 10_000_000;
    return 1;
  }

  const numericAmt = parseFloat(amount) || 0;
  const finalAmt = numericAmt * getMultiplier(unit);

  function handleRequestSubmit() {
    const effectiveMovieId = scope === 'ph' ? selectedMovieId : (projectId ?? '');
    const effectiveSceneId = scope === 'scene' ? (sceneId ?? '') : selectedSceneId;

    if (!effectiveMovieId) { toast.error('Select a movie'); return; }
    if (!effectiveSceneId) { toast.error('Select a scene'); return; }
    if (finalAmt <= 0) { toast.error('Enter a valid amount'); return; }

    setConfirming(true);
  }

  async function handleConfirm() {
    const effectiveMovieId = scope === 'ph' ? selectedMovieId : (projectId ?? '');
    const effectiveSceneId = scope === 'scene' ? (sceneId ?? '') : selectedSceneId;

    setSaving(true);
    await new Promise(r => setTimeout(r, 400));

    const movie = MOCK_PROJECTS.find(p => p.id === effectiveMovieId);
    const scene = (MOCK_SCENES[effectiveMovieId] ?? []).find(s => s.id === effectiveSceneId);
    toast.success(`Added ${fmtShort(finalAmt)} to ${scene?.name} (${movie?.name})`);

    setSaving(false);
    setConfirming(false);
    setSelectedMovieId(projectId ?? '');
    setSelectedSceneId(sceneId ?? '');
    setAmount('');
    setUnit('L');
    onClose();
  }

  const effectiveMovieId = scope === 'ph' ? selectedMovieId : (projectId ?? '');
  const effectiveSceneId = scope === 'scene' ? (sceneId ?? '') : selectedSceneId;
  const confirmMovie = MOCK_PROJECTS.find(p => p.id === effectiveMovieId);
  const confirmScene = (MOCK_SCENES[effectiveMovieId] ?? []).find(s => s.id === effectiveSceneId);

  return (
    <Modal open={open} onClose={onClose}>
      {confirming ? (
        <div className="p-8">
          <div className="w-[52px] h-[52px] rounded-[14px] mb-5 bg-[rgba(16,185,129,.1)] border border-[rgba(16,185,129,.2)] flex items-center justify-center">
            <Icon name="rupee" size={22} style={{ color: '#34d399' }} />
          </div>
          <div className="text-[17px] font-bold text-[#f9fafb] mb-2 tracking-[-0.01em]">Add Money?</div>
          <p className="text-[13px] text-gray-400 m-0 mb-4 leading-[1.7]">
            Are you sure you want to add <span className="text-[#34d399] font-semibold">{fmtShort(finalAmt)}</span> to <span className="text-[#f0f2f5] font-semibold">{confirmScene?.name}</span>{confirmMovie && <> ({confirmMovie.name})</>}?
          </p>
          <div className="h-px bg-[rgba(255,255,255,.06)] mb-5" />
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm flex-1 justify-center" onClick={() => setConfirming(false)}>Back</button>
            <button
              className="btn btn-primary btn-sm flex-1 justify-center"
              style={{ background: '#059669' }}
              onClick={handleConfirm}
              disabled={saving}
            >
              {saving ? 'Adding…' : 'Add Money'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <div className="text-[16px] font-bold text-[#f9fafb]">Add Money</div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-[6px] bg-[rgba(255,255,255,.06)] border-0 text-gray-400 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Icon name="x" size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Movie */}
            <div>
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] mb-1 block">Movie</label>
              <div className="relative w-full">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"><Icon name="film" size={15} /></span>
                {scope === 'ph' ? (
                  <select
                    value={selectedMovieId}
                    onChange={e => handleMovieChange(e.target.value)}
                    className={inputCls}
                  >
                    <option value="" disabled>Select a movie…</option>
                    {MOCK_PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <div className={readonlyCls}>{prefilledMovie?.name ?? '—'}</div>
                )}
              </div>
            </div>

            {/* Scene */}
            <div>
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] mb-1 block">Scene</label>
              <div className="relative w-full">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"><Icon name="camera" size={15} /></span>
                {scope === 'scene' ? (
                  <div className={readonlyCls}>
                    {prefilledScene ? `${prefilledScene.num} · ${prefilledScene.name}` : '—'}
                  </div>
                ) : (
                  <select
                    value={selectedSceneId}
                    onChange={e => setSelectedSceneId(e.target.value)}
                    disabled={!movieIdForScenes}
                    className={inputCls}
                    style={{ opacity: movieIdForScenes ? 1 : 0.45 }}
                  >
                    <option value="" disabled>
                      {movieIdForScenes ? 'Select a scene…' : 'Select a movie first'}
                    </option>
                    {scenes.map(s => (
                      <option key={s.id} value={s.id}>{s.num} · {s.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] mb-1 block">Amount (₹)</label>
              <div className="flex items-end gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"><Icon name="rupee" size={15} /></span>
                  <input
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRequestSubmit()}
                    autoFocus
                    className={inputCls}
                  />
                </div>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="bg-[rgba(255,255,255,.07)] border border-[rgba(255,255,255,.12)] rounded text-[11px] font-bold text-[#a5b4fc] outline-none cursor-pointer px-2 py-1 mb-1.5"
                >
                  <option value="k">k</option>
                  <option value="L">L</option>
                  <option value="Cr">Cr</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-8">
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleRequestSubmit}
              disabled={saving}
            >
              Add Money
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
