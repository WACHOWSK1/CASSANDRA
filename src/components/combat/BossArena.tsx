'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { Shield, Zap, Flame, Swords } from 'lucide-react';

export const BossArena: React.FC = () => {
  const { 
    bossState, 
    destruirPilono, 
    inverterRunas, 
    togglePylonManual 
  } = useAdventureStore();

  const total = bossState.totalPilonos || 4;
  const destroyed = bossState.pilonosDestruidos || 0;
  const activePylons = Math.max(0, total - destroyed);
  const severianTotalPV = 150 + bossState.severianBonusPV;
  const rd = activePylons * 5;
  const regen = activePylons * 10;

  return (
    <div className="bg-[#e63946]/[0.08] border border-[#e63946]/40 rounded-xl p-3.5 my-3 shadow-2xl">
      {/* Header do Boss */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-[#ff4d6d]" />
          <h3 className="font-serif font-bold text-sm text-[#ff4d6d]">
            Confronto Final: Inquisidor-Mor Severian
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#ffd166]">
          <span>PV: <strong>{severianTotalPV}</strong></span>
          <span>•</span>
          <span>Defesa: <strong>28</strong></span>
        </div>
      </div>

      <div className="bg-[#0a0b10]/60 p-2 rounded-lg border border-white/5 mb-3 flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#c77dff]" />
          <span>Pilonos Ativos: <strong className="text-[#c77dff]">{activePylons}/{total}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-300">RD {rd}</span>
          <span className="text-cyan-300">Regeneração {regen} PV/turno</span>
        </div>
      </div>

      {/* Grid de Pilonos */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {Array.from({ length: total }).map((_, i) => {
          const pylonIndex = i + 1;
          const isDestroyed = pylonIndex <= destroyed;
          return (
            <div 
              key={pylonIndex}
              onClick={() => togglePylonManual(pylonIndex)}
              className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                isDestroyed
                  ? 'bg-black/40 border-gray-700 opacity-50 line-through text-gray-500'
                  : 'bg-[#9d4edd]/20 border-[#c77dff] shadow-[0_0_12px_rgba(157,78,221,0.3)] text-white'
              }`}
            >
              <div className="font-bold text-xs">Pilono {pylonIndex}</div>
              <div className="text-[10px] uppercase font-mono mt-0.5">
                {isDestroyed ? 'Destruído' : 'Ativo'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ações Táticas Rápidas */}
      <div className="flex gap-2">
        <button 
          onClick={destruirPilono}
          className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#9d4edd] to-[#5a189a] hover:from-[#c77dff] hover:to-[#9d4edd] text-white flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(157,78,221,0.4)] transition-all"
        >
          <Flame className="w-3.5 h-3.5 text-amber-300" />
          <span>Destruir 1 Pilono (-RD 5, -Regen 10)</span>
        </button>

        <button 
          onClick={inverterRunas}
          className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#996515] hover:from-[#ffd166] hover:to-[#d4af37] text-gray-950 flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,209,102,0.4)] transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Inverter Runas (4d8 Dano no Boss)</span>
        </button>
      </div>
    </div>
  );
};
