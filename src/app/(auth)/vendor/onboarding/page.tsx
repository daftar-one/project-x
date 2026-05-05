"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const canContinue = name.trim() && email.trim() && phone.trim() && location.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canContinue) return;
    sessionStorage.setItem("vendor_data", JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), location: location.trim() }));
    sessionStorage.setItem("vendor_otp_email", email.trim());
    router.push("/vendor/login/verify");
  }

  return (
    <>
      <style>{`
        @keyframes authOrbA {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(40px,-30px) scale(1.06); }
          70%      { transform: translate(-20px,40px) scale(.95); }
        }
        @keyframes authOrbB {
          0%,100% { transform: translate(0,0) scale(1); }
          35%      { transform: translate(-50px,30px) scale(1.04); }
          65%      { transform: translate(30px,-40px) scale(.96); }
        }
        @keyframes authFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .auth-card { animation: authFadeUp .5s cubic-bezier(.22,.68,0,1.2) .05s both; }
        .auth-card .input-underline input::placeholder { color: #3d4657; }
      `}</style>

      <div className="min-h-screen bg-[#080e1e] flex flex-col items-center justify-center p-6 relative overflow-hidden font-[var(--font-inter,ui-sans-serif,system-ui,sans-serif)]">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }} />
          <div style={{
            position: 'absolute', top: '-15%', right: '-5%',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'authOrbA 18s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', left: '-5%',
            width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,62,140,.14) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'authOrbB 22s ease-in-out infinite',
          }} />
        </div>

        <div className="relative z-[1] w-full max-w-[420px] flex flex-col items-center gap-7">

          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center text-white text-[12px] font-extrabold tracking-[-0.02em]">PX</div>
            <span className="font-bold text-[16px] tracking-[-0.02em] text-[#f0f2f5]">Project X</span>
          </Link>

          <div className="auth-card w-full bg-[rgba(20,26,48,.9)] backdrop-blur-[20px] border border-[rgba(255,255,255,.09)] rounded-2xl pt-9 px-8 pb-7 shadow-[0_32px_64px_-16px_rgba(0,0,0,.6),0_0_0_1px_rgba(99,102,241,.08)]">
            <div className="flex justify-center mb-5">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-[rgba(99,102,241,.12)] border border-[rgba(99,102,241,.2)] flex items-center justify-center text-[#818cf8]">
                <Icon name="user" size={22} />
              </div>
            </div>

            <h1 className="text-[20px] font-semibold text-center m-0 mb-1.5 tracking-[-0.02em] text-[#f9fafb]">
              Vendor Registration
            </h1>
            <p className="text-[13px] text-gray-500 text-center m-0 mb-7">
              Create your vendor account to get started.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="field">
                <label className="label">Full Name</label>
                <div className="input-underline">
                  <Icon name="user" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Email Address</label>
                <div className="input-underline">
                  <Icon name="mail" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Phone Number</label>
                <div className="input-underline">
                  <Icon name="bell" size={16} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Location</label>
                <div className="input-underline">
                  <Icon name="mapPin" size={16} />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full mt-1"
                disabled={!canContinue}
              >
                Continue <Icon name="arrowRight" size={14} />
              </button>
            </form>

            <div className="text-center mt-5">
              <span className="text-[12px] text-gray-600">Already registered? </span>
              <Link href="/vendor/login" className="text-[12px] text-[#818cf8] no-underline font-medium">
                Sign in
              </Link>
            </div>
          </div>

          <div className="text-[11px] text-[#374151] flex gap-2">
            <span>Project X</span>
            <span>·</span>
            <span>v0.9 · staging</span>
          </div>
        </div>
      </div>
    </>
  );
}
