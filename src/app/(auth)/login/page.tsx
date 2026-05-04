"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(s => s.setAuth);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setAuth({ id: "u-1", email, full_name: "Demo User", role: "line_producer", is_onboarded: true });
    router.push("/dashboard");
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

        {/* Animated background */}
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

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>

          {/* Wordmark */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg,#6366f1,#e83e8c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '-.02em',
            }}>PX</div>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-.02em', color: '#f0f2f5' }}>Project X</span>
          </Link>

          {/* Card */}
          <div className="auth-card" style={{
            width: '100%',
            background: 'rgba(20,26,48,.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,.09)',
            borderRadius: 16,
            padding: '36px 32px 28px',
            boxShadow: '0 32px 64px -16px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.08)',
          }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', margin: '0 0 6px', letterSpacing: '-.02em', color: '#f9fafb' }}>
              Sign in to Project X
            </h1>
            <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', margin: '0 0 28px' }}>
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
                    placeholder="you@production.in"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading || !email.trim()}
                style={{ marginTop: 4 }}
              >
                {loading ? 'Sending…' : <>Continue <Icon name="arrowRight" size={14} /></>}
              </button>
            </form>

            <p style={{ fontSize: 11, color: '#374151', textAlign: 'center', marginTop: 20, marginBottom: 0, lineHeight: 1.6 }}>
              By continuing you agree to our Terms of Service and Privacy Policy.
            </p>
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
