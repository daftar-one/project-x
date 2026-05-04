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

      <div style={{ maxWidth: 520 }}>
        {/* Header card */}
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <Avatar name={vendorName} color="#6366f1" size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.02em", color: "#f9fafb" }}>{vendorName}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 999,
                background: "rgba(99,102,241,.2)", color: "#a5b4fc",
              }}>Vendor</span>
              {email && <span style={{ fontSize: 12, color: "#6b7280" }}>{email}</span>}
            </div>
          </div>
        </div>

        {/* Edit card */}
        <div className="card card-pad">
          <div className="label" style={{ marginBottom: 16 }}>Personal Information</div>

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
            <div className="input-underline" style={{ opacity: 0.45 }}>
              <Icon name="mail" size={16} />
              <input type="email" value={email ?? ""} disabled />
            </div>
            <div style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>Email cannot be changed</div>
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

          <div className="field" style={{ marginBottom: 0 }}>
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

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
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
