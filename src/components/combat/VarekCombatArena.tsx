'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { rollD20Test, parseAndRollDamageFormula } from '@/lib/diceEngine';
import { 
  Zap, 
  ShieldAlert, 
  Heart, 
  Swords, 
  RotateCcw, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Shield, 
  Dices,
  Lock,
  Skull,
  Eye,
  Crosshair,
  Award
} from 'lucide-react';

export const VarekCombatArena: React.FC = () => {
  const { chooseOption, jumpToNode, rollDice } = useAdventureStore();

  // Escala de Combate: 58 PV (Ficha Oficial T20 - Padrão) ou 120 PV (Modo Boss Expandido)
  const [bossScale, setBossScale] = useState<'oficial' | 'boss'>('oficial');
  const maxPV = bossScale === 'boss' ? 120 : 58;
  const maxPM = 58;

  // Limiares de Gatilho Calibrados para o PV Atual (58 PV -> Fuga aos 30 PV / Rendição aos 15 PV)
  const fugaThreshold = bossScale === 'boss' ? 60 : 30;
  const rendicaoThreshold = bossScale === 'boss' ? 30 : 15;

  const [currentPV, setCurrentPV] = useState<number>(58);
  const [currentPM, setCurrentPM] = useState<number>(58);
  const [emboscadaAtiva, setEmboscadaAtiva] = useState<boolean>(true);
  const [concentracaoAtiva, setConcentracaoAtiva] = useState<boolean>(true);
  const [lastActionLog, setLastActionLog] = useState<{
    titulo: string;
    detalhes: string;
    tipo: 'ataque' | 'defesa' | 'magia' | 'alerta';
  } | null>(null);

  // Defesa Atual
  const currentDefesa = 30 + (emboscadaAtiva ? 4 : 0);

  // Handlers de PV
  const handleModifyPV = (delta: number) => {
    setCurrentPV((prev) => {
      const next = Math.max(0, Math.min(maxPV, prev + delta));
      return next;
    });
  };

  const handleModifyPM = (delta: number) => {
    setCurrentPM((prev) => Math.max(0, Math.min(maxPM, prev + delta)));
  };

  const handleReset = () => {
    setCurrentPV(maxPV);
    setCurrentPM(maxPM);
    setEmboscadaAtiva(false);
    setConcentracaoAtiva(true);
    setLastActionLog(null);
  };

  // 1. Combo Toque Chocante + Machado (12 PM + 1 PM se concentração)
  const handleComboToqueChocante = (isAtaqueDuplo = false) => {
    const custoPM = 12 + (concentracaoAtiva && !isAtaqueDuplo ? 1 : 0);
    if (currentPM < 12) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Toque Chocante!",
        detalhes: `Varek possui apenas ${currentPM} PM. São necessários 12 PM para a carga total de 11d8+13.`,
        tipo: "alerta"
      });
      return;
    }

    // Rola ataque com vantagem se concentração estiver ativa
    const atkResult = rollD20Test({ 
      mod: 13, 
      critMin: 20, 
      advantage: concentracaoAtiva 
    });
    const isCrit = atkResult.isCrit;

    // Rola Dano: Machado 2d8+3d6+7 (Crítico x3: 6d8+3d6+21) + Toque Chocante 11d8+13
    const dmgMachado = parseAndRollDamageFormula(
      isCrit ? "6d8+21 corte + 3d6 energia" : "2d8+7 corte + 3d6 energia"
    );
    const dmgChoque = parseAndRollDamageFormula("11d8+13 eletrico");
    const danoTotal = dmgMachado.total + dmgChoque.total;

    handleModifyPM(-custoPM);
    setLastActionLog({
      titulo: isAtaqueDuplo 
        ? `⚡ Segundo Golpe de Ataque Arcano! (Gasto -12 PM)` 
        : `⚡ Golpe Devastador: Machado AM + Toque Chocante! (Gasto -${custoPM} PM)`,
      detalhes: `Ataque: [${atkResult.breakdown}] ${isCrit ? '💥 CRÍTICO NO MACHADO (x3)!' : ''} | Dano Total: ${danoTotal} (Machado: ${dmgMachado.total} [${dmgMachado.breakdown}] + Choque: ${dmgChoque.total} [${dmgChoque.breakdown}]).`,
      tipo: 'ataque'
    });
  };

  // 2. Contramágica Aprimorada (+21 Misticismo)
  const handleContramagica = () => {
    const roll = rollD20Test({ mod: 21 });
    setLastActionLog({
      titulo: `🛡️ Contramágica Aprimorada Ativada! (Reação)`,
      detalhes: `Varek faz teste de Misticismo: [${roll.breakdown}] contra a CD da magia do jogador. Se igualar ou superar a CD, a magia é anulada instantaneamente!`,
      tipo: 'defesa'
    });
  };

  // 3. Aparar Magia & Rebater (Teste de Ataque +13 com Machado)
  const handleApararMagia = () => {
    const roll = rollD20Test({ mod: 13 });
    setLastActionLog({
      titulo: `🪓 Aparar Magia & Rebater no Conjurador! (Reação)`,
      detalhes: `Varek golpeia o feitiço em pleno ar com seu Machado: [${roll.breakdown}] contra a CD da magia. Se superar a CD, Varek sofre ZERO dano e a magia é refletida de volta contra o conjurador original!`,
      tipo: 'defesa'
    });
  };

  // 4. Amarras Etéreas (3 PM)
  const handleAmarrasEtereas = () => {
    if (currentPM < 3) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Amarras Etéreas!",
        detalhes: "São necessários 3 PM para conjurar Amarras Etéreas.",
        tipo: "alerta"
      });
      return;
    }
    handleModifyPM(-3);
    setLastActionLog({
      titulo: `⛓️ Amarras Etéreas Conjuradas! (Gasto -3 PM)`,
      detalhes: `Fios de ectoplasma translúcido prendem o alvo a até 30m. O alvo deve passar em Reflexos CD 19 ou fica Preso e Imobilizado (precisa de Atletismo/Acrobacia CD 19 para soltar-se).`,
      tipo: 'magia'
    });
  };

  // 5. Homem-Bomba: Runa de Proteção (Gatilho aos 0 PV)
  const handleRunaHomemBomba = () => {
    const dmgRuna = parseAndRollDamageFormula("11d8+13 eletrico");
    setLastActionLog({
      titulo: `💥 RUNA DE PROTEÇÃO DETONADA! ("HOMEM-BOMBA")`,
      detalhes: `Varek cai a 0 PV ou inconsciente e a runa em seu peito descarrega! Todos em raio de 6m sofrem ${dmgRuna.total} (${dmgRuna.breakdown}) de dano elétrico (Reflexos CD 19 reduz à metade).`,
      tipo: 'alerta'
    });
  };

  return (
    <div className="bg-[#100d1a]/95 border-2 border-[#ff758f]/50 rounded-2xl p-4 shadow-[0_0_35px_rgba(255,117,143,0.25)] space-y-4 my-3 text-white">
      
      {/* HEADER DA ARENA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#e63946] via-[#ff758f] to-[#9d4edd] flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                Arena Tática: Varek, o Caçador Arcano
              </h3>
              <span className="bg-rose-950/80 border border-rose-500 text-rose-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                ND 8 • Algoz de Severian
              </span>
            </div>
            <span className="text-[11px] text-gray-300">
              Elfo Cativo das Fadas • 1 Guerreiro / 7 Arcanista Bruxo • Devoto de Azgher
            </span>
          </div>
        </div>

        {/* Toggle Escala Boss / Ficha Oficial & Reset */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-0.5 text-[10px] font-mono">
            <button
              onClick={() => { setBossScale('boss'); setCurrentPV(120); }}
              className={`px-2 py-1 rounded font-bold transition-all ${
                bossScale === 'boss' ? 'bg-[#9d4edd] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Boss (120 PV)
            </button>
            <button
              onClick={() => { setBossScale('oficial'); setCurrentPV(58); }}
              className={`px-2 py-1 rounded font-bold transition-all ${
                bossScale === 'oficial' ? 'bg-[#ff758f] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              Ficha (58 PV)
            </button>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors"
            title="Reiniciar Combate"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PAINEL DE DEFESAS E REDUÇÃO DE DANO (RD MANTIDA CONFORME SOLICITADO!) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        
        {/* DEFESA */}
        <div className="bg-[#181226] border border-[#ff758f]/30 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Defesa (CA)</span>
          <strong className="text-lg font-mono text-[#ffd166]">{currentDefesa}</strong>
          <span className="text-[9px] text-gray-400 block mt-0.5">
            {emboscadaAtiva ? 'Base 30 + 4 (Reflexos Ativos)' : 'Base 30 (Armadura Arcana + Escudo)'}
          </span>
          <button
            onClick={() => setEmboscadaAtiva(!emboscadaAtiva)}
            className={`mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold border transition-all ${
              emboscadaAtiva 
                ? 'bg-purple-950/60 border-purple-500 text-purple-300' 
                : 'bg-black/40 border-white/10 text-gray-400'
            }`}
          >
            {emboscadaAtiva ? '✦ Reflexos Ativos (+4)' : 'Reflexos Desativados'}
          </button>
        </div>

        {/* REDUÇÃO DE DANO (RD FOGO 40 + RD FÍSICA 5) */}
        <div className="bg-[#181226] border border-amber-500/40 rounded-xl p-2.5 flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1 text-[10px] text-amber-300 uppercase font-semibold">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Redução de Dano</span>
          </div>
          <strong className="text-sm font-mono text-[#ffd166] mt-0.5">RD FOGO 40</strong>
          <span className="text-[10px] font-mono text-emerald-300 font-bold block">RD FÍSICA 5</span>
          <span className="text-[9px] text-gray-400 block">Bênção de Azgher & Escudo</span>
        </div>

        {/* RESISTÊNCIA A MAGIA (+9 EM TUDO) */}
        <div className="bg-[#181226] border border-[#48cae4]/30 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Resistência a Magia</span>
          <strong className="text-base font-mono text-[#48cae4]">+9 em Saves</strong>
          <div className="text-[9px] text-gray-300 font-mono mt-0.5 flex justify-center gap-1.5 flex-wrap">
            <span>Fort <strong>+20</strong></span>
            <span>Refl <strong>+22</strong></span>
            <span>Vont <strong>+17</strong></span>
          </div>
          <span className="text-[9px] text-emerald-400 block mt-0.5">Quase impossível falhar</span>
        </div>

        {/* CONCENTRAÇÃO DE COMBATE */}
        <div className="bg-[#181226] border border-emerald-500/30 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Vantagem em Ataques</span>
          <strong className="text-xs font-mono text-emerald-300 block mt-0.5">
            {concentracaoAtiva ? '2 Dados (Melhor)' : 'Normal (1 Dado)'}
          </strong>
          <span className="text-[9px] text-gray-400 block">Concentração de Combate (1 PM)</span>
          <button
            onClick={() => setConcentracaoAtiva(!concentracaoAtiva)}
            className={`mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold border transition-all ${
              concentracaoAtiva 
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' 
                : 'bg-black/40 border-white/10 text-gray-400'
            }`}
          >
            {concentracaoAtiva ? '✓ Vantagem Ativa' : 'Sem Vantagem'}
          </button>
        </div>
      </div>

      {/* TRACKERS DE PV E PM DINÂMICOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#181424] border border-white/5 p-3 rounded-xl">
        
        {/* PV METER */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[#ff758f] font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Pontos de Vida (PV):</span>
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {currentPV} / {maxPV}
            </span>
          </div>
          <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div 
              className={`h-full transition-all duration-300 ${
                currentPV <= 30 
                  ? 'bg-rose-600 animate-pulse' 
                  : currentPV <= 60 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-rose-500 to-emerald-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, (currentPV / maxPV) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <button onClick={() => handleModifyPV(-20)} className="px-2 py-0.5 bg-black/40 hover:bg-rose-900 border border-white/10 rounded">-20</button>
            <button onClick={() => handleModifyPV(-10)} className="px-2 py-0.5 bg-black/40 hover:bg-rose-900 border border-white/10 rounded">-10</button>
            <button onClick={() => handleModifyPV(-5)} className="px-2 py-0.5 bg-black/40 hover:bg-rose-900 border border-white/10 rounded">-5</button>
            <button onClick={() => handleModifyPV(5)} className="px-2 py-0.5 bg-black/40 hover:bg-emerald-900 border border-white/10 rounded">+5</button>
            <button onClick={() => handleModifyPV(10)} className="px-2 py-0.5 bg-black/40 hover:bg-emerald-900 border border-white/10 rounded">+10</button>
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
              className="h-full bg-gradient-to-r from-[#0077b6] to-[#48cae4] transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, (currentPM / maxPM) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <button onClick={() => handleModifyPM(-12)} className="px-2 py-0.5 bg-black/40 hover:bg-cyan-950 border border-cyan-500/30 rounded text-cyan-300">-12 (Toque)</button>
            <button onClick={() => handleModifyPM(-3)} className="px-2 py-0.5 bg-black/40 hover:bg-cyan-950 border border-cyan-500/30 rounded text-cyan-300">-3 (Amarras)</button>
            <button onClick={() => handleModifyPM(-1)} className="px-2 py-0.5 bg-black/40 hover:bg-cyan-950 border border-cyan-500/30 rounded text-cyan-300">-1 (Vantagem)</button>
            <button onClick={() => setCurrentPM(58)} className="px-2 py-0.5 bg-black/40 hover:bg-emerald-900 border border-emerald-500/30 rounded text-emerald-300">Poção (Max)</button>
          </div>
        </div>
      </div>

      {/* GATILHOS TÁTICOS ATIVOS CALIBRADOS (Fuga aos 30 PV, Rendição aos 15 PV, Homem-Bomba aos 0 PV) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className={`p-2 rounded-xl border flex flex-col justify-between transition-all ${
          currentPV <= fugaThreshold && currentPV > rendicaoThreshold 
            ? 'bg-amber-950/70 border-amber-500 text-amber-200 alert-pulse-animation' 
            : 'bg-black/30 border-white/5 text-gray-400'
        }`}>
          <div className="font-bold text-[11px] flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Gatilho {fugaThreshold} PV (Tentativa de Fuga)</span>
          </div>
          <span className="text-[10px] text-gray-300 mt-1">
            Ao atingir {fugaThreshold} PV (metade da vida), Varek tenta abrir o alçapão com Amarras Etéreas para cobrir a retirada.
          </span>
          <button 
            onClick={() => chooseOption('VD_fuga')}
            className="mt-2 py-1 px-2 rounded bg-amber-900/60 hover:bg-amber-800 border border-amber-500/50 text-[10px] font-bold text-white"
          >
            Executar Fuga de Varek ➔
          </button>
        </div>

        <div className={`p-2 rounded-xl border flex flex-col justify-between transition-all ${
          currentPV <= rendicaoThreshold && currentPV > 0 
            ? 'bg-purple-950/70 border-purple-500 text-purple-200 alert-pulse-animation' 
            : 'bg-black/30 border-white/5 text-gray-400'
        }`}>
          <div className="font-bold text-[11px] flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Gatilho {rendicaoThreshold} PV (Rendição / Cercado)</span>
          </div>
          <span className="text-[10px] text-gray-300 mt-1">
            Se cercado aos {rendicaoThreshold} PV (crítico), Varek solta o machado e oferece a Máscara e o Contrato para sobreviver.
          </span>
          <button 
            onClick={() => chooseOption('VD_rendido')}
            className="mt-2 py-1 px-2 rounded bg-purple-900/60 hover:bg-purple-800 border border-purple-500/50 text-[10px] font-bold text-white"
          >
            Aceitar Rendição de Varek ➔
          </button>
        </div>

        <div className={`p-2 rounded-xl border flex flex-col justify-between transition-all ${
          currentPV === 0 
            ? 'bg-rose-950/80 border-rose-500 text-rose-200 alert-pulse-animation' 
            : 'bg-black/30 border-white/5 text-gray-400'
        }`}>
          <div className="font-bold text-[11px] flex items-center gap-1 text-rose-300">
            <Skull className="w-3.5 h-3.5 text-rose-400" />
            <span>Gatilho 0 PV: Homem-Bomba!</span>
          </div>
          <span className="text-[10px] text-rose-200/90 mt-1">
            Runa de Proteção detona Toque Chocante (11d8+13 elétrico em área 6m)!
          </span>
          <div className="flex gap-1 mt-2">
            <button 
              onClick={handleRunaHomemBomba}
              className="flex-1 py-1 px-1.5 rounded bg-rose-900 hover:bg-rose-800 border border-rose-500 text-[10px] font-bold text-white"
            >
              💥 Detonar Runa
            </button>
            <button 
              onClick={() => chooseOption('VD_morto')}
              className="py-1 px-2 rounded bg-black/60 hover:bg-white/10 border border-white/20 text-[10px] font-bold text-white"
            >
              Concluir Morte ➔
            </button>
          </div>
        </div>
      </div>

      {/* AÇÕES DE COMBATE INTERATIVAS DO MESTRE */}
      <div className="space-y-2">
        <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#ffd166] block">
          ⚔️ Ações Táticas Rápidas do Mestre:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          
          {/* BOTÃO 1: COMBO TOQUE CHOCANTE + MACHADO */}
          <button
            onClick={() => handleComboToqueChocante(false)}
            className="p-3 rounded-xl bg-gradient-to-r from-rose-900/60 via-purple-950/80 to-[#181226] hover:from-rose-800/80 hover:to-purple-900 border border-rose-500/50 text-white flex items-center justify-between shadow transition-all group text-left"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
              <div>
                <strong className="text-xs block text-white">⚡ Combo Toque Chocante + Machado</strong>
                <span className="text-[10px] text-rose-200/80 block">
                  Ataque Arcano (Luta +13 c/ vantagem) • Dano: 2d8+3d6+7 + 11d8+13!
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-cyan-300 font-bold bg-black/40 px-2 py-1 rounded border border-cyan-500/30">
              -12 PM
            </span>
          </button>

          {/* BOTÃO 2: SEGUNDO GOLPE DE ATAQUE ARCANO */}
          <button
            onClick={() => handleComboToqueChocante(true)}
            className="p-3 rounded-xl bg-gradient-to-r from-[#9d4edd]/40 to-[#181226] hover:from-[#9d4edd]/60 border border-[#9d4edd]/50 text-white flex items-center justify-between shadow transition-all group text-left"
          >
            <div className="flex items-center gap-2.5">
              <Swords className="w-5 h-5 text-[#c77dff] group-hover:scale-110 transition-transform" />
              <div>
                <strong className="text-xs block text-white">⚡ Segundo Golpe (Ataque Arcano Duplo)</strong>
                <span className="text-[10px] text-purple-200/80 block">
                  Desfere o mesmo combo brutal pela segunda vez na mesma rodada!
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-[#c77dff] font-bold bg-black/40 px-2 py-1 rounded border border-purple-500/30">
              -12 PM
            </span>
          </button>

          {/* BOTÃO 3: CONTRAMÁGICA APRIMORADA */}
          <button
            onClick={handleContramagica}
            className="p-2.5 rounded-xl bg-[#0f1d29] hover:bg-[#152e42] border border-[#2ec4b6]/50 text-white flex items-center justify-between shadow transition-all group text-left"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#48cae4]" />
              <div>
                <strong className="text-xs block text-white">🛡️ Contramágica Aprimorada (Reação)</strong>
                <span className="text-[10px] text-cyan-200/80 block">
                  Rola Misticismo +21 contra a CD da magia para anulá-la
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-[#48cae4] font-bold bg-black/40 px-1.5 py-0.5 rounded">
              +21 Mist
            </span>
          </button>

          {/* BOTÃO 4: APARAR MAGIA & REBATER */}
          <button
            onClick={handleApararMagia}
            className="p-2.5 rounded-xl bg-[#1f161e] hover:bg-[#2b1f29] border border-orange-500/50 text-white flex items-center justify-between shadow transition-all group text-left"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-300" />
              <div>
                <strong className="text-xs block text-white">🪓 Aparar Magia & Rebater (Reação)</strong>
                <span className="text-[10px] text-amber-200/80 block">
                  Rola Ataque +13 vs CD da magia para refleti-la no conjurador!
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-amber-300 font-bold bg-black/40 px-1.5 py-0.5 rounded">
              +13 Luta
            </span>
          </button>

          {/* BOTÃO 5: AMARRAS ETÉREAS */}
          <button
            onClick={handleAmarrasEtereas}
            className="p-2.5 rounded-xl bg-[#141a24] hover:bg-[#1a2332] border border-blue-500/40 text-white flex items-center justify-between shadow transition-all group text-left sm:col-span-2"
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-blue-300" />
              <div>
                <strong className="text-xs block text-white">⛓️ Amarras Etéreas (Controle de Alvo à Distância)</strong>
                <span className="text-[10px] text-blue-200/80 block">
                  Casta a até 30m: alvo deve passar em Reflexos CD 19 ou fica Preso e Imobilizado
                </span>
              </div>
            </div>
            <span className="font-mono text-xs text-blue-300 font-bold bg-black/40 px-2 py-0.5 rounded border border-blue-500/30">
              -3 PM • CD 19
            </span>
          </button>
        </div>
      </div>

      {/* FEEDBACK DA ÚLTIMA AÇÃO ROLADA */}
      {lastActionLog && (
        <div className={`p-3 rounded-xl border text-xs animate-in fade-in zoom-in-95 duration-150 ${
          lastActionLog.tipo === 'ataque'
            ? 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(230,57,70,0.3)]'
            : lastActionLog.tipo === 'defesa'
            ? 'bg-cyan-950/70 border-cyan-500 text-cyan-100'
            : lastActionLog.tipo === 'magia'
            ? 'bg-blue-950/70 border-blue-500 text-blue-100'
            : 'bg-amber-950/70 border-amber-500 text-amber-100'
        }`}>
          <div className="font-bold text-sm mb-1">{lastActionLog.titulo}</div>
          <p className="leading-relaxed">{lastActionLog.detalhes}</p>
        </div>
      )}

    </div>
  );
};
