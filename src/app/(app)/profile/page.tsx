"use client";

import { useState } from 'react';
import { AppFrame } from '@/components/shared/app-frame';
import { Icon } from '@/components/shared/icon';
import { Avatar } from '@/components/shared/avatar';
import { PageTitle } from '@/components/shared/page-title';
import { useAuthStore } from '@/store/auth';
import { useProductionHouse } from '@/hooks/useProductionHouse';

const ROLE_LABELS: Record<string, string> = {
  line_producer:      'Line Producer',
  executive_producer: 'Executive Producer',
  accounts_manager:   'Accounts Manager',
  silent_stakeholder: 'Silent Stakeholder',
};

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const isLP = user?.role === 'line_producer';
  const { data: house } = useProductionHouse();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [saving, setSaving] = useState(false);

  function handleSave() {
    if (!fullName.trim() || !user) return;
    setSaving(true);
    setAuth({ ...user, full_name: fullName.trim() });
    setEditing(false);
    setSaving(false);
  }

  function handleCancel() {
    setFullName(user?.full_name ?? '');
    setEditing(false);
  }

  if (!user) return null;

  const roleLabel = ROLE_LABELS[user.role ?? ''] ?? user.role ?? '—';

  return (
    <AppFrame>
      <PageTitle title="My Profile" sub="Account details and settings" />

      {/* Header card */}
      <div className="card card-pad flex items-center gap-6 mb-4">
        <Avatar name={user.full_name || user.email} size={72} />
        <div className="flex-1 min-w-0">
          <div className="text-[22px] font-bold tracking-[-0.02em]">
            {user.full_name || '—'}
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-[12px] font-medium px-[10px] py-0.5 rounded-[999px] bg-[rgba(99,102,241,.2)] text-[#a5b4fc]">
              {roleLabel}
            </span>
            {isLP && house && (
              <span className="text-[13px] text-gray-500">{house.name}</span>
            )}
          </div>
        </div>
        {!editing && (
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
            <Icon name="edit" size={12} /> Edit Profile
          </button>
        )}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Personal info */}
        <div className="card card-pad">
          <div className="label mb-4">Personal Information</div>

          <Field label="Email" icon="mail" value={user.email} />

          {editing ? (
            <div className="py-[14px] border-b border-[rgba(255,255,255,.08)]">
              <div className="text-[11px] text-gray-400 mb-1.5">Full Name</div>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                autoFocus
                className="w-full text-[14px] font-medium border-[1.5px] border-[#6366f1] rounded-[6px] px-[10px] py-[7px] outline-none bg-[rgba(255,255,255,.07)] text-[#f0f2f5]"
              />
              <div className="flex gap-2 mt-[10px]">
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !fullName.trim()}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          ) : (
            <Field label="Full Name" icon="user" value={user.full_name || '—'} />
          )}
        </div>

        {/* Account info */}
        <div className="card card-pad">
          <div className="label mb-4">Account</div>
          <Field label="Role" icon="shield" value={roleLabel} />
          {isLP && <Field label="Production House" icon="building" value={house?.name ?? '—'} />}
        </div>

      </div>
    </AppFrame>
  );
}

function Field({ label, icon, value }: { label: string; icon: string; value: string }) {
  return (
    <div className="py-3 border-b border-[rgba(255,255,255,.08)]">
      <div className="flex items-center gap-2">
        <Icon name={icon} size={13} className="text-gray-400 shrink-0" />
        <span className="text-[11px] text-gray-400">{label}</span>
      </div>
      <div className="text-[14px] font-medium mt-1 pl-[21px]">{value}</div>
    </div>
  );
}
