"use client";

import { useState } from 'react';
import { MOCK_PROJECTS, MOCK_SCENES } from '@/lib/mock-data';
import { fmtShort } from '@/lib/format';
import { toast } from 'sonner';
import { Icon } from './icon';

interface Props {
  open: boolean;
  onClose: () => void;
  scope?: 'ph' | 'project' | 'scene';
  projectId?: string;
  sceneId?: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'transparent', border: 'none',
  borderBottom: '1px solid rgba(255,255,255,.15)', color: '#f9fafb',
  fontSize: 14, padding: '8px 0 8px 28px', outline: 'none', transition: 'border-color .15s',
  appearance: 'none',
};

const readonlyStyle: React.CSSProperties = {
  ...inputStyle,
  color: '#6b7280',
  cursor: 'default',
  borderBottomColor: 'rgba(255,255,255,.07)',
};

const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase',
  letterSpacing: '.07em', marginBottom: 4, display: 'block',
};

const field: React.CSSProperties = { position: 'relative', width: '100%' };

const iconWrap: React.CSSProperties = {
  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
  color: '#6b7280', display: 'flex', alignItems: 'center',
};

export function AddFundsDialog({ open, onClose, scope = 'ph', projectId, sceneId }: Props) {
  const [selectedMovieId, setSelectedMovieId] = useState(projectId ?? '');
  const [selectedSceneId, setSelectedSceneId] = useState(sceneId ?? '');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

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

  async function handleSubmit() {
    const amt = parseInt(amount.replace(/,/g, ''), 10);
    const effectiveMovieId = scope === 'ph' ? selectedMovieId : (projectId ?? '');
    const effectiveSceneId = scope === 'scene' ? (sceneId ?? '') : selectedSceneId;

    if (!effectiveMovieId) { toast.error('Select a movie'); return; }
    if (!effectiveSceneId) { toast.error('Select a scene'); return; }
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }

    setSaving(true);
    await new Promise(r => setTimeout(r, 400));

    const movie = MOCK_PROJECTS.find(p => p.id === effectiveMovieId);
    const scene = (MOCK_SCENES[effectiveMovieId] ?? []).find(s => s.id === effectiveSceneId);
    toast.success(`Added ${fmtShort(amt)} to ${scene?.name} (${movie?.name})`);

    setSaving(false);
    setSelectedMovieId(projectId ?? '');
    setSelectedSceneId(sceneId ?? '');
    setAmount('');
    onClose();
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        background: '#1a1d23', border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 12, padding: 32, width: 380, maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,.6)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f9fafb' }}>Add Funds</div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,.06)',
            border: 'none', color: '#9ca3af', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="x" size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Movie */}
          <div>
            <label style={lbl}>Movie</label>
            <div style={field}>
              <span style={iconWrap}><Icon name="film" size={15} /></span>
              {scope === 'ph' ? (
                <select
                  value={selectedMovieId}
                  onChange={e => handleMovieChange(e.target.value)}
                  style={inputStyle}
                >
                  <option value="" disabled>Select a movie…</option>
                  {MOCK_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              ) : (
                <div style={readonlyStyle}>{prefilledMovie?.name ?? '—'}</div>
              )}
            </div>
          </div>

          {/* Scene */}
          <div>
            <label style={lbl}>Scene</label>
            <div style={field}>
              <span style={iconWrap}><Icon name="camera" size={15} /></span>
              {scope === 'scene' ? (
                <div style={readonlyStyle}>
                  {prefilledScene ? `${prefilledScene.num} · ${prefilledScene.name}` : '—'}
                </div>
              ) : (
                <select
                  value={selectedSceneId}
                  onChange={e => setSelectedSceneId(e.target.value)}
                  disabled={!movieIdForScenes}
                  style={{ ...inputStyle, opacity: movieIdForScenes ? 1 : 0.45 }}
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
            <label style={lbl}>Amount (₹)</label>
            <div style={field}>
              <span style={iconWrap}><Icon name="rupee" size={15} /></span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoFocus
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 32 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? 'Adding…' : 'Add Funds'}
          </button>
        </div>
      </div>
    </div>
  );
}
