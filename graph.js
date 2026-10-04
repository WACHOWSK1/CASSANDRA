/**
 * CASSANDRA: O Resgate e a Ascensão Profana
 * Renderizador de Grafo Interativo com Zoom por Scroll, Pan por Arrasto ("Mãozinha") e Centralização
 */

const GRAPH_ENGINE = {
    currentActView: 1,
    scale: 1,
    translateX: 0,
    translateY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    hasInitializedEvents: false,

    // Definição dos Nós Visuais para Renderização SVG dos 3 Atos
    actLayouts: {
        1: {
            title: "Ato I: A Jornada até Milothiann",
            width: 860,
            height: 1020,
            nodes: [
                { id: "S", label: "Partida de Yuvalin", x: 420, y: 50, type: "start" },
                { id: "C1", label: "Confiar em Cael", x: 260, y: 140, type: "outcome" },
                { id: "C2", label: "Atacar Cael", x: 580, y: 140, type: "outcome" },
                
                { id: "G", label: "Greywick (Toma & Mara)", x: 220, y: 240, type: "challenge" },
                { id: "E", label: "Estrada Real (+2 Alerta)", x: 430, y: 240, type: "outcome" },
                { id: "P", label: "Plano Próprio", x: 640, y: 240, type: "choice" },
                
                { id: "GS", label: "Greywick 5S (Alerta 0, Sais)", x: 120, y: 340, type: "outcome" },
                { id: "GC", label: "Greywick 3F (Escolha Custo)", x: 320, y: 340, type: "choice" },
                
                { id: "G1", label: "Suprimentos (-2 Viagem)", x: 220, y: 420, type: "outcome" },
                { id: "G2", label: "Livro Perdido (Canal CD 24)", x: 340, y: 420, type: "outcome" },
                { id: "G3", label: "Energia (-1d4 PM)", x: 460, y: 420, type: "outcome" },
                
                { id: "T1", label: "Toma Seguro com Cael", x: 140, y: 500, type: "outcome" },
                { id: "T2", label: "Outro Abrigo (+1 Alerta)", x: 320, y: 500, type: "outcome" },
                
                { id: "Q", label: "Enigma das Três Chamas", x: 420, y: 580, type: "puzzle" },
                { id: "Q1", label: "Disco Errado (1d6 Dano)", x: 650, y: 580, type: "outcome" },
                
                { id: "F1", label: "Fagulha: Sabotar (-1 Pilono)", x: 220, y: 670, type: "outcome" },
                { id: "F2", label: "Fagulha: Sinalizar (+2 Teste)", x: 420, y: 670, type: "outcome" },
                { id: "F3", label: "Fagulha: Guardada (Cela Inst)", x: 620, y: 670, type: "outcome" },
                
                { id: "A_CORTEJO", label: "Cortejo Funerário (3S/2F)", x: 120, y: 770, type: "challenge" },
                { id: "B_MERCENARIOS", label: "Mercenários (Sandro CD +2)", x: 320, y: 770, type: "challenge" },
                { id: "D_CANAL", label: "Canal Lavanderia (4S/2F)", x: 520, y: 770, type: "challenge" },
                { id: "X_PLANO", label: "Plano Inventado (3S/2F)", x: 720, y: 770, type: "challenge" },
                
                { id: "AS", label: "Cortejo Sucesso", x: 80, y: 860, type: "outcome" },
                { id: "AF", label: "Cortejo 2F (+2 Alerta)", x: 180, y: 860, type: "outcome" },
                { id: "B2", label: "Mercenários Sucesso", x: 270, y: 860, type: "outcome" },
                { id: "B3", label: "Mercenários 2F (Alerta 3)", x: 370, y: 860, type: "outcome" },
                { id: "D1", label: "Canal Sucesso", x: 470, y: 860, type: "outcome" },
                { id: "D2", label: "Canal Ferido (-2 Social)", x: 570, y: 860, type: "outcome" },
                { id: "X1", label: "Plano Concluído", x: 720, y: 860, type: "outcome" },
                
                { id: "M", label: "Mausoléu dos Crane", x: 420, y: 950, type: "start" }
            ],
            links: [
                { from: "S", to: "C1" }, { from: "S", to: "C2" },
                { from: "C1", to: "G" }, { from: "C1", to: "E" }, { from: "C1", to: "P" },
                { from: "C2", to: "G" }, { from: "C2", to: "E" }, { from: "C2", to: "P" },
                { from: "G", to: "GS" }, { from: "G", to: "GC" },
                { from: "GC", to: "G1" }, { from: "GC", to: "G2" }, { from: "GC", to: "G3" },
                { from: "GS", to: "T1" }, { from: "GS", to: "T2" },
                { from: "G1", to: "T1" }, { from: "G1", to: "T2" },
                { from: "G2", to: "T1" }, { from: "G2", to: "T2" },
                { from: "G3", to: "T1" }, { from: "G3", to: "T2" },
                { from: "T1", to: "Q" }, { from: "T2", to: "Q" }, { from: "E", to: "Q" }, { from: "P", to: "Q" },
                { from: "Q", to: "Q1" }, { from: "Q1", to: "Q" },
                { from: "Q", to: "F1" }, { from: "Q", to: "F2" }, { from: "Q", to: "F3" },
                { from: "F1", to: "A_CORTEJO" }, { from: "F1", to: "B_MERCENARIOS" }, { from: "F1", to: "D_CANAL" }, { from: "F1", to: "X_PLANO" },
                { from: "F2", to: "A_CORTEJO" }, { from: "F2", to: "B_MERCENARIOS" }, { from: "F2", to: "D_CANAL" }, { from: "F2", to: "X_PLANO" },
                { from: "F3", to: "A_CORTEJO" }, { from: "F3", to: "B_MERCENARIOS" }, { from: "F3", to: "D_CANAL" }, { from: "F3", to: "X_PLANO" },
                { from: "A_CORTEJO", to: "AS" }, { from: "A_CORTEJO", to: "AF" },
                { from: "B_MERCENARIOS", to: "B2" }, { from: "B_MERCENARIOS", to: "B3" },
                { from: "D_CANAL", to: "D1" }, { from: "D_CANAL", to: "D2" },
                { from: "X_PLANO", to: "X1" },
                { from: "AS", to: "M" }, { from: "AF", to: "M" },
                { from: "B2", to: "M" }, { from: "B3", to: "M" },
                { from: "D1", to: "M" }, { from: "D2", to: "M" },
                { from: "X1", to: "M" }
            ]
        },
        2: {
            title: "Ato II: O Resgate de Cassandra e o Confronto com Severian",
            width: 860,
            height: 1220,
            nodes: [
                { id: "M", label: "Mausoléu dos Crane", x: 420, y: 50, type: "start" },
                { id: "D1_MAUSOLEU", label: "Determinação Familiar", x: 220, y: 140, type: "outcome" },
                { id: "D2_PISTA", label: "Pista (CD 20)", x: 420, y: 140, type: "choice" },
                { id: "D3_ERRO", label: "Erro (+1 Alerta)", x: 620, y: 140, type: "outcome" },
                
                { id: "P1_MODIFICADO", label: "Mudança Tática (-1 Alerta)", x: 280, y: 230, type: "outcome" },
                { id: "P2_PADRAO", label: "Galeria dos Confiscados", x: 560, y: 230, type: "outcome" },
                
                { id: "V1_REVELADO", label: "Desmascarar Falsa Mara", x: 280, y: 320, type: "outcome" },
                { id: "V2_SURPRESA", label: "Surpresa de Varek", x: 560, y: 320, type: "outcome" },
                
                { id: "VF", label: "Confronto com Varek (120 PV)", x: 420, y: 410, type: "combat" },
                
                { id: "VI", label: "Varek Morto / Silencioso", x: 200, y: 500, type: "outcome" },
                { id: "VC", label: "Varek Rendido (30 PV)", x: 400, y: 500, type: "choice" },
                { id: "VE_FUGA", label: "Varek Fuga (60 PV)", x: 630, y: 500, type: "choice" },
                
                { id: "VP1", label: "Varek Capturado (+1 Alerta)", x: 540, y: 590, type: "outcome" },
                { id: "VP2", label: "Varek Escapa (+30 PV Sev)", x: 710, y: 590, type: "outcome" },
                
                { id: "TM1_SALVO", label: "Toma Salvo (-1 Alerta/+2)", x: 220, y: 680, type: "outcome" },
                { id: "TM2_DEIXADO", label: "Toma em Greywick", x: 420, y: 680, type: "outcome" },
                { id: "TM3_ESTRADA", label: "Estrada Real", x: 620, y: 680, type: "outcome" },
                
                { id: "O1_FAGULHA", label: "Fagulha Guardada (Abre Cela)", x: 140, y: 770, type: "outcome" },
                { id: "O2_LADINAGEM", label: "Ladinagem (3S/2F)", x: 320, y: 770, type: "challenge" },
                { id: "O3_FORCA", label: "Atletismo CD 30", x: 500, y: 770, type: "outcome" },
                { id: "O4_CONDUTOR", label: "Romper Condutor (30 PV)", x: 680, y: 770, type: "outcome" },
                
                { id: "RES_INTEGRA", label: "Cassandra Integra Grupo!", x: 420, y: 860, type: "outcome" },
                
                { id: "RA_CAPELA", label: "Capela (Aldren + 4 Pilonos)", x: 280, y: 950, type: "choice" },
                { id: "RB_SAIDA", label: "Ponte (3 Pilonos + 1S Fuga)", x: 560, y: 950, type: "outcome" },
                
                { id: "BOSS_SEVERIAN", label: "BOSS: Severian & Pilonos", x: 420, y: 1050, type: "combat" },
                { id: "VER_VERDADE", label: "A Verdade dos Crane", x: 420, y: 1150, type: "start" }
            ],
            links: [
                { from: "M", to: "D1_MAUSOLEU" }, { from: "M", to: "D2_PISTA" }, { from: "M", to: "D3_ERRO" },
                { from: "D2_PISTA", to: "M" }, { from: "D3_ERRO", to: "M" },
                { from: "D1_MAUSOLEU", to: "P1_MODIFICADO" }, { from: "D1_MAUSOLEU", to: "P2_PADRAO" },
                { from: "P1_MODIFICADO", to: "V1_REVELADO" }, { from: "P2_PADRAO", to: "V2_SURPRESA" },
                { from: "V1_REVELADO", to: "VF" }, { from: "V2_SURPRESA", to: "VF" },
                { from: "VF", to: "VI" }, { from: "VF", to: "VC" }, { from: "VF", to: "VE_FUGA" },
                { from: "VE_FUGA", to: "VP1" }, { from: "VE_FUGA", to: "VP2" },
                { from: "VI", to: "TM1_SALVO" }, { from: "VC", to: "TM1_SALVO" },
                { from: "VP1", to: "TM1_SALVO" }, { from: "VP2", to: "TM2_DEIXADO" },
                { from: "TM1_SALVO", to: "O1_FAGULHA" }, { from: "TM1_SALVO", to: "O2_LADINAGEM" },
                { from: "TM2_DEIXADO", to: "O3_FORCA" }, { from: "TM3_ESTRADA", to: "O4_CONDUTOR" },
                { from: "O1_FAGULHA", to: "RES_INTEGRA" }, { from: "O2_LADINAGEM", to: "RES_INTEGRA" },
                { from: "O3_FORCA", to: "RES_INTEGRA" }, { from: "O4_CONDUTOR", to: "RES_INTEGRA" },
                { from: "RES_INTEGRA", to: "RA_CAPELA" }, { from: "RES_INTEGRA", to: "RB_SAIDA" },
                { from: "RA_CAPELA", to: "BOSS_SEVERIAN" }, { from: "RB_SAIDA", to: "BOSS_SEVERIAN" },
                { from: "BOSS_SEVERIAN", to: "VER_VERDADE" }
            ]
        },
        3: {
            title: "Ato III: A Verdade dos Crane e a Fuga da Ascensão Profana",
            width: 860,
            height: 1220,
            nodes: [
                { id: "VER_VERDADE", label: "A Verdade dos Crane", x: 420, y: 50, type: "start" },
                { id: "C1_OUVIR", label: "Ouvir Aldren (Confissão)", x: 160, y: 140, type: "outcome" },
                { id: "C2_LER", label: "Ler Registros Objetivos", x: 330, y: 140, type: "outcome" },
                { id: "C3_ADIAR", label: "Adiar Conversa", x: 500, y: 140, type: "outcome" },
                { id: "C4_RECUSAR", label: "Recusar Justificativas", x: 670, y: 140, type: "outcome" },
                
                { id: "E_NOME", label: "Nome Escolhido Desperto", x: 420, y: 230, type: "outcome" },
                { id: "A_ASCENSAO", label: "Ascensão de Ferren (Escala S)", x: 420, y: 320, type: "choice" },
                { id: "F1_ESCALA_S", label: "Ataque Apodrece no Ar", x: 650, y: 320, type: "outcome" },
                
                { id: "CS1_ACEITA", label: "Cassandra Aceita Sinete", x: 200, y: 420, type: "outcome" },
                { id: "CS2_DISTANCIA", label: "Manter Distância", x: 420, y: 420, type: "outcome" },
                { id: "CS3_NEUTRO", label: "Adiar Resposta", x: 620, y: 420, type: "outcome" },
                
                { id: "IN1_BONUS", label: "Ouvir Instruções (+2 Teste)", x: 280, y: 510, type: "outcome" },
                { id: "IN2_SEM_BONUS", label: "Corrida sem Instruções", x: 540, y: 510, type: "outcome" },
                
                { id: "H1_ALDREN_SACRIFICIO", label: "Aldren Segura Alavanca", x: 240, y: 610, type: "choice" },
                { id: "H2_OUTRO_SACRIFICIO", label: "Companheiro Sacrifica", x: 480, y: 610, type: "outcome" },
                { id: "H3_DERROTA", label: "Ninguém (Arco Colapsa)", x: 680, y: 610, type: "outcome" },
                
                { id: "EX_FUGA", label: "Desafio da Fuga (7S / 3F)", x: 420, y: 710, type: "challenge" },
                
                { id: "ES_PERFEITO", label: "Fuga Perfeita (7 Sucessos)", x: 260, y: 810, type: "outcome" },
                { id: "EC_CUSTO", label: "3 Falhas: Escolha de Custo", x: 560, y: 810, type: "choice" },
                
                { id: "EC1_EQUIPAMENTO", label: "Perder Carroça", x: 420, y: 890, type: "outcome" },
                { id: "EC2_PROVAS", label: "Provas Destruídas", x: 510, y: 890, type: "outcome" },
                { id: "EC3_ENERGIA", label: "Dreno PM Exaustão", x: 600, y: 890, type: "outcome" },
                { id: "EC4_CICATRIZ", label: "Cicatriz Púrpura", x: 690, y: 890, type: "outcome" },
                
                { id: "T1_REENCONTRO", label: "Toma Reencontra Mara", x: 280, y: 970, type: "outcome" },
                { id: "T2_PENDENCIA", label: "Retorno a Greywick Pendente", x: 540, y: 970, type: "outcome" },
                
                { id: "SI1_SINETE_PARTIDO", label: "Sinete Crane Partido", x: 280, y: 1060, type: "outcome" },
                { id: "SI2_NOVO_SIMBOLO", label: "Novo Símbolo Escolhido", x: 540, y: 1060, type: "outcome" },
                
                { id: "END_FINAL", label: "Fim: Palavra de Cassandra", x: 420, y: 1150, type: "start" }
            ],
            links: [
                { from: "VER_VERDADE", to: "C1_OUVIR" }, { from: "VER_VERDADE", to: "C2_LER" },
                { from: "VER_VERDADE", to: "C3_ADIAR" }, { from: "VER_VERDADE", to: "C4_RECUSAR" },
                { from: "C1_OUVIR", to: "E_NOME" }, { from: "C2_LER", to: "E_NOME" },
                { from: "C3_ADIAR", to: "E_NOME" }, { from: "C4_RECUSAR", to: "E_NOME" },
                { from: "E_NOME", to: "A_ASCENSAO" },
                { from: "A_ASCENSAO", to: "F1_ESCALA_S" },
                { from: "A_ASCENSAO", to: "CS1_ACEITA" }, { from: "A_ASCENSAO", to: "CS2_DISTANCIA" }, { from: "A_ASCENSAO", to: "CS3_NEUTRO" },
                { from: "CS1_ACEITA", to: "IN1_BONUS" }, { from: "CS2_DISTANCIA", to: "IN2_SEM_BONUS" }, { from: "CS3_NEUTRO", to: "IN2_SEM_BONUS" },
                { from: "IN1_BONUS", to: "H1_ALDREN_SACRIFICIO" }, { from: "IN1_BONUS", to: "H2_OUTRO_SACRIFICIO" },
                { from: "IN2_SEM_BONUS", to: "H1_ALDREN_SACRIFICIO" }, { from: "IN2_SEM_BONUS", to: "H3_DERROTA" },
                { from: "H1_ALDREN_SACRIFICIO", to: "EX_FUGA" }, { from: "H2_OUTRO_SACRIFICIO", to: "EX_FUGA" }, { from: "H3_DERROTA", to: "EX_FUGA" },
                { from: "EX_FUGA", to: "ES_PERFEITO" }, { from: "EX_FUGA", to: "EC_CUSTO" },
                { from: "EC_CUSTO", to: "EC1_EQUIPAMENTO" }, { from: "EC_CUSTO", to: "EC2_PROVAS" },
                { from: "EC_CUSTO", to: "EC3_ENERGIA" }, { from: "EC_CUSTO", to: "EC4_CICATRIZ" },
                { from: "ES_PERFEITO", to: "T1_REENCONTRO" }, { from: "ES_PERFEITO", to: "T2_PENDENCIA" },
                { from: "EC1_EQUIPAMENTO", to: "T1_REENCONTRO" }, { from: "EC2_PROVAS", to: "T1_REENCONTRO" },
                { from: "EC3_ENERGIA", to: "T2_PENDENCIA" }, { from: "EC4_CICATRIZ", to: "T1_REENCONTRO" },
                { from: "T1_REENCONTRO", to: "SI1_SINETE_PARTIDO" }, { from: "T1_REENCONTRO", to: "SI2_NOVO_SIMBOLO" },
                { from: "T2_PENDENCIA", to: "SI1_SINETE_PARTIDO" }, { from: "T2_PENDENCIA", to: "SI2_NOVO_SIMBOLO" },
                { from: "SI1_SINETE_PARTIDO", to: "END_FINAL" }, { from: "SI2_NOVO_SIMBOLO", to: "END_FINAL" }
            ]
        }
    },

    renderSVG(containerId, actNumber, currentNodeId, visitedNodes = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const layout = this.actLayouts[actNumber];
        if (!layout) return;

        const width = layout.width;
        const height = layout.height;

        let svg = `
        <svg id="interactive-flowchart-svg" viewBox="0 0 ${width} ${height}" class="flowchart-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#9d4edd" />
                    <stop offset="100%" stop-color="#e63946" />
                </linearGradient>
                <linearGradient id="visitedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2a9d8f" />
                    <stop offset="100%" stop-color="#264653" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a5568" />
                </marker>
                <marker id="arrowActive" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#c77dff" />
                </marker>
                <marker id="arrowVisited" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2ec4b6" />
                </marker>
            </defs>

            <!-- GRUPO TRANSFORMÁVEL (ZOOM & PAN) -->
            <g id="svg-transform-layer" transform="translate(${this.translateX}, ${this.translateY}) scale(${this.scale})">
                <g class="connections">
        `;

        // Renderizar Conexões
        layout.links.forEach(link => {
            const fromNode = layout.nodes.find(n => n.id === link.from);
            const toNode = layout.nodes.find(n => n.id === link.to);
            if (fromNode && toNode) {
                const isVisited = visitedNodes.includes(link.from) && visitedNodes.includes(link.to);
                const isActive = link.from === currentNodeId;
                
                let strokeClass = "link-line";
                let marker = "url(#arrow)";
                if (isActive) {
                    strokeClass = "link-line active-pulse";
                    marker = "url(#arrowActive)";
                } else if (isVisited) {
                    strokeClass = "link-line visited";
                    marker = "url(#arrowVisited)";
                }

                // Curva bezier suave
                const deltaY = toNode.y - fromNode.y;
                const pathData = `M ${fromNode.x} ${fromNode.y + 18} C ${fromNode.x} ${fromNode.y + deltaY/2}, ${toNode.x} ${toNode.y - deltaY/2}, ${toNode.x} ${toNode.y - 18}`;
                svg += `<path d="${pathData}" class="${strokeClass}" marker-end="${marker}" />`;
            }
        });

        svg += `</g><g class="nodes">`;

        // Renderizar Nós
        layout.nodes.forEach(node => {
            const isCurrent = node.id === currentNodeId;
            const isVisited = visitedNodes.includes(node.id);
            
            let nodeClass = "node-box";
            if (isCurrent) nodeClass += " is-current";
            else if (isVisited) nodeClass += " is-visited";
            else nodeClass += " is-pending";

            nodeClass += ` type-${node.type}`;

            const widthNode = 175;
            const heightNode = 44;
            const rx = 8;

            svg += `
            <g class="flow-node ${nodeClass}" data-id="${node.id}" id="node-svg-${node.id}" onclick="APP.inspectOrJumpNode('${node.id}')" transform="translate(${node.x - widthNode/2}, ${node.y - heightNode/2})">
                <rect width="${widthNode}" height="${heightNode}" rx="${rx}" class="node-rect" />
                <text x="${widthNode/2}" y="${heightNode/2 + 4}" class="node-text">${escapeHtml(node.label)}</text>
            </g>`;
        });

        svg += `</g></g></svg>`;
        container.innerHTML = svg;

        this.attachPanZoomEvents(container);
        this.updateZoomDisplay();
    },

    // ==========================================
    // SISTEMA DE PAN & ZOOM ("MÃOZINHA" & SCROLL)
    // ==========================================
    attachPanZoomEvents(container) {
        if (this.hasInitializedEvents) return;
        this.hasInitializedEvents = true;

        container.style.cursor = "grab";

        // ZOOM VIA SCROLL DO MOUSE
        container.addEventListener("wheel", (e) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
            const newScale = Math.min(Math.max(this.scale * zoomFactor, 0.35), 3.5);

            // Ajusta translação para o zoom focar na posição do cursor
            this.translateX = mouseX - (mouseX - this.translateX) * (newScale / this.scale);
            this.translateY = mouseY - (mouseY - this.translateY) * (newScale / this.scale);
            this.scale = newScale;

            this.applyTransform();
            this.updateZoomDisplay();
        }, { passive: false });

        // PAN / ARRASTO COM CLIQUE DO MOUSE ("MÃOZINHA")
        container.addEventListener("mousedown", (e) => {
            // Ignora se clicou em um nó interativo
            if (e.target.closest(".flow-node")) return;

            this.isDragging = true;
            this.startX = e.clientX - this.translateX;
            this.startY = e.clientY - this.translateY;
            container.style.cursor = "grabbing";
        });

        window.addEventListener("mousemove", (e) => {
            if (!this.isDragging) return;
            this.translateX = e.clientX - this.startX;
            this.translateY = e.clientY - this.startY;
            this.applyTransform();
        });

        window.addEventListener("mouseup", () => {
            if (this.isDragging) {
                this.isDragging = false;
                container.style.cursor = "grab";
            }
        });
    },

    applyTransform() {
        const layer = document.getElementById("svg-transform-layer");
        if (layer) {
            layer.setAttribute("transform", `translate(${this.translateX}, ${this.translateY}) scale(${this.scale})`);
        }
    },

    zoomIn() {
        this.scale = Math.min(this.scale * 1.2, 3.5);
        this.applyTransform();
        this.updateZoomDisplay();
    },

    zoomOut() {
        this.scale = Math.max(this.scale * 0.8, 0.35);
        this.applyTransform();
        this.updateZoomDisplay();
    },

    resetView() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.applyTransform();
        this.updateZoomDisplay();
    },

    centerOnCurrentNode(nodeId) {
        const layout = this.actLayouts[this.currentActView];
        if (!layout) return;

        const node = layout.nodes.find(n => n.id === nodeId);
        if (!node) return;

        const container = document.getElementById("flowchart-svg-container");
        if (!container) return;

        const containerWidth = container.clientWidth || 700;
        const containerHeight = container.clientHeight || 500;

        this.scale = 1.1;
        this.translateX = (containerWidth / 2) - (node.x * this.scale);
        this.translateY = (containerHeight / 2) - (node.y * this.scale);

        this.applyTransform();
        this.updateZoomDisplay();
    },

    updateZoomDisplay() {
        const zoomLabel = document.getElementById("zoom-level-indicator");
        if (zoomLabel) {
            zoomLabel.innerText = `${Math.round(this.scale * 100)}%`;
        }
    }
};

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GRAPH_ENGINE };
}
