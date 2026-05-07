"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Avatar } from "@/components/shared/avatar";
import { VendorFrame } from "@/components/shared/vendor-frame";
import { PageTitle } from "@/components/shared/page-title";
import { useVendorStore } from "@/store/vendor-auth";

const DEMO = {
  company:  "Prime VFX Studios",
  repName:  "Ananya Singh",
  email:    "contact@primevfx.com",
  phone:    "+91 87654 32109",
  location: "Andheri West, Mumbai",
  // category: "VFX & Post Production",
};

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

export default function VendorProfilePage() {
  const { name, email, phone, location, updateProfile } = useVendorStore();

  const displayEmail    = email    || DEMO.email;
  const displayRepName  = name     || DEMO.repName;
  const displayPhone    = phone    || DEMO.phone;
  const displayLocation = location || DEMO.location;

  const [editing, setEditing]       = useState(false);
  const [editRepName,  setEditRepName]  = useState(displayRepName);
  const [editPhone,    setEditPhone]    = useState(displayPhone);
  const [editLocation, setEditLocation] = useState(displayLocation);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    if (!editRepName.trim()) return;
    setSaving(true);
    updateProfile({ name: editRepName.trim(), phone: editPhone.trim(), location: editLocation.trim() });
    setEditing(false);
    setSaving(false);
  }

  function handleCancel() {
    setEditRepName(displayRepName);
    setEditPhone(displayPhone);
    setEditLocation(displayLocation);
    setEditing(false);
  }

  return (
    <VendorFrame>
      <PageTitle title="My Profile" sub="Account details and settings" />

      {/* Header card */}
      <div className="card card-pad flex items-center gap-6 mb-4">
        <Avatar name={DEMO.company} color="#6366f1" size={72} />
        <div className="flex-1 min-w-0">
          <div className="text-[22px] font-bold tracking-[-0.02em]">{DEMO.company}</div>
          {/* <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-[12px] font-medium px-[10px] py-0.5 rounded-[999px] bg-[rgba(99,102,241,.2)] text-[#a5b4fc]">
              {DEMO.category}
            </span>
          </div> */}
        </div>
        {!editing && (
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
            <Icon name="edit" size={12} /> Edit Profile
          </button>
        )}
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Company info */}
        <div className="card card-pad mr-4">
          <div className="label mb-4">Company Information</div>

          <Field label="Company Name" icon="building" value={DEMO.company} />
          {/* <Field label="Category"     icon="list"     value={DEMO.category} /> */}

          {editing ? (
            <div className="py-[14px] border-b border-[rgba(255,255,255,.08)]">
              <div className="text-[11px] text-gray-400 mb-1.5">Location</div>
              <input
                value={editLocation}
                onChange={e => setEditLocation(e.target.value)}
                className="w-full text-[14px] font-medium border-[1.5px] border-[#6366f1] rounded-[6px] px-[10px] py-[7px] outline-none bg-[rgba(255,255,255,.07)] text-[#f0f2f5]"
                placeholder="City, State"
              />
            </div>
          ) : (
            <Field label="Location" icon="mapPin" value={displayLocation} />
          )}
        </div>

        {/* Contact info */}
        <div className="card card-pad">
          <div className="label mb-4">Contact Information</div>

          <Field label="Email" icon="mail" value={displayEmail} />

          {editing ? (
            <>
              <div className="py-[14px] border-b border-[rgba(255,255,255,.08)]">
                <div className="text-[11px] text-gray-400 mb-1.5">Representative Name</div>
                <input
                  value={editRepName}
                  onChange={e => setEditRepName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                  autoFocus
                  className="w-full text-[14px] font-medium border-[1.5px] border-[#6366f1] rounded-[6px] px-[10px] py-[7px] outline-none bg-[rgba(255,255,255,.07)] text-[#f0f2f5]"
                  placeholder="Representative name"
                />
              </div>
              <div className="py-[14px] border-b border-[rgba(255,255,255,.08)]">
                <div className="text-[11px] text-gray-400 mb-1.5">Phone Number</div>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full text-[14px] font-medium border-[1.5px] border-[#6366f1] rounded-[6px] px-[10px] py-[7px] outline-none bg-[rgba(255,255,255,.07)] text-[#f0f2f5]"
                  placeholder="Phone number"
                />
              </div>
              <div className="flex gap-2 mt-[10px]">
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !editRepName.trim()}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <Field label="Representative" icon="user"  value={displayRepName} />
              <Field label="Phone"          icon="phone" value={displayPhone}   />
            </>
          )}
        </div>

      </div>
    </VendorFrame>
  );
}
