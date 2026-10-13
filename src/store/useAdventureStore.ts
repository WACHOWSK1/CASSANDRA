import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AdventureNode, 
  AdventureResources, 
  AdventureNPCStatus, 
  AdventureGroupConditions, 
  HistoryStep, 
  ChallengeConfig,
  CreatureCombatState,
  CreatureCombatLogEntry
} from '@/types/adventure';
import { 
  ADVENTURE_NODES, 
  INITIAL_RESOURCES, 
  INITIAL_NPC_STATUS, 
  INITIAL_GROUP_CONDITIONS,
  NPC_DATABASE
} from '@/data/adventureData';

import { 
  GOOD_TRAVEL_EVENTS, 
  BAD_TRAVEL_EVENTS, 
  TravelEvent 
} from '@/data/travelData';
import { rollD20Test, rollDie } from '@/lib/diceEngine';

interface ChallengeState {
  active: boolean;
  successes: number;
  failures: number;
  config: ChallengeConfig | null;
}

interface BossState {
  severianBonusPV: number;
  totalPilonos: number;
  pilonosDestruidos: number;
  pilonoInativoFagulha: boolean;
}

export type PylonStatus = 'ativo' | 'invertido' | 'destruido' | 'tombado';

export interface PylonItem {
  id: number;
  nome: string;
  posicao: string;
  status: PylonStatus;
}

export interface TravelState {
  diasViagem: number;
  horasViagem: number;
  racoesRestantes: number;
  carrocaCondicao: 'integra' | 'avariada' | 'reparada';
  salvoCondutoAtivo: boolean;
  pvTempBonus: number;
  ultimoEvento: TravelEvent | null;
  historicoEventos: TravelEvent[];
}

interface AdventureStoreState {
  currentNodeId: string;
  act: number;
  actView: number;
  alertLevel: number;
  resources: AdventureResources;
  npcStatus: AdventureNPCStatus;
  groupConditions: AdventureGroupConditions;
  bossState: BossState;
  routeChoiceAct2: 'aldren_capela' | 'saida_ponte' | null;
  history: HistoryStep[];
  chronicle: string[];
  currentChallenge: ChallengeState;
  diceRollResult: { total: number; breakdown: string } | null;
  selectedNPCForModal: string | null;
  activeCombatNPCId: string | null;
  npcModalTab: 'combate' | 'ficha' | 'taticas' | 'roleplay';
  creatureCombatStates: Record<string, CreatureCombatState>;
  selectedItemForModal: string | null;
  isExportModalOpen: boolean;
  soundEnabled: boolean;
  audioViewActive: boolean;

  // Novos Estados Operacionais (Alerta, Transferência, Pilonos e Lanternas)
  transferClock: number; // 0, 1, 2, 3
  activeRightTab: 'alertas' | 'antimagia' | 'documentos' | 'dados';
  pylonsList: PylonItem[];
  lanternasState: {
    total: number;
    ativas: number;
    primeiraMagiaDenunciada: boolean;
  };

  // Status de Viagem (Eventos Bons e Ruins)
  travelState: TravelState;

  // Actions
  chooseOption: (optionId: string) => void;
  stepBack: () => void;
  jumpToNode: (nodeId: string) => void;
  adjustAlert: (delta: number) => void;
  setAlertLevel: (level: number) => void;
  setTransferClock: (stage: number) => void;
  advanceTransferClock: (delta: number) => void;
  setPylonStatus: (id: number, status: PylonStatus) => void;
  toggleLanternaActive: (delta: number) => void;
  setLanternaDenunciou: (denunciou: boolean) => void;
  setActiveRightTab: (tab: 'alertas' | 'antimagia' | 'documentos' | 'dados') => void;
  
  // Ações de Viagem
  drawTravelEvent: (type: 'bom' | 'ruim') => TravelEvent;
  applyTravelEventBonus: (event: TravelEvent) => void;
  setTravelDays: (days: number) => void;
  adjustTravelHours: (delta: number) => void;
  adjustRacoes: (delta: number) => void;
  setCarrocaCondicao: (cond: 'integra' | 'avariada' | 'reparada') => void;
  toggleSalvoConduto: () => void;
  setActView: (act: number) => void;
  toggleAudioView: () => void;
  registerChallengeResult: (type: 'success' | 'failure') => void;
  rollDice: (skillName?: string, cd?: number | null, mod?: number) => void;
  destruirPilono: () => void;
  inverterRunas: () => void;
  togglePylonManual: (index: number) => void;
  openNPCModal: (npcId: string, tab?: 'combate' | 'ficha' | 'taticas' | 'roleplay') => void;
  setActiveCombatNPC: (npcId: string | null) => void;
  closeActiveCombat: () => void;
  setNPCModalTab: (tab: 'combate' | 'ficha' | 'taticas' | 'roleplay') => void;
  closeNPCModal: () => void;
  getOrCreateCreatureCombat: (npcId: string) => CreatureCombatState;
  modifyCreaturePV: (npcId: string, delta: number) => void;
  modifyCreaturePM: (npcId: string, delta: number) => void;
  setCreaturePV: (npcId: string, value: number) => void;
  setCreaturePM: (npcId: string, value: number) => void;
  toggleCreatureCondicao: (npcId: string, condicao: string) => void;
  setCreatureDefesaMod: (npcId: string, delta: number) => void;
  addCreatureCombatLog: (npcId: string, log: Omit<CreatureCombatLogEntry, 'id' | 'time'>) => void;
  advanceCreatureRound: (npcId: string) => void;
  resetCreatureCombat: (npcId: string) => void;
  openItemModal: (itemId: string) => void;
  closeItemModal: () => void;
  toggleResourceItem: (key: keyof AdventureResources) => void;
  setExportModalOpen: (open: boolean) => void;
  toggleSound: () => void;
  resetSession: () => void;
  getCurrentNode: () => AdventureNode;
}

export const useAdventureStore = create<AdventureStoreState>()(
  persist(
    (set, get) => ({
      currentNodeId: "S",
      act: 1,
      actView: 1,
      alertLevel: 0,
      resources: { ...INITIAL_RESOURCES },
      npcStatus: { ...INITIAL_NPC_STATUS },
      groupConditions: { ...INITIAL_GROUP_CONDITIONS },
      bossState: {
        severianBonusPV: 0,
        totalPilonos: 4,
        pilonosDestruidos: 0,
        pilonoInativoFagulha: false,
      },
      routeChoiceAct2: null,
      history: [
        {
          nodeId: "S",
          timestamp: "--:--:--",
          choiceLabel: "Início da Sessão em Yuvalin"
        }
      ],
      chronicle: [
        `Aventura iniciada: Partida de Yuvalin rumo a Milothiann.`
      ],
      currentChallenge: {
        active: false,
        successes: 0,
        failures: 0,
        config: null
      },
      diceRollResult: null,
      selectedNPCForModal: null,
      activeCombatNPCId: null,
      npcModalTab: 'combate',
      creatureCombatStates: {},
      selectedItemForModal: null,
      isExportModalOpen: false,
      soundEnabled: true,
      audioViewActive: false,

      // Inicialização dos novos sistemas
      transferClock: 0,
      activeRightTab: 'alertas',
      pylonsList: [
        { id: 1, nome: "Pilono Norte (Chama Celeste)", posicao: "Norte do Altar", status: "ativo" },
        { id: 2, nome: "Pilono Leste (Chama da Essência)", posicao: "Leste do Altar", status: "ativo" },
        { id: 3, nome: "Pilono Sul (Chama Rúnica)", posicao: "Sul do Altar", status: "ativo" },
        { id: 4, nome: "Pilono Oeste (Chama de Sangue)", posicao: "Oeste do Altar", status: "ativo" }
      ],
      lanternasState: {
        total: 2,
        ativas: 2,
        primeiraMagiaDenunciada: false
      },

      // Inicialização do Sistema de Viagem
      travelState: {
        diasViagem: 1,
        horasViagem: 6,
        racoesRestantes: 18,
        carrocaCondicao: 'integra',
        salvoCondutoAtivo: false,
        pvTempBonus: 0,
        ultimoEvento: null,
        historicoEventos: []
      },

      getCurrentNode: () => {
        const id = get().currentNodeId;
        return ADVENTURE_NODES[id] || ADVENTURE_NODES["S"];
      },

      setActView: (act) => set({ actView: act, audioViewActive: false }),
      toggleAudioView: () => set((s) => ({ audioViewActive: !s.audioViewActive })),

      chooseOption: (optionId) => {
        const currentNode = get().getCurrentNode();
        if (!currentNode.options) return;

        const option = currentNode.options.find(o => o.id === optionId);
        if (!option) return;

        const targetNode = ADVENTURE_NODES[option.target];
        if (!targetNode) return;

        const time = new Date().toLocaleTimeString();
        const effects = { ...option.effects, ...targetNode.effects };

        set((state) => {
          let newAlert = state.alertLevel;
          if (typeof effects.alertLevel === 'number') newAlert = effects.alertLevel;
          else if (typeof effects.alertLevelDelta === 'number') newAlert = Math.max(0, newAlert + effects.alertLevelDelta);

          const newResources = { ...state.resources, ...effects.resources };
          const newNPCStatus = { ...state.npcStatus, ...effects.npcStatus };
          const newConditions = { ...state.groupConditions, ...effects.groupConditions };
          const newBoss = { ...state.bossState };

          if (typeof effects.severianBonusPV === 'number') newBoss.severianBonusPV += effects.severianBonusPV;
          if (typeof effects.pilonosDestruidos === 'number') newBoss.pilonosDestruidos += effects.pilonosDestruidos;
          if (effects.pilonoInativoFagulha) newBoss.pilonoInativoFagulha = true;

          const newChronicle = [...state.chronicle];
          if (effects.log) {
            newChronicle.push(`[${time}] ${effects.log}`);
          }

          let newChallenge = { active: false, successes: 0, failures: 0, config: null as ChallengeConfig | null };
          if (targetNode.challengeConfig) {
            newChallenge = {
              active: true,
              successes: (state.routeChoiceAct2 === 'saida_ponte' && targetNode.challengeConfig.title.includes("Travessia")) ? 1 : 0,
              failures: 0,
              config: targetNode.challengeConfig
            };
          }

          return {
            currentNodeId: targetNode.id,
            act: targetNode.act || state.act,
            actView: targetNode.act || state.actView,
            alertLevel: newAlert,
            resources: newResources,
            npcStatus: newNPCStatus,
            groupConditions: newConditions,
            bossState: newBoss,
            routeChoiceAct2: effects.routeChoiceAct2 !== undefined ? effects.routeChoiceAct2 : state.routeChoiceAct2,
            history: [...state.history, { nodeId: targetNode.id, timestamp: time, choiceLabel: option.label }],
            chronicle: newChronicle,
            currentChallenge: newChallenge
          };
        });
      },

      stepBack: () => {
        const { history } = get();
        if (history.length <= 1) return;

        const newHistory = [...history];
        newHistory.pop();
        const prevStep = newHistory[newHistory.length - 1];
        const targetNode = ADVENTURE_NODES[prevStep.nodeId] || ADVENTURE_NODES["S"];

        set((state) => ({
          history: newHistory,
          currentNodeId: targetNode.id,
          act: targetNode.act || state.act,
          actView: targetNode.act || state.actView,
          chronicle: [
            ...state.chronicle,
            `[${new Date().toLocaleTimeString()}] (Desfazer) Retornou para o passo: ${targetNode.title}`
          ],
          currentChallenge: targetNode.challengeConfig
            ? { active: true, successes: 0, failures: 0, config: targetNode.challengeConfig }
            : { active: false, successes: 0, failures: 0, config: null }
        }));
      },

      jumpToNode: (nodeId) => {
        const targetNode = ADVENTURE_NODES[nodeId];
        if (!targetNode) return;

        const time = new Date().toLocaleTimeString();
        set((state) => ({
          currentNodeId: nodeId,
          act: targetNode.act || state.act,
          actView: targetNode.act || state.actView,
          history: [...state.history, { nodeId, timestamp: time, choiceLabel: `Salto manual: ${targetNode.title}` }],
          chronicle: [...state.chronicle, `[${time}] Salto para o nó: ${targetNode.title}`],
          currentChallenge: targetNode.challengeConfig
            ? { active: true, successes: 0, failures: 0, config: targetNode.challengeConfig }
            : { active: false, successes: 0, failures: 0, config: null }
        }));
      },

      adjustAlert: (delta) => {
        set((state) => {
          const newAlert = Math.min(6, Math.max(0, state.alertLevel + delta));
          const time = new Date().toLocaleTimeString();
          const logMsg = delta > 0 
            ? `[${time}] ⚠️ Nível de Alerta aumentou para ${newAlert} (+${delta}).`
            : `[${time}] Nível de Alerta reduzido para ${newAlert}.`;

          let newTransfer = state.transferClock;
          if (newAlert >= 5 && state.alertLevel < 5 && state.transferClock < 3) {
            newTransfer = Math.min(3, state.transferClock + 1);
          }

          return {
            alertLevel: newAlert,
            transferClock: newTransfer,
            chronicle: [...state.chronicle, logMsg]
          };
        });
      },

      setAlertLevel: (level) => {
        const clamped = Math.min(6, Math.max(0, level));
        set((state) => {
          let newTransfer = state.transferClock;
          if (clamped >= 5 && state.alertLevel < 5 && state.transferClock < 3) {
            newTransfer = Math.min(3, state.transferClock + 1);
          }
          return {
            alertLevel: clamped,
            transferClock: newTransfer,
            chronicle: [...state.chronicle, `[${new Date().toLocaleTimeString()}] Nível de Alerta ajustado para ${clamped}.`]
          };
        });
      },

      setTransferClock: (stage) => set({ transferClock: Math.min(3, Math.max(0, stage)) }),
      advanceTransferClock: (delta) => set((s) => ({ transferClock: Math.min(3, Math.max(0, s.transferClock + delta)) })),

      setPylonStatus: (id, status) => {
        set((state) => {
          const updated = state.pylonsList.map(p => p.id === id ? { ...p, status } : p);
          const destroyedOrNeutralized = updated.filter(p => p.status !== 'ativo').length;
          return {
            pylonsList: updated,
            bossState: {
              ...state.bossState,
              pilonosDestruidos: destroyedOrNeutralized
            }
          };
        });
      },

      toggleLanternaActive: (delta) => {
        set((state) => ({
          lanternasState: {
            ...state.lanternasState,
            ativas: Math.min(state.lanternasState.total, Math.max(0, state.lanternasState.ativas + delta))
          }
        }));
      },

      setLanternaDenunciou: (denunciou) => {
        set((state) => ({
          lanternasState: {
            ...state.lanternasState,
            primeiraMagiaDenunciada: denunciou
          }
        }));
      },

      setActiveRightTab: (tab) => set({ activeRightTab: tab }),

      registerChallengeResult: (type) => {
        const { currentChallenge } = get();
        if (!currentChallenge.active || !currentChallenge.config) return;

        const time = new Date().toLocaleTimeString();
        const cfg = currentChallenge.config;

        if (type === 'success') {
          const newSuc = currentChallenge.successes + 1;
          const finished = newSuc >= cfg.targetSuccesses;
          set((s) => ({
            currentChallenge: { ...s.currentChallenge, successes: newSuc },
            chronicle: [...s.chronicle, `[${time}] Sucesso no teste estendido (${newSuc}/${cfg.targetSuccesses}).${finished ? ' 🏆 Desafio Conquistado!' : ''}`]
          }));
          if (finished && cfg.successOutcome) {
            setTimeout(() => get().jumpToNode(cfg.successOutcome!), 500);
          }
        } else {
          const newFail = currentChallenge.failures + 1;
          const failed = newFail >= cfg.maxFailures;
          set((s) => ({
            currentChallenge: { ...s.currentChallenge, failures: newFail },
            chronicle: [...s.chronicle, `[${time}] Falha no teste estendido (${newFail}/${cfg.maxFailures}).${failed ? ' ⚠️ Limite de Falhas atingido!' : ''}`]
          }));
          if (failed && cfg.failureOutcome) {
            setTimeout(() => get().jumpToNode(cfg.failureOutcome!), 500);
          }
        }
      },

      rollDice: (skillName = "", cd = null, mod = 0) => {
        const result = rollD20Test({ mod, cd });
        const { total, breakdown, passedCD } = result;

        if (cd !== null && passedCD !== undefined) {
          if (get().currentChallenge.active) {
            get().registerChallengeResult(passedCD ? 'success' : 'failure');
          }
        }

        const log = `[${new Date().toLocaleTimeString()}] Rolagem CSPRNG: ${skillName ? skillName + ' - ' : ''}${breakdown}`;
        set((state) => ({
          diceRollResult: { total, breakdown: (skillName ? `${skillName}: ` : '') + breakdown },
          chronicle: [...state.chronicle, log]
        }));
      },

      destruirPilono: () => {
        set((state) => {
          const firstActive = state.pylonsList.find(p => p.status === 'ativo');
          if (firstActive) {
            const updated = state.pylonsList.map(p => p.id === firstActive.id ? { ...p, status: 'destruido' as PylonStatus } : p);
            const destroyedCount = updated.filter(p => p.status !== 'ativo').length;
            return {
              pylonsList: updated,
              bossState: { ...state.bossState, pilonosDestruidos: destroyedCount },
              chronicle: [...state.chronicle, `[${new Date().toLocaleTimeString()}] 💥 Pilono Arcano destruído! RD e Regeneração de Severian enfraquecidas.`]
            };
          }
          return state;
        });
      },

      inverterRunas: () => {
        set((state) => {
          const firstActive = state.pylonsList.find(p => p.status === 'ativo');
          // CSPRNG para dano de inversão (10 a 34 de dano)
          const dano = rollDie(25) + 9;
          if (firstActive) {
            const updated = state.pylonsList.map(p => p.id === firstActive.id ? { ...p, status: 'invertido' as PylonStatus } : p);
            const destroyedCount = updated.filter(p => p.status !== 'ativo').length;
            return {
              pylonsList: updated,
              bossState: { ...state.bossState, pilonosDestruidos: destroyedCount },
              chronicle: [...state.chronicle, `[${new Date().toLocaleTimeString()}] 🔮 Runas do ${firstActive.nome} Invertidas com sucesso: O raio rebateu em Severian causando ${dano} de dano! Cria área segura de 3m.`]
            };
          }
          return state;
        });
      },

      togglePylonManual: (index) => {
        set((state) => {
          const pylon = state.pylonsList[index];
          if (!pylon) return state;
          const nextStatus: PylonStatus = pylon.status === 'ativo' ? 'destruido' : 'ativo';
          const updated = state.pylonsList.map((p, i) => i === index ? { ...p, status: nextStatus } : p);
          const destroyedCount = updated.filter(p => p.status !== 'ativo').length;
          return {
            pylonsList: updated,
            bossState: { ...state.bossState, pilonosDestruidos: destroyedCount }
          };
        });
      },

      // Implementação das Ações de Viagem (Eventos Bons e Ruins)
      drawTravelEvent: (type) => {
        const pool = type === 'bom' ? GOOD_TRAVEL_EVENTS : BAD_TRAVEL_EVENTS;
        // Seleção equiprovável com CSPRNG seguro
        const randomIndex = rollDie(pool.length) - 1;
        const event = pool[randomIndex];

        set((state) => {
          const time = new Date().toLocaleTimeString();
          const logMsg = `[${time}] 🎲 Evento de Viagem (${type === 'bom' ? '🌟 BOM' : '💀 RUIM'}): ${event.titulo}`;
          
          return {
            travelState: {
              ...state.travelState,
              ultimoEvento: event,
              historicoEventos: [event, ...state.travelState.historicoEventos.slice(0, 9)]
            },
            chronicle: [...state.chronicle, logMsg]
          };
        });

        return event;
      },

      applyTravelEventBonus: (event) => {
        set((state) => {
          const newTravel = { ...state.travelState };
          const newConditions = { ...state.groupConditions };
          const newResources = { ...state.resources };

          if (event.aplicarEfeito?.tipo === 'cura_total') {
            newConditions.fatigado = false;
            newConditions.fraco = false;
          } else if (event.aplicarEfeito?.tipo === 'salvo_conduto') {
            newTravel.salvoCondutoAtivo = true;
          } else if (event.aplicarEfeito?.tipo === 'condicao_fatigado') {
            newConditions.fatigado = true;
          } else if (event.aplicarEfeito?.tipo === 'condicao_fraco') {
            newConditions.fraco = true;
          } else if (event.aplicarEfeito?.tipo === 'carroca_avariada') {
            newTravel.carrocaCondicao = 'avariada';
          } else if (event.aplicarEfeito?.tipo === 'racoes_perdidas') {
            newTravel.racoesRestantes = Math.max(0, newTravel.racoesRestantes - (typeof event.aplicarEfeito.valor === 'number' ? event.aplicarEfeito.valor : 2));
          } else if (event.aplicarEfeito?.tipo === 'pv_temp') {
            newTravel.pvTempBonus = (newTravel.pvTempBonus || 0) + 10;
          }

          return {
            travelState: newTravel,
            groupConditions: newConditions,
            resources: newResources,
            chronicle: [...state.chronicle, `[${new Date().toLocaleTimeString()}] Efeito aplicado: ${event.titulo}`]
          };
        });
      },

      setTravelDays: (days) => {
        set((s) => ({ travelState: { ...s.travelState, diasViagem: Math.max(0, days) } }));
      },

      adjustTravelHours: (delta) => {
        set((s) => {
          const totalHours = Math.max(0, s.travelState.horasViagem + delta);
          const days = Math.floor(totalHours / 12) + 1;
          return {
            travelState: {
              ...s.travelState,
              horasViagem: totalHours,
              diasViagem: days
            }
          };
        });
      },

      adjustRacoes: (delta) => {
        set((s) => ({
          travelState: {
            ...s.travelState,
            racoesRestantes: Math.max(0, s.travelState.racoesRestantes + delta)
          }
        }));
      },

      setCarrocaCondicao: (cond) => {
        set((s) => ({
          travelState: {
            ...s.travelState,
            carrocaCondicao: cond
          }
        }));
      },

      toggleSalvoConduto: () => {
        set((s) => ({
          travelState: {
            ...s.travelState,
            salvoCondutoAtivo: !s.travelState.salvoCondutoAtivo
          }
        }));
      },

      getOrCreateCreatureCombat: (npcId) => {
        const state = get().creatureCombatStates[npcId];
        if (state) return state;

        const npc = NPC_DATABASE[npcId];
        const rawPV = npc?.combatStats?.pv;
        const maxPV = typeof rawPV === 'number' ? rawPV : parseInt(String(rawPV)) || 50;
        const rawPM = npc?.combatStats?.pm;
        const maxPM = typeof rawPM === 'number' ? rawPM : parseInt(String(rawPM)) || 0;
        const initialCondicoes: string[] = [];
        if (npcId === 'dazan_vampiro') initialCondicoes.push('Fatigado');

        const newState: CreatureCombatState = {
          currentPV: maxPV,
          maxPV,
          currentPM: maxPM,
          maxPM,
          tempPV: 0,
          condicoes: initialCondicoes,
          defesaMod: 0,
          rdMod: 0,
          round: 1,
          combatLog: [
            {
              id: `log-${Date.now()}`,
              time: new Date().toLocaleTimeString(),
              text: `Painel de combate pronto para ${npc?.name || npcId} (ND ${npc?.nd || '?'}).`,
              type: 'info'
            }
          ]
        };

        set((s) => ({
          creatureCombatStates: {
            ...s.creatureCombatStates,
            [npcId]: newState
          }
        }));

        return newState;
      },

      openNPCModal: (npcId, tab = 'combate') => {
        get().getOrCreateCreatureCombat(npcId);
        set({ selectedNPCForModal: npcId, npcModalTab: tab });
      },

      setActiveCombatNPC: (npcId) => {
        if (npcId) {
          get().getOrCreateCreatureCombat(npcId);
        }
        // Fechar qualquer modal e focar no combate central na jornada
        set({ activeCombatNPCId: npcId, selectedNPCForModal: null, audioViewActive: false });
      },

      closeActiveCombat: () => set({ activeCombatNPCId: null }),

      setNPCModalTab: (tab) => set({ npcModalTab: tab }),

      closeNPCModal: () => set({ selectedNPCForModal: null }),

      modifyCreaturePV: (npcId, delta) => {
        const current = get().getOrCreateCreatureCombat(npcId);
        const newPV = Math.max(0, Math.min(current.maxPV + current.tempPV, current.currentPV + delta));
        const deltaStr = delta > 0 ? `+${delta} PV (Cura)` : `${delta} PV (Dano)`;

        set((s) => {
          const c = s.creatureCombatStates[npcId] || current;
          return {
            creatureCombatStates: {
              ...s.creatureCombatStates,
              [npcId]: {
                ...c,
                currentPV: newPV,
                combatLog: [
                  {
                    id: `log-${Date.now()}-${Math.random()}`,
                    time: new Date().toLocaleTimeString(),
                    text: `${deltaStr} ➔ PV Atual: ${newPV}/${c.maxPV}`,
                    type: delta > 0 ? 'cura' : 'dano'
                  },
                  ...c.combatLog.slice(0, 40)
                ]
              }
            }
          };
        });
      },

      modifyCreaturePM: (npcId, delta) => {
        const current = get().getOrCreateCreatureCombat(npcId);
        const newPM = Math.max(0, Math.min(current.maxPM, current.currentPM + delta));
        const deltaStr = delta > 0 ? `+${delta} PM` : `${delta} PM gasto`;

        set((s) => {
          const c = s.creatureCombatStates[npcId] || current;
          return {
            creatureCombatStates: {
              ...s.creatureCombatStates,
              [npcId]: {
                ...c,
                currentPM: newPM,
                combatLog: [
                  {
                    id: `log-${Date.now()}-${Math.random()}`,
                    time: new Date().toLocaleTimeString(),
                    text: `${deltaStr} ➔ PM Atual: ${newPM}/${c.maxPM}`,
                    type: 'info'
                  },
                  ...c.combatLog.slice(0, 40)
                ]
              }
            }
          };
        });
      },

      setCreaturePV: (npcId, value) => {
        const current = get().getOrCreateCreatureCombat(npcId);
        const safeVal = Math.max(0, value);
        set((s) => {
          const c = s.creatureCombatStates[npcId] || current;
          return {
            creatureCombatStates: {
              ...s.creatureCombatStates,
              [npcId]: {
                ...c,
                currentPV: safeVal
              }
            }
          };
        });
      },

      setCreaturePM: (npcId, value) => {
        const current = get().getOrCreateCreatureCombat(npcId);
        const safeVal = Math.max(0, value);
        set((s) => {
          const c = s.creatureCombatStates[npcId] || current;
          return {
            creatureCombatStates: {
              ...s.creatureCombatStates,
              [npcId]: {
                ...c,
                currentPM: safeVal
              }
            }
          };
        });
      },

      toggleCreatureCondicao: (npcId, condicao) => {
        const current = get().getOrCreateCreatureCombat(npcId);
        const exists = current.condicoes.includes(condicao);
        const nextCondicoes = exists 
          ? current.condicoes.filter(c => c !== condicao)
          : [...current.condicoes, condicao];

        set((s) => {
          const c = s.creatureCombatStates[npcId] || current;
          return {
            creatureCombatStates: {
              ...s.creatureCombatStates,
              [npcId]: {
                ...c,
                condicoes: nextCondicoes,
                combatLog: [
                  {
                    id: `log-${Date.now()}-${Math.random()}`,
                    time: new Date().toLocaleTimeString(),
                    text: exists ? `Condição removida: [${condicao}]` : `Condição aplicada: [${condicao}]`,
                    type: 'condicao'
                  },
                  ...c.combatLog.slice(0, 40)
                ]
              }
            }
          };
        });
      },

      setCreatureDefesaMod: (npcId, delta) => {
        const current = get().getOrCreateCreatureCombat(npcId);
        set((s) => {
          const c = s.creatureCombatStates[npcId] || current;
          return {
            creatureCombatStates: {
              ...s.creatureCombatStates,
              [npcId]: {
                ...c,
                defesaMod: c.defesaMod + delta,
                combatLog: [
                  {
                    id: `log-${Date.now()}-${Math.random()}`,
                    time: new Date().toLocaleTimeString(),
                    text: `Modificador de Defesa: ${delta >= 0 ? `+${delta}` : delta} (Total mod: ${c.defesaMod + delta})`,
                    type: 'info'
                  },
                  ...c.combatLog.slice(0, 40)
                ]
              }
            }
          };
        });
      },

      addCreatureCombatLog: (npcId, log) => {
        const current = get().getOrCreateCreatureCombat(npcId);
        set((s) => {
          const c = s.creatureCombatStates[npcId] || current;
          return {
            creatureCombatStates: {
              ...s.creatureCombatStates,
              [npcId]: {
                ...c,
                combatLog: [
                  {
                    id: `log-${Date.now()}-${Math.random()}`,
                    time: new Date().toLocaleTimeString(),
                    text: log.text,
                    type: log.type
                  },
                  ...c.combatLog.slice(0, 40)
                ]
              }
            }
          };
        });
      },

      advanceCreatureRound: (npcId) => {
        const current = get().getOrCreateCreatureCombat(npcId);
        const nextRound = current.round + 1;
        const notes: string[] = [`Início da Rodada ${nextRound}`];

        if (current.condicoes.includes('Sangrando')) {
          notes.push('⚠️ ALERTA: A criatura está Sangrando! Role ou aplique dano contínuo de sangramento.');
        }

        set((s) => {
          const c = s.creatureCombatStates[npcId] || current;
          return {
            creatureCombatStates: {
              ...s.creatureCombatStates,
              [npcId]: {
                ...c,
                round: nextRound,
                combatLog: [
                  {
                    id: `log-${Date.now()}-${Math.random()}`,
                    time: new Date().toLocaleTimeString(),
                    text: notes.join(' | '),
                    type: 'info'
                  },
                  ...c.combatLog.slice(0, 40)
                ]
              }
            }
          };
        });
      },

      resetCreatureCombat: (npcId) => {
        const npc = NPC_DATABASE[npcId];
        const rawPV = npc?.combatStats?.pv;
        const maxPV = typeof rawPV === 'number' ? rawPV : parseInt(String(rawPV)) || 50;
        const rawPM = npc?.combatStats?.pm;
        const maxPM = typeof rawPM === 'number' ? rawPM : parseInt(String(rawPM)) || 0;
        const initialCondicoes: string[] = [];
        if (npcId === 'dazan_vampiro') initialCondicoes.push('Fatigado');

        set((s) => ({
          creatureCombatStates: {
            ...s.creatureCombatStates,
            [npcId]: {
              currentPV: maxPV,
              maxPV,
              currentPM: maxPM,
              maxPM,
              tempPV: 0,
              condicoes: initialCondicoes,
              defesaMod: 0,
              rdMod: 0,
              round: 1,
              combatLog: [
                {
                  id: `log-${Date.now()}`,
                  time: new Date().toLocaleTimeString(),
                  text: `Combate reiniciado. PV (${maxPV}) e PM (${maxPM}) restaurados.`,
                  type: 'info'
                }
              ]
            }
          }
        }));
      },
      openItemModal: (itemId) => set({ selectedItemForModal: itemId }),
      closeItemModal: () => set({ selectedItemForModal: null }),

      toggleResourceItem: (key) => {
        set((state) => {
          const currentVal = state.resources[key];
          let newVal: any;
          if (typeof currentVal === 'boolean') newVal = !currentVal;
          else if (typeof currentVal === 'number') newVal = currentVal > 0 ? 0 : 3;
          else newVal = currentVal ? null : 'sabotada';

          return {
            resources: {
              ...state.resources,
              [key]: newVal
            }
          };
        });
      },

      setExportModalOpen: (open) => set({ isExportModalOpen: open }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      resetSession: () => set({
        currentNodeId: "S",
        act: 1,
        actView: 1,
        alertLevel: 0,
        resources: { ...INITIAL_RESOURCES },
        npcStatus: { ...INITIAL_NPC_STATUS },
        groupConditions: { ...INITIAL_GROUP_CONDITIONS },
        bossState: {
          severianBonusPV: 0,
          totalPilonos: 4,
          pilonosDestruidos: 0,
          pilonoInativoFagulha: false,
        },
        routeChoiceAct2: null,
        history: [{ nodeId: "S", timestamp: new Date().toLocaleTimeString(), choiceLabel: "Início da Sessão em Yuvalin" }],
        chronicle: [`[${new Date().toLocaleTimeString()}] Sessão reiniciada: Partida de Yuvalin rumo a Milothiann.`],
        currentChallenge: { active: false, successes: 0, failures: 0, config: null },
        diceRollResult: null,
        selectedNPCForModal: null,
        selectedItemForModal: null,
        transferClock: 0,
        activeRightTab: 'alertas',
        pylonsList: [
          { id: 1, nome: "Pilono Norte (Chama Celeste)", posicao: "Norte do Altar", status: "ativo" },
          { id: 2, nome: "Pilono Leste (Chama da Essência)", posicao: "Leste do Altar", status: "ativo" },
          { id: 3, nome: "Pilono Sul (Chama Rúnica)", posicao: "Sul do Altar", status: "ativo" },
          { id: 4, nome: "Pilono Oeste (Chama de Sangue)", posicao: "Oeste do Altar", status: "ativo" }
        ],
        lanternasState: {
          total: 2,
          ativas: 2,
          primeiraMagiaDenunciada: false
        },
        travelState: {
          diasViagem: 1,
          horasViagem: 6,
          racoesRestantes: 18,
          carrocaCondicao: 'integra',
          salvoCondutoAtivo: false,
          pvTempBonus: 0,
          ultimoEvento: null,
          historicoEventos: []
        }
      })
    }),
    {
      name: 'cassandra-rpg-gamestate-v2',
    }
  )
);
