'use client';

import React, { useEffect, useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { useAudioStore } from '@/store/useAudioStore';
import { ADVENTURE_NODES, ADVENTURE_ACTS } from '@/data/adventureData';
import { ChallengeSimulator } from '@/components/challenge/ChallengeSimulator';
import { BossArena } from '@/components/combat/BossArena';
import { VarekCombatArena } from '@/components/combat/VarekCombatArena';
import { FerrenCombatArena } from '@/components/combat/FerrenCombatArena';
import { 
  BookOpen, 
  Lightbulb, 
  ArrowRight, 
  Music, 
  Volume2, 
  Compass, 
  ListTree, 
  Zap, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const SceneCard: React.FC = () => {
  const { getCurrentNode, chooseOption, jumpToNode, currentChallenge, actView, setActView } = useAdventureStore();
  const { suggestedCategories, playFirstOfCategory, currentCategory, isPlaying, suggestAmbienceForNode } = useAudioStore();
  const [showNodeSelector, setShowNodeSelector] = useState(false);

  const node = getCurrentNode();
  const allNodesList = Object.values(ADVENTURE_NODES);

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

      {/* BARRA SUPERIOR DO MESTRE: Meta & Navegador Rápido de Cenas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs uppercase tracking-widest text-[#c77dff] font-bold">
            {actTitle}
          </span>
          <span className="font-mono text-[11px] text-[#ffd166] bg-black/40 px-2 py-0.5 rounded border border-[#ffd166]/20">
            Nó Ativo: {node.id}
          </span>
        </div>

        {/* Seletor Rápido de Cenas do Mestre (Liberdade Total de Navegação) */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-[#0a0b10] border border-[#9d4edd]/40 rounded-xl px-2.5 py-1">
            <Compass className="w-3.5 h-3.5 text-[#ffd166]" />
            <span className="text-[11px] font-bold text-gray-300 hidden sm:inline">Saltar para Cena:</span>
            <select
              value={node.id}
              onChange={(e) => {
                const targetId = e.target.value;
                if (targetId) jumpToNode(targetId);
              }}
              className="bg-transparent text-xs text-[#ffd166] font-semibold outline-none cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
            >
              <optgroup label="── ATO I: A Jornada ──">
                {allNodesList.filter(n => (n.act || 1) === 1).map(n => (
                  <option key={n.id} value={n.id} className="bg-[#141724] text-white">
                    [{n.id}] {n.title}
                  </option>
                ))}
              </optgroup>

              <optgroup label="── ATO II: O Resgate & Severian ──">
                {allNodesList.filter(n => n.act === 2).map(n => (
                  <option key={n.id} value={n.id} className="bg-[#141724] text-white">
                    [{n.id}] {n.title}
                  </option>
                ))}
              </optgroup>

              <optgroup label="── ATO III: A Verdade & Fuga ──">
                {allNodesList.filter(n => n.act === 3).map(n => (
                  <option key={n.id} value={n.id} className="bg-[#141724] text-white">
                    [{n.id}] {n.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
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

      {/* Arena de Combate contra Boss I (Varek) */}
      {node.id === "VF" && (
        <VarekCombatArena />
      )}

      {/* Arena de Combate contra Boss III (Ferren Asloth - Escala S) */}
      {(node.id === "F1_ESCALA_S" || node.id === "BOSS_FERREN") && (
        <FerrenCombatArena />
      )}

      {/* Opções e Ramificações (com liberdade de escolha ou salto direto) */}
      {node.options && node.options.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs font-serif font-bold text-[#ffd166] uppercase tracking-wider mb-2">
            <span>⚔️ Decisões & Caminhos dos Aventureiros:</span>
            <span className="text-[10px] text-gray-400 font-sans font-normal lowercase">
              clique para avançar aplicando efeitos ou use o seletor acima para saltar livre
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {node.options.map((opt) => (
              <div
                key={opt.id}
                className="bg-[#161924]/95 border border-[#9d4edd]/25 hover:border-[#c77dff] rounded-xl p-3 text-left text-white flex items-center justify-between gap-3 group transition-all hover:bg-gradient-to-r hover:from-[#23283c] hover:to-[#9d4edd]/20 hover:shadow-[0_4px_16px_rgba(157,78,221,0.25)]"
              >
                <div 
                  onClick={() => chooseOption(opt.id)}
                  className="flex flex-col gap-1 max-w-[80%] cursor-pointer flex-1"
                >
                  <span className="font-semibold text-xs leading-snug text-gray-100 group-hover:text-white">
                    {opt.label}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {opt.badge && (
                      <span className="self-start text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#9d4edd]/20 text-[#c77dff] border border-[#9d4edd]/40">
                        {opt.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-gray-400">
                      Destino: <strong>[{opt.target}]</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Botão de Decisão Padrão */}
                  <button
                    onClick={() => chooseOption(opt.id)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-[#9d4edd] text-[#ffd166] group-hover:text-white text-xs font-bold flex items-center gap-1 transition-all shadow"
                    title="Avançar aplicando efeitos na sessão"
                  >
                    <span>Escolher</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Botão de Salto Livre Direto */}
                  <button
                    onClick={() => jumpToNode(opt.target)}
                    className="p-1.5 rounded-lg bg-black/40 hover:bg-white/15 text-gray-400 hover:text-[#ffd166] border border-white/5 transition-colors text-xs"
                    title={`Saltar direto para o nó [${opt.target}] sem aplicar efeitos`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

