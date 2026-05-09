"use client";

import { useEffect, useState, useRef } from 'react';
import { addMonths, format } from 'date-fns';
import { AppFrame } from '@/components/shared/app-frame';
import { useProductionHouse } from '@/hooks/useProductionHouse';
import { Icon } from '@/components/shared/icon';

/* ─── Data ─────────────────────────────────────────────────────────────────── */

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

/* ─── Components ───────────────────────────────────────────────────────────── */

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
    <div ref={ref} className="bg-[rgba(20,26,48,.7)] border border-[rgba(255,255,255,.07)] rounded-[14px] py-6 px-5" style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity .55s ease ${delay}s, transform .55s ease ${delay}s`,
    }}>
      <div className="w-10 h-10 rounded-[10px] bg-[rgba(99,102,241,.12)] text-[#818cf8] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-[14px] font-semibold m-0 mb-2 text-[#f0f2f5]">{title}</h3>
      <p className="text-[12.5px] text-gray-500 leading-[1.6] m-0">{desc}</p>
    </div>
  );
}

export default function PlanPage() {
  const { data: house } = useProductionHouse();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const createdAt = new Date('2026-04-03');
  const expiryDate = addMonths(createdAt, 6);

  return (
    <AppFrame>
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
        .hero-card  { animation: heroCardIn .7s cubic-bezier(.22,.68,0,1.2) .4s both; }
      `}</style>

      <div className="relative min-h-full -m-6">
        {/* ── Animated background (Sticky to content area) ──────────────── */}
        <div className="sticky top-0 h-0 overflow-visible pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-screen">
            {/* Grid */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }} />
            {/* Orb A — indigo */}
            <div style={{
              position: 'absolute', top: '0%', right: '0%',
              width: 700, height: 700, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'floatA 18s ease-in-out infinite',
            }} />
            {/* Orb B — magenta */}
            <div style={{
              position: 'absolute', bottom: '0%', left: '0%',
              width: 600, height: 600, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(232,62,140,.1) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'floatB 22s ease-in-out infinite',
            }} />
            {/* Vignette */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(8,14,30,.8) 100%)' }} />
          </div>
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto pt-14 pb-16 px-6">
          
          <div className="text-center mb-12">
            <div className="hero-badge inline-flex items-center gap-[6px] bg-[rgba(99,102,241,.1)] border border-[rgba(99,102,241,.25)] rounded-[999px] py-1 px-[14px] text-[11px] font-semibold text-[#a5b4fc] mb-6 uppercase tracking-[.08em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] inline-block" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              Active Subscription
            </div>
            
            <h1 className="hero-h1 m-0 mb-4 text-[#f9fafb]" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.2 }}>
              Your <span className="bg-gradient-to-r from-[#818cf8] to-[#e879f9] bg-clip-text text-transparent">Studio Plan.</span>
            </h1>
            
            <p className="hero-p text-[15px] text-gray-400 leading-[1.6] m-0 mb-8 max-w-[480px] mx-auto">
              You are currently on the early-access beta plan. Enjoy <b>full access to all features for free</b> for the next 6 months.
            </p>
          </div>

          {/* Plan Details Card */}
          <div className="hero-card mb-16 relative">
            <div style={{
              position: 'absolute', inset: -1, borderRadius: 24,
              background: 'linear-gradient(135deg, rgba(99,102,241,.3), rgba(232,62,140,.3))',
              filter: 'blur(8px)', opacity: 0.15,
            }} />
            <div className="relative bg-[rgba(20,26,48,.8)] backdrop-blur-[20px] border border-[rgba(255,255,255,.1)] rounded-3xl p-8 md:p-10 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#6366f1] uppercase tracking-[0.12em] mb-2">Current Plan</div>
                  <div className="text-[28px] font-extrabold text-[#f0f2f5] tracking-tight mb-1">Free Beta Plan</div>
                  <div className="text-[14px] text-gray-400 font-medium">Free access for 6 months</div>
                </div>
                
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,.05)] flex items-center justify-center text-gray-400">
                      <Icon name="calendar" size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Created On</div>
                      <div className="text-[14px] font-semibold text-[#f0f2f5]">{format(createdAt, 'MMMM d, yyyy')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,.1)] flex items-center justify-center text-[#10b981]">
                      <Icon name="trend" size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expires On</div>
                      <div className="text-[14px] font-semibold text-[#f0f2f5]">{format(expiryDate, 'MMMM d, yyyy')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[rgba(255,255,255,.06)] my-8" />
              
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                <div className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-[#34d399]" />
                  <span className="text-[13px] text-gray-400">Unlimited Team Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-[#34d399]" />
                  <span className="text-[13px] text-gray-400">Unlimited Movies</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-[#34d399]" />
                  <span className="text-[13px] text-gray-400">Unlimited Scenes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-[#34d399]" />
                  <span className="text-[13px] text-gray-400">Premium Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <div className="text-center mb-10">
              <div className="text-[11px] font-bold text-[#6366f1] uppercase tracking-[0.12em] mb-2">Included Features</div>
              <h2 className="text-[22px] font-bold text-[#f0f2f5] tracking-tight">Everything you need to produce.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={i * 0.1 + 0.6} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppFrame>
  );
}
