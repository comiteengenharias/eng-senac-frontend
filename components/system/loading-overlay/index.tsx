// components/LoadingOverlay.tsx
'use client';

import { useEffect } from 'react';

interface LoadingOverlayProps {
  active: boolean;
}

export default function LoadingOverlay({ active }: LoadingOverlayProps) {
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--blue)] bg-opacity-90 flex items-center justify-center opacity-50">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}