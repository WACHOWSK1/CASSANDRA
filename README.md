# CASSANDRA — Sistema de Apoio ao Mestre (Tormenta20)

> **Assistente Tático, Narrativo e Sonoro para a Campanha *O Resgate de Cassandra Crane & A Conspiração de Milothiann*.**

---

## 🌟 Visão Geral

**CASSANDRA** é uma aplicação moderna desenvolvida com Next.js 15, React 19, Tailwind CSS e Zustand, projetada para fornecer controle total ao Mestre de RPG durante as sessões de Tormenta20 (T20). O sistema centraliza navegação não-linear de cenas, simulação tática de combates contra chefes, fichas completas de NPCs/ameaças, gestão de recursos, relógios de sigilo/alerta e mesa de som dinâmica com trilhas sonoras contextuais.

---

## ⚔️ Principais Módulos & Recursos

### 1. Navegador de Cenas & Árvore da Aventura (Atos I, II e III)
- **Navegação Não-Linear:** Permite avançar aplicando efeitos automáticos nas variáveis da sessão ou saltar livremente para qualquer nó narrativo.
- **Caixas de Narração em Voz Alta:** Textos imersivos prontos para leitura na mesa.
- **Dicas do Mestre:** Conselhos táticos, CDs de perícias recomendadas e consequências de decisões morais.

### 2. Arenas Táticas Interativas de Combate
- **Arena de Varek, o Caçador Arcano (ND 8):**
  - Ficha oficial T20: Elfo Cativo das Fadas, Arcanista Bruxo 7 / Guerreiro 1 devoto de Azgher.
  - Trackers dinâmicos de PV (58 da ficha ou 120 escala Boss) e PM (58 PM).
  - Indicadores de Defesa (30/34), **RD Fogo 40**, **RD Física 5** e **Resistência a Magia +9** em todos os saves (Fort +20, Refl +22, Vont +17).
  - Rolagens em 1 clique:
    - ⚡ *Combo Devastador Machado AM + Toque Chocante 12 PM* (2d8+3d6+7 corte + 11d8+13 choque com vantagem).
    - ⚔️ *Segundo Golpe de Ataque Arcano Duplo*.
    - 🛡️ *Contramágica Aprimorada* (Misticismo +21).
    - 🪓 *Aparar Magia & Rebater no Conjurador* (Luta +13).
    - ⛓️ *Amarras Etéreas* (CD 19).
    - 💥 *Detonação da Runa de Proteção "Homem-Bomba"* (11d8+13 elétrico em área aos 0 PV).
- **Arena da Oitava Estrela: Inquisidor-Mor Severian (ND 12):**
  - Rede de 4 Pilonos Arcanos que alimentam Defesa dinâmica, RD e Regeneração de PV de Severian.
  - Ações interativas para os heróis destruírem pilonos fisicamente ou inverterem runas com Misticismo.
  - Escudo de Sacrifício ("1 PV Save").

### 3. Compêndio de Fichas de Personagens (T20)
- Fichas completas com atributos, perícias, defesas, ataques roláveis, magias detalhadas com custo em PM e táticas de condução para:
  - **Cassandra Crane** (Herdeira Conjuradora Desperta)
  - **Aldren Crane** (Veterano Inquisitorial e Guardião)
  - **Varek** (Caçador Arcano e Algoz de Severian)
  - **Inquisidor-Mor Severian**
  - **Cael** (Batedor de Yuvalin)
  - **Lady Helena de Yuvalin**
  - **Toma & Mara de Greywick**
  - **Sargento Sandro** & Ameaças

### 4. Gestão de Operações & Sigilo
- **Nível de Alerta de Milothiann (0 a 5):** Medidor visual com penalidades dinâmicas e reações de patrulha.
- **Relógio de Transferência (4 Estágios):** Contagem regressiva para a movimentação de Cassandra para o altar de sacrifício.
- **Lanternas Antimagia & Pilonos:** Controle das zonas seguras e supressão mágica.

### 5. Simulador de Viagem (Greywick a Milothiann)
- Sistema dinâmico de eventos aleatórios da estrada (clima severo, patrulhas de Portsmouth, batedores, ruínas).
- Gestão de rações, integridade da carroça, salvo-condutos e condições do grupo.

### 6. Mesa de Som & Áudio Catálogo
- Reprodução e transição fluida de faixas musicais e efeitos sonoros categorizados por intensidade emocional e ambiente (Combate, Tensão, Mistério, Desespero, Coragem, Taverna).
- Sugestão automática de trilhas com base no nó narrativo ativo.

### 7. Compêndio de Itens e Espólios
- Cartas detalhadas de documentos, artefatos e armas (como a *Máscara de Varek*, o *Machado Anátema Certeiro Pungente*, o *Escudo Abascanto Reforçado Rúnico* e o *Contrato Secreto de Severian*).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/), Radix UI Primitives, Lucide React Icons
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand) com persistência local (`localStorage`)
- **Regras:** Sistema Tormenta20 (Jambô Editora)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` ou `yarn`

### Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/WACHOWSK1/CASSANDRA.git

# Acesse o diretório
cd CASSANDRA

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para utilizar a aplicação.

---

## 📜 Licença

Este projeto é desenvolvido para uso pessoal e apoio a mesas de RPG de Tormenta20. Todos os direitos de Tormenta20 pertencem à Jambô Editora.
