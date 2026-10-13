'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { Users, Swords, Skull, ShieldAlert, Sparkles, BookOpen, MapPin } from 'lucide-react';
import { NPC_DATABASE } from '@/data/adventureData';

export const NPCSidebar: React.FC = () => {
  const { npcStatus, openNPCModal, setActiveCombatNPC, activeCombatNPCId } = useAdventureStore();
  const [activeGroup, setActiveGroup] = useState<'aslavi' | 'cena' | 'todos'>('aslavi');

  const totalSheets = Object.keys(NPC_DATABASE).length;

  const aslaviNpcs = [
    {
      id: "sihnion_sillion",
      name: "Sihnion & Sillion",
      role: "Gêmeos Espadachins",
      nd: "ND 5",
      badge: "Espadachins x2",
      colorClass: "bg-[#2a9d8f]/20 text-[#48cae4] border-[#2a9d8f]"
    },
    {
      id: "siora",
      name: "Siora",
      role: "Bruxa Élfica",
      nd: "ND 6",
      badge: "Bruxa • 71 PM",
      colorClass: "bg-[#9d4edd]/20 text-[#c77dff] border-[#9d4edd]"
    },
    {
      id: "guardas_aslavi",
      name: "Guardas de Aslavi",
      role: "Esqueletos & Aparição",
      nd: "ND 5",
      badge: "Portão da Torre",
      colorClass: "bg-[#e0a96d]/20 text-[#ffd166] border-[#e0a96d]"
    },
    {
      id: "enxame_papadiim",
      name: "Enxame de Papa-Dim",
      role: "Comedor de Ouro",
      nd: "ND 8",
      badge: "Enxame • 150 PV",
      colorClass: "bg-[#ffd166]/20 text-[#ffd166] border-[#ffd166]"
    },
    {
      id: "assassino_putrefato",
      name: "Assassino Putrefato",
      role: "Elite de Aslothia",
      nd: "ND 9",
      badge: "Necrótico • Trevas",
      colorClass: "bg-[#5a189a]/30 text-[#c77dff] border-[#c77dff]"
    },
    {
      id: "irmas_medusas",
      name: "Irmãs Medusas",
      role: "Cultistas de Sszzaas",
      nd: "ND 10",
      badge: "Petrificação CD 23",
      colorClass: "bg-[#2a9d8f]/30 text-[#48cae4] border-[#2a9d8f]"
    },
    {
      id: "dazan_vampiro",
      name: "Dazan, Vampiro Falido",
      role: "Vampiro Faminto",
      nd: "ND 11",
      badge: "Fatigado • Fome",
      colorClass: "bg-[#e63946]/20 text-[#ff758f] border-[#e63946]"
    },
    {
      id: "guardia_cofre",
      name: "Guardiã do Cofre",
      role: "Hidra de Bac Arat",
      nd: "ND 11",
      badge: "5 Cabeças • 220 PV",
      colorClass: "bg-[#e63946]/30 text-[#ff758f] border-[#e63946]"
    },
    {
      id: "ra_assassina",
      name: "Rà",
      role: "Assassina Ilusionista",
      nd: "ND 11",
      badge: "Boss • Distração",
      colorClass: "bg-[#9d0208]/30 text-[#ff4d6d] border-[#ff4d6d]"
    }
  ];

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

  const currentList = activeGroup === 'aslavi' ? aslaviNpcs : keyNpcs;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Botão de Destaque: Acervo Completo */}
      <button
        onClick={() => setActiveCombatNPC(activeGroup === 'aslavi' ? 'sihnion_sillion' : 'cassandra')}
        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#e63946] via-[#9d4edd] to-[#5a189a] hover:from-[#ff4d6d] hover:to-[#9d4edd] text-white font-serif font-bold text-xs flex items-center justify-between shadow-[0_0_15px_rgba(230,57,70,0.35)] border border-[#ffd166]/50 transition-all hover:scale-[1.02]"
        title="Abrir Arena de Combate Central"
      >
        <div className="flex items-center gap-1.5">
          <Swords className="w-4 h-4 text-[#ffd166]" />
          <span>Arena Central de Combate</span>
        </div>
        <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full text-[#ffd166] font-mono border border-white/10">
          {totalSheets} Fichas T20
        </span>
      </button>

      {/* Abas Rápidas da Barra Lateral */}
      <div className="flex items-center gap-1 bg-[#0a0b10] border border-[#9d4edd]/20 p-1 rounded-xl text-xs">
        <button
          onClick={() => setActiveGroup('aslavi')}
          className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 ${
            activeGroup === 'aslavi'
              ? 'bg-[#e63946] text-white shadow-[0_0_8px_rgba(230,57,70,0.5)]'
              : 'text-gray-400 hover:text-white'
          }`}
          title="Novas criaturas: Leilão de Aslavi / Mansão Bac Arat"
        >
          <span>Novas Criaturas</span>
          <span className="text-[9px] bg-black/40 px-1 py-0.2 rounded font-mono">9</span>
        </button>

        <button
          onClick={() => setActiveGroup('cena')}
          className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 ${
            activeGroup === 'cena'
              ? 'bg-[#9d4edd] text-white shadow-[0_0_8px_rgba(157,78,221,0.5)]'
              : 'text-gray-400 hover:text-white'
          }`}
          title="Personagens da Campanha Cassandra"
        >
          <span>Cassandra</span>
          <span className="text-[9px] bg-black/40 px-1 py-0.2 rounded font-mono">6</span>
        </button>
      </div>

      <div className="flex items-center justify-between pb-1 border-b border-[#e0a96d]/20 text-[#ffd166] text-xs font-serif font-bold tracking-wider uppercase">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>{activeGroup === 'aslavi' ? 'Criaturas de Aslavi' : 'Personagens em Cena'}</span>
        </div>
        <span className="text-[10px] text-gray-400 font-sans font-normal lowercase flex items-center gap-1">
          <Swords className="w-3 h-3 text-[#ff758f]" />
          <span>clique p/ arena central</span>
        </span>
      </div>

      {/* Lista de Criaturas com Clique Direto para Abrir na Tela Central */}
      <div className="space-y-2">
        {currentList.map((npc) => {
          const isActive = activeCombatNPCId === npc.id;
          return (
            <div 
              key={npc.id} 
              onClick={() => setActiveCombatNPC(npc.id)}
              className={`rounded-xl p-2.5 cursor-pointer transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-[#201533] border-2 border-[#ffd166] shadow-[0_0_15px_rgba(255,209,102,0.4)]'
                  : 'bg-[#0a0b10]/60 hover:bg-[#1c1626] border border-[#9d4edd]/25 hover:border-[#ff758f] hover:shadow-[0_0_12px_rgba(230,57,70,0.3)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-[#ffd166]' : 'text-white group-hover:text-[#ffd166]'
                }`}>
                  <Swords className={`w-3 h-3 ${isActive ? 'text-[#ffd166]' : 'text-[#ff758f] opacity-80 group-hover:scale-110'} transition-transform`} />
                  <span>{npc.name}</span>
                </span>
                
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-300">
                    {npc.nd}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openNPCModal(npc.id, 'ficha');
                    }}
                    className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    title="Ver Ficha Lore & Biografia no Modal"
                  >
                    <BookOpen className="w-3 h-3 text-cyan-300" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400 text-[10px] truncate max-w-[130px]">{npc.role}</span>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${npc.colorClass}`}>
                  {'badge' in npc ? npc.badge : (npc as any).stateBadge}
                </span>
              </div>

              {isActive && (
                <div className="mt-1.5 pt-1 border-t border-[#ffd166]/20 flex items-center justify-between text-[9px] font-mono text-[#ffd166]">
                  <span className="font-bold">★ EM COMBATE NA TELA CENTRAL</span>
                  <span className="text-gray-400">ativo</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

