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
  fatigado?: boolean;
  fraco?: boolean;
}

export interface AdventureOptionEffects {
  resources?: Partial<AdventureResources>;
  npcStatus?: Partial<AdventureNPCStatus>;
  groupConditions?: Partial<AdventureGroupConditions>;
  alertLevel?: number;
  alertLevelDelta?: number;
  severianBonusPV?: number;
  pilonosDestruidos?: number;
  pilonoInativoFagulha?: boolean;
  routeChoiceAct2?: 'aldren_capela' | 'saida_ponte' | null;
  log?: string;
}

export interface AdventureOption {
  id: string;
  target: string;
  label: string;
  badge?: string;
  condition?: string;
  effects?: AdventureOptionEffects;
}

export interface ChallengeSkill {
  name: string;
  cd: number;
  desc: string;
}

export interface ChallengeConfig {
  title: string;
  type: 'extended_test' | 'combat' | 'puzzle';
  targetSuccesses: number;
  maxFailures: number;
  bonusCondition?: string;
  skills: ChallengeSkill[];
  successOutcome?: string;
  failureOutcome?: string;
}

export interface PuzzleConfig {
  correctSequence: string[];
  wrongPenalty: string;
}

export interface CombatConfig {
  enemy?: string;
  pv?: number | string;
  defesa?: number | string;
  iniciativa?: number | string;
  rd?: number | string;
  ataques?: any[];
  [key: string]: any;
}

export interface AdventureNode {
  id: string;
  act: number;
  title: string;
  type: 'start' | 'outcome' | 'challenge' | 'choice' | 'puzzle' | 'climax' | 'combat' | string;
  summary?: string;
  narration?: string;
  gmTips?: string;
  nextDecision?: string;
  challengeConfig?: ChallengeConfig;
  puzzleConfig?: PuzzleConfig;
  combatConfig?: CombatConfig;
  effects?: AdventureOptionEffects;
  options?: AdventureOption[];
  condition?: string;
  [key: string]: any;
}

export interface NPCAttack {
  nome: string;
  teste?: string;
  mod?: number;
  dano: string;
  tipo?: string;
  alcance?: string;
  critico?: string;
  especial?: string;
  bonus?: string;
  extra?: string;
  [key: string]: any;
}

export interface NPCHabilidade {
  nome?: string;
  tipo?: string;
  tipoAcao?: string;
  custo?: string;
  custoPM?: string | number;
  descricao?: string;
  desc?: string;
  [key: string]: any;
}

export interface NPCMagia {
  nome: string;
  custoPM?: string | number;
  cd?: number;
  escola?: string;
  alcance?: string;
  duracao?: string;
  desc: string;
  [key: string]: any;
}

export interface NPCCombatStats {
  pv: number | string;
  pm?: number | string;
  defesa: number | string;
  iniciativa?: number | string;
  rd?: number | string;
  sentidos?: string;
  resistencias?: string[];
  ataques?: NPCAttack[];
  magias?: NPCMagia[];
  habilidades?: (string | NPCHabilidade)[];
  fraquezas?: string[];
  taticas?: string;
  equipamento?: string[];
  equipamentos?: string[];
  [key: string]: any;
}

export interface NPCStats {
  id: string;
  name: string;
  role: string;
  category: 'aliado' | 'antagonista' | 'coadjuvante' | 'ameaca';
  nd: string | number;
  tipo?: string;
  tamanho?: string;
  deslocamento?: string;
  description?: string;
  resumo?: string;
  atributos: {
    for: number;
    des: number;
    con: number;
    int: number;
    sab: number;
    car: number;
  };
  pericias?: { nome: string; mod: number }[];
  combatStats: NPCCombatStats;
  habilidades?: (string | NPCHabilidade)[];
  taticas?: string;
  equipamentos?: string[];
  roleplay?: {
    personalidade?: string;
    motivacao?: string;
    citacao?: string;
    segredos?: string;
    ganchos?: string[];
    notasMestre?: string;
  };
  [key: string]: any;
}

export interface HistoryStep {
  nodeId: string;
  timestamp: string;
  choiceLabel: string;
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
