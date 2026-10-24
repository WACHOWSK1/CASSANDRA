'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { NPCStats, NPCAttack, NPCMagia, NPCHabilidade } from '@/types/adventure';
import { 
  Heart, 
  Zap, 
  Shield, 
  Award, 
  Compass, 
  Dices, 
  Swords, 
  Sparkles, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Eye, 
  Clock, 
  Skull, 
  Plus, 
  Minus, 
  ChevronRight, 
  Crosshair, 
  Crown, 
  Ghost, 
  ShieldAlert, 
  ArrowRight, 
  BookOpen, 
  X 
} from 'lucide-react';
import { 
  rollDie, 
  rollD20Test, 
  parseAndRollDamageFormula, 
  rollPercentCheck 
} from '@/lib/diceEngine';

interface CreatureCombatPanelProps {
  npc: NPCStats;
}

export const CreatureCombatPanel: React.FC<CreatureCombatPanelProps> = ({ npc }) => {
  const { 
    creatureCombatStates, 
    getOrCreateCreatureCombat, 
    modifyCreaturePV, 
    modifyCreaturePM, 
    toggleCreatureCondicao, 
    setCreatureDefesaMod, 
    addCreatureCombatLog, 
    advanceCreatureRound, 
    resetCreatureCombat,
    closeActiveCombat,
    openNPCModal,
    rollDice 
  } = useAdventureStore();

  const combat = creatureCombatStates[npc.id] || getOrCreateCreatureCombat(npc.id);

  const [customValue, setCustomValue] = useState<string>('5');
  const [mirroredCopies, setMirroredCopies] = useState<number>(6); // Rà's Imagem Espelhada
  const [hidraHeads, setHidraHeads] = useState<number>(5); // Hydra Heads
  const [goldDistracted, setGoldDistracted] = useState<boolean>(false); // Papa-Dim Gold Distraction
  const [vampireFed, setVampireFed] = useState<boolean>(false); // Dazan Fed

  // Last action spotlight log (identical to Ferren's arena)
  const [lastActionLog, setLastActionLog] = useState<{
    titulo: string;
    detalhes: string;
    tipo: 'ataque' | 'magia' | 'defesa' | 'cura' | 'alerta' | 'condicao';
  } | null>(null);

  // Condição atualmente selecionada/inspecionada para exibição de regras e efeitos
  const [inspectedCondition, setInspectedCondition] = useState<{
    name: string;
    icon: string;
    desc: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Extrair fórmula de dados de magias (ex: 8d6+8, 6d8+12, 10d10, 4d6+4, 12d6)
  const extractSpellDiceFormula = (sp: NPCMagia): string | null => {
    if (sp.dano && typeof sp.dano === 'string' && sp.dano.trim().length > 0) {
      return sp.dano.trim();
    }
    const match = (sp.desc || '').match(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\b/i);
    return match ? match[1] : null;
  };

  const baseDefesa = parseInt(String(npc.combatStats?.defesa)) || 20;
  const copiesDefBonus = (npc.id === 'ra_assassina' && combat.condicoes.includes('Imagens Espelhadas')) ? mirroredCopies * 2 : 0;
  const fallenDefPenalty = combat.condicoes.includes('Caído') ? -5 : 0;
  const fedDefBonus = vampireFed ? 2 : 0;
  const currentDefesa = baseDefesa + combat.defesaMod + fallenDefPenalty + copiesDefBonus + fedDefBonus;
  
  const baseIniciativa = typeof npc.combatStats?.iniciativa === 'number' 
    ? npc.combatStats.iniciativa 
    : parseInt(String(npc.combatStats?.iniciativa)) || 0;

  const maxPV = combat.maxPV || 50;
  const maxPM = combat.maxPM || 0;
  const pvPercent = Math.max(0, Math.min(100, Math.round((combat.currentPV / maxPV) * 100)));
  const pmPercent = maxPM > 0 ? Math.max(0, Math.min(100, Math.round((combat.currentPM / maxPM) * 100))) : 0;

  // Resetar combate da criatura
  const handleReset = () => {
    resetCreatureCombat(npc.id);
    setMirroredCopies(6);
    setHidraHeads(5);
    setGoldDistracted(false);
    setVampireFed(false);
    setLastActionLog({
      titulo: `🔄 Combate Reiniciado: ${npc.name}`,
      detalhes: `Pontos de Vida e Mana restaurados ao máximo. Modificadores e condições zerados.`,
      tipo: 'alerta'
    });
  };

  // Executar Ataque com Rolagem CSPRNG & Regras T20
  const handleExecuteAttack = (atk: NPCAttack) => {
    let bonus = atk.mod !== undefined ? atk.mod : parseInt(String(atk.teste?.replace(/[^0-9-]/g, ''))) || 0;
    
    // Bônus especial de cabeças da Hidra (+2 por cabeça viva além da 1ª)
    if (npc.id === 'guardia_cofre' && hidraHeads > 1) {
      bonus += (hidraHeads - 1) * 2;
    }

    // Identificar Margem e Multiplicador de Crítico (ex: 19/x2, 18/x3, x3)
    let critMin = 20;
    let critMultiplier = 2;
    if (atk.critico) {
      const minMatch = atk.critico.match(/^(\d+)/);
      if (minMatch) critMin = parseInt(minMatch[1], 10);
      const multMatch = atk.critico.match(/x(\d+)/i);
      if (multMatch) critMultiplier = parseInt(multMatch[1], 10);
    }

    // Rolagem do teste de ataque com gerador CSPRNG sem viés
    const d20Res = rollD20Test({ mod: bonus, critMin });
    const totalAtaque = d20Res.total;
    const isCrit = d20Res.isCrit;
    const isFumble = d20Res.isFumble;

    // Rolar Dano com multiplicador de crítico nos dados
    const damageRoll = parseAndRollDamageFormula(atk.dano, isCrit ? critMultiplier : 1);
    let danoTotal = damageRoll.total;
    let critText = isCrit ? ` 💥 CRÍTICO (x${critMultiplier})!` : isFumble ? ' ☠ ERRO AUTOMÁTICO (1 Natural)!' : '';

    // Bônus especial dos Gêmeos Sihnion & Sillion (+1d10 no crítico)
    if (isCrit && npc.id === 'sihnion_sillion') {
      const extraD10 = rollDie(10);
      danoTotal += extraD10;
      critText += ` (+${extraD10} golpe fraternal dos Gêmeos)`;
    }

    const actionTitle = isCrit 
      ? `💥 CRÍTICO! ${atk.nome} (D20: ${d20Res.naturalRoll})` 
      : isFumble 
      ? `☠ FALHA CRÍTICA! ${atk.nome} (1 Natural)` 
      : `⚔️ ${atk.nome} (D20: ${d20Res.naturalRoll})`;

    const actionDetails = `Ataque: [d20 (${d20Res.naturalRoll}) + ${bonus}] = ${totalAtaque} vs Defesa! Dano: ${danoTotal} (${atk.tipo || 'dano'}) [${damageRoll.breakdown}]${critText}${atk.especial ? ` ★ ${atk.especial}` : ''}`;

    setLastActionLog({
      titulo: actionTitle,
      detalhes: actionDetails,
      tipo: 'ataque'
    });

    addCreatureCombatLog(npc.id, {
      text: `${actionTitle} ➔ ${actionDetails}`,
      type: 'ataque'
    });
  };

  // Executar Magia com Rolagem Automática de Dados (CSPRNG) & Efeitos T20
  const handleCastSpell = (sp: NPCMagia) => {
    const rawCost = typeof sp.custoPM === 'number' ? sp.custoPM : parseInt(String(sp.custoPM)) || 0;
    if (combat.currentPM < rawCost) {
      setLastActionLog({
        titulo: `⚠️ PM Insuficiente para ${sp.nome}!`,
        detalhes: `${npc.name} necessita de ${rawCost} PM. PM atual disponível: ${combat.currentPM}.`,
        tipo: 'alerta'
      });
      return;
    }

    modifyCreaturePM(npc.id, -rawCost);

    let logType: 'magia' | 'cura' = 'magia';
    let extraEffect = '';
    let diceRollSummary = '';
    let rolledTotal: number | null = null;

    const lowerName = sp.nome.toLowerCase();
    const lowerDesc = (sp.desc || '').toLowerCase();
    const isCura = lowerName.includes('cura') || lowerDesc.includes('cura') || lowerDesc.includes('recupera');

    // 1. Efeitos de condições especiais da magia
    if (lowerName.includes('imagem espelhada') || lowerDesc.includes('cópias ilusórias')) {
      if (!combat.condicoes.includes('Imagens Espelhadas')) {
        toggleCreatureCondicao(npc.id, 'Imagens Espelhadas');
      }
      setMirroredCopies(6);
      extraEffect += ' | +12 na Defesa ativado com 6 cópias ilusórias!';
    } else if (lowerName.includes('velocidade') || lowerDesc.includes('+1 ação padrão')) {
      if (!combat.condicoes.includes('Velocidade')) {
        toggleCreatureCondicao(npc.id, 'Velocidade');
      }
      extraEffect += ' | +1 Ação Padrão por rodada ativada!';
    }

    // 2. Extração e rolagem automática de dados com gerador CSPRNG sem viés
    const formula = extractSpellDiceFormula(sp);

    if (formula) {
      const dmgResult = parseAndRollDamageFormula(formula);
      rolledTotal = dmgResult.total;

      // Efeito vampírico / dreno
      if (lowerName.includes('toque vampírico') || (lowerDesc.includes('recupera') && lowerDesc.includes('metade'))) {
        const cura = Math.floor(dmgResult.total / 2);
        modifyCreaturePV(npc.id, cura);
        extraEffect += ` | Drenagem de Vitalidade: ${npc.name} recupera +${cura} PV imediatamente!`;
        logType = 'cura';
      } else if (isCura) {
        modifyCreaturePV(npc.id, dmgResult.total);
        extraEffect += ` | Restauração Vital: +${dmgResult.total} PV curados em ${npc.name}!`;
        logType = 'cura';
      }

      // Identificar salvaguarda e cálculo de redução à metade
      const reducesHalf = lowerDesc.includes('metade');
      const halfDmg = Math.floor(dmgResult.total / 2);
      const saveTypeMatch = sp.desc.match(/(Reflexos|Fortitude|Vontade)\s+CD\s*\d+/i);
      const saveText = saveTypeMatch ? saveTypeMatch[0] : (sp.cd ? `Salvaguarda CD ${sp.cd}` : '');

      const halfNote = reducesHalf 
        ? ` (${halfDmg} de dano se passar em ${saveText || 'teste de resistência'})` 
        : '';

      diceRollSummary = `🎲 Rolagem Automática [${formula}]: ${dmgResult.total} (${dmgResult.breakdown})${halfNote}`;
    }

    const cdTag = sp.cd && !sp.desc.includes(`CD ${sp.cd}`) ? ` [CD ${sp.cd}]` : '';

    const actionTitle = rolledTotal !== null
      ? (logType === 'cura'
          ? `✨ ${sp.nome} (-${rawCost} PM) ➔ +${rolledTotal} PV!`
          : `✨ ${sp.nome} (-${rawCost} PM) ➔ ${rolledTotal} de Dano!`)
      : `✨ Conjurou: ${sp.nome} (-${rawCost} PM)`;

    const actionDetails = diceRollSummary 
      ? `${diceRollSummary} | ${sp.desc}${cdTag}${extraEffect}`
      : `${sp.desc}${cdTag}${extraEffect}`;

    setLastActionLog({
      titulo: actionTitle,
      detalhes: actionDetails,
      tipo: logType
    });

    addCreatureCombatLog(npc.id, {
      text: `${actionTitle} ➔ ${actionDetails}`,
      type: logType
    });
  };

  // Rolar Salvaguarda Rápida com CSPRNG
  const handleRollSave = (tipo: 'Fortitude' | 'Reflexos' | 'Vontade', bns: number) => {
    const res = rollD20Test({ mod: bns });
    setLastActionLog({
      titulo: `🛡️ Salvaguarda de ${tipo} (${npc.name})`,
      detalhes: `Rolagem CSPRNG: [d20 (${res.naturalRoll}) + ${bns}] = ${res.total} no teste de resistência!`,
      tipo: 'defesa'
    });
    addCreatureCombatLog(npc.id, {
      text: `Salvaguarda de ${tipo}: [d20: ${res.naturalRoll} + ${bns}] = ${res.total}`,
      type: 'info'
    });
  };

  // Reações Táticas Personalizadas por Criatura
  const renderTacticalReactions = () => {
    // 1. Enxame de Papa-Dim
    if (npc.id === 'enxame_papadiim') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              const dmg = parseAndRollDamageFormula('6d6+5');
              setLastActionLog({
                titulo: `🪙 Enxame Voraz: Dano Automático (${dmg.total})`,
                detalhes: `O enxame engole os personagens no mesmo espaço causando ${dmg.total} de dano de corte/mordidas automáticas (${dmg.breakdown}) sem necessidade de teste de ataque!`,
                tipo: 'ataque'
              });
            }}
            className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-amber-300">Enxame Voraz</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Dano Auto</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Causa 6d6+5 a qualquer um que termine a rodada dentro de seu espaço.
            </p>
          </button>

          <button
            onClick={() => {
              setGoldDistracted(!goldDistracted);
              setLastActionLog({
                titulo: goldDistracted ? '⚔️ Enxame Retomou a Fúria!' : '🪙 Enxame Distraído com Moedas de Ouro!',
                detalhes: goldDistracted 
                  ? 'As moedas acabaram! O enxame volta a avançar sobre os aventureiros.' 
                  : 'Jogaram 50+ moedas de ouro! O enxame para tudo e consome o tesouro, perdendo o turno inteiro.',
                tipo: 'alerta'
              });
            }}
            className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-[#ffd166]">Oferenda de Ouro</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Gatilho Tático</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              {goldDistracted ? '✓ Atualmente distraído devorando ouro (Turno perdido)' : 'Se jogarem 50 T$, o enxame para e se alimenta.'}
            </p>
          </button>

          <button
            onClick={() => {
              setLastActionLog({
                titulo: `🛡️ Imunidades do Enxame Ativas`,
                detalhes: `Imune a manobras de combate e efeitos de alvo único. Sofre apenas 50% de dano de armas comuns (corte/perfuração). Dano em área causa +50%!`,
                tipo: 'defesa'
              });
            }}
            className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-cyan-300">Resistências do Enxame</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300">Passiva</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Imune a manobras; 50% de dano contra armas; vulnerável a dano em área (+50%).
            </p>
          </button>
        </div>
      );
    }

    // 2. Guardiã do Cofre (Hidra)
    if (npc.id === 'guardia_cofre') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              const newHeads = Math.max(1, hidraHeads - 1);
              setHidraHeads(newHeads);
              setLastActionLog({
                titulo: `🩸 Cabeça da Hidra Decepada! (${newHeads} restantes)`,
                detalhes: `Uma cabeça foi cortada após 25 de dano de corte! A menos que o ferimento receba fogo ou ácido, duas novas cabeças crescerão no próximo turno!`,
                tipo: 'alerta'
              });
            }}
            className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-rose-300">Decepar Cabeça (-1)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">{hidraHeads} Vivas</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Corte por 25 de dano. Deixa ferimento aberto para cauterização.
            </p>
          </button>

          <button
            onClick={() => {
              const newHeads = Math.min(10, hidraHeads + 2);
              setHidraHeads(newHeads);
              modifyCreaturePV(npc.id, 20);
              setLastActionLog({
                titulo: `🐉 Regeneração Múltipla (+2 Cabeças / +20 PV)`,
                detalhes: `O ferimento borbulha e nascem 2 novas cabeças! Total de cabeças: ${newHeads}. A Hidra recupera +20 PV!`,
                tipo: 'cura'
              });
            }}
            className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-300">Regenerar (+2 Cabeças)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">+20 PV</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Ocorre no início do turno se o ferimento não foi cauterizado por fogo/ácido.
            </p>
          </button>

          <button
            onClick={() => {
              setLastActionLog({
                titulo: `🔥 Ferimento Cauterizado!`,
                detalhes: `O herói aplicou dano de fogo ou ácido na área decepada! As cabeças não se regenerarão neste ferimento.`,
                tipo: 'defesa'
              });
            }}
            className="p-2.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-orange-300">Cauterizar (Fogo/Ácido)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300">Impede Crescimento</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Anula o nascimento de novas cabeças no ferimento marcado.
            </p>
          </button>
        </div>
      );
    }

    // 3. Rà (Assassina Ilusionista)
    if (npc.id === 'ra_assassina') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              if (mirroredCopies > 0) {
                const nextCopies = mirroredCopies - 1;
                setMirroredCopies(nextCopies);
                setLastActionLog({
                  titulo: `🪞 Cópia Ilusória Destruída! (${nextCopies} restantes)`,
                  detalhes: `O golpe do atacante atingiu uma ilusão perfeita! A cópia se desfaz em fumaça prateada. Defesa bônus atual: +${nextCopies * 2}.`,
                  tipo: 'defesa'
                });
              } else {
                setLastActionLog({
                  titulo: `⚠️ Sem Cópias Ilusórias!`,
                  detalhes: `Todas as cópias foram destruídas. Rà está exposta sem o bônus de Imagens Espelhadas.`,
                  tipo: 'alerta'
                });
              }
            }}
            className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-purple-300">Dissipar Cópia (-1)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">{mirroredCopies} Cópias</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Cada ataque que erraria por até +{mirroredCopies * 2} destrói 1 cópia ilusória.
            </p>
          </button>

          <button
            onClick={() => {
              const res = rollD20Test({ mod: 25 });
              setLastActionLog({
                titulo: `🎭 Finta com Distração (Atuação: ${res.total})`,
                detalhes: `Rà gasta 2 PM e faz teste de Atuação [d20 (${res.naturalRoll}) + 25 = ${res.total}] contra o teste de Vontade do alvo. Se vencer, o alvo fica desprevenido (-5 Defesa) contra seu próximo ataque com o Florete Magnífico!`,
                tipo: 'ataque'
              });
              modifyCreaturePM(npc.id, -2);
            }}
            className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-amber-300">Distração Mortal</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">2 PM • Atuação +25</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Finta rápida como ação livre. Deixa a vítima desprevenida.
            </p>
          </button>

          <button
            onClick={() => {
              const res = rollD20Test({ mod: 20 });
              setLastActionLog({
                titulo: `⚡ Esquiva Sobrenatural & Rolamento (${res.total})`,
                detalhes: `Rà reage com reflexos felinos [d20 (${res.naturalRoll}) + 20 = ${res.total}], reduzindo a metade qualquer dano em área ou de armadilha!`,
                tipo: 'defesa'
              });
            }}
            className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-cyan-300">Esquiva Sobrenatural</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300">Reação</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Nunca fica desprevenida e rola Reflexos +20 contra magias em área.
            </p>
          </button>
        </div>
      );
    }

    // 4. Dazan, o Vampiro Falido
    if (npc.id === 'dazan_vampiro') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              setVampireFed(true);
              modifyCreaturePV(npc.id, 25);
              if (combat.condicoes.includes('Fatigado')) {
                toggleCreatureCondicao(npc.id, 'Fatigado');
              }
              setLastActionLog({
                titulo: `🩸 Mordida Concluída: Dazan Sacou Sangue!`,
                detalhes: `Dazan drena sangue vital! Cura +25 PV, anula a condição Fatigado e recebe +2 em Defesa e testes de ataque pelo frenesi sanguíneo!`,
                tipo: 'cura'
              });
            }}
            className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-rose-300">Drenar Sangue (+25 PV)</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Perde Fadiga</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Alvo agarrado sofre dreno de sangue. Dazan recupera vitalidade imediata.
            </p>
          </button>

          <button
            onClick={() => {
              setLastActionLog({
                titulo: `🌫️ Forma de Névoa Etérea`,
                detalhes: `Dazan se transforma em uma névoa sombria flutuante, ganhando voo 9m e imunidade a dano mundano por 1 rodada enquanto tenta fugir pelo teto!`,
                tipo: 'defesa'
              });
            }}
            className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-purple-300">Forma Gasosa</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Ação Padrão</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Torna-se incorpóreo para escapar de cercos e ataques letais.
            </p>
          </button>

          <button
            onClick={() => {
              setLastActionLog({
                titulo: `💀 Pavor da Luz & Fogo`,
                detalhes: `Dazan sofre 20 de dano direto e não pode regenerar se exposto a luz solar real ou chamas intensas.`,
                tipo: 'alerta'
              });
            }}
            className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-amber-300">Fraqueza Vampírica</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Gatilho Tático</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Fogo ou armas radiantes anulam sua cura e causam pavor no vampiro.
            </p>
          </button>
        </div>
      );
    }

    // 5. Irmãs Medusas
    if (npc.id === 'irmas_medusas') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              setLastActionLog({
                titulo: `👁️ Olhar Petrificante das Medusas (Fortitude CD 23)`,
                detalhes: `Qualquer herói que começar seu turno olhando para as irmãs deve fazer teste de Fortitude CD 23. Falha: Fica lento (1ª falha) ou totalmente petrificado em estátua de mármore (2ª falha)! Heróis que lutam de olhos vendados sofrem 50% de chance de erro.`,
                tipo: 'ataque'
              });
            }}
            className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-300">Olhar Petrificante</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">CD 23 Fort</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Aura visual contínua. Transforma aventureiros incautos em pedra.
            </p>
          </button>

          <button
            onClick={() => {
              setLastActionLog({
                titulo: `🐍 Serpentes Venenosas da Cabeça`,
                detalhes: `Após um ataque bem-sucedido, as serpentes cravam as presas no pescoço do herói: Fortitude CD 23 ou sofre 2d12 de dano de veneno por rodada!`,
                tipo: 'alerta'
              });
            }}
            className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-purple-300">Peçonha de Sszzaas</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">Veneno Contínuo</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Aplica veneno de 2d12 por rodada na vítima mordida pelas cobras.
            </p>
          </button>

          <button
            onClick={() => {
              setLastActionLog({
                titulo: `🗣️ Grito em Uníssono (Vontade CD 23)`,
                detalhes: `As irmãs entoam uma súplica sibilante ao Deus da Traição. Todos os heróis em alcance curto devem passar em Vontade CD 23 ou ficam Fascinados e desarmam suas defesas!`,
                tipo: 'magia'
              });
            }}
            className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-cyan-300">Cântico Traiçoeiro</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300">CD 23 Vont</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Fascina e atrai os heróis para o alcance do olhar petrificante.
            </p>
          </button>
        </div>
      );
    }

    // Fallback: Habilidades genéricas cadastradas na ficha
    if (npc.combatStats?.habilidades && npc.combatStats.habilidades.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {npc.combatStats.habilidades.map((hab, idx) => {
            const name = typeof hab === 'string' ? `Poder Tático ${idx + 1}` : hab.nome;
            const desc = (typeof hab === 'string' ? hab : hab.desc) || '';
            const tipoAcao = typeof hab === 'string' ? 'Especial' : hab.tipoAcao;

            return (
              <button
                key={idx}
                onClick={() => {
                  setLastActionLog({
                    titulo: `⚡ ${name} (${tipoAcao})`,
                    detalhes: desc,
                    tipo: 'alerta'
                  });
                  addCreatureCombatLog(npc.id, {
                    text: `Poder Acionado: ${name} ➔ ${desc}`,
                    type: 'info'
                  });
                }}
                className="p-2.5 rounded-xl bg-[#1f1738]/60 hover:bg-[#2b1f4c] border border-purple-500/30 text-left transition-all hover:scale-[1.01] group space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white group-hover:text-[#ffd166]">{name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">{tipoAcao}</span>
                </div>
                <p className="text-[10px] text-gray-300 leading-snug line-clamp-2">
                  {desc}
                </p>
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  // Obter Diretriz do Mestre Personalizada
  const getMasterDirective = () => {
    switch (npc.id) {
      case 'guardas_aslavi':
        return "Guarnição da entrada de Aslavi. Posicione os arqueiros no topo da torre com bônus de elevação (+17, 1d12+5) e use o oficial aparição incorpóreo para drenar Força dos combatentes mundanos. Na 6ª rodada, faça surgir 1d4+1 esqueletos das criptas!";
      case 'sihnion_sillion':
        return "Espadachins gêmeos em perfeita harmonia. Se ambos atacarem o mesmo alvo, o segundo desfere Golpe Duplo e soma +1d10 no dano crítico. Mantenha os irmãos lado a lado para pressionar o flanco com manobras de finta!";
      case 'siora':
        return "Bruxa élfica controladora. Use seus 71 PM para controlar o terreno com magias debilitantes e proteções arcanas. Evite o corpo a corpo direto mantendo servos ou coberturas entre ela e os aventureiros.";
      case 'enxame_papadiim':
        return "Monstro cobiçoso com imunidade a manobras e dano de alvo único comum. Causa 6d6+5 automático a qualquer um em seu espaço. Se os heróis jogarem 50+ moedas de ouro (Tibares), o enxame perde a ação para devorá-las!";
      case 'assassino_putrefato':
        return "Executor furtivo com espada púrpura das trevas (4d8 trevas + sangramento). Foca em alvos desavisados ou isolados, aplicando dano necrótico cumulativo e recuando para as sombras após o golpe.";
      case 'irmas_medusas':
        return "Sacerdotisas de Sszzaas com Olhar Petrificante (Fortitude CD 23). Exija salvaguardas no início do turno de quem olhar diretamente para elas, ou aplique penalidade de 50% de camuflagem para heróis que lutarem de olhos fechados!";
      case 'dazan_vampiro':
        return "Vampiro nobre falido e faminto. Encontra-se sob condição Fatigado pela privação de sangue. Se morder com sucesso, drena PV e recupera forças; caso enfrente fogo ou luz radiante, recua em pânico.";
      case 'guardia_cofre':
        return "Hidra colossal de 5 cabeças guardando os tesouros de Bac Arat. Cada cabeça atacada pode ser decepada com 25 de dano de corte, mas regenera 2 cabeças na rodada seguinte (+20 PV) a menos que receba fogo ou ácido!";
      case 'ra_assassina':
        return "Mestra de ilusão e lâmina de Bac Arat. Inicia com Imagens Espelhadas (+12 Defesa), usa Distração (+25 Atuação) para fintas mortais e desfere Toque Vampírico e Bola de Fogo de 12d6 quando encurralada!";
      default:
        return npc.description || "Utilize os comandos e rolagens abaixo para conduzir um combate tático dinâmico, registrando danos, manobras e condições diretamente na cena.";
    }
  };

  // Condições comuns de combate com regras oficiais de Tormenta20 e descrições detalhadas
  const conditionList = [
    { 
      name: 'Sangrando', 
      icon: '🩸', 
      desc: 'No início de seu turno, a criatura deve fazer um teste de Constituição (CD 15) ou perde 1d6 (ou 2d6) pontos de vida. A condição é removida com sucesso no teste, com primeiros socorros (Cura CD 15) ou qualquer cura mágica.',
      actionLabel: 'Aplicar 2d6 Sangramento',
      onAction: () => {
        const tick = parseAndRollDamageFormula('2d6');
        modifyCreaturePV(npc.id, -tick.total);
        setLastActionLog({
          titulo: `🩸 Sangramento Aplicado: -${tick.total} PV`,
          detalhes: `A ferida aberta sangrou causando ${tick.total} de dano (${tick.breakdown}).`,
          tipo: 'cura'
        });
      }
    },
    { 
      name: 'Atordoado', 
      icon: '💫', 
      desc: 'A criatura fica indefesa: não pode realizar nenhuma ação (nem reações) e sofre –5 na Defesa. Todos os ataques corpo a corpo contra ela recebem +2 no teste de ataque.' 
    },
    { 
      name: 'Fatigado', 
      icon: '😫', 
      desc: 'A criatura sofre –2 em Força e Destreza, não pode correr nem fazer investidas, e seu deslocamento é reduzido em 3m. Se sofrer fadiga novamente, avança para a condição Exausto.' 
    },
    { 
      name: 'Abalado', 
      icon: '😨', 
      desc: 'Abalada por medo ou pressão psicológica: sofre –2 em todos os testes de perícia (incluindo testes de ataque e salvaguardas de Fortitude, Reflexos e Vontade).' 
    },
    { 
      name: 'Caído', 
      icon: '🦿', 
      desc: 'No chão: sofre –5 na Defesa contra ataques corpo a corpo (mas recebe +5 na Defesa contra ataques à distância). Deslocamento reduzido a 1,5m rastejando. Levantar-se custa uma ação de movimento.',
      actionLabel: 'Levantar-se (Gasta Movimento)',
      onAction: () => {
        toggleCreatureCondicao(npc.id, 'Caído');
        setLastActionLog({
          titulo: `🦿 ${npc.name} Levantou-se!`,
          detalhes: 'Gastou uma ação de movimento para se reerguer do solo. Penalidade de –5 na Defesa contra corpo a corpo anulada.',
          tipo: 'defesa'
        });
      }
    },
    { 
      name: 'Camuflagem', 
      icon: '🌫️', 
      desc: 'Oculta por sombras, bruma ou folhagem: qualquer ataque direcionado a esta criatura tem 20% de chance de falha automática (ou 50% para camuflagem total). Rolar d% antes de aplicar o dano.',
      actionLabel: 'Testar Camuflagem (20%)',
      onAction: () => {
        const pct = rollPercentCheck(20, 'Camuflagem');
        setLastActionLog({
          titulo: `🌫️ Teste de Camuflagem (${pct.success ? 'Ataque Errou no Vazio!' : 'Acerto Normal'})`,
          detalhes: pct.breakdown,
          tipo: 'defesa'
        });
      }
    },
    { 
      name: 'Velocidade', 
      icon: '⚡', 
      desc: 'Sob efeito de aceleração temporal mágica: recebe +1 ação padrão adicional por rodada, +3m de deslocamento e +2 na Defesa e salvaguardas de Reflexos.' 
    },
    { 
      name: 'Imagens Espelhadas', 
      icon: '🪞', 
      desc: 'Rodeada por cópias ilusórias idênticas: concede +2 de bônus na Defesa para cada cópia ativa (máximo +12 com 6 cópias). Qualquer ataque que errar a criatura por até o valor do bônus destrói 1 cópia.',
      actionLabel: 'Destruir 1 Cópia (-1)',
      onAction: () => {
        if (mirroredCopies > 0) {
          const next = mirroredCopies - 1;
          setMirroredCopies(next);
          setLastActionLog({
            titulo: `🪞 Cópia Ilusória Destruída! (${next} restantes)`,
            detalhes: `O golpe atingiu uma ilusão perfeita! A cópia se desfez. Defesa bônus atual: +${next * 2}.`,
            tipo: 'defesa'
          });
        }
      }
    },
    { 
      name: 'Envenenado', 
      icon: '🐍', 
      desc: 'Toxina ou peçonha na corrente sanguínea: sofre dano contínuo de veneno no início de cada rodada e/ou penalidades severas em atributos até ser curado ou resistir com teste de Fortitude.' 
    },
    { 
      name: 'Distraído (Ouro)', 
      icon: '🪙', 
      desc: 'Condição Especial (Enxame Papa-Dim): O enxame para qualquer ataque e gasta todo o seu turno devorando e derretendo moedas de ouro (50+ T$) atiradas pelos aventureiros.' 
    },
    {
      name: 'Desprevenido',
      icon: '🎯',
      desc: 'Pego de surpresa ou sem apoio: sofre –5 na Defesa e –5 em Reflexos, e não pode realizar reações de esquiva até seu próximo turno.'
    },
    {
      name: 'Imóvel',
      icon: '⛓️',
      desc: 'Preso por grilhões, paralisia ou raízes: não pode se deslocar pelo terreno. Sofre –2 na Defesa e –5 em testes de Reflexos.'
    }
  ];

  // Alternar condição e inspecionar sua descrição detalhada
  const handleToggleCondition = (cond: typeof conditionList[0]) => {
    toggleCreatureCondicao(npc.id, cond.name);
    setInspectedCondition(cond);

    const willBeActive = !combat.condicoes.includes(cond.name);
    setLastActionLog({
      titulo: willBeActive 
        ? `⚡ Condição Ativada: ${cond.icon} ${cond.name}` 
        : `❌ Condição Removida: ${cond.icon} ${cond.name}`,
      detalhes: `Efeito Tormenta20: ${cond.desc}`,
      tipo: 'condicao'
    });
  };

  return (
    <div className="bg-gradient-to-b from-[#140f24] via-[#0d0918] to-[#140f24] border-2 border-[#9d4edd]/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(157,78,221,0.3)] space-y-4 my-4 relative overflow-hidden text-xs">
      
      {/* GLOW DE FUNDO ÉPICO */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* CABEÇALHO DA ARENA CENTRAL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#9d4edd]/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7209b7] via-[#3a0ca3] to-[#480ca8] border border-[#ffd166]/50 flex items-center justify-center text-white shadow-[0_0_15px_rgba(157,78,221,0.5)] flex-shrink-0">
            {(npc.category as string) === 'boss' || npc.category === 'antagonista' ? (
              <Crown className="w-7 h-7 text-[#ffd166]" />
            ) : npc.tipo?.toLowerCase().includes('morto-vivo') ? (
              <Skull className="w-7 h-7 text-rose-300" />
            ) : (
              <Swords className="w-7 h-7 text-[#ffd166]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-black text-lg sm:text-xl text-[#ffd166] drop-shadow">
                Arena de Combate: {npc.name}
              </h3>
              <span className="bg-purple-950/90 border border-purple-500 text-purple-300 px-2 py-0.5 rounded text-xs font-mono font-black">
                ND {npc.nd}
              </span>
              <span className="bg-red-950/90 border border-red-500 text-red-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                {npc.category || 'AMEAÇA'}
              </span>
              <span className="bg-amber-950/70 border border-amber-500/40 text-amber-200 px-2 py-0.5 rounded text-[10px] font-mono">
                Rodada {combat.round}
              </span>
            </div>
            <span className="text-xs text-gray-300 font-medium">
              {npc.role} • {npc.tipo || npc.aventura || 'Tormenta20'} • Recurso Tático do Mestre
            </span>
          </div>
        </div>

        {/* CONTROLES: PRÓXIMA RODADA, RESET, FICHA NARRATIVA & CONCLUIR */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => advanceCreatureRound(npc.id)}
            className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white font-mono font-bold text-xs flex items-center gap-1 transition-all"
            title="Avançar rodada de combate"
          >
            <Clock className="w-3.5 h-3.5 text-[#ffd166]" />
            <span>+1 Rodada</span>
          </button>

          <button
            onClick={() => openNPCModal(npc.id, 'ficha')}
            className="px-2.5 py-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-bold text-xs flex items-center gap-1 transition-colors"
            title="Ver Biografia e Ficha Completa no Modal"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Ficha Lore</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
            title="Restaurar PV e PM máximos e limpar condições"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={closeActiveCombat}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-serif font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(230,57,70,0.4)] transition-all hover:scale-105"
            title="Encerrar ou minimizar a arena de combate"
          >
            <X className="w-3.5 h-3.5" />
            <span>Encerrar / Minimizar</span>
          </button>
        </div>
      </div>

      {/* BANNER NARRATIVO: DIRETRIZ DO MESTRE */}
      <div className="bg-gradient-to-r from-purple-950/80 via-red-950/60 to-purple-950/80 border border-purple-500/40 rounded-xl p-3 text-xs leading-relaxed text-purple-200">
        <div className="flex items-center gap-1.5 font-bold text-[#ffd166] uppercase text-[11px] mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Diretriz do Mestre: Condução Tática & Narrativa ({npc.name})</span>
        </div>
        <p className="text-gray-300 text-xs">
          {getMasterDirective()}
        </p>
      </div>

      {/* PAINEL DINÂMICO DE ESTATÍSTICAS E DEFESAS (5 CARDS EM LINHA IGUAL AO DE FERREN) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
        
        {/* 1. Defesa */}
        <div className="bg-[#181226] border border-purple-500/40 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Defesa Atual</span>
          <strong className="text-xl font-mono text-[#ffd166]">{currentDefesa}</strong>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <button
              onClick={() => setCreatureDefesaMod(npc.id, -2)}
              className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-[9px] font-mono border border-white/5"
              title="-2 Defesa temporário"
            >
              -2
            </button>
            <button
              onClick={() => setCreatureDefesaMod(npc.id, 2)}
              className="px-1.5 py-0.5 rounded bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 hover:text-white text-[9px] font-mono border border-purple-500/30"
              title="+2 Defesa temporário"
            >
              +2
            </button>
          </div>
        </div>

        {/* 2. Redução de Dano */}
        <div className="bg-[#181226] border border-amber-500/40 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Redução de Dano</span>
          <strong className="text-lg font-mono text-amber-300 truncate">
            {npc.combatStats?.rd !== undefined ? `RD ${npc.combatStats.rd}` : 'Nenhuma'}
          </strong>
          <span className="text-[9px] text-gray-400 block mt-0.5 truncate">
            {npc.combatStats?.resistencias?.[0] || 'Resistência T20'}
          </span>
        </div>

        {/* 3. Iniciativa & CD */}
        <div className="bg-[#181226] border border-[#48cae4]/40 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Iniciativa / CD</span>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <strong className="text-xl font-mono text-[#48cae4]">+{baseIniciativa}</strong>
            <button
              onClick={() => {
                const res = rollD20Test({ mod: baseIniciativa });
                rollDice(`Iniciativa: ${npc.name}`, null, baseIniciativa);
                setLastActionLog({
                  titulo: `🎲 Iniciativa de ${npc.name} (${res.total})`,
                  detalhes: `Rolagem CSPRNG: [d20 (${res.naturalRoll}) + ${baseIniciativa}] = ${res.total} no teste de Iniciativa!`,
                  tipo: 'defesa'
                });
              }}
              className="p-1 rounded bg-[#48cae4]/20 hover:bg-[#48cae4] text-[#48cae4] hover:text-white transition-colors"
              title="Rolar teste de Iniciativa d20"
            >
              <Dices className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[9px] text-cyan-300 block mt-0.5">
            {npc.combatStats?.magias?.[0]?.cd ? `CD Magias: ${npc.combatStats.magias[0].cd}` : 'Iniciativa Ativa'}
          </span>
        </div>

        {/* 4. Salvaguardas */}
        <div className="bg-[#181226] border border-[#2ec4b6]/40 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Salvaguardas</span>
          <div className="text-[10px] text-gray-200 font-mono mt-0.5 flex justify-center gap-1 flex-wrap">
            <button 
              onClick={() => handleRollSave('Fortitude', (npc.atributos?.con || 2) * 2 + 5)}
              className="hover:text-emerald-300 hover:underline"
              title="Rolar Fortitude"
            >
              Fort <strong>+{((npc.atributos?.con || 2) * 2 + 5)}</strong>
            </button>
            <span>•</span>
            <button 
              onClick={() => handleRollSave('Reflexos', (npc.atributos?.des || 2) * 2 + 5)}
              className="hover:text-emerald-300 hover:underline"
              title="Rolar Reflexos"
            >
              Ref <strong>+{((npc.atributos?.des || 2) * 2 + 5)}</strong>
            </button>
            <span>•</span>
            <button 
              onClick={() => handleRollSave('Vontade', (npc.atributos?.sab || 2) * 2 + 5)}
              className="hover:text-emerald-300 hover:underline"
              title="Rolar Vontade"
            >
              Von <strong>+{((npc.atributos?.sab || 2) * 2 + 5)}</strong>
            </button>
          </div>
          <span className="text-[9px] text-emerald-400 block mt-0.5">Clique para rolar</span>
        </div>

        {/* 5. Recurso / Status Ativo */}
        <div className="bg-[#181226] border border-rose-500/40 rounded-xl p-2.5 flex flex-col justify-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Recurso / Estado</span>
          <strong className="text-xs font-mono text-rose-300 truncate block mt-0.5">
            {npc.id === 'guardia_cofre' ? `${hidraHeads} Cabeças Vivas` :
             npc.id === 'ra_assassina' ? `${mirroredCopies} Cópias Ilusórias` :
             npc.id === 'enxame_papadiim' ? (goldDistracted ? '🪙 Devorando Ouro' : 'Fúria do Enxame') :
             npc.id === 'dazan_vampiro' ? (vampireFed ? '🩸 Sangue Sacioso' : '😫 Fatigado') :
             combat.condicoes.length > 0 ? `${combat.condicoes.length} Condição(ões)` : 'Normal (Pronto)'}
          </strong>
          <span className="text-[9px] text-gray-400 block truncate">
            {combat.condicoes.join(', ') || 'Nenhum efeito adverso'}
          </span>
        </div>
      </div>

      {/* TRACKERS DE PV E PM DINÂMICOS (ESTILO IDÊNTICO AO DE FERREN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#181424] border border-white/5 p-3 rounded-xl">
        
        {/* PV METER */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[#ff758f] font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Pontos de Vida de {npc.name}:</span>
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {combat.currentPV} / {maxPV}
              {combat.tempPV > 0 && <span className="text-amber-300 text-xs font-normal"> (+{combat.tempPV})</span>}
            </span>
          </div>

          <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-400 transition-all duration-300"
              style={{ width: `${pvPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-1 flex-wrap pt-0.5 text-[11px] font-mono">
            <div className="flex items-center gap-1">
              <button onClick={() => modifyCreaturePV(npc.id, -5)} className="px-1.5 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30">-5</button>
              <button onClick={() => modifyCreaturePV(npc.id, -10)} className="px-1.5 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30">-10</button>
              <button onClick={() => modifyCreaturePV(npc.id, -20)} className="px-1.5 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30">-20</button>
              {maxPV > 100 && (
                <button onClick={() => modifyCreaturePV(npc.id, -50)} className="px-1.5 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30">-50</button>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <button onClick={() => modifyCreaturePV(npc.id, 5)} className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30">+5</button>
              <button onClick={() => modifyCreaturePV(npc.id, 10)} className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30">+10</button>
              <button onClick={() => modifyCreaturePV(npc.id, 20)} className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30">+20</button>
            </div>
          </div>

          {/* Input Customizado de Dano / Cura */}
          <div className="flex items-center gap-1 pt-1 border-t border-white/5 text-[10px]">
            <span className="text-gray-400">Modificar:</span>
            <input 
              type="number" 
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="w-12 px-1 py-0.5 bg-[#0a0b10] border border-white/10 rounded font-mono text-center text-xs text-white"
            />
            <button
              onClick={() => {
                const num = parseInt(customValue) || 0;
                modifyCreaturePV(npc.id, -num);
              }}
              className="px-2 py-0.5 rounded bg-rose-900/60 hover:bg-rose-800 text-white font-semibold text-[10px]"
            >
              Aplicar Dano
            </button>
            <button
              onClick={() => {
                const num = parseInt(customValue) || 0;
                modifyCreaturePV(npc.id, num);
              }}
              className="px-2 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-white font-semibold text-[10px]"
            >
              Curar
            </button>
          </div>
        </div>

        {/* PM METER */}
        <div className="space-y-1.5 flex flex-col justify-between">
          {maxPM > 0 ? (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[#48cae4] font-bold">
                  <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                  <span>Pontos de Mana de {npc.name}:</span>
                </span>
                <span className="font-mono font-bold text-white text-sm">
                  {combat.currentPM} / {maxPM}
                </span>
              </div>

              <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 transition-all duration-300"
                  style={{ width: `${pmPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-1 pt-0.5 text-[11px] font-mono flex-wrap">
                <div className="flex items-center gap-1">
                  <button onClick={() => modifyCreaturePM(npc.id, -1)} className="px-1.5 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-cyan-300 border border-blue-500/30">-1</button>
                  <button onClick={() => modifyCreaturePM(npc.id, -2)} className="px-1.5 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-cyan-300 border border-blue-500/30">-2</button>
                  <button onClick={() => modifyCreaturePM(npc.id, -5)} className="px-1.5 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-cyan-300 border border-blue-500/30">-5</button>
                  <button onClick={() => modifyCreaturePM(npc.id, -10)} className="px-1.5 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-cyan-300 border border-blue-500/30">-10</button>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => modifyCreaturePM(npc.id, 5)} className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30">+5</button>
                  <button onClick={() => modifyCreaturePM(npc.id, maxPM)} className="px-1.5 py-0.5 rounded bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-500/30">Total</button>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 italic pt-1 border-t border-white/5">
                Mana usada em conjurações e poderes especiais.
              </div>
            </>
          ) : (
            <div className="bg-[#0c0a14] border border-white/5 p-3 rounded-xl flex flex-col justify-center items-center text-center h-full">
              <Zap className="w-6 h-6 text-gray-500 mb-1" />
              <span className="font-bold text-xs text-gray-300">Sem Reserva de Mana (0 PM)</span>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Esta criatura atua exclusivamente através de força física, instintos ou habilidades passivas sem custo de PM.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REAÇÕES & PODERES TÁTICOS (ESTILO IDÊNTICO AO DE FERREN) */}
      <div className="bg-[#181226]/80 border border-[#9d4edd]/30 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-serif font-bold text-[#ffd166] uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Reações & Poderes Táticos da Criatura:</span>
          </div>
          <span className="text-[10px] text-gray-400 font-sans font-normal lowercase">gatilhos acionados pelo mestre</span>
        </div>

        {renderTacticalReactions()}
      </div>

      {/* ARSENAL OFENSIVO (COM ROLAGENS AUTOMÁTICAS DE DADOS) */}
      {npc.combatStats?.ataques && npc.combatStats.ataques.length > 0 && (
        <div className="bg-[#181226]/80 border border-[#e63946]/30 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-serif font-bold text-[#ff758f] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-[#e63946]" />
              <span>Arsenal Ofensivo (Clique para Executar com Dados):</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans font-normal lowercase">rolagens automáticas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {npc.combatStats.ataques.map((atk, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteAttack(atk)}
                className="p-3 rounded-xl bg-[#201533] hover:bg-[#2c1d47] border border-[#ff758f]/30 hover:border-[#ff758f] text-left transition-all hover:scale-[1.01] group space-y-1 shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white group-hover:text-[#ffd166]">{atk.nome}</span>
                  <span className="text-[10px] font-mono font-bold text-amber-300">
                    {atk.teste} {atk.critico ? `• Crit ${atk.critico}` : ''}
                  </span>
                </div>
                <div className="text-[11px] text-gray-300">
                  Dano: <strong className="text-rose-300 font-mono">{atk.dano}</strong> ({atk.tipo || 'dano'})
                  {atk.alcance && <span className="text-cyan-300 ml-1.5">[{atk.alcance}]</span>}
                </div>
                {atk.especial && (
                  <p className="text-[10px] text-amber-200/90 italic">
                    ★ {atk.especial}
                  </p>
                )}
                <div className="pt-1 flex items-center justify-end text-[10px] font-mono text-[#ffd166] group-hover:translate-x-0.5 transition-transform">
                  <span>Rolar Golpe ➔</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAGIAS & PODERES DE CONJURAÇÃO (ROLAGEM AUTOMÁTICA DE DADOS) */}
      {npc.combatStats?.magias && npc.combatStats.magias.length > 0 && (
        <div className="bg-[#181226]/80 border border-[#2ec4b6]/30 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-serif font-bold text-[#48cae4] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2ec4b6]" />
              <span>Magias Preparadas & Conjurações Arcanas (Clique para Rolar Dados):</span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans font-normal lowercase">rolagem e dedução automáticas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {npc.combatStats.magias.map((sp, idx) => {
              const diceFormula = extractSpellDiceFormula(sp);
              return (
                <button
                  key={idx}
                  onClick={() => handleCastSpell(sp)}
                  className="p-3 rounded-xl bg-[#141f2d] hover:bg-[#1a2b3f] border border-[#2ec4b6]/30 hover:border-[#2ec4b6] text-left transition-all hover:scale-[1.01] group space-y-1.5 shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white group-hover:text-cyan-300">{sp.nome}</span>
                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                      {sp.custoPM} PM {sp.cd ? `• CD ${sp.cd}` : ''}
                    </span>
                  </div>
                  {diceFormula && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                        🎲 {diceFormula}
                      </span>
                      {sp.escola && (
                        <span className="text-[10px] text-purple-300 truncate font-serif">
                          {sp.escola}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-300 leading-snug line-clamp-2">
                    {sp.desc}
                  </p>
                  <div className="pt-1 flex items-center justify-end text-[10px] font-mono text-cyan-300 group-hover:translate-x-0.5 transition-transform">
                    <span>Conjurar com Dados ➔</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CONDIÇÕES E STATUS DE COMBATE T20 */}
      <div className="bg-[#181226]/80 border border-[#ffd166]/20 rounded-xl p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-[#ffd166] uppercase text-xs font-serif">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Condições & Efeitos Ativos (Clique para Alternar e Ver Efeito):</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {combat.condicoes.length} ativa(s)
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {conditionList.map((cond) => {
            const isActive = combat.condicoes.includes(cond.name);
            const isInspected = inspectedCondition?.name === cond.name;
            return (
              <button
                key={cond.name}
                onClick={() => handleToggleCondition(cond)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                  isActive
                    ? 'bg-[#e63946] text-white border-[#ff758f] shadow-[0_0_12px_rgba(230,57,70,0.5)] font-bold'
                    : 'bg-[#0a0b10]/70 text-gray-300 border-white/5 hover:border-purple-500/40 hover:text-white'
                } ${isInspected ? 'ring-2 ring-[#ffd166]' : ''}`}
                title={cond.desc}
              >
                <span>{cond.icon}</span>
                <span>{cond.name}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5 animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* PAINEL DE INSPEÇÃO DA CONDIÇÃO CLICADA (DESCREVE O EFEITO) */}
        {inspectedCondition && (
          <div className="bg-[#100b1e]/90 border border-[#ffd166]/40 rounded-xl p-3 space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl p-1 bg-white/5 rounded-lg border border-white/10">{inspectedCondition.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-sm text-[#ffd166]">{inspectedCondition.name}</h4>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      combat.condicoes.includes(inspectedCondition.name)
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-white/5 text-gray-400 border border-white/10'
                    }`}>
                      {combat.condicoes.includes(inspectedCondition.name) ? '● Ativa na Criatura' : '○ Inativa'}
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-300 font-mono">Regra Oficial Tormenta20</span>
                </div>
              </div>
              <button
                onClick={() => setInspectedCondition(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Fechar descrição"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-200 leading-relaxed bg-[#07050d] p-2.5 rounded-lg border border-purple-500/20">
              {inspectedCondition.desc}
            </p>

            {inspectedCondition.actionLabel && inspectedCondition.onAction && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={inspectedCondition.onAction}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow transition-all hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <span>{inspectedCondition.actionLabel}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Gatilho Rápido para Sangramento se não inspecionado */}
        {combat.condicoes.includes('Sangrando') && inspectedCondition?.name !== 'Sangrando' && (
          <div className="bg-[#e63946]/10 border border-[#e63946]/30 rounded-lg p-2 flex items-center justify-between text-xs text-[#ff758f] mt-1">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#e63946]" />
              <span>Criatura sofrendo Sangramento contínuo!</span>
            </div>
            <button
              onClick={() => {
                const tickDmg = parseAndRollDamageFormula('2d6');
                modifyCreaturePV(npc.id, -tickDmg.total);
                setLastActionLog({
                  titulo: `🩸 Sangramento Aplicado: -${tickDmg.total} PV`,
                  detalhes: `A ferida aberta drenou ${tickDmg.total} PV (${tickDmg.breakdown}).`,
                  tipo: 'cura'
                });
              }}
              className="px-2.5 py-0.5 rounded bg-[#e63946] hover:bg-[#ff4d6d] text-white font-bold text-[10px] transition-colors"
            >
              Aplicar 2d6 Sangramento
            </button>
          </div>
        )}
      </div>

      {/* REGISTRO DINÂMICO DE AÇÃO (LAST ACTION SPOTLIGHT - IDÊNTICO AO DE FERREN) */}
      {lastActionLog && (
        <div className={`p-4 rounded-xl border animate-in fade-in zoom-in-95 duration-200 ${
          lastActionLog.tipo === 'ataque'
            ? 'bg-rose-950/40 border-rose-500/60 text-rose-100'
            : lastActionLog.tipo === 'magia'
            ? 'bg-purple-950/40 border-purple-500/60 text-purple-100'
            : lastActionLog.tipo === 'cura'
            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
            : lastActionLog.tipo === 'defesa'
            ? 'bg-blue-950/40 border-blue-500/60 text-blue-100'
            : 'bg-amber-950/40 border-amber-500/60 text-amber-100'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{lastActionLog.titulo}</span>
          </div>
          <p className="text-xs leading-relaxed opacity-90">{lastActionLog.detalhes}</p>
        </div>
      )}

      {/* BANNER DE CONCLUSÃO DO CONFRONTO / RETIRADA (IDÊNTICO AO DE FERREN) */}
      <div className="bg-gradient-to-r from-[#264653]/90 via-[#2a9d8f]/40 to-[#264653]/90 border border-[#2a9d8f]/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-serif font-bold text-[#ffd166] uppercase flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Conclusão do Combate com {npc.name}</span>
          </span>
          <p className="text-xs text-gray-200">
            Declare a vitória do grupo, rendição ou fuga tática para avançar a narrativa da sessão e recolher os espólios.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              addCreatureCombatLog(npc.id, {
                text: `🏆 Vitória dos Heróis! ${npc.name} foi derrotado(a).`,
                type: 'info'
              });
              closeActiveCombat();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(46,196,182,0.4)] transition-all hover:scale-105"
          >
            <span>🏆 Vitória dos Heróis</span>
          </button>

          <button
            onClick={() => {
              addCreatureCombatLog(npc.id, {
                text: `💨 Fuga Tática! ${npc.name} recuou do confronto.`,
                type: 'info'
              });
              closeActiveCombat();
            }}
            className="px-3 py-1.5 rounded-xl bg-black/50 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-serif font-bold transition-colors"
          >
            <span>Fuga / Recuo</span>
          </button>
        </div>
      </div>

    </div>
  );
};

