'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { 
  Skull, 
  Flame, 
  Zap, 
  Swords, 
  Shield, 
  Heart, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle, 
  Eye, 
  Award, 
  Crosshair, 
  Dices, 
  Lock, 
  Crown,
  Ghost,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ServoInvocado {
  nome: string;
  nd: string;
  pv: number;
  descricao: string;
}

const SERVOS_DISPONIVEIS: ServoInvocado[] = [
  {
    nome: "Necrodraco de Aslothia",
    nd: "ND 17",
    pv: 360,
    descricao: "Um dragão colossal esquelético revivido com chamas gélidas e sopro de trevas."
  },
  {
    nome: "Senhor das Múmias Ancestral",
    nd: "ND 15",
    pv: 280,
    descricao: "Antigo faraó mumificado envolto em faixas amaldiçoadas e podridão mortal."
  },
  {
    nome: "Nobre Vampiro da Corte de Asloth",
    nd: "ND 12",
    pv: 210,
    descricao: "Aristocrata imortal veloz com garras de sangue e névoa etérea."
  },
  {
    nome: "Aparição Maior do Abismo",
    nd: "ND 10",
    pv: 150,
    descricao: "Espectro incorpóreo que congela a alma e drena força vital por onde passa."
  },
  {
    nome: "General Esqueleto Titânico",
    nd: "ND 8",
    pv: 120,
    descricao: "Comandante de ossos reforçados que ergue escudos de energia negativa."
  }
];

export const FerrenCombatArena: React.FC = () => {
  const { jumpToNode } = useAdventureStore();

  const maxPV = 2418;
  const maxPM = 255;

  const [currentPV, setCurrentPV] = useState<number>(2418);
  const [currentPM, setCurrentPM] = useState<number>(255);
  const [servoAtivo, setServoAtivo] = useState<ServoInvocado | null>(null);
  const [magiaAceleradaAtiva, setMagiaAceleradaAtiva] = useState<boolean>(false);
  const [lastActionLog, setLastActionLog] = useState<{
    titulo: string;
    detalhes: string;
    tipo: 'ataque' | 'magia' | 'defesa' | 'invocacao' | 'cura' | 'alerta';
  } | null>(null);

  // Modificadores de PV e PM
  const handleModifyPV = (delta: number) => {
    setCurrentPV(prev => Math.max(0, Math.min(maxPV, prev + delta)));
  };

  const handleModifyPM = (delta: number) => {
    setCurrentPM(prev => Math.max(0, Math.min(maxPM, prev + delta)));
  };

  const handleReset = () => {
    setCurrentPV(maxPV);
    setCurrentPM(maxPM);
    setServoAtivo(null);
    setMagiaAceleradaAtiva(false);
    setLastActionLog(null);
  };

  // 1. Cajado da Destruição (+57 Ataque)
  const handleCajadoDestruicao = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const bonus = 57;
    const totalAtaque = d20 + bonus;
    const isCrit = d20 >= 19;

    // Dano: 2d6+16 impacto + 10d6+10 frio (dobra no crítico)
    let danoImpacto = 0;
    const numDadosImp = isCrit ? 4 : 2;
    for (let i = 0; i < numDadosImp; i++) danoImpacto += Math.floor(Math.random() * 6) + 1;
    danoImpacto += isCrit ? 32 : 16;

    let danoFrio = 0;
    const numDadosFrio = isCrit ? 20 : 10;
    for (let i = 0; i < numDadosFrio; i++) danoFrio += Math.floor(Math.random() * 6) + 1;
    danoFrio += isCrit ? 20 : 10;

    const totalDano = danoImpacto + danoFrio;

    setLastActionLog({
      titulo: isCrit ? `💥 CRÍTICO! Golpe com Cajado da Destruição (D20: ${d20})` : `⚔️ Golpe com Cajado da Destruição (D20: ${d20})`,
      detalhes: `Ataque: [${d20} + 57] = ${totalAtaque} contra a Defesa do herói! Dano: ${totalDano} (${danoImpacto} impacto + ${danoFrio} frio congelante). Especial: O herói atingido DEVE passar em teste de Fortitude CD 55 ou fica totalmente PARALISADO por 1d6 rodadas!`,
      tipo: 'ataque'
    });
  };

  // 2. Toque Gélido (+55 Ataque)
  const handleToqueGelido = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const totalAtaque = d20 + 55;
    const isCrit = d20 === 20;

    let danoFrio = 0;
    const numDados = isCrit ? 20 : 10;
    for (let i = 0; i < numDados; i++) danoFrio += Math.floor(Math.random() * 6) + 1;
    danoFrio += isCrit ? 20 : 10;

    setLastActionLog({
      titulo: `❄️ Toque Gélido de Ferren (D20: ${d20})`,
      detalhes: `Ataque de Toque: [${d20} + 55] = ${totalAtaque}! Causa ${danoFrio} pontos de dano de frio direto. O herói atingido deve fazer Fortitude CD 55 para não ficar paralisado por 1d6 rodadas!`,
      tipo: 'ataque'
    });
  };

  // 3. Toque Vampírico Épico (35 PM)
  const handleToqueVampirico = () => {
    const custo = 35 + (magiaAceleradaAtiva ? 4 : 0);
    if (currentPM < custo) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Toque Vampírico!",
        detalhes: `Ferren necessita de ${custo} PM. PM atual: ${currentPM}.`,
        tipo: 'alerta'
      });
      return;
    }
    handleModifyPM(-custo);

    const d20 = Math.floor(Math.random() * 20) + 1;
    const totalAtaque = d20 + 55;

    // 36d6+51 de trevas
    let danoTrevas = 0;
    for (let i = 0; i < 36; i++) danoTrevas += Math.floor(Math.random() * 6) + 1;
    danoTrevas += 51;

    const curaFerren = Math.floor(danoTrevas / 2);
    handleModifyPV(curaFerren);

    setLastActionLog({
      titulo: `🩸 TOQUE VAMPÍRICO CONSUMADO! (-${custo} PM)`,
      detalhes: `Ataque: [${d20} + 55] = ${totalAtaque}! Ferren encosta sua mão descarnada no peito da vítima, drenando sua vitalidade em pó. Dano: ${danoTrevas} pontos de dano de trevas! Ferren recupera +${curaFerren} PV imediatamente!`,
      tipo: 'cura'
    });
  };

  // 4. Ferver Sangue (35 PM - Sustentada)
  const handleFerverSangue = () => {
    const custo = 35 + (magiaAceleradaAtiva ? 4 : 0);
    if (currentPM < custo) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Ferver Sangue!",
        detalhes: `Ferren necessita de ${custo} PM. PM atual: ${currentPM}.`,
        tipo: 'alerta'
      });
      return;
    }
    handleModifyPM(-custo);

    // 14d8+29 de fogo
    let danoFogo = 0;
    for (let i = 0; i < 14; i++) danoFogo += Math.floor(Math.random() * 8) + 1;
    danoFogo += 29;

    setLastActionLog({
      titulo: `🔥 MAGIA: FERVER SANGUE! (-${custo} PM - Sustentada)`,
      detalhes: `Ferren aponta o dedo e o sangue de todos os alvos em alcance curto começa a ferver nas veias! Cada criatura sofre ${danoFogo} de fogo e fica enjoada (Fortitude CD 57 reduz à metade e evita condição). Se um herói for reduzido a 0 PV por este efeito, seu corpo EXPLODE em chamas causando 6d6+21 de dano de fogo a todos em 3m!`,
      tipo: 'magia'
    });
  };

  // 5. Toque da Morte (25 PM)
  const handleToqueDaMorte = () => {
    const custo = 25 + (magiaAceleradaAtiva ? 4 : 0);
    if (currentPM < custo) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Toque da Morte!",
        detalhes: `Ferren necessita de ${custo} PM. PM atual: ${currentPM}.`,
        tipo: 'alerta'
      });
      return;
    }
    handleModifyPM(-custo);

    // 10d8+35 de trevas
    let danoTrevas = 0;
    for (let i = 0; i < 10; i++) danoTrevas += Math.floor(Math.random() * 8) + 1;
    danoTrevas += 35;

    setLastActionLog({
      titulo: `💀 MAGIA: TOQUE DA MORTE! (-${custo} PM)`,
      detalhes: `O ar apodrece com um pulso de necromancia absoluta. Todas as criaturas em alcance curto sofrem ${danoTrevas} pontos de dano de trevas. Se algum herói tiver menos da metade de seus PV totais, deve fazer Fortitude CD 57: se passar sofre o dano normal; se falhar, SEUS PV SÃO REDUZIDOS A –10 INSTANTANEAMENTE (Morte Iminente)!`,
      tipo: 'magia'
    });
  };

  // 6. Despertar dos Mortos (10 PM)
  const handleDespertarMortos = (servoEscolhido?: ServoInvocado) => {
    const custo = 10 + (magiaAceleradaAtiva ? 4 : 0);
    if (currentPM < custo) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Despertar dos Mortos!",
        detalhes: `Ferren necessita de ${custo} PM. PM atual: ${currentPM}.`,
        tipo: 'alerta'
      });
      return;
    }
    handleModifyPM(-custo);

    const servo = servoEscolhido || SERVOS_DISPONIVEIS[Math.floor(Math.random() * SERVOS_DISPONIVEIS.length)];
    setServoAtivo(servo);

    setLastActionLog({
      titulo: `🧟 DESPERTAR DOS MORTOS! (-${custo} PM)`,
      detalhes: `Ferren crava seu cajado no chão de Milothiann e invoca: ${servo.nome} (${servo.nd}, ${servo.pv} PV)! A criatura obedece cegamente a Ferren e age na mesma iniciativa dele. Além de atacar, Ferren pode usar 'Sacrificar Servo' para anular qualquer dano que venha a sofrer!`,
      tipo: 'invocacao'
    });
  };

  // 7. Sacrificar Servo (Reação)
  const handleSacrificarServo = () => {
    if (!servoAtivo) {
      setLastActionLog({
        titulo: "⚠️ Nenhum Servo Invocado Ativo!",
        detalhes: "Ferren precisa de uma criatura invocada por 'Despertar dos Mortos' para poder sacrificá-la e anular o dano.",
        tipo: 'alerta'
      });
      return;
    }
    const nomeAntigo = servoAtivo.nome;
    setServoAtivo(null);

    setLastActionLog({
      titulo: `🛡️ SACRIFICAR SERVO! (Dano Reduzido a ZERO)`,
      detalhes: `Quando o ataque do herói estava prestes a atingir Ferren, o Arquilich puxa ${nomeAntigo} para a frente do golpe. A criatura é destruída e TODO o dano do ataque é reduzido a ZERO!`,
      tipo: 'defesa'
    });
  };

  // 8. Presença Opressora (Reação contra Atacante)
  const handlePresencaOpressora = () => {
    let danoPsiquico = 0;
    for (let i = 0; i < 12; i++) danoPsiquico += Math.floor(Math.random() * 6) + 1;

    setLastActionLog({
      titulo: `👁️ REAÇÃO: PRESENÇA OPRESSORA! (CD 55)`,
      detalhes: `Qualquer herói que ousa desferir um ataque contra Ferren deve fazer um teste de Vontade CD 55! Se falhar, seu corpo treme em desespero cósmico: o ataque é anulado, a ação é perdida e o herói sofre ${danoPsiquico} pontos de dano psíquico (12d6)! Se passar, não é mais afetado até o fim da cena.`,
      tipo: 'defesa'
    });
  };

  // 9. Contramágica Superior & Dissipar Magia (3 PM)
  const handleContramagicaSuperior = () => {
    const custo = 3;
    if (currentPM < custo) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Contramágica!",
        detalhes: `Ferren necessita de ${custo} PM.`,
        tipo: 'alerta'
      });
      return;
    }
    handleModifyPM(-custo);

    const d1 = Math.floor(Math.random() * 20) + 1;
    const d2 = Math.floor(Math.random() * 20) + 1;
    const bestD20 = Math.max(d1, d2);
    const misticismo = 36;
    const totalContramagica = bestD20 + misticismo;

    setLastActionLog({
      titulo: `✨ CONTRAMÁGICA SUPERIOR! (-3 PM)`,
      detalhes: `Ferren reage com Contramágica Superior rolando 2 dados: [D20: ${d1}, ${d2} -> Maior ${bestD20}] + ${misticismo} = ${totalContramagica}! Qualquer feitiço lançado por conjurador com CD igual ou menor a ${totalContramagica} é DISSIPADO instantaneamente no ar!`,
      tipo: 'defesa'
    });
  };

  // 10. Conhecimento Sequestrado (Reação - 3 PM)
  const handleConhecimentoSequestrado = () => {
    const custo = 3;
    if (currentPM < custo) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Conhecimento Sequestrado!",
        detalhes: `Ferren necessita de ${custo} PM.`,
        tipo: 'alerta'
      });
      return;
    }
    handleModifyPM(-custo);

    setLastActionLog({
      titulo: `🧠 REAÇÃO: CONHECIMENTO SEQUESTRADO! (-3 PM)`,
      detalhes: `Ferren estende a mão espectral em direção ao conjurador do grupo. O herói deve fazer um teste de Vontade CD 55: se falhar, sua mente é violada e ele NÃO PODE MAIS LANÇAR esta magia até o fim da cena, e ela se torna conhecida e utilizável por Ferren!`,
      tipo: 'magia'
    });
  };

  // 11. Dança da Morte (Ação Livre - Início do Turno)
  const handleDancaDaMorte = () => {
    setLastActionLog({
      titulo: `💀 DANÇA DA MORTE! (Ação Livre no Início do Turno)`,
      detalhes: `Ferren refaz todos os testes de resistência de quaisquer condições que o estejam afetando (Fort +31, Ref +27, Von +39). Se passar em qualquer um deles, a condição se encerra imediatamente! Ferren é uma fortaleza viva contra magias de controle.`,
      tipo: 'defesa'
    });
  };

  // 12. Tentáculos de Trevas (10 PM)
  const handleTentaculosTrevas = () => {
    const custo = 10 + (magiaAceleradaAtiva ? 4 : 0);
    if (currentPM < custo) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Tentáculos de Trevas!",
        detalhes: `Ferren necessita de ${custo} PM.`,
        tipo: 'alerta'
      });
      return;
    }
    handleModifyPM(-custo);

    let dano = 0;
    for (let i = 0; i < 8; i++) dano += Math.floor(Math.random() * 6) + 1;
    dano += 8 + 15; // +15 na primeira

    setLastActionLog({
      titulo: `🐙 MAGIA: TENTÁCULOS DE TREVAS! (-${custo} PM)`,
      detalhes: `Tentáculos pretos como piche irrompem em uma esfera de 6m. Ferren faz teste de manobra Agarrar com Misticismo +36 contra cada herói na área. Alvos agarrados são esmagados sofrendo ${dano} de trevas! A área conta como terreno difícil e os tentáculos são imunes a dano.`,
      tipo: 'magia'
    });
  };

  // 13. Legião Mental (15 PM)
  const handleLegiao = () => {
    const custo = 15 + (magiaAceleradaAtiva ? 4 : 0);
    if (currentPM < custo) {
      setLastActionLog({
        titulo: "⚠️ PM Insuficiente para Legião!",
        detalhes: `Ferren necessita de ${custo} PM.`,
        tipo: 'alerta'
      });
      return;
    }
    handleModifyPM(-custo);

    setLastActionLog({
      titulo: `👁️ MAGIA: LEGIÃO PROFANA! (-${custo} PM - Sustentada)`,
      detalhes: `Até 10 alvos em alcance médio devem fazer teste de Vontade CD 57. Quem falhar obedece cegamente aos comandos de Ferren (exceto suicidas). No fim de cada turno, os alvos podem refazer o teste; se passarem, ficam abalados por 1 rodada.`,
      tipo: 'magia'
    });
  };

  // Transição para Fuga Canônica
  const handleRecuarParaFuga = () => {
    jumpToNode('R_TRANSFORMA');
  };

  return (
    <div className="bg-gradient-to-b from-[#140f24] via-[#0d0918] to-[#140f24] border-2 border-[#9d4edd]/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(157,78,221,0.3)] space-y-4 my-4 relative overflow-hidden">
      
      {/* GLOW DE FUNDO ÉPICO */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* CABEÇALHO DO BOSS III */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#9d4edd]/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7209b7] via-[#3a0ca3] to-[#480ca8] border border-[#ffd166]/50 flex items-center justify-center text-white shadow-[0_0_15px_rgba(157,78,221,0.5)] flex-shrink-0">
            <Crown className="w-7 h-7 text-[#ffd166]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-black text-lg sm:text-xl text-[#ffd166] drop-shadow">
                Arena do Cataclismo: Arquilich Ferren Asloth
              </h3>
              <span className="bg-purple-950/90 border border-purple-500 text-purple-300 px-2 py-0.5 rounded text-xs font-mono font-black">
                ND S • BOSS ATO III
              </span>
              <span className="bg-red-950/90 border border-red-500 text-red-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                ESCALA S (IMPOSSÍVEL)
              </span>
            </div>
            <span className="text-xs text-gray-300 font-medium">
              Soberano de Aslothia • Mago de 20º Nível • Recurso Narrativo do Mestre
            </span>
          </div>
        </div>

        {/* CONTROLE DE RESET & RECUAR */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleRecuarParaFuga}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2a9d8f] to-[#264653] hover:from-[#48cae4] hover:to-[#2a9d8f] text-white text-xs font-serif font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(42,157,143,0.4)] transition-all hover:scale-105"
            title="Avançar para a rota de sobrevivência"
          >
            <span>Retirada / Evacuação</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
            title="Reiniciar estatísticas de combate de Ferren"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BANNER NARRATIVO DA ESCALA S */}
      <div className="bg-gradient-to-r from-purple-950/80 via-red-950/60 to-purple-950/80 border border-purple-500/40 rounded-xl p-3 text-xs leading-relaxed text-purple-200">
        <div className="flex items-center gap-1.5 font-bold text-[#ffd166] uppercase text-[11px] mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Diretriz do Mestre: Confronto de Escala S (Vitória Impossível)</span>
        </div>
        <p className="text-gray-300 text-xs">
          Ferren Asloth não possui estatísticas para ser derrotado por heróis mortais nesta campanha (Defesa 66, RD 20, 2.418 PV, Presença Opressora CD 55). Utilize os comandos abaixo como um <strong>recurso narrativo e mecânico vivo</strong>: demonstre a anulação de seus ataques e a catástrofe de suas magias para que os jogadores percebam o abismo e priorizem proteger Cassandra e recuar pela ponte de Milothiann!
        </p>
      </div>

      {/* PAINEL DINÂMICO DE ESTATÍSTICAS E DEFESAS ÉPICAS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
        
        <div className="bg-[#181226] border border-purple-500/40 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Defesa Inviolável</span>
          <strong className="text-xl font-mono text-[#ffd166]">66</strong>
          <span className="text-[9px] text-purple-300 block mt-0.5">Robe do Arquimago + Des 6</span>
        </div>

        <div className="bg-[#181226] border border-amber-500/40 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Redução de Dano</span>
          <strong className="text-lg font-mono text-amber-300">RD 20</strong>
          <span className="text-[9px] text-gray-400 block mt-0.5">20/mágico</span>
        </div>

        <div className="bg-[#181226] border border-[#48cae4]/40 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">CD Geral de Magias</span>
          <strong className="text-xl font-mono text-[#48cae4]">CD 57</strong>
          <span className="text-[9px] text-cyan-300 block mt-0.5">Mago 20º • Int 15</span>
        </div>

        <div className="bg-[#181226] border border-[#2ec4b6]/40 rounded-xl p-2.5 flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Salvaguardas</span>
          <div className="text-[10px] text-gray-200 font-mono mt-0.5 flex justify-center gap-1.5 flex-wrap">
            <span>Fort <strong>+31</strong></span>
            <span>Ref <strong>+27</strong></span>
            <span>Von <strong>+39</strong></span>
          </div>
          <span className="text-[9px] text-emerald-400 block mt-0.5">+5 Resistência a Magia</span>
        </div>

        <div className="bg-[#181226] border border-rose-500/40 rounded-xl p-2.5 flex flex-col justify-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Lacaio Ativo</span>
          <strong className="text-xs font-mono text-rose-300 truncate block mt-0.5">
            {servoAtivo ? servoAtivo.nome : 'Nenhum Invocado'}
          </strong>
          <span className="text-[9px] text-gray-400 block">
            {servoAtivo ? `${servoAtivo.nd} (${servoAtivo.pv} PV)` : 'Use Despertar dos Mortos'}
          </span>
        </div>
      </div>

      {/* TRACKERS DE PV E PM DINÂMICOS DE FERREN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#181424] border border-white/5 p-3 rounded-xl">
        
        {/* PV METER */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[#ff758f] font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>Pontos de Vida de Ferren:</span>
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {currentPV} / {maxPV}
            </span>
          </div>
          <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-400 transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, (currentPV / maxPV) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono">
            <button onClick={() => handleModifyPV(-10)} className="px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30">-10</button>
            <button onClick={() => handleModifyPV(-50)} className="px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30">-50</button>
            <button onClick={() => handleModifyPV(-100)} className="px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30">-100</button>
            <button onClick={() => handleModifyPV(50)} className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30">+50</button>
            <button onClick={() => handleModifyPV(100)} className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30">+100</button>
          </div>
        </div>

        {/* PM METER */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-[#48cae4] font-bold">
              <Zap className="w-3.5 h-3.5 fill-cyan-400" />
              <span>Pontos de Mana de Ferren:</span>
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {currentPM} / {maxPM}
            </span>
          </div>
          <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, (currentPM / maxPM) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono">
            <button onClick={() => handleModifyPM(-5)} className="px-2 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-cyan-300 border border-blue-500/30">-5 PM</button>
            <button onClick={() => handleModifyPM(-10)} className="px-2 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-cyan-300 border border-blue-500/30">-10 PM</button>
            <button onClick={() => handleModifyPM(-35)} className="px-2 py-0.5 rounded bg-blue-950/60 hover:bg-blue-900 text-cyan-300 border border-blue-500/30">-35 PM</button>
            <button onClick={() => handleModifyPM(25)} className="px-2 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30">+25 PM</button>
            <button onClick={() => setCurrentPM(maxPM)} className="px-2 py-0.5 rounded bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-500/30">Total</button>
          </div>
        </div>
      </div>

      {/* SELETOR DE MODIFICADOR: MAGIA ACELERADA (+4 PM) */}
      <div className="bg-[#181226] border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <div>
            <span className="text-xs font-bold text-white block">Magia Acelerada (Ação Livre • +4 PM)</span>
            <span className="text-[10px] text-gray-400">Permite a Ferren lançar uma magia com execução de ação completa ou menor como ação livre</span>
          </div>
        </div>

        <button
          onClick={() => setMagiaAceleradaAtiva(!magiaAceleradaAtiva)}
          className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border transition-all ${
            magiaAceleradaAtiva
              ? 'bg-purple-600 text-white border-[#ffd166] shadow-[0_0_12px_rgba(157,78,221,0.6)]'
              : 'bg-black/40 text-gray-400 border-white/10 hover:text-white'
          }`}
        >
          {magiaAceleradaAtiva ? '✓ Magia Acelerada Ativa (+4 PM)' : 'Magia Padrão (Sem Custo Extra)'}
        </button>
      </div>

      {/* REAÇÕES E DEFESAS ESPECIAIS DO ARQUILICH */}
      <div className="bg-[#181226]/80 border border-[#9d4edd]/30 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-serif font-bold text-[#ffd166] uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Reações & Poderes Defensivos do Arquilich:</span>
          </div>
          <span className="text-[10px] text-gray-400 font-sans font-normal lowercase">reações acionadas pelo mestre</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          
          {/* 1. Presença Opressora */}
          <button
            onClick={handlePresencaOpressora}
            className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-[#ffd166]">Presença Opressora</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">CD 55</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Atacante deve passar em Vontade CD 55 ou perde a ação e sofre 12d6 psíquico!
            </p>
          </button>

          {/* 2. Contramágica Superior */}
          <button
            onClick={handleContramagicaSuperior}
            className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-cyan-300">Contramágica Superior</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300">3 PM • 2d20</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Rola dois d20 + 36 de Misticismo para anular qualquer feitiço em pleno ar!
            </p>
          </button>

          {/* 3. Conhecimento Sequestrado */}
          <button
            onClick={handleConhecimentoSequestrado}
            className="p-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/40 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-indigo-300">Sequestrar Magia</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">3 PM • CD 55</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              Rouba a magia do conjurador. Vítima não pode mais lançá-la até o fim da cena.
            </p>
          </button>

          {/* 4. Sacrificar Servo */}
          <button
            onClick={handleSacrificarServo}
            disabled={!servoAtivo}
            className={`p-2.5 rounded-xl border text-left transition-all space-y-1 ${
              servoAtivo 
                ? 'bg-rose-950/50 hover:bg-rose-900/70 border-rose-500/60 text-white cursor-pointer hover:scale-[1.01]' 
                : 'bg-black/30 border-white/5 text-gray-500 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Sacrificar Servo</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Dano = 0</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-snug">
              {servoAtivo ? `Sacrifica ${servoAtivo.nome} para reduzir todo dano a ZERO!` : 'Exige lacaio de Despertar dos Mortos'}
            </p>
          </button>
        </div>
      </div>

      {/* ARSENAL DE COMBATE E MAGIAS DEVASTADORAS */}
      <div className="bg-[#181226]/80 border border-[#e63946]/30 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs font-serif font-bold text-[#ff758f] uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Swords className="w-4 h-4 text-[#e63946]" />
            <span>Arsenal Ofensivo de Ferren (Clique para Executar com Dados):</span>
          </div>
          <span className="text-[10px] text-gray-400 font-sans font-normal lowercase">rolagens automáticas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          
          {/* Cajado da Destruição */}
          <button
            onClick={handleCajadoDestruicao}
            className="p-3 rounded-xl bg-[#201533] hover:bg-[#2c1d47] border border-[#ff758f]/30 hover:border-[#ff758f] text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-[#ffd166]">Cajado da Destruição</span>
              <span className="text-[10px] font-mono font-bold text-amber-300">+57 • Crítico 19/x2</span>
            </div>
            <div className="text-[11px] text-gray-300">
              Dano: <strong className="text-rose-300 font-mono">2d6+16 impacto + 10d6+10 frio</strong>
            </div>
            <p className="text-[10px] text-amber-200/90 italic">
              ★ Toque Paralisante: Fortitude CD 55 ou paralisia 1d6 rodadas.
            </p>
          </button>

          {/* Toque Gélido */}
          <button
            onClick={handleToqueGelido}
            className="p-3 rounded-xl bg-[#201533] hover:bg-[#2c1d47] border border-cyan-500/30 hover:border-cyan-400 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-cyan-300">Toque Gélido Mortal</span>
              <span className="text-[10px] font-mono font-bold text-cyan-300">+55 no Toque</span>
            </div>
            <div className="text-[11px] text-gray-300">
              Dano: <strong className="text-cyan-300 font-mono">10d6+10 frio</strong>
            </div>
            <p className="text-[10px] text-cyan-200/90 italic">
              ★ Toque Paralisante: Fortitude CD 55 evita paralisia por 1d6 rodadas.
            </p>
          </button>

          {/* Toque Vampírico */}
          <button
            onClick={handleToqueVampirico}
            className="p-3 rounded-xl bg-[#201533] hover:bg-[#2c1d47] border border-red-500/40 hover:border-red-400 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-red-300">Toque Vampírico Épico</span>
              <span className="text-[10px] font-mono font-bold text-red-400">35 PM • Cura 50%</span>
            </div>
            <div className="text-[11px] text-gray-300">
              Dano: <strong className="text-red-300 font-mono">36d6+51 trevas</strong>
            </div>
            <p className="text-[10px] text-red-200/90 italic">
              ★ Drena vida e recupera metade do dano causado em PV para Ferren.
            </p>
          </button>

          {/* Ferver Sangue */}
          <button
            onClick={handleFerverSangue}
            className="p-3 rounded-xl bg-[#201533] hover:bg-[#2c1d47] border border-orange-500/40 hover:border-orange-400 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-orange-300">Ferver Sangue</span>
              <span className="text-[10px] font-mono font-bold text-orange-400">35 PM • CD 57</span>
            </div>
            <div className="text-[11px] text-gray-300">
              Dano: <strong className="text-orange-300 font-mono">14d8+29 fogo em área</strong>
            </div>
            <p className="text-[10px] text-orange-200/90 italic">
              ★ Vítimas ficam enjoadas. Se reduzidas a 0 PV, explodem em 6d6+21!
            </p>
          </button>

          {/* Toque da Morte */}
          <button
            onClick={handleToqueDaMorte}
            className="p-3 rounded-xl bg-[#201533] hover:bg-[#2c1d47] border border-purple-500/40 hover:border-purple-400 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-purple-300">Toque da Morte</span>
              <span className="text-[10px] font-mono font-bold text-purple-400">25 PM • Morte Súbita</span>
            </div>
            <div className="text-[11px] text-gray-300">
              Dano: <strong className="text-purple-300 font-mono">10d8+35 trevas</strong>
            </div>
            <p className="text-[10px] text-purple-200/90 italic">
              ★ Alvo com &lt;50% PV que falhar em Fortitude CD 57 cai para -10 PV!
            </p>
          </button>

          {/* Tentáculos de Trevas */}
          <button
            onClick={handleTentaculosTrevas}
            className="p-3 rounded-xl bg-[#201533] hover:bg-[#2c1d47] border border-indigo-500/40 hover:border-indigo-400 text-left transition-all hover:scale-[1.01] group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-indigo-300">Tentáculos de Trevas</span>
              <span className="text-[10px] font-mono font-bold text-indigo-400">10 PM • Agarrar +36</span>
            </div>
            <div className="text-[11px] text-gray-300">
              Dano: <strong className="text-indigo-300 font-mono">8d6+8 (+15) trevas</strong>
            </div>
            <p className="text-[10px] text-indigo-200/90 italic">
              ★ Esfera de 6m. Terreno difícil, imune a dano, agarra e esmaga.
            </p>
          </button>
        </div>

        {/* LINHA DE MAGIAS DE SUPORTE E CONVOCAÇÃO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          
          {/* Despertar dos Mortos */}
          <div className="p-3 rounded-xl bg-[#140f24] border border-rose-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white flex items-center gap-1">
                <Ghost className="w-3.5 h-3.5 text-rose-400" />
                <span>Despertar dos Mortos</span>
              </span>
              <span className="text-[10px] font-mono text-rose-300">10 PM • Até ND 19</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {SERVOS_DISPONIVEIS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDespertarMortos(s)}
                  className="px-2 py-0.5 rounded bg-black/40 hover:bg-rose-950 border border-white/10 text-[10px] text-gray-300 hover:text-white"
                  title={`${s.nome} (${s.nd}) - ${s.descricao}`}
                >
                  {s.nd}
                </button>
              ))}
            </div>
          </div>

          {/* Legião */}
          <button
            onClick={handleLegiao}
            className="p-3 rounded-xl bg-[#140f24] hover:bg-[#1f1738] border border-cyan-500/30 text-left transition-all group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-cyan-300">Legião (Domínio Mental)</span>
              <span className="text-[10px] font-mono text-cyan-300">15 PM • 10 Alvos</span>
            </div>
            <p className="text-[10px] text-gray-300">
              Vontade CD 57. Até 10 heróis ou NPCs obedecem cegamente às ordens de Ferren.
            </p>
          </button>

          {/* Dança da Morte */}
          <button
            onClick={handleDancaDaMorte}
            className="p-3 rounded-xl bg-[#140f24] hover:bg-[#1f1738] border border-purple-500/30 text-left transition-all group space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-purple-300">Dança da Morte</span>
              <span className="text-[10px] font-mono text-purple-300">Ação Livre</span>
            </div>
            <p className="text-[10px] text-gray-300">
              Refaz todos os testes de salvaguarda (+31/+27/+39) e cancela quaisquer condições!
            </p>
          </button>
        </div>
      </div>

      {/* REGISTRO DINÂMICO DE AÇÃO (LAST ACTION LOG) */}
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

      {/* ROTA DE RETIRADA / EVACUAÇÃO (CANÔNICA) */}
      <div className="bg-gradient-to-r from-[#264653]/90 via-[#2a9d8f]/40 to-[#264653]/90 border border-[#2a9d8f]/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-serif font-bold text-[#ffd166] uppercase flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Conclusão do Confronto: Reconhecer a Escala S & Evacuar</span>
          </span>
          <p className="text-xs text-gray-200">
            Quando os jogadores sentirem o terror das habilidades de Ferren e perceberem que não há vitória frontal, acione a retirada para avançar a fuga épica de Milothiann com Cassandra.
          </p>
        </div>

        <button
          onClick={handleRecuarParaFuga}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#e63946] to-[#9d0208] hover:from-[#ff4d6d] hover:to-[#e63946] text-white font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(230,57,70,0.5)] transition-all hover:scale-105 flex-shrink-0"
        >
          <span>Forçar Retirada Estratégica ➔</span>
        </button>
      </div>
    </div>
  );
};
