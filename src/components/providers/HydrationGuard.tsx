'use client';

import React, { useState, useEffect } from 'react';

/**
 * HydrationGuard: Prevents hydration mismatch by deferring children render
 * until after the client has mounted and Zustand's persisted state has loaded.
 * 
 * Without this, Next.js SSR renders with Zustand default values (e.g. currentNodeId="S"),
 * but the client immediately hydrates with localStorage values (e.g. currentNodeId="C1"),
 * causing a React hydration error that breaks the entire page including CSS.
 */
export const HydrationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[#0a0b10]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9d4edd] to-[#5a189a] flex items-center justify-center shadow-[0_0_30px_rgba(157,78,221,0.6)]">
            <span className="text-[#ffd166] text-xl">✦</span>
          </div>
          <span className="text-[#c77dff] font-serif font-bold text-sm tracking-widest uppercase">
            Carregando Painel do Mestre...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
