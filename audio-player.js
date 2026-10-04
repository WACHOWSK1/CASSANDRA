/**
 * CASSANDRA: O Resgate e a Ascensão Profana
 * Player de Músicas e Ambientes de RPG com 32 Categorias e 121 Faixas
 */

const AUDIO_PLAYER = {
    audioElement: new Audio(),
    catalog: typeof AUDIO_CATALOG !== 'undefined' ? AUDIO_CATALOG : [],
    currentCategory: "BATALHAS",
    currentTrack: null,
    isPlaying: false,
    isLooping: true,
    isShuffle: false,
    volume: 0.7,
    searchQuery: "",

    // Mapeamento inteligente de categorias sugeridas por nó de cena
    sceneCategorySuggestions: {
        "S": ["ACAMPAMENTO", "MERCADO", "SAUDADE"],
        "C1": ["CONTEMPLATIVO", "MISTÉRIO"],
        "C2": ["RAIVA", "MEDO"],
        "G": ["MISTÉRIO", "MEDO", "RUÍNAS"],
        "GS": ["ALEGRIA", "ESPERANÇA"],
        "GC": ["DESESPERO", "CULPA"],
        "E": ["CAMPOS", "MEDO"],
        "Q": ["MISTÉRIO", "OFICINA ALQUIMICA"],
        "F_DECISION": ["OFICINA ALQUIMICA", "MISTÉRIO"],
        "A_CORTEJO": ["LUTO", "MISTÉRIO", "TEMPLO"],
        "B_MERCENARIOS": ["TAVERNAS", "BATALHAS"],
        "D_CANAL": ["MASMORRA", "PÂNTANO"],
        "M": ["MASMORRA", "MISTÉRIO"],
        "VF": ["BATALHAS", "MEDO"],
        "VC": ["CONTEMPLATIVO", "MISTÉRIO"],
        "VE_FUGA": ["BATALHAS", "CORAGEM"],
        "AU_PROVA": ["SAUDADE", "CONTEMPLATIVO"],
        "RES_INTEGRA": ["ESPERANÇA", "ALEGRIA"],
        "RA_CAPELA": ["TEMPLO", "MASMORRA"],
        "BOSS_SEVERIAN": ["BATALHAS", "DESESPERO"],
        "VER_VERDADE": ["CONTEMPLATIVO", "SAUDADE", "LUTO"],
        "E_NOME": ["CORAGEM", "ESPERANÇA"],
        "A_ASCENSAO": ["DESESPERO", "MEDO", "RUÍNAS"],
        "H_ALAVANCA": ["CORAGEM", "LUTO", "DESESPERO"],
        "EX_FUGA": ["BATALHAS", "CORAGEM", "DESESPERO"],
        "T1_REENCONTRO": ["ALEGRIA", "ESPERANÇA"],
        "EP_EPILOGO": ["CONTEMPLATIVO", "ESPERANÇA", "SAUDADE"],
        "END_FINAL": ["ESPERANÇA", "ALEGRIA"]
    },

    categoryIcons: {
        "ACAMPAMENTO": "🏕️",
        "ALEGRIA": "✨",
        "BATALHAS": "⚔️",
        "BIBLIOTECA": "📜",
        "BOBEIRAS": "🎭",
        "CAMPOS": "🌾",
        "CASTELO": "🏰",
        "CONTEMPLATIVO": "🕯️",
        "CORAGEM": "🦁",
        "COVIL DE CRIATURAS": "🐉",
        "CULPA": "🌧️",
        "DESERTO": "🏜️",
        "DESESPERO": "⚡",
        "ESPERANÇA": "🌟",
        "FESTIVAL": "🎉",
        "FLORESTA": "🌲",
        "LUTO": "🖤",
        "MAR": "🌊",
        "MASMORRA": "⛓️",
        "MEDO": "👁️",
        "MERCADO": "⚖️",
        "MISTÉRIO": "🔮",
        "MONTANHAS": "⛰️",
        "OFICINA ALQUIMICA": "🧪",
        "OUTROS": "🎵",
        "PÂNTANO": "🌫️",
        "RAIVA": "🔥",
        "RUÍNAS": "🏛️",
        "SAUDADE": "🍂",
        "SOLIDÃO": "❄️",
        "STEAMPUNK": "⚙️",
        "TAMURÁ": "⛩️",
        "TAVERNAS": "🍺",
        "TEMPLO": "🔔",
        "TRISTEZA": "💧"
    },

    init() {
        this.audioElement.volume = this.volume;
        this.audioElement.loop = this.isLooping;

        this.audioElement.addEventListener("timeupdate", () => this.onTimeUpdate());
        this.audioElement.addEventListener("ended", () => this.onTrackEnded());
        this.audioElement.addEventListener("play", () => {
            this.isPlaying = true;
            this.updatePlayerUI();
        });
        this.audioElement.addEventListener("pause", () => {
            this.isPlaying = false;
            this.updatePlayerUI();
        });
        this.audioElement.addEventListener("error", (e) => {
            console.error("Erro na reprodução de áudio:", e);
        });

        // Categoria inicial
        if (this.catalog.length > 0) {
            this.currentCategory = this.catalog[0].category;
        }

        this.render();
    },

    selectCategory(categoryName) {
        this.currentCategory = categoryName;
        this.renderCategoryTracks();
        this.renderCategoryButtons();
    },

    playTrack(track) {
        if (!track) return;
        this.currentTrack = track;
        this.audioElement.src = track.src;
        this.audioElement.play().catch(e => {
            console.warn("Autoplay bloqueado pelo navegador até interação do usuário.", e);
        });
        this.isPlaying = true;
        this.updatePlayerUI();
        this.renderCategoryTracks();
    },

    togglePlay() {
        if (!this.currentTrack) {
            // Se nenhuma faixa foi escolhida, toca a primeira da categoria atual
            const catObj = this.catalog.find(c => c.category === this.currentCategory);
            if (catObj && catObj.tracks.length > 0) {
                this.playTrack(catObj.tracks[0]);
                return;
            }
        }

        if (this.isPlaying) {
            this.audioElement.pause();
        } else {
            this.audioElement.play();
        }
    },

    nextTrack() {
        const catObj = this.catalog.find(c => c.category === this.currentCategory);
        if (!catObj || catObj.tracks.length === 0) return;

        if (this.isShuffle) {
            const randomIdx = Math.floor(Math.random() * catObj.tracks.length);
            this.playTrack(catObj.tracks[randomIdx]);
            return;
        }

        const currentIdx = catObj.tracks.findIndex(t => t.src === (this.currentTrack ? this.currentTrack.src : ""));
        const nextIdx = (currentIdx + 1) % catObj.tracks.length;
        this.playTrack(catObj.tracks[nextIdx]);
    },

    prevTrack() {
        const catObj = this.catalog.find(c => c.category === this.currentCategory);
        if (!catObj || catObj.tracks.length === 0) return;

        const currentIdx = catObj.tracks.findIndex(t => t.src === (this.currentTrack ? this.currentTrack.src : ""));
        const prevIdx = (currentIdx - 1 + catObj.tracks.length) % catObj.tracks.length;
        this.playTrack(catObj.tracks[prevIdx]);
    },

    toggleLoop() {
        this.isLooping = !this.isLooping;
        this.audioElement.loop = this.isLooping;
        const btn = document.getElementById("audio-loop-btn");
        if (btn) {
            btn.classList.toggle("active-control", this.isLooping);
            btn.title = this.isLooping ? "Repetir Faixa: Ativado" : "Repetir Faixa: Desativado";
        }
    },

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        const btn = document.getElementById("audio-shuffle-btn");
        if (btn) {
            btn.classList.toggle("active-control", this.isShuffle);
            btn.title = this.isShuffle ? "Aleatório: Ativado" : "Aleatório: Desativado";
        }
    },

    setVolume(value) {
        this.volume = parseFloat(value);
        this.audioElement.volume = this.volume;
        const volumeIcon = document.getElementById("audio-volume-icon");
        if (volumeIcon) {
            volumeIcon.innerText = this.volume === 0 ? "🔇" : this.volume < 0.5 ? "🔉" : "🔊";
        }
    },

    toggleMute() {
        if (this.audioElement.volume > 0) {
            this.prevVolume = this.volume;
            this.setVolume(0);
            const slider = document.getElementById("audio-volume-slider");
            if (slider) slider.value = 0;
        } else {
            const restored = this.prevVolume || 0.7;
            this.setVolume(restored);
            const slider = document.getElementById("audio-volume-slider");
            if (slider) slider.value = restored;
        }
    },

    seek(fraction) {
        if (this.audioElement.duration) {
            this.audioElement.currentTime = fraction * this.audioElement.duration;
        }
    },

    onTimeUpdate() {
        const cur = this.audioElement.currentTime || 0;
        const dur = this.audioElement.duration || 1;
        const progressPercent = (cur / dur) * 100;

        const progressBar = document.getElementById("audio-progress-fill");
        const curTimeDisplay = document.getElementById("audio-time-current");
        const durTimeDisplay = document.getElementById("audio-time-total");

        if (progressBar) progressBar.style.width = `${progressPercent}%`;
        if (curTimeDisplay) curTimeDisplay.innerText = this.formatTime(cur);
        if (durTimeDisplay && !isNaN(this.audioElement.duration)) {
            durTimeDisplay.innerText = this.formatTime(dur);
        }
    },

    onTrackEnded() {
        if (!this.isLooping) {
            this.nextTrack();
        }
    },

    formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    },

    onSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.renderCategoryTracks();
    },

    suggestAmbienceForNode(nodeId) {
        const suggestions = this.sceneCategorySuggestions[nodeId] || ["CONTEMPLATIVO", "MISTÉRIO"];
        const container = document.getElementById("scene-ambience-suggestions");
        if (!container) return;

        let html = `
            <div class="ambience-preset-bar">
                <span class="ambience-preset-label">🎵 Trilha Sugerida para a Cena:</span>
                <div class="ambience-preset-chips">
        `;

        suggestions.forEach(cat => {
            const icon = this.categoryIcons[cat] || "🎵";
            const isCurrent = this.currentCategory === cat;
            html += `
                <button class="ambience-chip ${isCurrent ? 'active' : ''}" onclick="AUDIO_PLAYER.selectCategory('${cat}'); AUDIO_PLAYER.playFirstOfCategory('${cat}');">
                    <span>${icon}</span>
                    <span>${cat}</span>
                </button>
            `;
        });

        html += `
                </div>
            </div>
        `;
        container.innerHTML = html;
    },

    playFirstOfCategory(categoryName) {
        this.currentCategory = categoryName;
        const catObj = this.catalog.find(c => c.category === categoryName);
        if (catObj && catObj.tracks.length > 0) {
            this.playTrack(catObj.tracks[0]);
        }
    },

    render() {
        this.renderCategoryButtons();
        this.renderCategoryTracks();
        this.updatePlayerUI();
    },

    renderCategoryButtons() {
        const container = document.getElementById("audio-category-list");
        if (!container) return;

        let html = "";
        this.catalog.forEach(cat => {
            const isActive = cat.category === this.currentCategory;
            const icon = this.categoryIcons[cat.category] || "🎵";
            html += `
                <button class="audio-category-btn ${isActive ? 'active' : ''}" onclick="AUDIO_PLAYER.selectCategory('${cat.category}')">
                    <span class="cat-icon">${icon}</span>
                    <span class="cat-name">${cat.category}</span>
                    <span class="cat-badge">${cat.trackCount}</span>
                </button>
            `;
        });
        container.innerHTML = html;
    },

    renderCategoryTracks() {
        const container = document.getElementById("audio-tracks-list");
        if (!container) return;

        const catObj = this.catalog.find(c => c.category === this.currentCategory);
        if (!catObj) {
            container.innerHTML = '<div style="color:var(--text-muted); font-size:0.8rem; padding:0.5rem;">Nenhuma faixa encontrada.</div>';
            return;
        }

        let filteredTracks = catObj.tracks;
        if (this.searchQuery) {
            filteredTracks = filteredTracks.filter(t => t.title.toLowerCase().includes(this.searchQuery));
        }

        if (filteredTracks.length === 0) {
            container.innerHTML = `<div style="color:var(--text-muted); font-size:0.8rem; padding:0.5rem;">Nenhuma faixa encontrada com o termo "${escapeHtml(this.searchQuery)}".</div>`;
            return;
        }

        let html = '<div class="audio-tracks-grid">';
        filteredTracks.forEach((t, idx) => {
            const isPlayingThis = this.currentTrack && this.currentTrack.src === t.src && this.isPlaying;
            const isSelected = this.currentTrack && this.currentTrack.src === t.src;

            html += `
                <div class="audio-track-card ${isSelected ? 'selected' : ''}" onclick="AUDIO_PLAYER.playTrack(AUDIO_PLAYER.catalog.find(c => c.category === '${catObj.category}').tracks[${idx}])">
                    <div class="track-play-icon">
                        ${isPlayingThis ? '⏸' : '▶'}
                    </div>
                    <div class="track-info">
                        <div class="track-title ${isPlayingThis ? 'playing-glow' : ''}">${escapeHtml(t.title)}</div>
                        <div class="track-meta">${catObj.category} • ${(t.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                    ${isPlayingThis ? `
                        <div class="audio-equalizer">
                            <span class="eq-bar eq-1"></span>
                            <span class="eq-bar eq-2"></span>
                            <span class="eq-bar eq-3"></span>
                        </div>
                    ` : ''}
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    updatePlayerUI() {
        const titleDisplay = document.getElementById("audio-current-title");
        const categoryDisplay = document.getElementById("audio-current-category");
        const playBtn = document.getElementById("audio-play-btn");

        if (titleDisplay) {
            titleDisplay.innerText = this.currentTrack ? this.currentTrack.title : "Nenhuma faixa selecionada";
        }
        if (categoryDisplay) {
            const icon = this.currentCategory ? (this.categoryIcons[this.currentCategory] || "🎵") : "🎵";
            categoryDisplay.innerText = this.currentTrack ? `${icon} ${this.currentCategory}` : "Selecione uma categoria ou trilha sugerida";
        }
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? "❚❚" : "▶";
            playBtn.title = this.isPlaying ? "Pausar" : "Tocar";
        }
    }
};

window.AUDIO_PLAYER = AUDIO_PLAYER;

document.addEventListener("DOMContentLoaded", () => {
    AUDIO_PLAYER.init();
});
