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
    title: "Confronto Tático: Varek (Algoz de Severian)",
    type: "combat_arena",
    summary: "Varek (PV 120, Defesa 26, Furtividade +15).",
    combatConfig: {
      enemy: "Varek, o Metamorfo",
      pv: 120,
      defesa: 26,
      thresholds: [
        { pv: 60, event: "Varek tenta fugir para avisar Severian." },
        { pv: 30, event: "Se cercado, Varek se rende." },
        { pv: 0, event: "Varek é morto ou incapacitado." }
      ]
    },
    options: [
      {
        id: "VD_morto",
        target: "VI",
        label: "Varek é morto ou incapacitado em combate direto",
        badge: "Sem Testemunha / Severian Desprevenido",
        effects: {
          npcStatus: { varek: "morto" },
          resources: { mascaraVarek: true, contratoSeverian: true },
          log: "Varek foi derrotado. Máscara de Varek e Contrato secreto recuperados."
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
          log: "Varek se rendeu aos 30 PV."
        }
      },
      { id: "VD_fuga", target: "VE_FUGA", label: "Varek atinge 60 PV e dispara em fuga", badge: "Tentativa de Fuga" }
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
    name: "Cassandra Crane",
    role: "Herdeira da Linhagem Crane / Conjuradora Desperta",
    description: "Jovem nobre dotada de magia espontânea rara ligada à essência e aos Desejos arcanos. Determinada, perspicaz e recusando ser mera peça no tabuleiro de Severian.",
    combatStats: {
      pv: 48,
      pm: 32,
      defesa: 18,
      habilidades: [
        "Desejo Espontâneo (Reação, 3 PM): Concede +4 em um teste de perícia ou ataque de um aliado.",
        "Fagulha da Linhagem (Padrão, 2 PM): Disparo de 4d6 de essência (Reflexos CD 20 reduz metade).",
        "Determinação Familiar (+2 passivo em testes de Vontade contra medo e coerção se desbloqueado)."
      ]
    }
  },
  aldren: {
    name: "Aldren Crane",
    role: "Patriarca Crane / Antigo Cavaleiro Inquisitorial",
    description: "Guerreiro veterano marcado por cicatrizes e remorso, que aceitou a desonra para proteger Cassandra das maquinações de Milothiann.",
    combatStats: {
      pv: 95,
      defesa: 24,
      habilidades: [
        "Guardião Veterano: Concede +3 de Defesa e RD 5 passiva para Cassandra quando adjacente.",
        "Golpe Supressor (Padrão): Ataque corpo a corpo +14 (2d8+8 impacto) com manobra Derrubar gratuita.",
        "Sacrifício Inabalável: Pode interceptar qualquer ataque direcionado a Cassandra absorvendo o dano integral."
      ]
    }
  },
  varek: {
    name: "Varek, o Metamorfo",
    role: "Assassino e Espião de Severian",
    description: "Assassino frio capaz de mudar de forma e imitar vozes perfeitamente. Luta com agilidade acrobática e lâminas envenenadas.",
    combatStats: {
      pv: 120,
      defesa: 26,
      iniciativa: 18,
      habilidades: [
        "Adagas Duplas Envenenadas (+16/+16, dano 1d6+6 corte + 2d6 veneno de paralisia Fortitude CD 19).",
        "Disfarce Ilusório: Concede camuflagem e 2 reflexos ilusórios na 1ª rodada se não desmascarado.",
        "Bomba de Fumaça Alquímica (Movimento): Cria névoa densa e permite teste de Furtividade imediato."
      ]
    }
  },
  severian: {
    name: "Inquisidor-Mor Severian",
    role: "Alto Prelado da Inquisição de Khorcova",
    description: "Fanático ambicioso que manipula correntes de mana profana e os Pilonos de Milothiann.",
    combatStats: {
      pv: 150,
      defesa: 28,
      rd: "5 por pilono ativo",
      habilidades: [
        "Báculo de Ossos Santos (+18 corpo a corpo ou à distância, 3d8+10 trevas/essência).",
        "Ressonância dos Pilonos: Regenera 10 PV por turno para cada pilono em funcionamento.",
        "Julgamento Herético (Padrão, 4 PM): Explosão de chamas negras em cone de 9m (6d6 trevas, Reflexos CD 22 metade)."
      ]
    }
  },
  ferren: {
    name: "Ferren, a Entidade da Ascensão Profana",
    role: "Divindade em Ascensão / Escala S",
    description: "Colosso divino que transcende o plano mortal. Sua presença altera o clima, o solo e ressuscita os mortos. Inatingível por ataques mortais.",
    combatStats: {
      pv: "Infinito (Escala S)",
      defesa: "Inviolável",
      habilidades: [
        "Presença Apocalíptica: Toda a região de Milothiann sofre 2d6 de trevas e calor asfixiante a cada hora.",
        "Desintegração Espontânea: Qualquer projétil ou magia mortal direcionada a Ferren se desfaz em cinzas a 50m."
      ]
    }
  }
};
