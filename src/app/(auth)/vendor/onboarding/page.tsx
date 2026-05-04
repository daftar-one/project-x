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

      <div style={{
        minHeight: '100vh', background: '#080e1e',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, position: 'relative', overflow: 'hidden',
        fontFamily: 'var(--font-inter, ui-sans-serif, system-ui, sans-serif)',
      }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
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

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>

          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg,#6366f1,#e83e8c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '-.02em',
            }}>PX</div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-.02em', color: '#f0f2f5' }}>Project X</span>
          </Link>

          <div className="auth-card" style={{
            width: '100%',
            background: 'rgba(20,26,48,.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,.09)',
            borderRadius: 16,
            padding: '36px 32px 28px',
            boxShadow: '0 32px 64px -16px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(99,102,241,.12)',
                border: '1px solid rgba(99,102,241,.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#818cf8',
              }}>
                <Icon name="user" size={22} />
              </div>
            </div>

            <h1 style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', margin: '0 0 6px', letterSpacing: '-.02em', color: '#f9fafb' }}>
              Vendor Registration
            </h1>
            <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', margin: '0 0 28px' }}>
              Create your vendor account to get started.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                className="btn btn-primary btn-full"
                disabled={!canContinue}
                style={{ marginTop: 4 }}
              >
                Continue <Icon name="arrowRight" size={14} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <span style={{ fontSize: 12, color: '#4b5563' }}>Already registered? </span>
              <Link href="/vendor/login" style={{ fontSize: 12, color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}>
                Sign in
              </Link>
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#374151', display: 'flex', gap: 8 }}>
            <span>Project X</span>
            <span>·</span>
            <span>v0.9 · staging</span>
          </div>
        </div>
      </div>
    </>
  );
}
