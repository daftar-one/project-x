"use client";

import { useState } from 'react';
import { Icon } from './icon';
import { Modal } from './modal';
import { fmtShort } from '@/lib/format';

const UNIT_MULT = { K: 1_000, L: 1_00_000, Cr: 1_00_00_000 } as const;
type AmountUnit = keyof typeof UNIT_MULT;

export interface WalletCredit {
  id: string;
  amount: number;
  createdAt: string;
  addedBy: string;
}

interface Props {
  walletBalance: number;
  walletCredits: WalletCredit[];
  onAddMoney: (amount: number) => void;
  isDraft?: boolean;
}

export function TransactionHistory({ walletBalance, walletCredits, onAddMoney, isDraft }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [addUnit, setAddUnit] = useState<AmountUnit>('L');

  const addAmountVal = (parseFloat(addAmount) || 0) * UNIT_MULT[addUnit];

  function handleAdd() {
    if (addAmountVal <= 0) return;
    onAddMoney(addAmountVal);
    setAddAmount('');
    setAddUnit('L');
    setShowAdd(false);
  }

  const unitSel: React.CSSProperties = {
    background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 4, padding: '2px 4px', fontSize: 10, fontWeight: 700,
    color: '#a5b4fc', outline: 'none', cursor: 'pointer', flexShrink: 0,
  };

  const inputBase: React.CSSProperties = {
    background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,.18)',
    color: '#f0f2f5', fontSize: 13, padding: '4px 0', outline: 'none', flex: 1, minWidth: 0,
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 14px', flexShrink: 0 }}>
        {/* Label */}
        <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>
          Wallet Balance
        </div>

        {/* Balance amount */}
        <div className="num" style={{
          fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 14,
          color: isDraft ? '#4b5563' : '#f0f2f5',
        }}>
          {isDraft ? '—' : fmtShort(walletBalance)}
        </div>

        {!isDraft && !showAdd && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setShowAdd(true)}
            >
              <Icon name="plus" size={12} /> Add Money
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setHistoryOpen(true)}
            >
              <Icon name="clock" size={12} /> History
            </button>
          </div>
        )}

        {!isDraft && showAdd && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#a5b4fc' }}>Add Money</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="number"
                autoFocus
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
                placeholder="0"
                style={inputBase}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <select value={addUnit} onChange={e => setAddUnit(e.target.value as AmountUnit)} style={unitSel}>
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="Cr">Cr</option>
              </select>
            </div>

            {/* {addAmountVal > 0 && (
              <div style={{ fontSize: 10, color: '#6b7280' }}>= {fmtShort(addAmountVal)}</div>
            )} */}

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleAdd}
                disabled={addAmountVal <= 0}
              >
                <Icon name="check" size={12} /> Add
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setShowAdd(false); setAddAmount(''); setAddUnit('L'); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Modal */}
      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <div style={{ padding: '20px 0 0' }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            padding: '0 20px 16px', borderBottom: '1px solid rgba(255,255,255,.06)',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>Wallet History</div>
              {/* <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Money added to this scene wallet</div> */}
            </div>
            <button
              style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 4, marginTop: -2 }}
              onClick={() => setHistoryOpen(false)}
            >
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Credits list */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {walletCredits.length === 0 ? (
              <div style={{ fontSize: 12, color: '#4b5563', padding: '24px 20px', textAlign: 'center' }}>
                No funds added yet
              </div>
            ) : (
              [...walletCredits].reverse().map(c => (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,.04)',
                }}>
                  {/* <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="trend" size={13} style={{ color: '#34d399' }} />
                  </div> */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* <div style={{ fontSize: 13, color: '#e5e7eb', fontWeight: 500 }}>Funds Added</div> */}
                    <div style={{ fontSize: 11, color: '#6b7280', display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {c.addedBy && <span style={{ color: '#9ca3af' }}>{c.addedBy}</span>}
                      <span>
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}
                        {new Date(c.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="num" style={{ fontSize: 13, fontWeight: 700, color: '#34d399', flexShrink: 0 }}>
                    +{fmtShort(c.amount)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Total Added</span>
              <span className="num" style={{ fontSize: 13, fontWeight: 700, color: '#f0f2f5' }}>
                {fmtShort(walletCredits.reduce((s, c) => s + c.amount, 0))}
              </span>
            </div>
          </div> */}
        </div>
      </Modal>
    </div>
  );
}
