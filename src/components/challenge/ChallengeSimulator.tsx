'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { ChallengeConfig } from '@/types/adventure';
import { Dices, CheckCircle2, XCircle, Zap } from 'lucide-react';

interface Props {
  config: ChallengeConfig;
}

export const ChallengeSimulator: React.FC<Props> = ({ config }) => {
  const { currentChallenge, registerChallengeResult, rollDice } = useAdventureStore();

  return (
    <div className="bg-[#0e1018]/95 border border-[#9d4edd]/30 rounded-xl p-3.5 my-3 shadow-lg">
      {/* Header do Desafio */}
      <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Dices className="w-4 h-4 text-[#ffd166]" />
          <span className="font-serif font-bold text-sm text-[#ffd166]">
            {config.title}
          </span>
        </div>

        {/* Contadores de Sucesso / Falha */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2ec4b6]">
            <span>Sucessos ({currentChallenge.successes}/{config.targetSuccesses}):</span>
            <div className="flex gap-1">
              {Array.from({ length: config.targetSuccesses }).map((_, i) => {
                const isFilled = i < currentChallenge.successes;
                return (
                  <div 
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isFilled 
                        ? 'bg-[#2ec4b6] shadow-[0_0_8px_#48cae4]' 
                        : 'bg-[#252836]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#e63946]">
            <span>Falhas ({currentChallenge.failures}/{config.maxFailures}):</span>
            <div className="flex gap-1">
              {Array.from({ length: config.maxFailures }).map((_, i) => {
                const isFilled = i < currentChallenge.failures;
                return (
                  <div 
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isFilled 
                        ? 'bg-[#e63946] shadow-[0_0_8px_#ff4d6d]' 
                        : 'bg-[#252836]'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {config.bonusCondition && (
        <div className="flex items-center gap-1.5 text-xs text-[#ffd166] bg-[#ffd166]/10 px-3 py-1.5 rounded-lg border border-[#ffd166]/20 mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>{config.bonusCondition}</span>
        </div>
      )}

      {/* Lista de Perícias Recomendadas */}
      <div className="space-y-1.5 mb-3">
        {config.skills.map((skill, idx) => (
          <div 
            key={idx}
            className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 flex items-center justify-between text-xs hover:border-[#9d4edd]/30 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{skill.name}</span>
                <span className="font-mono font-bold text-[#ffd166] bg-[#ffd166]/10 px-1.5 py-0.5 rounded text-[10px]">
                  CD {skill.cd}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{skill.desc}</p>
            </div>

            <button 
              onClick={() => rollDice(skill.name, skill.cd)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[#9d4edd]/20 hover:bg-[#9d4edd] text-[#c77dff] hover:text-white border border-[#9d4edd]/40 flex items-center gap-1 transition-all"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Rolar Teste</span>
            </button>
          </div>
        ))}
      </div>

      {/* Ações de Registro Direto */}
      <div className="flex gap-2">
        <button 
          onClick={() => registerChallengeResult('success')}
          className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-[#2ec4b6]/20 hover:bg-[#2ec4b6] text-[#48cae4] hover:text-gray-950 border border-[#2ec4b6]/40 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(46,196,182,0.2)]"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Registrar Sucesso</span>
        </button>
        <button 
          onClick={() => registerChallengeResult('failure')}
          className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-[#e63946]/20 hover:bg-[#e63946] text-[#ff758f] hover:text-white border border-[#e63946]/40 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(230,57,70,0.2)]"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Registrar Falha</span>
        </button>
      </div>
    </div>
  );
};
