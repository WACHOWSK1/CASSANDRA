'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { Scroll } from 'lucide-react';

export const ChronicleTimeline: React.FC = () => {
  const { chronicle } = useAdventureStore();

  return (
    <div className="flex flex-col flex-1 min-h-[220px]">
      <div className="flex items-center gap-1.5 pb-1 border-b border-[#e0a96d]/20 text-[#ffd166] text-xs font-serif font-bold tracking-wider uppercase mb-2">
        <Scroll className="w-3.5 h-3.5" />
        <span>Crônica da Sessão</span>
      </div>

      <div className="bg-[#0a0b10]/70 border border-white/5 rounded-xl p-2.5 flex-1 overflow-y-auto max-h-[340px] space-y-2 scrollbar-thin">
        {chronicle.slice().reverse().map((entry, idx) => (
          <div 
            key={idx} 
            className="text-xs text-gray-300 pl-2.5 border-l-2 border-[#9d4edd] leading-relaxed"
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};
