'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { ChallengeConfig, ChallengeSkill } from '@/types/adventure';
import { 
  Target, 
  Dices, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  AlertTriangle, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface Props {
  config?: ChallengeConfig | null;
}

export const ChallengeSimulator: React.FC<Props> = ({ config }) => {
  const { 
    currentChallenge, 
    registerChallengeResult, 
    rollDice, 
    diceRollResult 
  } = useAdventureStore();

  const [selectedSkill, setSelectedSkill] = useState<ChallengeSkill | null>(
    config?.skills && config.skills.length > 0 ? config.skills[0] : null
  );
  const [customMod, setCustomMod] = useState<number>(0);

  if (!config) return null;

  const targetSuccesses = config.targetSuccesses || 3;
  const maxFailures = config.maxFailures || 3;
  const successes = currentChallenge?.successes || 0;
  const failures = currentChallenge?.failures || 0;

  const isCompleted = successes >= targetSuccesses;
  const isFailed = failures >= maxFailures;

  const handleRollForSkill = () => {
    if (!selectedSkill) return;
    rollDice(selectedSkill.name, selectedSkill.cd, customMod);
  };

  return (
    <div className="bg-[#10131e]/95 border-2 border-[#ffd166]/40 rounded-2xl p-4 shadow-xl space-y-3.5 my-2">
      {/* Header do Desafio */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-gray-950 font-bold shadow-md">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#ffd166] tracking-wide">
              {config.title}
            </h4>
            <span className="text-[10px] text-gray-400">
              Teste Estendido Tormenta20 • {targetSuccesses} Sucessos antes de {maxFailures} Falhas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{successes} / {targetSuccesses}</span>
          </div>
          <div className="flex items-center gap-1 bg-rose-950/40 border border-rose-500/40 text-rose-300 px-2 py-0.5 rounded-lg">
            <XCircle className="w-3.5 h-3.5" />
            <span>{failures} / {maxFailures}</span>
          </div>
        </div>
      </div>

      {/* Condição de Bônus se houver */}
      {config.bonusCondition && (
        <div className="bg-[#1b3a38]/60 border border-[#2ec4b6]/40 rounded-xl p-2.5 text-[11px] text-emerald-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#48cae4] flex-shrink-0" />
          <span>{config.bonusCondition}</span>
        </div>
      )}

      {/* Status de Conclusão */}
      {isCompleted ? (
        <div className="bg-gradient-to-r from-emerald-950/80 to-emerald-900/60 border border-emerald-500 rounded-xl p-3 text-center text-emerald-200 space-y-1">
          <Trophy className="w-6 h-6 text-amber-300 mx-auto" />
          <strong className="block text-sm font-serif text-white">🏆 Desafio Conquistado com Sucesso!</strong>
          <p className="text-xs text-emerald-300">O grupo superou todos os obstáculos requeridos.</p>
        </div>
      ) : isFailed ? (
        <div className="bg-gradient-to-r from-rose-950/80 to-rose-900/60 border border-rose-500 rounded-xl p-3 text-center text-rose-200 space-y-1">
          <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
          <strong className="block text-sm font-serif text-white">⚠️ Limite de Falhas Atingido!</strong>
          <p className="text-xs text-rose-300">Complicações severas ou custos foram acionados.</p>
        </div>
      ) : (
        <>
          {/* Seletor de Perícias Disponíveis */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Escolha a Perícia para o Teste:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {config.skills.map((s, idx) => {
                const isSelected = selectedSkill?.name === s.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSkill(s)}
                    className={`p-2 rounded-xl text-left transition-all border flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#9d4edd]/30 to-[#264653]/40 border-[#ffd166] text-white shadow'
                        : 'bg-[#141724] border-white/5 text-gray-300 hover:bg-[#1e2235]'
                    }`}
                  >
                    <div className="min-w-0">
                      <strong className="text-xs block truncate text-white">{s.name}</strong>
                      <span className="text-[10px] text-gray-400 line-clamp-1">{s.desc}</span>
                    </div>
                    <span className="font-mono font-bold text-[10px] text-amber-300 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30 flex-shrink-0">
                      CD {s.cd}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controles de Rolagem & Modificador */}
          <div className="bg-[#141724] border border-white/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-300 font-semibold">Modificador do Jogador:</span>
              <input
                type="number"
                value={customMod}
                onChange={(e) => setCustomMod(parseInt(e.target.value) || 0)}
                className="w-14 bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-center font-mono font-bold text-xs text-[#ffd166]"
                placeholder="+0"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRollForSkill}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#5a189a] hover:from-[#c77dff] hover:to-[#7b2cbf] text-white font-serif font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(157,78,221,0.5)] transition-all"
              >
                <Dices className="w-4 h-4 text-[#ffd166]" />
                <span>Rolar d20 + {customMod}</span>
              </button>

              <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                <button
                  onClick={() => registerChallengeResult('success')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold"
                  title="Marcar Sucesso Manual"
                >
                  + Sucesso
                </button>
                <button
                  onClick={() => registerChallengeResult('failure')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-800/60 text-rose-300 border border-rose-500/40 text-[11px] font-bold"
                  title="Marcar Falha Manual"
                >
                  + Falha
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Exibição do Último Resultado */}
      {diceRollResult && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <span className="text-gray-400 font-semibold">Última Rolagem:</span>
          <span className="font-mono font-bold text-[#ffd166]">{diceRollResult.breakdown}</span>
        </div>
      )}
    </div>
  );
};
