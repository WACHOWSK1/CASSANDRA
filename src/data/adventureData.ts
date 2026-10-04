import { AdventureNode, NPCStats, AdventureResources, AdventureNPCStatus, AdventureGroupConditions } from '@/types/adventure';

export const INITIAL_RESOURCES: AdventureResources = {
  cartaHelena: false,
  livroKhorcova: false,
  placaGreywick: false,
  saisProtecao: 0,
  fagulhaArcana: null,
  mascaraVarek: false,
  sineteCrane: null,
  contratoSeverian: false,
  confissaoSeverian: false,
  nomeEscolhido: false,
  determinacaoFamiliar: false,
};

export const INITIAL_NPC_STATUS: AdventureNPCStatus = {
  cael: 'desconhecido',
  toma: 'nao_resolvido',
  varek: 'oculto',
  aldren: 'preso',
  cassandra: 'cativa',
};

export const INITIAL_GROUP_CONDITIONS: AdventureGroupConditions = {
  pmPerdidosTotal: 0,
  modificadorViagem: 0,
  modificadorSocial: 0,
  modificadorKhorcova: 0,
  itensLacrados: 0,
  carrocaAbandonada: false,
  cicatrizPurpura: false,
  fatigado: false,
  fraco: false,
};

export const ADVENTURE_ACTS = [
  {
    id: 1,
    title: "Ato I: A Jornada até Milothiann",
    subtitle: "Partida de Yuvalin, Ensaio de Greywick e Infiltração na Fortaleza Inquisitorial",
  },
  {
    id: 2,
    title: "Ato II: O Resgate de Cassandra e o Confronto com Severian",
    subtitle: "Mausoléu dos Crane, Galeria dos Confiscados e o Confronto dos Pilonos",
  },
  {
    id: 3,
    title: "Ato III: A Verdade dos Crane e a Fuga da Ascensão Profana",
    subtitle: "A Herança dos Crane, O Terror de Ferren e a Travessia Desesperada",
  }
];

export const ADVENTURE_NODES: Record<string, AdventureNode> = {
  // ==========================================
  // ATO I: A JORNADA ATÉ MILOTHIANN
  // ==========================================
  "S": {
    id: "S",
    act: 1,
    title: "Yuvalin: Partida para Portsmouth",
    type: "start",
    summary: "O grupo prepara a partida rumo a Portsmouth e Milothiann. Cael se aproxima com informações sobre o paradeiro de Cassandra.",
    narration: "A névoa úmida do início da madrugada em Yuvalin esconde os últimos preparativos da carroça. Uma carta de Helena sela o destino do grupo: Cassandra Crane foi levada para as masmorras de Milothiann. Pouco antes do trote dos cavalos, passos apressados ecoam nas vielas. Um homem encapuzado ergue as mãos vazias, afirmando ser Cael, o mensageiro confiável de Helena.",
    gmTips: "Defina o tom de desconfiança e urgência. Cael traz instruções cruciais, mas os jogadores podem suspeitar de uma emboscada.",
    nextDecision: "C",
    options: [
      {
        id: "C_opt1",
        target: "C1",
        label: "Confiar em Cael após verificar a carta e ordens de Helena",
        badge: "Abordagem Cautelosa",
        effects: {
          resources: { cartaHelena: true },
          npcStatus: { cael: "disponivel" },
          log: "O grupo verificou os selos da carta de Helena e confirmou a identidade de Cael como aliado."
        }
      },
      {
        id: "C_opt2",
        target: "C2",
        label: "Atacar Cael ou subjugá-lo pela força",
        badge: "Agressão Imediata",
        effects: {
          resources: { cartaHelena: true },
          npcStatus: { cael: "incapacitado" },
          log: "O grupo subjugou Cael com violência. As informações da carta foram preservadas, mas Cael ficou ferido e incapacitado."
        }
      }
    ]
  },

  "C1": {
    id: "C1",
    act: 1,
    title: "Aliança com Cael Consolidada",
    type: "outcome",
    summary: "Carta íntegra; ordem de Helena confirmada; Cael está à disposição para guiar e apoiar o grupo.",
    narration: "Cael suspira aliviado ao ver o selo examinado com cuidado. Ele desdobra um mapa desenhado à mão: 'Helena tinha razão sobre vocês. Sei como entrar em Milothiann, mas há um garoto em Greywick — Toma — que possui registros da família Mara indispensáveis para desarmar a segurança mágica de Khorcova.'",
    nextDecision: "R",
    options: [
      { id: "R_opt1", target: "G", label: "Desviar por Greywick (Salvar Toma e documentos de Mara)", badge: "Rota de Apoio" },
      { id: "R_opt2", target: "E", label: "Seguir direto pela Estrada Real (Velocidade máxima)", badge: "Velocidade / Alto Alerta" },
      { id: "R_opt3", target: "P", label: "Executar um Plano Próprio (Rota alternativa)", badge: "Criatividade / Risco" }
    ]
  },

  "C2": {
    id: "C2",
    act: 1,
    title: "Cael Subjugado e Forçado a Revelar a Carta",
    type: "outcome",
    summary: "Informação preservada; ferimentos; Cael fica incapacitado para tarefas ativas.",
    narration: "Com uma lâmina no pescoço e ossos doloridos, Cael cospe sangue e entrega a carta amassada: 'Vocês não entendem... Helena me mandou para ajudar! O mapa para Milothiann está na algibeira... e o garoto Toma em Greywick corre perigo.'",
    nextDecision: "R",
    options: [
      { id: "R_opt1_c2", target: "G", label: "Desviar por Greywick (Salvar Toma)", badge: "Rota de Apoio" },
      { id: "R_opt2_c2", target: "E", label: "Seguir direto pela Estrada Real", badge: "Velocidade / Alto Alerta" },
      { id: "R_opt3_c2", target: "P", label: "Executar um Plano Próprio", badge: "Criatividade / Risco" }
    ]
  },

  "G": {
    id: "G",
    act: 1,
    title: "Greywick: O Vilarejo Sitiado",
    type: "challenge",
    summary: "O grupo chega ao vilarejo de Greywick para resgatar Toma e recuperar os documentos e a placa de Mara.",
    narration: "Greywick fede a fumaça e cinzas úmidas. As patrulhas inquisitoriais de Khorcova vasculham as casas. O pequeno Toma está escondido sob o assoalho de uma capela semi-destruída, segurando contra o peito o Livro de Khorcova e a Placa de passagem dos Crane.",
    challengeConfig: {
      title: "Ensaio de Greywick",
      type: "extended_test",
      targetSuccesses: 5,
      maxFailures: 3,
      skills: [
        { name: "Furtividade", cd: 18, desc: "Esgueirar-se entre os escombros e patrulhas sem chamar atenção." },
        { name: "Investigação / Percepção", cd: 18, desc: "Localizar o esconderijo exato de Toma e dos documentos." },
        { name: "Atletismo / Acrobacia", cd: 20, desc: "Escalar telhados quebrados e mover escombros silenciosamente." },
        { name: "Diplomacia / Intimidação", cd: 20, desc: "Acalmar o garoto apavorado ou despistar aldeões amedrontados." },
        { name: "Misticismo / Ladinagem", cd: 18, desc: "Desarmar as runas de detecção deixadas pelos guardas de Khorcova." }
      ],
      successOutcome: "GS",
      failureOutcome: "GC"
    },
    options: [
      { id: "GX_win", target: "GS", label: "Sucesso no Ensaio (5 sucessos antes de 3 falhas)", badge: "Sucesso Perfeito" },
      { id: "GX_fail", target: "GC", label: "Falha no Ensaio (3 falhas atingidas)", badge: "Custo Requerido" }
    ]
  },

  "GS": {
    id: "GS",
    act: 1,
    title: "Resgate Perfeito em Greywick",
    type: "outcome",
    summary: "Toma salvo; Placa de Mara, Livro de Khorcova e 3 Sais de Proteção obtidos; Alerta permanece em 0.",
    narration: "Com precisão cirúrgica, os heróis extraem Toma das sombras sem emitir um único ruído suspeito. O menino entrega a Placa entalhada com o brasão de Milothiann, o raro Livro de Khorcova e três frascos de Sais de Proteção.",
    effects: {
      resources: { placaGreywick: true, livroKhorcova: true, saisProtecao: 3 },
      alertLevel: 0,
      log: "Greywick superado com maestria: Toma salvo, Livro de Khorcova, Placa e 3 Sais de Proteção adquiridos. Alerta: 0."
    },
    nextDecision: "TP",
    options: [{ id: "TP_check", target: "TP_RESOLVER", label: "Avaliar proteção e guarda de Toma" }]
  },

  "GC": {
    id: "GC",
    act: 1,
    title: "Resgate Conturbado em Greywick (Escolha de Custo)",
    type: "choice",
    summary: "Toma é salvo, mas o grupo sofreu complicações e precisa escolher um custo inevitável.",
    narration: "Um telhado desaba ou um grito corta a noite. O grupo consegue arrancar Toma do perigo no último segundo, mas o caos exige um sacrifício imediato para garantir a fuga.",
    options: [
      {
        id: "GC_g1",
        target: "G1",
        label: "Perder Suprimentos (-2 no primeiro teste da viagem)",
        badge: "Penalidade em Viagem",
        effects: {
          resources: { placaGreywick: true, livroKhorcova: true, saisProtecao: 1 },
          groupConditions: { modificadorViagem: -2 },
          log: "Custo em Greywick: Suprimentos perdidos na correria (-2 no primeiro teste da viagem)."
        }
      },
      {
        id: "GC_g2",
        target: "G2",
        label: "Perder o Livro de Khorcova (Canal passa a CD 24)",
        badge: "Perda Estratégica",
        effects: {
          resources: { placaGreywick: true, livroKhorcova: false, saisProtecao: 2 },
          log: "Custo em Greywick: O Livro de Khorcova caiu nas chamas e foi destruído (Canal da lavanderia passa a CD 24)."
        }
      },
      {
        id: "GC_g3",
        target: "G3",
        label: "Dreno de Energia (Cada personagem perde 1d4 PM)",
        badge: "Desgaste Mágico",
        effects: {
          resources: { placaGreywick: true, livroKhorcova: true, saisProtecao: 2 },
          groupConditions: { pmPerdidosTotal: 3 },
          log: "Custo em Greywick: Esforço arcano extremo; todos os personagens perderam 1d4 PM."
        }
      }
    ]
  },

  "G1": {
    id: "G1",
    act: 1,
    title: "Custo: Suprimentos Danificados",
    type: "outcome",
    summary: "-2 no primeiro teste da viagem rumo a Milothiann.",
    nextDecision: "TP",
    options: [{ id: "G1_to_TP", target: "TP_RESOLVER", label: "Definir guarda de Toma" }]
  },

  "G2": {
    id: "G2",
    act: 1,
    title: "Custo: Livro de Khorcova Perdido",
    type: "outcome",
    summary: "Livro perdido; a rota do canal da lavanderia exigirá CD 24.",
    nextDecision: "TP",
    options: [{ id: "G2_to_TP", target: "TP_RESOLVER", label: "Definir guarda de Toma" }]
  },

  "G3": {
    id: "G3",
    act: 1,
    title: "Custo: Exaustão e Dreno de Mana",
    type: "outcome",
    summary: "Cada herói gasta 1d4 PM para estabilizar a situação e escapar.",
    nextDecision: "TP",
    options: [{ id: "G3_to_TP", target: "TP_RESOLVER", label: "Definir guarda de Toma" }]
  },

  "TP_RESOLVER": {
    id: "TP_RESOLVER",
    act: 1,
    title: "Decisão: Destino e Guarda de Toma",
    type: "choice",
    summary: "Decidir se Cael pode ficar para proteger Toma ou se o grupo precisará improvisar outro refúgio.",
    narration: "Com Toma a salvo, os heróis precisam decidir quem cuidará do menino enquanto eles invadem a temida fortaleza de Milothiann.",
    options: [
      {
        id: "TP_sim",
        target: "T1",
        label: "Cael assume a proteção de Toma (Requer Cael Disponível)",
        badge: "Cael Disponível",
        condition: "cael_disponivel",
        effects: {
          npcStatus: { toma: "salvo_com_cael" },
          log: "Cael assumiu a custódia de Toma em local seguro. Toma protegido sem atrasos."
        }
      },
      {
        id: "TP_nao",
        target: "T2",
        label: "Encontrar outro abrigo às pressas (+1 Alerta)",
        badge: "Cael Incapacitado / Improviso",
        effects: {
          npcStatus: { toma: "salvo_outro_abrigo" },
          alertLevelDelta: 1,
          log: "O grupo perdeu tempo negociando um esconderijo improvisado (+1 Alerta)."
        }
      }
    ]
  },

  "T1": {
    id: "T1",
    act: 1,
    title: "Toma Protegido por Cael",
    type: "outcome",
    summary: "Toma fica em segurança total; a viagem segue sem atrasos nem aumento de Alerta.",
    narration: "Cael acena com firmeza: 'Cuidarei dele como se fosse meu próprio sangue. Vão até Milothiann e tragam Cassandra viva.'",
    nextDecision: "Q",
    options: [{ id: "T1_to_Q", target: "Q", label: "Prosseguir para o Pátio das Três Chamas" }]
  },

  "T2": {
    id: "T2",
    act: 1,
    title: "Refúgio Alternativo para Toma (+1 Alerta)",
    type: "outcome",
    summary: "Toma é escondido em uma cabana de lenhadores, mas o atraso eleva o Alerta em +1.",
    narration: "A busca por um esconderijo consome quase duas horas preciosas. As sentinelas de Milothiann já reforçaram as primeiras barreiras.",
    nextDecision: "Q",
    options: [{ id: "T2_to_Q", target: "Q", label: "Prosseguir para o Pátio das Três Chamas" }]
  },

  "E": {
    id: "E",
    act: 1,
    title: "Avanço Direto pela Estrada Real",
    type: "outcome",
    summary: "O grupo chega 1 hora antes a Milothiann, mas com Alerta 2 e Toma deixado para trás em perigo.",
    narration: "A carroça avança a galope pelas pedras da Estrada Real. Patrulhas montadas cruzam o horizonte e sinos tocam à distância.",
    effects: {
      alertLevel: 2,
      npcStatus: { toma: "estrada_real" },
      log: "Viagem acelerada pela Estrada Real: Chegaram 1 hora antes, mas Alerta subiu para 2 e Toma não foi resolvido."
    },
    nextDecision: "Q",
    options: [{ id: "E_to_Q", target: "Q", label: "Prosseguir para o Pátio das Três Chamas" }]
  },

  "P": {
    id: "P",
    act: 1,
    title: "Execução de Plano Próprio dos Jogadores",
    type: "choice",
    summary: "Definir a vantagem, o risco e o custo previamente antes da execução mecânica.",
    narration: "Os heróis ignoram as rotas convencionais e traçam uma estratégia audaciosa através dos pântanos ou colinas escarpadas.",
    options: [
      {
        id: "P_sucesso",
        target: "Q",
        label: "Plano bem-sucedido (Vantagem obtida)",
        badge: "Sucesso Criativo",
        effects: {
          groupConditions: { modificadorViagem: 2 },
          log: "Plano próprio executado com sucesso (+2 no próximo teste)."
        }
      },
      {
        id: "P_complicacao",
        target: "Q",
        label: "Plano com complicações (+1 Alerta / custo pago)",
        badge: "Complicação",
        effects: {
          alertLevelDelta: 1,
          log: "Plano próprio gerou complicações inesperadas (+1 Alerta)."
        }
      }
    ]
  },

  "Q": {
    id: "Q",
    act: 1,
    title: "O Enigma das Três Chamas de Cassandra",
    type: "puzzle",
    summary: "Cassandra deixou um mecanismo de sintonização arcana com três discos no limiar de Khorcova.",
    narration: "Diante de um obelisco de bronze gravado com runas Crane, três discos giratórios emanam calor residual. Três conceitos precisam ser alinhados: Aquecer a alma, Iluminar a verdade, Espantar as trevas.",
    puzzleConfig: {
      correctSequence: ["Aquecer", "Iluminar", "Espantar"],
      wrongPenalty: "1d6 de dano de Essência e sentinela se aproxima (+1 Alerta em potencial)."
    },
    options: [
      { id: "Q_correto", target: "F_DECISION", label: "Alinhar corretamente: Aquecer -> Iluminar -> Espantar", badge: "Fagulha Arcana Liberada" },
      { id: "Q_erro", target: "Q1", label: "Girar disco incorreto ou forçar o mecanismo", badge: "Dano de Essência 1d6" }
    ]
  },

  "Q1": {
    id: "Q1",
    act: 1,
    title: "Retrocesso no Enigma das Chamas",
    type: "outcome",
    summary: "Descarga de 1d6 de essência; sentinela ouve o zumbido; tentar novamente.",
    narration: "Um estalo violeta queima as mãos de quem tocou no obelisco. Passos de patrulha se aproximam pelo corredor.",
    effects: {
      alertLevelDelta: 1,
      log: "Falha no enigma das chamas: 1d6 de dano de essência e passos de patrulha (+1 Alerta)."
    },
    options: [{ id: "Q1_retry", target: "Q", label: "Tentar resolver novamente o Enigma das Chamas" }]
  },

  "F_DECISION": {
    id: "F_DECISION",
    act: 1,
    title: "A Fagulha Arcana de Cassandra: Como usá-la?",
    type: "choice",
    summary: "O mecanismo libera uma fagulha condensada da magia de Cassandra. O grupo deve escolher seu destino imediato.",
    narration: "A runa central se abre, revelando uma pequena chama etérea que pulsa no mesmo ritmo do coração de Cassandra.",
    options: [
      {
        id: "F_sabotar",
        target: "F1",
        label: "Sabotar as redes de contenção (Um pilono inativo; +1 Alerta em Khorcova)",
        badge: "Enfraquecer Severian",
        effects: {
          resources: { fagulhaArcana: "sabotada" },
          pilonoInativoFagulha: true,
          alertLevelDelta: 1,
          log: "Fagulha usada para Sabotagem: Um pilono de Severian começará inativo, Alerta +1."
        }
      },
      {
        id: "F_sinalizar",
        target: "F2",
        label: "Sinalizar presença (+2 no primeiro teste em Khorcova; Varek recebe 1 reflexo)",
        badge: "Vantagem Tática / Reflexo de Varek",
        effects: {
          resources: { fagulhaArcana: "sinalizada" },
          groupConditions: { modificadorKhorcova: 2 },
          log: "Fagulha usada para Sinalizar: +2 no primeiro teste em Khorcova, Varek com reflexo."
        }
      },
      {
        id: "F_guardar",
        target: "F3",
        label: "Guardar a fagulha no frasco (A cela de Cassandra poderá ser aberta por reação)",
        badge: "Abertura Imediata da Cela",
        effects: {
          resources: { fagulhaArcana: "guardada" },
          log: "Fagulha Arcana Guardada: A cela de contenção de Cassandra poderá ser aberta por reação!"
        }
      }
    ]
  },

  "F1": {
    id: "F1",
    act: 1,
    title: "Fagulha: Redes Sabotadas",
    type: "outcome",
    summary: "Um dos pilonos rituais de Severian estará desativado; Alerta aumentou em +1.",
    nextDecision: "I",
    options: [{ id: "F1_to_I", target: "I", label: "Escolher método de Infiltração em Milothiann" }]
  },

  "F2": {
    id: "F2",
    act: 1,
    title: "Fagulha: Sinalização Arcana",
    type: "outcome",
    summary: "+2 no primeiro teste de Khorcova; Varek ganha 1 reflexo protetor.",
    nextDecision: "I",
    options: [{ id: "F2_to_I", target: "I", label: "Escolher método de Infiltração em Milothiann" }]
  },

  "F3": {
    id: "F3",
    act: 1,
    title: "Fagulha: Preservada para o Resgate",
    type: "outcome",
    summary: "A cela de contenção de Cassandra abrirá sem testes no momento do encontro.",
    nextDecision: "I",
    options: [{ id: "F3_to_I", target: "I", label: "Escolher método de Infiltração em Milothiann" }]
  },

  "I": {
    id: "I",
    act: 1,
    title: "Infiltração em Milothiann: Escolha da Rota de Entrada",
    type: "choice",
    summary: "Os portões de Milothiann erguem-se diante do grupo. Quatro vias de infiltração estão disponíveis.",
    narration: "As muralhas de granito negro de Milothiann projetam sombras colossais. Pelo portão norte, um cortejo fúnebre pede passagem. No acampamento a leste, mercenários jogam dados. Sob as muralhas, as grelhas da lavanderia despejam água.",
    options: [
      { id: "I_cortejo", target: "A_CORTEJO", label: "Infiltrar-se no Cortejo Funerário (3S/2F; Placa dá +2)", badge: "Furtividade Social" },
      { id: "I_mercenarios", target: "B_MERCENARIOS", label: "Infiltrar-se via Acampamento de Mercenários", badge: "Enganação / Combate" },
      { id: "I_canal", target: "D_CANAL", label: "Invasão pelo Canal da Lavanderia (4S/2F; Sem livro CD 24)", badge: "Infiltração Subterrânea" },
      { id: "I_inventado", target: "X_PLANO", label: "Executar Plano Inventado pelos Jogadores (3S/2F)", badge: "Estratégia Livre" }
    ]
  },

  "A_CORTEJO": {
    id: "A_CORTEJO",
    act: 1,
    title: "Infiltração: Cortejo Funerário",
    type: "challenge",
    summary: "Disfarçar-se entre os enlutados aristocratas. Placa de Greywick concede +2.",
    challengeConfig: {
      title: "Desafio do Cortejo Funerário",
      type: "extended_test",
      targetSuccesses: 3,
      maxFailures: 2,
      bonusCondition: "Possuir a Placa de Greywick concede +2 em todos os testes.",
      skills: [
        { name: "Enganação / Atuação", cd: 18, desc: "Sustentar a postura de pranteadores nobres." },
        { name: "Religião / Conhecimento", cd: 17, desc: "Recitar os cânticos fúnebres de Milothiann." },
        { name: "Furtividade", cd: 19, desc: "Ocultar armas de grande porte sob os mantos fúnebres." }
      ],
      successOutcome: "AS",
      failureOutcome: "AF"
    },
    options: [
      { id: "A_win", target: "AS", label: "Sucesso (3 sucessos antes de 2 falhas)", badge: "Entrada Impecável" },
      { id: "A_fail", target: "AF", label: "2 Falhas atingidas (+2 Alerta, Item Lacrado)", badge: "Descoberta Parcial" }
    ]
  },

  "AS": {
    id: "AS",
    act: 1,
    title: "Cortejo: Sucesso Total",
    type: "outcome",
    summary: "O grupo entra despercebido perto do Mausoléu dos Crane; equipamento 100% preservado.",
    effects: { log: "Infiltração pelo cortejo concluída com maestria. Entrada direta no mausoléu." },
    nextDecision: "M",
    options: [{ id: "AS_to_M", target: "M", label: "Adentrar o Mausoléu dos Crane" }]
  },

  "AF": {
    id: "AF",
    act: 1,
    title: "Cortejo: Revista Inquisitorial (+2 Alerta, Item Lacrado)",
    type: "outcome",
    summary: "O grupo é interceptado em revista: Entra com +2 Alerta e 1 item arcano confiscado/lacrado.",
    effects: {
      alertLevelDelta: 2,
      groupConditions: { itensLacrados: 1 },
      log: "Falha no cortejo: +2 Alerta e 1 item arcano confiscado/lacrado na entrada."
    },
    nextDecision: "M",
    options: [{ id: "AF_to_M", target: "M", label: "Adentrar o Mausoléu dos Crane" }]
  },

  "B_MERCENARIOS": {
    id: "B_MERCENARIOS",
    act: 1,
    title: "Infiltração: Acampamento de Mercenários",
    type: "choice",
    summary: "Misturar-se aos combatentes. Verificar se Sandro manterá o disfarce.",
    options: [
      {
        id: "BS_sim",
        target: "B1_CHECK",
        label: "Sandro revela seu brasão nobre ou faz discurso cavalheiresco (CD +2)",
        badge: "Orgulho de Sandro / CD +2",
        effects: { log: "Sandro revelou seu brasão nobre (CDs de infiltração aumentadas em +2)." }
      },
      { id: "BS_nao", target: "BO_CHALLENGE", label: "Sandro mantém a discrição (CD normal)", badge: "Disfarce Mantido" }
    ]
  },

  "B1_CHECK": {
    id: "B1_CHECK",
    act: 1,
    title: "Mercenários: Tensão Provocada por Sandro",
    type: "challenge",
    summary: "Teste estendido com CD aumentada em +2.",
    challengeConfig: {
      title: "Desafio dos Mercenários (CD Elevada +2)",
      type: "extended_test",
      targetSuccesses: 3,
      maxFailures: 2,
      skills: [
        { name: "Intimidação", cd: 20, desc: "Impor respeito na força bruta." },
        { name: "Enganação / Jogatina", cd: 20, desc: "Fingir apostas e subornar guardas." },
        { name: "Furtividade", cd: 20, desc: "Passar pelos portões internos no tumulto." }
      ],
      successOutcome: "B2",
      failureOutcome: "B3"
    },
    options: [
      { id: "B1_win", target: "B2", label: "Sucesso (3 sucessos)", badge: "Entrada Conquistada" },
      { id: "B1_fail", target: "B3", label: "2 Falhas (Alerta 3 e Escolta)", badge: "Captura / Escolta" }
    ]
  },

  "BO_CHALLENGE": {
    id: "BO_CHALLENGE",
    act: 1,
    title: "Mercenários: Desafio Padrão",
    type: "challenge",
    summary: "3 sucessos antes de 2 falhas para cruzar o acampamento.",
    challengeConfig: {
      title: "Desafio dos Mercenários",
      type: "extended_test",
      targetSuccesses: 3,
      maxFailures: 2,
      skills: [
        { name: "Intimidação", cd: 18, desc: "Impor respeito na força bruta." },
        { name: "Enganação / Jogatina", cd: 18, desc: "Fingir apostas e subornar guardas." },
        { name: "Furtividade", cd: 18, desc: "Passar pelos portões internos no tumulto." }
      ],
      successOutcome: "B2",
      failureOutcome: "B3"
    },
    options: [
      { id: "BO_win", target: "B2", label: "Sucesso (3 sucessos)", badge: "Entrada Conquistada" },
      { id: "BO_fail", target: "B3", label: "2 Falhas (Alerta 3 e Escolta)", badge: "Captura / Escolta" }
    ]
  },

  "B2": {
    id: "B2",
    act: 1,
    title: "Mercenários: Sucesso na Infiltração",
    type: "outcome",
    summary: "Entrada rápida e agressiva; grupo perto de Khorcova.",
    effects: { log: "Infiltração pelos mercenários bem-sucedida: Chegada rápida perto de Khorcova." },
    nextDecision: "M",
    options: [{ id: "B2_to_M", target: "M", label: "Avançar até a passagem do Mausoléu" }]
  },

  "B3": {
    id: "B3",
    act: 1,
    title: "Mercenários: Descoberta e Escolta Armada (Alerta 3)",
    type: "outcome",
    summary: "Alerta sobe para 3; o grupo é escoltado até hospedaria vigiada.",
    effects: {
      alertLevel: 3,
      log: "Falha com mercenários: Alerta sobe para 3; grupo precisou escapar de hospedaria vigiada."
    },
    nextDecision: "M",
    options: [{ id: "B3_to_M", target: "M", label: "Escapar pelo duto até o Mausoléu" }]
  },

  "D_CANAL": {
    id: "D_CANAL",
    act: 1,
    title: "Infiltração: Canal da Lavanderia",
    type: "challenge",
    summary: "4 sucessos antes de 2 falhas. Sem o Livro de Khorcova, CD é 24.",
    challengeConfig: {
      title: "Travessia do Canal da Lavanderia",
      type: "extended_test",
      targetSuccesses: 4,
      maxFailures: 2,
      bonusCondition: "Possuir o Livro de Khorcova define a CD em 18; sem o livro, a CD sobe para 24!",
      skills: [
        { name: "Atletismo", cd: 18, desc: "Nadar contra a correnteza e forçar grades." },
        { name: "Fortitude", cd: 18, desc: "Resistir aos vapores ácidos da lavanderia." },
        { name: "Sobrevivência / Percepção", cd: 18, desc: "Mapear bifurcações e evitar drenos mortais." }
      ],
      successOutcome: "D1",
      failureOutcome: "D2"
    },
    options: [
      { id: "D_win", target: "D1", label: "Sucesso (4 sucessos antes de 2 falhas)", badge: "Infiltração Limpa" },
      { id: "D_fail", target: "D2", label: "2 Falhas (Entrada com Ferimentos)", badge: "Desgaste Físico" }
    ]
  },

  "D1": {
    id: "D1",
    act: 1,
    title: "Canal: Sucesso Subterrâneo",
    type: "outcome",
    summary: "Sem revistas ou Alerta; transferência de Cassandra avança normalmente.",
    effects: { log: "Canal da Lavanderia superado sem Alerta ou revistas. Transferência de Cassandra avança." },
    nextDecision: "M",
    options: [{ id: "D1_to_M", target: "M", label: "Seguir para a passagem dos Crane" }]
  },

  "D2": {
    id: "D2",
    act: 1,
    title: "Canal: Acidente Tóxico e Ferimentos",
    type: "outcome",
    summary: "O grupo entra ferido; -2 no primeiro teste social; transferência de Cassandra avança.",
    effects: {
      groupConditions: { modificadorSocial: -2 },
      log: "Falha no canal: Grupo entra ferido (-2 no primeiro teste social)."
    },
    nextDecision: "M",
    options: [{ id: "D2_to_M", target: "M", label: "Seguir para a passagem dos Crane" }]
  },

  "X_PLANO": {
    id: "X_PLANO",
    act: 1,
    title: "Infiltração: Plano Inventado pelos Jogadores",
    type: "challenge",
    summary: "Declarar benefício e custo -> 3 sucessos antes de 2 falhas.",
    challengeConfig: {
      title: "Desafio de Plano Inventado",
      type: "extended_test",
      targetSuccesses: 3,
      maxFailures: 2,
      skills: [
        { name: "Perícia 1", cd: 19, desc: "Ação primária para vencer a muralha." },
        { name: "Perícia 2", cd: 19, desc: "Ação para anular defesas mágicas." },
        { name: "Perícia 3", cd: 19, desc: "Ação de extração e prazo." }
      ],
      successOutcome: "X1",
      failureOutcome: "X1"
    },
    options: [{ id: "X_win", target: "X1", label: "Concluir resolução do Plano Inventado", badge: "Resolução Aberta" }]
  },

  "X1": {
    id: "X1",
    act: 1,
    title: "Plano Inventado: Concluído",
    type: "outcome",
    summary: "Consequências e benefícios aplicados; grupo chega ao mausoléu.",
    effects: { log: "Plano inventado executado pelo grupo." },
    nextDecision: "M",
    options: [{ id: "X1_to_M", target: "M", label: "Adentrar o Mausoléu dos Crane" }]
  },

  // ==========================================
  // ATO II: O RESGATE DE CASSANDRA & SEVERIAN
  // ==========================================
  "M": {
    id: "M",
    act: 2,
    title: "Mausoléu dos Crane: A Passagem Secreta",
    type: "puzzle",
    summary: "O grupo encontra a cripta dos Crane. A passagem para as masmorras secretas precisa ser destravada.",
    narration: "A cripta ancestral dos Crane é esculpida em mármore cinzento com entalhes de gárgulas. No centro, o sarcófago do patriarca repousa sob um mosaico de constelações.",
    options: [
      { id: "D_seq", target: "D1_MAUSOLEU", label: "Sequência coerente da linhagem Crane sem rolagem", badge: "Determinação Familiar" },
      { id: "D_pista", target: "D2_PISTA", label: "Examinar os entalhes e pedir uma pista (CD 20)", badge: "Investigação CD 20" },
      { id: "D_erro", target: "D3_ERRO", label: "Forçar a fechadura ou tentativa errada (+1 Alerta)", badge: "Alarme +1 Alerta" }
    ]
  },

  "D1_MAUSOLEU": {
    id: "D1_MAUSOLEU",
    act: 2,
    title: "Passagem Aberta: Determinação Familiar",
    type: "outcome",
    summary: "Concede 'Determinação Familiar' para Cassandra (+2 em Vontade).",
    effects: {
      resources: { determinacaoFamiliar: true },
      log: "Passagem aberta com sequência coerente: Cassandra receberá Determinação Familiar (+2 em Vontade)."
    },
    nextDecision: "P_INVASAO",
    options: [{ id: "D1_to_P", target: "P_INVASAO", label: "Avançar para o planejamento de invasão" }]
  },

  "D2_PISTA": {
    id: "D2_PISTA",
    act: 2,
    title: "Pista Revelada no Mausoléu",
    type: "outcome",
    summary: "Teste CD 20 revela os versos do juramento dos Crane para abrir com segurança.",
    options: [{ id: "D2_to_M", target: "M", label: "Inserir a sequência correta no sarcófago" }]
  },

  "D3_ERRO": {
    id: "D3_ERRO",
    act: 2,
    title: "Erro na Passagem: Alarme Disparado (+1 Alerta)",
    type: "outcome",
    summary: "Alarme ecoa vibrações nas masmorras (+1 Alerta); tentar novamente.",
    effects: {
      alertLevelDelta: 1,
      log: "Tentativa errada no mausoléu: Alarme sonoro disparado (+1 Alerta)."
    },
    options: [{ id: "D3_to_M", target: "M", label: "Tentar novamente abrir a passagem" }]
  },

  "P_INVASAO": {
    id: "P_INVASAO",
    act: 2,
    title: "Aproximação: Modificar o Plano de Invasão?",
    type: "choice",
    summary: "O grupo espia a Galeria dos Confiscados através das grades de ventilação.",
    options: [
      {
        id: "P_mudanca",
        target: "P1_MODIFICADO",
        label: "Mudança tática bem fundamentada (-1 Alerta ou Cobertura e Posição Favorável)",
        badge: "Vantagem Tática",
        effects: { alertLevelDelta: -1, log: "Mudança tática executada (-1 Alerta e posição vantajosa)." }
      },
      { id: "P_manter", target: "P2_PADRAO", label: "Manter o plano e entrar direto pela Galeria", badge: "Entrada Padrão" }
    ]
  },

  "P1_MODIFICADO": {
    id: "P1_MODIFICADO",
    act: 2,
    title: "Posição Tática Elevada",
    type: "outcome",
    summary: "-1 Alerta e cobertura nas vigas superiores.",
    nextDecision: "V_DESMASCARAR",
    options: [{ id: "P1_to_V", target: "V_DESMASCARAR", label: "Analisar a 'Falsa Mara' na cela" }]
  },

  "P2_PADRAO": {
    id: "P2_PADRAO",
    act: 2,
    title: "Entrada Direta na Galeria dos Confiscados",
    type: "outcome",
    summary: "Entrada frontal nas masmorras.",
    nextDecision: "V_DESMASCARAR",
    options: [{ id: "P2_to_V", target: "V_DESMASCARAR", label: "Analisar a 'Falsa Mara' na cela" }]
  },

  "V_DESMASCARAR": {
    id: "V_DESMASCARAR",
    act: 2,
    title: "A Armadilha: Desmascarar a Falsa Mara?",
    type: "choice",
    summary: "A mulher ajoelhada é Varek, metamorfo de Severian com disfarce ilusório.",
    options: [
      {
        id: "V_sim",
        target: "V1_REVELADO",
        label: "Desmascarar a impostora antes da iniciativa (Percepção/Intuição CD 18)",
        badge: "Varek Perde Surpresa e Reflexos",
        effects: {
          npcStatus: { varek: "revelado" },
          log: "O grupo desmascarou Varek! Varek perdeu a surpresa e reflexos iniciais."
        }
      },
      {
        id: "V_nao",
        target: "V2_SURPRESA",
        label: "Aproximar-se para resgatar sem questionar (Cair na farsa)",
        badge: "Varek com Disfarce e Reflexos",
        effects: { log: "O grupo caiu na farsa de Varek. Varek inicia com reflexos ativos." }
      }
    ]
  },

  "V1_REVELADO": {
    id: "V1_REVELADO",
    act: 2,
    title: "Varek Desmascarado!",
    type: "combat",
    summary: "Varek perde a surpresa e reflexos defensivos.",
    nextDecision: "VF",
    options: [{ id: "V1_to_VF", target: "VF", label: "Iniciar Confronto com Varek" }]
  },

  "V2_SURPRESA": {
    id: "V2_SURPRESA",
    act: 2,
    title: "Emboscada de Varek!",
    type: "combat",
    summary: "Varek com 2 reflexos ilusórios ativos (+4 na Defesa na 1ª rodada).",
    nextDecision: "VF",
    options: [{ id: "V2_to_VF", target: "VF", label: "Iniciar Confronto com Varek" }]
  },

  "VF": {
    id: "VF",
    act: 2,
    title: "Confronto Tático: Varek, o Caçador Arcano",
    type: "combat_arena",
    summary: "Varek (ND 8, PV 58/120, PM 58, Defesa 30/34, RD Fogo 40, RD Física 5). Caçador arcano com combo brutal de Toque Chocante (11d8+13) no Machado de Batalha com vantagem, Contramágica (+21), Aparar Magia (+13) e Runa Homem-Bomba aos 0 PV.",
    narration: "A ilusão se desfaz em centelhas douradas e fumaça fria! Varek empunha seu machado de batalha rúnico e ergue o escudo pesado com os raios solares de Azgher gravados no metal. Faíscas elétricas de alta voltagem crepitam ao longo do fio da lâmina enquanto ele fecha a passagem: 'Severian me pagou muito bem para garantir que ninguém saia vivo deste corredor. Vocês não passarão!'",
    gmTips: "Varek é um caçador de elite extremamente preparado contra conjuradores: possui RD Fogo 40 e RD Física 5, +9 em todas as resistências contra magias (+20 Fort, +22 Refl, +17 Vont), usa Contramágica Aprimorada (+21) e Aparar Magia com o Machado (+13) para rebater feitiços. Seus ataques são desferidos com Vantagem (Concentração de Combate) e ele pode desferir até 2 ataques do combo Toque Chocante de 12 PM (11d8+13 + 2d8+3d6+7) por turno! CUIDADO: Se cair a 0 PV ou inconsciente, sua Runa de Proteção detona automaticamente como 'homem-bomba' (11d8+13 elétrico em raio de 6m)!",
    combatConfig: {
      enemy: "Varek, o Caçador Arcano",
      pv: 120,
      defesa: 30,
      thresholds: [
        { pv: 60, event: "Varek atinge 60 PV e tenta fugir pelo alçapão secreto lançando Amarras Etéreas para cobrir sua retirada." },
        { pv: 30, event: "Se encurralado aos 30 PV, Varek propõe rendição em troca da vida, entregando sua Máscara e o Contrato de Severian." },
        { pv: 0, event: "⚠️ GATILHO RUNA DE PROTEÇÃO (HOMEM-BOMBA): Ao cair a 0 PV ou desmaiar, Varek descarrega 11d8+13 de dano elétrico em área de 6m (Reflexos CD 19 reduz metade)!" }
      ]
    },
    options: [
      {
        id: "VD_morto",
        target: "VI",
        label: "Varek é abatido em combate direto (Detona Runa Homem-Bomba)",
        badge: "Runa Detonada / Espólios Recuperados",
        effects: {
          npcStatus: { varek: "morto" },
          resources: { mascaraVarek: true, contratoSeverian: true },
          log: "Varek foi derrotado em combate! A Runa Homem-Bomba detonou. Máscara de Varek e Contrato secreto de Severian recuperados."
        }
      },
      {
        id: "VD_rendido",
        target: "VC",
        label: "Varek atinge 30 PV ou menos e se rende (Cercado)",
        badge: "Rendição de Varek",
        effects: {
          npcStatus: { varek: "rendido" },
          resources: { mascaraVarek: true, contratoSeverian: true },
          log: "Varek se rendeu aos 30 PV sob ameaça de morte e entregou seus espólios sem detonar a runa."
        }
      },
      { id: "VD_fuga", target: "VE_FUGA", label: "Varek atinge 60 PV e dispara em fuga pelo alçapão", badge: "Tentativa de Fuga" }
    ]
  },

  "VI": {
    id: "VI",
    act: 2,
    title: "Varek Eliminado Silenciosamente",
    type: "outcome",
    summary: "Não alerta Severian; sem testemunha viva; documentos revelam o plano.",
    nextDecision: "INF_CONTRATO",
    options: [{ id: "VI_to_INF", target: "INF_CONTRATO", label: "Examinar os contratos e prosseguir para Cassandra" }]
  },

  "VC": {
    id: "VC",
    act: 2,
    title: "Varek se Rendeu: Qual o Destino dele?",
    type: "choice",
    summary: "Varek implora pela vida, oferecendo a Máscara e revelando o contrato de Severian.",
    options: [
      {
        id: "DT_poupar",
        target: "DT1_TESTEMUNHA",
        label: "Poupar ou amarrar Varek (Testemunha viva sobre a conspiração)",
        badge: "Testemunha Preservada",
        effects: {
          npcStatus: { varek: "capturado" },
          resources: { mascaraVarek: true, contratoSeverian: true },
          log: "Varek foi poupado como testemunha viva."
        }
      },
      {
        id: "DT_matar",
        target: "DT2_EXECUCAO",
        label: "Executar Varek sumariamente (Sem testemunha; não alerta Severian)",
        badge: "Execução Fria",
        effects: {
          npcStatus: { varek: "morto" },
          resources: { mascaraVarek: true, contratoSeverian: true },
          log: "Varek foi executado sumariamente."
        }
      }
    ]
  },

  "VE_FUGA": {
    id: "VE_FUGA",
    act: 2,
    title: "Fuga de Varek: O que o grupo faz?",
    type: "choice",
    summary: "Varek corre em direção ao duto superior para avisar Severian.",
    options: [
      { id: "VE_perseguir", target: "VP_CHALLENGE", label: "Perseguir Varek a toda velocidade (3S/2F)", badge: "Perseguição Tensa" },
      { id: "VE_bloquear", target: "VB_DECISAO", label: "Bloquear a rota à distância com magia ou tiro", badge: "Ação à Distância" },
      {
        id: "VE_priorizar",
        target: "VE1_CASSANDRA",
        label: "Ignorar Varek e priorizar o resgate de Cassandra",
        badge: "Foco no Resgate / Severian Avisado",
        effects: {
          npcStatus: { varek: "fugiu" },
          severianBonusPV: 30,
          resources: { contratoSeverian: true },
          log: "Varek escapou e avisou Severian (+30 PV temporários para Severian)."
        }
      }
    ]
  },

  "VP_CHALLENGE": {
    id: "VP_CHALLENGE",
    act: 2,
    title: "Perseguição a Varek",
    type: "challenge",
    summary: "3 sucessos antes de 2 falhas para alcançar o espião antes da Capela.",
    challengeConfig: {
      title: "Perseguição nos Corredores",
      type: "extended_test",
      targetSuccesses: 3,
      maxFailures: 2,
      skills: [
        { name: "Atletismo", cd: 19, desc: "Correr e saltar sobre destroços." },
        { name: "Pontaria / Misticismo", cd: 19, desc: "Disparar para cortar o caminho." },
        { name: "Acrobacia", cd: 18, desc: "Desviar de bombas de fumaça." }
      ],
      successOutcome: "VP1",
      failureOutcome: "VP2"
    },
    options: [
      { id: "VP_win", target: "VP1", label: "Sucesso (Varek Capturado; +1 Alerta)", badge: "Captura com Sucesso" },
      { id: "VP_fail", target: "VP2", label: "2 Falhas (Varek Escapa; +1 Alerta; Severian ganha +30 PV)", badge: "Fuga de Varek" }
    ]
  },

  "VP1": {
    id: "VP1",
    act: 2,
    title: "Varek Capturado na Escadaria (+1 Alerta)",
    type: "outcome",
    summary: "Captura Varek e preserva a Máscara intacta; barulho eleva Alerta em +1.",
    effects: {
      alertLevelDelta: 1,
      npcStatus: { varek: "capturado" },
      resources: { mascaraVarek: true, contratoSeverian: true },
      log: "Varek capturado na escadaria (+1 Alerta). Máscara recuperada."
    },
    nextDecision: "VC",
    options: [{ id: "VP1_to_VC", target: "VC", label: "Definir o destino de Varek" }]
  },

  "VP2": {
    id: "VP2",
    act: 2,
    title: "Varek Escapa para a Capela (+1 Alerta, Severian +30 PV)",
    type: "outcome",
    summary: "Varek escapa; Severian avisado ganha 30 PV temporários.",
    effects: {
      alertLevelDelta: 1,
      severianBonusPV: 30,
      npcStatus: { varek: "fugiu" },
      resources: { contratoSeverian: true },
      log: "Varek alcançou Severian (+1 Alerta, Severian recebe 30 PV temporários)."
    },
    nextDecision: "INF_CONTRATO",
    options: [{ id: "VP2_to_INF", target: "INF_CONTRATO", label: "Avançar até a cela de Cassandra" }]
  },

  "VB_DECISAO": {
    id: "VB_DECISAO",
    act: 2,
    title: "Disparo de Interceptação contra Varek",
    type: "choice",
    summary: "Teste de Pontaria ou Magia de controle.",
    options: [
      {
        id: "VB_sim",
        target: "VB1_SUCESSO",
        label: "Disparo certeiro / Magia atinge em cheio (Fuga impedida)",
        badge: "Alvo Abatido",
        effects: {
          npcStatus: { varek: "capturado" },
          resources: { mascaraVarek: true, contratoSeverian: true },
          log: "Varek foi abatido à distância."
        }
      },
      { id: "VB_nao", target: "VP_CHALLENGE", label: "Disparo erra (Entrar em perseguição)", badge: "Iniciar Perseguição" }
    ]
  },

  "VB1_SUCESSO": {
    id: "VB1_SUCESSO",
    act: 2,
    title: "Varek Derrubado à Distância",
    type: "outcome",
    summary: "Fuga impedida com sucesso.",
    nextDecision: "VC",
    options: [{ id: "VB1_to_VC", target: "VC", label: "Definir o destino de Varek" }]
  },

  "VE1_CASSANDRA": {
    id: "VE1_CASSANDRA",
    act: 2,
    title: "Foco no Resgate Imediato",
    type: "outcome",
    summary: "Sem atrasos com perseguições; o grupo foca na cela de Cassandra.",
    nextDecision: "INF_CONTRATO",
    options: [{ id: "VE1_to_INF", target: "INF_CONTRATO", label: "Avançar até a cela de Cassandra" }]
  },

  "DT1_TESTEMUNHA": {
    id: "DT1_TESTEMUNHA",
    act: 2,
    title: "Varek Preservado como Testemunha",
    type: "outcome",
    summary: "Varek está imobilizado e suas declarações comprovam os crimes de Severian.",
    nextDecision: "INF_CONTRATO",
    options: [{ id: "DT1_to_INF", target: "INF_CONTRATO", label: "Avançar até a cela de Cassandra" }]
  },

  "DT2_EXECUCAO": {
    id: "DT2_EXECUCAO",
    act: 2,
    title: "Execução de Varek",
    type: "outcome",
    summary: "Sem testemunha viva; Severian não recebe alerta adicional.",
    nextDecision: "INF_CONTRATO",
    options: [{ id: "DT2_to_INF", target: "INF_CONTRATO", label: "Avançar até a cela de Cassandra" }]
  },

  "INF_CONTRATO": {
    id: "INF_CONTRATO",
    act: 2,
    title: "Revelações do Contrato e a Situação de Toma",
    type: "choice",
    summary: "O contrato encontrado revela os detalhes do ritual. A situação de Toma altera a ajuda de Mara.",
    options: [
      { id: "TM_salvo", target: "TM1_SALVO", label: "Toma foi Salvo em Greywick (Mara concede -1 Alerta ou +2 na cela)", badge: "Toma Salvo", condition: "toma_salvo" },
      { id: "TM_deixado", target: "TM2_DEIXADO", label: "Toma foi deixado em Greywick (Sem bônus; relação ferida)", badge: "Toma Deixado", condition: "toma_deixado" },
      { id: "TM_estrada", target: "TM3_ESTRADA", label: "Rota da Estrada Real (Situação aberta)", badge: "Estrada Real", condition: "toma_estrada" }
    ]
  },

  "TM1_SALVO": {
    id: "TM1_SALVO",
    act: 2,
    title: "A Gratidão de Mara (-1 Alerta ou +2 na Abertura)",
    type: "outcome",
    summary: "Mara fornece as frequências do lacre arcano.",
    effects: {
      alertLevelDelta: -1,
      log: "Mara concedeu orientações sobre a cela (-1 Alerta e +2 no teste de abertura)."
    },
    nextDecision: "AU_PROVA",
    options: [{ id: "TM1_to_AU", target: "AU_PROVA", label: "Aproximar-se da Cela de Cassandra" }]
  },

  "TM2_DEIXADO": {
    id: "TM2_DEIXADO",
    act: 2,
    title: "O Lamento de Mara",
    type: "outcome",
    summary: "Sem bônus; Mara está angustiada por Toma.",
    nextDecision: "AU_PROVA",
    options: [{ id: "TM2_to_AU", target: "AU_PROVA", label: "Aproximar-se da Cela de Cassandra" }]
  },

  "TM3_ESTRADA": {
    id: "TM3_ESTRADA",
    act: 2,
    title: "Destino em Aberto de Toma",
    type: "outcome",
    summary: "Mara roga a Cael para que resgate o menino.",
    nextDecision: "AU_PROVA",
    options: [{ id: "TM3_to_AU", target: "AU_PROVA", label: "Aproximar-se da Cela de Cassandra" }]
  },

  "AU_PROVA": {
    id: "AU_PROVA",
    act: 2,
    title: "Diante da Cela: A Prova do Resgate",
    type: "choice",
    summary: "Cassandra exige uma prova de que o resgate é real.",
    options: [
      { id: "AU_prova_aprovada", target: "FG_VERIFICA", label: "Apresentar a carta de Helena, o sinete ou palavra de honra", badge: "Prova Aceita" }
    ]
  },

  "FG_VERIFICA": {
    id: "FG_VERIFICA",
    act: 2,
    title: "Como abrir a Cela de Contenção de Cassandra?",
    type: "choice",
    summary: "Verificar se a Fagulha Arcana foi guardada no Ato I ou usar método mecânico.",
    options: [
      { id: "FG_com_fagulha", target: "O1_FAGULHA", label: "Usar a Fagulha Arcana guardada (Abre instantaneamente por Desejo!)", badge: "Fagulha Guardada (Instantâneo)", condition: "fagulha_guardada" },
      { id: "FG_sem_fagulha", target: "OM_METODOS", label: "Não possui fagulha guardada: Escolher método de abertura", badge: "Métodos Convencionais" }
    ]
  },

  "O1_FAGULHA": {
    id: "O1_FAGULHA",
    act: 2,
    title: "Libertação Instantânea pela Fagulha Arcana",
    type: "outcome",
    summary: "A fagulha guardada desfaz a cela num lampejo de luz pura sem emitir alarme!",
    effects: {
      npcStatus: { cassandra: "resgatada_livre" },
      log: "A Fagulha Arcana abriu a cela instantaneamente sem ruído ou testes!"
    },
    nextDecision: "LA_CHECK",
    options: [{ id: "O1_to_LA", target: "LA_CHECK", label: "Verificar integridade dos lacres de segurança" }]
  },

  "OM_METODOS": {
    id: "OM_METODOS",
    act: 2,
    title: "Métodos de Abertura da Cela",
    type: "choice",
    summary: "Escolha como destrancar a cela de ferro estelar.",
    options: [
      { id: "OM_ladinagem", target: "O2_LADINAGEM", label: "Ladinagem e Desarme Mágico (3S/2F; cada falha dá +1 Alerta)", badge: "Ladinagem 3/2" },
      { id: "OM_forca", target: "O3_FORCA", label: "Força Bruta Extrema (Atletismo CD 30)", badge: "Atletismo CD 30" },
      { id: "OM_condutor", target: "O4_CONDUTOR", label: "Destruir o Condutor Arcano (30 PV; causa 3d6 essência)", badge: "Dano Condutor 30 PV" },
      { id: "OM_desejo", target: "O5_DESEJO", label: "Sintonia de Desejo (Magia de Cassandra com grupo)", badge: "Conexão Arcana" }
    ]
  },

  "O2_LADINAGEM": {
    id: "O2_LADINAGEM",
    act: 2,
    title: "Desarme da Cela via Ladinagem",
    type: "challenge",
    summary: "3 sucessos antes de 2 falhas. Cada falha adiciona +1 ao Alerta.",
    challengeConfig: {
      title: "Desarme da Fechadura Estelar",
      type: "extended_test",
      targetSuccesses: 3,
      maxFailures: 2,
      skills: [
        { name: "Ladinagem", cd: 20, desc: "Manipular cilindros magnéticos." },
        { name: "Misticismo", cd: 20, desc: "Estabilizar o fluxo arcano." },
        { name: "Ofício (Engenharia)", cd: 19, desc: "Desconectar fios condutores na ordem certa." }
      ],
      successOutcome: "LA_CHECK",
      failureOutcome: "LA_CHECK"
    },
    options: [
      {
        id: "O2_win",
        target: "LA_CHECK",
        label: "Sucesso na abertura da cela",
        badge: "Cela Destrancada",
        effects: { npcStatus: { cassandra: "resgatada_livre" }, log: "Fechadura da cela desarmada com perícia técnica." }
      }
    ]
  },

  "O3_FORCA": {
    id: "O3_FORCA",
    act: 2,
    title: "Arrombamento por Força Bruta (Atletismo CD 30)",
    type: "outcome",
    summary: "Grades entortadas com esforço titânico (+1 Alerta).",
    effects: {
      npcStatus: { cassandra: "resgatada_livre" },
      alertLevelDelta: 1,
      log: "Grades arrombadas na força bruta (Atletismo CD 30; +1 Alerta)."
    },
    nextDecision: "LA_CHECK",
    options: [{ id: "O3_to_LA", target: "LA_CHECK", label: "Verificar lacres" }]
  },

  "O4_CONDUTOR": {
    id: "O4_CONDUTOR",
    act: 2,
    title: "Condutor Rompido (Explosão 3d6 Essência)",
    type: "outcome",
    summary: "30 PV causados ao condutor; explosão causa 3d6 de essência aos adjacentes.",
    effects: {
      npcStatus: { cassandra: "resgatada_livre" },
      alertLevelDelta: 1,
      log: "Condutor arcano destruído com 30 PV de dano (Explosão causou 3d6 essência; +1 Alerta)."
    },
    nextDecision: "LA_CHECK",
    options: [{ id: "O4_to_LA", target: "LA_CHECK", label: "Verificar lacres" }]
  },

  "O5_DESEJO": {
    id: "O5_DESEJO",
    act: 2,
    title: "Sintonia Mágica Conjunta",
    type: "outcome",
    summary: "Cassandra canalizou o desejo conjunto e desfez o lacre.",
    effects: {
      npcStatus: { cassandra: "resgatada_livre" },
      log: "Sintonia arcana bem-sucedida: Cassandra canalizou o desejo e desfez o lacre."
    },
    nextDecision: "LA_CHECK",
    options: [{ id: "O5_to_LA", target: "LA_CHECK", label: "Verificar lacres" }]
  },

  "LA_CHECK": {
    id: "LA_CHECK",
    act: 2,
    title: "Verificação dos Protocolos de Alerta",
    type: "choice",
    summary: "Se o Nível de Alerta estiver em 5 ou mais, o Segundo Lacre de Emergência está ativo.",
    options: [
      { id: "LA_alto", target: "LA1_SEGUNDO_LACRE", label: "Nível de Alerta é 5 ou mais (Segundo Lacre Ativado)", badge: "Alerta >= 5", condition: "alerta_5_ou_mais" },
      { id: "LA_baixo", target: "RES_INTEGRA", label: "Nível de Alerta é 4 ou menos (Sem segundo lacre)", badge: "Alerta Seguro" }
    ]
  },

  "LA1_SEGUNDO_LACRE": {
    id: "LA1_SEGUNDO_LACRE",
    act: 2,
    title: "Alerta Crítico: Segundo Lacre Ativado!",
    type: "outcome",
    summary: "Segundo lacre exige 1 ação padrão extra de outro personagem.",
    effects: { log: "Alerta atingiu 5+: Segundo lacre exigiu uma ação padrão extra de outro herói." },
    nextDecision: "RES_INTEGRA",
    options: [{ id: "LA1_to_RES", target: "RES_INTEGRA", label: "Desarmar segundo lacre e integrar Cassandra" }]
  },

  "RES_INTEGRA": {
    id: "RES_INTEGRA",
    act: 2,
    title: "Cassandra Integra o Grupo!",
    type: "outcome",
    summary: "Cassandra luta ao lado do grupo com magias de suporte e Desejos Arcanos.",
    narration: "Cassandra se coloca de pé: 'Obrigada. Mas meu pai, Aldren... Severian o arrastou para a Capela. Não sairei sem ele!'",
    effects: {
      npcStatus: { cassandra: "resgatada_livre" },
      log: "Cassandra Crane libertada e integrada ao grupo como combatente/aliada!"
    },
    nextDecision: "RR_ROTA",
    options: [
      { id: "RR_capela", target: "RA_CAPELA", label: "Avançar até a Capela Ancestral para resgatar Aldren", badge: "Resgate de Aldren (4 Pilonos)" },
      { id: "RR_saida", target: "RB_SAIDA", label: "Correr direto para a Ponte de Saída (Aldren na retaguarda)", badge: "Fuga Rápida (3 Pilonos)" }
    ]
  },

  "RA_CAPELA": {
    id: "RA_CAPELA",
    act: 2,
    title: "Rota da Capela: O Altar dos Crane",
    type: "choice",
    summary: "4 Pilonos ativos; galeria superior oferece posição elevada e possível rodada surpresa.",
    effects: {
      routeChoiceAct2: "aldren_capela",
      pilonosDestruidos: 0,
      log: "Rota escolhida: Capela Ancestral. 4 pilonos rituais ativos com vantagem de altura."
    },
    options: [
      { id: "AL_sim", target: "AL1_GUARDAO", label: "Libertar Aldren no início (Guardião Veterano: +3 Defesa para Cassandra)", badge: "Aldren Guardião (+3 Defesa)" },
      { id: "AL_nao", target: "AL2_SEM_BONUS", label: "Focar ataque direto em Severian sem libertar Aldren logo", badge: "Ataque Frontal" }
    ]
  },

  "RB_SAIDA": {
    id: "RB_SAIDA",
    act: 2,
    title: "Rota da Saída: A Ponte Levadiça",
    type: "outcome",
    summary: "3 Pilonos ativos; concede +1 sucesso automático na fuga do Ato III.",
    effects: {
      routeChoiceAct2: "saida_ponte",
      pilonosDestruidos: 0,
      log: "Rota escolhida: Saída pela Ponte. 3 pilonos rituais ativos. +1 sucesso inicial na fuga do Ato III."
    },
    nextDecision: "CR_CONFRONTO",
    options: [{ id: "RB_to_CR", target: "CR_CONFRONTO", label: "Confrontar Severian na Ponte" }]
  },

  "AL1_GUARDAO": {
    id: "AL1_GUARDAO",
    act: 2,
    title: "Aldren Libertado: Guardião Veterano",
    type: "outcome",
    summary: "Aldren assume postura de Guardião (+3 Defesa e cobertura de ataques para Cassandra).",
    effects: {
      npcStatus: { aldren: "guardiao_veterano" },
      log: "Aldren libertado: Atua como Guardião Veterano (+3 na Defesa de Cassandra)."
    },
    nextDecision: "CR_CONFRONTO",
    options: [{ id: "AL1_to_CR", target: "CR_CONFRONTO", label: "Confronto moral com Severian" }]
  },

  "AL2_SEM_BONUS": {
    id: "AL2_SEM_BONUS",
    act: 2,
    title: "Ataque sem Libertação Prévia de Aldren",
    type: "outcome",
    summary: "Aldren permanece preso durante a 1ª fase; sem bônus de parceiro.",
    effects: {
      npcStatus: { aldren: "ferido" },
      log: "Aldren permaneceu acorrentado no início da batalha."
    },
    nextDecision: "CR_CONFRONTO",
    options: [{ id: "AL2_to_CR", target: "CR_CONFRONTO", label: "Confronto moral com Severian" }]
  },

  "CR_CONFRONTO": {
    id: "CR_CONFRONTO",
    act: 2,
    title: "O Confronto Moral com Severian",
    type: "choice",
    summary: "Antes de soar a iniciativa final, Cassandra ou aliados podem desafiar o inquisidor.",
    options: [
      { id: "CR_cassandra_sim", target: "CT_CASSANDRA_TESTE", label: "Cassandra confronta Severian diretamente (Vontade/Diplomacia CD 22)", badge: "Confronto de Cassandra (CD 22)" },
      { id: "CR_aliados", target: "CS_ALIADOS", label: "Sandro ou Seraphine respondem às provocações", badge: "Discurso Aliado" },
      { id: "CR_direto", target: "CS2_DIRETO", label: "Atacar sem palavras (Combate imediato)", badge: "Iniciativa Direta" }
    ]
  },

  "CT_CASSANDRA_TESTE": {
    id: "CT_CASSANDRA_TESTE",
    act: 2,
    title: "O Teste de Vontade de Cassandra (CD 22)",
    type: "challenge",
    summary: "Se tiver 'Determinação Familiar', Cassandra recebe +2 no teste de CD 22.",
    options: [
      {
        id: "CT_sucesso",
        target: "CT1_SUCESSO",
        label: "Sucesso (CD 22): Um pilono racha; Severian vulnerável e sem reações na 1ª rodada",
        badge: "Sucesso Crítico de Cassandra",
        effects: {
          pilonosDestruidos: 1,
          log: "Cassandra abalou o ritual (CD 22 vencida): 1 pilono rachou e Severian vulnerável na 1ª rodada!"
        }
      },
      { id: "CT_falha", target: "CT2_FALHA", label: "Falha no Teste: Severian mantém o controle", badge: "Combate Padrão" }
    ]
  },

  "CT1_SUCESSO": {
    id: "CT1_SUCESSO",
    act: 2,
    title: "Vontade Inabalável de Cassandra",
    type: "outcome",
    summary: "Um pilono sofre 20 de dano automático; Severian sem reações na 1ª rodada.",
    nextDecision: "BOSS_SEVERIAN",
    options: [{ id: "CT1_to_BOSS", target: "BOSS_SEVERIAN", label: "Iniciar Batalha Final contra Severian" }]
  },

  "CT2_FALHA": {
    id: "CT2_FALHA",
    act: 2,
    title: "Severian Mantém a Postura",
    type: "outcome",
    summary: "Combate começa sem aberturas adicionais.",
    nextDecision: "BOSS_SEVERIAN",
    options: [{ id: "CT2_to_BOSS", target: "BOSS_SEVERIAN", label: "Iniciar Batalha Final contra Severian" }]
  },

  "CS_ALIADOS": {
    id: "CS_ALIADOS",
    act: 2,
    title: "Inspiração dos Companheiros",
    type: "outcome",
    summary: "Discurso inspirador concede +2 no primeiro teste aliado contra um pilono.",
    effects: {
      groupConditions: { modificadorKhorcova: 2 },
      log: "Discurso dos aliados concede +2 no primeiro teste contra os pilonos."
    },
    nextDecision: "BOSS_SEVERIAN",
    options: [{ id: "CS_to_BOSS", target: "BOSS_SEVERIAN", label: "Iniciar Batalha Final contra Severian" }]
  },

  "CS2_DIRETO": {
    id: "CS2_DIRETO",
    act: 2,
    title: "Ataque Silencioso e Fulminante",
    type: "outcome",
    summary: "Combate começa sem modificadores de diálogo.",
    nextDecision: "BOSS_SEVERIAN",
    options: [{ id: "CS2_to_BOSS", target: "BOSS_SEVERIAN", label: "Iniciar Batalha Final contra Severian" }]
  },

  "BOSS_SEVERIAN": {
    id: "BOSS_SEVERIAN",
    act: 2,
    title: "Batalha do Clímax: Severian & Os Pilonos de Khorcova",
    type: "boss_fight",
    summary: "Gerencie o combate contra Severian (PV 150 + Bônus), os Pilonos Arcanos (RD 10, PV 30 cada), Inversão de Runas e Desejos.",
    bossConfig: {
      name: "Inquisidor-Mor Severian",
      basePV: 150,
      defesa: 28,
      mecanicas: [
        "Pilonos Arcanos: Cada pilono ativo concede RD 5 e regeneração de 10 PV por turno.",
        "Inverter Runas: Teste Misticismo/Ladinagem CD 20 rebate o raio em Severian (4d8 de dano).",
        "Romper Suporte: Atletismo CD 22 ou 30 de dano destrói o pilono.",
        "Desejos de Cassandra: Cassandra concede +4 de ataque ou sobrecarrega um pilono.",
        "Libertar Aldren: Atletismo/Ladinagem CD 18 o liberta para a luta."
      ]
    },
    options: [
      {
        id: "SO_vivo",
        target: "SO1_VIVO",
        label: "Severian é derrotado e capturado com vida (Confissão)",
        badge: "Severian Vivo (Confissão)",
        effects: {
          resources: { confissaoSeverian: true, contratoSeverian: true },
          log: "Severian foi derrotado e mantido vivo. Ele confessa que a acusação de traição aos Crane era pura farsa."
        }
      },
      {
        id: "SO_morto",
        target: "SO2_MORTO",
        label: "Severian é morto em combate",
        badge: "Severian Morto",
        effects: {
          resources: { contratoSeverian: true },
          log: "Severian foi morto. Os documentos em seu corpo revelam a mesma verdade do ritual."
        }
      }
    ]
  },

  "SO1_VIVO": {
    id: "SO1_VIVO",
    act: 2,
    title: "A Confissão de Severian",
    type: "outcome",
    summary: "Severian confessa que a acusação de traição aos Crane era terror psicológico.",
    nextDecision: "VER_VERDADE",
    options: [{ id: "SO1_to_VER", target: "VER_VERDADE", label: "Ouvir A Verdade dos Crane" }]
  },

  "SO2_MORTO": {
    id: "SO2_MORTO",
    act: 2,
    title: "A Morte de Severian e as Ordens Lacradas",
    type: "outcome",
    summary: "As cartas lacradas comprovam a inocência dos Crane.",
    nextDecision: "VER_VERDADE",
    options: [{ id: "SO2_to_VER", target: "VER_VERDADE", label: "Ouvir A Verdade dos Crane" }]
  },

  // ==========================================
  // ATO III: A VERDADE & A FUGA DA ASCENSÃO
  // ==========================================
  "VER_VERDADE": {
    id: "VER_VERDADE",
    act: 3,
    title: "A Verdade dos Crane: A Revelação do Passado",
    type: "choice",
    summary: "Como Cassandra deseja receber a verdade sobre o passado de sua família e os segredos de Aldren?",
    options: [
      { id: "C_ouvir", target: "C1_OUVIR", label: "Ouvir a confissão direta de Aldren", badge: "Confissão de Aldren" },
      { id: "C_ler", target: "C2_LER", label: "Ler os registros objetivos de Helena ou Seraphine", badge: "Registros Oficiais" },
      { id: "C_adiar", target: "C3_ADIAR", label: "Adiar a conversa (Silêncio respeitoso)", badge: "Silêncio Respeitoso" },
      { id: "C_recusar", target: "C4_RECUSAR", label: "Recusar justificativas (Provas materiais bastam)", badge: "Foco nas Provas" }
    ]
  },

  "C1_OUVIR": {
    id: "C1_OUVIR",
    act: 3,
    title: "A Confissão Emocionante de Aldren",
    type: "outcome",
    summary: "Aldren revela que suportou a desonra para proteger Cassandra.",
    nextDecision: "E_NOME",
    options: [{ id: "C1_to_E", target: "E_NOME", label: "Cassandra define o que a verdade significa" }]
  },

  "C2_LER": {
    id: "C2_LER",
    act: 3,
    title: "A Verdade dos Registros Oficiais",
    type: "outcome",
    summary: "Os documentos provam a lealdade da linhagem Crane à justiça.",
    nextDecision: "E_NOME",
    options: [{ id: "C2_to_E", target: "E_NOME", label: "Cassandra define o que a verdade significa" }]
  },

  "C3_ADIAR": {
    id: "C3_ADIAR",
    act: 3,
    title: "O Silêncio de Aldren",
    type: "outcome",
    summary: "Nenhuma cobrança; Aldren caminha ao lado da filha.",
    nextDecision: "E_NOME",
    options: [{ id: "C3_to_E", target: "E_NOME", label: "Cassandra define o que a verdade significa" }]
  },

  "C4_RECUSAR": {
    id: "C4_RECUSAR",
    act: 3,
    title: "A Autonomia de Cassandra",
    type: "outcome",
    summary: "Cassandra reconhece as provas materiais do resgate.",
    nextDecision: "E_NOME",
    options: [{ id: "C4_to_E", target: "E_NOME", label: "Cassandra define o que a verdade significa" }]
  },

  "E_NOME": {
    id: "E_NOME",
    act: 3,
    title: "O Despertar: Nome Escolhido",
    type: "outcome",
    summary: "Ao assumir sua verdade, Cassandra conquista a habilidade 'Nome Escolhido'.",
    effects: {
      resources: { nomeEscolhido: true },
      npcStatus: { cassandra: "nome_escolhido" },
      log: "Cassandra despertou o 'Nome Escolhido': Poder definitivo de autodeterminação liberado!"
    },
    nextDecision: "A_ASCENSAO",
    options: [{ id: "E_to_A", target: "A_ASCENSAO", label: "Presenciar o início da Ascensão Profana" }]
  },

  "A_ASCENSAO": {
    id: "A_ASCENSAO",
    act: 3,
    title: "O Cataclismo: A Ascensão Profana de Ferren Começa!",
    type: "choice",
    summary: "O céu sobre Milothiann se abre em um vórtice carmesim. Ferren manifesta sua forma titânica (Escala S).",
    narration: "A terra racha. Um rugido faz as torres desabarem. Do vórtice, Ferren flutua em correntes de fogo sombrio e mil olhos que tudo veem.",
    options: [
      { id: "F_atacar", target: "F1_ESCALA_S", label: "Alguém do grupo tenta desferir um ataque contra Ferren!", badge: "Demonstração Escala S" },
      { id: "F_fugir", target: "R_TRANSFORMA", label: "O grupo reconhece a escala colossal e foca na sobrevivência", badge: "Foco na Evacuação" }
    ]
  },

  "F1_ESCALA_S": {
    id: "F1_ESCALA_S",
    act: 3,
    title: "A Demonstração da Escala S",
    type: "outcome",
    summary: "O ataque para no ar a 50m de Ferren e se decompõe em cinzas podres.",
    effects: { log: "Ataque contra Ferren se decompôs no ar: Demonstração de Escala S." },
    nextDecision: "R_TRANSFORMA",
    options: [{ id: "F1_to_R", target: "R_TRANSFORMA", label: "Correr pelos escombros da cidade" }]
  },

  "R_TRANSFORMA": {
    id: "R_TRANSFORMA",
    act: 3,
    title: "A Cidade em Colapso",
    type: "choice",
    summary: "Milothiann está ruindo. Cassandra tem um último diálogo com Aldren.",
    options: [
      { id: "CS_responder", target: "CS1_ACEITA", label: "Cassandra responde com afeto, toca o pai ou aceita o sinete", badge: "Aproximação Emocional" },
      { id: "CS_recusar", target: "CS2_DISTANCIA", label: "Cassandra recusa o anel ou mantém distância respeitosa", badge: "Distância Mantida" },
      { id: "CS_adiar", target: "CS3_NEUTRO", label: "Adiar qualquer resposta (Nenhuma reconciliação forçada)", badge: "Resposta em Aberto" }
    ]
  },

  "CS1_ACEITA": {
    id: "CS1_ACEITA",
    act: 3,
    title: "Laço Familiar Reafirmado",
    type: "outcome",
    summary: "Aldren renova suas forças para proteger a filha.",
    nextDecision: "IN_INSTRUCOES",
    options: [{ id: "CS1_to_IN", target: "IN_INSTRUCOES", label: "Chegar à Alavanca do Arco de Fuga" }]
  },

  "CS2_DISTANCIA": {
    id: "CS2_DISTANCIA",
    act: 3,
    title: "Respeito e Autonomia",
    type: "outcome",
    summary: "Aldren assume a retaguarda com sua espada.",
    nextDecision: "IN_INSTRUCOES",
    options: [{ id: "CS2_to_IN", target: "IN_INSTRUCOES", label: "Chegar à Alavanca do Arco de Fuga" }]
  },

  "CS3_NEUTRO": {
    id: "CS3_NEUTRO",
    act: 3,
    title: "Foco na Travessia",
    type: "outcome",
    summary: "Os dois correm lado a lado.",
    nextDecision: "IN_INSTRUCOES",
    options: [{ id: "CS3_to_IN", target: "IN_INSTRUCOES", label: "Chegar à Alavanca do Arco de Fuga" }]
  },

  "IN_INSTRUCOES": {
    id: "IN_INSTRUCOES",
    act: 3,
    title: "As Instruções de Fuga de Aldren",
    type: "choice",
    summary: "Alguém do grupo para para escutar as coordenadas secretas da passagem?",
    options: [
      {
        id: "IN_sim",
        target: "IN1_BONUS",
        label: "Ouvir com atenção as instruções (+2 no primeiro teste da fuga)",
        badge: "+2 no 1º Teste da Fuga",
        effects: {
          groupConditions: { modificadorViagem: 2 },
          log: "Instruções de Aldren assimiladas: +2 no primeiro teste de Fuga."
        }
      },
      { id: "IN_nao", target: "IN2_SEM_BONUS", label: "Correr sem parar para ouvir (Fuga sem bônus)", badge: "Corrida Desesperada" }
    ]
  },

  "IN1_BONUS": {
    id: "IN1_BONUS",
    act: 3,
    title: "Coordenadas Gravadas",
    type: "outcome",
    summary: "O grupo ganha +2 no primeiro teste da fuga.",
    nextDecision: "H_ALAVANCA",
    options: [{ id: "IN1_to_H", target: "H_ALAVANCA", label: "O Dilema da Alavanca do Arco" }]
  },

  "IN2_SEM_BONUS": {
    id: "IN2_SEM_BONUS",
    act: 3,
    title: "Fuga no Impulso",
    type: "outcome",
    summary: "O grupo corre sem orientações prévias.",
    nextDecision: "H_ALAVANCA",
    options: [{ id: "IN2_to_H", target: "H_ALAVANCA", label: "O Dilema da Alavanca do Arco" }]
  },

  "H_ALAVANCA": {
    id: "H_ALAVANCA",
    act: 3,
    title: "O Sacrifício do Arco: Quem mantém a Alavanca?",
    type: "choice",
    summary: "O Arco de Evacuação só permanece aberto enquanto alguém segurar manualmente a alavanca sob a horda dos mortos.",
    options: [
      { id: "H_aldren", target: "H1_ALDREN_SACRIFICIO", label: "Aldren assume a alavanca ('Vão! Cuidem da minha filha!')", badge: "Sacrifício de Aldren" },
      { id: "H_voluntario", target: "H2_OUTRO_SACRIFICIO", label: "Outro personagem ou herói assume o lugar na alavanca", badge: "Sacrifício Heroico Voluntário" },
      { id: "H_ninguem", target: "H3_DERROTA", label: "Ninguém assume a alavanca e todos tentam pular ao mesmo tempo", badge: "Risco Catastrófico" }
    ]
  },

  "H1_ALDREN_SACRIFICIO": {
    id: "H1_ALDREN_SACRIFICIO",
    act: 3,
    title: "O Sacrifício de Aldren Crane",
    type: "choice",
    summary: "Aldren segura a alavanca com todo o peso do seu corpo.",
    options: [
      {
        id: "HR_morte",
        target: "EX_FUGA",
        label: "A mesa aceita morte definitiva heroica (Aldren morre honrado)",
        badge: "Morte Definitiva Heroica",
        effects: {
          npcStatus: { aldren: "sacrificio_morte" },
          log: "Aldren realizou o sacrifício supremo: Morte heroica definitiva segurando o portal."
        }
      },
      {
        id: "HR_retornado",
        target: "EX_FUGA",
        label: "Primeiro Retornado (Aldren continua perdido no vórtice, mas contém os mortos)",
        badge: "O Primeiro Retornado",
        effects: {
          npcStatus: { aldren: "primeiro_retornado" },
          log: "Aldren tornou-se o 'Primeiro Retornado': Uma lenda viva contendo os mortos."
        }
      }
    ]
  },

  "H2_OUTRO_SACRIFICIO": {
    id: "H2_OUTRO_SACRIFICIO",
    act: 3,
    title: "Sacrifício de um Aliado Voluntário",
    type: "outcome",
    summary: "O voluntário segura o arco até o final e Aldren é resgatado.",
    effects: {
      npcStatus: { aldren: "resgatado_com_vida" },
      log: "Um companheiro voluntário segurou a alavanca. Aldren foi salvo e cruza o portal."
    },
    nextDecision: "EX_FUGA",
    options: [{ id: "H2_to_EX", target: "EX_FUGA", label: "Iniciar o Desafio Estendido de Fuga" }]
  },

  "H3_DERROTA": {
    id: "H3_DERROTA",
    act: 3,
    title: "Colapso do Arco: Tragédia",
    type: "outcome",
    summary: "O arco rúnico desmorona sobre centenas de fugitivos (+3 Alerta, dreno de PM).",
    effects: {
      alertLevelDelta: 3,
      groupConditions: { pmPerdidosTotal: 5 },
      log: "Ninguém segurou a alavanca: O arco desabou causando uma catástrofe."
    },
    nextDecision: "EX_FUGA",
    options: [{ id: "H3_to_EX", target: "EX_FUGA", label: "Tentar escapar pelos escombros do portal" }]
  },

  "EX_FUGA": {
    id: "EX_FUGA",
    act: 3,
    title: "Desafio Estendido: A Fuga da Ascensão Profana",
    type: "challenge",
    summary: "7 sucessos antes de 3 falhas. Modificadores acumulados ao longo da campanha!",
    challengeConfig: {
      title: "Travessia do Apocalipse de Milothiann",
      type: "extended_test",
      targetSuccesses: 7,
      maxFailures: 3,
      bonusCondition: "Modificadores: Rota da Saída (+1 Sucesso Inicial); Sais de Proteção (anulam falhas de dano); Máscara de Varek (+2 em Enganação/Intimidação); Nome Escolhido (+2 em qualquer teste de Cassandra). Rota da Capela: 1ª falha causa +1d6 trevas.",
      skills: [
        { name: "Atletismo / Pilotagem", cd: 20, desc: "Manter a carroça e cavalos desviando de crateras." },
        { name: "Sobrevivência", cd: 19, desc: "Encontrar rotas de ar respirável." },
        { name: "Fortitude", cd: 20, desc: "Resistir à onda de calor profano e tempestade de cinzas." },
        { name: "Misticismo / Vontade", cd: 20, desc: "Criar escudos contra raios e manter a sanidade." },
        { name: "Iniciativa / Acrobacia", cd: 19, desc: "Reagir a escombros em queda livre." }
      ],
      successOutcome: "ES_PERFEITO",
      failureOutcome: "EC_CUSTO"
    },
    options: [
      { id: "EX_win", target: "ES_PERFEITO", label: "Sucesso na Fuga (7 sucessos antes de 3 falhas)", badge: "Fuga Perfeita" },
      { id: "EX_fail", target: "EC_CUSTO", label: "3 Falhas atingidas (Escolha de Custo Dramático)", badge: "Custo Dramático" }
    ]
  },

  "ES_PERFEITO": {
    id: "ES_PERFEITO",
    act: 3,
    title: "Fuga Perfeita: Além do Horizonte de Cinzas",
    type: "outcome",
    summary: "Todos os heróis e refugiados atravessam em segurança com recursos preservados!",
    effects: { log: "Fuga da Ascensão completada com 7 sucessos perfeitos! Recursos e provas 100% preservados." },
    nextDecision: "T_TOMA_CHECK",
    options: [{ id: "ES_to_T", target: "T_TOMA_CHECK", label: "Verificar o desfecho de Toma e Mara" }]
  },

  "EC_CUSTO": {
    id: "EC_CUSTO",
    act: 3,
    title: "Fuga no Limite: A Escolha de um Custo",
    type: "choice",
    summary: "O grupo foi alcançado pela onda de choque e precisa escolher um custo inevitável.",
    options: [
      {
        id: "EC_equip",
        target: "EC1_EQUIPAMENTO",
        label: "Equipamento: Abandonar a carroça e equipamentos pesados",
        badge: "Perda Material",
        effects: {
          groupConditions: { carrocaAbandonada: true },
          log: "Custo na Fuga: Carroça e equipamentos pesados abandonados."
        }
      },
      {
        id: "EC_provas",
        target: "EC2_PROVAS",
        label: "Provas: O Livro de Khorcova e provas são queimados no portal",
        badge: "Perda de Provas",
        effects: {
          resources: { livroKhorcova: false },
          log: "Custo na Fuga: O Livro de Khorcova e as provas físicas foram destruídos."
        }
      },
      {
        id: "EC_energia",
        target: "EC3_ENERGIA",
        label: "Energia: Todos perdem 1d4 PM e chegam em exaustão extrema",
        badge: "Dreno Extremo de PM",
        effects: {
          groupConditions: { pmPerdidosTotal: 4 },
          log: "Custo na Fuga: Todos os personagens esgotaram 1d4 PM adicionais e chegam exaustos."
        }
      },
      {
        id: "EC_gancho",
        target: "EC4_CICATRIZ",
        label: "Gancho Narrativo: Cassandra recebe uma cicatriz púrpura da tempestade arcana",
        badge: "Cicatriz Mística (Gancho)",
        effects: {
          groupConditions: { cicatrizPurpura: true },
          log: "Custo na Fuga: Cassandra recebeu uma cicatriz púrpura da tempestade arcana (gancho próxima temporada)."
        }
      }
    ]
  },

  "EC1_EQUIPAMENTO": {
    id: "EC1_EQUIPAMENTO",
    act: 3,
    title: "Custo: Carroça e Carga Perdidas",
    type: "outcome",
    summary: "O grupo cruza a fronteira a pé, sem suprimentos pesados.",
    nextDecision: "T_TOMA_CHECK",
    options: [{ id: "EC1_to_T", target: "T_TOMA_CHECK", label: "Verificar desfecho de Toma" }]
  },

  "EC2_PROVAS": {
    id: "EC2_PROVAS",
    act: 3,
    title: "Custo: Provas de Khorcova Destruídas",
    type: "outcome",
    summary: "As provas físicas se perderam nas cinzas, restando apenas o testemunho oral.",
    nextDecision: "T_TOMA_CHECK",
    options: [{ id: "EC2_to_T", target: "T_TOMA_CHECK", label: "Verificar desfecho de Toma" }]
  },

  "EC3_ENERGIA": {
    id: "EC3_ENERGIA",
    act: 3,
    title: "Custo: Exaustão e Esgotamento de Mana",
    type: "outcome",
    summary: "Heróis chegam completamente drenados de poder arcano.",
    nextDecision: "T_TOMA_CHECK",
    options: [{ id: "EC3_to_T", target: "T_TOMA_CHECK", label: "Verificar desfecho de Toma" }]
  },

  "EC4_CICATRIZ": {
    id: "EC4_CICATRIZ",
    act: 3,
    title: "Custo: A Cicatriz Púrpura de Cassandra",
    type: "outcome",
    summary: "Uma marca luminosa e misteriosa fica gravada no braço de Cassandra.",
    nextDecision: "T_TOMA_CHECK",
    options: [{ id: "EC4_to_T", target: "T_TOMA_CHECK", label: "Verificar desfecho de Toma" }]
  },

  "T_TOMA_CHECK": {
    id: "T_TOMA_CHECK",
    act: 3,
    title: "O Desfecho de Toma e Mara",
    type: "choice",
    summary: "Verificar se Toma foi salvo em Greywick no Ato I.",
    options: [
      { id: "T_foi_salvo", target: "T1_REENCONTRO", label: "Toma foi salvo no Ato I (Toma reencontra Mara em segurança)", badge: "Reencontro Emocionante", condition: "toma_salvo" },
      { id: "T_nao_salvo", target: "T2_PENDENCIA", label: "Toma não foi salvo / ficou para trás (Retorno vira missão)", badge: "Missão Pendente" }
    ]
  },

  "T1_REENCONTRO": {
    id: "T1_REENCONTRO",
    act: 3,
    title: "O Reencontro de Toma e Mara",
    type: "outcome",
    summary: "Toma corre para os braços de Mara em prantos de alívio.",
    effects: { log: "Toma e Mara reunidos com segurança e gratidão inestimável ao grupo." },
    nextDecision: "EP_EPILOGO",
    options: [{ id: "T1_to_EP", target: "EP_EPILOGO", label: "Conduzir o Epílogo de Cassandra" }]
  },

  "T2_PENDENCIA": {
    id: "T2_PENDENCIA",
    act: 3,
    title: "A Promessa de Greywick",
    type: "outcome",
    summary: "Resgatar Toma torna-se a primeira decisão da próxima sessão.",
    effects: { log: "Toma permanece em Greywick: O retorno ao vilarejo será a 1ª decisão da próxima sessão." },
    nextDecision: "EP_EPILOGO",
    options: [{ id: "T2_to_EP", target: "EP_EPILOGO", label: "Conduzir o Epílogo de Cassandra" }]
  },

  "EP_EPILOGO": {
    id: "EP_EPILOGO",
    act: 3,
    title: "Epílogo: A Identidade e o Sinete dos Crane",
    type: "choice",
    summary: "Cassandra define o que significa liberdade, o peso do sobrenome Crane e seu novo rumo.",
    options: [
      {
        id: "SI_guardar",
        target: "SI1_SINETE_PARTIDO",
        label: "Guardar o Sinete Crane Partido como símbolo de linhagem e superação",
        badge: "Sinete Crane Partido",
        effects: {
          resources: { sineteCrane: "partido" },
          log: "Cassandra guardou o Sinete Crane Partido como relíquia de superação."
        }
      },
      {
        id: "SI_recusar",
        target: "SI2_NOVO_SIMBOLO",
        label: "Destruir ou recusar o sinete, adotando um novo símbolo de sua escolha",
        badge: "Novo Símbolo Escolhido",
        effects: {
          resources: { sineteCrane: "substituido" },
          log: "Cassandra forjou um novo símbolo pessoal de liberdade e magia."
        }
      }
    ]
  },

  "SI1_SINETE_PARTIDO": {
    id: "SI1_SINETE_PARTIDO",
    act: 3,
    title: "O Sinete Crane Partido",
    type: "end",
    summary: "Cassandra fecha a mão sobre o ouro partido. A honra foi restaurada nos seus termos.",
    nextDecision: "END_FINAL",
    options: [{ id: "SI1_to_END", target: "END_FINAL", label: "Encerrar a Sessão com a Palavra de Cassandra" }]
  },

  "SI2_NOVO_SIMBOLO": {
    id: "SI2_NOVO_SIMBOLO",
    act: 3,
    title: "O Novo Símbolo da Liberdade",
    type: "end",
    summary: "Cassandra ergue seu novo amuleto sob a luz do sol.",
    nextDecision: "END_FINAL",
    options: [{ id: "SI2_to_END", target: "END_FINAL", label: "Encerrar a Sessão com a Palavra de Cassandra" }]
  },

  "END_FINAL": {
    id: "END_FINAL",
    act: 3,
    title: "Fim da Sessão: A Palavra de Cassandra",
    type: "end_session",
    summary: "A sessão se encerra com a fala final de Cassandra Crane.",
    narration: "'Milothiann caiu para as trevas... mas enquanto tivermos uns aos outros, nenhuma profecia nos colocará de joelhos novamente.'",
    options: []
  }
};

export const NPC_DATABASE: Record<string, NPCStats> = {
  cassandra: {
    id: "cassandra",
    name: "Cassandra Crane",
    role: "Herdeira da Linhagem Crane / Conjuradora Desperta",
    category: "aliado",
    nd: 8,
    tipo: "Humana, Conjuradora de Essência",
    tamanho: "Médio",
    deslocamento: "9m",
    description: "Jovem nobre dotada de magia espontânea rara ligada à essência cósmica e aos Desejos arcanos. Cativa nas masmorras de Milothiann, ela se recusa a ser sacrificada no ritual de Severian. Conforme a aventura avança, pode despertar todo o legado e determinação da família Crane.",
    atributos: {
      for: 10,
      des: 16,
      con: 14,
      int: 16,
      sab: 14,
      car: 20
    },
    pericias: [
      { nome: "Misticismo", mod: 14 },
      { nome: "Vontade", mod: 13 },
      { nome: "Diplomacia", mod: 16 },
      { nome: "Enganação", mod: 15 },
      { nome: "Iniciativa", mod: 12 },
      { nome: "Conhecimento", mod: 12 },
      { nome: "Percepção", mod: 11 }
    ],
    combatStats: {
      pv: 48,
      pm: 42,
      defesa: 19,
      iniciativa: 12,
      rd: 0,
      sentidos: "Percepção às Cegas (Mana) 9m",
      resistencias: ["+4 em testes contra efeitos de encantamento e ilusão"],
      ataques: [
        {
          nome: "Raio de Essência Pura",
          teste: "Ataque à Distância +14",
          mod: 14,
          dano: "3d6+5",
          tipo: "Essência",
          alcance: "Médio (30m)",
          critico: "19/x2",
          especial: "Ignora qualquer Redução de Dano mundana"
        },
        {
          nome: "Toque Desestabilizador",
          teste: "Ataque Desarmado +11",
          mod: 11,
          dano: "1d4+3 + 2d6",
          tipo: "Impacto + Essência",
          alcance: "Corpo a corpo",
          critico: "x2",
          especial: "Alvo fica Ofuscado por 1 rodada (Fortitude CD 19 evita)"
        }
      ],
      magias: [
        {
          nome: "Desejo Espontâneo",
          custoPM: 3,
          escola: "Transmutação / Encantamento",
          alcance: "Curto (9m)",
          duracao: "Instantânea",
          desc: "Reação: Quando um aliado faz um teste de perícia ou ataque, Cassandra dobra as correntes do destino concedendo +4 no teste ou permitindo rolar novamente."
        },
        {
          nome: "Fagulha da Linhagem Crane",
          custoPM: 2,
          cd: 20,
          escola: "Evocação",
          alcance: "Médio (30m)",
          duracao: "Instantânea",
          desc: "Disparo concentrado que causa 4d6+4 de dano de Essência. Reflexos CD 20 reduz à metade."
        },
        {
          nome: "Escudo do Destino Entalhado",
          custoPM: 2,
          escola: "Abjuração",
          alcance: "Pessoal / Aliado até 9m",
          duracao: "1 cena",
          desc: "Reação: Concede +5 de Defesa e RD 5 contra o próximo ataque que iria atingir o alvo."
        },
        {
          nome: "Inversão de Runas Arcanas",
          custoPM: 4,
          cd: 22,
          escola: "Misticismo Aplicado",
          alcance: "Médio (30m)",
          duracao: "Instantânea",
          desc: "Interfere nos Pilonos Arcanos de Severian, fazendo um raio rebater no Inquisidor-Mor causando 3d10+10 de dano."
        }
      ],
      habilidades: [
        {
          nome: "Determinação Familiar",
          tipoAcao: "Passiva",
          desc: "Se desbloqueada no Ato II/III, Cassandra e aliados a até 9m ganham +2 em testes de Vontade contra medo, coerção e trevas."
        },
        {
          nome: "Elo Protetor com Aldren",
          tipoAcao: "Reação (1 PM)",
          desc: "Se Aldren estiver adjacente a Cassandra, ambos ganham RD 5 e +2 em todos os testes de resistência."
        }
      ]
    },
    equipamentos: [
      "Túnica Cerimonial da Casa Crane (antigas tramas arcanas)",
      "Anel de Sinete Crane (ouro antigo partido ou recomposto)",
      "Pequeno prisma de foco de essência"
    ],
    taticas: "Cassandra atua como suporte arcano tático de alto impacto. Ela usa 'Desejo Espontâneo' para salvar aliados que falharam em testes cruciais e 'Escudo do Destino' para evitar golpes letais. Quando em segurança, dispara Raios de Essência que ignoram a RD dos pilonos.",
    roleplay: {
      personalidade: "Perspicaz, orgulhosa de suas origens, mas profundamente rebelde contra o destino de sacrifício que outros tentaram impor a ela. Não abaixa a cabeça nem diante de inquisidores armados.",
      motivacao: "Libertar-se das maquinações de Severian, salvar seu tio Aldren e decidir seu próprio nome e futuro longe das amarras inquisitoriais.",
      citacao: "'Vocês vieram me resgatar, mas não serei um fardo que se carrega. Se querem me tirar daqui, me dêem espaço para lutar ao lado de vocês.'",
      notasMestre: "Use a voz de Cassandra com firmeza e inteligência. Ela reconhece passagens secretas nos túneis de Milothiann e pode dar pistas sobre o Enigma das Chamas e os Pilonos."
    }
  },

  aldren: {
    id: "aldren",
    name: "Aldren Crane",
    role: "Patriarca Crane / Antigo Cavaleiro Inquisitorial",
    category: "aliado",
    nd: 7,
    tipo: "Humano, Cavaleiro Veterano",
    tamanho: "Médio",
    deslocamento: "9m (6m em armadura pesada)",
    description: "Veterano com rosto marcado por cicatrizes de batalha e olhos pesados de remorso. Antigo comandante que serviu à ordem de Milothiann antes de descobrir que a Inquisição planejava sacrificar Cassandra. Ficou aprisionado na Capela Desconsagrada.",
    atributos: {
      for: 18,
      des: 12,
      con: 18,
      int: 12,
      sab: 14,
      car: 12
    },
    pericias: [
      { nome: "Luta", mod: 15 },
      { nome: "Fortitude", mod: 14 },
      { nome: "Vontade", mod: 11 },
      { nome: "Iniciativa", mod: 8 },
      { nome: "Percepção", mod: 9 },
      { nome: "Guerra", mod: 11 },
      { nome: "Atletismo", mod: 13 }
    ],
    combatStats: {
      pv: 95,
      pm: 20,
      defesa: 25,
      iniciativa: 8,
      rd: 5,
      sentidos: "Visão normal",
      ataques: [
        {
          nome: "Espada Bastarda dos Crane",
          teste: "Luta +15",
          mod: 15,
          dano: "1d10+10 (uma mão) ou 1d12+12 (duas mãos)",
          tipo: "Corte",
          alcance: "Corpo a corpo",
          critico: "19/x2",
          especial: "Ataque Pesado: Permite manobra Derrubar ou Empurrar como ação livre se acertar."
        },
        {
          nome: "Escudo Torre de Aço Inquisitorial",
          teste: "Luta +13",
          mod: 13,
          dano: "1d6+8",
          tipo: "Impacto",
          alcance: "Corpo a corpo",
          critico: "x2",
          especial: "Alvo atingido fica Desestabilizado (-2 na Defesa até o próximo turno)."
        }
      ],
      habilidades: [
        {
          nome: "Guardião Veterano",
          tipoAcao: "Passiva",
          desc: "Enquanto estiver adjacente a Cassandra ou a outro aliado ferido, concede +3 na Defesa e RD 5 passiva para o aliado protegido."
        },
        {
          nome: "Sacrifício Inabalável",
          tipoAcao: "Reação (2 PM)",
          desc: "Quando um ataque corpo a corpo ou à distância for direcionado a Cassandra a até 3m, Aldren pode se colocar na trajetória e receber o dano integral em seu lugar."
        },
        {
          nome: "Comando de Batalha",
          tipoAcao: "Movimento (2 PM)",
          desc: "Grita ordens táticas veteranas concedendo +2 em testes de ataque e +3m de deslocamento para todos os aliados a até 9m por 1 rodada."
        },
        {
          nome: "Duro na Queda",
          tipoAcao: "Reação (1 PM)",
          desc: "Quando sofrer dano letal, reduz o dano à metade com um teste de Fortitude (CD = dano recebido)."
        }
      ]
    },
    equipamentos: [
      "Armadura de Placas Completa Antiga (brasão dos Crane raspado)",
      "Espada Bastarda de Aço-Rubro da família",
      "Escudo Torre com símbolos de juramento",
      "Capa puída e medalhão de Helena"
    ],
    taticas: "Aldren é a âncora de linha de frente. Ele trava os atacantes mais perigosos (como os cultistas ou Varek) com derrubadas e usa seu escudo para bloquear o avanço contra os conjuradores do grupo.",
    roleplay: {
      personalidade: "Austero, contido e protetor. Carrega o peso de ter acreditado cegamente na liturgia de Milothiann até ser tarde demais.",
      motivacao: "Proteger Cassandra com a própria vida e purgar a vergonha de sua antiga cumplicidade com Severian.",
      citacao: "'Eu jurei proteger esta menina quando ela nasceu. Severian terá que passar por cima do meu cadáver para tocar num único fio de cabelo dela.'",
      notasMestre: "Se Aldren for salvo na Capela, ele se torna um aliado tático formidável no combate final. No Ato III, ele pode realizar o sacrifício na ponte caso o grupo não tenha outro plano."
    }
  },

  cael: {
    id: "cael",
    name: "Cael, o Batedor de Yuvalin",
    role: "Mensageiro Confiável de Helena / Guia das Estradas",
    category: "aliado",
    nd: 4,
    tipo: "Humano, Ladino / Batedor",
    tamanho: "Médio",
    deslocamento: "12m",
    description: "Homem ágil de roupas escuras e capuz manchado de poeira da estrada. É o batedor enviado pessoalmente por Helena de Yuvalin para guiar os heróis pelas rotas de Portsmouth e Milothiann.",
    atributos: {
      for: 12,
      des: 18,
      con: 14,
      int: 14,
      sab: 14,
      car: 12
    },
    pericias: [
      { nome: "Furtividade", mod: 14 },
      { nome: "Ladinagem", mod: 13 },
      { nome: "Sobrevivência", mod: 12 },
      { nome: "Iniciativa", mod: 12 },
      { nome: "Percepção", mod: 11 },
      { nome: "Pontaria", mod: 12 },
      { nome: "Acrobacia", mod: 12 }
    ],
    combatStats: {
      pv: 42,
      pm: 18,
      defesa: 20,
      iniciativa: 12,
      rd: 0,
      sentidos: "Visão na Penumbra",
      ataques: [
        {
          nome: "Arco Curto com Flechas de Caça",
          teste: "Pontaria +12",
          mod: 12,
          dano: "1d6+5",
          tipo: "Perfuração",
          alcance: "Médio (30m)",
          critico: "x3",
          especial: "+2d6 de Ataque Furtivo se o alvo estiver desprevenido ou flanqueado."
        },
        {
          nome: "Adaga Oculta",
          teste: "Luta +10",
          mod: 10,
          dano: "1d4+4",
          tipo: "Perfuração",
          alcance: "Curto",
          critico: "19/x2"
        }
      ],
      habilidades: [
        {
          nome: "Ataque Furtivo",
          tipoAcao: "Passiva",
          desc: "Causa +2d6 de dano de precisão contra alvos desprevenidos ou flanqueados."
        },
        {
          nome: "Guia das Rotas Ocultas",
          tipoAcao: "Suporte",
          desc: "Concede +2 em testes de Sobrevivência e Furtividade para o grupo durante viagens e infiltrações."
        },
        {
          nome: "Evasão",
          tipoAcao: "Reação",
          desc: "Em testes de Reflexos contra dano em área, se passar não sofre nenhum dano; se falhar sofre metade."
        }
      ]
    },
    equipamentos: [
      "Armadura de Couro Batido leve",
      "Arco Curto e aljava com 30 flechas",
      "Duas adagas balanceadas",
      "Mapa secreto dos canais de esgoto de Milothiann",
      "Carta selada de Helena com ordens e códigos"
    ],
    taticas: "Cael nunca entra em combate direto no corpo a corpo se puder evitar. Ele mantém distância, usa cobertura para se esconder a cada rodada e dispara flechas furtivas nos alvos que estão engajados com os guerreiros.",
    roleplay: {
      personalidade: "Pragmático, rápido e observador. Fala em sussurros e desconfia de estranhos até que a carta de Helena seja confirmada.",
      motivacao: "Cumprir o juramento a Helena e garantir que Cassandra seja resgatada das garras de Severian.",
      citacao: "'As estradas de Portsmouth têm mais olhos do que árvores. Se dermos um passo em falso, o Inquisidor saberá antes do amanhecer.'",
      notasMestre: "Se o grupo confiar em Cael no Ato I, ele pode cuidar do garoto Toma ou guiar pelo cortejo funerário. Se atacado, fica ferido e incapacitado."
    }
  },

  helena: {
    id: "helena",
    name: "Lady Helena de Yuvalin",
    role: "Patrona Nobre / Artífice e Maga Protetora",
    category: "aliado",
    nd: 6,
    tipo: "Humana, Nobre / Artífice",
    tamanho: "Médio",
    deslocamento: "9m",
    description: "Nobre influente de Yuvalin e amiga jurada da mãe de Cassandra. Forneceu os recursos iniciais, a carroça de viagem e a carta de salvo-conduto. Especialista em artefatos e runas arcanas.",
    atributos: {
      for: 10,
      des: 14,
      con: 12,
      int: 18,
      sab: 16,
      car: 16
    },
    pericias: [
      { nome: "Conhecimento", mod: 14 },
      { nome: "Ofício (Alquimia/Engenharia)", mod: 15 },
      { nome: "Misticismo", mod: 13 },
      { nome: "Diplomacia", mod: 13 },
      { nome: "Investigação", mod: 14 },
      { nome: "Percepção", mod: 11 }
    ],
    combatStats: {
      pv: 40,
      pm: 30,
      defesa: 17,
      iniciativa: 8,
      rd: 2,
      ataques: [
        {
          nome: "Besta Leve Precisa",
          teste: "Pontaria +10",
          mod: 10,
          dano: "1d8+4",
          tipo: "Perfuração",
          alcance: "Médio (30m)",
          critico: "19/x2"
        }
      ],
      magias: [
        {
          nome: "Identificação Instantânea",
          custoPM: 1,
          escola: "Adivinhação",
          desc: "Identifica propriedades mágicas de qualquer item ou runa em 1 rodada."
        },
        {
          nome: "Campo de Força Alquímico",
          custoPM: 2,
          cd: 18,
          escola: "Abjuração",
          desc: "Cria barreira com 30 PV temporários que protege um alvo a até 9m."
        }
      ]
    },
    equipamentos: [
      "Vestimentas de viagem nobres reforçadas",
      "Grimório de anotações da família Mara e Crane",
      "Selo de cera legítimo de Yuvalin"
    ],
    taticas: "Helena é a mente estratégica por trás do resgate. Ela atua nos bastidores fornecendo cartas, suprimentos e conexões de inteligência.",
    roleplay: {
      personalidade: "Elegante, metódica e com uma determinação de ferro sob o verniz aristocrático.",
      motivacao: "Honrar a memória da mãe de Cassandra e impedir que o poder profano de Milothiann se espalhe para Yuvalin.",
      citacao: "'Severian pensa que os nobres de Yuvalin são fracos. Mostraremos a ele o peso do aço e da verdade.'"
    }
  },

  toma: {
    id: "toma",
    name: "Toma & Mara de Greywick",
    role: "Refugiados e Guardiões dos Documentos de Mara",
    category: "coadjuvante",
    nd: 2,
    tipo: "Humanos, Plebeus / Arquivistas",
    tamanho: "Pequeno (Toma) / Médio (Mara)",
    deslocamento: "9m",
    description: "Toma é um garoto de 10 anos corajoso que escondeu o Livro de Khorcova e a Placa de passagem dos Crane sob a capela de Greywick. Mara é sua tutora e bibliotecária que possui a chave para decifrar os segredos de Milothiann.",
    atributos: {
      for: 8,
      des: 14,
      con: 10,
      int: 14,
      sab: 12,
      car: 14
    },
    pericias: [
      { nome: "Furtividade", mod: 10 },
      { nome: "Percepção", mod: 8 },
      { nome: "Investigação", mod: 8 },
      { nome: "Conhecimento", mod: 7 }
    ],
    combatStats: {
      pv: 16,
      defesa: 14,
      iniciativa: 6,
      habilidades: [
        {
          nome: "Esconderijo Sob os Escombros",
          tipoAcao: "Passiva",
          desc: "Ganha +5 em Furtividade quando escondido em passagens estreitas ou sob pisos."
        },
        {
          nome: "Guardião dos Sais de Proteção",
          tipoAcao: "Suporte",
          desc: "Toma carrega 3 frascos de Sais de Proteção Arcanos que anulam o primeiro efeito de Alerta ou drenagem de PM."
        }
      ]
    },
    equipamentos: [
      "Livro de Khorcova (plantas dos canais e fraquezas de Severian)",
      "Placa de Passagem de Greywick",
      "3 Frascos de Sais de Proteção Arcano"
    ],
    roleplay: {
      personalidade: "Toma é assustado mas obstinado; Mara é protetora e extremamente grata a quem salvar o menino.",
      citacao: "'Eu não deixei os inquisidores pegarem o livro... eu prometi que entregaria para vocês!'",
      notasMestre: "O resgate de Toma em Greywick no Ato I define se ele entrega os recursos sem custo ou se haverá penalidades de suprimentos/mana."
    }
  },

  severian: {
    id: "severian",
    name: "Inquisidor-Mor Severian",
    role: "Alto Prelado da Inquisição de Khorcova / Boss do Ato II",
    category: "antagonista",
    nd: 10,
    tipo: "Humano Corrompido, Conjurador Divino / Profano",
    tamanho: "Médio",
    deslocamento: "9m",
    description: "Alto Prelado que comanda a fortaleza de Milothiann. Utiliza a liturgia inquisitorial para mascarar seu pacto com entidades do abismo e canalizar os 4 Pilonos Arcanos para invocar o avatar de Ferren.",
    atributos: {
      for: 14,
      des: 14,
      con: 20,
      int: 18,
      sab: 22,
      car: 18
    },
    pericias: [
      { nome: "Religião / Misticismo", mod: 18 },
      { nome: "Vontade", mod: 17 },
      { nome: "Iniciativa", mod: 12 },
      { nome: "Intimidação", mod: 16 },
      { nome: "Percepção", mod: 14 },
      { nome: "Luta", mod: 14 }
    ],
    combatStats: {
      pv: 150,
      pm: 60,
      defesa: 28,
      iniciativa: 12,
      rd: "5 por Pilono Ativo (máx RD 20 com 4 pilonos)",
      sentidos: "Visão no Escuro 18m, Sentir Magia contínuo",
      resistencias: ["+5 em testes contra dano de Trevas e Fogo", "Imune a Efeitos de Medo e Encantamento"],
      ataques: [
        {
          nome: "Báculo de Ossos Santos & Trevas",
          teste: "Luta +18 (corpo a corpo ou alcance 18m)",
          mod: 18,
          dano: "3d8+10",
          tipo: "Impacto + Trevas",
          alcance: "18m",
          critico: "19/x3",
          especial: "Drena 1d4 PM do alvo e cura Severian em valor igual ao dano de trevas."
        },
        {
          nome: "Toque do Julgamento Corrompido",
          teste: "Toque +16",
          mod: 16,
          dano: "4d6+8",
          tipo: "Profano",
          alcance: "Corpo a corpo",
          critico: "x2",
          especial: "Alvo fica Esmorecido (Vontade CD 22 reduz metade)"
        }
      ],
      magias: [
        {
          nome: "Julgamento Herético em Cone",
          custoPM: 4,
          cd: 22,
          escola: "Necromancia / Evocação",
          alcance: "Cone de 9m",
          duracao: "Instantânea",
          desc: "Torrente de chamas negras e brasas profanas que causa 6d6+6 de dano de Trevas. Reflexos CD 22 reduz metade."
        },
        {
          nome: "Colunas de Fogo Profano",
          custoPM: 5,
          cd: 22,
          escola: "Evocação",
          alcance: "Longo (90m)",
          duracao: "Instantânea",
          desc: "Erompe duas colunas de chamas negras em áreas de 3m de raio, causando 5d8 de dano de Fogo/Trevas cada."
        },
        {
          nome: "Comando da Inquisição",
          custoPM: 3,
          cd: 22,
          escola: "Encantamento",
          alcance: "Médio (30m)",
          duracao: "1 rodada",
          desc: "Força um herói a ajoelhar e largar suas armas ou atacar um companheiro (Vontade CD 22 anula)."
        }
      ],
      habilidades: [
        {
          nome: "Ressonância dos 4 Pilonos Arcanos",
          tipoAcao: "Passiva / Regeneração",
          desc: "No início de cada um de seus turnos, Severian regenera 10 PV para CADA pilono ativo (até 40 PV/turno se todos os 4 estiverem funcionando) e ganha RD 5 por pilono."
        },
        {
          nome: "Grito de Convocação dos Acólitos",
          tipoAcao: "Movimento (Recarga 1d4 rodadas)",
          desc: "Invoca 2 Soldados Inquisitoriais ou 1 Acólito das sombras para proteger os pilonos."
        },
        {
          nome: "Escudo Litúrgico Blasfemo",
          tipoAcao: "Reação (3 PM)",
          desc: "Quando atingido por um ataque que cause dano massivo, reduz o dano em 20 usando a energia dos pilonos."
        }
      ]
    },
    equipamentos: [
      "Manto de Seda Carmesim e Ouro da Inquisição",
      "Báculo de Ossos Santos entalhado com runas proibidas",
      "Contrato Sombrio de Severian e Confissão de Traição",
      "Chave Mestra dos Aposentos de Milothiann"
    ],
    taticas: "Severian luta com total confiança enquanto seus pilonos estiverem ativos. Ele fica no centro da arena disparando o Báculo e Julgamento Herético. Se os heróis começarem a destruir os pilonos, ele foca seus ataques mais destrutivos no herói que estiver atacando os pilonos e usa 'Comando da Inquisição' para desacelerar o grupo.",
    roleplay: {
      personalidade: "Arrogante, frio, com retórica religiosa fervorosa usada para mascarar ambição desmedida de poder.",
      motivacao: "Sacrificar Cassandra no alinhamento dos pilonos para alcançar a imortalidade como arauto de Ferren.",
      citacao: "'Vocês chamam isso de heresia? Eu chamo de salvação! O sangue dos Crane acenderá a chama da verdadeira ordem!'",
      notasMestre: "Destaque a regeneração de PV a cada rodada para incentivar os jogadores a destruírem os pilonos com atletismo/misticismo ou usarem a Inversão de Runas de Cassandra."
    }
  },

  varek: {
    id: "varek",
    name: "Varek, o Caçador Arcano",
    role: "Algoz de Severian / Arcanista Bruxo & Guerreiro de Azgher",
    category: "antagonista",
    nd: 8,
    tipo: "Elfo Cativo das Fadas, Arcanista Bruxo 7 / Guerreiro 1",
    tamanho: "Médio",
    deslocamento: "12m",
    description: "Caçador de recompensas implacável de alta precisão arcana, contratado a peso de ouro por Severian para caçar o grupo e emboscá-los na Galeria dos Confiscados. Devoto fervoroso de Azgher, Varek preparou seu corpo e mente com meticulosidade: acorda, conjura seus buffs diários contínuos (Armadura Arcana, Arma Mágica, Resistência a Energia Fogo 40), consome poções de mana para manter seus 58 PM no ápice e aguarda suas presas disfarçado com sua máscara mágica. Em combate, desfere o temível combo de Ataque Arcano que canaliza Toque Chocante de 12 PM (11d8+13) em seu Machado de Batalha com Vantagem em jogadas de ataque, podendo golpear duas vezes por turno! Possui defesa mágica quase intransponível (+9 em todas as resistências, Contramágica Aprimorada +21 e Aparar Magia que reflete feitiços no conjurador) e, caso caia a 0 PV ou inconsciente, sua Runa de Proteção no peito detona como um homem-bomba em área!",
    atributos: {
      for: 8,
      des: 18,
      con: 14,
      int: 20,
      sab: 8,
      car: 10
    },
    pericias: [
      { nome: "Misticismo", mod: 21 },
      { nome: "Luta", mod: 13 },
      { nome: "Iniciativa", mod: 12 },
      { nome: "Fortitude", mod: 11 },
      { nome: "Reflexos", mod: 13 },
      { nome: "Vontade", mod: 8 },
      { nome: "Nobreza", mod: 13 },
      { nome: "Percepção", mod: 9 },
      { nome: "Investigação", mod: 9 },
      { nome: "Atletismo", mod: 7 },
      { nome: "Enganação (c/ Máscara)", mod: 8 }
    ],
    combatStats: {
      pv: 58,
      pm: 58,
      defesa: 30,
      iniciativa: 12,
      rd: "RD Fogo 40 (Resistência a Energia / Azgher) • RD Física 5 (Escudo & Postura)",
      sentidos: "Sentidos Élficos, Visão na Penumbra, Sentir Magia 18m",
      resistencias: [
        "+9 em TODOS os testes de resistência contra magias (Fortitude +20, Reflexos +22, Vontade +17 vs Magia)",
        "RD Fogo 40 por Bênção de Azgher e Resistência a Energia",
        "RD Física 5 passiva em combate pelo Escudo Rúnico e treinamento marcial",
        "Escudo Pesado Abascanto (+2 adicional em testes contra magias)",
        "Imune a sono mágico e efeitos de metamorfose forçada"
      ],
      imunidades: ["Sono mágico", "Metamorfose forçada"],
      ataques: [
        {
          nome: "⚡ Combo Devastador: Machado AM + Toque Chocante (12 PM)",
          teste: "Luta +13 (Vantagem com 2 dados via Concentração de Combate; Ataque Especial +4)",
          mod: 13,
          dano: "2d8+3d6+7 corte + 11d8+13 eletricidade",
          tipo: "Corte + Eletricidade Arcana",
          alcance: "Corpo a corpo",
          critico: "20/x3 (Machado)",
          especial: "Ataque Arcano: Não é teste de magia, é teste de ataque! Canaliza Toque Chocante de 12 PM no machado. Com Ataque Arcano, pode desferir 2x por rodada esse mesmo combo (gastando 24 PM no turno)!"
        },
        {
          nome: "Machado de Batalha AM (Anátema Certeiro Pungente)",
          teste: "Luta +13 (com Vantagem)",
          mod: 13,
          dano: "2d8+3d6+7",
          tipo: "Corte",
          alcance: "Corpo a corpo",
          critico: "20/x3",
          especial: "Empunhado com uma mão junto ao Escudo Pesado Abascanto. Pode somar +4 no ataque ou no dano com Ataque Especial de Guerreiro (1 PM)."
        },
        {
          nome: "Amarras Etéreas (Controle de Caçador)",
          teste: "Magia à Distância (CD 19)",
          mod: 19,
          dano: "Condição Preso e Imobilizado",
          tipo: "Essência",
          alcance: "Médio (30m)",
          critico: "--",
          especial: "Reflexos CD 19 evita. Se falhar, o alvo fica Preso e Imobilizado, incapaz de se deslocar ou conjurar sem teste de Misticismo/Atletismo CD 19."
        },
        {
          nome: "Adagas Duplas Envenenadas (Opção Tática Rápida)",
          teste: "Luta +13/+13",
          mod: 13,
          dano: "1d6+4 corte + veneno",
          tipo: "Corte + Veneno",
          alcance: "Corpo a corpo",
          critico: "19/x2",
          especial: "Fortitude CD 19 ou fica Lento por 1 minuto."
        }
      ],
      magias: [
        {
          nome: "Toque Chocante (Aprimorado Máximo - 12 PM)",
          custoPM: 12,
          escola: "Evocação",
          alcance: "Toque (canalizado através do Machado de Batalha)",
          duracao: "Instantânea",
          desc: "Causa 11d8+13 de dano elétrico massivo. Graças a Ataque Arcano, é desferido como parte do teste de ataque do Machado de Batalha, aplicando ambos os danos simultaneamente."
        },
        {
          nome: "Concentração de Combate (1 PM)",
          custoPM: 1,
          escola: "Adivinhação",
          alcance: "Pessoal",
          duracao: "1 rodada",
          desc: "Varek rola dois dados d20 em todas as jogadas de ataque corpo a corpo e usa o melhor resultado (Vantagem permanente em seus combos)."
        },
        {
          nome: "Contramágica Aprimorada (Reação - Misticismo +21)",
          custoPM: 0,
          escola: "Abjuração",
          alcance: "Médio (30m)",
          duracao: "Instantânea",
          desc: "Uma vez por rodada como reação, quando um conjurador inimigo conjura uma magia, Varek faz um teste de Misticismo (+21) contra a CD da magia para anulá-la no ato."
        },
        {
          nome: "Aparar Magia (Reação - Teste de Ataque +13)",
          custoPM: 0,
          escola: "Abjuração / Marcial",
          alcance: "Pessoal",
          duracao: "Instantânea",
          desc: "Se uma magia atingir Varek (ou passar pela contramágica), ele pode fazer um teste de ataque com o Machado (+13) contra a CD da magia. Se o ataque for maior que a CD, Varek sofre zero dano e a magia é refletida de volta contra o conjurador original!"
        },
        {
          nome: "Runa de Proteção: Homem-Bomba (Gatilho 0 PV / Inconsciência)",
          custoPM: 0,
          escola: "Evocação / Rúnica",
          alcance: "Raio de 6m ao redor de Varek",
          duracao: "Instantânea (Reação Automática)",
          desc: "Gravada em seu peito: no exato instante em que Varek for reduzido a 0 PV ou cair inconsciente, a runa detona automaticamente descarregando Toque Chocante em área (11d8+13 de dano elétrico em todos num raio de 6m; Reflexos CD 19 reduz metade)."
        },
        {
          nome: "Amarras Etéreas (3 PM)",
          custoPM: 3,
          cd: 19,
          escola: "Invocação",
          alcance: "Médio (30m)",
          duracao: "Sustentada",
          desc: "Fios translúcidos prendem o alvo (Reflexos CD 19 anula). Alvo preso fica Imobilizado e Desprevenido."
        },
        {
          nome: "Buffs Matinais Contínuos: Armadura Arcana, Arma Mágica & Resistência a Energia",
          custoPM: 0,
          escola: "Transmutação / Abjuração",
          alcance: "Pessoal",
          duracao: "Dia Inteiro (Renovado com poções)",
          desc: "Garantem Defesa 30, Machado com +3d6 de bônus mágico e RD Fogo 40."
        },
        {
          nome: "Disfarce Ilusório (1 PM)",
          custoPM: 1,
          cd: 19,
          escola: "Ilusão",
          alcance: "Pessoal",
          duracao: "Cena",
          desc: "Permite a Varek assumir perfeitamente a aparência da prisioneira na cela (Falsa Mara ou Cassandra)."
        }
      ],
      habilidades: [
        {
          nome: "Ataque Arcano (Duplo Golpe Devastador por Turno)",
          tipoAcao: "Padrão / Livre",
          desc: "Quando desfere um ataque com magia acoplada (Toque Chocante), pode gastar mana para desferir um segundo ataque com Toque Chocante no mesmo turno, totalizando dois golpes devastadores na mesma rodada!"
        },
        {
          nome: "Ataque Especial de Guerreiro (1 PM)",
          tipoAcao: "Livre (1 nível de Guerreiro)",
          desc: "Gasta 1 PM para somar +4 no teste de ataque ou +4 na rolagem de dano do golpe."
        },
        {
          nome: "Estilo Dançarino Marcial / Arma Arcana",
          tipoAcao: "Passiva",
          desc: "Usa seu modificador de Inteligência (+5) nas jogadas de Luta em vez de Força, tornando seus ataques com machado cirúrgicos e precisos."
        },
        {
          nome: "Resistência a Magia Élfica & Abascanto (+9 Total)",
          tipoAcao: "Passiva",
          desc: "Soma +9 em absolutamente todos os testes de Fortitude (+20), Reflexos (+22) e Vontade (+17) contra efeitos mágicos."
        },
        {
          nome: "Habitante do Deserto (Divindade: Azgher)",
          tipoAcao: "Passiva",
          desc: "Imunidade ao calor extremo e suporte divino à sua imensa resistência contra fogo."
        },
        {
          nome: "Emboscada Ilusória da Cela (+4 Defesa)",
          tipoAcao: "Especial",
          desc: "Se o grupo não desmascarar a Falsa Mara/Cassandra antes de entrar na cela, Varek ganha 1 rodada de surpresa e 2 reflexos ilusórios ativos (+4 na Defesa na 1ª rodada = Defesa 34)."
        }
      ]
    },
    equipamentos: [
      "Machado de Batalha Anátema Certeiro Pungente (Arma Mágica ativa, 2d8+3d6+7 corte, crítico 20/x3)",
      "Escudo Pesado Abascanto Reforçado Rúnico (+3 Defesa, +2 contra magias)",
      "Robe Mágico Magistral (+3 Misticismo)",
      "Chapéu Mágico Magistral (+3 Misticismo)",
      "Símbolo Sagrado de Azgher (+1 em todas as resistências)",
      "Máscara de Varek (Item Chave de Espólio: Disfarce Ilusório e percepção de ilusões)",
      "Contrato Secreto de Severian (Documento crucial que prova a conspiração)",
      "Frascos vazios de Poções de Mana utilizadas na preparação prévia"
    ],
    taticas: "Varek foi contratado por Severian para caçar o grupo e proteger a farsa na cela dos Confiscados. Ele opera sob o lema de nunca falhar: acorda, casta todos os seus buffs duradouros (Armadura Arcana, Arma Mágica, Resistência a Energia Fogo 40), toma poções de mana e aguarda com 58 PM no ápice. No combate, Varek ativa Concentração de Combate (1 PM) para ter Vantagem em todas as jogadas de ataque. Ele combeia Ataque Arcano canalizando Toque Chocante de 12 PM em seu Machado de Batalha (2d8+3d6+7 + 11d8+13 elétrico), podendo repetir o golpe no mesmo turno! Defensivamente, ele usa Contramágica Aprimorada (+21 Misticismo) para anular magias de início. Se uma magia passar, tenta Aparar Magia com o Machado (+13) para rebater o feitiço contra o próprio conjurador. Se o grupo o levar a 0 PV ou deixá-lo inconsciente, sua Runa de Proteção dispara automaticamente como uma 'bomba' de 11d8+13 em área!",
    roleplay: {
      personalidade: "Frio, metódico e profissional. Não subestima seus alvos e confia cegamente em suas preparações mágicas e bênçãos de Azgher.",
      motivacao: "Cumprir seu contrato com Severian, receber a vultosa recompensa em tibares e eliminar ameaças mágicas.",
      citacao: "'Severian pagou adiantado e eu nunca deixo um serviço pela metade. Minha lâmina já sentenciou conjuradores muito mais velhos que vocês.'",
      notasMestre: "Deixe claro para os jogadores o perigo do combate quando os primeiros arcos de eletricidade crepitarem no machado. Se Varek for encurralado aos 30 PV, ele pode negociar a entrega da máscara e do contrato de Severian em troca da vida. Se morrer ou for abatido, ALERTE IMEDIATAMENTE sobre a explosão da Runa Homem-Bomba!"
    }
  },

  sandro: {
    id: "sandro",
    name: "Sargento Sandro & Guarda dos Estábulos",
    role: "Capitão Mercenário da Guarda Externa",
    category: "antagonista",
    nd: 5,
    tipo: "Humano, Soldado Veterano / Mercenário",
    tamanho: "Médio",
    deslocamento: "9m",
    description: "Sargento mercenário contratado pela Inquisição para guarnecer os estábulos e as rotas de carga de Milothiann. Homem experiente e cínico que pode ser subornado, enganado ou combatido.",
    atributos: {
      for: 16,
      des: 14,
      con: 16,
      int: 10,
      sab: 12,
      car: 10
    },
    pericias: [
      { nome: "Luta", mod: 12 },
      { nome: "Intimidação", mod: 11 },
      { nome: "Percepção", mod: 9 },
      { nome: "Iniciativa", mod: 8 },
      { nome: "Fortitude", mod: 10 }
    ],
    combatStats: {
      pv: 65,
      pm: 12,
      defesa: 22,
      iniciativa: 8,
      rd: 3,
      ataques: [
        {
          nome: "Alabarda Mercenária Pesada",
          teste: "Luta +12",
          mod: 12,
          dano: "1d10+7",
          tipo: "Corte / Perfuração",
          alcance: "Corpo a corpo (alcance 3m)",
          critico: "x3",
          especial: "Permite manobra Desarmar ou Derrubar com +2 no teste."
        },
        {
          nome: "Besta Pesada com Virola de Aço",
          teste: "Pontaria +10",
          mod: 10,
          dano: "1d12+5",
          tipo: "Perfuração",
          alcance: "Médio (30m)",
          critico: "19/x2"
        }
      ],
      habilidades: [
        {
          nome: "Formação de Piqueiros",
          tipoAcao: "Passiva",
          desc: "Ganha +2 na Defesa e +2 no dano para cada soldado mercenário adjacente."
        },
        {
          nome: "Olho para Ouro & Risco",
          tipoAcao: "Social",
          desc: "Se os heróis oferecerem mais de 100 T$ ou uma saída segura, a CD de Diplomacia/Suborno reduz de 20 para 16."
        }
      ]
    },
    equipamentos: [
      "Brunea reforçada e elmo com pluma desgastada",
      "Alabarda de infantaria",
      "Besta Pesada com 20 virotes",
      "Bolsa de moedas e dados de aposta"
    ],
    taticas: "Sandro posiciona seus homens em estrangulamentos nas portas dos estábulos, usando o alcance das alabardas para manter os heróis longe.",
    roleplay: {
      personalidade: "Pragmático. Não quer morrer por uma causa fanática de Severian, apenas quer ser pago.",
      citacao: "'Eu sou pago para vigiar cavalos e cargas, não para virar comida de monstro arcano. Dependendo da oferta de vocês, posso fingir que fui ao banheiro.'"
    }
  },

  guardas_milothiann: {
    id: "guardas_milothiann",
    name: "Soldados Inquisitoriais de Milothiann",
    role: "Guarda Pessoal e Tropa de Choque da Inquisição",
    category: "ameaca",
    nd: 3,
    tipo: "Humanos, Tropa Inquisitorial",
    tamanho: "Médio",
    deslocamento: "9m",
    description: "Guardas fanáticos treinados para subjugar conjuradores e hereges. Equipados com grilhões antimagia, escudos e cimitarras.",
    atributos: {
      for: 14,
      des: 12,
      con: 14,
      int: 10,
      sab: 10,
      car: 10
    },
    pericias: [
      { nome: "Luta", mod: 8 },
      { nome: "Percepção", mod: 6 },
      { nome: "Iniciativa", mod: 5 },
      { nome: "Fortitude", mod: 7 }
    ],
    combatStats: {
      pv: 32,
      defesa: 19,
      iniciativa: 5,
      rd: 2,
      ataques: [
        {
          nome: "Espada Longa Inquisitorial",
          teste: "Luta +8",
          mod: 8,
          dano: "1d8+4",
          tipo: "Corte",
          alcance: "Corpo a corpo",
          critico: "19/x2"
        },
        {
          nome: "Grilhões de Ferro Frio",
          teste: "Manobra Agarrar +9",
          mod: 9,
          dano: "Especial",
          tipo: "Imobilização",
          alcance: "Corpo a corpo",
          especial: "Se prender um conjurador, este precisa de Concentração CD 20 para lançar magias."
        }
      ],
      habilidades: [
        {
          nome: "Fanatismo Cego",
          tipoAcao: "Passiva",
          desc: "+2 em testes de Vontade contra intimidação e medo enquanto Severian estiver vivo."
        }
      ]
    },
    equipamentos: [
      "Cota de malha com tabardo de Khorcova",
      "Escudo de aço com olho inquisitorial",
      "Espada longa e grilhões pesados"
    ]
  },

  acolitos_pilonos: {
    id: "acolitos_pilonos",
    name: "Acólitos e Canalizadores dos Pilonos",
    role: "Cultistas e Conjuradores de Apoio no Ritual",
    category: "ameaca",
    nd: 4,
    tipo: "Humanos, Cultistas Arcanos",
    tamanho: "Médio",
    deslocamento: "9m",
    description: "Conjuradores encapuzados posicionados nos 4 pilonos de Milothiann, entoando cânticos profanos para abastecer a barreira de Severian.",
    atributos: {
      for: 10,
      des: 14,
      con: 12,
      int: 16,
      sab: 14,
      car: 12
    },
    pericias: [
      { nome: "Misticismo", mod: 11 },
      { nome: "Iniciativa", mod: 8 },
      { nome: "Vontade", mod: 9 }
    ],
    combatStats: {
      pv: 28,
      pm: 20,
      defesa: 16,
      iniciativa: 8,
      rd: 0,
      ataques: [
        {
          nome: "Raio Necrótico do Pilono",
          teste: "Pontaria +9",
          mod: 9,
          dano: "2d8+3",
          tipo: "Trevas",
          alcance: "Médio (30m)",
          critico: "x2"
        }
      ],
      magias: [
        {
          nome: "Alimentar o Pilono",
          custoPM: 2,
          escola: "Necromancia",
          desc: "Ação Padrão: Concede +10 PV de cura imediata e +5 de RD para Severian."
        },
        {
          nome: "Névoa de Desespero",
          custoPM: 2,
          cd: 17,
          escola: "Ilusão",
          desc: "Cria área de 6m onde heróis ficam Abalados (-2 em testes)."
        }
      ]
    }
  },

  sombras_retornados: {
    id: "sombras_retornados",
    name: "Sombras da Névoa & Retornados de Milothiann",
    role: "Criaturas Rituais e Almas Aprisionadas",
    category: "ameaca",
    nd: 4,
    tipo: "Morto-Vivo, Incorpóreo / Corrompido",
    tamanho: "Médio",
    deslocamento: "Voo 12m",
    description: "Espíritos atormentados dos antigos servos e prisioneiros de Milothiann, erguidos pela presença de Ferren para cercar a fortaleza.",
    atributos: {
      for: 10,
      des: 18,
      con: 14,
      int: 6,
      sab: 10,
      car: 14
    },
    combatStats: {
      pv: 36,
      defesa: 20,
      iniciativa: 10,
      rd: "Incorpóreo (Metade do dano de ataques físicos)",
      sentidos: "Visão no Escuro 18m, Percepção às Cegas de Mana 9m",
      imunidades: ["Imunidades de Morto-Vivo (veneno, sono, paralisia, atordoamento, sangramento)"],
      ataques: [
        {
          nome: "Toque Congelante da Alma",
          teste: "Toque +10",
          mod: 10,
          dano: "2d6+4 frio + 1d4 drenagem de Força",
          tipo: "Frio + Trevas",
          alcance: "Corpo a corpo",
          critico: "x2",
          especial: "Fortitude CD 16 reduz o dano de frio e anula a drenagem de Força."
        }
      ],
      habilidades: [
        {
          nome: "Incorpóreo",
          tipoAcao: "Passiva",
          desc: "Pode atravessar paredes, portas trancadas e obstáculos sólidos livremente."
        }
      ]
    }
  },

  ferren: {
    id: "ferren",
    name: "Ferren, a Entidade da Ascensão Profana",
    role: "Divindade em Ascensão / Colosso Apocalíptico (Escala S)",
    category: "antagonista",
    nd: "Escala S (Divindade)",
    tipo: "Entidade Divina / Avatar Cósmico",
    tamanho: "Colossal (mais de 50 metros)",
    deslocamento: "Voo 30m / Teletransporte",
    description: "A entidade cultuada por Severian nos subterrâneos de Milothiann. Quando os 4 Pilonos Arcanos entram em ressonância e o ritual atinge o ápice, o céu se racha em púrpura e a silhueta titânica de Ferren emerge da terra, distorcendo a gravidade, o clima e a própria realidade. Não pode ser derrotada por lâminas ou magias mortais — o objetivo no Ato III é a fuga desesperada!",
    atributos: {
      for: 36,
      des: 20,
      con: 40,
      int: 30,
      sab: 30,
      car: 30
    },
    pericias: [
      { nome: "Misticismo", mod: 25 },
      { nome: "Vontade", mod: 25 },
      { nome: "Iniciativa", mod: 20 },
      { nome: "Intimidação", mod: 25 }
    ],
    combatStats: {
      pv: "Infinito (Escala S)",
      pm: "Infinito",
      defesa: "Inviolável (38+)",
      iniciativa: 20,
      rd: "50 contra qualquer ataque mortal",
      sentidos: "Onipresença local, Visão Total em todo o mapa de Milothiann",
      imunidades: ["Imunidade a todas as magias, venenos, doenças, morte súbita, controle mental e paralisia"],
      ataques: [
        {
          nome: "Golpe Sísmico do Braço de Trevas",
          teste: "Ataque em Área (Raio de 18m)",
          mod: 25,
          dano: "10d10+30",
          tipo: "Impacto + Trevas",
          alcance: "Longo (120m)",
          critico: "x3",
          especial: "Destrói estruturas, muralhas e pontes instantaneamente. Reflexos CD 28 reduz à metade."
        },
        {
          nome: "Raio da Desintegração de Mana",
          teste: "Linha de 60m",
          mod: 22,
          dano: "8d12",
          tipo: "Essência Corrompida",
          alcance: "Longo",
          especial: "Desintegra objetos e queima 2d6 PM de cada herói na linha."
        }
      ],
      habilidades: [
        {
          nome: "Presença Apocalíptica da Ascensão",
          tipoAcao: "Aura Contínua (Todo o Ato III)",
          desc: "Toda a região ao redor de Milothiann entra em colapso sísmico. A cada rodada na fuga, os heróis precisam de testes de Atletismo/Acrobacia/Reflexos para desviar de escombros em chamas."
        },
        {
          nome: "O Despertar dos Retornados",
          tipoAcao: "Automática",
          desc: "Ergue 1d4+2 Sombras e Retornados a cada 2 rodadas da terra rachada."
        },
        {
          nome: "A Cicatriz de Cassandra",
          tipoAcao: "Vínculo Místico",
          desc: "Quando Cassandra usa sua Fagulha ou Desejo para abrir caminho na ponte, Ferren sente sua linhagem e tenta atraí-la, criando o clímax de sacrifício e decisão do Ato III."
        }
      ]
    },
    taticas: "Ferren não é um monstro para combate equilibrado. Ele funciona como uma força da natureza / evento cataclísmico vivo. O mestre deve descrever o estrondo ensurdecedor de seus passos, os relâmpagos púrpuras e o desmoronamento das torres para criar tensão máxima durante a fuga pelo desfiladeiro e pela ponte!",
    roleplay: {
      personalidade: "Uma inteligência ancestral e cósmica que enxerga os mortais como formigas em sua marcha de renascimento.",
      citacao: "'O PÓ RETORNA AO PÓ... E A LINHAGEM DOS CRANE ALIMENTARÁ A ETERNIDADE.'",
      notasMestre: "Use Ferren para ditar o ritmo frenético do Ato III. Não permita que os jogadores pensem em 'bater nele' — tudo o que fizerem deve ser focado em correr, desarmar passagens, proteger Cassandra e atravessar a ponte antes que tudo desabe!"
    }
  }
};
