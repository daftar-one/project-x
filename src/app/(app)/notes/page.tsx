"use client";

import { useState } from 'react';
import { AppFrame } from '@/components/shared/app-frame';
import { PageTitle } from '@/components/shared/page-title';
import { Icon } from '@/components/shared/icon';
import { Modal } from '@/components/shared/modal';

interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: 'n-1',
    title: 'Dhurandhar 1 — Shoot reminders',
    body: 'Confirm port location permit with Mumbai civic authority by end of week.\nVFX team needs final storyboard 2 weeks before night shoot.\nBackup explosives team on standby for SC-02.',
    createdAt: '2025-03-10T09:00:00Z',
    updatedAt: '2025-03-10T09:00:00Z',
  },
  {
    id: 'n-2',
    title: 'Budget review — April',
    body: 'SC-01 came in under budget (12Cr actual vs 40Cr planned). Investigate variance and document for stakeholder review.\nSafety costs for night shoots higher than expected.',
    createdAt: '2025-04-01T14:30:00Z',
    updatedAt: '2025-04-02T10:00:00Z',
  },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selected, setSelected] = useState<Note | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');

  function openCreate() {
    setFormTitle('');
    setFormBody('');
    setCreateOpen(true);
  }

  function handleCreate() {
    if (!formTitle.trim()) return;
    const now = new Date().toISOString();
    const note: Note = { id: `n-${Date.now()}`, title: formTitle.trim(), body: formBody.trim(), createdAt: now, updatedAt: now };
    setNotes(prev => [note, ...prev]);
    setSelected(note);
    setCreateOpen(false);
  }

  function openEdit(note: Note) {
    setFormTitle(note.title);
    setFormBody(note.body);
    setEditOpen(true);
  }

  function handleEdit() {
    if (!formTitle.trim() || !selected) return;
    const updated = { ...selected, title: formTitle.trim(), body: formBody.trim(), updatedAt: new Date().toISOString() };
    setNotes(prev => prev.map(n => n.id === selected.id ? updated : n));
    setSelected(updated);
    setEditOpen(false);
  }

  function handleDelete(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleteConfirmId(null);
  }

  return (
    <AppFrame>
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between items-start mb-4">
          <PageTitle title="Notes" sub="Your personal production notes" />
          <button className="btn btn-primary btn-sm mt-1" onClick={openCreate}>
            <Icon name="plus" size={13} /> New Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="card card-pad flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-xl bg-[rgba(99,102,241,.12)] flex items-center justify-center mb-3">
              <Icon name="file-text" size={18} className="text-[#a5b4fc]" />
            </div>
            <div className="text-[14px] font-semibold text-[#f0f2f5] mb-1">No notes yet</div>
            <div className="text-[13px] text-gray-500">Click &ldquo;New Note&rdquo; to create your first note.</div>
          </div>
        ) : (
          <div className="grid grid-cols-[280px_1fr] gap-4 flex-1 min-h-0">
            {/* Note list */}
            <div className="flex flex-col gap-2 overflow-y-auto">
              {notes.map(note => (
                <div
                  key={note.id}
                  className={`card px-4 py-3 cursor-pointer transition-all${selected?.id === note.id ? ' ring-1 ring-[#6366f1]' : ''}`}
                  onClick={() => setSelected(note)}
                >
                  <div className="text-[13px] font-semibold text-[#f0f2f5] truncate mb-1">{note.title}</div>
                  <div className="text-[11px] text-gray-500 line-clamp-2 leading-[1.5]">{note.body || 'No content'}</div>
                  <div className="text-[10px] text-gray-600 mt-1.5">{fmtDate(note.updatedAt)}</div>
                </div>
              ))}
            </div>

            {/* Note detail */}
            {selected ? (
              <div className="card px-6 py-5 flex flex-col overflow-hidden">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="text-[18px] font-bold text-[#f0f2f5] leading-tight flex-1">{selected.title}</div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(selected)}>
                      <Icon name="edit" size={12} /> Edit
                    </button>
                    <button className="btn btn-danger-ghost btn-sm" onClick={() => setDeleteConfirmId(selected.id)}>
                      <Icon name="trash" size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-[11px] text-gray-500 mb-4">
                  Created {fmtDate(selected.createdAt)}
                  {selected.updatedAt !== selected.createdAt && ` · Updated ${fmtDate(selected.updatedAt)}`}
                </div>
                <div className="flex-1 overflow-y-auto">
                  <p className="text-[14px] text-[#d1d5db] leading-[1.75] whitespace-pre-wrap m-0">{selected.body || <span className="text-gray-600 italic">No content</span>}</p>
                </div>
              </div>
            ) : (
              <div className="card flex items-center justify-center text-gray-600 text-[13px]">
                Select a note to view
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
        <div className="p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[15px] font-bold text-[#f9fafb]">New Note</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setCreateOpen(false)}><Icon name="x" size={15} /></button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="field">
              <label className="label">Title *</label>
              <div className="input-underline">
                <Icon name="file-text" size={15} />
                <input
                  autoFocus
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  placeholder="Note title…"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Body</label>
              <textarea
                value={formBody}
                onChange={e => setFormBody(e.target.value)}
                placeholder="Write your note here…"
                rows={6}
                className="w-full bg-transparent border border-[rgba(255,255,255,.12)] rounded-lg text-[#f0f2f5] text-[13px] px-3 py-2.5 outline-none resize-none leading-[1.6] focus:border-[rgba(99,102,241,.5)]"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-5">
            <button className="btn btn-ghost btn-sm" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={!formTitle.trim()}>
              <Icon name="plus" size={13} /> Create
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <div className="p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[15px] font-bold text-[#f9fafb]">Edit Note</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditOpen(false)}><Icon name="x" size={15} /></button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="field">
              <label className="label">Title *</label>
              <div className="input-underline">
                <Icon name="file-text" size={15} />
                <input
                  autoFocus
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Note title…"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Body</label>
              <textarea
                value={formBody}
                onChange={e => setFormBody(e.target.value)}
                placeholder="Write your note here…"
                rows={6}
                className="w-full bg-transparent border border-[rgba(255,255,255,.12)] rounded-lg text-[#f0f2f5] text-[13px] px-3 py-2.5 outline-none resize-none leading-[1.6] focus:border-[rgba(99,102,241,.5)]"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-5">
            <button className="btn btn-ghost btn-sm" onClick={() => setEditOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleEdit} disabled={!formTitle.trim()}>
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={deleteConfirmId !== null} onClose={() => setDeleteConfirmId(null)}>
        <div className="p-8">
          <div className="text-[16px] font-bold text-[#f9fafb] mb-2">Delete Note?</div>
          <p className="text-[13px] text-gray-400 m-0 mb-5 leading-[1.7]">
            This will permanently delete the note. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm flex-1 justify-center" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
            <button
              className="btn btn-sm flex-1 justify-center"
              style={{ background: 'rgba(239,68,68,.2)', color: '#f87171', border: '1px solid rgba(239,68,68,.3)' }}
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              <Icon name="trash" size={13} /> Delete
            </button>
          </div>
        </div>
      </Modal>
    </AppFrame>
  );
}
