export type NodeType = 'start' | 'choice' | 'challenge' | 'outcome' | 'puzzle' | 'combat' | 'combat_arena' | 'boss_fight' | 'end' | 'end_session';

export interface NodeOption {
  id: string;
  target: string;
  label: string;
  badge?: string;
  condition?: string;
  effects?: {
    alertLevel?: number;
    alertLevelDelta?: number;
    resources?: Partial<AdventureResources>;
    npcStatus?: Partial<AdventureNPCStatus>;
    groupConditions?: Partial<AdventureGroupConditions>;
    severianBonusPV?: number;
    pilonosDestruidos?: number;
    pilonoInativoFagulha?: boolean;
    routeChoiceAct2?: 'aldren_capela' | 'saida_ponte' | null;
    log?: string;
  };
}

export interface SkillChallengeItem {
  name: string;
  cd: number;
  desc: string;
}

export interface ChallengeConfig {
  title: string;
  type: string;
  targetSuccesses: number;
  maxFailures: number;
  bonusCondition?: string;
  skills: SkillChallengeItem[];
  successOutcome?: string;
  failureOutcome?: string;
}

export interface AdventureNode {
  id: string;
  act: number;
  title: string;
  type: NodeType;
  summary: string;
  narration?: string;
  gmTips?: string;
  nextDecision?: string;
  challengeConfig?: ChallengeConfig;
  puzzleConfig?: {
    correctSequence: string[];
    wrongPenalty: string;
  };
  combatConfig?: {
    enemy: string;
    pv: number;
    defesa: number;
    thresholds: Array<{ pv: number; event: string }>;
  };
  bossConfig?: {
    name: string;
    basePV: number;
    defesa: number;
    mecanicas: string[];
  };
  effects?: NodeOption['effects'];
  options?: NodeOption[];
}

export interface AdventureResources {
  cartaHelena: boolean;
  livroKhorcova: boolean;
  placaGreywick: boolean;
  saisProtecao: number;
  fagulhaArcana: 'sabotada' | 'sinalizada' | 'guardada' | null;
  mascaraVarek: boolean;
  sineteCrane: 'partido' | 'substituido' | null;
  contratoSeverian: boolean;
  confissaoSeverian: boolean;
  nomeEscolhido: boolean;
  determinacaoFamiliar: boolean;
}

export interface AdventureNPCStatus {
  cael: 'desconhecido' | 'disponivel' | 'incapacitado' | 'ferido';
  toma: 'nao_resolvido' | 'salvo_com_cael' | 'salvo_outro_abrigo' | 'deixado_greywick' | 'estrada_real';
  varek: 'oculto' | 'revelado' | 'rendido' | 'capturado' | 'morto' | 'fugiu';
  aldren: 'preso' | 'guardiao_veterano' | 'ferido' | 'sacrificio_morte' | 'primeiro_retornado' | 'resgatado_com_vida';
  cassandra: 'cativa' | 'resgatada_livre' | 'nome_escolhido';
}

export interface AdventureGroupConditions {
  pmPerdidosTotal: number;
  modificadorViagem: number;
  modificadorSocial: number;
  modificadorKhorcova: number;
  itensLacrados: number;
  carrocaAbandonada: boolean;
  cicatrizPurpura: boolean;
}

export interface HistoryStep {
  nodeId: string;
  timestamp: string;
  choiceLabel: string;
}

export interface NPCStats {
  name: string;
  role: string;
  description: string;
  combatStats: {
    pv?: number | string;
    pm?: number | string;
    defesa?: number | string;
    iniciativa?: number;
    rd?: string | number;
    habilidades?: string[];
  };
}

export interface AudioTrack {
  title: string;
  filename: string;
  src: string;
  size: number;
}

export interface AudioCategory {
  category: string;
  trackCount: number;
  tracks: AudioTrack[];
}
