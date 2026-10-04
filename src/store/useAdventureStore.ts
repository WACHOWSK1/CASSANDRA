import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AdventureNode, 
  AdventureResources, 
  AdventureNPCStatus, 
  AdventureGroupConditions, 
  HistoryStep, 
  ChallengeConfig 
} from '@/types/adventure';
import { 
  ADVENTURE_NODES, 
  INITIAL_RESOURCES, 
  INITIAL_NPC_STATUS, 
  INITIAL_GROUP_CONDITIONS 
} from '@/data/adventureData';

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
  isExportModalOpen: boolean;
  soundEnabled: boolean;
  audioViewActive: boolean;

  // Actions
  chooseOption: (optionId: string) => void;
  stepBack: () => void;
  jumpToNode: (nodeId: string) => void;
  adjustAlert: (delta: number) => void;
  setActView: (act: number) => void;
  toggleAudioView: () => void;
  registerChallengeResult: (type: 'success' | 'failure') => void;
  rollDice: (skillName?: string, cd?: number | null, mod?: number) => void;
  destruirPilono: () => void;
  inverterRunas: () => void;
  togglePylonManual: (index: number) => void;
  openNPCModal: (npcId: string) => void;
  closeNPCModal: () => void;
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
      isExportModalOpen: false,
      soundEnabled: true,
      audioViewActive: false,

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
          const newAlert = Math.max(0, state.alertLevel + delta);
          const time = new Date().toLocaleTimeString();
          const logMsg = delta > 0 
            ? `[${time}] ⚠️ Nível de Alerta aumentou para ${newAlert} (+${delta}).`
            : `[${time}] Nível de Alerta reduzido para ${newAlert}.`;
          return {
            alertLevel: newAlert,
            chronicle: [...state.chronicle, logMsg]
          };
        });
      },

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
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + mod;
        let breakdown = `d20 (${d20}) + ${mod} = ${total}`;

        if (d20 === 20) breakdown += " ★ CRÍTICO (20 Natural)!";
        else if (d20 === 1) breakdown += " ☠ FALHA CRÍTICA (1 Natural)!";

        if (cd !== null) {
          const passed = total >= cd;
          breakdown += ` | CD ${cd}: ${passed ? 'SUCESSO' : 'FALHA'}`;
          if (get().currentChallenge.active) {
            get().registerChallengeResult(passed ? 'success' : 'failure');
          }
        }

        const log = `[${new Date().toLocaleTimeString()}] Rolagem de Dados: ${skillName ? skillName + ' - ' : ''}${breakdown}`;
        set((state) => ({
          diceRollResult: { total, breakdown: (skillName ? `${skillName}: ` : '') + breakdown },
          chronicle: [...state.chronicle, log]
        }));
      },

      destruirPilono: () => {
        set((state) => {
          const destroyed = state.bossState.pilonosDestruidos;
          if (destroyed < state.bossState.totalPilonos) {
            return {
              bossState: { ...state.bossState, pilonosDestruidos: destroyed + 1 },
              chronicle: [...state.chronicle, `[${new Date().toLocaleTimeString()}] 💥 Pilono Arcano destruído! RD e Regeneração de Severian enfraquecidas.`]
            };
          }
          return state;
        });
      },

      inverterRunas: () => {
        const dano = Math.floor(Math.random() * 25) + 10;
        set((state) => ({
          chronicle: [...state.chronicle, `[${new Date().toLocaleTimeString()}] 🔮 Runas Invertidas com sucesso: O raio rebateu em Severian causando ${dano} de dano!`]
        }));
      },

      togglePylonManual: (index) => {
        set((state) => {
          const destroyed = state.bossState.pilonosDestruidos;
          const next = index <= destroyed ? destroyed - 1 : destroyed + 1;
          return {
            bossState: { ...state.bossState, pilonosDestruidos: next }
          };
        });
      },

      openNPCModal: (npcId) => set({ selectedNPCForModal: npcId }),
      closeNPCModal: () => set({ selectedNPCForModal: null }),
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
      })
    }),
    {
      name: 'cassandra-rpg-gamestate-v2',
    }
  )
);
