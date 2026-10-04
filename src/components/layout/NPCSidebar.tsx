'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { Users, FileText } from 'lucide-react';

export const NPCSidebar: React.FC = () => {
  const { npcStatus, openNPCModal } = useAdventureStore();

  const npcs = [
    {
      id: "cael",
      name: "Cael",
      state: npcStatus.cael,
      badge: npcStatus.cael === 'disponivel' ? 'Disponível' : npcStatus.cael === 'incapacitado' ? 'Incapacitado' : 'Desconhecido',
      colorClass: npcStatus.cael === 'disponivel' ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : npcStatus.cael === 'incapacitado' ? 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    },
    {
      id: "toma",
      name: "Toma (Órfão)",
      state: npcStatus.toma,
      badge: npcStatus.toma.includes('salvo') ? 'Salvo' : npcStatus.toma === 'deixado_greywick' ? 'Em Greywick' : npcStatus.toma === 'estrada_real' ? 'Pendente' : 'Não Resolvido',
      colorClass: npcStatus.toma.includes('salvo') ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : npcStatus.toma === 'deixado_greywick' ? 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    },
    {
      id: "varek",
      name: "Varek (Metamorfo)",
      state: npcStatus.varek,
      badge: npcStatus.varek === 'morto' ? 'Morto' : npcStatus.varek === 'capturado' ? 'Capturado' : npcStatus.varek === 'rendido' ? 'Rendido' : npcStatus.varek === 'fugiu' ? 'Fugiu (Avisou)' : 'Oculto',
      colorClass: npcStatus.varek === 'fugiu' ? 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]' : npcStatus.varek === 'capturado' || npcStatus.varek === 'rendido' ? 'bg-[#9d4edd]/20 text-[#c77dff] border-[#9d4edd]' : npcStatus.varek === 'morto' ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    },
    {
      id: "aldren",
      name: "Aldren Crane",
      state: npcStatus.aldren,
      badge: npcStatus.aldren === 'guardiao_veterano' ? 'Guardião (+3 Def)' : npcStatus.aldren === 'sacrificio_morte' ? 'Sacrifício Heroico' : npcStatus.aldren === 'primeiro_retornado' ? '1º Retornado' : npcStatus.aldren === 'resgatado_com_vida' ? 'A Salvo' : 'Cativo na Capela',
      colorClass: npcStatus.aldren === 'guardiao_veterano' || npcStatus.aldren === 'resgatado_com_vida' ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : npcStatus.aldren === 'sacrificio_morte' || npcStatus.aldren === 'primeiro_retornado' ? 'bg-[#9d4edd]/20 text-[#c77dff] border-[#9d4edd]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    },
    {
      id: "cassandra",
      name: "Cassandra Crane",
      state: npcStatus.cassandra,
      badge: npcStatus.cassandra === 'nome_escolhido' ? 'Nome Escolhido' : npcStatus.cassandra === 'resgatada_livre' ? 'Livre / Integrada' : 'Cativa na Cela',
      colorClass: npcStatus.cassandra === 'nome_escolhido' ? 'bg-[#9d4edd]/20 text-[#c77dff] border-[#9d4edd]' : npcStatus.cassandra === 'resgatada_livre' ? 'bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]' : 'bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]'
    }
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 pb-1.5 border-b border-[#e0a96d]/20 text-[#ffd166] text-xs font-serif font-bold tracking-wider uppercase">
        <Users className="w-3.5 h-3.5" />
        <span>Status dos Personagens</span>
      </div>

      <div className="space-y-2">
        {npcs.map((npc) => (
          <div key={npc.id} className="bg-[#0a0b10]/60 border border-[#9d4edd]/25 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-xs text-white">{npc.name}</span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${npc.colorClass}`}>
                {npc.badge}
              </span>
            </div>
            <button 
              onClick={() => openNPCModal(npc.id)}
              className="w-full py-1 text-[11px] font-medium rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 flex items-center justify-center gap-1 border border-white/5 hover:border-[#9d4edd]/40 transition-all"
            >
              <FileText className="w-3 h-3 text-[#c77dff]" />
              <span>Ver Ficha T20 & Táticas</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
