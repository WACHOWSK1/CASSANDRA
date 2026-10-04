'use client';

import React, { useState } from 'react';
import { useAdventureStore, PylonStatus } from '@/store/useAdventureStore';
import { ANTIMAGIA_RULES } from '@/data/rulesData';
import { 
  Zap, 
  ShieldAlert, 
  Flame, 
  EyeOff, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Hammer, 
  Move, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const AntimagiaPylonsPanel: React.FC = () => {
  const { 
    pylonsList, 
    setPylonStatus, 
    lanternasState, 
    toggleLanternaActive, 
    setLanternaDenunciou 
  } = useAdventureStore();

  const [expandedSection, setExpandedSection] = useState<'pilonos' | 'lanternas' | 'passos' | 'acoes'>('pilonos');

  const activePylonsCount = pylonsList.filter(p => p.status === 'ativo').length;
  const neutralizedCount = 4 - activePylonsCount;

  const getNetCondition = () => {
    if (activePylonsCount === 4) {
      return { 
        status: "Condição Terrível (4 Ativos)", 
        cdDesc: "Vontade CD 20 + custo da magia em PM", 
        badgeClass: "bg-[#e63946]/20 text-[#ff758f] border-[#e63946]/50",
        alertDesc: "A rede opera em potência máxima. A primeira prioridade dos heróis é desativar qualquer pilono!"
      };
    }
    if (activePylonsCount > 0) {
      return { 
        status: `Condição Ruim (${activePylonsCount} Ativo${activePylonsCount > 1 ? 's' : ''})`, 
        cdDesc: "Vontade CD 15 + custo da magia em PM", 
        badgeClass: "bg-[#ffd166]/20 text-[#ffd166] border-[#ffd166]/50",
        alertDesc: "Pressão da arena reduzida. Cada pilono desativado enfraquece Severian e remove 1 núcleo de 3m."
      };
    }
    return { 
      status: "Rede Inativa / Normal (0 Ativos)", 
      cdDesc: "Sem teste adicional de conjuração", 
      badgeClass: "bg-[#2ec4b6]/20 text-[#48cae4] border-[#2ec4b6]/50",
      alertDesc: "A rede caiu! Severian perdeu a imunidade e não pode consumir pilonos para sobreviver com 1 PV."
    };
  };

  const netInfo = getNetCondition();

  const getPylonStatusBadge = (status: PylonStatus) => {
    switch (status) {
      case 'ativo':
        return { label: 'Ativo (Campo 3m)', class: 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]/40' };
      case 'invertido':
        return { label: 'Invertido (Refúgio 3m)', class: 'bg-[#2ec4b6]/20 text-[#48cae4] border-[#2ec4b6]/40' };
      case 'destruido':
        return { label: 'Destruído (Inativo)', class: 'bg-white/10 text-gray-400 border-white/10' };
      case 'tombado':
        return { label: 'Tombado (Cobertura)', class: 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]/40' };
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs">
      
      {/* 1. MONITOR CENTRAL DOS PILONOS DA OITAVA ESTRELA */}
      <div className="bg-[#0a0b10]/90 border-2 border-[#9d4edd]/50 rounded-2xl p-3.5 shadow-[0_0_20px_rgba(157,78,221,0.25)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-serif font-bold text-[#ffd166] text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-purple-400" />
            <span>Pilonos Arcanos da Oitava Estrela</span>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${netInfo.badgeClass}`}>
            {netInfo.status}
          </span>
        </div>

        {/* Efeito em Severian em Tempo Real */}
        <div className="bg-[#141724] border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Impacto em Severian:</span>
            <span className="font-bold text-[#ff758f] text-xs">
              {neutralizedCount > 0 ? `–${neutralizedCount} Defesa / –${neutralizedCount} Resistências` : 'Nenhuma penalidade'}
            </span>
          </div>

          <div className="text-right font-mono text-[11px] text-gray-300">
            {activePylonsCount > 0 ? (
              <span className="text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                1 PV Save Ativo
              </span>
            ) : (
              <span className="text-[#48cae4] bg-[#2ec4b6]/20 px-2 py-0.5 rounded border border-[#2ec4b6]/40">
                Vulnerável
              </span>
            )}
          </div>
        </div>

        {/* Lista dos 4 Pilonos Interativos */}
        <div className="space-y-2">
          {pylonsList.map((pylon) => {
            const badge = getPylonStatusBadge(pylon.status);
            return (
              <div 
                key={pylon.id}
                className="bg-[#141724]/90 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-[#ffd166]">#{pylon.id}</span>
                    <span className="font-bold text-white text-xs">{pylon.nome}</span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${badge.class}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Botões de Ação Rápida por Pilono */}
                <div className="grid grid-cols-4 gap-1 pt-1">
                  <button
                    onClick={() => setPylonStatus(pylon.id, 'ativo')}
                    className={`py-1 rounded text-[10px] font-semibold transition-all border ${
                      pylon.status === 'ativo'
                        ? 'bg-[#e63946] text-white border-[#ff758f] shadow-[0_0_8px_rgba(230,57,70,0.6)]'
                        : 'bg-black/40 text-gray-400 border-white/5 hover:text-white'
                    }`}
                    title="Ativar Pilono (Campo 3m Antimagia Total)"
                  >
                    Ativo
                  </button>

                  <button
                    onClick={() => setPylonStatus(pylon.id, 'invertido')}
                    className={`py-1 rounded text-[10px] font-semibold transition-all border ${
                      pylon.status === 'invertido'
                        ? 'bg-[#2ec4b6] text-gray-950 font-bold border-[#48cae4] shadow-[0_0_8px_rgba(46,196,182,0.8)]'
                        : 'bg-black/40 text-gray-400 border-white/5 hover:text-white'
                    }`}
                    title="Inverter Runas (Cria refúgio de 3m seguro para aliados)"
                  >
                    Invertido
                  </button>

                  <button
                    onClick={() => setPylonStatus(pylon.id, 'destruido')}
                    className={`py-1 rounded text-[10px] font-semibold transition-all border ${
                      pylon.status === 'destruido'
                        ? 'bg-purple-900 text-purple-200 border-purple-400'
                        : 'bg-black/40 text-gray-400 border-white/5 hover:text-white'
                    }`}
                    title="Destruir Pilono (0 PV)"
                  >
                    Destruído
                  </button>

                  <button
                    onClick={() => setPylonStatus(pylon.id, 'tombado')}
                    className={`py-1 rounded text-[10px] font-semibold transition-all border ${
                      pylon.status === 'tombado'
                        ? 'bg-[#e0a96d] text-gray-950 font-bold border-[#ffd166]'
                        : 'bg-black/40 text-gray-400 border-white/5 hover:text-white'
                    }`}
                    title="Romper Suporte / Tombar (Fornece Cobertura +5 Def)"
                  >
                    Tombado
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regra do Núcleo de 3m vs Arena */}
        <div className="bg-[#141724] border-l-2 border-[#ff758f] rounded-r-xl p-2.5 text-[11px] text-gray-300 space-y-1">
          <div className="font-bold text-[#ff758f] uppercase text-[10px]">
            ⚠️ Diferença Crucial de Regra:
          </div>
          <p>
            • <strong>Dentro dos 3m de um Pilono Ativo:</strong> Campo Antimagia Total. Magias e itens mágicos ficam desligados. Sem teste.
          </p>
          <p>
            • <strong>Fora dos 3m (na Arena):</strong> Conjuração é permitida com teste de <em>{netInfo.cdDesc}</em>.
          </p>
        </div>
      </div>

      {/* 2. MONITOR DAS LANTERNAS NULAS DE KHORCOVA */}
      <div className="bg-[#0a0b10]/90 border border-[#e0a96d]/40 rounded-2xl p-3.5 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-serif font-bold text-[#ffd166] text-xs uppercase tracking-wider">
            <EyeOff className="w-4 h-4 text-amber-300" />
            <span>Lanternas Nulas (Galeria dos Confiscados)</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleLanternaActive(-1)}
              disabled={lanternasState.ativas <= 0}
              className="w-5 h-5 rounded bg-white/10 hover:bg-[#ffd166] hover:text-gray-950 text-white flex items-center justify-center text-xs disabled:opacity-30"
              title="Desativar 1 lanterna"
            >
              -
            </button>
            <span className="font-mono font-bold text-xs text-[#ffd166] px-1">
              {lanternasState.ativas} / {lanternasState.total} Ativas
            </span>
            <button
              onClick={() => toggleLanternaActive(1)}
              disabled={lanternasState.ativas >= lanternasState.total}
              className="w-5 h-5 rounded bg-white/10 hover:bg-[#ffd166] hover:text-gray-950 text-white flex items-center justify-center text-xs disabled:opacity-30"
              title="Ativar 1 lanterna"
            >
              +
            </button>
          </div>
        </div>

        {/* Efeito da Lanterna */}
        <div className="bg-[#141724] border border-white/5 rounded-xl p-2.5 space-y-1">
          <div className="text-[11px] font-bold text-amber-300">
            Esfera de 9m de Raio:
          </div>
          <p className="text-gray-300 text-xs leading-snug">
            Condição Ruim: <strong>Vontade CD 15 + custo em PM</strong>. Em falha, perde a magia e gasta os PMs.
          </p>
          <p className="text-[10px] text-gray-400 italic">
            *Não desfaz magias já ativas nem propriedades de itens mágicos. A 1ª magia lançada na cena sob a lanterna gera +1 Alerta.
          </p>
        </div>

        {/* Ações contra a Lanterna */}
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="bg-[#141724] p-2 rounded-lg border border-white/5">
            <strong className="text-white block">Fechar Obturadores:</strong>
            <span className="text-gray-300">Ação padrão; Ladinagem/Ofício CD 20. Desliga sem quebrar.</span>
          </div>
          <div className="bg-[#141724] p-2 rounded-lg border border-white/5">
            <strong className="text-white block">Destruir Cristal:</strong>
            <span className="text-gray-300">Def 18, RD 5, 15 PV. Ruptura: 2d6 essência em 3m (CD 20).</span>
          </div>
        </div>
      </div>

      {/* 3. ÁRVORE DE RESOLUÇÃO RÁPIDA DE MAGIA (4 PASSOS) */}
      <div className="bg-[#0a0b10]/90 border border-white/10 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-serif font-bold text-xs text-[#48cae4] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Guia Rápido: Como Resolver Magias em Cena</span>
          </span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          {ANTIMAGIA_RULES.passoAPassoMagia.map((p) => (
            <div key={p.passo} className="bg-[#141724] p-2 rounded-lg border border-white/5 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#9d4edd] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                {p.passo}
              </span>
              <div>
                <strong className="text-white block">{p.pergunta}</strong>
                <span className="text-gray-300 leading-snug">{p.aplicacao}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
