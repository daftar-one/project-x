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
      <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
        <Avatar name={user.full_name || user.email} size={72} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em' }}>
            {user.full_name || '—'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 12, fontWeight: 500, padding: '2px 10px', borderRadius: 999,
              background: 'rgba(99,102,241,.2)', color: '#a5b4fc',
            }}>{roleLabel}</span>
            {isLP && house && (
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                {house.name}
              </span>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Personal info */}
        <div className="card card-pad">
          <div className="label" style={{ marginBottom: 16 }}>Personal Information</div>

          <Field label="Email" icon="mail" value={user.email} />

          {editing ? (
            <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>Full Name</div>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                autoFocus
                style={{
                  width: '100%', fontSize: 14, fontWeight: 500, boxSizing: 'border-box',
                  border: '1.5px solid #6366f1', borderRadius: 6, padding: '7px 10px', outline: 'none',
                  background: 'rgba(255,255,255,.07)', color: '#f0f2f5',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
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
          <div className="label" style={{ marginBottom: 16 }}>Account</div>
          <Field label="Role" icon="shield" value={roleLabel} />
          {isLP && <Field label="Production House" icon="building" value={house?.name ?? '—'} />}
        </div>

      </div>
    </AppFrame>
  );
}

function Field({ label, icon, value }: { label: string; icon: string; value: string }) {
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name={icon} size={13} style={{ color: '#9ca3af', flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{label}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4, paddingLeft: 21 }}>{value}</div>
    </div>
  );
}
