/**
 * CASSANDRA: O Resgate e a Ascensão Profana
 * Motor Interativo da Aplicação do Mestre (State Engine, UI Controller, Áudio & Navegação)
 */

const APP = {
    state: null,
    audioViewActive: false,
    currentChallenge: {
        active: false,
        successes: 0,
        failures: 0,
        config: null
    },
    audioContext: null,
    soundEnabled: true,

    init() {
        this.loadState();
        this.initAudio();
        this.renderAll();
        this.bindEvents();
    },

    // ==========================================
    // GERENCIAMENTO DE ESTADO (GAMESTATE)
    // ==========================================
    getFreshState() {
        return JSON.parse(JSON.stringify(ADVENTURE_DATA.initialState));
    },

    loadState() {
        try {
            const saved = localStorage.getItem("CASSANDRA_RPG_SESSION_STATE");
            if (saved) {
                this.state = JSON.parse(saved);
                this.state.currentNode = ADVENTURE_DATA.nodes[this.state.currentNodeId] || ADVENTURE_DATA.nodes["S"];
            } else {
                this.resetState(false);
            }
        } catch (e) {
            console.error("Erro ao carregar estado salvo:", e);
            this.resetState(false);
        }
    },

    saveState() {
        try {
            localStorage.setItem("CASSANDRA_RPG_SESSION_STATE", JSON.stringify(this.state));
        } catch (e) {
            console.error("Erro ao salvar estado no localStorage:", e);
        }
    },

    resetState(askConfirmation = true) {
        if (askConfirmation && !confirm("Tem certeza que deseja reiniciar toda a sessão do zero? O histórico atual será perdido.")) {
            return;
        }
        this.state = this.getFreshState();
        this.state.currentNode = ADVENTURE_DATA.nodes["S"];
        this.state.history.push({
            nodeId: "S",
            timestamp: new Date().toLocaleTimeString(),
            choiceLabel: "Início da Sessão em Yuvalin"
        });
        this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] Aventura iniciada: Partida de Yuvalin rumo a Milothiann.`);
        this.saveState();
        this.playSound('start');
        this.renderAll();
    },

    // ==========================================
    // TRANSIÇÃO DE NÓS & ESCOLHAS
    // ==========================================
    chooseOption(optionId) {
        const currentNode = this.state.currentNode || ADVENTURE_DATA.nodes[this.state.currentNodeId];
        if (!currentNode || !currentNode.options) return;

        const option = currentNode.options.find(opt => opt.id === optionId);
        if (!option) return;

        // Efeitos da opção
        if (option.effects) {
            this.applyEffects(option.effects);
        }

        const targetNodeId = option.target;
        const targetNode = ADVENTURE_DATA.nodes[targetNodeId];
        if (!targetNode) {
            console.error(`Nó de destino '${targetNodeId}' não encontrado.`);
            return;
        }

        // Registrar no histórico
        this.state.history.push({
            nodeId: targetNodeId,
            timestamp: new Date().toLocaleTimeString(),
            choiceLabel: option.label
        });

        // Atualizar estado
        this.state.currentNodeId = targetNodeId;
        this.state.currentNode = targetNode;
        if (targetNode.act) {
            this.state.act = targetNode.act;
            GRAPH_ENGINE.currentActView = targetNode.act;
        }

        // Efeitos intrínsecos do nó de destino
        if (targetNode.effects) {
            this.applyEffects(targetNode.effects);
        }

        // Configurar desafio se o nó for um challenge
        if (targetNode.challengeConfig) {
            this.setupChallenge(targetNode.challengeConfig);
        } else {
            this.currentChallenge.active = false;
        }

        // Efeitos sonoros
        if (targetNode.type === 'combat' || targetNode.type === 'boss_fight') {
            this.playSound('combat');
        } else if (targetNode.type === 'end' || targetNode.type === 'end_session') {
            this.playSound('victory');
        } else {
            this.playSound('click');
        }

        this.saveState();
        this.renderAll();

        // Centraliza suavemente no novo nó do mapa
        setTimeout(() => {
            GRAPH_ENGINE.centerOnCurrentNode(targetNodeId);
        }, 100);
    },

    stepBack() {
        if (this.state.history.length <= 1) {
            alert("Você já está no ponto inicial da aventura.");
            return;
        }

        // Remover último passo
        this.state.history.pop();
        const prevStep = this.state.history[this.state.history.length - 1];
        const targetNode = ADVENTURE_DATA.nodes[prevStep.nodeId];

        if (targetNode) {
            this.state.currentNodeId = targetNode.id;
            this.state.currentNode = targetNode;
            this.state.act = targetNode.act || 1;
            GRAPH_ENGINE.currentActView = targetNode.act || 1;
            
            if (targetNode.challengeConfig) {
                this.setupChallenge(targetNode.challengeConfig);
            } else {
                this.currentChallenge.active = false;
            }

            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] (Desfazer) Retornou para o passo: ${targetNode.title}`);
            this.saveState();
            this.playSound('undo');
            this.renderAll();

            setTimeout(() => {
                GRAPH_ENGINE.centerOnCurrentNode(targetNode.id);
            }, 100);
        }
    },

    inspectOrJumpNode(nodeId) {
        const targetNode = ADVENTURE_DATA.nodes[nodeId];
        if (!targetNode) return;

        if (confirm(`Deseja mover o progresso da sessão para o nó: "${targetNode.title}"?`)) {
            this.state.history.push({
                nodeId: nodeId,
                timestamp: new Date().toLocaleTimeString(),
                choiceLabel: `Salto manual para: ${targetNode.title}`
            });
            this.state.currentNodeId = nodeId;
            this.state.currentNode = targetNode;
            this.state.act = targetNode.act || 1;
            GRAPH_ENGINE.currentActView = targetNode.act || 1;

            if (targetNode.effects) {
                this.applyEffects(targetNode.effects);
            }
            if (targetNode.challengeConfig) {
                this.setupChallenge(targetNode.challengeConfig);
            } else {
                this.currentChallenge.active = false;
            }

            this.saveState();
            this.playSound('click');
            this.renderAll();

            setTimeout(() => {
                GRAPH_ENGINE.centerOnCurrentNode(nodeId);
            }, 100);
        }
    },

    applyEffects(effects) {
        if (!effects) return;

        if (typeof effects.alertLevel === 'number') {
            this.state.alertLevel = Math.max(0, effects.alertLevel);
        } else if (typeof effects.alertLevelDelta === 'number') {
            this.adjustAlert(effects.alertLevelDelta, false);
        }

        if (effects.resources) {
            Object.assign(this.state.resources, effects.resources);
        }

        if (effects.npcStatus) {
            Object.assign(this.state.npcStatus, effects.npcStatus);
        }

        if (effects.groupConditions) {
            Object.assign(this.state.groupConditions, effects.groupConditions);
        }

        if (typeof effects.severianBonusPV === 'number') {
            this.state.severianBonusPV += effects.severianBonusPV;
        }

        if (typeof effects.pilonosDestruidos === 'number') {
            this.state.pilonosDestruidos += effects.pilonosDestruidos;
        }

        if (effects.pilonoInativoFagulha) {
            this.state.pilonoInativoFagulha = true;
        }

        if (effects.routeChoiceAct2) {
            this.state.routeChoiceAct2 = effects.routeChoiceAct2;
        }

        if (effects.log) {
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] ${effects.log}`);
        }
    },

    adjustAlert(delta, save = true) {
        const prev = this.state.alertLevel;
        this.state.alertLevel = Math.max(0, this.state.alertLevel + delta);
        
        if (this.state.alertLevel >= 5 && prev < 5) {
            this.playSound('alarm');
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] ⚠️ ALERTA MÁXIMO (Nível ${this.state.alertLevel}): Os protocolos de segurança de Milothiann acionaram o Segundo Lacre Arcano!`);
        } else if (delta > 0) {
            this.playSound('warning');
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] ⚠️ Nível de Alerta aumentou para ${this.state.alertLevel} (+${delta}).`);
        } else if (delta < 0) {
            this.playSound('click');
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] Nível de Alerta reduzido para ${this.state.alertLevel}.`);
        }

        if (save) {
            this.saveState();
            this.renderAlertHUD();
        }
    },

    // ==========================================
    // SIMULADOR DE DESAFIOS ESTENDIDOS
    // ==========================================
    setupChallenge(config) {
        this.currentChallenge = {
            active: true,
            successes: 0,
            failures: 0,
            config: config
        };

        // Bônus automáticos de rota na Fuga do Ato III
        if (config.title && config.title.includes("Travessia do Apocalipse") && this.state.routeChoiceAct2 === "saida_ponte") {
            this.currentChallenge.successes = 1;
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] Rota da Saída concede +1 Sucesso Inicial no Desafio de Fuga!`);
        }
    },

    registerChallengeResult(type) {
        if (!this.currentChallenge.active || !this.currentChallenge.config) return;

        if (type === 'success') {
            this.currentChallenge.successes++;
            this.playSound('success');
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] Sucesso registrado no desafio (${this.currentChallenge.successes}/${this.currentChallenge.config.targetSuccesses}).`);
        } else {
            this.currentChallenge.failures++;
            this.playSound('failure');
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] Falha registrada no desafio (${this.currentChallenge.failures}/${this.currentChallenge.config.maxFailures}).`);

            // Penalidade especial da Rota de Aldren na fuga
            if (this.currentChallenge.config.title && this.currentChallenge.config.title.includes("Travessia") && this.state.routeChoiceAct2 === "aldren_capela" && this.currentChallenge.failures === 1) {
                this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] Rota da Capela: Primeira falha de dano causa +1d6 trevas nos heróis!`);
            }
        }

        // Verificar término do desafio
        if (this.currentChallenge.successes >= this.currentChallenge.config.targetSuccesses) {
            this.playSound('victory');
            const targetOutcome = this.currentChallenge.config.successOutcome;
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] 🏆 Desafio Conquistado com Sucesso!`);
            setTimeout(() => {
                if (targetOutcome && ADVENTURE_DATA.nodes[targetOutcome]) {
                    this.inspectOrJumpNode(targetOutcome);
                }
            }, 600);
        } else if (this.currentChallenge.failures >= this.currentChallenge.config.maxFailures) {
            this.playSound('alarm');
            const failureOutcome = this.currentChallenge.config.failureOutcome;
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] ⚠️ Limite de Falhas atingido no Desafio!`);
            setTimeout(() => {
                if (failureOutcome && ADVENTURE_DATA.nodes[failureOutcome]) {
                    this.inspectOrJumpNode(failureOutcome);
                }
            }, 600);
        }

        this.saveState();
        this.renderSceneCard();
    },

    // ==========================================
    // ROLADOR DE DADOS T20
    // ==========================================
    rollD20(skillName = "", cd = null) {
        const modInput = document.getElementById("dice-mod-input");
        const mod = parseInt(modInput ? modInput.value : 0) || 0;
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + mod;

        this.playSound('dice');

        const displayTotal = document.getElementById("dice-total-display");
        const displayBreakdown = document.getElementById("dice-breakdown-display");

        let resultText = `d20 (${d20}) + ${mod} = ${total}`;

        if (d20 === 20) {
            resultText += " ★ CRÍTICO (20 Natural)!";
            this.playSound('victory');
        } else if (d20 === 1) {
            resultText += " ☠ FALHA CRÍTICA (1 Natural)!";
            this.playSound('alarm');
        }

        if (cd !== null) {
            const passed = total >= cd;
            resultText += ` | CD ${cd}: ${passed ? 'SUCESSO' : 'FALHA'}`;
            if (this.currentChallenge.active) {
                this.registerChallengeResult(passed ? 'success' : 'failure');
            }
        }

        if (displayTotal) displayTotal.innerText = total;
        if (displayBreakdown) displayBreakdown.innerText = (skillName ? `${skillName}: ` : '') + resultText;

        this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] Rolagem de Dados: ${skillName ? skillName + ' - ' : ''}${resultText}`);
        this.renderChronicle();
        this.saveState();
    },

    // ==========================================
    // ÁUDIO SINTETIZADO (WEB AUDIO API)
    // ==========================================
    initAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn("Web Audio API não suportada neste navegador.");
        }
    },

    playSound(type) {
        if (!this.soundEnabled || !this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        switch (type) {
            case 'click':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
                break;
            case 'success':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554.37, now + 0.08);
                osc.frequency.setValueAtTime(659.25, now + 0.16);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.start(now);
                osc.stop(now + 0.28);
                break;
            case 'failure':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(130, now + 0.2);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
                break;
            case 'alarm':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.setValueAtTime(800, now + 0.1);
                osc.frequency.setValueAtTime(600, now + 0.2);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
                break;
            case 'victory':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.1);
                osc.frequency.setValueAtTime(783.99, now + 0.2);
                osc.frequency.setValueAtTime(1046.50, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            case 'dice':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case 'undo':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(350, now + 0.12);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
                break;
        }
    },

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById("btn-toggle-sound");
        if (btn) {
            btn.innerHTML = this.soundEnabled ? "🔊 Efeitos: Ativado" : "🔇 Efeitos: Mudo";
            btn.className = this.soundEnabled ? "btn btn-secondary" : "btn btn-secondary text-dim";
        }
    },

    // ==========================================
    // CONTROLE DE VISUALIZAÇÃO & ABAS
    // ==========================================
    setActView(actNumber) {
        this.audioViewActive = false;
        GRAPH_ENGINE.currentActView = actNumber;
        
        document.querySelectorAll(".tab-btn").forEach((btn, idx) => {
            btn.classList.toggle("active", idx === actNumber - 1);
        });

        const audioPanel = document.getElementById("audio-player-full-panel");
        const graphCard = document.getElementById("graph-main-card");
        const sceneCard = document.getElementById("scene-card-container");
        const ambienceChips = document.getElementById("scene-ambience-suggestions");

        if (audioPanel) audioPanel.style.display = "none";
        if (graphCard) graphCard.style.display = "flex";
        if (sceneCard) sceneCard.style.display = "block";
        if (ambienceChips) ambienceChips.style.display = "block";

        this.renderGraph();
    },

    toggleAudioView() {
        this.audioViewActive = true;
        
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        const audioTabBtn = document.getElementById("tab-act-audio");
        if (audioTabBtn) audioTabBtn.classList.add("active");

        const audioPanel = document.getElementById("audio-player-full-panel");
        const graphCard = document.getElementById("graph-main-card");
        const sceneCard = document.getElementById("scene-card-container");
        const ambienceChips = document.getElementById("scene-ambience-suggestions");

        if (audioPanel) audioPanel.style.display = "flex";
        if (graphCard) graphCard.style.display = "none";
        if (sceneCard) sceneCard.style.display = "block";
        if (ambienceChips) ambienceChips.style.display = "block";

        if (typeof AUDIO_PLAYER !== 'undefined') {
            AUDIO_PLAYER.render();
        }
    },

    // ==========================================
    // RENDERIZAÇÃO DA INTERFACE (UI)
    // ==========================================
    renderAll() {
        this.renderAlertHUD();
        this.renderResourcesSidebar();
        this.renderNPCsSidebar();
        this.renderSceneCard();
        this.renderGraph();
        this.renderChronicle();

        if (typeof AUDIO_PLAYER !== 'undefined') {
            AUDIO_PLAYER.suggestAmbienceForNode(this.state.currentNodeId);
        }
    },

    renderAlertHUD() {
        const level = this.state.alertLevel;
        const container = document.getElementById("alert-meter-container");
        const labelDisplay = document.getElementById("alert-level-label");
        
        if (labelDisplay) {
            labelDisplay.innerText = `Nível ${level}`;
            labelDisplay.style.color = level >= 5 ? 'var(--crimson-glow)' : level >= 3 ? 'var(--gold-bright)' : 'var(--cyan-mana)';
        }

        if (container) {
            let pipsHtml = "";
            for (let i = 0; i <= 5; i++) {
                const isFilled = i <= level;
                const pipClass = isFilled ? `alert-pip filled-${Math.min(i, 5)}` : "alert-pip";
                pipsHtml += `<div class="${pipClass}" title="Alerta ${i}"></div>`;
            }
            container.innerHTML = pipsHtml;
        }
    },

    renderResourcesSidebar() {
        const res = this.state.resources;
        const cond = this.state.groupConditions;
        const container = document.getElementById("resources-container");
        if (!container) return;

        const items = [
            { name: "Carta de Helena", has: res.cartaHelena, badge: res.cartaHelena ? "Em Mãos" : "Não Obtida" },
            { name: "Livro de Khorcova", has: res.livroKhorcova, badge: res.livroKhorcova ? "Canal CD 18" : "Perdido (CD 24)" },
            { name: "Placa de Greywick", has: res.placaGreywick, badge: res.placaGreywick ? "+2 Cortejo" : "Ausente" },
            { name: "Sais de Proteção", has: res.saisProtecao > 0, badge: `${res.saisProtecao} Carga(s)` },
            { name: "Fagulha Arcana", has: !!res.fagulhaArcana, badge: res.fagulhaArcana ? res.fagulhaArcana.toUpperCase() : "Não Usada" },
            { name: "Máscara de Varek", has: res.mascaraVarek, badge: res.mascaraVarek ? "+2 Enganação" : "Não Obtida" },
            { name: "Contrato de Severian", has: res.contratoSeverian, badge: res.contratoSeverian ? "Provas Reais" : "Oculto" },
            { name: "Nome Escolhido", has: res.nomeEscolhido, badge: res.nomeEscolhido ? "Desperto" : "Bloqueado" },
            { name: "Determinação Familiar", has: res.determinacaoFamiliar, badge: res.determinacaoFamiliar ? "+2 Vontade" : "Bloqueado" }
        ];

        let html = '<div class="resource-grid">';
        items.forEach(item => {
            html += `
                <div class="resource-item ${item.has ? 'active' : ''}">
                    <div class="resource-name">
                        <span>${item.has ? '✦' : '✧'}</span>
                        <span>${item.name}</span>
                    </div>
                    <span class="resource-badge ${item.has ? 'badge-has' : 'badge-none'}">${item.badge}</span>
                </div>
            `;
        });
        html += '</div>';

        // Penalidades / Condições
        if (cond.pmPerdidosTotal > 0 || cond.modificadorViagem !== 0 || cond.modificadorSocial !== 0 || cond.itensLacrados > 0) {
            html += `<div style="margin-top:0.75rem; font-size:0.75rem; color:var(--text-muted); border-top:1px solid rgba(255,255,255,0.08); padding-top:0.5rem;">
                <div style="font-weight:700; color:var(--crimson-glow); margin-bottom:0.25rem;">Condições do Grupo:</div>`;
            if (cond.pmPerdidosTotal > 0) html += `<div>• Dreno de Mana: -${cond.pmPerdidosTotal} PM por membro</div>`;
            if (cond.modificadorViagem !== 0) html += `<div>• Modificador em Viagem: ${cond.modificadorViagem > 0 ? '+' : ''}${cond.modificadorViagem}</div>`;
            if (cond.modificadorSocial !== 0) html += `<div>• Modificador Social: ${cond.modificadorSocial}</div>`;
            if (cond.itensLacrados > 0) html += `<div>• Itens Arcanos Lacrados: ${cond.itensLacrados}</div>`;
            if (cond.carrocaAbandonada) html += `<div>• Carroça e carga pesada abandonadas</div>`;
            if (cond.cicatrizPurpura) html += `<div>• Cassandra possui a Cicatriz Púrpura</div>`;
            html += `</div>`;
        }

        container.innerHTML = html;
    },

    renderNPCsSidebar() {
        const npcStatus = this.state.npcStatus;
        const container = document.getElementById("npcs-container");
        if (!container) return;

        const npcs = [
            {
                id: "cael",
                name: "Cael",
                state: npcStatus.cael,
                badge: npcStatus.cael === 'disponivel' ? 'Disponível' : npcStatus.cael === 'incapacitado' ? 'Incapacitado' : 'Desconhecido',
                colorClass: npcStatus.cael === 'disponivel' ? 'state-green' : npcStatus.cael === 'incapacitado' ? 'state-red' : 'state-amber'
            },
            {
                id: "toma",
                name: "Toma (Órfão)",
                state: npcStatus.toma,
                badge: npcStatus.toma.includes('salvo') ? 'Salvo' : npcStatus.toma === 'deixado_greywick' ? 'Em Greywick' : npcStatus.toma === 'estrada_real' ? 'Pendente' : 'Não Resolvido',
                colorClass: npcStatus.toma.includes('salvo') ? 'state-green' : npcStatus.toma === 'deixado_greywick' ? 'state-red' : 'state-amber'
            },
            {
                id: "varek",
                name: "Varek (Metamorfo)",
                state: npcStatus.varek,
                badge: npcStatus.varek === 'morto' ? 'Morto' : npcStatus.varek === 'capturado' ? 'Capturado' : npcStatus.varek === 'rendido' ? 'Rendido' : npcStatus.varek === 'fugiu' ? 'Fugiu (Avisou)' : 'Oculto',
                colorClass: npcStatus.varek === 'fugiu' ? 'state-red' : npcStatus.varek === 'capturado' || npcStatus.varek === 'rendido' ? 'state-purple' : npcStatus.varek === 'morto' ? 'state-green' : 'state-amber'
            },
            {
                id: "aldren",
                name: "Aldren Crane",
                state: npcStatus.aldren,
                badge: npcStatus.aldren === 'guardiao_veterano' ? 'Guardião (+3 Def)' : npcStatus.aldren === 'sacrificio_morte' ? 'Sacrifício Heroico' : npcStatus.aldren === 'primeiro_retornado' ? '1º Retornado' : npcStatus.aldren === 'resgatado_com_vida' ? 'A Salvo' : 'Cativo na Capela',
                colorClass: npcStatus.aldren === 'guardiao_veterano' || npcStatus.aldren === 'resgatado_com_vida' ? 'state-green' : npcStatus.aldren === 'sacrificio_morte' || npcStatus.aldren === 'primeiro_retornado' ? 'state-purple' : 'state-amber'
            },
            {
                id: "cassandra",
                name: "Cassandra Crane",
                state: npcStatus.cassandra,
                badge: npcStatus.cassandra === 'nome_escolhido' ? 'Nome Escolhido' : npcStatus.cassandra === 'resgatada_livre' ? 'Livre / Integrada' : 'Cativa na Cela',
                colorClass: npcStatus.cassandra === 'nome_escolhido' ? 'state-purple' : npcStatus.cassandra === 'resgatada_livre' ? 'state-green' : 'state-amber'
            }
        ];

        let html = "";
        npcs.forEach(npc => {
            html += `
                <div class="npc-status-card">
                    <div class="npc-header">
                        <span class="npc-name">${npc.name}</span>
                        <span class="npc-state-tag ${npc.colorClass}">${npc.badge}</span>
                    </div>
                    <button class="btn btn-secondary" style="width:100%; font-size:0.7rem; padding:0.25rem 0.5rem; justify-content:center;" onclick="APP.openNPCModal('${npc.id}')">
                        📜 Ver Ficha & Estatísticas
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    renderSceneCard() {
        const node = this.state.currentNode || ADVENTURE_DATA.nodes[this.state.currentNodeId];
        const container = document.getElementById("scene-card-container");
        if (!container || !node) return;

        let actTitle = `Ato ${node.act || 1}`;
        if (node.act === 1) actTitle += ": A Jornada até Milothiann";
        else if (node.act === 2) actTitle += ": O Resgate e Severian";
        else if (node.act === 3) actTitle += ": A Verdade & Fuga da Ascensão";

        let html = `
            <div class="scene-card">
                <div class="scene-meta">
                    <span class="act-badge">${actTitle}</span>
                    <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim);">Nó ID: ${node.id}</span>
                </div>
                <h2 class="scene-title">${escapeHtml(node.title)}</h2>
        `;

        // Caixa de Leitura em Voz Alta
        if (node.narration) {
            html += `
                <div class="narration-box">
                    <div class="narration-label">🗣️ Narração para Leitura em Voz Alta</div>
                    <div class="narration-text">"${escapeHtml(node.narration)}"</div>
                </div>
            `;
        }

        // Dicas do Mestre
        if (node.gmTips) {
            html += `
                <div class="gm-tips-box">
                    <div class="gm-tips-label">💡 Dica de Condução para o Mestre</div>
                    <div>${escapeHtml(node.gmTips)}</div>
                </div>
            `;
        }

        // Desafio Estendido Integrado
        if (node.challengeConfig && this.currentChallenge.active) {
            const cc = node.challengeConfig;
            html += `
                <div class="challenge-simulator-card">
                    <div class="challenge-header">
                        <span class="challenge-title">🎲 ${escapeHtml(cc.title)}</span>
                        <div class="challenge-counters">
                            <div class="counter-badge success-badge">
                                <span>Sucessos (${this.currentChallenge.successes}/${cc.targetSuccesses}):</span>
                                <div class="counter-pips">
                                    ${this.renderChallengePips(this.currentChallenge.successes, cc.targetSuccesses, 'suc')}
                                </div>
                            </div>
                            <div class="counter-badge failure-badge">
                                <span>Falhas (${this.currentChallenge.failures}/${cc.maxFailures}):</span>
                                <div class="counter-pips">
                                    ${this.renderChallengePips(this.currentChallenge.failures, cc.maxFailures, 'fail')}
                                </div>
                            </div>
                        </div>
                    </div>
            `;

            if (cc.bonusCondition) {
                html += `<div style="font-size:0.78rem; color:var(--gold-bright); margin-bottom:0.6rem;">⚡ Bônus/Condições: ${escapeHtml(cc.bonusCondition)}</div>`;
            }

            html += `<div class="challenge-skills-list">`;
            cc.skills.forEach(skill => {
                html += `
                    <div class="skill-row">
                        <div>
                            <span class="skill-name">${escapeHtml(skill.name)}</span>
                            <span class="skill-cd"> (CD ${skill.cd})</span>
                            <div class="skill-desc">${escapeHtml(skill.desc)}</div>
                        </div>
                        <button class="btn btn-secondary" style="font-size:0.72rem; padding:0.25rem 0.5rem;" onclick="APP.rollD20('${escapeHtml(skill.name)}', ${skill.cd})">
                            🎲 Rolar Teste
                        </button>
                    </div>
                `;
            });
            html += `</div>`;

            html += `
                <div class="challenge-interactive-actions">
                    <button class="btn btn-primary" style="flex:1;" onclick="APP.registerChallengeResult('success')">
                        ✓ Registrar Sucesso
                    </button>
                    <button class="btn btn-danger" style="flex:1;" onclick="APP.registerChallengeResult('failure')">
                        ✗ Registrar Falha
                    </button>
                </div>
            </div>`;
        }

        // Arena BOSS contra Severian
        if (node.id === "BOSS_SEVERIAN") {
            html += this.renderBossArena();
        }

        // Opções e Ramificações
        if (node.options && node.options.length > 0) {
            html += `
                <div class="decision-section">
                    <div class="decision-label">⚔️ Escolhas & Ações dos Aventureiros:</div>
                    <div class="options-list">
            `;

            node.options.forEach(opt => {
                const targetNode = ADVENTURE_DATA.nodes[opt.target];
                const badge = opt.badge || (targetNode ? targetNode.type.toUpperCase() : "");
                
                html += `
                    <button class="option-btn" onclick="APP.chooseOption('${opt.id}')">
                        <div class="option-content">
                            <span class="option-title">${escapeHtml(opt.label)}</span>
                            ${badge ? `<span class="option-tag">${escapeHtml(badge)}</span>` : ''}
                        </div>
                        <span class="option-arrow">➔</span>
                    </button>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        container.innerHTML = html;
    },

    renderBossArena() {
        const totalPylons = this.state.totalPilonos || 4;
        const destroyed = this.state.pilonosDestruidos || 0;
        const activePylons = Math.max(0, totalPylons - destroyed);
        const severianTotalPV = 150 + this.state.severianBonusPV;
        const rd = activePylons * 5;
        const regen = activePylons * 10;

        return `
            <div class="boss-arena-card">
                <div class="boss-title">
                    <span>⚡ Confronto com Inquisidor-Mor Severian</span>
                    <span style="font-size:0.85rem; color:var(--gold-bright);">PV Total: ${severianTotalPV} | Defesa: 28</span>
                </div>
                <div style="font-size:0.8rem; color:#cbd5e1; margin-bottom:0.5rem;">
                    🛡️ <strong>Pilonos Ativos (${activePylons}/${totalPylons}):</strong> Severian possui RD ${rd} e regenera ${regen} PV por rodada!
                </div>
                <div class="pylons-grid">
                    ${this.renderPylonsGrid(totalPylons, destroyed)}
                </div>
                <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
                    <button class="btn btn-primary" style="flex:1; font-size:0.75rem;" onclick="APP.destruirPilono()">
                        💥 Destruir 1 Pilono (-RD 5, -Regen 10)
                    </button>
                    <button class="btn btn-gold" style="flex:1; font-size:0.75rem;" onclick="APP.inverterRunas()">
                        🔮 Inverter Runas (4d8 Dano em Severian)
                    </button>
                </div>
            </div>
        `;
    },

    renderPylonsGrid(total, destroyed) {
        let html = "";
        for (let i = 1; i <= total; i++) {
            const isDestroyed = i <= destroyed;
            html += `
                <div class="pylon-box ${isDestroyed ? 'destroyed' : 'active'}" onclick="APP.togglePylonManual(${i})">
                    <div style="font-size:0.75rem; font-weight:700;">Pilono ${i}</div>
                    <div style="font-size:0.68rem;">${isDestroyed ? 'DESTRUÍDO' : 'ENERGIZADO'}</div>
                </div>
            `;
        }
        return html;
    },

    destruirPilono() {
        if (this.state.pilonosDestruidos < this.state.totalPilonos) {
            this.state.pilonosDestruidos++;
            this.playSound('success');
            this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] 💥 Pilono Arcano destruído pelo grupo! Proteção de Severian enfraquecida.`);
            this.saveState();
            this.renderSceneCard();
        }
    },

    inverterRunas() {
        this.playSound('victory');
        const dano = Math.floor(Math.random() * 25) + 10;
        this.state.chronicle.push(`[${new Date().toLocaleTimeString()}] 🔮 Runas Invertidas com sucesso: O raio do pilono rebateu em Severian causando ${dano} de dano!`);
        this.renderChronicle();
    },

    togglePylonManual(pylonIndex) {
        if (pylonIndex <= this.state.pilonosDestruidos) {
            this.state.pilonosDestruidos--;
        } else {
            this.state.pilonosDestruidos++;
        }
        this.saveState();
        this.renderSceneCard();
    },

    renderChallengePips(current, max, type) {
        let html = "";
        for (let i = 1; i <= max; i++) {
            const filled = i <= current;
            const className = filled ? (type === 'suc' ? 'c-pip suc-filled' : 'c-pip fail-filled') : 'c-pip';
            html += `<div class="${className}"></div>`;
        }
        return html;
    },

    renderGraph() {
        const actNum = GRAPH_ENGINE.currentActView || this.state.act || 1;
        const visited = this.state.history.map(h => h.nodeId);
        GRAPH_ENGINE.renderSVG("flowchart-svg-container", actNum, this.state.currentNodeId, visited);
    },

    renderChronicle() {
        const container = document.getElementById("chronicle-timeline-container");
        if (!container) return;

        let html = "";
        this.state.chronicle.slice().reverse().forEach(entry => {
            html += `<div class="timeline-item">${escapeHtml(entry)}</div>`;
        });
        container.innerHTML = html;
    },

    // ==========================================
    // MODAIS DE NPCs & EXPORTAÇÃO
    // ==========================================
    openNPCModal(npcId) {
        const npc = ADVENTURE_DATA.npcDatabase[npcId];
        if (!npc) return;

        const modal = document.getElementById("general-modal");
        const title = document.getElementById("modal-title");
        const content = document.getElementById("modal-content");

        if (title) title.innerText = `Ficha & Táticas: ${npc.name}`;
        if (content) {
            let statsHtml = `
                <div style="margin-bottom:0.75rem; color:var(--text-gold); font-size:0.85rem;"><strong>Papel:</strong> ${npc.role}</div>
                <div style="font-size:0.85rem; color:#cbd5e1; margin-bottom:1rem; line-height:1.5;">${npc.description}</div>
                <div style="background:rgba(10,11,16,0.8); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.85rem;">
                    <div style="font-family:var(--font-title); font-size:0.95rem; color:var(--gold-bright); margin-bottom:0.5rem;">Estatísticas de Combate (T20):</div>
            `;

            if (npc.combatStats) {
                statsHtml += `<div style="display:flex; gap:1rem; font-family:var(--font-mono); font-size:0.85rem; color:var(--cyan-mana); margin-bottom:0.75rem;">`;
                if (npc.combatStats.pv) statsHtml += `<span>PV: ${npc.combatStats.pv}</span>`;
                if (npc.combatStats.pm) statsHtml += `<span>PM: ${npc.combatStats.pm}</span>`;
                if (npc.combatStats.defesa) statsHtml += `<span>Defesa: ${npc.combatStats.defesa}</span>`;
                if (npc.combatStats.rd) statsHtml += `<span>RD: ${npc.combatStats.rd}</span>`;
                statsHtml += `</div>`;

                if (npc.combatStats.habilidades) {
                    statsHtml += `<div style="font-size:0.8rem; color:#e2e8f0;"><strong>Habilidades Especiais:</strong><ul style="padding-left:1.2rem; margin-top:0.25rem;">`;
                    npc.combatStats.habilidades.forEach(hab => {
                        statsHtml += `<li>${hab}</li>`;
                    });
                    statsHtml += `</ul></div>`;
                }
            }

            statsHtml += `</div>`;
            content.innerHTML = statsHtml;
        }

        if (modal) modal.classList.add("open");
    },

    closeModal() {
        const modal = document.getElementById("general-modal");
        if (modal) modal.classList.remove("open");
    },

    exportSummary() {
        const report = this.generateSessionReport();
        const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `CRONICA_CASSANDRA_SESSAO_${new Date().toISOString().slice(0,10)}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    generateSessionReport() {
        const s = this.state;
        return `# Relatório da Sessão: CASSANDRA - O Resgate e a Ascensão Profana
**Data de Registro:** ${new Date().toLocaleString()}
**Ato Atual Alcançado:** Ato ${s.act}
**Nível de Alerta Final:** ${s.alertLevel} / 5+

---

## 🛡️ Status Final dos Personagens e Aliados
- **Cael:** ${s.npcStatus.cael.toUpperCase()}
- **Toma:** ${s.npcStatus.toma.toUpperCase()}
- **Varek:** ${s.npcStatus.varek.toUpperCase()}
- **Aldren Crane:** ${s.npcStatus.aldren.toUpperCase()}
- **Cassandra Crane:** ${s.npcStatus.cassandra.toUpperCase()}

## 🎒 Recursos e Provas Coletadas
- Carta de Helena: ${s.resources.cartaHelena ? 'Sim' : 'Não'}
- Livro de Khorcova: ${s.resources.livroKhorcova ? 'Sim' : 'Não'}
- Placa de Greywick: ${s.resources.placaGreywick ? 'Sim' : 'Não'}
- Sais de Proteção restantes: ${s.resources.saisProtecao}
- Fagulha Arcana: ${s.resources.fagulhaArcana || 'Não usada'}
- Máscara de Varek: ${s.resources.mascaraVarek ? 'Sim' : 'Não'}
- Contrato de Severian: ${s.resources.contratoSeverian ? 'Sim' : 'Não'}
- Nome Escolhido de Cassandra: ${s.resources.nomeEscolhido ? 'Desperto' : 'Não'}
- Sinete Crane: ${s.resources.sineteCrane || 'Não definido'}

---

## 📜 Crônica Passo a Passo da Sessão
${s.chronicle.map(c => `- ${c}`).join('\n')}

---
*Gerado automaticamente pelo Sistema Tático do Mestre - CASSANDRA.*
`;
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
};

window.APP = APP;

document.addEventListener("DOMContentLoaded", () => {
    APP.init();
});
