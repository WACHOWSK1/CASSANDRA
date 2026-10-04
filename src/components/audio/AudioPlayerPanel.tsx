'use client';

import React from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { AUDIO_CATALOG } from '@/data/audioCatalog';
import { 
  Music, 
  Search, 
  Play, 
  Pause, 
  Folder
} from 'lucide-react';

export const AudioPlayerPanel: React.FC = () => {
  const { 
    currentCategory, 
    currentTrack, 
    isPlaying, 
    selectCategory, 
    playTrack, 
    togglePlay, 
    searchQuery, 
    setSearchQuery 
  } = useAudioStore();

  const activeCatObj = AUDIO_CATALOG.find(c => c.category === currentCategory) || AUDIO_CATALOG[0];

  const filteredTracks = (activeCatObj?.tracks || []).filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#141724]/90 border border-[#9d4edd]/25 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl flex-shrink-0">
      {/* Header do Painel */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-[#c77dff]" />
          <h3 className="font-serif font-bold text-sm text-[#ffd166]">
            Banco de Músicas & Ambiências de RPG (121 Faixas em 32 Categorias)
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          Categoria Atual: <strong className="text-white">{currentCategory}</strong> ({activeCatObj?.trackCount || 0} faixas)
        </span>
      </div>

      {/* Input de Busca */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Filtrar faixas por título..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#0d0f17] border border-[#2a2f45] focus:border-[#c77dff] rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
        />
      </div>

      {/* Categorias Roláveis */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {AUDIO_CATALOG.map((cat) => {
          const isSelected = cat.category === currentCategory;
          return (
            <button
              key={cat.category}
              onClick={() => selectCategory(cat.category)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#9d4edd] to-[#5a189a] text-white border border-[#c77dff] shadow-[0_0_12px_rgba(157,78,221,0.5)]'
                  : 'bg-[#0a0b10]/70 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{cat.category}</span>
              <span className="bg-black/30 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {cat.trackCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid de Faixas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
        {filteredTracks.map((track) => {
          const isCurrent = currentTrack?.filename === track.filename;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.filename}
              onClick={() => {
                if (isCurrent) {
                  togglePlay();
                } else {
                  playTrack(track, currentCategory);
                }
              }}
              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-[#9d4edd]/25 border-[#ffd166] shadow-[0_0_10px_rgba(255,209,102,0.25)]'
                  : 'bg-[#0a0b10]/60 border-white/5 hover:border-[#c77dff]/40 hover:bg-[#9d4edd]/15'
              }`}
            >
              <button className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#ffd166] flex-shrink-0">
                {isCurrentPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-[#ffd166]" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-[#ffd166] translate-x-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className={`font-semibold truncate ${isCurrent ? 'text-[#ffd166] font-bold' : 'text-gray-200'}`}>
                  {track.title}
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  {currentCategory}
                </div>
              </div>

              {/* Equalizador animado se tocando */}
              {isCurrentPlaying && (
                <div className="flex items-end gap-0.5 h-3.5 flex-shrink-0">
                  <div className="w-1 bg-[#ffd166] rounded-full animate-eq-1" />
                  <div className="w-1 bg-[#ffd166] rounded-full animate-eq-2" />
                  <div className="w-1 bg-[#ffd166] rounded-full animate-eq-3" />
                </div>
              )}
            </div>
          );
        })}

        {filteredTracks.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-gray-500">
            Nenhuma faixa encontrada com o termo "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
