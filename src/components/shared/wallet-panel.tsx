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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      {/* Balance */}
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>
          {scope === 'scene' ? 'Scene Wallet' : 'Wallet Balance'}
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.03em', color: '#f0f2f5' }}>
          {wallet ? fmtShort(wallet.balance) : '—'}
        </div>
        {/* {wallet && (
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
            {fmt(wallet.balance)}
          </div>
        )} */}
      </div>

      {/* Action buttons / form */}
      <div style={{ padding: '0 20px 16px' }}>
        {!mode ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => scope === 'ph' ? setMode('add') : setAddDialogOpen(true)}
            >
              <Icon name="plus" size={13} /> Add
            </button>
            {scope === 'scene' && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ flex: 1, justifyContent: 'center', color: '#f87171', borderColor: 'rgba(248,113,113,.3)' }}
                onClick={() => setMode('remove')}
              >
                <Icon name="minus" size={13} /> Remove
              </button>
            )}
          </div>
        ) : (
          <div style={{
            background: mode === 'add' ? 'rgba(99,102,241,.08)' : 'rgba(239,68,68,.08)',
            border: `1px solid ${mode === 'add' ? 'rgba(99,102,241,.2)' : 'rgba(239,68,68,.2)'}`,
            borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ fontSize: 11, color: mode === 'add' ? '#a5b4fc' : '#f87171', fontWeight: 600, marginBottom: 2 }}>
              {mode === 'add' ? 'Add Funds' : 'Remove Funds'}
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,.07)',
                border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '7px 10px',
                color: '#f0f2f5', fontSize: 13, outline: 'none',
              }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn btn-sm"
                style={{
                  flex: 1, justifyContent: 'center',
                  background: mode === 'add' ? '#6366f1' : '#ef4444',
                  color: '#fff', border: 'none',
                }}
                onClick={handleSubmit}
              >
                {mode === 'add' ? 'Add' : 'Remove'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => { setMode(null); setAmount(''); }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '0 20px' }} />

      {/* Transactions */}
      {/* <div style={{ flex: 1, overflow: 'auto', padding: '12px 0' }}>
        <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', padding: '0 20px', marginBottom: 8 }}>
          Transactions
        </div>
        {recent.length === 0 ? (
          <div style={{ fontSize: 12, color: '#6b7280', padding: '8px 20px' }}>No transactions yet</div>
        ) : (
          recent.map(tx => (
            <div key={tx.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 20px',
              borderBottom: '1px solid rgba(255,255,255,.04)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: tx.type === 'credit' ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.12)',
              }}>
                <Icon
                  name={tx.type === 'credit' ? 'trend' : 'trendDown'}
                  size={12}
                  style={{ color: tx.type === 'credit' ? '#34d399' : '#f87171' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: '#e5e7eb', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tx.description || (tx.type === 'credit' ? 'Top-up' : 'Payment')}
                </div>
                {tx.vendor_name && (
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{tx.vendor_name}</div>
                )}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600, flexShrink: 0,
                color: tx.type === 'credit' ? '#34d399' : '#f87171',
              }}>
                {tx.type === 'credit' ? '+' : '-'}{fmtShort(tx.amount)}
              </div>
            </div>
          ))
        )}
      </div> */}
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
