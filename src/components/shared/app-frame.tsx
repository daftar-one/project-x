"use client";

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from './icon';
import { Avatar } from './avatar';
import { Modal } from './modal';
import { useAuthStore } from '@/store/auth';
import { useProjects } from '@/hooks/useProjects';
import { useProductionHouse } from '@/hooks/useProductionHouse';
import { SUPPORTED_CURRENCIES } from '@/lib/format';

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance',
  'Documentary', 'Sci-Fi', 'Fantasy', 'Animation', 'Biographical', 'More',
];

const inputCls = "w-full bg-transparent border-0 border-b border-[rgba(255,255,255,.15)] text-[#f9fafb] text-[14px] py-2 pl-7 pr-0 outline-none transition-[border-color]";

export function ModalNewProject({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [filmName, setFilmName] = useState('');
  const [genre, setGenre]       = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [saving, setSaving] = useState(false);

  function handleClose() {
    setFilmName('');
    setGenre('');
    setCustomGenre('');
    setCurrency('INR');
    setSaving(false);
    onClose();
  }

  function handleCreate() {
    if (!filmName.trim()) return;
    handleClose();
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-7">
          <div className="text-[16px] font-bold text-[#f9fafb]">New Movie</div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-[6px] bg-[rgba(255,255,255,.06)] border-0 text-gray-400 cursor-pointer flex items-center justify-center shrink-0"
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] mb-1 block">Movie Name *</label>
            <div className="relative w-full">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"><Icon name="film" size={15} /></span>
              <input
                className={inputCls}
                placeholder="Enter movie name…"
                value={filmName}
                onChange={e => setFilmName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] mb-1 block">Genre</label>
            <div className="relative w-full">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"><Icon name="file" size={15} /></span>
              <select className={`${inputCls} cursor-pointer`} value={genre} onChange={e => { setGenre(e.target.value); setCustomGenre(''); }}>
                <option value="">Select genre…</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {genre === 'More' && (
              <div className="relative w-full mt-[10px]">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"><Icon name="file" size={15} /></span>
                <input
                  className={inputCls}
                  placeholder="Enter genre…"
                  value={customGenre}
                  onChange={e => setCustomGenre(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.07em] mb-1 block">Currency</label>
            <div className="relative w-full">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 flex items-center"><Icon name="wallet" size={15} /></span>
              <select className={`${inputCls} cursor-pointer`} value={currency} onChange={e => setCurrency(e.target.value)}>
                {SUPPORTED_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-8">
          <button className="btn btn-ghost btn-sm" onClick={handleClose}>Cancel</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleCreate}
            disabled={!filmName.trim() || saving}
          >
            {saving ? 'Adding…' : 'Add Movie'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const ROLE_LABELS: Record<string, string> = {
  line_producer: 'Line Producer',
  executive_producer: 'Executive Producer',
  accounts_manager: 'Accounts Manager',
  silent_stakeholder: 'Silent Stakeholder',
};

const ROLE_COLORS: Record<string, string> = {
  line_producer: '#6366f1',
  executive_producer: '#e83e8c',
  accounts_manager: '#10b981',
  silent_stakeholder: '#f59e0b',
};

interface AppFrameProps {
  children: ReactNode;
  topbarContent?: ReactNode;
  secondarySidebar?: ReactNode;
  projectSubnav?: ReactNode;
  innerBg?: 'dark' | 'light';
}

export function AppFrame({ children, secondarySidebar, projectSubnav, innerBg }: AppFrameProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const isLP = user?.role === 'line_producer';
  const userName  = user?.full_name || user?.email || 'User';
  const userRole  = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : 'Line Producer';
  const userColor = user?.role ? (ROLE_COLORS[user.role] ?? '#6366f1') : '#6366f1';
  const { data: projects } = useProjects();
  const { data: house } = useProductionHouse();

  const projectMatch = pathname.match(/^\/projects\/([^/]+)/);
  const activeProjectId = projectMatch ? projectMatch[1] : null;

  const isDashboard = pathname === '/dashboard';

  function handleLogout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <div className="app">
      <aside className="app-sidebar">
        {/* Logo + product name */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          <div className="w-[30px] h-[30px] rounded-[8px] shrink-0 bg-gradient-to-br from-[#6366f1] to-[#e83e8c] flex items-center justify-center text-white">
            <Icon name="film" size={15} stroke={1.5} />
          </div>
          <span className="text-[14px] font-bold text-[#f0f2f5] tracking-[-0.02em]">Studio OS</span>
        </div>

        {/* Production house card */}
        {house?.name && (
          <div
            className="mx-3 mb-3 rounded-[9px] px-3 py-2.5 cursor-pointer transition-[background,border-color] duration-[120ms]"
            style={{ background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.18)' }}
            onClick={() => router.push('/production-house')}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,.18)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,.1)'; }}
            title="View production house profile"
          >
            <div className="text-[9px] font-bold text-[#6366f1] uppercase tracking-[0.1em] mb-0.5">Production House</div>
            <div className="text-[13px] font-bold text-[#e0e7ff] truncate leading-tight">{house.brand_name ?? house.name}</div>
          </div>
        )}

        {/* Main nav */}
        {isLP && (
          <div
            className={`side-item${isDashboard ? ' active' : ''}`}
            onClick={() => router.push('/dashboard')}
          >
            <Icon name="home" size={16} stroke={1.5} />
            <span>Dashboard</span>
          </div>
        )}

        {/* Notes */}
        {isLP && (
          <div
            className={`side-item${pathname === '/notes' ? ' active' : ''}`}
            onClick={() => router.push('/notes')}
          >
            <Icon name="file-text" size={16} stroke={1.5} />
            <span>Notes</span>
          </div>
        )}

        {/* Productions section — scrollable */}
        <div className="sidebar-scroll">
          <div className="side-section-label">Movies</div>

          {projects.map(p => (
            <div
              key={p.id}
              className={`side-item-project${activeProjectId === p.id ? ' active' : ''}`}
              onClick={() => router.push(`/projects/${p.id}`)}
              title={p.name}
            >
              <div
                className="w-1.5 h-1.5 rounded-[2px] shrink-0"
                style={{ background: activeProjectId === p.id ? '#a5b4fc' : '#374151' }}
              />
              <span className="overflow-hidden text-ellipsis flex-1">{p.name}</span>
            </div>
          ))}
          {projectSubnav && (
            <>
              <div className="h-px bg-[rgba(255,255,255,.07)] my-2 mx-3" />
              {projectSubnav}
            </>
          )}

          {projects.length === 0 && (
            <div className="text-[12px] text-gray-600 py-1.5 pl-8 pr-5">No movies</div>
          )}
        </div>

        {/* Profile */}
        <div
          className="flex items-center gap-2.5 px-5 py-2 cursor-pointer rounded-lg mx-2 mb-0.5 hover:bg-[rgba(255,255,255,.04)]"
          onClick={() => router.push('/profile')}
          title="View profile"
        >
          <Avatar name={userName} color={userColor} size={28} />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-[#e5e7eb] whitespace-nowrap overflow-hidden text-ellipsis">{userName}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-[0.05em]">{userRole}</div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-5 py-2 mx-2 mb-1 rounded-lg border-0 cursor-pointer bg-transparent text-gray-500 text-[13px] font-medium w-[calc(100%-16px)] transition-[background,color] duration-[120ms] hover:bg-[rgba(239,68,68,.08)] hover:text-[#fca5a5]"
        >
          <Icon name="logout" size={15} />
          <span>Log out</span>
        </button>
      </aside>

      {secondarySidebar && (
        <div className="secondary-sidebar">
          {secondarySidebar}
        </div>
      )}

      <div className="app-main">
        <div className={`app-canvas${innerBg === 'light' ? ' app-canvas-white' : ''}`}>
          {children}
        </div>
        <div className="px-6 py-2 border-t border-[rgba(255,255,255,.04)] text-[11px] text-[#374151] text-center shrink-0">
          Studio OS · Software for Film & TV Production by{' '}
          <a href="https://daftar.one" target="_blank" rel="noopener noreferrer" className="text-[#4b5563] no-underline hover:text-gray-400">Daftar.One</a>
        </div>
      </div>
    </div>
  );
}
