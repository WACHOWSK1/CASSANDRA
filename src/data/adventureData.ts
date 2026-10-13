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
      pv: 58,
      defesa: 30,
      thresholds: [
        { pv: 30, event: "Varek atinge 30 PV (Machucado) e tenta fugir pelo alçapão com Amarras Etéreas cobrindo a retirada." },
        { pv: 15, event: "Se encurralado aos 15 PV (Crítico), Varek propõe rendição em troca da vida, entregando sua Máscara e o Contrato de Severian." },
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
        label: "Varek atinge 15 PV ou menos e se rende (Cercado)",
        badge: "Rendição de Varek",
        effects: {
          npcStatus: { varek: "rendido" },
          resources: { mascaraVarek: true, contratoSeverian: true },
          log: "Varek se rendeu aos 15 PV sob ameaça de morte e entregou seus espólios sem detonar a runa."
        }
      },
      { id: "VD_fuga", target: "VE_FUGA", label: "Varek atinge 30 PV e dispara em fuga pelo alçapão", badge: "Tentativa de Fuga" }
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
    summary: "Gerencie o combate épico contra o Inquisidor-Mor Severian (ND 10-12 Solo, PV 260, PM 75), os 4 Pilonos Arcanos, Ações de Chefe Solo (Repulsa Sacrílega, Comando Rápido), Escudo Sacrifical (1 PV) e Transição para Fase 2.",
    bossConfig: {
      name: "Inquisidor-Mor Severian",
      basePV: 260,
      defesa: 32,
      mecanicas: [
        "Pilonos Arcanos: Cada pilono ativo concede RD 4 (até RD 15) e cura 10 PV por turno (até 40 PV/rodada).",
        "Escudo Sacrifical (1 PV Save): Severian não pode morrer enquanto houver pilonos; dano fatal consome 1 pilono e deixa Severian com 1 PV.",
        "Ações de Chefe Solo: Ao fim do turno de cada herói, Severian pode gastar Ações de Chefe (Repulsa Sacrílega, Comando Rápido CD 25, Passo pelas Sombras).",
        "Fase 2 (Abaixo de 130 PV): Asas de Cinzas (Voo 12m), Aura de Condenação (3d6 trevas/rodada) e Apocalipse Menor de Ferren (10d10 profano).",
        "Inverter Runas: Teste Misticismo/Ladinagem CD 20 rebate o raio em Severian (4d8 de dano).",
        "Romper Suporte: Atletismo CD 22 ou 30 de dano destrói o pilono.",
        "Desejos de Cassandra: Cassandra concede +4 de ataque ou sobrecarrega um pilono.",
        "Libertar Aldren: Atletismo/Ladinagem CD 18 o liberta para a luta como aliado valioso."
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
    summary: "O céu sobre Milothiann se abre em um vórtice carmesim. Ferren manifesta sua forma titânica de Arquilich (Escala S).",
    narration: "A terra racha em abismos profundos. Um estrondo cósmico faz as torres desabarem. Do vórtice púrpura, o Arquilich Ferren Asloth emerge levitando, envolvido em correntes de trevas, com o Cajado da Destruição reluzindo em morte e olhos que tudo veem.",
    options: [
      { id: "F_atacar", target: "F1_ESCALA_S", label: "Desafiar o Arquilich e entrar em combate contra Ferren! (Boss III - Escala S)", badge: "Confronto Impossível" },
      { id: "F_fugir", target: "R_TRANSFORMA", label: "Reconhecer a escala colossal e focar na sobrevivência / evacuação com Cassandra", badge: "Foco na Evacuação (Canônica)" }
    ]
  },

  "F1_ESCALA_S": {
    id: "F1_ESCALA_S",
    act: 3,
    title: "Confronto do Cataclismo: Arquilich Ferren Asloth (Boss III - Escala S)",
    type: "combat",
    summary: "Confronto direto contra o Arquilich Ferren Asloth (ND S). A vitória em combate convencional é impossível (2.418 PV, 255 PM, Defesa 66, CD 57). O mestre dispõe desta arena interativa com rolagens de ataque, magias e reações épicas para demonstrar o abismo de poder e forçar o grupo a priorizar a fuga desesperada!",
    narration: "O Arquilich Ferren Asloth levita sobre as ruínas de Milothiann. A gravidade ao seu redor colapsa, chamas arcanas púrpuras crepitam em seu manto e seus olhos cadavéricos encaram os heróis com desdém absoluto. 'Pobres efêmeros... vocês ousam erguer suas armas contra o senhor da morte? Cada batimento de seus corações é uma concessão minha!' Diante de vocês, o Cajado da Destruição ergue-se no ar.",
    gmTips: "Utilize a Arena do Boss III abaixo caso os jogadores insistam em lutar contra Ferren. Deixe-os rolar dados para sentirem a Defesa 66 e a Presença Opressora (CD 55). Use feitiços como Ferver Sangue, Toque Vampírico e Despertar dos Mortos para impor respeito. Quando o pânico se instalar e o grupo perceber a invulnerabilidade de Ferren, acione o botão de 'Forçar Retirada Estratégica' para avançar a fuga épica com Cassandra!",
    enemy: "Arquilich Ferren Asloth (ND S)",
    effects: { log: "Confronto com Boss III iniciado: Arquilich Ferren Asloth (Escala S). Vitória impossível — sobrevivência é o objetivo!" },
    nextDecision: "R_TRANSFORMA",
    options: [
      { id: "F1_to_R", target: "R_TRANSFORMA", label: "Reconhecer o abismo de poder e bater em retirada desesperada (Salvar Cassandra)", badge: "Evacuação Obrigatória" }
    ]
  },

  "BOSS_FERREN": {
    id: "BOSS_FERREN",
    act: 3,
    title: "Confronto do Cataclismo: Arquilich Ferren Asloth (Boss III - Escala S)",
    type: "combat",
    summary: "Confronto direto contra o Arquilich Ferren Asloth (ND S). A vitória em combate convencional é impossível (2.418 PV, 255 PM, Defesa 66, CD 57).",
    narration: "O Arquilich Ferren Asloth levita sobre as ruínas de Milothiann com seu manto de trevas desfraldado e o Cajado da Destruição crepitando com faíscas cósmicas.",
    gmTips: "Demonstração viva da Escala S de Tormenta 20. Utilize a Arena de Combate para demonstrar o abismo e forçar a retirada estratégica com Cassandra.",
    enemy: "Arquilich Ferren Asloth (ND S)",
    effects: { log: "Confronto com Boss III iniciado: Arquilich Ferren Asloth (Escala S)." },
    nextDecision: "R_TRANSFORMA",
    options: [
      { id: "BF_to_R", target: "R_TRANSFORMA", label: "Bater em retirada estratégica com Cassandra e evacuar", badge: "Evacuação Obrigatória" }
    ]
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
    role: "Alto Prelado de Khorcova / Arauto da Oitava Estrela (Chefe dos Pilonos)",
    category: "antagonista",
    nd: 10,
    tipo: "Humano Corrompido, Conjurador Divino / Profano (Chefe Solo)",
    tamanho: "Médio",
    deslocamento: "9m (Fase 1) / Voo 12m (Fase 2)",
    description: "Alto Prelado que comanda a fortaleza de Milothiann com punho de ferro e oratória fanática. Severian utilizou a liturgia inquisitorial para mascarar seu pacto sombrio com a Oitava Estrela Profana, construindo uma rede de 4 Pilonos Arcanos que drenam a vitalidade dos prisioneiros e anulam a magia dos invasores. Em combate, Severian é uma fortaleza viva: regenera vida a cada rodada, drena mana e vitalidade com seu báculo de mártires, comanda seus oponentes a se ajoelharem e, se levado ao limite, liberta as asas de corvo profanas da Oitava Estrela!",
    atributos: {
      for: 14,
      des: 14,
      con: 22,
      int: 18,
      sab: 24,
      car: 20
    },
    pericias: [
      { nome: "Religião / Misticismo", mod: 22 },
      { nome: "Vontade", mod: 22 },
      { nome: "Iniciativa", mod: 14 },
      { nome: "Intimidação", mod: 20 },
      { nome: "Percepção", mod: 16 },
      { nome: "Luta", mod: 18 }
    ],
    combatStats: {
      pv: 260,
      pm: 75,
      defesa: 32,
      iniciativa: 14,
      rd: "RD 15 (Reduz em -4 por pilono destruído: 15 -> 11 -> 7 -> 3 -> 0)",
      sentidos: "Visão no Escuro 18m, Sentir Magia contínuo, Percepção às Cegas 9m",
      resistencias: [
        "+5 em testes contra efeitos de Trevas, Fogo e Profano",
        "Imune a Efeitos de Medo, Encantamento Mental e Drenagem de Energia",
        "Resistência Lendária (3x/dia): Pode gastar 3 PM para passar automaticamente em um teste de resistência falho"
      ],
      imunidades: ["Medo", "Encantamento", "Dreno de Energia"],
      ataques: [
        {
          nome: "💀 Báculo Profano de Ossos Santos & Mártires",
          teste: "Luta / Ataque Sagrado Profano +22 (corpo a corpo ou alcance 18m)",
          mod: 22,
          dano: "3d8+12 de impacto e trevas + Drenar 1d6 PM",
          tipo: "Impacto + Trevas",
          alcance: "18m",
          critico: "19/x3",
          especial: "Cura Severian em PV igual a todo o dano de trevas causado. Se o alvo estiver Caído, sob Medo ou com menos de 50% dos PV, o acerto é um CRÍTICO AUTOMÁTICO (causa 9d8+36 e drena 2d6 PM)!"
        },
        {
          nome: "✋ Toque do Julgamento Inquisitorial",
          teste: "Toque +20",
          mod: 20,
          dano: "4d6+10 Profano",
          tipo: "Profano",
          alcance: "Corpo a corpo",
          critico: "x2",
          especial: "Alvo fica Esmorecido e Sangrando (Fortitude CD 25 reduz à metade e evita condições)."
        }
      ],
      magias: [
        {
          nome: "Julgamento Herético em Cone (3º Círculo - 4 PM)",
          custoPM: 4,
          cd: 25,
          escola: "Evocação / Necromancia",
          alcance: "Cone de 12m",
          duracao: "Instantânea",
          desc: "Torrente avassaladora de chamas negras e brasas profanas que causa 8d6+8 de dano de Trevas e Fogo. Reflexos CD 25 reduz à metade. Alvos que falharem ficam Condenados (sofrem +1d6 de dano de qualquer ataque até o fim da rodada)."
        },
        {
          nome: "Colunas de Fogo Profano & Erupção do Abismo (4º Círculo - 6 PM)",
          custoPM: 6,
          cd: 25,
          escola: "Evocação",
          alcance: "Longo (90m)",
          duracao: "Instantânea",
          desc: "Erompe duas colunas colossais de chamas negras de 3m de raio e 15m de altura. Causa 6d8+12 de dano de Fogo/Trevas cada (Reflexos CD 25 reduz metade), ignorando metade da RD a fogo do alvo."
        },
        {
          nome: "Grilhões Litúrgicos de Sangue (3º Círculo - 4 PM)",
          custoPM: 4,
          cd: 25,
          escola: "Invocação / Profano",
          alcance: "Médio (30m)",
          duracao: "Sustentada",
          desc: "Correntes rúnicas de ferro sacrificial irrompem do piso prendendo até 2 heróis. Os alvos ficam Presos e Sufocados (sofrem 3d6 de trevas no início de seus turnos e não podem conjurar magias sem passar em Vontade CD 25)."
        },
        {
          nome: "Comando da Inquisição (2º Círculo - 3 PM)",
          custoPM: 3,
          cd: 25,
          escola: "Encantamento",
          alcance: "Médio (30m)",
          duracao: "1 rodada",
          desc: "Força um herói a ajoelhar (*Caído*) e largar suas armas ou atacar um companheiro próximo (Vontade CD 25 anula)."
        },
        {
          nome: "Apocalipse Menor de Ferren (Fase 2 - 10 PM, 1x por combate)",
          custoPM: 10,
          cd: 25,
          escola: "Profana Maior",
          alcance: "Raio de 15m ao redor de Severian",
          duracao: "Instantânea",
          desc: "Severian eleva seu báculo aos céus e a Oitava Estrela emana uma supernova de matéria negra cósmica! Causa 10d10 de dano profano em todos os inimigos na arena (Reflexos CD 25 reduz à metade)."
        }
      ],
      habilidades: [
        {
          nome: "Ressonância dos 4 Pilonos Arcanos",
          tipoAcao: "Passiva / Regeneração",
          desc: "No início de cada turno, Severian regenera 10 PV para CADA pilono ativo (até 40 PV/rodada) e ganha RD 4 por pilono (RD 15 base) e +2 na Defesa por pilono (Defesa 32 base)."
        },
        {
          nome: "Escudo de Sacrifício (1 PV Save)",
          tipoAcao: "Reação Automática",
          desc: "Enquanto houver pelo menos 1 pilono ativo, quando Severian sofrer um golpe que o reduziria a 0 PV, a rede consome e destrói 1 dos pilonos imediatamente, mantendo Severian vivo com 1 PV!"
        },
        {
          nome: "Ação de Chefe 1: Repulsa Sacrílega da Oitava Estrela",
          tipoAcao: "Ação de Chefe (Fim do turno de um herói)",
          desc: "Onda de choque profana em raio de 9m: todos os heróis são empurrados 6m para trás e sofrem 3d8+6 de impacto/trevas (Fortitude CD 25 reduz metade e evita empurrão)."
        },
        {
          nome: "Ação de Chefe 2: Comando Rápido da Inquisição (2 PM)",
          tipoAcao: "Ação de Chefe (Fim do turno de um herói)",
          desc: "Severian ordena a um herói que caia de joelhos e largue suas armas imediatamente (Vontade CD 25 evita)."
        },
        {
          nome: "Ação de Chefe 3: Passo pelas Sombras dos Pilonos (2 PM)",
          tipoAcao: "Ação de Chefe (Fim do turno de um herói)",
          desc: "Teletransporta-se adjacente a qualquer pilono ativo a até 30m e ganha camuflagem leve (20% de chance de falha contra ataques) até seu próximo turno."
        },
        {
          nome: "Fase 2: O Despertar da Oitava Estrela (Aos 50% PV ou ≤1 Pilono)",
          tipoAcao: "Gatilho de Fase",
          desc: "Severian queima suas vestes revelando asas etéreas de corvos profanos: ganha Voo 12m, Aura de Condenação (2d6 trevas/rodada para quem estiver a até 9m) e acesso ao 'Apocalipse Menor de Ferren'."
        }
      ]
    },
    equipamentos: [
      "Manto de Seda Carmesim e Ouro da Inquisição",
      "Báculo de Ossos Santos & Mártires (arma mágica lendária com dreno de PM e vida)",
      "Anel de Foco Sacrificial (+2 na CD de magias divinas)",
      "Contrato Sombrio de Severian e Confissão de Traição aos Crane",
      "Chave Mestra dos Aposentos e Celas de Milothiann"
    ],
    taticas: "Severian atua como um chefe solo implacável. No início do combate, ele confia na rede de pilonos para absorver dano com RD 15 e regenerar até 40 PV/rodada. Ele usa 'Julgamento Herético' para deixar os heróis Condenados e desfere ataques à distância com o Báculo para drenar PM de conjuradores (como Cassandra ou magos do grupo) e curar sua própria vida. Quando os combatentes corpo a corpo avançam, ele usa sua Ação de Chefe 'Repulsa Sacrílega' para arremessá-los longe ou 'Passo pelas Sombras' para reposicionar-se. Se os heróis destruírem seus pilonos ou ele atingir 50% de PV, Severian entra na Fase 2: levita no ar com asas de corvo profano e desfere o 'Apocalipse Menor de Ferren'!",
    roleplay: {
      personalidade: "Fanático, calculista, implacável e dotado de uma soberba dogmática inabalável. Vê o sacrifício de Cassandra como um dever cósmico.",
      motivacao: "Concluir o ritual da Oitava Estrela para alcançar a apoteose como sumo sacerdote imortal do novo panteão.",
      citacao: "'Vocês não compreendem o peso da coroa de mártires! Cassandra não é uma garota... ela é a chave que abrirá as portas da verdadeira divindade!'",
      notasMestre: "Deixe claro aos jogadores que atacar Severian diretamente enquanto os 4 pilonos estiverem ativos é um erro quase fatal devido à RD 15 e Regeneração 40 PV/rodada. Incentive os jogadores a utilizarem Atletismo para destruir os pilonos ou Misticismo com Cassandra para Inverter as Runas e rebater o poder de volta nele!"
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
    name: "Arquilich Ferren Asloth",
    role: "Arquilich / Soberano de Aslothia / Entidade da Ascensão Profana",
    category: "antagonista",
    nd: "S",
    tipo: "Morto-vivo Médio (Arquilich)",
    tamanho: "Médio",
    deslocamento: "9m (6q), Teleporte 30m (20q)",
    description: "O lendário Conde Ferren Asloth, o Arquilich soberano de Aslothia, o Reino dos Mortos. Ao consumar a Noite da Ascensão Profana, tornou-se o mais temido conjurador morto-vivo de Arton (ND S). Nos subterrâneos de Milothiann, o Inquisidor Severian busca canalizar o sangue e a centelha de Cassandra através dos 4 Pilonos Arcanos para invocar o avatar de Ferren como um cataclismo vivo sobre o Reinado. Com poder arcano além da imaginação mortal, Ferren comanda legiões de mortos-vivos de até ND 19, rouba feitiços de conjuradores no ar e dobra as próprias leis da magia e do clima ao seu comando.",
    atributos: {
      for: 12,
      des: 22,
      con: 18,
      int: 40,
      sab: 18,
      car: 24
    },
    pericias: [
      { nome: "Conhecimento", mod: 36 },
      { nome: "Misticismo", mod: 36 },
      { nome: "Investigação", mod: 31 },
      { nome: "Nobreza", mod: 31 },
      { nome: "Ofício (Alquimia)", mod: 31 },
      { nome: "Iniciativa", mod: 27 },
      { nome: "Diplomacia", mod: 25 },
      { nome: "Enganação", mod: 25 },
      { nome: "Intimidação", mod: 25 },
      { nome: "Intuição", mod: 25 },
      { nome: "Percepção", mod: 22 },
      { nome: "Religião", mod: 20 },
      { nome: "Fortitude", mod: 31 },
      { nome: "Reflexos", mod: 27 },
      { nome: "Vontade", mod: 39 }
    ],
    combatStats: {
      pv: 2418,
      pm: 255,
      defesa: 66,
      iniciativa: 27,
      rd: "20/mágico",
      sentidos: "Percepção +22, Visão no Escuro, Visão Tumular (Visão Mística contínua para criaturas e objetos invisíveis)",
      resistencias: [
        "Fortitude +31, Reflexos +27, Vontade +39",
        "Resistência a Magia +5",
        "Redução de Dano 20/mágico"
      ],
      imunidades: [
        "Adivinhação",
        "Efeitos Mentais",
        "Eletricidade",
        "Frio",
        "Metamorfose",
        "Imunidades Padrão de Morto-vivo"
      ],
      ataques: [
        {
          nome: "Cajado da Destruição",
          teste: "+57",
          mod: 57,
          dano: "2d6+16 + 10d6+10 frio",
          tipo: "Impacto + Frio",
          alcance: "Corpo a corpo (1,5m)",
          critico: "x2",
          especial: "Toque Paralisante: Fortitude CD 55 evita ficar paralisado por 1d6 rodadas."
        },
        {
          nome: "Toque Gélido",
          teste: "+55",
          mod: 55,
          dano: "10d6+10",
          tipo: "Frio",
          alcance: "Corpo a corpo (1,5m)",
          especial: "Toque Paralisante: Fortitude CD 55 evita ficar paralisado por 1d6 rodadas."
        },
        {
          nome: "Toque Vampírico (Ataque Mágico)",
          teste: "+55",
          mod: 55,
          dano: "36d6+51",
          tipo: "Trevas / Dreno Vital",
          alcance: "Corpo a corpo (1,5m)",
          especial: "Custo 35 PM. Se acertar, além do dano corpo a corpo padrão, causa 36d6+51 de trevas e Ferren recupera metade desse valor em PV."
        }
      ],
      magias: [
        {
          nome: "Conjurador Arcano Épico (Mago 20º Nível)",
          custoPM: "Limite 35 PM",
          cd: 57,
          escola: "Arcano & Divino",
          alcance: "Variado",
          desc: "Como um mago de 20º nível (CD 57, limite de PM 35). Além das magias listadas abaixo, Ferren pode lançar qualquer magia de abjuração, convocação ou necromancia, arcana ou divina."
        },
        {
          nome: "Ferver Sangue",
          custoPM: 35,
          cd: 57,
          escola: "Necromancia / Fogo",
          alcance: "Curto",
          duracao: "Sustentada",
          desc: "O sangue de criaturas escolhidas em alcance curto ferve violentamente. Na conjuração e no início de cada um dos turnos de Ferren, cada alvo sofre 14d8+29 de fogo e fica enjoado por 1 rodada (Fortitude CD 57 reduz dano à metade e evita condição; 2 sucessos seguidos encerram a magia no alvo). Se reduzido a 0 PV por esta magia, seu corpo explode em pedaços matando-o e causando 6d6+21 de fogo em criaturas a até 3m (Reflexos CD 57 reduz à metade). Não afeta criaturas sem sangue."
        },
        {
          nome: "Toque da Morte",
          custoPM: 25,
          cd: 57,
          escola: "Necromancia",
          alcance: "Curto",
          duracao: "Instantânea",
          desc: "Criaturas em alcance curto sofrem 10d8+35 pontos de dano de trevas. Um inimigo com menos da metade de seus PV totais em vez disso deve fazer um teste de Fortitude (CD 57). Se passar, sofre o dano normal. Se falhar, seus PV são reduzidos imediatamente a –10 (morte iminente)."
        },
        {
          nome: "Legião",
          custoPM: 15,
          cd: 57,
          escola: "Encantamento",
          alcance: "Médio",
          duracao: "Sustentada",
          desc: "Até 10 alvos em alcance médio obedecem cegamente aos comandos de Ferren, exceto ordens claramente suicidas. No fim de cada um de seus turnos, o alvo pode fazer um teste de Vontade (CD 57) para livrar-se do efeito (alvos que passam ficam abalados por 1 rodada)."
        },
        {
          nome: "Marionete",
          custoPM: 10,
          cd: 57,
          escola: "Encantamento",
          alcance: "Médio",
          duracao: "Sustentada",
          desc: "Ferren assume o controle dos movimentos e ações físicas de uma criatura em alcance médio. Ao ser afetada e no início de cada um de seus turnos, a vítima faz um teste de Fortitude (CD 57) para quebrar o encanto."
        },
        {
          nome: "Rogar Maldição",
          custoPM: 10,
          cd: 57,
          escola: "Necromancia",
          alcance: "Curto",
          duracao: "Permanente",
          desc: "Uma criatura em alcance curto fica esmorecida e fica permanentemente incapaz de se comunicar ou lançar magias (Fortitude CD 57 anula)."
        },
        {
          nome: "Tentáculos de Trevas",
          custoPM: 10,
          cd: 57,
          escola: "Convocação / Trevas",
          alcance: "Médio (Esfera de 6m)",
          duracao: "Cena",
          desc: "Tentáculos sombrios brotam do solo em uma esfera de 6m e agarram quem estiver na área. Ao lançar e no início de cada um de seus turnos, Ferren faz teste de manobra Agarrar (Misticismo +36) contra todos na área. Alvos agarrados sofrem 8d6+8 pontos de dano de trevas (+15 no primeiro dano). Área conta como terreno difícil e os tentáculos são imunes a dano."
        },
        {
          nome: "Velocidade",
          custoPM: 10,
          cd: 57,
          escola: "Transmutação",
          alcance: "Pessoal",
          duracao: "Sustentada",
          desc: "Ferren ganha uma ação padrão adicional em cada um de seus turnos."
        },
        {
          nome: "Desespero Esmagador",
          custoPM: 8,
          cd: 57,
          escola: "Encantamento",
          alcance: "Cone de 6m",
          duracao: "Cena",
          desc: "Criaturas no cone ficam debilitadas e esmorecidas pela cena inteira (Vontade CD 57 reduz a duração para apenas 1 rodada)."
        },
        {
          nome: "Dissipar Magia",
          custoPM: 3,
          cd: 57,
          escola: "Abjuração",
          alcance: "Médio (Esfera 3m ou Alvo)",
          duracao: "Instantânea",
          desc: "Ferren escolhe uma criatura, objeto ou esfera de 3m e faz um teste de Misticismo (+36; quando usada com Contramágica Superior, rola dois d20 e escolhe o melhor). Todas as magias ativas no alvo com CD igual ou menor que o resultado são dissipadas."
        }
      ],
      habilidades: [
        {
          nome: "Arcano de Batalha",
          tipoAcao: "Passiva",
          desc: "O Arquilich Ferren Asloth soma seu mod de Inteligência (+15) nas rolagens de dano quando lança magias (já contabilizado em seus ataques e feitiços)."
        },
        {
          nome: "Aura de Medo",
          tipoAcao: "Aura (Raio de 30m)",
          desc: "Criaturas em um raio de 30m de Ferren ficam abaladas (Vontade CD 55 evita e a criatura não pode mais ser abalada por esta habilidade até o fim da cena)."
        },
        {
          nome: "Conhecimento Sequestrado",
          tipoAcao: "Reação (1x/rodada)",
          custoPM: 3,
          desc: "Uma vez por rodada, quando vê outra criatura lançando uma magia em alcance médio, Ferren pode tomar essa magia para si. A criatura deve passar em Vontade (CD 55); se falhar, não pode mais lançar essa magia até o fim da cena, e durante esse período ela se torna uma magia conhecida e utilizável por Ferren."
        },
        {
          nome: "Contramágica Superior",
          tipoAcao: "Reação (1x/rodada)",
          desc: "Uma vez por rodada, quando vê uma magia ser conjurada, Ferren faz uma contramágica de reação. Se usar Dissipar Magia para isso, ele rola dois dados d20 e usa o melhor resultado."
        },
        {
          nome: "Dança da Morte",
          tipoAcao: "Ação Livre (Início de Turno)",
          desc: "No início de seu turno, Ferren refaz os testes de resistência de cada condição prejudicial que o esteja afetando. Se passar no teste, a condição se encerra imediatamente."
        },
        {
          nome: "Despertar dos Mortos",
          tipoAcao: "Ação Completa",
          custoPM: 10,
          desc: "Ferren conjura um morto-vivo à sua escolha, feito de energia negativa e de até ND 19 (ex: Necrodraco ND 17, Senhor das Múmias ND 15, Vampiro ND 12, etc.). A criatura surge em alcance curto, obedece cegamente a Ferren e age na mesma iniciativa dele até o fim da cena ou até ser dispensada (ação livre). Limite de 1 morto-vivo ativo por vez."
        },
        {
          nome: "Drenar Vida",
          tipoAcao: "Ação Livre",
          custoPM: 1,
          desc: "Quando lança uma magia que causa dano, Ferren pode mudar o tipo desse dano para trevas. Para cada criatura que falhar no teste de resistência contra essa magia, Ferren recupera uma quantidade de PV igual à metade de todo o dano causado."
        },
        {
          nome: "Fluxo de Mana",
          tipoAcao: "Passiva",
          desc: "Ferren pode manter dois efeitos mágicos sustentados simultaneamente com apenas uma ação livre (pagando o custo de sustentação de cada um)."
        },
        {
          nome: "Magia Acelerada",
          tipoAcao: "Ação Livre (1x/rodada)",
          custoPM: "+4 PM",
          desc: "Uma vez por rodada, quando lança uma magia com execução de ação completa ou menor, Ferren pode mudar sua execução para ação livre pagando +4 PM."
        },
        {
          nome: "Magia Discreta",
          tipoAcao: "Ação Livre",
          custoPM: "+2 PM",
          desc: "Quando lança uma magia, Ferren não precisa gesticular ou falar, podendo conjurar com as mãos presas ou amordaçado. Perceber que ele lançou uma magia exige passar em Misticismo CD 30."
        },
        {
          nome: "Presença Opressora",
          tipoAcao: "Reação Defensiva",
          desc: "Quando qualquer criatura ataca Ferren, deve passar em um teste de Vontade (CD 55) ou não conseguirá machucá-lo, perderá a ação e sofrerá 12d6 pontos de dano psíquico. Se passar, não é mais afetada até o fim da cena."
        },
        {
          nome: "Regente Sombrio de Aslothia",
          tipoAcao: "1x por Rodada",
          desc: "Ferren tem soberania total sobre seus domínios. Uma vez por rodada, pode alterar o clima de qualquer região como se tivesse lançado Controlar o Clima. Além disso, pode manipular o solo impedindo travessias e sabe a localização exata de qualquer criatura conhecida dentro do reino."
        },
        {
          nome: "Rigor Mortis",
          tipoAcao: "Passiva",
          desc: "Uma criatura que falhe na resistência contra qualquer magia de Ferren perde sua próxima ação de movimento."
        },
        {
          nome: "Sacrificar Servo",
          tipoAcao: "Reação (1x/rodada)",
          desc: "Uma vez por rodada, quando sofre dano, Ferren pode sacrificar uma de suas criaturas invocadas para reduzir todo o dano sofrido a zero!"
        },
        {
          nome: "Toque Paralisante",
          tipoAcao: "Passiva nos Ataques",
          desc: "Os ataques corpo a corpo de Ferren causam 10d6+10 pontos de dano de frio extras (já contabilizados). Uma criatura que sofra esse dano de frio fica paralisada por 1d6 rodadas (Fortitude CD 55 evita)."
        },
        {
          nome: "Visão Tumular",
          tipoAcao: "Passiva Permanente",
          desc: "Ferren está permanentemente sob efeito da magia Visão Mística com o aprimoramento que permite enxergar criaturas e objetos invisíveis."
        },
        {
          nome: "Filactério do Arquilich",
          tipoAcao: "Imortalidade Ancestral",
          desc: "Se destruído em combate, o Arquilich Ferren Asloth retorna completamente reconstituído em 1d10 dias. A única forma de destruí-lo definitivamente é encontrar e quebrar seu filactério sagrado protegido nas profundezas de Aslothia."
        }
      ]
    },
    equipamentos: [
      "Amuleto do Abutre",
      "Cajado da Destruição (+2 no ataque/dano, foco canalizador)",
      "Robe do Arquimago (+5 na Defesa e Resistências, ampliador de CD)",
      "Tesouro Triplo de Escala S"
    ],
    taticas: "Ferren Asloth é uma ameaça de Escala S (ND S), invulnerável ao combate frontal padrão de aventureiros mortais. Em combate, abre com Magia Acelerada para erguer mortos-vivos de até ND 19 (como Necrodracos ou Senhores das Múmias) com Despertar dos Mortos e conjurar Velocidade. Usa Presença Opressora (CD 55) e Sacrificar Servo para anular qualquer dano iminente. Conjuradores que tentem lançar feitiços contra ele sofrem com Conhecimento Sequestrado (CD 55) e Contramágica Superior (dois d20). Seus ataques em área (Ferver Sangue e Toque da Morte) dizimam regimentos inteiros. No clímax do Ato III da campanha CASSANDRA, Ferren funciona como uma força avassaladora da qual o grupo deve fugir desesperadamente pelos canais e pela ponte de Milothiann!",
    roleplay: {
      personalidade: "Frio, aristocrático, megalomaníaco e de intelecto colossal. Enxerga os mortais como insetos transitórios e trata a necromancia como a apoteose da ordem natural.",
      citacao: "'Vocês rastejam sob o sol acreditando na própria liberdade... mas a terra, o céu e até o sopro nos seus pulmões pertencem ao senhor de Aslothia.'",
      notasMestre: "Ficha oficial de Tormenta 20 (Ameaças de Arton, ND S). No Ato III de CASSANDRA, demonstre o poder avassalador de Ferren: mesmo que os heróis façam rolagens heroicas, a Defesa 66, RD 20, Presença Opressora CD 55 e Contramágica Superior deixam claro que a missão é sobreviver e guiar Cassandra até a ponte antes que a fortaleza seja engolida pelas trevas!"
    }
  },

  guardas_aslavi: {
    id: "guardas_aslavi",
    name: "Guardas de Aslavi",
    role: "Guarnição do Portão (Esqueletos de Elite & Aparição)",
    category: "ameaca",
    nd: 5,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Morto-vivo Médio (Guarnição de Sentinelas)",
    tamanho: "Médio",
    deslocamento: "9m (6q)",
    description: "Os quatro guardas do portão são esqueletos de elite (Tormenta20, p. 283). Os dois que ficam no topo da torre usam bestas pesadas (+17, 1d12+5, 19), mas também podem atacar com espadas. O oficial do portão é uma aparição (Tormenta20, p. 283). Mesmo de dia, ela não sofre os efeitos de exposição a luz solar, pois o clima em Aslavi é sempre encoberto. Se o combate durar mais de cinco rodadas, no início da sexta, 1d4+1 esqueletos surgem (normais, não de elite).",
    atributos: {
      for: 18,
      des: 16,
      con: 14,
      int: 10,
      sab: 10,
      car: 10
    },
    pericias: [
      { nome: "Percepção", mod: 10 },
      { nome: "Pontaria", mod: 17 },
      { nome: "Luta", mod: 14 },
      { nome: "Iniciativa", mod: 10 }
    ],
    combatStats: {
      pv: 110,
      pm: 0,
      defesa: 22,
      iniciativa: 10,
      rd: "5/corte ou impacto",
      sentidos: "Visão no Escuro, Percepção +10",
      resistencias: [
        "Imunidades Padrão de Morto-vivo",
        "Oficial Aparição Incorpóreo (50% de chance de ignorar ataques corpóreos mundanos)",
        "Redução de Dano 5/corte ou impacto nos esqueletos"
      ],
      ataques: [
        {
          nome: "Besta Pesada da Torre",
          teste: "Pontaria +17",
          mod: 17,
          dano: "1d12+5",
          tipo: "Perfuração",
          alcance: "Longo (90m)",
          critico: "19/x2",
          especial: "Disparada pelos 2 esqueletos no topo da torre com bônus de elevação."
        },
        {
          nome: "Espada Longa dos Guardas",
          teste: "Luta +14",
          mod: 14,
          dano: "1d8+5",
          tipo: "Corte",
          alcance: "Corpo a corpo",
          critico: "19/x2"
        },
        {
          nome: "Toque Incorpóreo da Aparição",
          teste: "Toque +15",
          mod: 15,
          dano: "2d8+4",
          tipo: "Trevas",
          alcance: "Corpo a corpo",
          especial: "Ataque de toque ignora armadura. Alvo deve passar em Fortitude CD 19 ou sofre 1d4 de dreno de Força."
        }
      ],
      habilidades: [
        {
          nome: "Céu Encoberto de Aslavi",
          tipoAcao: "Passiva",
          desc: "Mesmo durante o dia, a Aparição oficial do portão não sofre qualquer penalidade ou dano por exposição à luz solar, pois o clima em Aslavi é perpetuamente cinzento e nublado."
        },
        {
          nome: "Reforço Necromântico (6ª Rodada)",
          tipoAcao: "Gatilho de Turno",
          desc: "Se o combate durar mais de cinco rodadas, no início da sexta rodada 1d4+1 esqueletos comuns (normais, não de elite) emergem das criptas para reforçar a guarnição."
        }
      ]
    },
    equipamentos: [
      "Bestas pesadas com virotes de aço",
      "Espadas longas antigas e escudos reforçados",
      "Restos de armaduras de Aslavi"
    ],
    taticas: "Os dois esqueletos do topo da torre disparam continuamente com suas bestas pesadas (+17, 1d12+5, 19) focando conjuradores e alvos sem cobertura. Os outros dois esqueletos travam combate corporal com espadas na entrada. A aparição oficial atravessa paredes e portões para drenar a Força dos guerreiros na linha de frente. Se os aventureiros demorarem mais de 5 rodadas, reforços de 1d4+1 esqueletos chegam no 6º turno.",
    roleplay: {
      personalidade: "Implacáveis, silenciosos e eternamente vigilantes nos portões de Aslavi.",
      citacao: "'Os portões de Aslavi só se abrem para os mortos e para os convidados de honra... vocês não são nenhum dos dois.'",
      notasMestre: "Encontro oficial de Tormenta20 (p. 283). Permita que personagens furtivos usem o nevoeiro de Aslavi para contornar ou emboscar a torre."
    }
  },

  sihnion_sillion: {
    id: "sihnion_sillion",
    name: "Sihnion & Sillion",
    role: "Gêmeos Espadachins / Nobres Arrogantes do Leilão",
    category: "antagonista",
    nd: 5,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Elfo 14, Médio",
    tamanho: "Médio",
    deslocamento: "12m (8q)",
    description: "Esses três elfos arrogantes acham que merecem uma vida de luxo na alta sociedade, e que participar de um leilão de Aslavi é o caminho para isso. Sihnion e Sillion são gêmeos e espadachins formidáveis. Os dois estão dispostos a roubar e matar para conseguir o que almejam!",
    atributos: {
      for: 11,
      des: 24,
      con: 16,
      int: 16,
      sab: 8,
      car: 10
    },
    pericias: [
      { nome: "Acrobacia", mod: 18 },
      { nome: "Intimidação", mod: 11 },
      { nome: "Iniciativa", mod: 18 },
      { nome: "Percepção", mod: 12 },
      { nome: "Luta", mod: 22 }
    ],
    combatStats: {
      pv: 70,
      pm: 0,
      defesa: 26,
      iniciativa: 18,
      rd: 0,
      sentidos: "Percepção +12, Visão na Penumbra",
      resistencias: [
        "Fortitude +10, Reflexos +20, Vontade +10"
      ],
      ataques: [
        {
          nome: "Florete Duplo Pungente (x2)",
          teste: "Luta +22",
          mod: 22,
          dano: "1d6+14",
          tipo: "Perfuração",
          alcance: "Corpo a corpo",
          critico: "17/x2",
          especial: "Dois ataques com floretes por ação padrão. Acerto crítico causa +1d10 de dano extra (total 2d6+1d10+14)!"
        },
        {
          nome: "Adaga Arremessada",
          teste: "Pontaria +18",
          mod: 18,
          dano: "1d4+10",
          tipo: "Perfuração",
          alcance: "Curto (9m)",
          critico: "19/x2"
        }
      ],
      habilidades: [
        {
          nome: "Gêmeos Espadachins",
          tipoAcao: "Passiva",
          desc: "Tanto Sihnion quanto Sillion fazem dois ataques com seus floretes por ação padrão. Além disso, se fizerem um acerto crítico, causam +1d10 de dano extra (para um total devastador de 2d6+1d10+14)."
        }
      ]
    },
    equipamentos: [
      "Adaga x2",
      "Florete pungente de mitral (crítico 17)",
      "Couro batido reforçado sob medida"
    ],
    tesouro: "Padrão",
    taticas: "Os gêmeos sincronizam seus passos com Acrobacia +18 para flanquear e cercar os heróis mais frágeis. Cada ação padrão deles desfere dois estocadas com o florete (+22, dano 1d6+14). Com margem de ameaça 17, buscam o acerto crítico freneticamente para somar +1d10 de dano (2d6+1d10+14).",
    roleplay: {
      personalidade: "Vaidosos, cruéis, impacientes e esnobes. Riem do equipamento alheio e desprezam não-elfos.",
      citacao: "'Vocês não passam de pedras no caminho para a alta sociedade de Aslavi. Um golpe limpo de mitral basta para encerrar essa discussão.'",
      notasMestre: "Lutam em conjunto com sua irmã mais velha Siora (ND 6). Se Siora cair, tornam-se agressivos e imprudentes."
    }
  },

  siora: {
    id: "siora",
    name: "Siora",
    role: "Bruxa Élfica / Líder do Trio de Elfos",
    category: "antagonista",
    nd: 6,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Elfa 16, Média",
    tamanho: "Médio",
    deslocamento: "12m (8q)",
    description: "Siora é a irmã mais velha dos gêmeos Sihnion e Sillion, e uma bruxa poderosa e ardilosa. É o cérebro por trás da ambição do trio de roubar e matar para conquistar luxo no leilão de Aslavi. Conjuradora impiedosa, domina necromancia destrutiva e magias de trevas.",
    atributos: {
      for: 8,
      des: 20,
      con: 14,
      int: 24,
      sab: 10,
      car: 14
    },
    pericias: [
      { nome: "Conhecimento", mod: 21 },
      { nome: "Misticismo", mod: 23 },
      { nome: "Iniciativa", mod: 19 },
      { nome: "Percepção", mod: 16 },
      { nome: "Vontade", mod: 14 }
    ],
    combatStats: {
      pv: 64,
      pm: 71,
      defesa: 23,
      iniciativa: 19,
      rd: 0,
      sentidos: "Percepção +16, Visão na Penumbra",
      resistencias: [
        "Fortitude +10, Reflexos +15, Vontade +14"
      ],
      ataques: [
        {
          nome: "Adaga de Mitral",
          teste: "Luta +13",
          mod: 13,
          dano: "1d4-1",
          tipo: "Perfuração",
          alcance: "Corpo a corpo",
          critico: "19/x2"
        }
      ],
      magias: [
        {
          nome: "Crânio Voador de Vladislav",
          custoPM: 10,
          cd: 25,
          escola: "Necromancia",
          alcance: "Médio",
          duracao: "Instantânea",
          desc: "Siora lança a magia pagando 10 PM para disparar crânios voadores necróticos que causam 7d8+7 pontos de dano em três alvos diferentes simultaneamente! Reflexos CD 25 reduz à metade."
        },
        {
          nome: "Amedrontar",
          custoPM: 1,
          cd: 25,
          escola: "Necromancia",
          alcance: "Curto",
          duracao: "1d4 rodadas",
          desc: "Alvo deve passar em Vontade CD 25 ou fica apavorado e foge. Se passar, fica abalado por 1 rodada."
        },
        {
          nome: "Manto de Sombras",
          custoPM: 3,
          cd: 25,
          escola: "Ilusão",
          alcance: "Pessoal",
          duracao: "Cena",
          desc: "Sombras escuras cobrem o corpo de Siora, conferindo camuflagem (ataques contra ela têm 20% de chance de falha) e +10 em testes de Furtividade."
        },
        {
          nome: "Tentáculos de Trevas",
          custoPM: 3,
          cd: 25,
          escola: "Convocação / Trevas",
          alcance: "Médio (Esfera 6m)",
          duracao: "Cena",
          desc: "Tentáculos negros surgem do piso agarrando todos na área. Criaturas presas sofrem 4d6 de dano de trevas por rodada e têm o deslocamento zerado."
        }
      ]
    },
    equipamentos: [
      "Adaga de mitral",
      "Vestes arcanas escuras de veludo",
      "Focos necromânticos de Aslavi"
    ],
    tesouro: "Padrão",
    taticas: "Siora inicia o combate na retaguarda conjurando Manto de Sombras para se proteger. Em seguida, lança Tentáculos de Trevas (CD 25) para prender os combatentes heróicos e desfere o devastador Crânio Voador de Vladislav pagando 10 PM para infligir 7d8+7 de dano em três alvos simultâneos. Se alguém ameaçar se aproximar, castiga com Amedrontar (CD 25).",
    roleplay: {
      personalidade: "Calculista, arrogante, cruel e manipuladora.",
      citacao: "'Meus irmãos são a distração perfeita para que minha magia parta suas almas em pedaços.'",
      notasMestre: "Irmã mais velha de Sihnion e Sillion. Possui 71 PM, o que lhe permite usar o Crânio Voador aprimorado várias vezes durante o combate!"
    }
  },

  dazan_vampiro: {
    id: "dazan_vampiro",
    name: "Dazan, o Vampiro Falido",
    role: "Vampiro Decadente & Faminto",
    category: "antagonista",
    nd: 11,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Morto-vivo 16, Médio (Vampiro Fatigado)",
    tamanho: "Médio",
    deslocamento: "6m (reduzido pela condição Fatigado)",
    description: "Dazan é um vampiro que já viu dias muito melhores. Ao descobrir que os personagens possuem um convite valioso para a mansão Bac Arat, deseja visitar a mansão a qualquer custo e tenta roubá-los. Porém, atormentado por uma fome insaciável, não consegue resistir e bebe o sangue de outro hóspede da taverna — servindo como a pista definitiva para que o grupo o encontre. Dazan tem as estatísticas de um Vampiro de Tormenta20 (p. 284), mas com a condição Fatigado pela fraqueza da fome.",
    atributos: {
      for: 18,
      des: 20,
      con: 18,
      int: 14,
      sab: 14,
      car: 20
    },
    pericias: [
      { nome: "Luta", mod: 21 },
      { nome: "Furtividade", mod: 18 },
      { nome: "Percepção", mod: 18 },
      { nome: "Enganação", mod: 18 },
      { nome: "Iniciativa", mod: 18 },
      { nome: "Vontade", mod: 17 }
    ],
    combatStats: {
      pv: 136,
      pm: 45,
      defesa: 30,
      iniciativa: 18,
      rd: "10/mágico ou prata",
      sentidos: "Percepção +18, Visão no Escuro, Faro",
      resistencias: [
        "Fortitude +16, Reflexos +18, Vontade +17",
        "Redução de Dano 10/mágico ou prata",
        "Condição Fatigado permanente até saciar a fome (–2 em Força e Destreza já computado)",
        "Imunidades Padrão de Morto-vivo"
      ],
      ataques: [
        {
          nome: "Mordida Vampírica Faminta",
          teste: "Luta +21",
          mod: 21,
          dano: "2d6+9",
          tipo: "Perfuração",
          alcance: "Corpo a corpo",
          critico: "x2",
          especial: "Ao atingir ou agarrar uma criatura, Dazan realiza Dreno de Sangue: a vítima perde 1d4 de Constituição e Dazan recupera imediatamente 15 PV!"
        },
        {
          nome: "Garras Famintas (x2)",
          teste: "Luta +21",
          mod: 21,
          dano: "1d8+9",
          tipo: "Corte",
          alcance: "Corpo a corpo",
          critico: "19/x2"
        }
      ],
      habilidades: [
        {
          nome: "Condição Fatigado (Fome Atroz)",
          tipoAcao: "Passiva / Penalidade",
          desc: "Pela fome extrema, Dazan sofre –2 em Força e Destreza (já descontado em suas perícias e ataques), desloca-se a metade da velocidade e não pode correr."
        },
        {
          nome: "Dreno de Sangue",
          tipoAcao: "Ação Padrão (ou com Mordida)",
          desc: "Ao morder um alvo indefeso ou agarrado, drena seu sangue causando 1d4 pontos de dano de Constituição e curando 15 PV de Dazan."
        },
        {
          nome: "Olhar Hipnótico",
          tipoAcao: "Ação Padrão (3 PM)",
          custoPM: 3,
          cd: 24,
          desc: "Alvo em alcance curto que olhe nos olhos de Dazan deve fazer teste de Vontade CD 24 ou fica paralisado/fascinado até o próximo turno dele."
        },
        {
          nome: "Forma de Névoa / Morcego",
          tipoAcao: "Ação Padrão (3 PM)",
          custoPM: 3,
          desc: "Dazan pode assumir forma de névoa gasosa (RD 20, voo 6m) ou forma de morcego gigante para tentar escapar ou surpreender inimigos."
        },
        {
          nome: "Regeneração 10",
          tipoAcao: "Início de Turno",
          desc: "Dazan recupera 10 PV no início de cada um de seus turnos. Dano de fogo ou luz solar cancela a regeneração nessa rodada."
        }
      ]
    },
    equipamentos: [
      "Fraque aristocrático rasgado e manchado",
      "Anel de sinete desgastado",
      "Capa de veludo poeirenta"
    ],
    taticas: "Desesperado por sangue para recuperar sua força total, Dazan usa o Olhar Hipnótico (CD 24) para imobilizar o herói mais saudável e cravar suas presas com a Mordida Vampírica (+21, drena 1d4 Con e recupera 15 PV). Se for reduzido a menos de 40 PV, transmuta-se em névoa (3 PM) para fugir pelas frestas da taverna.",
    roleplay: {
      personalidade: "Dramático, nervoso, decadente e faminto. Alterna entre elegância aristocrática e fúria animalesca.",
      citacao: "'Vocês não entendem o que é ter sangue nobre e a garganta queimando em agonia seca... entreguem o convite de Bac Arat e um pouco de veia!'",
      notasMestre: "Monstro oficial de Tormenta20 (p. 284). A condição Fatigado o torna vulnerável a táticas inteligentes dos jogadores."
    }
  },

  enxame_papadiim: {
    id: "enxame_papadiim",
    name: "Enxame de Papa-Dim",
    role: "Monstro Comedor de Moedas & Ouro",
    category: "ameaca",
    nd: 8,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Monstro 10, Grande (Enxame de Bolsas Vorazes)",
    tamanho: "Grande",
    deslocamento: "6m (4q)",
    description: "Esta criatura parece uma bolsa de moedas viva com um metro de altura, dourada, gelatinosa e levemente translúcida. Dentro de seu corpo, é possível ver diversos objetos pequeninos, que fazem um tilintar alto quando ela se locomove saltando. Tritura com dentinhos afiados tudo que vê pela frente em busca de ouro e joias. Se a vítima não tiver nada valioso, continua a chafurdar seu corpo até destroçar órgãos em busca de uma mísera moeda. A lenda diz que nasceram de algibeiras esquecidas que absorveram a ganância de seus donos, habitando a lendária 'Floresta dos Papa-Dim' nos jardins de Bac Arat.",
    atributos: {
      for: 20,
      des: 14,
      con: 20,
      int: 6,
      sab: 10,
      car: 6
    },
    pericias: [
      { nome: "Percepção", mod: 22 },
      { nome: "Iniciativa", mod: 8 },
      { nome: "Fortitude", mod: 14 }
    ],
    combatStats: {
      pv: 150,
      pm: 0,
      defesa: 14,
      iniciativa: 8,
      rd: "Metade do dano de ataques com armas",
      sentidos: "Percepção +22, Visão no Escuro, Faro para Ouro",
      resistencias: [
        "Fortitude +14, Reflexos +11, Vontade +5",
        "Imune a manobras de combate e a efeitos de alvo único sem dano",
        "Sofre apenas metade do dano de ataques com armas",
        "Sofre 50% a mais de dano por efeitos de área"
      ],
      ataques: [
        {
          nome: "Enxame Voraz (Fim do Turno)",
          teste: "Dano Automático",
          dano: "6d6+5",
          tipo: "Perfuração",
          alcance: "Espaço ocupado pelo enxame",
          especial: "No fim de seu turno, causa 6d6+5 de dano de perfuração automaticamente a qualquer personagem no espaço ocupado pelo enxame!"
        }
      ],
      habilidades: [
        {
          nome: "Mordida Trituradora",
          tipoAcao: "Reação ao Dano",
          desc: "Uma criatura que sofra dano do enxame precisa fazer um teste de Fortitude (CD 20). Se falhar, fica atordoada por uma rodada e sangrando."
        },
        {
          nome: "Enxame",
          tipoAcao: "Passiva",
          desc: "Pode entrar no espaço ocupado por outros personagens. Imune a manobras e feitiços de alvo único sem dano. Sofre apenas metade do dano de ataques com armas, mas sofre 50% a mais de dano por efeitos de área."
        },
        {
          nome: "Ganância Voraz",
          tipoAcao: "Fraqueza / Distração",
          desc: "Se um personagem jogar para o enxame moedas ou objetos no valor de T$ 100 ou mais, os papa-dim se concentram avidamente em devorar os objetos, ficando atordoados por uma rodada inteira!"
        }
      ]
    },
    equipamentos: [],
    tesouro: "Moedas e gemas no valor de T$ 6d6 x 100 no interior dos corpos gelatinosos.",
    taticas: "O enxame avança pulando até invadir o espaço do aventureiro mais reluzente ou com armadura metálica. No fim de seu turno, causa 6d6+5 de perfuração automático e força o teste de Fortitude CD 20 (atordoamento e sangramento). Aventureiros espertos podem atirar moedas (T$ 100+) para atordoar a criatura por uma rodada enquanto atacam com magias de área (+50% dano).",
    roleplay: {
      personalidade: "Frenético, insaciável e movido pelo tilintar hipnótico do ouro.",
      citacao: "*Tilintar metálico ecoando em dentes afiados mastigando ouro puro*",
      notasMestre: "Monstro 10 Grande. Excelente oportunidade tática para os heróis usarem seus tesouros mundanos para ganhar tempo contra a massa de 150 PV."
    }
  },

  irmas_medusas: {
    id: "irmas_medusas",
    name: "Irmãs Medusas",
    role: "Trio de Medusas Barraqueiras / Cultistas de Sszzaas",
    category: "antagonista",
    nd: 10,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Monstro 14, Médio",
    tamanho: "Médio",
    deslocamento: "9m (6q)",
    description: "As três irmãs medusas barraqueiras são cultistas ardilosas de Sszzaas, o Deus da Traição (Tormenta20, p. 291). Estão presentes no leilão da mansão Bac Arat em busca de objetos mágicos e artefatos poderosos, mas o que mais adoram é armar intrigas, causar barracos violentos e semear confusão para pilhar o leilão na surdina.",
    atributos: {
      for: 12,
      des: 22,
      con: 16,
      int: 16,
      sab: 14,
      car: 20
    },
    pericias: [
      { nome: "Enganação", mod: 20 },
      { nome: "Furtividade", mod: 18 },
      { nome: "Iniciativa", mod: 16 },
      { nome: "Percepção", mod: 16 },
      { nome: "Pontaria", mod: 20 },
      { nome: "Luta", mod: 18 }
    ],
    combatStats: {
      pv: 120,
      pm: 35,
      defesa: 28,
      iniciativa: 16,
      rd: 0,
      sentidos: "Percepção +16, Visão no Escuro",
      resistencias: [
        "Fortitude +12, Reflexos +18, Vontade +14",
        "Imunidade completa a Venenos e Peçonhas"
      ],
      ataques: [
        {
          nome: "Arco Longo com Peçonha de Sszzaas",
          teste: "Pontaria +20",
          mod: 20,
          dano: "1d8+8",
          tipo: "Perfuração",
          alcance: "Médio (30m)",
          critico: "x3",
          especial: "Injeta veneno cultista: Fortitude CD 22 evita ou sofre 2d12 de perda de PV e condição Envenenado."
        },
        {
          nome: "Mordida de Serpentes Cabeludas",
          teste: "Luta +18",
          mod: 18,
          dano: "1d4+6",
          tipo: "Perfuração",
          alcance: "Corpo a corpo",
          especial: "As serpentes na cabeça mordem e injetam veneno de Sszzaas (Fortitude CD 22 ou 2d12 de perda de PV)."
        },
        {
          nome: "Adaga Oculta de Serpente",
          teste: "Luta +18",
          mod: 18,
          dano: "1d4+8",
          tipo: "Perfuração",
          alcance: "Corpo a corpo",
          critico: "19/x2"
        }
      ],
      habilidades: [
        {
          nome: "Olhar Petrificante",
          tipoAcao: "Ação Padrão (3 PM)",
          custoPM: 3,
          cd: 23,
          desc: "Qualquer criatura em alcance curto (9m) que mire os olhos de uma das medusas deve fazer um teste de Fortitude (CD 23). Se falhar, fica Lenta. Se falhar uma segunda vez enquanto estiver Lenta, seu corpo vira pedra permanentemente (Petrificado)!"
        },
        {
          nome: "Bote da Traição de Sszzaas",
          tipoAcao: "Passiva",
          desc: "Causa +2d6 pontos de dano adicional contra criaturas que estejam flanqueadas, desprevenidas ou sob efeito do Olhar Petrificante."
        }
      ]
    },
    equipamentos: [
      "Arco longo magistral de madeira escura",
      "Aljava com flechas envenenadas de Sszzaas",
      "Vestidos exóticos de gala para o leilão",
      "Adagas cerimoniais curvas"
    ],
    tesouro: "Dobro (joias e itens mágicos saqueados do leilão)",
    taticas: "As medusas agem espalhadas no salão. Cada uma busca contato visual com alvos diferentes usando Olhar Petrificante (CD 23) para desacelerar e petrificar o grupo, enquanto disparam flechas venenosas (+20, dano 1d8+8 mais 2d12 veneno). Se acuadas, usam Enganação +20 para fingir rendição e dar um golpe traiçoeiro.",
    roleplay: {
      personalidade: "Barraqueiras, venenosas, zombeteiras e ardilosas ao extremo.",
      citacao: "'Olhe nos meus olhos, querido... promete que não vai virar mármore antes de eu pegar sua carteira?'",
      notasMestre: "Monstro oficial de Tormenta20 (p. 291). Três medusas agindo em sinergia aumentam imensamente a letalidade do encontro devido a três testes de petrificação por rodada."
    }
  },

  guardia_cofre: {
    id: "guardia_cofre",
    name: "Guardiã do Cofre",
    role: "Hidra Monstruosa de Bac Arat",
    category: "ameaca",
    nd: 11,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Monstro 16, Enorme",
    tamanho: "Enorme",
    deslocamento: "9m (6q), natação 9m",
    description: "A guardiã do cofre da mansão Bac Arat é uma hidra colossal de escamas negras (Tormenta20, p. 291). É uma criatura ancestral e implacável colocada para dilacerar qualquer ladrão que ouse invadir as câmaras de tesouro. Caso o combate esteja excessivamente difícil para o grupo, lembre os personagens de que eles podem fugir!",
    atributos: {
      for: 26,
      des: 12,
      con: 22,
      int: 2,
      sab: 12,
      car: 6
    },
    pericias: [
      { nome: "Percepção", mod: 18 },
      { nome: "Iniciativa", mod: 10 },
      { nome: "Fortitude", mod: 18 }
    ],
    combatStats: {
      pv: 220,
      pm: 0,
      defesa: 24,
      iniciativa: 10,
      rd: 5,
      sentidos: "Percepção +18, Faro, Visão na Penumbra",
      resistencias: [
        "Fortitude +18, Reflexos +12, Vontade +10",
        "Redução de Dano 5"
      ],
      ataques: [
        {
          nome: "Mordidas Múltiplas da Hidra (x5 a x7)",
          teste: "Luta +22",
          mod: 22,
          dano: "2d8+12",
          tipo: "Perfuração",
          alcance: "Corpo a corpo (alcance natural 3m)",
          critico: "x2",
          especial: "A hidra pode desferir um ataque de mordida por cabeça viva a cada rodada! (Começa com 5 cabeças ativas)."
        }
      ],
      habilidades: [
        {
          nome: "Cabeças Múltiplas",
          tipoAcao: "Passiva",
          desc: "A hidra começa com 5 cabeças ativas. Para atacar uma cabeça específica, é preciso declarar um golpe com –4 de penalidade. Uma cabeça é decepada se sofrer pelo menos 30 pontos de dano cortante."
        },
        {
          nome: "Regeneração Monstruosa & Duplicação",
          tipoAcao: "Início de Turno",
          desc: "A hidra recupera 20 PV no início de cada um de seus turnos. Para cada cabeça decepada, duas novas cabeças brotam no início de seu próximo turno (concedendo +40 PV e mais um ataque de mordida), a menos que o ferimento sofra dano de Fogo ou Ácido antes disso!"
        },
        {
          nome: "Conselho Tático do Mestre",
          tipoAcao: "Aviso de Narrativa",
          desc: "Caso o combate esteja difícil demais ou as cabeças comecem a se multiplicar descontroladamente, lembre expressamente os personagens de que eles podem fugir e trancar as pesadas portas do cofre!"
        }
      ]
    },
    equipamentos: [],
    tesouro: "O conteúdo inteiro do cofre protegido de Bac Arat.",
    taticas: "A hidra não tem piedade: morde todos os alvos ao seu alcance com suas 5 cabeças (+22, 2d8+12). Conforme sofre dano, se os personagens deceparem cabeças sem aplicar fogo ou ácido, a hidra regenera 20 PV por rodada e adiciona novas cabeças, tornando-se ainda mais letal.",
    roleplay: {
      personalidade: "Feroz, territorial e voraz.",
      citacao: "*Rugidos estrondosos sincronizados de cinco cabeças famintas ecoando pelo cofre de mármore*",
      notasMestre: "Monstro oficial de Tormenta20 (p. 291). Lembre aos heróis da regra de fogo e ácido para cauterizar os cotos."
    }
  },

  assassino_putrefato: {
    id: "assassino_putrefato",
    name: "Assassino Putrefato",
    role: "Agente Necromântico de Elite de Aslothia",
    category: "ameaca",
    nd: 9,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Morto-vivo 13, Médio",
    tamanho: "Médio",
    deslocamento: "9m (6q)",
    description: "Agentes de elite da coroa de Aslothia, essas criaturas são ladrões, bandoleiros e outros criminosos executados pelas autoridades do reino e então reanimados por necromancia. Em suas novas existências, usam suas antigas habilidades clandestinas — potencializadas pelos poderes sombrios da não-vida — e são completamente leais ao regente Ferren Asloth. Figuras soturnas e silenciosas, sempre com o corpo e o rosto completamente cobertos por bandana, chapéu e luvas. Se despidos, revelam corpos semidecompostos cobertos de tatuagens arcanas que emitem um sinistro brilho roxo pulsante — pura energia negativa.",
    atributos: {
      for: 14,
      des: 24,
      con: 14,
      int: 13,
      sab: 13,
      car: 6
    },
    pericias: [
      { nome: "Acrobacia", mod: 16 },
      { nome: "Furtividade", mod: 19 },
      { nome: "Iniciativa", mod: 17 },
      { nome: "Percepção", mod: 11 },
      { nome: "Luta", mod: 21 }
    ],
    combatStats: {
      pv: 78,
      pm: 0,
      defesa: 27,
      iniciativa: 17,
      rd: "10/mágico",
      sentidos: "Percepção +11, Visão no Escuro",
      resistencias: [
        "Fortitude +8, Reflexos +17, Vontade +11",
        "Redução de Dano 10/mágico",
        "Resistência a Magia +5 em testes de resistência",
        "Evasão Aprimorada",
        "Imunidades Padrão de Morto-vivo"
      ],
      ataques: [
        {
          nome: "Espada Púrpura Necrótica",
          teste: "Luta +21",
          mod: 21,
          dano: "1d8+10 + 4d8 trevas",
          tipo: "Corte + Trevas",
          alcance: "Corpo a corpo",
          critico: "19/x2",
          especial: "Causa 4d8 de dano de trevas e sangramento cumulativo de 2d6 PV por rodada!"
        },
        {
          nome: "Ataque Furtivo Necrótico",
          teste: "Luta +21",
          mod: 21,
          dano: "+7d6",
          tipo: "Trevas / Furtivo",
          especial: "Uma vez por rodada contra alvos desprevenidos ou flanqueados."
        }
      ],
      habilidades: [
        {
          nome: "Emanação de Trevas",
          tipoAcao: "Ação Padrão",
          desc: "O assassino putrefato emana tentáculos de energia negativa que envolvem uma criatura viva em alcance médio. A criatura sofre 6d8+6 pontos de dano de trevas e fica Fatigada. Um teste de Fortitude (CD 24) reduz o dano à metade e evita a condição."
        },
        {
          nome: "Espada Púrpura Amaldiçoada",
          tipoAcao: "Passiva no Ataque",
          desc: "Alimenta-se da energia negativa de seus crimes. Criatura viva atingida sofre 4d8 de trevas e fica sangrando (cumulativo: 2d6 PV de dano por rodada). Se o assassino morrer, a arma se desfaz em pó e ferrugem."
        },
        {
          nome: "Evasão Aprimorada",
          tipoAcao: "Reação Defensiva",
          desc: "Quando sofre um efeito que permite teste de Reflexos para reduzir dano à metade, o assassino não sofre dano algum se passar, e sofre apenas metade do dano se falhar."
        },
        {
          nome: "Vulto Mortal",
          tipoAcao: "Ação de Movimento",
          desc: "Usa energia negativa corporal para criar um manto de sombras que o recobre até o fim da cena. Recebe camuflagem (ataques contra ele sofrem 20% de chance de falha), +10 em Furtividade e pode fintar como ação de movimento."
        }
      ]
    },
    equipamentos: [
      "Couro batido ajustado, reforçado e abascanto",
      "Espada púrpura singular de energia sombria",
      "Kit de ladrão profissional de Aslothia",
      "Bandana, chapéu de abas largas e luvas escuras"
    ],
    tesouro: "Metade",
    taticas: "O assassino putrefato inicia o combate ativando Vulto Mortal (ação de movimento para ganhar 20% de camuflagem e +10 Furtividade). Move-se pelas sombras para desferir a Espada Púrpura com Ataque Furtivo (+21, 1d8+10 + 4d8 trevas + 7d6 furtivo + sangramento 2d6/rodada). Contra alvos distantes ou guerreiros pesados, desfere Emanação de Trevas (6d8+6 trevas e fadiga, Fort CD 24). Graças à Evasão Aprimorada e RD 10/mágico, é extremamente escorregadio.",
    roleplay: {
      personalidade: "Frio, mudo, focado e absolutamente leal ao Conde Ferren Asloth.",
      citacao: "*Sussurro cadavérico inaudível saindo por baixo da bandana de couro*",
      notasMestre: "Morto-vivo 13 Médio oficial. O sangramento da Espada Púrpura é cumulativo (cada acerto adiciona 2d6/rodada de perda contínua de PV)!"
    }
  },

  ra_assassina: {
    id: "ra_assassina",
    name: "Rà",
    role: "Assassina Ilusionista & Mercenária Performer",
    category: "antagonista",
    nd: 11,
    aventura: "O Leilão de Aslavi / Mansão Bac Arat",
    tipo: "Humana 18, Média",
    tamanho: "Médio",
    deslocamento: "12m (8q)",
    description: "Esta assassina profissional é famosa no submundo do Reinado e além. Mulher alta e esguia em vestimentas exóticas e chamativas que combinam com seu estilo de luta espalhafatoso — mesclando golpes acrobáticos de florete, truques de ilusão e Bolas de Fogo destruidoras. Seu lema é fazer de todo ato uma bela performance. Boatos dizem que possui habilidades inigualáveis de mimetismo. Foi contratada pelo próprio Conde Ferren Asloth para impedir que o 'Pulmão da Montanha' caia em mãos erradas. Sua autoconfiança desmedida e voz estridente escondem uma periculosidade extrema.",
    atributos: {
      for: 12,
      des: 22,
      con: 16,
      int: 18,
      sab: 12,
      car: 22
    },
    pericias: [
      { nome: "Acrobacia", mod: 21 },
      { nome: "Atuação", mod: 25 },
      { nome: "Enganação", mod: 21 },
      { nome: "Jogatina", mod: 21 },
      { nome: "Iniciativa", mod: 27 },
      { nome: "Percepção", mod: 16 },
      { nome: "Luta", mod: 27 }
    ],
    combatStats: {
      pv: 90,
      pm: 60,
      defesa: 29,
      iniciativa: 27,
      rd: 0,
      sentidos: "Percepção +16",
      resistencias: [
        "Fortitude +12, Reflexos +23, Vontade +16",
        "Imunidade completa a Atordoamento e Encantamento",
        "Evasão Aprimorada"
      ],
      ataques: [
        {
          nome: "Florete Magnífico",
          teste: "Luta +27",
          mod: 27,
          dano: "1d6+15",
          tipo: "Perfuração",
          alcance: "Corpo a corpo",
          critico: "16/x2",
          especial: "Margem de ameaça 16. Pode desferir até 4 ataques por rodada sob efeito de Velocidade e Espetáculo Mortal!"
        }
      ],
      magias: [
        {
          nome: "Bola de Fogo",
          custoPM: 9,
          cd: 25,
          escola: "Evocação",
          alcance: "Médio",
          duracao: "Instantânea",
          desc: "Explosão flamejante lançada com 9 PM causando 12d6 pontos de dano de fogo em esfera de 6m. Reflexos CD 25 reduz à metade."
        },
        {
          nome: "Toque Vampírico",
          custoPM: 10,
          cd: 25,
          escola: "Necromancia",
          alcance: "Junto do Florete",
          duracao: "Instantânea",
          desc: "Lança a magia junto com um ataque de florete gastando 10 PM. Causa +12d6 pontos de dano de trevas além do dano normal do florete e recupera metade do dano em PV!"
        },
        {
          nome: "Imagem Espelhada",
          custoPM: 7,
          cd: 25,
          escola: "Ilusão",
          alcance: "Pessoal",
          duracao: "Cena",
          desc: "Rà gasta 7 PM para criar seis cópias ilusórias idênticas de si mesma, recebendo impressionantes +12 de bônus na Defesa!"
        },
        {
          nome: "Velocidade",
          custoPM: 3,
          cd: 25,
          escola: "Transmutação",
          alcance: "Pessoal",
          duracao: "Sustentada",
          desc: "Rà ganha uma ação padrão adicional em cada um de seus turnos (permitindo atacar 4 vezes ou atacar 2 vezes e conjurar uma magia)."
        },
        {
          nome: "Amedrontar",
          custoPM: 1,
          cd: 25,
          escola: "Necromancia",
          alcance: "Curto",
          desc: "Vontade CD 25 ou apavorado por 1d4 rodadas."
        },
        {
          nome: "Criar Ilusão",
          custoPM: 1,
          cd: 25,
          escola: "Ilusão",
          alcance: "Médio",
          desc: "Cria imagens ou sons ilusórios perfeitos para despistar oponentes."
        },
        {
          nome: "Disfarce Ilusório",
          custoPM: 1,
          cd: 25,
          escola: "Ilusão",
          alcance: "Pessoal",
          desc: "Altera instantaneamente sua aparência para qualquer criatura que já tenha visto."
        },
        {
          nome: "Leque Cromático",
          custoPM: 1,
          cd: 25,
          escola: "Ilusão",
          alcance: "Cone 4,5m",
          desc: "Cone de luzes cintilantes atordoa e cega alvos fracos."
        }
      ],
      habilidades: [
        {
          nome: "Distração Teatral",
          tipoAcao: "Reação (1x/rodada)",
          custoPM: 2,
          desc: "Uma vez por rodada, quando atingida por um ataque, Rà pode gastar 2 PM para fazer um teste de Atuação (+25). Se o resultado for maior que o ataque do oponente, ela evita o ataque completamente!"
        },
        {
          nome: "Espetáculo Mortal",
          tipoAcao: "Ação Livre (Combate)",
          custoPM: 1,
          desc: "Quando usa a ação atacar, gasta 1 PM para fazer um ataque adicional com a mesma arma. Ao lançar uma magia com ação padrão, gasta 1 PM para fazer um ataque corpo a corpo como ação livre!"
        },
        {
          nome: "Evasão Aprimorada",
          tipoAcao: "Reação Defensiva",
          desc: "Quando sofre um ataque que permite teste de Reflexos para reduzir o dano à metade, não sofre dano algum se passar, e sofre apenas metade se falhar."
        },
        {
          nome: "Sortuda",
          tipoAcao: "Reação Livre",
          custoPM: 3,
          desc: "Pode gastar 3 PM para rolar novamente um teste recém-realizado (apenas uma vez por teste)."
        }
      ]
    },
    equipamentos: [
      "Armadura de couro ajustada, reforçada e defensora (+1 Defesa)",
      "Florete magnífico (+2 no ataque/dano, margem de ameaça 16)",
      "Kit de disfarces de alta nobreza e cosméticos arcanos"
    ],
    taticas: "Rà abre o combate conjurando Velocidade para ter uma ação padrão extra a cada rodada. Com isso, desfere quatro ataques de florete por rodada (graças a Espetáculo Mortal) ou ataca duas vezes e lança uma magia destrutiva. Se pressionada, conjura Imagem Espelhada (7 PM para +12 na Defesa, elevando-a para Defesa 41!). Quando atingida, ativa Distração Teatral (Atuação +25 gastando 2 PM) para anular o golpe. Se sofrer dano real, responde com Toque Vampírico (+12d6 dano de trevas e cura metade em PV). Se quiser liquidar grupos, lança Bola de Fogo (12d6 dano por 9 PM).",
    roleplay: {
      personalidade: "Dramática, megalomaníaca, infantil quando perde em apostas e implacável em batalha.",
      citacao: "'A vida é apenas um palco vulgar... e vocês acabaram de receber o papel principal no meu massacre favorito!'",
      notasMestre: "Humana 18 de ND 11. Um dos combates mais dinâmicos e desafiadores da aventura pelo leque de reações defensivas (Distração, Imagem Espelhada, Evasão Aprimorada) e ataques velozes."
    }
  }
};

