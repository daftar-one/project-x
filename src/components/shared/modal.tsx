"use client";
import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  const cls = 'modal' + (size === 'lg' ? ' modal-lg' : size === 'xl' ? ' modal-xl' : '');
  return (
    <div className="modal-backdrop fade-in" onClick={onClose}>
      <div className={cls} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
