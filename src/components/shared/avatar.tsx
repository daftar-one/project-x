"use client";

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

export function Avatar({ name, color = '#6366f1', size = 32 }: AvatarProps) {
  const initials = (name || '').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      className="rounded-full text-white flex items-center justify-center font-semibold tracking-[0.02em] shrink-0"
      style={{ width: size, height: size, background: color, fontSize: Math.round(size * 0.38) }}
    >{initials}</div>
  );
}
