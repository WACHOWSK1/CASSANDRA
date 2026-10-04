'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw, 
  Hammer, 
  Heart, 
  Zap, 
  Swords, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const BossArena: React.FC = () => {
  const { 
    pylonsList, 
    setPylonStatus, 
    destruirPilono, 
    inverterRunas, 
    bossState 
  } = useAdventureStore();

  const activeCount = pylonsList.filter(p => p.status === 'ativo').length;
  const destroyedCount = 4 - activeCount;

  // Estatísticas dinâmicas de Severian baseadas nos pilonos
  const baseDefesa = 32;
  const baseRD = 15;
  const currentDefesa = Math.max(22, baseDefesa - destroyedCount * 2);
  const currentRD = Math.max(0, baseRD - destroyedCount * 4);

  return (
    <div className="bg-[#120e1c]/95 border-2 border-[#9d4edd]/60 rounded-2xl p-4 shadow-[0_0_30px_rgba(157,78,221,0.3)] space-y-4 my-2">
      {/* HEADER DA ARENA DO CHEFE */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9d4edd] to-[#e63946] flex items-center justify-center text-white shadow-lg">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-white">
                Arena da Oitava Estrela: Severian de Khorcova
              </h3>
              <span className="bg-rose-950/60 border border-rose-500 text-rose-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                ND 12 (Solo)
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              Confronto Tático • Rede Antimagia & Sacrifício Ritualístico
            </span>
          </div>
        </div>

        {/* Indicador de Status dos Pilonos */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className={`px-2.5 py-1 rounded-full border font-bold ${
            activeCount === 0
              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500'
              : 'bg-rose-950/50 text-rose-300 border-rose-500 alert-pulse-animation'
          }`}>
            {activeCount > 0 ? `${activeCount} / 4 Pilonos Ativos` : '✦ Rede Antimagia Destruída!'}
          </span>
        </div>
      </div>

      {/* PAINEL DINÂMICO DE SEVERIAN */}
      <div className="bg-[#1a1426] border border-[#9d4edd]/30 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Defesa Atual</span>
          <strong className="text-sm font-mono text-[#ffd166]">{currentDefesa}</strong>
          <span className="text-[9px] text-gray-400 block">{destroyedCount > 0 ? `(-${destroyedCount * 2})` : '(Base 32)'}</span>
        </div>

        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Redução de Dano</span>
          <strong className="text-sm font-mono text-[#48cae4]">RD {currentRD}</strong>
          <span className="text-[9px] text-gray-400 block">{destroyedCount > 0 ? `(-${destroyedCount * 4})` : '(Base 15)'}</span>
        </div>

        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Escudo de Sacrifício</span>
          <strong className="text-xs font-mono text-[#ff758f] block mt-0.5">
            {activeCount > 0 ? '1 PV Save Ativo' : 'Vulnerável'}
          </strong>
          <span className="text-[9px] text-gray-400 block">Consome 1 pilono p/ não morrer</span>
        </div>

        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Regeneração</span>
          <strong className="text-xs font-mono text-emerald-300 block mt-0.5">
            {activeCount > 0 ? `${activeCount * 5} PV / rodada` : 'Desativada'}
          </strong>
          <span className="text-[9px] text-gray-400 block">Alimentada pela rede</span>
        </div>
      </div>

      {/* BOTÕES DE INTERAÇÃO RÁPIDA DE COMBATE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          onClick={destruirPilono}
          className="p-3 rounded-xl bg-gradient-to-r from-rose-900/60 to-rose-950/80 hover:from-rose-800/80 hover:to-rose-900 border border-rose-500/50 text-white flex items-center justify-between shadow transition-all"
        >
          <div className="flex items-center gap-2 text-left">
            <Hammer className="w-5 h-5 text-rose-300" />
            <div>
              <strong className="text-xs block">💥 Destruir Próximo Pilono</strong>
              <span className="text-[10px] text-rose-200/80">Reduz Defesa (-2) e RD (-4) de Severian</span>
            </div>
          </div>
          <span className="font-mono text-xs text-rose-300 font-bold">Ação</span>
        </button>

        <button
          onClick={inverterRunas}
          className="p-3 rounded-xl bg-gradient-to-r from-[#2ec4b6]/30 to-[#0f2824] hover:from-[#2ec4b6]/50 border border-[#2ec4b6]/50 text-white flex items-center justify-between shadow transition-all"
        >
          <div className="flex items-center gap-2 text-left">
            <Sparkles className="w-5 h-5 text-[#48cae4]" />
            <div>
              <strong className="text-xs block">🔮 Inverter Runas do Pilono</strong>
              <span className="text-[10px] text-emerald-200/80">Causa 10-35 dano em Severian & cria refúgio</span>
            </div>
          </div>
          <span className="font-mono text-xs text-[#48cae4] font-bold">Misticismo</span>
        </button>
      </div>

      {/* ESTADO INDIVIDUAL DOS 4 PILONOS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {pylonsList.map((pylon) => (
          <div 
            key={pylon.id}
            className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
              pylon.status === 'ativo'
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                : pylon.status === 'invertido'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-black/40 border-white/5 text-gray-500'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="font-bold">Pilono #{pylon.id}</span>
              <span className="capitalize">{pylon.status}</span>
            </div>
            <strong className="text-xs text-white truncate">{pylon.nome}</strong>
            <div className="flex gap-1 mt-1">
              <button
                onClick={() => setPylonStatus(pylon.id, pylon.status === 'ativo' ? 'destruido' : 'ativo')}
                className="w-full py-0.5 rounded text-[9px] bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
              >
                {pylon.status === 'ativo' ? 'Desativar' : 'Reativar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
