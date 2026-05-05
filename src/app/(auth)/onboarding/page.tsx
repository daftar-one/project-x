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
    <div className="min-h-screen bg-[#0f1729] flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl pt-[44px] px-[40px] pb-9 w-full max-w-[440px] shadow-[0_20px_60px_-12px_rgba(0,0,0,.4)]">
        <div className="flex justify-center mb-[22px]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#eef2ff] to-[#fce7f3] flex items-center justify-center text-[#6366f1]">
            <Icon name="building" size={24} />
          </div>
        </div>
        <h1 className="text-[22px] font-semibold text-center m-0 tracking-[-0.02em]">
          Set up your Production House
        </h1>
        <p className="text-[13px] text-gray-500 text-center m-0 mt-2">
          Everything you create — projects, scenes, budgets — lives under your house.
        </p>

        <div className="mt-7">
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
              <span className="text-gray-400 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              className="flex items-center gap-[14px] border-[1.5px] border-dashed border-[#e5e7eb] rounded-lg p-[14px] cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div
                className="w-11 h-11 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-gray-400"
                style={{
                  background: logoPreview ? 'transparent' : '#f9fafb',
                  border: logoPreview ? 'none' : '1px dashed #d4d6db',
                }}
              >
                {logoPreview
                  ? <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  : <Icon name="upload" size={16} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                  {logoFile ? logoFile.name : 'Click to upload or drag & drop'}
                </div>
                <div className="text-[11px] text-gray-400">PNG, SVG, JPG or WebP · up to 2 MB · square recommended</div>
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
          className="btn btn-primary btn-full mt-2"
          onClick={handleSubmit}
          disabled={!fullName.trim() || !name.trim() || loading}
        >
          {loading ? "Creating…" : "Get Started"} <Icon name="arrowRight" size={14} />
        </button>
      </div>
    </div>
  );
}
