"use client";

import { ReactNode, useState, Fragment } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icon } from './icon';
import { Avatar } from './avatar';
import { Modal } from './modal';
import { useAuthStore } from '@/store/auth';
import { useProjects } from '@/hooks/useProjects';

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance',
  'Documentary', 'Sci-Fi', 'Fantasy', 'Animation', 'Biographical', 'Other',
];

export function ModalNewProject({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [filmName, setFilmName] = useState('');
  const [genre, setGenre]       = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [saving, setSaving] = useState(false);

  function handleClose() {
    setFilmName('');
    setGenre('');
    setCustomGenre('');
    setSaving(false);
    onClose();
  }

  function handleCreate() {
    if (!filmName.trim()) return;
    handleClose();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1px solid rgba(255,255,255,.15)', color: '#f9fafb',
    fontSize: 14, padding: '8px 0 8px 28px', outline: 'none', transition: 'border-color .15s',
  };
  const iconWrap: React.CSSProperties = {
    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
    color: '#6b7280', display: 'flex', alignItems: 'center',
  };
  const field: React.CSSProperties = { position: 'relative', width: '100%' };
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase',
    letterSpacing: '.07em', marginBottom: 4, display: 'block',
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f9fafb' }}>New Movie</div>
          <button onClick={handleClose} style={{
            width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,.06)',
            border: 'none', color: '#9ca3af', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="x" size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={lbl}>Movie Name *</label>
            <div style={field}>
              <span style={iconWrap}><Icon name="film" size={15} /></span>
              <input
                style={inputStyle}
                placeholder="Enter movie name…"
                value={filmName}
                onChange={e => setFilmName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
          </div>
          <div>
            <label style={lbl}>Genre</label>
            <div style={field}>
              <span style={iconWrap}><Icon name="file" size={15} /></span>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={genre} onChange={e => { setGenre(e.target.value); setCustomGenre(''); }}>
                <option value="">Select genre…</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {genre === 'Other' && (
              <div style={{ ...field, marginTop: 10 }}>
                <span style={iconWrap}><Icon name="file" size={15} /></span>
                <input
                  style={inputStyle}
                  placeholder="Enter custom genre…"
                  value={customGenre}
                  onChange={e => setCustomGenre(e.target.value)}
                  autoFocus
                />
              </div>
            )}
          </div>
          {/* <div>
            <label style={lbl}>Total Budget (₹) *</label>
            <div style={field}>
              <span style={iconWrap}><Icon name="rupee" size={15} /></span>
              <input
                type="number"
                style={inputStyle}
                placeholder="0"
                value={totalBudget}
                onChange={e => setTotalBudget(e.target.value)}
                min={0}
              />
            </div>
            {budget > 0 && (
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>{fmt(budget)}</div>
            )}
          </div> */}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 32 }}>
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
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 20px 16px' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg,#6366f1,#e83e8c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}><Icon name="film" size={16} stroke={1.5} /></div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f2f5', letterSpacing: '-.02em' }}>Project X</span>
        </div>

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

        {/* Productions section — scrollable */}
        <div className="sidebar-scroll">
          <div className="side-section-label">Movies</div>

          {projects.map(p => (
            <Fragment key={p.id}>
              <div
                className={`side-item-project${activeProjectId === p.id ? ' active' : ''}`}
                onClick={() => router.push(`/projects/${p.id}`)}
                title={p.name}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: 2, flexShrink: 0,
                  background: activeProjectId === p.id ? '#a5b4fc' : '#374151',
                }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{p.name}</span>
              </div>
              {activeProjectId === p.id && projectSubnav}
            </Fragment>
          ))}

          {projects.length === 0 && (
            <div style={{ fontSize: 12, color: '#4b5563', padding: '6px 20px 6px 32px' }}>No movies</div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', margin: '0 8px 2px',
            borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent',
            color: '#6b7280', fontSize: 13, fontWeight: 500, width: 'calc(100% - 16px)',
            transition: 'background .12s ease, color .12s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.08)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
        >
          <Icon name="logout" size={15} />
          <span>Log out</span>
        </button>

        {/* Profile */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px 8px', cursor: 'pointer', borderRadius: 8, margin: '0 8px 4px' }}
          onClick={() => router.push('/profile')}
          title="View profile"
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Avatar name={userName} color={userColor} size={28} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e5e7eb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>{userRole}</div>
          </div>
        </div>
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
        <div style={{ padding: '8px 24px', borderTop: '1px solid rgba(255,255,255,.04)', fontSize: 11, color: '#374151', textAlign: 'center', flexShrink: 0 }}>
          Powered by{' '}
          <a href="https://daftar.one" target="_blank" rel="noopener noreferrer" style={{ color: '#4b5563', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#9ca3af')}
            onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
          >Daftar.One</a>
        </div>
      </div>

    </div>
  );
}
