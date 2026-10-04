export interface AlertRule {
  level: number;
  estado: string;
  sinalNarrativo: string;
  consequencias: {
    resumo: string[];
  };
}

export interface TransferClockRule {
  stage: number;
  situacao: string;
  efeitoNaCena: string;
}

export interface PassoMagia {
  passo: number;
  pergunta: string;
  aplicacao: string;
}

export interface CamadaAntimagia {
  nome: string;
  alcance: string;
  efeito: string;
  contorno: string;
}

export interface AcaoPilono {
  acao: string;
  teste: string;
  resultado: string;
  vantagem: string;
}

export interface AntimagiaRules {
  passoAPassoMagia: PassoMagia[];
  camadas: CamadaAntimagia[];
  acoesPilonos: AcaoPilono[];
}

export const ALERT_RULES: Record<number, AlertRule> = {
  0: {
    level: 0,
    estado: "Rotina Absoluta",
    sinalNarrativo: "Sentinelas conversam em voz baixa, tochas queimam em ritmo brando, portões abertos para trocas e cortejos.",
    consequencias: {
      resumo: [
        "Nenhuma suspeita sobre o grupo.",
        "CDs sociais e de furtividade padrão (sem penalidades).",
        "Patrulhas regulares e dispersas."
      ]
    }
  },
  1: {
    level: 1,
    estado: "Atenção Leve",
    sinalNarrativo: "Guardas conferem selos duas vezes nos postos, cães farejadores latiam ao longe nas muralhas.",
    consequencias: {
      resumo: [
        "Revistas mais detalhadas nas entradas secundárias.",
        "+2 em testes de Percepção dos guardas em áreas comuns."
      ]
    }
  },
  2: {
    level: 2,
    estado: "Suspeita Ativa",
    sinalNarrativo: "Sinos tocam nos pátios; portões externos fechados e vigiados por besteiros armados.",
    consequencias: {
      resumo: [
        "+2 em todas as CDs de Enganação e Furtividade.",
        "Guarnições duplicadas nos corredores principais de Khorcova."
      ]
    }
  },
  3: {
    level: 3,
    estado: "Sobreaviso Inquisitorial",
    sinalNarrativo: "Inquisidores de manto escarlate circulam com Lanternas Nulas acesas nos corredores.",
    consequencias: {
      resumo: [
        "Lanternas Nulas ativadas na Galeria dos Confiscados.",
        "Qualquer disparo arcano visível atrai reforços em 2 rodadas."
      ]
    }
  },
  4: {
    level: 4,
    estado: "Alarme Parcial",
    sinalNarrativo: "Grelhas de ferro baixadas nas passagens entre alas; sentinelas com ordens de atirar primeiro.",
    consequencias: {
      resumo: [
        "Bloqueios físicos aumentam CD de locomoção para 22.",
        "Inimigos recebem +2 em Iniciativa e Defesa por preparo tático."
      ]
    }
  },
  5: {
    level: 5,
    estado: "Cerco Interno",
    sinalNarrativo: "Gritos de 'Invasores nas masmorras!'; tambores de guerra ecoam pela fortaleza de Milothiann.",
    consequencias: {
      resumo: [
        "Relógio da Transferência avança automaticamente +1 estágio.",
        "Severian e suas elites entram em prontidão imediata na arena."
      ]
    }
  },
  6: {
    level: 6,
    estado: "Alerta Máximo / Bloqueio Total",
    sinalNarrativo: "Sirenes mágicas uivam; toda a fortaleza converge para a Capela e Criptas. Retirada bloqueada.",
    consequencias: {
      resumo: [
        "Reforços chegam a cada 2 rodadas em combate.",
        "A arena da Oitava Estrela opera em sobrecarga; fuga exige rotas de emergência."
      ]
    }
  }
};

export const TRANSFER_CLOCK_RULES: Record<number, TransferClockRule> = {
  0: {
    stage: 0,
    situacao: "Estágio 0: Cassandra nas Masmorras Profundas",
    efeitoNaCena: "Cassandra está trancada em sua cela de contenção original; tempo amplo para resgate."
  },
  1: {
    stage: 1,
    situacao: "Estágio 1: Preparativos de Escolta",
    efeitoNaCena: "Guardas de elite chegam para prender as correntes de contenção rúnica na cela."
  },
  2: {
    stage: 2,
    situacao: "Estágio 2: Em Trânsito pelos Corredores",
    efeitoNaCena: "Cassandra está sendo escoltada pela Galeria em direção ao Altar da Oitava Estrela."
  },
  3: {
    stage: 3,
    situacao: "Estágio 3: No Limiar da Capela do Altar",
    efeitoNaCena: "Cassandra está posicionada junto aos pilonos rituais. Resgate direto durante o confronto com Severian."
  }
};

export const ANTIMAGIA_RULES: AntimagiaRules = {
  passoAPassoMagia: [
    {
      passo: 1,
      pergunta: "O conjurador ou alvo está a até 3m de um Pilono Ativo?",
      aplicacao: "Se SIM: Antimagia Total. A magia não pode ser conjurada e itens mágicos ficam inativos. Sem teste."
    },
    {
      passo: 2,
      pergunta: "Está sob a luz de uma Lanterna Nula (9m)?",
      aplicacao: "Se SIM: Teste de Vontade CD 15 + custo em PM. Em falha, perde a ação e gasta os PMs. 1ª magia gera +1 Alerta."
    },
    {
      passo: 3,
      pergunta: "A rede de Pilonos tem unidades ativas na Arena?",
      aplicacao: "4 Pilonos: Vontade CD 20 + PM. 1-3 Pilonos: Vontade CD 15 + PM. 0 Pilonos: Conjuração normal."
    },
    {
      passo: 4,
      pergunta: "O conjurador está dentro de 3m de um Pilono Invertido?",
      aplicacao: "Área de Refúgio Seguro: Magias lançadas de dentro do refúgio ignoram penalidades da rede."
    }
  ],
  camadas: [
    {
      nome: "1. Núcleo dos Pilonos Arcanos",
      alcance: "3 metros de raio",
      efeito: "Campo de Antimagia Total e Absoluta. Magias e itens mágicos são completamente desativados.",
      contorno: "Destruir a estrutura física (Def 18, RD 10, 40 PV), inverter as runas (Misticismo CD 22) ou sair do raio de 3m."
    },
    {
      nome: "2. Esfera das Lanternas Nulas",
      alcance: "9 metros de raio",
      efeito: "Dificuldade severa de canalização. Exige teste de Vontade CD 15 + custo em PM.",
      contorno: "Fechar os obturadores de chumbo (Ladinagem CD 20) ou quebrar o cristal de foco (Def 18, RD 5, 15 PV)."
    },
    {
      nome: "3. Ressonância da Rede da Arena",
      alcance: "Toda a Arena do Altar",
      efeito: "Pressão mágica contínua em todos os conjuradores (Vontade CD 20 ou CD 15 dependendo de pilonos ativos).",
      contorno: "Neutralizar os pilonos individualmente para reduzir a CD e anular os escudos de Severian."
    },
    {
      nome: "4. Campo Invertido (Refúgio Aliado)",
      alcance: "3 metros ao redor de pilono invertido",
      efeito: "Bolha de proteção que anula as interferências antimágicas da arena e rebate raios em Severian.",
      contorno: "Criado com sucesso ao inverter as runas de um pilono ativo."
    }
  ],
  acoesPilonos: [
    {
      acao: "Destruição Física de Pilono",
      teste: "Ataque / Dano Físico (Def 18, RD 10, 40 PV)",
      resultado: "O pilono quebra em pedaços e sua chama se extingue permanentemente.",
      vantagem: "Reduz a Defesa de Severian em -2 e a RD em -4. Desativa 1 '1 PV Save'."
    },
    {
      acao: "Inversão de Runas com Magia",
      teste: "Misticismo ou Conhecimento CD 22 (Ação Padrão)",
      resultado: "As runas mudam de vermelho para azul etéreo e disparam um raio reverso em Severian.",
      vantagem: "Causa 10 a 35 de dano de Essência no chefe e cria um Refúgio Seguro de 3m para o grupo."
    },
    {
      acao: "Romper Suporte Estrutural (Tombar)",
      teste: "Atletismo ou Força Bruta CD 20 (Ação Padrão)",
      resultado: "O pilono tomba e seu campo de 3m aponta para o chão.",
      vantagem: "Fornece Cobertura (+5 na Defesa) e remove a linha de visão de Severian."
    }
  ]
};
