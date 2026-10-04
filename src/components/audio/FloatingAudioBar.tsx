'use client';

import React from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Music 
} from 'lucide-react';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const FloatingAudioBar: React.FC = () => {
  const {
    currentTrack,
    currentCategory,
    isPlaying,
    volume,
    isMuted,
    isLooping,
    isShuffle,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    seek
  } = useAudioStore();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="bg-[#0e1018]/95 backdrop-blur-xl border-t border-[#9d4edd]/25 px-6 py-2.5 grid grid-cols-1 md:grid-cols-3 items-center gap-4 shadow-2xl z-40 flex-shrink-0">
      {/* Informações da Faixa Atual */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9d4edd]/40 to-[#e63946]/30 border border-[#c77dff]/40 flex items-center justify-center text-[#ffd166] flex-shrink-0 shadow-[0_0_12px_rgba(157,78,221,0.3)]">
          <Music className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-xs text-white truncate drop-shadow">
            {currentTrack ? currentTrack.title : "Nenhuma faixa em reprodução"}
          </div>
          <div className="text-[11px] text-[#c77dff] truncate">
            {currentTrack ? `Categoria: ${currentCategory}` : "Selecione uma faixa no Banco de Músicas"}
          </div>
        </div>
      </div>

      {/* Controles Centrais & Barra de Progresso */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleShuffle}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isShuffle ? 'text-[#ffd166] bg-white/10' : 'text-gray-500 hover:text-gray-300'
            }`}
            title={`Aleatório: ${isShuffle ? 'Ativado' : 'Desativado'}`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={prevTrack}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Faixa Anterior"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ffd166] to-[#d4af37] text-gray-950 flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_12px_rgba(255,209,102,0.5)] font-bold"
            title={isPlaying ? "Pausar" : "Tocar"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 translate-x-0.5" />
            )}
          </button>

          <button 
            onClick={nextTrack}
            className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Próxima Faixa"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button 
            onClick={toggleLoop}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isLooping ? 'text-[#ffd166] bg-white/10' : 'text-gray-500 hover:text-gray-300'
            }`}
            title={`Repetição: ${isLooping ? 'Ativada' : 'Desativada'}`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Linha do Tempo */}
        <div className="w-full max-w-md flex items-center gap-2 text-[10px] font-mono text-gray-400">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickFraction = (e.clientX - rect.left) / rect.width;
              seek(clickFraction);
            }}
            className="flex-1 h-1.5 bg-[#252a3d] hover:h-2 rounded-full cursor-pointer relative overflow-hidden transition-all"
          >
            <div 
              className="h-full bg-gradient-to-r from-[#9d4edd] to-[#ffd166] rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-end gap-2.5">
        <button 
          onClick={toggleMute}
          className="text-gray-400 hover:text-white transition-colors"
          title={isMuted ? "Desmutar" : "Silenciar"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#ffd166]" />
          )}
        </button>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-[#ffd166] h-1.5 bg-gray-700 rounded-lg cursor-pointer"
        />
      </div>
    </footer>
  );
};
