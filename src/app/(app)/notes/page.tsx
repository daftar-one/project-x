"use client";

import { useState } from 'react';
import { AppFrame } from '@/components/shared/app-frame';
import { PageTitle } from '@/components/shared/page-title';
import { Icon } from '@/components/shared/icon';
import { Modal } from '@/components/shared/modal';
import { toast } from 'sonner';

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
    title: 'TVF Pitchers — Shoot reminders',
    body: 'Confirm port location permit with Mumbai civic authority by end of week.\nVFX team needs final storyboard 2 weeks before night shoot.\nBackup explosives team on standby for SC-02.',
    createdAt: '2026-05-10T09:00:00Z',
    updatedAt: '2026-05-10T09:00:00Z',
  },
  {
    id: 'n-2',
    title: 'Budget review — April',
    body: 'SC-01 came in under budget (12Cr actual vs 40Cr planned). Investigate variance and document for stakeholder review.\nSafety costs for night shoots higher than expected.',
    createdAt: '2026-05-15T14:30:00Z',
    updatedAt: '2026-05-16T10:00:00Z',
  },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedId, setSelectedId] = useState<string | null>('n-1');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const selected = notes.find(n => n.id === selectedId) ?? null;

  function handleNewNote() {
    const now = new Date().toISOString();
    const note: Note = { id: `n-${Date.now()}`, title: '', body: '', createdAt: now, updatedAt: now };
    setNotes(prev => [note, ...prev]);
    setSelectedId(note.id);
  }

  function updateSelected(patch: Partial<Pick<Note, 'title' | 'body'>>) {
    if (!selectedId) return;
    const updatedAt = new Date().toISOString();
    setNotes(prev => prev.map(n => n.id === selectedId ? { ...n, ...patch, updatedAt } : n));
  }

  function handleDelete(id: string) {
    const title = notes.find(n => n.id === id)?.title || 'Untitled';
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) {
      const remaining = notes.filter(n => n.id !== id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
    setDeleteConfirmId(null);
    toast.success(`"${title}" deleted`);
  }

  return (
    <AppFrame>
      <div className="flex flex-col h-full">
        <div className="flex flex-row justify-between items-start mb-4">
          <PageTitle title="Notes" sub="Your personal production notes" />
          <button className="btn btn-primary btn-sm mt-1" onClick={handleNewNote}>
            <Icon name="plus" size={13} /> New Note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="card card-pad flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-xl bg-[rgba(99,102,241,.12)] flex items-center justify-center mb-3">
              <Icon name="file-text" size={18} className="text-[#a5b4fc]" />
            </div>
            <div className="text-[14px] font-semibold text-[#f0f2f5] mb-1">No notes yet</div>
            <div className="text-[13px] text-gray-500">Click &ldquo;New Note&rdquo; to get started.</div>
          </div>
        ) : (
          <div className="grid grid-cols-[260px_1fr] gap-4 flex-1 min-h-0">
            {/* Note list */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-0.5">
              {notes.map(note => (
                <div
                  key={note.id}
                  className={`card px-4 py-3 cursor-pointer transition-all${selectedId === note.id ? ' ring-1 ring-[#6366f1]' : ''}`}
                  onClick={() => setSelectedId(note.id)}
                >
                  <div className="text-[13px] font-semibold text-[#f0f2f5] truncate mb-1">{note.title || <span className="text-gray-600 italic">Untitled</span>}</div>
                  <div className="text-[11px] text-gray-500 line-clamp-2 leading-[1.5]">{note.body || 'No content'}</div>
                  <div className="text-[10px] text-gray-600 mt-1.5">{fmtDate(note.updatedAt)}</div>
                </div>
              ))}
            </div>

            {/* Note detail — inline editable */}
            {selected ? (
              <div className="card px-6 py-5 flex flex-col overflow-hidden">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <input
                    className="flex-1 text-[18px] font-bold text-[#f0f2f5] bg-transparent border-0 outline-none placeholder:text-gray-600 leading-tight min-w-0"
                    value={selected.title}
                    onChange={e => updateSelected({ title: e.target.value })}
                    placeholder="Note title…"
                  />
                  <button
                    className="btn btn-danger-ghost btn-sm shrink-0"
                    onClick={() => setDeleteConfirmId(selected.id)}
                    title="Delete note"
                  >
                    <Icon name="trash" size={12} />
                  </button>
                </div>
                <div className="text-[11px] text-gray-500 mb-3 select-none">
                  {fmtDate(selected.createdAt)}
                  {selected.updatedAt !== selected.createdAt && ` · Updated ${fmtDate(selected.updatedAt)}`}
                </div>
                <textarea
                  className="flex-1 bg-transparent border-0 outline-none text-[14px] text-[#d1d5db] leading-[1.75] resize-none placeholder:text-gray-600 min-h-0"
                  value={selected.body}
                  onChange={e => updateSelected({ body: e.target.value })}
                  placeholder="Start typing your note…"
                />
              </div>
            ) : (
              <div className="card flex items-center justify-center text-gray-600 text-[13px]">
                Select a note to view
              </div>
            )}
          </div>
        )}
      </div>

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
              className="btn btn-danger btn-sm flex-1 justify-center"
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
