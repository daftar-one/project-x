"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const SCENES = [
  { label: 'Sc 03 · Railway Yard',   pct: 92, color: '#ef4444', badge: 'Over Budget',  badgeColor: 'rgba(239,68,68,.2)',   badgeText: '#f87171' },
  { label: 'Sc 07 · Marina Shoot',   pct: 74, color: '#6366f1', badge: 'In Progress',  badgeColor: 'rgba(99,102,241,.2)', badgeText: '#a5b4fc' },
  { label: 'Sc 11 · Rooftop Chase',  pct: 41, color: '#10b981', badge: 'Scheduled',    badgeColor: 'rgba(16,185,129,.2)', badgeText: '#34d399' },
];

const FEATURES = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Scene-level budgets',
    desc: 'Each scene gets its own budget envelope. Lock it, track actuals, and know exactly where every rupee went.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Bill approvals',
    desc: 'Vendors submit bills through a dedicated portal. Review, approve, reject, and record payment — with full audit trail.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Team & vendors',
    desc: 'Invite executive producers and accounts managers per project. Manage vendors centrally across all productions.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Spend analytics',
    desc: 'Track plan vs actual spend over time. Spot cost overruns and schedule slips before they become problems.',
  },
];

/* ─── Hero mock card ────────────────────────────────────────────────────────── */

function HeroCard() {
  const [ready, setReady] = useState(false);
  const [toast, setToast]  = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setReady(true), 300);
    const t2 = setTimeout(() => setToast(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // SVG sparkline path (static shape, drawn with dashoffset)
  const sparkPath = 'M0,38 L16,32 L32,40 L48,20 L64,28 L80,14 L96,22 L112,8 L128,18';

  return (
    <div style={{
      position: 'relative',
      animation: ready ? 'heroCardIn .7s cubic-bezier(.22,.68,0,1.2) both' : 'none',
    }}>
      {/* Glow behind card */}
      <div style={{
        position: 'absolute', inset: -24, borderRadius: 28,
        background: 'radial-gradient(ellipse at 60% 40%, rgba(99,102,241,.18) 0%, transparent 70%)',
        filter: 'blur(24px)', pointerEvents: 'none',
      }} />

      <div style={{
        background: 'rgba(20,26,48,.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 32px 64px -16px rgba(0,0,0,.6), 0 0 0 1px rgba(99,102,241,.1)',
        width: '100%', maxWidth: 380,
        position: 'relative',
      }}>

        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#6366f1,#e83e8c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>PX</div>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#f0f2f5' }}>Sholay</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#34d399' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            Live
          </div>
        </div>

        {/* Overall budget bar */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>
            <span>Working Budget</span>
            <span style={{ color: '#f0f2f5', fontWeight: 600 }}>₹42.7L / ₹58L</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,.08)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              background: 'linear-gradient(90deg, #6366f1, #818cf8)',
              width: ready ? '73%' : '0%',
              transition: 'width 1.2s cubic-bezier(.4,0,.2,1) .4s',
            }} />
          </div>
          <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4 }}>73% burned</div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,.06)', marginBottom: 14 }} />

        {/* Scene rows */}
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Scene Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {SCENES.map((s, i) => (
            <div key={s.label} style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(8px)', transition: `opacity .4s ${.6 + i * .15}s, transform .4s ${.6 + i * .15}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: '#c4c7ce' }}>{s.label}</span>
                <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 999, background: s.badgeColor, color: s.badgeText, fontWeight: 600 }}>{s.badge}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.07)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 999, background: s.color,
                    width: ready ? `${s.pct}%` : '0%',
                    transition: `width 1s cubic-bezier(.4,0,.2,1) ${.7 + i * .18}s`,
                  }} />
                </div>
                <span style={{ fontSize: 10, color: '#6b7280', minWidth: 28, textAlign: 'right' }}>{s.pct}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,.06)', marginBottom: 14 }} />

        {/* Sparkline */}
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Spend Trend</div>
        <svg width="100%" viewBox="0 0 128 48" style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity=".3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={sparkPath + ' L128,48 L0,48 Z'} fill="url(#sparkGrad)" />
          <path
            d={sparkPath}
            fill="none" stroke="#6366f1" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: ready ? 0 : 300,
              transition: 'stroke-dashoffset 1.4s ease .9s',
            }}
          />
        </svg>
      </div>

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)',
          background: '#1e2433', border: '1px solid rgba(245,158,11,.3)',
          borderRadius: 10, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,.4)',
          whiteSpace: 'nowrap',
          animation: 'toastIn .4s cubic-bezier(.22,.68,0,1.2) both',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(245,158,11,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f2f5' }}>New bill submitted</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>Mehta Rigging · ₹2,40,000</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Feature card with scroll reveal ──────────────────────────────────────── */

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const ref  = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: 'rgba(20,26,48,.7)',
      border: '1px solid rgba(255,255,255,.07)',
      borderRadius: 14, padding: '28px 24px',
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity .55s ease ${delay}s, transform .55s ease ${delay}s`,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(99,102,241,.12)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px', color: '#f0f2f5' }}>{title}</h3>
      <p style={{ fontSize: 13.5, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);
  useEffect(() => setMounted(true), []);

  function handleJoinWaitlist() {
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) return;
    setWaitlistDone(true);
  }
  function openWaitlist() { setWaitlistOpen(true); setWaitlistDone(false); setWaitlistEmail(''); }

  return (
    <>
      <style>{`
        @keyframes floatA {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(40px,-30px) scale(1.06); }
          70%      { transform: translate(-20px,40px) scale(.95); }
        }
        @keyframes floatB {
          0%,100% { transform: translate(0,0) scale(1); }
          35%      { transform: translate(-50px,30px) scale(1.04); }
          65%      { transform: translate(30px,-40px) scale(.96); }
        }
        @keyframes heroCardIn {
          from { opacity:0; transform: translateY(32px) scale(.97); }
          to   { opacity:1; transform: translateY(0)    scale(1);   }
        }
        @keyframes toastIn {
          from { opacity:0; transform: translateX(-50%) translateY(12px) scale(.95); }
          to   { opacity:1; transform: translateX(-50%) translateY(0)    scale(1);   }
        }
        @keyframes pulse {
          0%,100% { opacity:1; } 50% { opacity:.35; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .hero-badge { animation: fadeUp .5s ease .1s both; }
        .hero-h1    { animation: fadeUp .55s ease .22s both; }
        .hero-p     { animation: fadeUp .55s ease .36s both; }
        .hero-ctas  { animation: fadeUp .55s ease .48s both; }

        .land-wrap  { max-width:1120px; margin:0 auto; padding:0 24px; }
        .btn-primary-lg {
          display:inline-flex; align-items:center; gap:8px;
          background:#6366f1; color:#fff; padding:11px 22px;
          border-radius:8px; font-size:14px; font-weight:600;
          text-decoration:none; transition:background .15s,transform .1s;
        }
        .btn-primary-lg:hover { background:#4f46e5; transform:translateY(-1px); }
        .btn-ghost-lg {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(255,255,255,.06); color:#e5e7eb;
          padding:11px 22px; border-radius:8px; font-size:14px;
          font-weight:500; text-decoration:none;
          border:1px solid rgba(255,255,255,.1);
          transition:background .15s,transform .1s;
        }
        .btn-ghost-lg:hover { background:rgba(255,255,255,.1); transform:translateY(-1px); }
        .btn-nav {
          display:inline-flex; align-items:center;
          background:rgba(255,255,255,.06); color:#e5e7eb;
          padding:7px 16px; border-radius:6px; font-size:13px;
          font-weight:500; text-decoration:none;
          border:1px solid rgba(255,255,255,.1);
          transition:background .15s;
        }
        .btn-nav:hover { background:rgba(255,255,255,.1); }

        @media (max-width:700px) {
          .hero-grid { flex-direction:column !important; }
          .hero-right { display:none !important; }
          .hero-left  { text-align:center; }
          .hero-left .land-ctas { justify-content:center; }
          .feat-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div style={{ background: '#080e1e', minHeight: '100vh', color: '#f0f2f5', fontFamily: 'var(--font-inter, ui-sans-serif, system-ui, sans-serif)', overflowX: 'hidden' }}>

        {/* ── Animated background ──────────────────────────────────────── */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {/* Grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }} />
          {/* Orb A — indigo, top-right */}
          <div style={{
            position: 'absolute', top: '-20%', right: '-10%',
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,.22) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'floatA 18s ease-in-out infinite',
          }} />
          {/* Orb B — magenta, bottom-left */}
          <div style={{
            position: 'absolute', bottom: '-15%', left: '-8%',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,62,140,.16) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'floatB 22s ease-in-out infinite',
          }} />
          {/* Orb C — cyan accent, center */}
          <div style={{
            position: 'absolute', top: '40%', left: '40%',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'floatA 28s ease-in-out infinite reverse',
          }} />
          {/* Vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(8,14,30,.8) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── Nav ────────────────────────────────────────────────────── */}
          <nav style={{ borderBottom: '1px solid rgba(255,255,255,.05)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="land-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'linear-gradient(135deg,#6366f1,#e83e8c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '-.02em',
                }}>PX</div>
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-.02em' }}>Project X</span>
              </div>
              <button className="btn-nav" style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,.1)' }} onClick={openWaitlist}>Join Waitlist</button>
            </div>
          </nav>

          {/* ── Hero ───────────────────────────────────────────────────── */}
          <section style={{ padding: '80px 24px 100px' }}>
            <div className="land-wrap">
              <div className="hero-grid" style={{ display: 'flex', alignItems: 'center', gap: 64 }}>

                {/* Left */}
                <div className="hero-left" style={{ flex: '0 0 auto', maxWidth: 500 }}>
                  <div className="hero-badge" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.25)',
                    borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 500,
                    color: '#a5b4fc', marginBottom: 24, letterSpacing: '.02em',
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
                    Built for Indian film &amp; TV production
                  </div>

                  <h1 className="hero-h1" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.4rem)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1, margin: '0 0 20px', color: '#f9fafb' }}>
                    Production<br />budgets{' '}
                    <span style={{ background: 'linear-gradient(90deg,#818cf8 0%,#e879f9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      under control.
                    </span>
                  </h1>

                  <p className="hero-p" style={{ fontSize: 16, color: '#9ca3af', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 420 }}>
                    Scene-by-scene budget management for line producers, executive producers, and accounts teams. From work orders to bill approvals — in one place.
                  </p>

                  <div className="hero-ctas land-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn-primary-lg" onClick={openWaitlist} style={{ cursor: 'pointer', border: 'none' }}>
                      Join the Waitlist
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                    {/* <Link href="/login" className="btn-ghost-lg">Sign in</Link> */}
                  </div>
                </div>

                {/* Right — animated card */}
                <div className="hero-right" style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingBottom: 32 }}>
                  {mounted && <HeroCard />}
                </div>
              </div>
            </div>
          </section>

          {/* ── Features ───────────────────────────────────────────────── */}
          <section style={{ padding: '0 24px 96px' }}>
            <div className="land-wrap">
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 12 }}>Everything you need</div>
                <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, letterSpacing: '-.03em', margin: 0 }}>
                  One platform, every phase of production
                </h2>
              </div>
              <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {FEATURES.map((f, i) => (
                  <FeatureCard key={f.title} {...f} delay={i * 0.1} />
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA strip ──────────────────────────────────────────────── */}
          <section style={{ padding: '0 24px 96px' }}>
            <div className="land-wrap">
              <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,.14) 0%, rgba(232,62,140,.1) 100%)',
                border: '1px solid rgba(99,102,241,.22)',
                borderRadius: 20, padding: 'clamp(40px,6vw,64px) 40px',
                textAlign: 'center',
                boxShadow: '0 0 80px rgba(99,102,241,.08)',
              }}>
                <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, letterSpacing: '-.03em', margin: '0 0 12px' }}>
                  Every buck accounted for.
                </h2>
                <p style={{ fontSize: 15, color: '#9ca3af', margin: '0 0 32px' }}>
                  Join production teams already using Project X to manage their shoots.
                </p>
                <button className="btn-primary-lg" onClick={openWaitlist} style={{ fontSize: 15, padding: '13px 28px', cursor: 'pointer', border: 'none' }}>
                  Join the Waitlist
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </section>

          {/* ── Footer ─────────────────────────────────────────────────── */}
          <footer style={{ borderTop: '1px solid rgba(255,255,255,.05)', padding: '28px 24px', textAlign: 'center', fontSize: 12, color: '#374151' }}>
            <div style={{ marginBottom: 6 }}>© {new Date().getFullYear()} Project X · Built for Indian film &amp; TV production</div>
            <div>
              Powered by{' '}
              <a href="https://daftar.one" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
              >Daftar.One</a>
            </div>
          </footer>

        </div>
      </div>

      {/* ── Waitlist dialog ─────────────────────────────────────────── */}
      {waitlistOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => { if (e.target === e.currentTarget) setWaitlistOpen(false); }}
        >
          <div style={{
            background: '#0f1629', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16,
            padding: 36, maxWidth: 420, width: '100%',
            boxShadow: '0 32px 64px rgba(0,0,0,.6)',
            animation: 'heroCardIn .35s cubic-bezier(.22,.68,0,1.2) both',
          }}>
            {!waitlistDone ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f2f5', letterSpacing: '-.02em' }}>Join the Waitlist</div>
                  <button onClick={() => setWaitlistOpen(false)} style={{ background: 'rgba(255,255,255,.06)', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <p style={{ fontSize: 13.5, color: '#9ca3af', lineHeight: 1.65, margin: '0 0 24px' }}>
                  Be the first to know when Project X opens to new productions. We'll reach out as soon as a spot opens up.
                </p>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 8 }}>Email address</label>
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={e => setWaitlistEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleJoinWaitlist()}
                    placeholder="you@studio.com"
                    autoFocus
                    style={{
                      width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: 8, color: '#f0f2f5', fontSize: 14, padding: '10px 14px',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button
                  className="btn-primary-lg"
                  onClick={handleJoinWaitlist}
                  disabled={!waitlistEmail.trim() || !waitlistEmail.includes('@')}
                  style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer', opacity: (!waitlistEmail.trim() || !waitlistEmail.includes('@')) ? 0.45 : 1 }}
                >
                  Request Early Access
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(99,102,241,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f2f5', marginBottom: 10 }}>You're on the list!</div>
                <p style={{ fontSize: 13.5, color: '#9ca3af', lineHeight: 1.65, margin: '0 0 24px' }}>
                  We've noted your interest. We'll be in touch when your spot is ready.
                </p>
                <button onClick={() => setWaitlistOpen(false)} className="btn-ghost-lg" style={{ border: '1px solid rgba(255,255,255,.1)', cursor: 'pointer' }}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
