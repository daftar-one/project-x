"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/icon";
import { useAuthStore } from "@/store/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const { setProductionHouseId, setAuth, user } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [name, setName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleRemoveLogo(e: React.MouseEvent) {
    e.stopPropagation();
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit() {
    if (!fullName.trim() || !name.trim()) return;
    setLoading(true);
    if (user) setAuth({ ...user, full_name: fullName.trim(), role: "line_producer", is_onboarded: true });
    setProductionHouseId("ph-1");
    router.push("/dashboard");
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1729',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '44px 40px 36px',
        width: '100%', maxWidth: 440,
        boxShadow: '0 20px 60px -12px rgba(0,0,0,.4)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg,#eef2ff,#fce7f3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1',
          }}>
            <Icon name="building" size={24} />
          </div>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 600, textAlign: 'center', margin: 0, letterSpacing: '-.02em' }}>
          Set up your Production House
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', margin: '8px 0 0' }}>
          Everything you create — projects, scenes, budgets — lives under your house.
        </p>

        <div style={{ marginTop: 28 }}>
          <div className="field">
            <label className="label">Your Full Name</label>
            <div className="input-underline">
              <Icon name="user" size={16} />
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                autoFocus
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Production House Name</label>
            <div className="input-underline">
              <Icon name="building" size={16} />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Starlight Films Pvt. Ltd."
              />
            </div>
          </div>

          <div className="field">
            <label className="label">
              Logo{' '}
              <span style={{ color: '#9ca3af', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                border: '1.5px dashed #e5e7eb', borderRadius: 8, padding: 14, cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                background: logoPreview ? 'transparent' : '#f9fafb',
                border: logoPreview ? 'none' : '1px dashed #d4d6db',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9ca3af',
              }}>
                {logoPreview
                  ? <img src={logoPreview} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Icon name="upload" size={16} />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {logoFile ? logoFile.name : 'Click to upload or drag & drop'}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>PNG, SVG, JPG or WebP · up to 2 MB · square recommended</div>
              </div>
              {logoFile && (
                <button className="btn btn-ghost btn-sm" onClick={handleRemoveLogo}>
                  <Icon name="x" size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 8 }}
          onClick={handleSubmit}
          disabled={!fullName.trim() || !name.trim() || loading}
        >
          {loading ? "Creating…" : "Get Started"} <Icon name="arrowRight" size={14} />
        </button>
      </div>
    </div>
  );
}
