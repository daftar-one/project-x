"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { useVendorStore } from "@/store/vendor-auth";
import { toast } from "sonner";

export default function VendorVerifyPage() {
  const router = useRouter();
  const { setVendor, login } = useVendorStore();
  const [email, setEmail] = useState("");
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(27);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("vendor_otp_email");
    if (!stored) { router.push("/vendor/login"); return; }
    setEmail(stored);
    setIsOnboarding(!!sessionStorage.getItem("vendor_data"));
    refs.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const setAt = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...digits]; next[i] = v; setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    text.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const complete = digits.every(d => d !== '');

  function handleVerify() {
    if (!complete) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const raw = sessionStorage.getItem("vendor_data");
        if (raw) {
          const data = JSON.parse(raw) as { name: string; email: string; phone: string; location: string };
          setVendor(data);
          sessionStorage.removeItem("vendor_data");
        } else {
          login(email);
        }
        sessionStorage.removeItem("vendor_otp_email");
        router.push("/vendor/portal");
      } catch {
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
      }
    }, 600);
  }

  function handleResend() {
    setCountdown(30);
    setDigits(['', '', '', '', '', '']);
    refs.current[0]?.focus();
    toast.success("New code sent");
  }

  const backHref = isOnboarding ? "/vendor/onboarding" : "/vendor/login";

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
        .otp-digit {
          width: 46px; height: 54px;
          background: rgba(255,255,255,.05);
          border: 1.5px solid rgba(255,255,255,.1);
          border-radius: 10px;
          text-align: center;
          font-size: 22px; font-weight: 600;
          font-variant-numeric: tabular-nums;
          outline: none;
          color: #f0f2f5;
          transition: border-color .15s ease, background .15s ease, box-shadow .15s ease;
          caret-color: #6366f1;
        }
        .otp-digit:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,.08);
          box-shadow: 0 0 0 3px rgba(99,102,241,.15);
        }
        .otp-digit.filled {
          border-color: rgba(99,102,241,.5);
          background: rgba(99,102,241,.06);
        }
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

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>

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
                <Icon name="shield" size={22} />
              </div>
            </div>

            <h1 style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', margin: '0 0 6px', letterSpacing: '-.02em', color: '#f9fafb' }}>
              Check your email
            </h1>
            <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', margin: '0 0 28px', lineHeight: 1.6 }}>
              We sent a 6-digit code to{' '}
              <span style={{ color: '#c4c7ce', fontWeight: 500 }}>{email}</span>
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => { refs.current[i] = el; }}
                  className={`otp-digit${d ? ' filled' : ''}`}
                  value={d}
                  onChange={e => setAt(i, e.target.value.slice(-1))}
                  onKeyDown={e => onKey(i, e)}
                  onPaste={onPaste}
                  inputMode="numeric"
                  maxLength={1}
                />
              ))}
            </div>

            <button
              className="btn btn-primary btn-full"
              disabled={!complete || loading}
              onClick={handleVerify}
            >
              {loading ? 'Verifying…' : 'Verify & continue'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, fontSize: 12 }}>
              <button className="btn btn-ghost btn-sm" style={{ padding: 0 }} onClick={() => router.push(backHref)}>
                <Icon name="arrowLeft" size={12} /> Go back
              </button>
              <span style={{ color: '#4b5563' }}>
                {countdown > 0
                  ? `Resend in 0:${countdown.toString().padStart(2, '0')}`
                  : (
                    <button className="btn btn-ghost btn-sm" style={{ padding: 0, color: '#818cf8' }} onClick={handleResend}>
                      Resend code
                    </button>
                  )
                }
              </span>
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
