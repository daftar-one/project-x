"use client";

import { useState } from 'react';
import { Icon } from './icon';
import { fmtShort } from '@/lib/format';
import type { Wallet } from '@/lib/types';
import { AddFundsDialog } from './add-funds-dialog';

interface WalletPanelProps {
  wallet: Wallet | null;
  scope: 'ph' | 'project' | 'scene';
  projectId?: string;
  sceneId?: string;
  onRefresh: () => void;
}

export function WalletPanel({ wallet, scope, projectId, sceneId, onRefresh }: WalletPanelProps) {
  const [mode, setMode] = useState<'add' | 'remove' | null>(null);
  const [amount, setAmount] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  function handleSubmit() {
    const amt = parseInt(amount.replace(/,/g, ''), 10);
    if (!amt || amt <= 0) return;
    setMode(null);
    setAmount('');
    onRefresh();
  }

  const transactions = wallet?.transactions ?? [];
  const recent = [...transactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 10);
  void recent;

  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Balance */}
      <div className="px-5 pt-5 pb-4">
        <div className="text-[11px] text-gray-500 uppercase tracking-[0.07em] mb-1.5">
          {scope === 'scene' ? 'Scene Wallet' : 'Wallet Balance'}
        </div>
        <div className="text-[28px] font-bold tracking-[-0.03em] text-[#f0f2f5]">
          {wallet ? fmtShort(wallet.balance) : '—'}
        </div>
      </div>

      {/* Action buttons / form */}
      <div className="px-5 pb-4">
        {!mode ? (
          <div className="flex gap-1.5">
            <button
              className="btn btn-primary btn-sm flex-1 justify-center"
              onClick={() => scope === 'ph' ? setMode('add') : setAddDialogOpen(true)}
            >
              <Icon name="plus" size={13} /> Add
            </button>
            {scope === 'scene' && (
              <button
                className="btn btn-ghost btn-sm flex-1 justify-center text-[#f87171] border-[rgba(248,113,113,.3)]"
                onClick={() => setMode('remove')}
              >
                <Icon name="minus" size={13} /> Remove
              </button>
            )}
          </div>
        ) : (
          <div
            className="rounded-lg p-3 flex flex-col gap-2"
            style={{
              background: mode === 'add' ? 'rgba(99,102,241,.08)' : 'rgba(239,68,68,.08)',
              border: `1px solid ${mode === 'add' ? 'rgba(99,102,241,.2)' : 'rgba(239,68,68,.2)'}`,
            }}
          >
            <div className="text-[11px] font-semibold mb-0.5" style={{ color: mode === 'add' ? '#a5b4fc' : '#f87171' }}>
              {mode === 'add' ? 'Add Funds' : 'Remove Funds'}
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
              className="w-full bg-[rgba(255,255,255,.07)] border border-[rgba(255,255,255,.1)] rounded-[6px] px-[10px] py-[7px] text-[#f0f2f5] text-[13px] outline-none"
            />
            <div className="flex gap-1.5">
              <button
                className="btn btn-sm flex-1 justify-center text-white border-0"
                style={{ background: mode === 'add' ? '#6366f1' : '#ef4444' }}
                onClick={handleSubmit}
              >
                {mode === 'add' ? 'Add' : 'Remove'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setMode(null); setAmount(''); }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-[rgba(255,255,255,.06)] mx-5" />

      <AddFundsDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        scope={scope === 'ph' ? 'ph' : scope}
        projectId={projectId}
        sceneId={sceneId}
      />
    </div>
  );
}
