'use client';

import React, { useState } from 'react';
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
  AlertTriangle,
  Skull,
  Eye,
  Crosshair,
  Award,
  Shield,
  Dices,
  Lock,
  Volume2
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

  // PV e PM de Severian (ND 10-12 Chefe Solo)
  const bonusPV = bossState?.severianBonusPV || 0; // +30 se Varek tiver fugido
  const maxPV = 260 + bonusPV;
  const maxPM = 75;

  const [currentPV, setCurrentPV] = useState<number>(maxPV);
  const [currentPM, setCurrentPM] = useState<number>(maxPM);
  const [apocalipseUsado, setApocalipseUsado] = useState<boolean>(false);
  const [lastActionLog, setLastActionLog] = useState<{
    titulo: string;
    detalhes: string;
    tipo: 'ataque' | 'magia' | 'chefe' | 'cura';
  } | null>(null);

  // Fase 2: O Despertar da Oitava Estrela (Aos 50% de PV ou restando ≤ 1 pilono)
  const isPhase2 = currentPV <= (maxPV / 2) || activeCount <= 1;

  // Estatísticas dinâmicas de Severian baseadas nos pilonos
  const baseDefesa = isPhase2 ? 34 : 32;
  const baseRD = 15;
  const currentDefesa = Math.max(22, baseDefesa - destroyedCount * 2);
  const currentRD = Math.max(0, baseRD - destroyedCount * 4);
  const regenPorTurno = activeCount * 10;

  // Modificadores de PV e PM
  const handleModifyPV = (delta: number) => {
    setCurrentPV(prev => Math.max(0, Math.min(maxPV, prev + delta)));
  };

  const handleModifyPM = (delta: number) => {
    setCurrentPM(prev => Math.max(0, Math.min(maxPM, prev + delta)));
  };

  // 1. Regeneração por Turno da Rede
  const handleRegenerarTurno = () => {
    if (activeCount === 0) {
      setLastActionLog({
        titulo: "⚠️ Rede Antimagia Inativa!",
        detalhes: "Todos os pilonos foram destruídos ou neutralizados. Severian não pode mais regenerar PV.",
        tipo: "cura"
      });
      return;
    }
    const curaEfetiva = Math.min(regenPorTurno, maxPV - currentPV);
    handleModifyPV(regenPorTurno);
    setLastActionLog({
      titulo: `✨ Regeneração dos Pilonos Aplicada (+${curaEfetiva} PV)`,
      detalhes: `A rede de ${activeCount} pilonos ativos canaliza essência sacrificial, curando Severian em ${regenPorTurno} PV (10 PV por pilono ativo).`,
      tipo: "cura"
    });
  };

  // 2. Báculo dos Mártires Corrompidos (+22 Ataque)
  const handleBaculoProfano = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const bonus = 22;
    const totalAtaque = d20 + bonus;
    const isCrit = d20 >= 19;

    let dano = 0;
    const numDados = isCrit ? 9 : 3; // Crítico x3
    for (let i = 0; i < numDados; i++) dano += Math.floor(Math.random() * 8) + 1;
    dano += isCrit ? 36 : 12;

    const pmDrenado = isCrit 
      ? Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 
      : Math.floor(Math.random() * 6) + 1;

    handleModifyPV(dano); // Cura Severian com dano de trevas
    setLastActionLog({
      titulo: `💀 Báculo de Ossos Santos & Mártires! ${isCrit ? '💥 CRÍTICO DESTRUTIVO (x3)!' : ''}`,
      detalhes: `Ataque: [${d20} + 22] = ${totalAtaque} contra a Defesa do herói | Dano: ${dano} de Impacto/Trevas | Drenagem: ${pmDrenado} PM do herói! Severian se cura em +${dano} PV!`,
      tipo: "ataque"
    });
  };

  // 3. Julgamento Herético em Cone (4 PM, CD 25)
  const handleJulgamentoHeretico = () => {
    if (currentPM < 4) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Julgamento Herético!",
        detalhes: "Severian precisa de 4 PM para conjurar este feitiço de 3º círculo.",
        tipo: "magia"
      });
      return;
    }
    handleModifyPM(-4);
    let dano = 0;
    for (let i = 0; i < 8; i++) dano += Math.floor(Math.random() * 6) + 1;
    dano += 8;

    setLastActionLog({
      titulo: "🔮 Julgamento Herético em Cone de 12m! (Gasto -4 PM)",
      detalhes: `Labaredas negras explodem em cone de 12m causando ${dano} de dano de Trevas e Fogo (Reflexos CD 25 reduz à metade). Quem falhar fica CONDENADO (+1d6 de dano de qualquer fonte na próxima rodada).`,
      tipo: "magia"
    });
  };

  // 4. Colunas de Fogo Profano (6 PM, CD 25)
  const handleColunasFogo = () => {
    if (currentPM < 6) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Colunas de Fogo Profano!",
        detalhes: "Severian precisa de 6 PM para conjurar este feitiço de 4º círculo.",
        tipo: "magia"
      });
      return;
    }
    handleModifyPM(-6);
    let dano = 0;
    for (let i = 0; i < 6; i++) dano += Math.floor(Math.random() * 8) + 1;
    dano += 12;

    setLastActionLog({
      titulo: "🔥 Colunas de Fogo Profano do Abismo! (Gasto -6 PM)",
      detalhes: `Duas colunas de 3m de raio e 15m de altura irrompem do piso! Causa ${dano} de dano de Fogo e Trevas (Reflexos CD 25 reduz metade), ignorando metade de qualquer RD elemental do herói.`,
      tipo: "magia"
    });
  };

  // 5. Grilhões Litúrgicos de Sangue (4 PM, CD 25)
  const handleGrilhoesSangue = () => {
    if (currentPM < 4) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Grilhões de Sangue!",
        detalhes: "São necessários 4 PM para prender os alvos.",
        tipo: "magia"
      });
      return;
    }
    handleModifyPM(-4);
    setLastActionLog({
      titulo: "⛓️ Grilhões Litúrgicos de Sangue! (Gasto -4 PM)",
      detalhes: "Correntes de ferro sacrificial prendem até 2 heróis a até 30m. Alvos ficam PRESOS e SUFOCADOS (não podem conjurar sem Vontade CD 25 e sofrem 3d6 trevas/turno).",
      tipo: "magia"
    });
  };

  // 6. Ação de Chefe: Repulsa Sacrílega
  const handleRepulsaSacrilega = () => {
    let dano = 0;
    for (let i = 0; i < 3; i++) dano += Math.floor(Math.random() * 8) + 1;
    dano += 6;
    setLastActionLog({
      titulo: "⚡ AÇÃO DE CHEFE: Repulsa Sacrílega da Oitava Estrela!",
      detalhes: `Onda de choque profana em raio de 9m ao redor de Severian: todos os heróis são empurrados 6m para trás e sofrem ${dano} de dano de impacto e trevas (Fortitude CD 25 reduz metade e evita empurrão).`,
      tipo: "chefe"
    });
  };

  // 7. Ação de Chefe: Comando Rápido (2 PM)
  const handleComandoRapido = () => {
    if (currentPM < 2) return;
    handleModifyPM(-2);
    setLastActionLog({
      titulo: "👁️ AÇÃO DE CHEFE: Comando Rápido da Inquisição! (-2 PM)",
      detalhes: "Severian aponta seu báculo e troveja a ordem dogmática. O herói alvo deve passar em Vontade CD 25 ou é forçado a CAIR DE JOELHOS (Caído) ou soltar sua arma no chão.",
      tipo: "chefe"
    });
  };

  // 8. Ação de Chefe: Passo pelas Sombras (2 PM)
  const handlePassoSombras = () => {
    if (currentPM < 2) return;
    handleModifyPM(-2);
    setLastActionLog({
      titulo: "🌫️ AÇÃO DE CHEFE: Passo pelas Sombras dos Pilonos! (-2 PM)",
      detalhes: "Severian se desfaz em cinzas e névoa profana, ressurgindo instantaneamente adjacente a qualquer pilono ativo e ganhando Camuflagem Leve (20% de falha) até seu próximo turno.",
      tipo: "chefe"
    });
  };

  // 9. Apocalipse Menor de Ferren (10 PM, 1x combate - Fase 2)
  const handleApocalipseFerren = () => {
    if (currentPM < 10) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para o Apocalipse!",
        detalhes: "São necessários 10 PM para desferir o golpe divino da Oitava Estrela.",
        tipo: "magia"
      });
      return;
    }
    handleModifyPM(-10);
    setApocalipseUsado(true);
    let dano = 0;
    for (let i = 0; i < 10; i++) dano += Math.floor(Math.random() * 10) + 1;

    setLastActionLog({
      titulo: "🌟 APOCALIPSE MENOR DE FERREN! (Gasto -10 PM)",
      detalhes: `A Oitava Estrela explode em supernova profana que cobre toda a arena (raio 15m)! Causa ${dano} de dano profano em TODOS os heróis (Reflexos CD 25 reduz à metade).`,
      tipo: "magia"
    });
  };

  return (
    <div className="bg-[#120e1c]/95 border-2 border-[#9d4edd]/60 rounded-2xl p-4 shadow-[0_0_35px_rgba(157,78,221,0.35)] space-y-4 my-2 text-white">
      
      {/* HEADER DA ARENA DO CHEFE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#9d4edd] via-[#5a189a] to-[#e63946] flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Arena da Oitava Estrela: Inquisidor-Mor Severian
              </h3>
              <span className="bg-rose-950/80 border border-rose-500 text-rose-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                ND 10-12 (Chefe Solo)
              </span>
              {bonusPV > 0 && (
                <span className="bg-amber-950/80 border border-amber-500 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                  +{bonusPV} PV (Varek Avisou)
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-300">
              Arauto da Oitava Estrela • Rede Antimagia & Sacrifício Ritualístico
            </span>
          </div>
        </div>

        {/* Indicador de Status dos Pilonos */}
        <div className="flex items-center gap-2 font-mono text-xs self-start sm:self-auto">
          <span className={`px-3 py-1 rounded-full border font-bold ${
            activeCount === 0
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500'
              : 'bg-rose-950/60 text-rose-300 border-rose-500 alert-pulse-animation'
          }`}>
            {activeCount > 0 ? `${activeCount} / 4 Pilonos Ativos` : '✦ Rede Antimagia Destruída!'}
          </span>
        </div>
      </div>

      {/* BANNER DINÂMICO DE FASE 2 */}
      {isPhase2 && (
        <div className="bg-gradient-to-r from-rose-950/90 via-purple-950/90 to-rose-950/90 border border-rose-500/80 rounded-xl p-3 text-center shadow-[0_0_20px_rgba(230,57,70,0.4)] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-center gap-2 text-rose-300 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>✦ FASE 2 ATIVADA: O DESPERTAR DA OITAVA ESTRELA! ✦</span>
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
          </div>
          <p className="text-[11px] text-gray-200 mt-1 leading-snug">
            Severian rasga suas vestes revelando asas etéreas de corvos profanos: ganha <strong>Voo 12m</strong>, 
            <strong> Aura de Condenação</strong> (2d6 trevas/turno a até 9m) e libera o golpe final <strong>Apocalipse Menor de Ferren</strong>!
          </p>
        </div>
      )}

      {/* PAINEL DINÂMICO DE DEFESAS E RD */}
      <div className="bg-[#1a1426] border border-[#9d4edd]/30 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Defesa Atual</span>
          <strong className="text-base font-mono text-[#ffd166]">{currentDefesa}</strong>
          <span className="text-[9px] text-gray-400 block">{destroyedCount > 0 ? `(-${destroyedCount * 2} por pilonos)` : '(Base 32)'}</span>
        </div>

        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Redução de Dano</span>
          <strong className="text-base font-mono text-[#48cae4]">RD {currentRD}</strong>
          <span className="text-[9px] text-gray-400 block">{destroyedCount > 0 ? `(-${destroyedCount * 4} por pilonos)` : '(Base 15)'}</span>
        </div>

        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Escudo de Sacrifício</span>
          <strong className="text-xs font-mono text-[#ff758f] block mt-0.5">
            {activeCount > 0 ? '1 PV Save Ativo' : 'Vulnerável'}
          </strong>
          <span className="text-[9px] text-gray-400 block">Consome 1 pilono p/ não morrer</span>
        </div>

        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
          <span className="text-[10px] text-gray-400 uppercase block font-semibold">Regeneração Ativa</span>
          <strong className="text-xs font-mono text-emerald-300 block mt-0.5">
            {activeCount > 0 ? `+${regenPorTurno} PV / rodada` : 'Desativada'}
          </strong>
          <button
            onClick={handleRegenerarTurno}
            disabled={activeCount === 0}
            className="mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 transition-all disabled:opacity-40"
          >
            Aplicar Regeneração
          </button>
        </div>
      </div>

      {/* TRACKERS DE PV E PM DINÂMICOS DE SEVERIAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#181424] border border-white/5 p-3 rounded-xl">
        
        {/* PV METER */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[#ff758f] font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Pontos de Vida de Severian:</span>
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {currentPV} / {maxPV}
            </span>
          </div>
          <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div 
              className={`h-full transition-all duration-300 ${
                currentPV <= 60 
                  ? 'bg-rose-600 animate-pulse' 
                  : currentPV <= (maxPV / 2) 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, (currentPV / maxPV) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <button onClick={() => handleModifyPV(-30)} className="px-2 py-0.5 bg-black/40 hover:bg-rose-900 border border-white/10 rounded">-30</button>
            <button onClick={() => handleModifyPV(-15)} className="px-2 py-0.5 bg-black/40 hover:bg-rose-900 border border-white/10 rounded">-15</button>
            <button onClick={() => handleModifyPV(-10)} className="px-2 py-0.5 bg-black/40 hover:bg-rose-900 border border-white/10 rounded">-10</button>
            <button onClick={() => handleModifyPV(20)} className="px-2 py-0.5 bg-black/40 hover:bg-emerald-900 border border-white/10 rounded">+20</button>
            <button onClick={() => setCurrentPV(maxPV)} className="px-2 py-0.5 bg-black/40 hover:bg-emerald-900 border border-emerald-500/30 rounded text-emerald-300">Full</button>
          </div>
        </div>

        {/* PM METER */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[#48cae4] font-bold">
              <Zap className="w-3.5 h-3.5 fill-cyan-400" />
              <span>Pontos de Mana (PM):</span>
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {currentPM} / {maxPM}
            </span>
          </div>
          <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-[#5a189a] to-[#48cae4] transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, (currentPM / maxPM) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <button onClick={() => handleModifyPM(-6)} className="px-2 py-0.5 bg-black/40 hover:bg-cyan-950 border border-cyan-500/30 rounded text-cyan-300">-6 (Colunas)</button>
            <button onClick={() => handleModifyPM(-4)} className="px-2 py-0.5 bg-black/40 hover:bg-cyan-950 border border-cyan-500/30 rounded text-cyan-300">-4 (Julgamento)</button>
            <button onClick={() => handleModifyPM(-2)} className="px-2 py-0.5 bg-black/40 hover:bg-cyan-950 border border-cyan-500/30 rounded text-cyan-300">-2 (Chefe)</button>
            <button onClick={() => setCurrentPM(maxPM)} className="px-2 py-0.5 bg-black/40 hover:bg-emerald-900 border border-emerald-500/30 rounded text-emerald-300">Max</button>
          </div>
        </div>
      </div>

      {/* AÇÕES DE CHEFE SOLO (FORA DE TURNO - AMEAÇAS DE ARTON) */}
      <div className="space-y-2">
        <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#ff758f] flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Ações de Chefe Solo (Usadas no Fim do Turno de um Jogador):</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={handleRepulsaSacrilega}
            className="p-2.5 rounded-xl bg-[#22101e] hover:bg-[#32172d] border border-rose-500/40 text-left transition-all"
          >
            <strong className="text-xs text-rose-200 block">⚡ Repulsa Sacrílega</strong>
            <span className="text-[10px] text-gray-300 block mt-0.5">
              Empurra 6m e causa 3d8+6 impacto/trevas em raio de 9m (CD 25).
            </span>
          </button>

          <button
            onClick={handleComandoRapido}
            className="p-2.5 rounded-xl bg-[#181226] hover:bg-[#261d3c] border border-purple-500/40 text-left transition-all"
          >
            <strong className="text-xs text-purple-200 block">👁️ Comando Rápido (-2 PM)</strong>
            <span className="text-[10px] text-gray-300 block mt-0.5">
              Alvo deve passar em Vontade CD 25 ou cai de joelhos / solta arma.
            </span>
          </button>

          <button
            onClick={handlePassoSombras}
            className="p-2.5 rounded-xl bg-[#121c24] hover:bg-[#1a2935] border border-cyan-500/40 text-left transition-all"
          >
            <strong className="text-xs text-cyan-200 block">🌫️ Passo pelas Sombras (-2 PM)</strong>
            <span className="text-[10px] text-gray-300 block mt-0.5">
              Teletransporta-se para junto de um pilono e ganha camuflagem leve.
            </span>
          </button>
        </div>
      </div>

      {/* MAGIAS & ATAQUES PRINCIPAIS DE SEVERIAN */}
      <div className="space-y-2">
        <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#ffd166] block">
          ⚔️ Feitiços & Ataques Principais de Severian:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          
          {/* BÁCULO PROFANO */}
          <button
            onClick={handleBaculoProfano}
            className="p-2.5 rounded-xl bg-gradient-to-r from-rose-950/70 via-purple-950/80 to-[#181226] hover:from-rose-900 border border-rose-500/50 flex items-center justify-between text-left transition-all shadow"
          >
            <div>
              <strong className="text-xs text-white block">💀 Báculo de Ossos Santos & Mártires</strong>
              <span className="text-[10px] text-rose-200/80 block">
                Ataque +22 • Dano 3d8+12 trevas + drena 1d6 PM e cura Severian!
              </span>
            </div>
            <span className="font-mono text-[11px] text-rose-300 font-bold bg-black/40 px-2 py-1 rounded">
              +22 Atq
            </span>
          </button>

          {/* JULGAMENTO HERÉTICO */}
          <button
            onClick={handleJulgamentoHeretico}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#9d4edd]/30 to-[#181226] hover:from-[#9d4edd]/50 border border-[#9d4edd]/50 flex items-center justify-between text-left transition-all shadow"
          >
            <div>
              <strong className="text-xs text-white block">🔮 Julgamento Herético em Cone (12m)</strong>
              <span className="text-[10px] text-purple-200/80 block">
                8d6+8 Trevas e Fogo (CD 25) • Deixa alvos Condenados (+1d6 dano)!
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#c77dff] font-bold bg-black/40 px-2 py-1 rounded">
              -4 PM
            </span>
          </button>

          {/* COLUNAS DE FOGO PROFANO */}
          <button
            onClick={handleColunasFogo}
            className="p-2.5 rounded-xl bg-[#241315] hover:bg-[#341b1e] border border-orange-500/50 flex items-center justify-between text-left transition-all shadow"
          >
            <div>
              <strong className="text-xs text-white block">🔥 Colunas de Fogo Profano (4º Círculo)</strong>
              <span className="text-[10px] text-orange-200/80 block">
                6d8+12 de Fogo/Trevas em duas áreas de 3m (CD 25, ignora RD elemental).
              </span>
            </div>
            <span className="font-mono text-[11px] text-orange-300 font-bold bg-black/40 px-2 py-1 rounded">
              -6 PM
            </span>
          </button>

          {/* GRILHÕES DE SANGUE */}
          <button
            onClick={handleGrilhoesSangue}
            className="p-2.5 rounded-xl bg-[#161a26] hover:bg-[#1f2638] border border-blue-500/50 flex items-center justify-between text-left transition-all shadow"
          >
            <div>
              <strong className="text-xs text-white block">⛓️ Grilhões Litúrgicos de Sangue</strong>
              <span className="text-[10px] text-blue-200/80 block">
                Prende e sufoca até 2 heróis a até 30m (3d6 trevas/turno, CD 25).
              </span>
            </div>
            <span className="font-mono text-[11px] text-blue-300 font-bold bg-black/40 px-2 py-1 rounded">
              -4 PM
            </span>
          </button>

          {/* APOCALIPSE MENOR DE FERREN (FASE 2) */}
          {isPhase2 && (
            <button
              onClick={handleApocalipseFerren}
              disabled={apocalipseUsado}
              className="p-3 rounded-xl bg-gradient-to-r from-rose-900 via-purple-900 to-rose-950 hover:from-rose-800 border-2 border-rose-500 text-left transition-all shadow-lg sm:col-span-2 disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-xs text-white block">🌟 APOCALIPSE MENOR DE FERREN (GOLPE SUPREMO)</strong>
                  <span className="text-[10px] text-rose-200 block mt-0.5">
                    10d10 de Dano Profano Cósmico em toda a arena (raio 15m, Reflexos CD 25 metade)!
                  </span>
                </div>
                <span className="font-mono text-xs text-rose-300 font-bold bg-black/50 px-2.5 py-1 rounded border border-rose-500/50">
                  {apocalipseUsado ? 'Esgotado' : '-10 PM • 1x Combate'}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* FEED DA ÚLTIMA AÇÃO EXECUTADA */}
      {lastActionLog && (
        <div className={`p-3 rounded-xl border text-xs animate-in fade-in zoom-in-95 duration-150 ${
          lastActionLog.tipo === 'ataque'
            ? 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(230,57,70,0.3)]'
            : lastActionLog.tipo === 'magia'
            ? 'bg-purple-950/70 border-purple-500 text-purple-100'
            : lastActionLog.tipo === 'chefe'
            ? 'bg-amber-950/70 border-amber-500 text-amber-100'
            : 'bg-emerald-950/70 border-emerald-500 text-emerald-100'
        }`}>
          <div className="font-bold text-sm mb-1">{lastActionLog.titulo}</div>
          <p className="leading-relaxed">{lastActionLog.detalhes}</p>
        </div>
      )}

      {/* AÇÕES DOS HERÓIS NA ARENA (DESTREZA & MISTICISMO) */}
      <div className="border-t border-white/10 pt-3 space-y-2">
        <span className="font-serif font-bold text-xs uppercase tracking-wider text-emerald-300 block">
          🛡️ Ações Táticas dos Jogadores contra a Rede de Pilonos:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={destruirPilono}
            className="p-3 rounded-xl bg-gradient-to-r from-rose-900/60 to-rose-950/80 hover:from-rose-800/80 hover:to-rose-900 border border-rose-500/50 text-white flex items-center justify-between shadow transition-all"
          >
            <div className="flex items-center gap-2 text-left">
              <Hammer className="w-5 h-5 text-rose-300" />
              <div>
                <strong className="text-xs block">💥 Destruir Próximo Pilono (Atletismo / Dano)</strong>
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
                <strong className="text-xs block">🔮 Inverter Runas do Pilono (Misticismo)</strong>
                <span className="text-[10px] text-emerald-200/80">Causa 10-35 dano em Severian & cria refúgio</span>
              </div>
            </div>
            <span className="font-mono text-xs text-[#48cae4] font-bold">Misticismo</span>
          </button>
        </div>
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
