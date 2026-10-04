'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { NPC_DATABASE } from '@/data/adventureData';
import { X, Shield, Zap, Sparkles } from 'lucide-react';

export const NPCModal: React.FC = () => {
  const { selectedNPCForModal, closeNPCModal } = useAdventureStore();

  if (!selectedNPCForModal) return null;

  const npc = NPC_DATABASE[selectedNPCForModal];
  if (!npc) return null;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) closeNPCModal();
      }}
      className="fixed inset-0 z-50 bg-[#0a0b10]/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-[#141724] border border-[#c77dff]/50 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-5 shadow-[0_16px_48px_rgba(0,0,0,0.9),0_0_20px_rgba(157,78,221,0.35)] relative">
        {/* Header do Modal */}
        <div className="flex items-center justify-between border-b border-[#9d4edd]/30 pb-3 mb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#ffd166]">
              {npc.name}
            </h3>
            <span className="text-xs text-[#c77dff]">{npc.role}</span>
          </div>
          <button 
            onClick={closeNPCModal}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Descrição */}
        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          {npc.description}
        </p>

        {/* Estatísticas de Combate T20 */}
        {npc.combatStats && (
          <div className="bg-[#0a0b10]/80 border border-[#9d4edd]/25 rounded-xl p-3.5 space-y-3">
            <div className="font-serif font-bold text-xs text-[#ffd166] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-300" />
              <span>Estatísticas de Combate (Tormenta20):</span>
            </div>

            {/* Atributos Básicos */}
            <div className="flex gap-4 font-mono text-xs text-[#2ec4b6]">
              {npc.combatStats.pv && <span>PV: <strong>{npc.combatStats.pv}</strong></span>}
              {npc.combatStats.pm && <span>PM: <strong>{npc.combatStats.pm}</strong></span>}
              {npc.combatStats.defesa && <span>Defesa: <strong>{npc.combatStats.defesa}</strong></span>}
              {npc.combatStats.rd && <span>RD: <strong>{npc.combatStats.rd}</strong></span>}
            </div>

            {/* Habilidades Especiais */}
            {npc.combatStats.habilidades && npc.combatStats.habilidades.length > 0 && (
              <div className="text-xs text-gray-300 space-y-1.5 pt-2 border-t border-white/5">
                <span className="font-semibold text-[#ffd166] block">Habilidades Especiais:</span>
                <ul className="space-y-1 pl-3 list-disc text-gray-300">
                  {npc.combatStats.habilidades.map((hab, idx) => (
                    <li key={idx} className="leading-snug">{hab}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
