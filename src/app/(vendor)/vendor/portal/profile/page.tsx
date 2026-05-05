"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";
import { Avatar } from "@/components/shared/avatar";
import { VendorFrame } from "@/components/shared/vendor-frame";
import { PageTitle } from "@/components/shared/page-title";
import { useVendorStore } from "@/store/vendor-auth";
import { toast } from "sonner";

export default function VendorProfilePage() {
  const { name, email, phone, location, updateProfile } = useVendorStore();

  const [editName, setEditName] = useState(name ?? "");
  const [editPhone, setEditPhone] = useState(phone ?? "");
  const [editLocation, setEditLocation] = useState(location ?? "");
  const [saving, setSaving] = useState(false);

  const isDirty = editName !== name || editPhone !== phone || editLocation !== location;

  function handleSave() {
    if (!editName.trim()) return;
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name: editName.trim(), phone: editPhone.trim(), location: editLocation.trim() });
      toast.success("Profile updated");
      setSaving(false);
    }, 400);
  }

  const vendorName = name || email || "Vendor";

  return (
    <VendorFrame>
      <PageTitle title="Profile" sub="Manage your account details" />

      <div className="max-w-[520px]">
        {/* Header card */}
        <div className="card card-pad flex items-center gap-4 mb-4">
          <Avatar name={vendorName} color="#6366f1" size={56} />
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-bold tracking-[-0.02em] text-[#f9fafb]">{vendorName}</div>
            <div className="flex items-center gap-2 mt-[5px]">
              <span className="text-[11px] font-semibold py-0.5 px-[9px] rounded-[999px] bg-[rgba(99,102,241,.2)] text-[#a5b4fc]">Vendor</span>
              {email && <span className="text-[12px] text-gray-500">{email}</span>}
            </div>
          </div>
        </div>

        {/* Edit card */}
        <div className="card card-pad">
          <div className="label mb-4">Personal Information</div>

          <div className="field">
            <label className="label">Full Name</label>
            <div className="input-underline">
              <Icon name="user" size={16} />
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Email Address</label>
            <div className="input-underline opacity-[0.45]">
              <Icon name="mail" size={16} />
              <input type="email" value={email ?? ""} disabled />
            </div>
            <div className="text-[11px] text-gray-600 mt-1">Email cannot be changed</div>
          </div>

          <div className="field">
            <label className="label">Phone Number</label>
            <div className="input-underline">
              <Icon name="phone" size={16} />
              <input
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="field mb-0">
            <label className="label">Location</label>
            <div className="input-underline">
              <Icon name="mapPin" size={16} />
              <input
                type="text"
                value={editLocation}
                onChange={e => setEditLocation(e.target.value)}
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="btn btn-primary btn-sm"
              disabled={!isDirty || saving || !editName.trim()}
              onClick={handleSave}
            >
              {saving ? "Saving…" : <><Icon name="check" size={13} /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </VendorFrame>
  );
}
