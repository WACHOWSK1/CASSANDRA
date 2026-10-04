import { create } from 'zustand';
import { AUDIO_CATALOG } from '@/data/audioCatalog';
import { AudioTrack, AudioCategory } from '@/types/adventure';

export const SCENE_AMBIENCE_MAP: Record<string, string[]> = {
  "S": ["ACAMPAMENTO", "MERCADO", "VIAGEM", "TAVERNAS"],
  "C1": ["CONVERSA", "INVESTIGAÇÃO", "VIAGEM"],
  "C2": ["BATALHAS", "TENSO", "VIAGEM"],
  "G": ["CIDADE DESTRUÍDA", "DESESPERO", "TENSO", "MEDO"],
  "GS": ["VITÓRIA", "CONVERSA", "ACAMPAMENTO"],
  "GC": ["DESESPERO", "TENSO", "MEDO"],
  "Q": ["ENIGMA", "TEMPLO", "OFICINA ALQUIMICA", "MAGIA"],
  "F_DECISION": ["ENIGMA", "OFICINA ALQUIMICA", "TEMPLO"],
  "A_CORTEJO": ["FURTIVIDADE", "TEMPLO", "SEITAS"],
  "B_MERCENARIOS": ["TAVERNAS", "BATALHAS", "TENSO"],
  "D_CANAL": ["MASMORRA", "ESGOTO", "FURTIVIDADE"],
  "X_PLANO": ["INVESTIGAÇÃO", "FURTIVIDADE", "TENSO"],
  "M": ["MASMORRA", "SEITAS", "MEDO", "TEMPLO"],
  "V_DESMASCARAR": ["SUSPENSE", "INVESTIGAÇÃO", "TENSO"],
  "VF": ["BATALHAS", "BATALHA CONTRA CHEFE", "ÉPICO"],
  "VE_FUGA": ["FUGA", "BATALHAS", "TENSO"],
  "RES_INTEGRA": ["ESPERANÇA", "DRAMA", "TEMPLO"],
  "RA_CAPELA": ["TEMPLO", "SEITAS", "TENSO"],
  "RB_SAIDA": ["FUGA", "TENSO", "VIAGEM"],
  "BOSS_SEVERIAN": ["BATALHA CONTRA CHEFE", "BATALHAS", "DESESPERO", "ÉPICO"],
  "VER_VERDADE": ["DRAMA", "REVELAÇÃO", "CONVERSA"],
  "E_NOME": ["ESPERANÇA", "ÉPICO", "VITÓRIA"],
  "A_ASCENSAO": ["DESESPERO", "BATALHA CONTRA CHEFE", "MEDO", "TEMPESTADE"],
  "H_ALAVANCA": ["DRAMA", "DESESPERO", "ÉPICO"],
  "EX_FUGA": ["FUGA", "BATALHAS", "DESESPERO", "TEMPESTADE"],
  "ES_PERFEITO": ["VITÓRIA", "ESPERANÇA", "FINAL FELIZ"],
  "T1_REENCONTRO": ["DRAMA", "FINAL FELIZ", "ESPERANÇA"],
  "SI1_SINETE_PARTIDO": ["DRAMA", "FINAL FELIZ", "VITÓRIA"],
  "END_FINAL": ["FINAL FELIZ", "VITÓRIA", "ESPERANÇA"]
};

interface AudioStoreState {
  currentCategory: string;
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffle: boolean;
  currentTime: number;
  duration: number;
  searchQuery: string;
  suggestedCategories: string[];

  // Actions
  selectCategory: (categoryName: string) => void;
  playTrack: (track: AudioTrack, categoryName?: string) => void;
  playFirstOfCategory: (categoryName: string) => void;
  togglePlay: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  seek: (progressFraction: number) => void;
  setSearchQuery: (query: string) => void;
  updateTime: (curr: number, dur: number) => void;
  suggestAmbienceForNode: (nodeId: string) => void;
}

let globalAudio: HTMLAudioElement | null = null;

function getAudioElement(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!globalAudio) {
    globalAudio = new Audio();
    globalAudio.preload = "auto";
  }
  return globalAudio;
}

export const useAudioStore = create<AudioStoreState>((set, get) => ({
  currentCategory: AUDIO_CATALOG[0]?.category || "BATALHAS",
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  isLooping: true,
  isShuffle: false,
  currentTime: 0,
  duration: 0,
  searchQuery: "",
  suggestedCategories: ["ACAMPAMENTO", "MERCADO", "VIAGEM"],

  selectCategory: (cat) => set({ currentCategory: cat }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  playTrack: (track, categoryName) => {
    const audio = getAudioElement();
    const cat = categoryName || get().currentCategory;
    if (audio) {
      audio.src = track.src;
      audio.loop = get().isLooping;
      audio.volume = get().isMuted ? 0 : get().volume;
      audio.play().catch(e => console.warn("Autoplay bloqueado pelo navegador:", e));

      audio.ontimeupdate = () => {
        get().updateTime(audio.currentTime, audio.duration || 0);
      };

      audio.onended = () => {
        if (!get().isLooping) {
          get().nextTrack();
        }
      };
    }
    set({
      currentTrack: track,
      currentCategory: cat,
      isPlaying: true
    });
  },

  playFirstOfCategory: (categoryName) => {
    const catObj = AUDIO_CATALOG.find(c => c.category.toUpperCase() === categoryName.toUpperCase());
    if (catObj && catObj.tracks.length > 0) {
      get().playTrack(catObj.tracks[0], catObj.category);
    }
  },

  togglePlay: () => {
    const audio = getAudioElement();
    const { isPlaying, currentTrack, currentCategory } = get();

    if (!currentTrack) {
      const catObj = AUDIO_CATALOG.find(c => c.category === currentCategory) || AUDIO_CATALOG[0];
      if (catObj && catObj.tracks.length > 0) {
        get().playTrack(catObj.tracks[0], catObj.category);
      }
      return;
    }

    if (audio) {
      if (isPlaying) {
        audio.pause();
        set({ isPlaying: false });
      } else {
        audio.play().catch(e => console.warn("Erro ao reproduzir:", e));
        set({ isPlaying: true });
      }
    }
  },

  pause: () => {
    const audio = getAudioElement();
    if (audio) audio.pause();
    set({ isPlaying: false });
  },

  nextTrack: () => {
    const { currentCategory, currentTrack, isShuffle } = get();
    const catObj = AUDIO_CATALOG.find(c => c.category === currentCategory);
    if (!catObj || catObj.tracks.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * catObj.tracks.length);
      get().playTrack(catObj.tracks[randomIndex], currentCategory);
      return;
    }

    const currentIndex = currentTrack ? catObj.tracks.findIndex(t => t.filename === currentTrack.filename) : -1;
    const nextIndex = (currentIndex + 1) % catObj.tracks.length;
    get().playTrack(catObj.tracks[nextIndex], currentCategory);
  },

  prevTrack: () => {
    const { currentCategory, currentTrack } = get();
    const catObj = AUDIO_CATALOG.find(c => c.category === currentCategory);
    if (!catObj || catObj.tracks.length === 0) return;

    const currentIndex = currentTrack ? catObj.tracks.findIndex(t => t.filename === currentTrack.filename) : 0;
    const prevIndex = (currentIndex - 1 + catObj.tracks.length) % catObj.tracks.length;
    get().playTrack(catObj.tracks[prevIndex], currentCategory);
  },

  setVolume: (vol) => {
    const audio = getAudioElement();
    if (audio) {
      audio.volume = vol;
    }
    set({ volume: vol, isMuted: vol === 0 });
  },

  toggleMute: () => {
    const audio = getAudioElement();
    const { isMuted, volume } = get();
    const newMuted = !isMuted;
    if (audio) {
      audio.volume = newMuted ? 0 : volume;
    }
    set({ isMuted: newMuted });
  },

  toggleLoop: () => {
    const audio = getAudioElement();
    const newLoop = !get().isLooping;
    if (audio) audio.loop = newLoop;
    set({ isLooping: newLoop });
  },

  toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),

  seek: (fraction) => {
    const audio = getAudioElement();
    if (audio && audio.duration) {
      const targetTime = Math.max(0, Math.min(fraction * audio.duration, audio.duration));
      audio.currentTime = targetTime;
      set({ currentTime: targetTime });
    }
  },

  updateTime: (curr, dur) => set({ currentTime: curr, duration: dur }),

  suggestAmbienceForNode: (nodeId) => {
    const suggestions = SCENE_AMBIENCE_MAP[nodeId] || ["VIAGEM", "TENSO", "BATALHAS"];
    set({ suggestedCategories: suggestions });
  }
}));
