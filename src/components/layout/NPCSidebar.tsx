'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { Users, FileText, Skull, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { NPC_DATABASE } from '@/data/adventureData';

export const NPCSidebar: React.FC = () => {
  const { npcStatus, openNPCModal } = useAdventureStore();

  const keyNpcs = [
    {
      id: "cassandra",
      name: "Cassandra Crane",
      role: "Herdeira / Conjuradora",
      nd: "ND 8",
      stateBadge: npcStatus.cassandra === 'nome_escolhido' ? 'Nome Escolhido' : npcStatus.cassandra === 'resgatada_livre' ? 'Livre / Resgatada' : 'Cativa na Cela',
      colorClass: npcStatus.cassandra === 'nome_escolhido' ? 'bg-[#9d4edd]/20 text-[#c77dff] border-[#9d4edd]' : npcStatus.cassandra === 'resgatada_livre' ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    },
    {
      id: "severian",
      name: "Inquisidor Severian",
      role: "Chefe dos Pilonos",
      nd: "ND 10",
      stateBadge: 'Boss do Ato II',
      colorClass: 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]'
    },
    {
      id: "varek",
      name: "Varek (Metamorfo)",
      role: "Espião / Assassino",
      nd: "ND 7",
      stateBadge: npcStatus.varek === 'morto' ? 'Morto' : npcStatus.varek === 'capturado' ? 'Capturado' : npcStatus.varek === 'rendido' ? 'Rendido' : npcStatus.varek === 'fugiu' ? 'Fugiu (Avisou)' : 'Oculto na Cela',
      colorClass: npcStatus.varek === 'fugiu' ? 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]' : npcStatus.varek === 'capturado' || npcStatus.varek === 'rendido' ? 'bg-[#9d4edd]/20 text-[#c77dff] border-[#9d4edd]' : npcStatus.varek === 'morto' ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    },
    {
      id: "aldren",
      name: "Aldren Crane",
      role: "Patriarca / Cavaleiro",
      nd: "ND 7",
      stateBadge: npcStatus.aldren === 'guardiao_veterano' ? 'Guardião (+3 Def)' : npcStatus.aldren === 'sacrificio_morte' ? 'Sacrifício Heroico' : npcStatus.aldren === 'primeiro_retornado' ? '1º Retornado' : npcStatus.aldren === 'resgatado_com_vida' ? 'A Salvo' : 'Cativo na Capela',
      colorClass: npcStatus.aldren === 'guardiao_veterano' || npcStatus.aldren === 'resgatado_com_vida' ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : npcStatus.aldren === 'sacrificio_morte' || npcStatus.aldren === 'primeiro_retornado' ? 'bg-[#9d4edd]/20 text-[#c77dff] border-[#9d4edd]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    },
    {
      id: "cael",
      name: "Cael",
      role: "Batedor de Yuvalin",
      nd: "ND 4",
      stateBadge: npcStatus.cael === 'disponivel' ? 'Disponível' : npcStatus.cael === 'incapacitado' ? 'Incapacitado' : 'Desconhecido',
      colorClass: npcStatus.cael === 'disponivel' ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : npcStatus.cael === 'incapacitado' ? 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    },
    {
      id: "ferren",
      name: "Arquilich Ferren Asloth",
      role: "Soberano de Aslothia",
      nd: "ND S",
      stateBadge: 'Boss III (Escala S)',
      colorClass: 'bg-[#9d0208]/30 text-[#ff4d6d] border-[#ff4d6d]'
    }
  ];

  return (
    <div className="flex flex-col gap-2.5">
      {/* Botão de Destaque: Compêndio Completo */}
      <button
        onClick={() => openNPCModal('cassandra')}
        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#9d4edd] via-[#5a189a] to-[#264653] hover:from-[#c77dff] hover:to-[#9d4edd] text-white font-serif font-bold text-xs flex items-center justify-between shadow-[0_0_15px_rgba(157,78,221,0.4)] border border-[#ffd166]/50 transition-all hover:scale-[1.02]"
      >
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#ffd166]" />
          <span>Fichas dos Personagens</span>
        </div>
        <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-[#ffd166] font-mono border border-white/10">
          12 Fichas T20
        </span>
      </button>

      <div className="flex items-center justify-between pb-1 border-b border-[#e0a96d]/20 text-[#ffd166] text-xs font-serif font-bold tracking-wider uppercase">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>Personagens em Cena</span>
        </div>
        <span className="text-[10px] text-gray-400 font-sans font-normal lowercase">
          clique para abrir ficha
        </span>
      </div>

      <div className="space-y-2">
        {keyNpcs.map((npc) => (
          <div 
            key={npc.id} 
            onClick={() => openNPCModal(npc.id)}
            className="bg-[#0a0b10]/60 hover:bg-[#181c2e] border border-[#9d4edd]/25 hover:border-[#c77dff]/70 rounded-xl p-2.5 cursor-pointer transition-all hover:shadow-[0_0_12px_rgba(157,78,221,0.25)] group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-white group-hover:text-[#ffd166] transition-colors">
                {npc.name}
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-300">
                {npc.nd}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-400 text-[10px]">{npc.role}</span>
              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${npc.colorClass}`}>
                {npc.stateBadge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

