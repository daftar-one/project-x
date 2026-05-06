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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [addUnit, setAddUnit] = useState<AmountUnit>('L');

  const addAmountVal = (parseFloat(addAmount) || 0) * UNIT_MULT[addUnit];

  function handleAdd() {
    if (addAmountVal <= 0) return;
    setConfirmOpen(true);
  }

  function handleConfirm() {
    onAddMoney(addAmountVal);
    setAddAmount('');
    setAddUnit('L');
    setShowAdd(false);
    setConfirmOpen(false);
  }

  return (
    <div className="card flex flex-col h-full">
      <div className="px-[14px] py-3 shrink-0">
        {/* Label */}
        <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.07em] mb-[5px]">
          Wallet Balance
        </div>

        {/* Balance amount */}
        <div
          className="num text-[20px] font-bold tracking-[-0.02em] mb-[14px]"
          style={{ color: isDraft ? '#4b5563' : '#f0f2f5' }}
        >
          {isDraft ? '—' : fmtShort(walletBalance)}
        </div>

        {!isDraft && !showAdd && (
          <div className="flex flex-col gap-1.5">
            <button
              className="btn btn-primary btn-sm w-full justify-center"
              onClick={() => setShowAdd(true)}
            >
              <Icon name="plus" size={12} /> Add Money
            </button>
            <button
              className="btn btn-secondary btn-sm w-full justify-center"
              onClick={() => setHistoryOpen(true)}
            >
              <Icon name="clock" size={12} /> History
            </button>
          </div>
        )}

        {!isDraft && showAdd && (
          <div className="flex flex-col gap-[10px]">
            <div className="text-[11px] font-semibold text-[#a5b4fc]">Add Money</div>

            <div className="flex items-center gap-1.5">
              <input
                type="number"
                autoFocus
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent border-0 border-b border-[rgba(255,255,255,.18)] text-[#f0f2f5] text-[13px] py-1 outline-none flex-1 min-w-0"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
              <select
                value={addUnit}
                onChange={e => setAddUnit(e.target.value as AmountUnit)}
                className="bg-[rgba(255,255,255,.07)] border border-[rgba(255,255,255,.12)] rounded text-[10px] font-bold text-[#a5b4fc] outline-none cursor-pointer shrink-0 py-0.5 px-1"
              >
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="Cr">Cr</option>
              </select>
            </div>

            <div className="flex gap-1.5">
              <button
                className="btn btn-primary btn-sm flex-1 justify-center"
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

      {/* Confirm Add Money Modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="p-8">
          <div className="text-[16px] font-bold text-[#f9fafb] mb-2">Confirm Add Money</div>
          <p className="text-[13px] text-gray-400 m-0 mb-5 leading-[1.7]">
            Are you sure you want to add <span className="text-[#34d399] font-semibold">{fmtShort(addAmountVal)}</span> to this wallet?
          </p>
          <div className="flex gap-2">
            <button className="btn btn-secondary btn-sm flex-1 justify-center" onClick={() => setConfirmOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm flex-1 justify-center" onClick={handleConfirm}>
              <Icon name="check" size={13} /> Confirm
            </button>
          </div>
        </div>
      </Modal>

      {/* History Modal */}
      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)}>
        <div className="pt-5">
          {/* Header */}
          <div className="flex items-start justify-between px-5 pb-4 border-b border-[rgba(255,255,255,.06)]">
            <div>
              <div className="text-[14px] font-bold text-[#f9fafb]">Wallet History</div>
            </div>
            <button
              className="bg-transparent border-0 text-gray-500 cursor-pointer p-1 -mt-0.5"
              onClick={() => setHistoryOpen(false)}
            >
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Credits list */}
          <div className="max-h-[360px] overflow-y-auto">
            {walletCredits.length === 0 ? (
              <div className="text-[12px] text-gray-600 px-5 py-6 text-center">
                No funds added yet
              </div>
            ) : (
              [...walletCredits].reverse().map(c => (
                <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-[rgba(255,255,255,.04)]">
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-gray-500 flex flex-col gap-0">
                      {c.addedBy && <span className="text-gray-400">{c.addedBy}</span>}
                      <span>
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}
                        {new Date(c.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="num text-[13px] font-bold text-[#34d399] shrink-0">
                    +{fmtShort(c.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
