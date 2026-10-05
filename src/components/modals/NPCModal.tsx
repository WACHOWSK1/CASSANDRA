'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { NPC_DATABASE } from '@/data/adventureData';
import { 
  X, 
  Shield, 
  Zap, 
  Swords, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Brain, 
  Dices, 
  Eye, 
  Users, 
  Flame, 
  Compass, 
  Crosshair,
  Award,
  ChevronRight
} from 'lucide-react';
import { NPCStats } from '@/types/adventure';

export const NPCModal: React.FC = () => {
  const { selectedNPCForModal, openNPCModal, closeNPCModal, rollDice } = useAdventureStore();
  const [activeTab, setActiveTab] = useState<'ficha' | 'taticas' | 'roleplay'>('ficha');
  const [categoryFilter, setCategoryFilter] = useState<'todos' | 'aliado' | 'antagonista' | 'coadjuvante' | 'ameaca'>('todos');

  if (!selectedNPCForModal) return null;

  const currentNpc = NPC_DATABASE[selectedNPCForModal] || NPC_DATABASE['cassandra'];
  const allNpcs = Object.values(NPC_DATABASE);

  const filteredNpcs = categoryFilter === 'todos' 
    ? allNpcs 
    : allNpcs.filter(n => n.category === categoryFilter);

  const getCategoryBadge = (cat: NPCStats['category']) => {
    switch (cat) {
      case 'aliado':
        return { label: 'Aliado / Companheiro', class: 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]/50' };
      case 'antagonista':
        return { label: 'Chefe / Antagonista', class: 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]/50' };
      case 'coadjuvante':
        return { label: 'Coadjuvante / Refém', class: 'bg-[#ffd166]/20 text-[#ffd166] border-[#ffd166]/50' };
      case 'ameaca':
        return { label: 'Tropa / Monstro', class: 'bg-[#9d4edd]/20 text-[#c77dff] border-[#9d4edd]/50' };
    }
  };

  const getAttrMod = (val: number) => {
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) closeNPCModal();
      }}
      className="fixed inset-0 z-50 bg-[#06070a]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-[#121522] border border-[#c77dff]/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(157,78,221,0.4)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* TOP BAR: Seletor Rápido de Personagens */}
        <div className="bg-[#0c0e17] border-b border-[#9d4edd]/30 p-3 flex flex-col gap-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ffd166]" />
              <h3 className="font-serif font-bold text-sm tracking-wider text-[#ffd166] uppercase">
                Compêndio de Fichas dos Personagens & Ameaças
              </h3>
              <span className="text-[11px] text-[#9aa0b4] hidden sm:inline">
                ({allNpcs.length} Fichas T20 Disponíveis)
              </span>
            </div>

            <button 
              onClick={closeNPCModal}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#e63946] text-white flex items-center justify-center transition-colors"
              title="Fechar (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
            <button
              onClick={() => setCategoryFilter('todos')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                categoryFilter === 'todos'
                  ? 'bg-[#9d4edd] text-white shadow-[0_0_10px_rgba(157,78,221,0.5)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Todos ({allNpcs.length})
            </button>
            <button
              onClick={() => setCategoryFilter('aliado')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                categoryFilter === 'aliado'
                  ? 'bg-[#2a9d8f] text-white shadow-[0_0_10px_rgba(42,157,143,0.5)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              🛡️ Aliados ({allNpcs.filter(n => n.category === 'aliado').length})
            </button>
            <button
              onClick={() => setCategoryFilter('antagonista')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                categoryFilter === 'antagonista'
                  ? 'bg-[#e63946] text-white shadow-[0_0_10px_rgba(230,57,70,0.5)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              💀 Chefes & Vilões ({allNpcs.filter(n => n.category === 'antagonista').length})
            </button>
            <button
              onClick={() => setCategoryFilter('coadjuvante')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                categoryFilter === 'coadjuvante'
                  ? 'bg-[#e0a96d] text-gray-950 shadow-[0_0_10px_rgba(224,169,109,0.5)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              📜 Coadjuvantes ({allNpcs.filter(n => n.category === 'coadjuvante').length})
            </button>
            <button
              onClick={() => setCategoryFilter('ameaca')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                categoryFilter === 'ameaca'
                  ? 'bg-[#5a189a] text-white shadow-[0_0_10px_rgba(90,24,154,0.5)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              ⚔️ Tropas & Monstros ({allNpcs.filter(n => n.category === 'ameaca').length})
            </button>
          </div>

          {/* Lista de Personagens para alternar com 1 clique */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {filteredNpcs.map((npc) => {
              const isCurrent = npc.id === currentNpc.id;
              return (
                <button
                  key={npc.id}
                  onClick={() => openNPCModal(npc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#9d4edd] to-[#5a189a] text-white border-[#ffd166] shadow-[0_0_12px_rgba(157,78,221,0.6)] ring-1 ring-[#ffd166]'
                      : 'bg-[#181b2a] text-gray-300 border-white/5 hover:border-[#9d4edd]/50 hover:bg-[#202538]'
                  }`}
                >
                  <span>{npc.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">ND {npc.nd}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* HEADER DA FICHA DO PERSONAGEM ATIVO */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#9d4edd]/25 bg-gradient-to-r from-[#181b2a] via-[#141724] to-[#181b2a] flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getCategoryBadge(currentNpc.category).class}`}>
                  {getCategoryBadge(currentNpc.category).label}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40">
                  ND {currentNpc.nd}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {currentNpc.tipo} {currentNpc.tamanho ? `• ${currentNpc.tamanho}` : ''} {currentNpc.deslocamento ? `• Desl. ${currentNpc.deslocamento}` : ''}
                </span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#ffd166] drop-shadow">
                {currentNpc.name}
              </h2>
              <p className="text-xs text-[#c77dff] font-medium">
                {currentNpc.role}
              </p>
            </div>

            {/* Abas da Ficha */}
            <div className="flex items-center gap-1 bg-[#0a0b10] border border-[#9d4edd]/30 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('ficha')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ficha'
                    ? 'bg-[#9d4edd] text-white shadow-[0_0_10px_rgba(157,78,221,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Ficha T20 & Combate</span>
              </button>

              <button
                onClick={() => setActiveTab('taticas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'taticas'
                    ? 'bg-[#9d4edd] text-white shadow-[0_0_10px_rgba(157,78,221,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5 text-amber-300" />
                <span>Táticas do Mestre</span>
              </button>

              <button
                onClick={() => setActiveTab('roleplay')}
                className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'roleplay'
                    ? 'bg-[#9d4edd] text-white shadow-[0_0_10px_rgba(157,78,221,0.5)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                <span>Interpretação & História</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed max-w-4xl">
            {currentNpc.description}
          </p>
        </div>

        {/* CONTEÚDO SCROLLÁVEL DA FICHA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
          
          {/* ABA 1: FICHA T20 & COMBATE */}
          {activeTab === 'ficha' && (
            <div className="space-y-4">
              
              {/* ESTATÍSTICAS PRINCIPAIS (PV, PM, DEFESA, RD, INICIATIVA) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div className="bg-[#0a0b10]/80 border border-[#e63946]/40 rounded-xl p-2.5 text-center flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#ff758f] uppercase">
                    <Heart className="w-3.5 h-3.5 text-[#e63946]" />
                    <span>Pontos de Vida</span>
                  </div>
                  <span className="font-mono text-lg font-black text-white mt-0.5">
                    {currentNpc.combatStats.pv ?? '--'}
                  </span>
                </div>

                <div className="bg-[#0a0b10]/80 border border-[#2ec4b6]/40 rounded-xl p-2.5 text-center flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#48cae4] uppercase">
                    <Zap className="w-3.5 h-3.5 text-[#2ec4b6]" />
                    <span>Pontos de Mana</span>
                  </div>
                  <span className="font-mono text-lg font-black text-white mt-0.5">
                    {currentNpc.combatStats.pm ?? '--'}
                  </span>
                </div>

                <div className="bg-[#0a0b10]/80 border border-[#9d4edd]/40 rounded-xl p-2.5 text-center flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#c77dff] uppercase">
                    <Shield className="w-3.5 h-3.5 text-[#9d4edd]" />
                    <span>Defesa</span>
                  </div>
                  <span className="font-mono text-lg font-black text-white mt-0.5">
                    {currentNpc.combatStats.defesa ?? '--'}
                  </span>
                </div>

                <div className="bg-[#0a0b10]/80 border border-[#ffd166]/40 rounded-xl p-2.5 text-center flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#ffd166] uppercase">
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Redução Dano</span>
                  </div>
                  <span className="font-mono text-xs font-black text-white mt-0.5">
                    {currentNpc.combatStats.rd !== undefined ? `RD ${currentNpc.combatStats.rd}` : 'Nenhuma'}
                  </span>
                </div>

                <div className="bg-[#0a0b10]/80 border border-white/10 rounded-xl p-2.5 text-center flex flex-col justify-center col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-300 uppercase">
                    <Compass className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Iniciativa</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="font-mono text-lg font-black text-white">
                      +{currentNpc.combatStats.iniciativa ?? 0}
                    </span>
                    <button
                      onClick={() => {
                        const initVal = typeof currentNpc.combatStats.iniciativa === 'number' 
                          ? currentNpc.combatStats.iniciativa 
                          : parseInt(String(currentNpc.combatStats.iniciativa)) || 0;
                        rollDice(`Iniciativa (${currentNpc.name})`, null, initVal);
                      }}
                      className="p-1 rounded bg-[#9d4edd]/30 hover:bg-[#9d4edd] text-white transition-colors text-[10px]"
                      title="Rolar Iniciativa com d20"
                    >
                      <Dices className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ATRIBUTOS (FOR, DES, CON, INT, SAB, CAR) */}
              {currentNpc.atributos && (
                <div className="bg-[#0a0b10]/70 border border-[#9d4edd]/25 rounded-xl p-3">
                  <div className="text-xs font-serif font-bold text-[#ffd166] uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Atributos & Modificadores:</span>
                    <span className="text-[10px] text-gray-400 font-sans font-normal">Clique no dado para rolar teste de atributo</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                    {(
                      [
                        { key: 'for', label: 'FOR', name: 'Força' },
                        { key: 'des', label: 'DES', name: 'Destreza' },
                        { key: 'con', label: 'CON', name: 'Constituição' },
                        { key: 'int', label: 'INT', name: 'Inteligência' },
                        { key: 'sab', label: 'SAB', name: 'Sabedoria' },
                        { key: 'car', label: 'CAR', name: 'Carisma' }
                      ] as const
                    ).map((attr) => {
                      const score = currentNpc.atributos![attr.key];
                      const mod = Math.floor((score - 10) / 2);
                      const modStr = getAttrMod(score);

                      return (
                        <div key={attr.key} className="bg-[#141724] border border-white/10 hover:border-[#c77dff]/60 rounded-xl p-2 transition-all">
                          <span className="text-[11px] font-bold text-gray-400 block">{attr.label}</span>
                          <span className="font-mono text-sm font-bold text-white">{score}</span>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <span className="font-mono text-xs font-bold text-[#ffd166] bg-white/5 px-1.5 py-0.5 rounded">
                              {modStr}
                            </span>
                            <button
                              onClick={() => rollDice(`Teste de ${attr.name} (${currentNpc.name})`, null, mod)}
                              className="p-1 rounded bg-[#9d4edd]/20 hover:bg-[#9d4edd] text-[#ffd166] hover:text-white transition-colors"
                              title={`Rolar teste de ${attr.name}`}
                            >
                              <Dices className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PERÍCIAS NOTÁVEIS */}
              {currentNpc.pericias && currentNpc.pericias.length > 0 && (
                <div className="bg-[#0a0b10]/70 border border-[#9d4edd]/25 rounded-xl p-3">
                  <div className="text-xs font-serif font-bold text-[#ffd166] uppercase tracking-wider mb-2">
                    Perícias Notáveis & Bônus:
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentNpc.pericias.map((per, idx) => (
                      <button
                        key={idx}
                        onClick={() => rollDice(`Perícia: ${per.nome} (${currentNpc.name})`, null, per.mod)}
                        className="px-2.5 py-1 rounded-lg bg-[#141724] hover:bg-[#9d4edd]/30 border border-white/10 hover:border-[#c77dff] text-xs flex items-center gap-1.5 transition-all text-gray-200 hover:text-white group"
                        title={`Clique para rolar d20 + ${per.mod} (${per.nome})`}
                      >
                        <span className="font-medium">{per.nome}</span>
                        <span className="font-mono font-bold text-[#2ec4b6]">+{per.mod}</span>
                        <Dices className="w-3 h-3 text-gray-500 group-hover:text-amber-300 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SENTIDOS, RESISTÊNCIAS & IMUNIDADES */}
              {(currentNpc.combatStats.sentidos || (currentNpc.combatStats.resistencias && currentNpc.combatStats.resistencias.length > 0) || (currentNpc.combatStats.imunidades && currentNpc.combatStats.imunidades.length > 0)) && (
                <div className="bg-[#0a0b10]/70 border border-[#48cae4]/30 rounded-xl p-3 space-y-2 text-xs">
                  <div className="font-serif font-bold text-[#48cae4] uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#48cae4]" />
                    <span>Sentidos, Resistências & Imunidades:</span>
                  </div>

                  <div className="space-y-1.5 text-gray-300">
                    {currentNpc.combatStats.sentidos && (
                      <div className="flex items-start gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0 mt-0.5" />
                        <div><strong className="text-gray-200">Sentidos:</strong> {currentNpc.combatStats.sentidos}</div>
                      </div>
                    )}
                    {currentNpc.combatStats.resistencias && currentNpc.combatStats.resistencias.length > 0 && (
                      <div className="flex items-start gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5" />
                        <div><strong className="text-gray-200">Resistências & Salvaguardas:</strong> {currentNpc.combatStats.resistencias.join(' • ')}</div>
                      </div>
                    )}
                    {currentNpc.combatStats.imunidades && currentNpc.combatStats.imunidades.length > 0 && (
                      <div className="flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-300 flex-shrink-0 mt-0.5" />
                        <div><strong className="text-gray-200">Imunidades:</strong> {currentNpc.combatStats.imunidades.join(', ')}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ATAQUES & AÇÕES OFENSIVAS */}
              {currentNpc.combatStats.ataques && currentNpc.combatStats.ataques.length > 0 && (
                <div className="bg-[#0a0b10]/80 border border-[#e63946]/30 rounded-xl p-3.5 space-y-2.5">
                  <div className="text-xs font-serif font-bold text-[#ff758f] uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Swords className="w-3.5 h-3.5 text-[#e63946]" />
                      <span>Ataques & Ações de Combate (Clique para Rolar):</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-sans font-normal">Rolagem automática no DiceRoller</span>
                  </div>

                  <div className="space-y-2">
                    {currentNpc.combatStats.ataques.map((atk, idx) => (
                      <div 
                        key={idx}
                        className="bg-[#141724] border border-white/5 hover:border-[#e63946]/50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all hover:bg-[#181c2e]"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-white">{atk.nome}</span>
                            <span className="font-mono text-xs font-bold text-[#ffd166] bg-[#ffd166]/10 px-2 py-0.5 rounded border border-[#ffd166]/20">
                              {atk.teste}
                            </span>
                            <span className="text-[11px] font-mono text-cyan-300">
                              Alcance: {atk.alcance}
                            </span>
                          </div>

                          <div className="text-xs text-gray-300 flex items-center gap-2 flex-wrap">
                            <span>Dano: <strong className="font-mono text-[#ff758f]">{atk.dano}</strong> ({atk.tipo})</span>
                            {atk.critico && <span className="text-gray-400">| Crítico: <strong className="text-amber-300">{atk.critico}</strong></span>}
                          </div>

                          {atk.especial && (
                            <p className="text-[11px] text-amber-200/90 italic pt-0.5">
                              ★ {atk.especial}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => rollDice(`Ataque: ${atk.nome} (${currentNpc.name}) [Dano: ${atk.dano} ${atk.tipo}]`, null, atk.mod)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#e63946] to-[#9d0208] hover:from-[#ff4d6d] hover:to-[#e63946] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(230,57,70,0.4)] transition-all flex-shrink-0"
                        >
                          <Dices className="w-3.5 h-3.5" />
                          <span>Rolar Ataque</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MAGIAS PREPARADAS */}
              {currentNpc.combatStats.magias && currentNpc.combatStats.magias.length > 0 && (
                <div className="bg-[#0a0b10]/80 border border-[#2ec4b6]/30 rounded-xl p-3.5 space-y-2.5">
                  <div className="text-xs font-serif font-bold text-[#48cae4] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#2ec4b6]" />
                    <span>Magias & Poderes Arcanos / Profanos:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentNpc.combatStats.magias.map((sp, idx) => (
                      <div key={idx} className="bg-[#141724] border border-white/5 rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{sp.nome}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2ec4b6]/20 text-[#2ec4b6] border border-[#2ec4b6]/30">
                            {sp.custoPM} PM {sp.cd ? `• CD ${sp.cd}` : ''}
                          </span>
                        </div>

                        {sp.escola && (
                          <span className="text-[10px] text-[#c77dff] block font-serif">
                            {sp.escola} {sp.alcance ? `• ${sp.alcance}` : ''}
                          </span>
                        )}

                        <p className="text-xs text-gray-300 leading-relaxed pt-1">
                          {sp.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HABILIDADES ESPECIAIS */}
              {currentNpc.combatStats.habilidades && currentNpc.combatStats.habilidades.length > 0 && (
                <div className="bg-[#0a0b10]/80 border border-[#9d4edd]/30 rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-serif font-bold text-[#ffd166] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c77dff]" />
                    <span>Habilidades Especiais & Passivas:</span>
                  </div>

                  <div className="space-y-2">
                    {currentNpc.combatStats.habilidades.map((hab, idx) => {
                      if (typeof hab === 'string') {
                        return (
                          <div key={idx} className="text-xs text-gray-300 bg-[#141724] p-2.5 rounded-lg border border-white/5 leading-relaxed">
                            {hab}
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="bg-[#141724] p-2.5 rounded-lg border border-white/5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{hab.nome}</span>
                            <span className="text-[10px] font-mono text-cyan-300 bg-white/5 px-2 py-0.5 rounded">
                              {hab.tipoAcao} {hab.custoPM ? `(${hab.custoPM} PM)` : ''}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed">{hab.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA 2: TÁTICAS DO MESTRE */}
          {activeTab === 'taticas' && (
            <div className="space-y-4">
              <div className="bg-[#e0a96d]/10 border border-[#e0a96d]/40 rounded-2xl p-4 space-y-3 text-xs leading-relaxed text-[#f7e1c8]">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#ffd166] uppercase tracking-wide">
                  <Crosshair className="w-4 h-4 text-amber-300" />
                  <span>Guia Tático de Condução para o Mestre:</span>
                </div>

                <p className="text-sm text-gray-200">
                  {currentNpc.taticas || "Utilize o terreno a favor do NPC e reaja dinamicamente às escolhas dos jogadores."}
                </p>

                {currentNpc.combatStats.ataques && (
                  <div className="mt-3 pt-3 border-t border-[#e0a96d]/20 space-y-2">
                    <span className="font-bold text-[#ffd166] block">Recomendações de Ação em Rodadas de Combate:</span>
                    <ul className="space-y-1.5 pl-4 list-disc text-gray-300">
                      <li><strong>Rodada 1 (Abertura):</strong> Posicione-se com vantagem ou utilize habilidades de controle/área para desestabilizar os heróis.</li>
                      <li><strong>Rodada 2 (Pico de Ação):</strong> Foque nos alvos mais vulneráveis (conjuradores ou flanqueadores) usando ataques especiais.</li>
                      <li><strong>Rodada 3+ (Adaptação):</strong> Se ferido gravemente, utilize habilidades de fuga, contra-ataque ou invoque reforços.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Equipamentos & Itens */}
              {currentNpc.equipamentos && currentNpc.equipamentos.length > 0 && (
                <div className="bg-[#0a0b10]/80 border border-[#9d4edd]/30 rounded-xl p-3.5">
                  <span className="font-serif font-bold text-xs text-[#ffd166] uppercase tracking-wider block mb-2">
                    Equipamentos, Armas & Itens Transportados:
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-gray-300">
                    {currentNpc.equipamentos.map((eq, idx) => (
                      <li key={idx}>{eq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ABA 3: INTERPRETAÇÃO & HISTÓRIA */}
          {activeTab === 'roleplay' && (
            <div className="space-y-4">
              {currentNpc.roleplay?.citacao && (
                <div className="bg-[#0a0b10]/90 border-l-4 border-[#ffd166] rounded-r-2xl p-4 text-sm italic text-[#ffd166] shadow-lg">
                  "{currentNpc.roleplay.citacao}"
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentNpc.roleplay?.personalidade && (
                  <div className="bg-[#141724] border border-white/5 rounded-xl p-3.5 space-y-1.5">
                    <span className="font-serif font-bold text-xs text-[#c77dff] uppercase tracking-wider block">
                      🎭 Personalidade & Voz:
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {currentNpc.roleplay.personalidade}
                    </p>
                  </div>
                )}

                {currentNpc.roleplay?.motivacao && (
                  <div className="bg-[#141724] border border-white/5 rounded-xl p-3.5 space-y-1.5">
                    <span className="font-serif font-bold text-xs text-[#2ec4b6] uppercase tracking-wider block">
                      🎯 Motivações & Objetivos:
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {currentNpc.roleplay.motivacao}
                    </p>
                  </div>
                )}
              </div>

              {currentNpc.roleplay?.notasMestre && (
                <div className="bg-[#9d4edd]/10 border border-[#9d4edd]/30 rounded-xl p-3.5 space-y-1.5">
                  <span className="font-serif font-bold text-xs text-[#ffd166] uppercase tracking-wider block">
                    💡 Segredos & Notas Secretas para o Mestre:
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {currentNpc.roleplay.notasMestre}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER DO MODAL: Ações Rápidas */}
        <div className="bg-[#0c0e17] border-t border-[#9d4edd]/25 p-3 px-5 flex items-center justify-between flex-shrink-0 text-xs">
          <span className="text-gray-400">
            Ficha T20 Ativa: <strong className="text-white">{currentNpc.name}</strong> ({currentNpc.role})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={closeNPCModal}
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

