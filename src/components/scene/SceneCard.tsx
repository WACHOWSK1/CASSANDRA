'use client';

import React, { useEffect } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useAudioStore } from '@/store/useAudioStore';
import { ChallengeSimulator } from '@/components/challenge/ChallengeSimulator';
import { BossArena } from '@/components/combat/BossArena';
import { 
  BookOpen, 
  Lightbulb, 
  ArrowRight, 
  Music, 
  Volume2
} from 'lucide-react';

export const SceneCard: React.FC = () => {
  const { getCurrentNode, chooseOption, currentChallenge } = useAdventureStore();
  const { suggestedCategories, playFirstOfCategory, currentCategory, isPlaying, suggestAmbienceForNode } = useAudioStore();

  const node = getCurrentNode();

  useEffect(() => {
    suggestAmbienceForNode(node.id);
  }, [node.id, suggestAmbienceForNode]);

  let actTitle = `Ato ${node.act || 1}`;
  if (node.act === 1) actTitle += ": A Jornada até Milothiann";
  else if (node.act === 2) actTitle += ": O Resgate e Severian";
  else if (node.act === 3) actTitle += ": A Verdade & Fuga da Ascensão";

  return (
    <div className="bg-[#141724]/90 border border-[#c77dff]/40 rounded-2xl p-4 shadow-[0_0_25px_rgba(157,78,221,0.25)] relative overflow-hidden flex-shrink-0">
      {/* Top Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e0a96d] via-[#9d4edd] to-[#e63946]" />

      {/* Meta e Título */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-[#c77dff] font-bold">
          {actTitle}
        </span>
        <span className="font-mono text-[11px] text-gray-500">
          Nó: {node.id}
        </span>
      </div>

      <h2 className="font-serif text-xl font-bold text-[#f3c68f] mb-3 drop-shadow-[0_0_12px_rgba(243,198,143,0.3)]">
        {node.title}
      </h2>

      {/* Sugestões Rápidas de Trilha Sonora */}
      {suggestedCategories.length > 0 && (
        <div className="bg-[#9d4edd]/10 border border-[#9d4edd]/25 rounded-xl px-3 py-1.5 mb-3 flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1 font-bold text-[#c77dff] whitespace-nowrap">
            <Music className="w-3.5 h-3.5" />
            <span>Trilhas Sugeridas:</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {suggestedCategories.map((cat, idx) => {
              const isActive = currentCategory.toUpperCase() === cat.toUpperCase() && isPlaying;
              return (
                <button
                  key={idx}
                  onClick={() => playFirstOfCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    isActive
                      ? 'bg-[#9d4edd] text-white border border-[#c77dff] shadow-[0_0_10px_rgba(199,125,255,0.6)]'
                      : 'bg-[#0a0b10]/80 text-gray-300 border border-white/10 hover:border-[#c77dff]/60 hover:text-white'
                  }`}
                >
                  <Volume2 className={`w-3 h-3 ${isActive ? 'text-amber-300' : 'text-gray-400'}`} />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Caixa de Leitura em Voz Alta */}
      {node.narration && (
        <div className="bg-[#0a0b10]/75 border-l-4 border-[#c77dff] rounded-r-xl p-3.5 mb-3 text-sm italic text-gray-200 shadow-inner">
          <div className="flex items-center gap-1.5 not-italic font-serif text-[11px] font-bold uppercase tracking-wider text-[#c77dff] mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Narração para Leitura em Voz Alta</span>
          </div>
          <p className="leading-relaxed">"{node.narration}"</p>
        </div>
      )}

      {/* Dicas do Mestre */}
      {node.gmTips && (
        <div className="bg-[#e0a96d]/10 border border-dashed border-[#e0a96d]/40 rounded-xl p-3 mb-3 text-xs text-[#f7e1c8]">
          <div className="flex items-center gap-1.5 font-bold text-[#ffd166] uppercase text-[11px] mb-0.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
            <span>Dica de Condução para o Mestre</span>
          </div>
          <p className="leading-relaxed">{node.gmTips}</p>
        </div>
      )}

      {/* Desafio Estendido */}
      {node.challengeConfig && currentChallenge.active && (
        <ChallengeSimulator config={node.challengeConfig} />
      )}

      {/* Arena de Combate contra Boss */}
      {node.id === "BOSS_SEVERIAN" && (
        <BossArena />
      )}

      {/* Opções e Ramificações */}
      {node.options && node.options.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#ffd166] uppercase tracking-wider mb-2">
            <span>⚔️ Decisões & Caminhos dos Aventureiros:</span>
          </div>

          <div className="flex flex-col gap-2">
            {node.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => chooseOption(opt.id)}
                className="bg-[#161924]/95 border border-[#9d4edd]/25 hover:border-[#c77dff] rounded-xl p-3 text-left text-white flex items-center justify-between gap-3 group transition-all hover:translate-x-1 hover:bg-gradient-to-r hover:from-[#23283c] hover:to-[#9d4edd]/20 hover:shadow-[0_4px_16px_rgba(157,78,221,0.25)]"
              >
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <span className="font-semibold text-xs leading-snug text-gray-100 group-hover:text-white">
                    {opt.label}
                  </span>
                  {opt.badge && (
                    <span className="self-start text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#9d4edd]/20 text-[#c77dff] border border-[#9d4edd]/40">
                      {opt.badge}
                    </span>
                  )}
                </div>

                <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#9d4edd] text-[#ffd166] group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
