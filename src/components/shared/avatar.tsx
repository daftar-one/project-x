"use client";

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

export function Avatar({ name, color = '#6366f1', size = 32 }: AvatarProps) {
  const initials = (name || '').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.38), fontWeight: 600, letterSpacing: '.02em',
      flexShrink: 0,
    }}>{initials}</div>
  );
}
