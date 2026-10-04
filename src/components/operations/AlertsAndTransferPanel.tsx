'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { ALERT_RULES, TRANSFER_CLOCK_RULES } from '@/data/rulesData';
import { 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Flame, 
  Eye, 
  BellRing,
  Info,
  ChevronRight
} from 'lucide-react';

export const AlertsAndTransferPanel: React.FC = () => {
  const { 
    alertLevel, 
    adjustAlert, 
    setAlertLevel, 
    transferClock, 
    setTransferClock, 
    advanceTransferClock 
  } = useAdventureStore();

  const currentAlertRule = ALERT_RULES[alertLevel] || ALERT_RULES[0];
  const nextAlertRule = alertLevel < 6 ? ALERT_RULES[alertLevel + 1] : null;
  const currentTransferRule = TRANSFER_CLOCK_RULES[transferClock] || TRANSFER_CLOCK_RULES[0];

  const getAlertBadgeColor = (lvl: number) => {
    if (lvl === 0) return 'bg-[#2ec4b6]/20 text-[#48cae4] border-[#2ec4b6]/50';
    if (lvl <= 2) return 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]/50';
    if (lvl <= 4) return 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]/50';
    return 'bg-[#9d0208]/40 text-[#ff4d6d] border-[#ff4d6d] alert-pulse-animation';
  };

  return (
    <div className="flex flex-col gap-3.5 text-xs">
      
      {/* CARD PRINCIPAL DO ALERTA ATUAL */}
      <div className="bg-[#0a0b10]/90 border-2 border-[#9d4edd]/50 rounded-2xl p-3.5 shadow-[0_0_20px_rgba(157,78,221,0.25)] relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-serif font-bold text-[#ffd166] text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>Nível de Alerta Atual</span>
          </div>

          <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getAlertBadgeColor(alertLevel)}`}>
            NÍVEL {alertLevel} / 6
          </span>
        </div>

        {/* Pips de Seleção Rápida de Alerta 0 a 6 */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {[0, 1, 2, 3, 4, 5, 6].map((lvl) => {
            const isSelected = lvl === alertLevel;
            const isReached = lvl <= alertLevel;
            return (
              <button
                key={lvl}
                onClick={() => setAlertLevel(lvl)}
                className={`py-1.5 rounded-lg font-mono font-bold text-xs transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#9d4edd] to-[#e63946] text-white border-[#ffd166] shadow-[0_0_12px_rgba(199,125,255,0.7)] scale-105 ring-1 ring-[#ffd166]'
                    : isReached
                    ? 'bg-[#1e2235] text-amber-200 border-white/20 hover:bg-[#282e48]'
                    : 'bg-[#0f111a] text-gray-500 border-white/5 hover:text-gray-300'
                }`}
                title={`Mudar Alerta para Nível ${lvl}`}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        {/* Estado do Regime */}
        <div className="bg-[#141724] border border-white/10 rounded-xl p-2.5 mb-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#c77dff] mb-0.5">
            Estado do Regime em Milothiann:
          </div>
          <p className="font-bold text-white text-xs leading-snug">
            "{currentAlertRule.estado}"
          </p>
        </div>

        {/* Sinal Narrativo */}
        <div className="bg-[#e0a96d]/10 border-l-2 border-[#ffd166] rounded-r-xl p-2.5 mb-3 text-gray-200 italic leading-relaxed">
          <span className="not-italic text-[10px] font-bold text-[#ffd166] uppercase block mb-0.5">
            Sinal Narrativo para descrever em mesa:
          </span>
          "{currentAlertRule.sinalNarrativo}"
        </div>

        {/* Consequências Concretas Ativas */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#ff758f] uppercase tracking-wide flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-[#e63946]" />
            <span>Consequências & Regras em Vigor (Alerta {alertLevel}):</span>
          </span>

          <div className="space-y-1 bg-[#141724]/80 p-2.5 rounded-xl border border-white/5">
            {currentAlertRule.consequencias.resumo.map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-gray-200 leading-snug">
                <span className="text-[#ffd166] font-bold">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AVISO DO PRÓXIMO NÍVEL */}
        {nextAlertRule && (
          <div className="mt-3 pt-2.5 border-t border-white/10 bg-[#e63946]/10 rounded-xl p-2.5 border border-[#e63946]/30">
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#ff758f] uppercase mb-1">
              <BellRing className="w-3.5 h-3.5 text-[#e63946]" />
              <span>O que acontece se o Alerta subir para {alertLevel + 1}?</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-snug">
              <strong>{nextAlertRule.estado}:</strong> {nextAlertRule.consequencias.resumo[0]}
            </p>
          </div>
        )}
      </div>

      {/* RELÓGIO DA TRANSFERÊNCIA DE CASSANDRA (ESTÁGIOS 0 A 3) */}
      <div className="bg-[#0a0b10]/90 border border-[#2ec4b6]/40 rounded-2xl p-3.5 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-serif font-bold text-[#48cae4] text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#2ec4b6]" />
            <span>Relógio da Transferência</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => advanceTransferClock(-1)}
              disabled={transferClock <= 0}
              className="w-5 h-5 rounded bg-white/10 hover:bg-[#2ec4b6] text-white flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              title="Recuar estágio de transferência"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-mono font-bold text-xs text-[#ffd166] px-1.5">
              Estágio {transferClock} / 3
            </span>
            <button
              onClick={() => advanceTransferClock(1)}
              disabled={transferClock >= 3}
              className="w-5 h-5 rounded bg-white/10 hover:bg-[#2ec4b6] text-white flex items-center justify-center text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              title="Avançar estágio de transferência"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4 Estágios do Relógio */}
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map((stg) => {
            const isCurrent = stg === transferClock;
            const isPassed = stg <= transferClock;
            return (
              <button
                key={stg}
                onClick={() => setTransferClock(stg)}
                className={`py-1 rounded-lg text-center font-mono font-bold text-[10px] transition-all border ${
                  isCurrent
                    ? 'bg-[#2ec4b6] text-gray-950 border-[#48cae4] shadow-[0_0_8px_rgba(46,196,182,0.8)]'
                    : isPassed
                    ? 'bg-[#1b3a38] text-[#48cae4] border-[#2ec4b6]/30'
                    : 'bg-[#10141a] text-gray-600 border-white/5'
                }`}
              >
                Est. {stg}
              </button>
            );
          })}
        </div>

        {/* Descrição do Estágio Atual */}
        <div className="bg-[#141724] border border-white/5 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#48cae4] mb-0.5">
            <span>{currentTransferRule.situacao}</span>
          </div>
          <p className="text-gray-300 text-xs leading-snug">
            {currentTransferRule.efeitoNaCena}
          </p>
        </div>

        <div className="text-[10px] text-gray-400 italic bg-black/40 p-2 rounded-lg border border-white/5 leading-snug">
          💡 <strong>Quando avançar 1 estágio:</strong> Canal da lavanderia, perseguição demorada a Varek, descanso demorado em Khorcova ou quando Alerta alcançar 5 pela 1ª vez. No estágio 3, Cassandra continua resgatável no corredor.
        </div>
      </div>

    </div>
  );
};
