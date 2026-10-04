export type ItemCategory = 'documento' | 'artefato' | 'mecanismo' | 'especial';

export interface ItemCheck {
  pericia: string;
  cd: number;
  efeito: string;
}

export interface SessionItem {
  id: string;
  nome: string;
  subtitulo: string;
  categoria: ItemCategory;
  icone: string;
  portadorOuLocal: string;
  resourceKey?: string;
  aparencia: string;
  funcaoNarrativa: string;
  mecanicaT20: string;
  testesEPericias?: ItemCheck[];
  limitesECustos?: string;
  dicaMestre?: string;
}

export const SESSION_ITEMS: Record<string, SessionItem> = {
  "ordem_helena": {
    id: "ordem_helena",
    nome: "Carta de Helena com Selo Oficial",
    subtitulo: "Ordens Secretas & Mandato de Resgate",
    categoria: "documento",
    icone: "FileText",
    portadorOuLocal: "Entregue por Cael em Yuvalin (Ato I)",
    resourceKey: "cartaHelena",
    aparencia: "Pergaminho de linho nobre selado com cera rubra e o brasão pessoal de Helena. O texto está cifrado com códigos diplomáticos.",
    funcaoNarrativa: "Comprova a legitimidade da missão do grupo e a autoridade moral de Helena para salvar Cassandra Crane.",
    mecanicaT20: "Concede +2 em testes sociais (Diplomacia/Enganação) contra guardas e aliados leais a Helena em Yuvalin e Portsmouth.",
    testesEPericias: [
      { pericia: "Investigação", cd: 15, efeito: "Decifra as anotações à margem sobre o informante Toma em Greywick." }
    ],
    limitesECustos: "Não possui validade perante inquisidores fanáticos de Severian.",
    dicaMestre: "Use para validar a confiança dos jogadores em Cael logo na primeira cena."
  },
  "livro_lavanderia": {
    id: "livro_lavanderia",
    nome: "Livro de Khorcova (Plantas dos Canais)",
    subtitulo: "Registros Hidráulicos da Fortaleza",
    categoria: "documento",
    icone: "BookOpen",
    portadorOuLocal: "Protegido por Toma em Greywick (Ato I)",
    resourceKey: "livroKhorcova",
    aparencia: "Tomo encadernado em couro impermeabilizado com anotações de fluxo de água e válvulas da ala subterrânea.",
    funcaoNarrativa: "Permite ao grupo navegar pelo canal da lavanderia com segurança sem ser esmagado pelas comportas.",
    mecanicaT20: "Reduz a CD do teste estendido de travessia do Canal da Lavanderia de 24 para CD 18.",
    testesEPericias: [
      { pericia: "Conhecimento / Ladinagem", cd: 18, efeito: "Identifica o momento exato de abertura dos drenos de resíduos." }
    ],
    limitesECustos: "Se for destruído em Greywick (Custo G2), o canal passa a exigir CD 24.",
    dicaMestre: "Um recurso estratégico valioso que recompensa a rota por Greywick."
  },
  "placa_funeraria": {
    id: "placa_funeraria",
    nome: "Placa Funerária de Mara (Brasão de Milothiann)",
    subtitulo: "Passe Nobre dos Crane",
    categoria: "documento",
    icone: "Shield",
    portadorOuLocal: "Recuperada com Toma em Greywick (Ato I)",
    resourceKey: "placaGreywick",
    aparencia: "Placa pesada de prata polida com o brasão esculpido da Casa Crane e inscrições memoriais de Milothiann.",
    funcaoNarrativa: "Permite ao grupo infiltrar-se no Cortejo Fúnebre aristocrático fingindo ser pranteadores nobres.",
    mecanicaT20: "Concede +2 em todos os testes do teste estendido do Cortejo Funerário (Rota A de Infiltração).",
    testesEPericias: [
      { pericia: "Enganação / Atuação", cd: 18, efeito: "Apresenta a placa aos guardas sem levantar a menor suspeita." }
    ],
    limitesECustos: "Válida apenas durante o cortejo fúnebre no portão norte.",
    dicaMestre: "Facilita muito a entrada sem gerar Nível de Alerta."
  },
  "sal_greywick": {
    id: "sal_greywick",
    nome: "Sais de Proteção Arcano",
    subtitulo: "Cristais Alquímicos de Defesa",
    categoria: "artefato",
    icone: "Sparkles",
    portadorOuLocal: "Obtidos em Greywick (Ato I)",
    resourceKey: "saisProtecao",
    aparencia: "Frascos de vidro grosso contendo sais brilhantes que crepitam com uma luz esbranquiçada.",
    funcaoNarrativa: "Substância que dissipa campos de antimagia menores e concede barreiras reflexivas.",
    mecanicaT20: "Cada frasco (até 3 cargas) pode ser consumido para conceder +5 em um teste de Vontade contra efeitos arcanos ou absorver 15 de dano de Essência.",
    testesEPericias: [
      { pericia: "Misticismo / Ofício (Alquimia)", cd: 15, efeito: "Arremessa o sal para criar uma área livre de antimagia de 1,5m por 1 rodada." }
    ],
    limitesECustos: "Recurso consumível; cada uso gasta 1 frasco.",
    dicaMestre: "Excelente contra as descargas de choque da arena dos pilonos."
  },
  "fagulha_preparada": {
    id: "fagulha_preparada",
    nome: "Fagulha Arcana de Cassandra",
    subtitulo: "Centelha Mágica Condensada",
    categoria: "mecanismo",
    icone: "Flame",
    portadorOuLocal: "Obtida no Enigma das Três Chamas (Ato I)",
    resourceKey: "fagulhaArcana",
    aparencia: "Uma labareda etérea de tonalidade lilás que levita dentro de um cilindro de cristal rúnico.",
    funcaoNarrativa: "Ressonância direta com o poder latente de Cassandra, permitindo sabotar redes ou abrir sua cela.",
    mecanicaT20: "Se usada para Sabotar: 1 Pilono começará destruído (+1 Alerta). Se Sinalizada: +2 no 1º teste de Khorcova. Se Guardada: Cela de Cassandra abre por reação livre!",
    limitesECustos: "Uso único; a escolha do destino é permanente para toda a aventura.",
    dicaMestre: "Deixe os jogadores debaterem a melhor estratégia para a fagulha."
  },
  "mascara_varek": {
    id: "mascara_varek",
    nome: "Máscara de Varek (Disfarce Ilusório)",
    subtitulo: "Artefato Metamorfo de Khorcova",
    categoria: "artefato",
    icone: "Eye",
    portadorOuLocal: "Espólio de Varek na Galeria dos Confiscados (Ato II)",
    resourceKey: "mascaraVarek",
    aparencia: "Máscara de porcelana flexível que se molda aos traços faciais do usuário quando colocada.",
    funcaoNarrativa: "Permite ao usuário assumir a aparência de oficiais de guarda ou nobres de Milothiann.",
    mecanicaT20: "Concede +2 em testes de Enganação e Furtividade Social para passar por patrulhas internas.",
    testesEPericias: [
      { pericia: "Enganação", cd: 18, efeito: "Imita a voz e maneirismos de um sentinela de Khorcova." }
    ],
    limitesECustos: "Não funciona dentro do campo de antimagia de 3m de um pilono ativo.",
    dicaMestre: "Ótima ferramenta para jogadores criativos que gostam de infiltração social."
  },
  "contrato_varek": {
    id: "contrato_varek",
    nome: "Contrato Oculto de Severian",
    subtitulo: "Provas de Alta Traição e Seitas",
    categoria: "documento",
    icone: "FileSignature",
    portadorOuLocal: "Encontrado com Varek ou nos Confiscados (Ato II)",
    resourceKey: "contratoSeverian",
    aparencia: "Pergaminho escuro com assinaturas rúnicas e o selo proibido da Oitava Estrela Profana.",
    funcaoNarrativa: "Prova irrefutável de que Severian pretendia sacrificar Cassandra em proveito próprio e trair a ordem de Portsmouth.",
    mecanicaT20: "Ao ser revelado, desmoraliza os inquisidores menores (penalidade de -2 em Vontade e Ataques dos capangas).",
    limitesECustos: "Não afeta o próprio Severian nem fanáticos cegos.",
    dicaMestre: "Pode ser exportado no relatório final como evidência contra a inquisição."
  },
  "machado_varek": {
    id: "machado_varek",
    nome: "Machado de Batalha Anátema Certeiro Pungente",
    subtitulo: "Arma Mágica do Caçador Arcano",
    categoria: "artefato",
    icone: "Swords",
    portadorOuLocal: "Empunhado por Varek na Galeria dos Confiscados (Ato II)",
    aparencia: "Machado de uma mão com lâmina de aço escuro rúnico, entalhado com preces a Azgher e fios condutores arcanos que canalizam relâmpagos.",
    funcaoNarrativa: "Arma pessoal de Varek, canalizadora do temível Ataque Arcano e Toque Chocante.",
    mecanicaT20: "Dano: 2d8+3d6+7 corte (Crítico 20/x3). Permite ao portador canalizar magias de toque (como Toque Chocante) como parte do teste de ataque físico.",
    limitesECustos: "Exige proficiência em armas marciais ou habilidade Ataque Arcano / Dançarino Marcial.",
    dicaMestre: "Se os jogadores derrotarem Varek, este machado pode ser recolhido como espólio de altíssimo valor."
  },
  "escudo_varek": {
    id: "escudo_varek",
    nome: "Escudo Pesado Abascanto Reforçado Rúnico",
    subtitulo: "Baluarte Anti-Magia de Azgher",
    categoria: "artefato",
    icone: "Shield",
    portadorOuLocal: "Empunhado por Varek na Galeria dos Confiscados (Ato II)",
    aparencia: "Escudo pesado com o símbolo solar de Azgher encravado em latão dourado e runas abascantas que repelem feitiços.",
    funcaoNarrativa: "O escudo protetor que permite a Varek encarar conjuradores de frente sem temer rajadas mágicas.",
    mecanicaT20: "Concede +3 na Defesa, RD Física 5 passiva em combate e +2 adicional em testes de resistência contra magias (material Abascanto).",
    limitesECustos: "Penalidade de armadura -2.",
    dicaMestre: "Excelente proteção para combatentes da linha de frente que sofrem contra conjuradores."
  },
  "sinete_aldren": {
    id: "sinete_aldren",
    nome: "Sinete Nobre dos Crane",
    subtitulo: "Herança e Legado Familiar",
    categoria: "especial",
    icone: "Award",
    portadorOuLocal: "Guardado por Aldren na Capela (Ato II)",
    resourceKey: "sineteCrane",
    aparencia: "Anel de ouro branco com uma pedra de safira entalhada com as três chamas da Casa Crane.",
    funcaoNarrativa: "Símbolo máximo de autoridade familiar. Sua partição ou aceitação sela o destino emocional de Cassandra.",
    mecanicaT20: "Se Partido: Liberta Cassandra do peso do passado (+2 em todos os testes no Ato III). Se Substituído: Transfere o fardo para Aldren.",
    limitesECustos: "Decisão moral irreversível tomada no Ato III.",
    dicaMestre: "Momento de interpretação profunda entre Aldren e Cassandra."
  },
  "nome_escolhido": {
    id: "nome_escolhido",
    nome: "O Nome Escolhido por Cassandra",
    subtitulo: "Afirmação de Identidade e Livre-Arbítrio",
    categoria: "especial",
    icone: "HeartHandshake",
    portadorOuLocal: "Decisão Narrativa no Clímax (Ato III)",
    resourceKey: "nomeEscolhido",
    aparencia: "Uma revelação de autodescoberta: Cassandra escolhe seu verdadeiro nome em vez do título imposto pelos inquisidores.",
    funcaoNarrativa: "Desperta todo o potencial arcano de Cassandra, quebrando as correntes da profecia e do medo.",
    mecanicaT20: "Cassandra torna-se imune a efeitos de controle mental e desespero; seus ataques causam +2d8 de Essência.",
    limitesECustos: "Exige que os heróis tenham apoiado sua autonomia durante a sessão.",
    dicaMestre: "O clímax emocional da aventura! Descreva a explosão de luz mágica ao redor dela."
  },
  "determinacao_familiar": {
    id: "determinacao_familiar",
    nome: "Determinação Familiar",
    subtitulo: "Vínculo Ancestral Restaurado",
    categoria: "especial",
    icone: "Activity",
    portadorOuLocal: "Destravado no Mausoléu dos Crane (Ato II)",
    resourceKey: "determinacaoFamiliar",
    aparencia: "Uma bênção mística concedida pelos espíritos dos antepassados Crane que repousam no mausoléu.",
    funcaoNarrativa: "Protege o espírito de Cassandra contra a possessão e rituais profanos de Severian.",
    mecanicaT20: "Concede permanentemente +2 em testes de Vontade para Cassandra durante os Atos II e III.",
    limitesECustos: "Obtido apenas se o mausoléu for destravado sem alarme.",
    dicaMestre: "Recompensa a atenção dos jogadores à história da família Crane."
  }
};
