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

      <div className="relative w-full max-w-[380px] bg-[rgba(20,26,48,.85)] backdrop-blur-[20px] border border-[rgba(255,255,255,.1)] rounded-2xl p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,.6),0_0_0_1px_rgba(99,102,241,.1)]">

        {/* Card header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center text-[10px] font-bold text-white">PX</div>
            <span className="font-semibold text-[13px] text-[#f0f2f5]">Sholay</span>
          </div>
          <div className="flex items-center gap-[5px] text-[11px] text-[#34d399]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#10b981] inline-block" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            Live
          </div>
        </div>

        {/* Overall budget bar */}
        <div className="mb-[18px]">
          <div className="flex justify-between text-[11px] text-gray-400 mb-[6px]">
            <span>Working Budget</span>
            <span className="text-[#f0f2f5] font-semibold">₹42.7L / ₹58L</span>
          </div>
          <div className="h-[6px] bg-[rgba(255,255,255,.08)] rounded-[999px] overflow-hidden">
            <div style={{
              height: '100%', borderRadius: 999,
              background: 'linear-gradient(90deg, #6366f1, #818cf8)',
              width: ready ? '73%' : '0%',
              transition: 'width 1.2s cubic-bezier(.4,0,.2,1) .4s',
            }} />
          </div>
          <div className="text-[10px] text-gray-500 mt-1">73% burned</div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(255,255,255,.06)] mb-[14px]" />

        {/* Scene rows */}
        <div className="text-[11px] text-gray-500 mb-[10px] font-semibold uppercase tracking-[.06em]">Scene Status</div>
        <div className="flex flex-col gap-[10px] mb-[18px]">
          {SCENES.map((s, i) => (
            <div key={s.label} style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(8px)', transition: `opacity .4s ${.6 + i * .15}s, transform .4s ${.6 + i * .15}s` }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-[#c4c7ce]">{s.label}</span>
                <span className="text-[10px] py-[1px] px-[7px] rounded-[999px] font-semibold" style={{ background: s.badgeColor, color: s.badgeText }}>{s.badge}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-[rgba(255,255,255,.07)] rounded-[999px] overflow-hidden">
                  <div style={{
                    height: '100%', borderRadius: 999, background: s.color,
                    width: ready ? `${s.pct}%` : '0%',
                    transition: `width 1s cubic-bezier(.4,0,.2,1) ${.7 + i * .18}s`,
                  }} />
                </div>
                <span className="text-[10px] text-gray-500 min-w-[28px] text-right">{s.pct}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(255,255,255,.06)] mb-[14px]" />

        {/* Sparkline */}
        <div className="text-[11px] text-gray-500 mb-2 font-semibold uppercase tracking-[.06em]">Spend Trend</div>
        <svg width="100%" viewBox="0 0 128 48" className="block overflow-visible">
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
          <div className="w-7 h-7 rounded-lg bg-[rgba(245,158,11,.15)] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-[#f0f2f5]">New bill submitted</div>
            <div className="text-[11px] text-gray-400">Mehta Rigging · ₹2,40,000</div>
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
    <div ref={ref} className="bg-[rgba(20,26,48,.7)] border border-[rgba(255,255,255,.07)] rounded-[14px] py-7 px-6" style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity .55s ease ${delay}s, transform .55s ease ${delay}s`,
    }}>
      <div className="w-11 h-11 rounded-[11px] bg-[rgba(99,102,241,.12)] text-[#818cf8] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold m-0 mb-2 text-[#f0f2f5]">{title}</h3>
      <p className="text-[13.5px] text-gray-500 leading-[1.65] m-0">{desc}</p>
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

      <div className="bg-[#080e1e] min-h-screen text-[#f0f2f5] font-[var(--font-inter,ui-sans-serif,system-ui,sans-serif)] overflow-x-hidden">

        {/* ── Animated background ──────────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none z-0">
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

        <div className="relative z-[1]">

          {/* ── Nav ────────────────────────────────────────────────────── */}
          <nav className="border-b border-[rgba(255,255,255,.05)] backdrop-blur-[12px] sticky top-0 z-50">
            <div className="land-wrap flex items-center justify-between h-[60px]">
              <div className="flex items-center gap-[10px]">
                <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center text-white text-[11px] font-extrabold tracking-[-0.02em]">PX</div>
                <span className="font-bold text-[15px] tracking-[-0.02em]">Project X</span>
              </div>
              <button className="btn-nav cursor-pointer" onClick={openWaitlist}>Join Waitlist</button>
            </div>
          </nav>

          {/* ── Hero ───────────────────────────────────────────────────── */}
          <section className="pt-[80px] pb-[100px] px-6">
            <div className="land-wrap">
              <div className="hero-grid flex items-center gap-16">

                {/* Left */}
                <div className="hero-left shrink-0 max-w-[500px]">
                  <div className="hero-badge inline-flex items-center gap-[6px] bg-[rgba(99,102,241,.1)] border border-[rgba(99,102,241,.25)] rounded-[999px] py-1 px-[14px] text-[12px] font-medium text-[#a5b4fc] mb-6 tracking-[.02em]">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#6366f1] inline-block" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                    Built for Indian film &amp; TV production
                  </div>

                  <h1 className="hero-h1 m-0 mb-5 text-[#f9fafb]" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.4rem)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.1 }}>
                    Production<br />budgets{' '}
                    <span className="bg-gradient-to-r from-[#818cf8] to-[#e879f9] bg-clip-text text-transparent">
                      under control.
                    </span>
                  </h1>

                  <p className="hero-p text-[16px] text-gray-400 leading-[1.75] m-0 mb-9 max-w-[420px]">
                    Scene-by-scene budget management for line producers, executive producers, and accounts teams. From work orders to bill approvals — in one place.
                  </p>

                  <div className="hero-ctas land-ctas flex gap-3 flex-wrap">
                    <button className="btn-primary-lg cursor-pointer border-0" onClick={openWaitlist}>
                      Join the Waitlist
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                    {/* <Link href="/login" className="btn-ghost-lg">Sign in</Link> */}
                  </div>
                </div>

                {/* Right — animated card */}
                <div className="hero-right flex-1 flex justify-center pb-8">
                  {mounted && <HeroCard />}
                </div>
              </div>
            </div>
          </section>

          {/* ── Features ───────────────────────────────────────────────── */}
          <section className="px-6 pb-24">
            <div className="land-wrap">
              <div className="text-center mb-12">
                <div className="text-[12px] font-semibold text-[#6366f1] uppercase tracking-[.12em] mb-3">Everything you need</div>
                <h2 className="m-0" style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, letterSpacing: '-.03em' }}>
                  One platform, every phase of production
                </h2>
              </div>
              <div className="feat-grid grid grid-cols-2 gap-4">
                {FEATURES.map((f, i) => (
                  <FeatureCard key={f.title} {...f} delay={i * 0.1} />
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA strip ──────────────────────────────────────────────── */}
          <section className="px-6 pb-24">
            <div className="land-wrap">
              <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,.14) 0%, rgba(232,62,140,.1) 100%)',
                border: '1px solid rgba(99,102,241,.22)',
                borderRadius: 20, padding: 'clamp(40px,6vw,64px) 40px',
                textAlign: 'center',
                boxShadow: '0 0 80px rgba(99,102,241,.08)',
              }}>
                <h2 className="m-0 mb-3" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 700, letterSpacing: '-.03em' }}>
                  Every buck accounted for.
                </h2>
                <p className="text-[15px] text-gray-400 m-0 mb-8">
                  Join production teams already using Project X to manage their shoots.
                </p>
                <button className="btn-primary-lg cursor-pointer border-0" style={{ fontSize: 15, padding: '13px 28px' }} onClick={openWaitlist}>
                  Join the Waitlist
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </section>

          {/* ── Footer ─────────────────────────────────────────────────── */}
          <footer className="border-t border-[rgba(255,255,255,.05)] py-7 px-6 text-center text-[12px] text-[#374151]">
            <div className="mb-[6px]">© {new Date().getFullYear()} Project X · Built for Indian film &amp; TV production</div>
            <div>
              Powered by{' '}
              <a href="https://daftar.one" target="_blank" rel="noopener noreferrer" className="text-gray-500 no-underline font-medium hover:text-gray-400">Daftar.One</a>
            </div>
          </footer>

        </div>
      </div>

      {/* ── Waitlist dialog ─────────────────────────────────────────── */}
      {waitlistOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,.65)] z-[200] flex items-center justify-center p-6"
          onClick={e => { if (e.target === e.currentTarget) setWaitlistOpen(false); }}
        >
          <div className="bg-[#0f1629] border border-[rgba(255,255,255,.1)] rounded-2xl p-9 max-w-[420px] w-full shadow-[0_32px_64px_rgba(0,0,0,.6)]" style={{ animation: 'heroCardIn .35s cubic-bezier(.22,.68,0,1.2) both' }}>
            {!waitlistDone ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div className="text-[18px] font-bold text-[#f0f2f5] tracking-[-0.02em]">Join the Waitlist</div>
                  <button onClick={() => setWaitlistOpen(false)} className="bg-[rgba(255,255,255,.06)] border-0 rounded-[6px] w-7 h-7 cursor-pointer text-gray-400 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <p className="text-[13.5px] text-gray-400 leading-[1.65] m-0 mb-6">
                  Be the first to know when Project X opens to new productions. We'll reach out as soon as a spot opens up.
                </p>
                <div className="mb-4">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[.07em] block mb-2">Email address</label>
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={e => setWaitlistEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleJoinWaitlist()}
                    placeholder="you@studio.com"
                    autoFocus
                    className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.1)] rounded-lg text-[#f0f2f5] text-[14px] px-[14px] py-[10px] outline-none box-border"
                  />
                </div>
                <button
                  className="btn-primary-lg w-full justify-center border-0 cursor-pointer"
                  onClick={handleJoinWaitlist}
                  disabled={!waitlistEmail.trim() || !waitlistEmail.includes('@')}
                  style={{ opacity: (!waitlistEmail.trim() || !waitlistEmail.includes('@')) ? 0.45 : 1 }}
                >
                  Request Early Access
                </button>
              </>
            ) : (
              <div className="text-center py-3">
                <div className="w-14 h-14 rounded-full bg-[rgba(99,102,241,.15)] flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="text-[18px] font-bold text-[#f0f2f5] mb-[10px]">You're on the list!</div>
                <p className="text-[13.5px] text-gray-400 leading-[1.65] m-0 mb-6">
                  We've noted your interest. We'll be in touch when your spot is ready.
                </p>
                <button onClick={() => setWaitlistOpen(false)} className="btn-ghost-lg border border-[rgba(255,255,255,.1)] cursor-pointer">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
