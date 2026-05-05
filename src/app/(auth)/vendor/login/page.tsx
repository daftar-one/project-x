"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
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

        <div className="relative z-[1] w-full max-w-[400px] flex flex-col items-center gap-7">

          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center text-white text-[12px] font-extrabold tracking-[-0.02em]">PX</div>
            <span className="font-bold text-[16px] tracking-[-0.02em] text-[#f0f2f5]">Project X</span>
          </Link>

          <div className="auth-card w-full bg-[rgba(20,26,48,.9)] backdrop-blur-[20px] border border-[rgba(255,255,255,.09)] rounded-2xl pt-9 px-8 pb-7 shadow-[0_32px_64px_-16px_rgba(0,0,0,.6),0_0_0_1px_rgba(99,102,241,.08)]">
            <h1 className="text-[20px] font-semibold text-center m-0 mb-1.5 tracking-[-0.02em] text-[#f9fafb]">
              Vendor Sign In
            </h1>
            <p className="text-[13px] text-gray-500 text-center m-0 mb-7">
              We&apos;ll send a one-time code to your email.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Email address</label>
                <div className="input-underline">
                  <Icon name="mail" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full mt-1"
                disabled={!email.trim()}
              >
                Continue <Icon name="arrowRight" size={14} />
              </button>
            </form>

            <div className="flex items-center gap-2.5 mt-5">
              <div className="flex-1 h-px bg-[rgba(255,255,255,.07)]" />
              <span className="text-[11px] text-[#374151]">New vendor?</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,.07)]" />
            </div>
            <Link
              href="/vendor/onboarding"
              className="flex items-center justify-center gap-1.5 mt-3 text-[13px] text-[#818cf8] no-underline font-medium"
            >
              Register here <Icon name="arrowRight" size={13} />
            </Link>
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
