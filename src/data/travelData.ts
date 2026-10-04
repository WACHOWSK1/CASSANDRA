export interface TravelEvent {
  id: string;
  numero: number;
  type: 'bom' | 'ruim';
  titulo: string;
  subtitulo: string;
  narrativa: string;
  efeitoMecanico: string;
  recompensaOuPenalidade: string;
  testeRequerido?: {
    pericia: string;
    cd: number;
    sucesso: string;
    falha: string;
  };
  dicasMestre?: string;
  aplicarEfeito?: {
    tipo: 'cura_total' | 'salvo_conduto' | 'condicao_fatigado' | 'condicao_fraco' | 'carroca_avariada' | 'racoes_perdidas' | 'pv_temp';
    valor?: number;
  };
}

export const GOOD_TRAVEL_EVENTS: TravelEvent[] = [
  {
    id: "bom_1",
    numero: 1,
    type: "bom",
    titulo: "Clareira Sagrada de Lena",
    subtitulo: "Nascente de Águas Cristalinas",
    narrativa: "Uma clareira verdejante oculta pela vegetação emana uma fragrância de jasmins e paz profunda. As águas da fonte restauram o ânimo de quem as bebe.",
    efeitoMecanico: "Descanso imediato e revigorante para todo o grupo.",
    recompensaOuPenalidade: "Todos os personagens recuperam PV e PM máximos; remove condições de Fatigado e Fraco.",
    aplicarEfeito: { tipo: "cura_total" },
    dicasMestre: "Descreva a sensação de acolhimento e renovação espiritual antes das terras cinzentas de Portsmouth."
  },
  {
    id: "bom_2",
    numero: 2,
    type: "bom",
    titulo: "Caravana de Mercadores Rebeldes",
    subtitulo: "Aliados Ocultos de Yuvalin",
    narrativa: "Uma caravana disfarçada de transporte de grãos transporta suprimentos clandestinos para a resistência contra Khorcova.",
    efeitoMecanico: "Obtenção de salvo-conduto oficial falso e rações de qualidade.",
    recompensaOuPenalidade: "Ganha Selo de Salvo-Conduto Ativo (+2 em testes sociais nos postos de guarda).",
    aplicarEfeito: { tipo: "salvo_conduto" },
    dicasMestre: "O líder da caravana reconhece os heróis ou traz saudações veladas de Helena."
  },
  {
    id: "bom_3",
    numero: 3,
    type: "bom",
    titulo: "Atalho Élfico nas Colinas",
    subtitulo: "Trilhas Antigas de Lenórienn",
    narrativa: "Marcas entalhadas em troncos centenários revelam uma vereda esquecida que contorna postos de fiscalização da estrada principal.",
    efeitoMecanico: "Redução de tempo de viagem em 6 horas.",
    recompensaOuPenalidade: "Avança 6 horas de viagem sem consumo de rações adicionais.",
    dicasMestre: "Permite evitar um posto de patrulha e chegar com antecedência."
  },
  {
    id: "bom_4",
    numero: 4,
    type: "bom",
    titulo: "Bênção de Valkaria na Estrada",
    subtitulo: "Santuário dos Viajantes Audazes",
    narrativa: "Uma estátua desgastada da Deusa da Ambição ergue-se à beira da encruzilhada. Um raio de sol rompe as nuvens e banha os heróis com coragem.",
    efeitoMecanico: "+10 Pontos de Vida Temporários para todos os membros do grupo.",
    recompensaOuPenalidade: "+10 PV Temporários válidos até o fim do próximo combate.",
    aplicarEfeito: { tipo: "pv_temp", valor: 10 },
    dicasMestre: "Incentive os heróis a declararem sua determinação para resgatar Cassandra."
  },
  {
    id: "bom_5",
    numero: 5,
    type: "bom",
    titulo: "Refúgio de Caçadores Solitários",
    subtitulo: "Cabana Escondida com Mantimentos",
    narrativa: "Uma cabana camuflada entre carvalhos oferece abrigo aquecido contra o sereno cortante da noite.",
    efeitoMecanico: "Abastecimento de suprimentos de viagem.",
    recompensaOuPenalidade: "O grupo obtém +6 rações de viagem e mapas detalhados dos arredores.",
    dicasMestre: "Excelente momento para interação entre os personagens e descanso seguro."
  },
  {
    id: "bom_6",
    numero: 6,
    type: "bom",
    titulo: "Guarda Deseritor Arrependido",
    subtitulo: "Informações Secretas de Khorcova",
    narrativa: "Um ex-sentinela de Milothiann que abandonou o posto entrega anotações sobre as senhas de guarda dos portões.",
    efeitoMecanico: "+2 em todas as jogadas de Enganação e Furtividade no Ato I.",
    recompensaOuPenalidade: "Bônus de +2 em testes de infiltração nos portões de Milothiann.",
    dicasMestre: "O desertor alerta sobre o fanatismo crescente dos inquisidores de Severian."
  },
  {
    id: "bom_7",
    numero: 7,
    type: "bom",
    titulo: "Poção Alquímica Preservada",
    subtitulo: "Achado em Ruínas de Carruagem",
    narrativa: "Em meio aos destroços de uma carruagem abandonada, um frasco com lacre intacto contém um elixir de restauração.",
    efeitoMecanico: "Recuperação de 2d8+5 PV para um aliado à escolha do mestre/grupo.",
    recompensaOuPenalidade: "1 Frasco de Bálsamo Restaurador Adquirido.",
    dicasMestre: "Pode ser guardado para ser utilizado em momentos críticos de combate."
  },
  {
    id: "bom_8",
    numero: 8,
    type: "bom",
    titulo: "Vento Favorável nos Desfiladeiros",
    subtitulo: "Marcha Veloz e Clima Seco",
    narrativa: "Um vento constante dissipa a névoa úmida e seca o lamaçal da estrada, permitindo que os cavalos trotem com vigor renovado.",
    efeitoMecanico: "A carroça viaja o dobro da distância nas próximas 4 horas sem cansaço.",
    recompensaOuPenalidade: "Tempo de marcha reduzido em 4 horas.",
    dicasMestre: "Descreva o alívio dos animais e a visão clara das torres distantes de Milothiann."
  },
  {
    id: "bom_9",
    numero: 9,
    type: "bom",
    titulo: "Minstrel Itinerante de Valkaria",
    subtitulo: "Canção de Glória e Firmeza",
    narrativa: "Um bardo solitário compartilha o fogo da noite e canta sobre grandes resgates do passado, fortalecendo os corações.",
    efeitoMecanico: "+2 em testes de Vontade durante as próximas 24 horas.",
    recompensaOuPenalidade: "Bônus moral de +2 em Vontade contra efeitos de medo e ilusão.",
    dicasMestre: "O bardo toca uma canção melancólica que lembra Cassandra."
  },
  {
    id: "bom_10",
    numero: 10,
    type: "bom",
    titulo: "Ervas Raras de Portsmouth",
    subtitulo: "Folhas de Sombra Prateada",
    narrativa: "Um canteiro selvagem de ervas raras de Portsmouth é descoberto por um herói atento.",
    efeitoMecanico: "Permite neutralizar venenos ou curar 1d6 PM para um arcanista.",
    recompensaOuPenalidade: "2 Cargas de Ervas de Foco (recuperam 1d6 PM cada).",
    dicasMestre: "Muito útil para magos e clérigos que gastaram mana no caminho."
  }
];

export const BAD_TRAVEL_EVENTS: TravelEvent[] = [
  {
    id: "ruim_1",
    numero: 1,
    type: "ruim",
    titulo: "Emboscada de Salteadores Gnolls",
    subtitulo: "Matilha Faminta nas Colinas",
    narrativa: "Uivos ecoam pelas encostas rochosas. Três hienas monstruosas e gnolls armados com cimitarras bloqueiam o passo estreito.",
    efeitoMecanico: "Combate rápido ou teste de Sobrevivência/Intimidação CD 20 para afugentar.",
    recompensaOuPenalidade: "Em falha, o grupo sofre 2d8 de dano físico e gasta 2 rações na confusão.",
    testeRequerido: {
      pericia: "Sobrevivência ou Intimidação",
      cd: 20,
      sucesso: "A matilha é dispersada sem baixas.",
      falha: "O grupo sofre 2d8 de dano e perde 2 rações."
    },
    aplicarEfeito: { tipo: "racoes_perdidas", valor: 2 },
    dicasMestre: "Se houver combate, resolva em 2 rodadas narrativas para manter o ritmo ágil."
  },
  {
    id: "ruim_2",
    numero: 2,
    type: "ruim",
    titulo: "Eixo da Carroça Quebrado",
    subtitulo: "Acidente nas Pedras da Estrada",
    narrativa: "Um estalo seco ressoa sob o assoalho. A roda traseira cede em uma vala profunda, tombando parte da carga na lama.",
    efeitoMecanico: "A carroça fica avariada. Exige 4 horas de reparos ou teste de Ofício CD 18.",
    recompensaOuPenalidade: "Condição da carroça passa para 'Avariada'. Marcha atrasada em 4 horas.",
    aplicarEfeito: { tipo: "carroca_avariada" },
    dicasMestre: "O atraso eleva a urgência da contagem do tempo antes do ritual de Severian."
  },
  {
    id: "ruim_3",
    numero: 3,
    type: "ruim",
    titulo: "Tempestade Ácida de Portsmouth",
    subtitulo: "Nuvens Tóxicas dos Ermos",
    narrativa: "Gotas verde-escuras e corrosivas começam a cair dos céus carregados, corroendo couros e queimando a pele exposta.",
    efeitoMecanico: "Teste de Fortitude CD 18 para todos os personagens.",
    recompensaOuPenalidade: "Quem falhar recebe a condição 'Fatigado' (-2 em atributos físicos).",
    testeRequerido: {
      pericia: "Fortitude",
      cd: 18,
      sucesso: "O personagem se abriga a tempo sem sequelas.",
      falha: "Fica Fatigado até o próximo descanso completo."
    },
    aplicarEfeito: { tipo: "condicao_fatigado" },
    dicasMestre: "Descreva a atmosfera tóxica e opressiva do reino inquisitorial de Portsmouth."
  },
  {
    id: "ruim_4",
    numero: 4,
    type: "ruim",
    titulo: "Patrulha de Caçadores de Magos",
    subtitulo: "Inquisição com Cães Arcanos",
    narrativa: "Cavaleiros de manto negro com armaduras completas e cães farejadores de essência mágica cruzam a estrada com tochas acesas.",
    efeitoMecanico: "Teste de Furtividade ou Enganação CD 19.",
    recompensaOuPenalidade: "Em falha, o Alerta da aventura aumenta em +1 antes mesmo de chegar a Milothiann.",
    testeRequerido: {
      pericia: "Furtividade ou Enganação",
      cd: 19,
      sucesso: "A patrulha passa reto sem notar os arcanistas.",
      falha: "Alerta aumenta em +1 nos registros de Khorcova."
    },
    dicasMestre: "Tensão pura: os arcanistas do grupo precisam esconder seus grimórios e amuletos."
  },
  {
    id: "ruim_5",
    numero: 5,
    type: "ruim",
    titulo: "Pântano de Lodo Movediço",
    subtitulo: "Desvio Traiçoeiro na Trilha",
    narrativa: "A lama negra engole as patas dos cavalos até os joelhos. A carruagem começa a afundar lentamente no lodaçal fétido.",
    efeitoMecanico: "Teste de Atletismo CD 20 para resgatar os animais e a carga.",
    recompensaOuPenalidade: "Em falha, perda de 3 rações de viagem e todos ficam cobertos de lodo (-2 social).",
    aplicarEfeito: { tipo: "racoes_perdidas", valor: 3 },
    dicasMestre: "Exige trabalho conjunto de força e perícia entre os membros do grupo."
  },
  {
    id: "ruim_6",
    numero: 6,
    type: "ruim",
    titulo: "Água Contaminada no Acampamento",
    subtitulo: "Febre do Pântano",
    narrativa: "O riacho onde o grupo reabasteceu os cantis continha resíduos de alquimia proibida das minas abandonadas.",
    efeitoMecanico: "Teste de Fortitude CD 19 contra envenenamento.",
    recompensaOuPenalidade: "Quem falhar recebe a condição 'Fraco' (-2 em testes numéricos).",
    aplicarEfeito: { tipo: "condicao_fraco" },
    dicasMestre: "Personagens com conhecimento de cura podem ajudar a purificar a água restante."
  },
  {
    id: "ruim_7",
    numero: 7,
    type: "ruim",
    titulo: "Turba de Fanáticos Religiosos",
    subtitulo: "Zelotas da Purificação",
    narrativa: "Uma procissão de fanáticos com tochas e correntes vasculha viajantes em busca de 'pecadores e feiticeiros heréticos'.",
    efeitoMecanico: "Teste de Diplomacia ou Intimidação CD 20.",
    recompensaOuPenalidade: "Em falha, o grupo é forçado a dar uma volta demorada (+6 horas de marcha).",
    dicasMestre: "O confronto armado chamaria atenção indesejada das autoridades."
  },
  {
    id: "ruim_8",
    numero: 8,
    type: "ruim",
    titulo: "Névoa Ilusória de Khorcova",
    subtitulo: "Miragens e Desorientação",
    narrativa: "Uma névoa roxa sussurram vozes familiares nos ouvidos dos heróis, fazendo o condutor errar a rota nos desfiladeiros.",
    efeitoMecanico: "Teste de Vontade CD 18 para manter o foco.",
    recompensaOuPenalidade: "O grupo perde 4 horas andando em círculos antes de achar o marco correto.",
    dicasMestre: "As ilusões projetam sussurros de Cassandra pedindo socorro no escuro."
  },
  {
    id: "ruim_9",
    numero: 9,
    type: "ruim",
    titulo: "Ponte de Madeira Desabada",
    subtitulo: "Ravina Profunda sobre o Rio",
    narrativa: "A ponte principal que cruza o cânion teve suas vigas serradas recentemente. Uma queda seria fatal.",
    efeitoMecanico: "Exige perícia de Ladinagem/Sobrevivência CD 20 para improvisar travessia.",
    recompensaOuPenalidade: "Em falha, a carroça precisa contornar pela serra (+8 horas de viagem).",
    dicasMestre: "Indícios de sabotagem feita pelos servos de Severian para atrasar reforços."
  },
  {
    id: "ruim_10",
    numero: 10,
    type: "ruim",
    titulo: "Espiões Corvos da Inquisição",
    subtitulo: "Olhos de Severian nos Céus",
    narrativa: "Aves mecânicas com olhos de rubi sobrevoam a carroça em círculos concêntricos, transmitindo coordenadas mágicas.",
    efeitoMecanico: "Teste de Pontaria CD 18 ou Misticismo CD 18 para abater os espiões a tempo.",
    recompensaOuPenalidade: "Em falha, Severian descobre a aproximação exata (+1 Alerta em Milothiann).",
    dicasMestre: "Se destruídos com sucesso, os heróis recuperam pequenas engrenagens de valor."
  }
];
