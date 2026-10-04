'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { Package, ShieldAlert, Sparkles } from 'lucide-react';

export const ResourcesSidebar: React.FC = () => {
  const { resources, groupConditions, openItemModal } = useAdventureStore();

  const items = [
    { id: "ordem_helena", name: "Carta de Helena", has: resources.cartaHelena, badge: resources.cartaHelena ? "Em Mãos" : "Não Obtida" },
    { id: "livro_lavanderia", name: "Livro de Lavanderia", has: resources.livroKhorcova, badge: resources.livroKhorcova ? "Canal CD 20" : "Perdido (CD 24)" },
    { id: "placa_funeraria", name: "Placa de Greywick", has: resources.placaGreywick, badge: resources.placaGreywick ? "+2 Cortejo" : "Ausente" },
    { id: "sal_greywick", name: "Sais de Greywick", has: resources.saisProtecao > 0, badge: `${resources.saisProtecao} Carga(s)` },
    { id: "fagulha_preparada", name: "Fagulha Arcana", has: !!resources.fagulhaArcana, badge: resources.fagulhaArcana ? resources.fagulhaArcana.toUpperCase() : "Não Usada" },
    { id: "mascara_varek", name: "Máscara de Varek", has: resources.mascaraVarek, badge: resources.mascaraVarek ? "+2 Enganação" : "Não Obtida" },
    { id: "contrato_varek", name: "Contrato de Severian", has: resources.contratoSeverian, badge: resources.contratoSeverian ? "Provas Reais" : "Oculto" },
    { id: "sinete_aldren", name: "Sinete dos Crane", has: resources.sineteCrane !== null, badge: resources.sineteCrane ? "Partido" : "Não Obtido" },
    { id: "nome_escolhido", name: "Nome Escolhido", has: resources.nomeEscolhido, badge: resources.nomeEscolhido ? "Desperto" : "Bloqueado" },
    { id: "determinacao_familiar", name: "Determinação Familiar", has: resources.determinacaoFamiliar, badge: resources.determinacaoFamiliar ? "+2 Vontade" : "Bloqueado" }
  ];

  const hasConditions = 
    groupConditions.pmPerdidosTotal > 0 || 
    groupConditions.modificadorViagem !== 0 || 
    groupConditions.modificadorSocial !== 0 || 
    groupConditions.itensLacrados > 0 ||
    groupConditions.carrocaAbandonada ||
    groupConditions.cicatrizPurpura ||
    groupConditions.fatigado ||
    groupConditions.fraco;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#e0a96d]/20 text-[#ffd166] text-xs font-serif font-bold tracking-wider uppercase">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            <span>Inventário & Provas</span>
          </div>
          <button
            onClick={() => openItemModal('ordem_helena')}
            className="text-[10px] text-[#c77dff] hover:text-[#ffd166] hover:underline font-mono normal-case"
            title="Abrir compêndio completo com todos os 24 itens"
          >
            Ver Todos ›
          </button>
        </div>

        {/* Botão de Destaque para o Compêndio de Itens */}
        <button
          onClick={() => openItemModal('ordem_helena')}
          className="w-full mb-2.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#9d4edd]/30 via-[#5a189a]/30 to-[#264653]/30 hover:from-[#9d4edd]/50 hover:to-[#264653]/50 border border-[#c77dff]/50 text-white font-serif font-bold text-xs flex items-center justify-between shadow-[0_0_12px_rgba(157,78,221,0.25)] transition-all group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffd166] group-hover:scale-110 transition-transform" />
            <span>Compêndio de Itens (24 Itens T20)</span>
          </div>
          <span className="text-[10px] text-[#ffd166] font-mono">Abrir ↗</span>
        </button>

        <div className="grid grid-cols-1 gap-1.5">
          {items.map((item) => (
            <button 
              key={item.id}
              onClick={() => openItemModal(item.id)}
              className={`w-full px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between transition-all text-left cursor-pointer group ${
                item.has 
                  ? "bg-[#9d4edd]/15 hover:bg-[#9d4edd]/30 border-[#c77dff]/40 shadow-[0_0_10px_rgba(157,78,221,0.2)] text-white"
                  : "bg-[#0a0b10]/60 hover:bg-[#141724] border-white/5 text-gray-400"
              }`}
              title="Clique para ver ficha detalhada, perícias e regras deste item"
            >
              <div className="flex items-center gap-1.5">
                <span className={item.has ? "text-[#c77dff]" : "text-gray-600"}>
                  {item.has ? '✦' : '✧'}
                </span>
                <span className="font-medium group-hover:text-[#ffd166] transition-colors">{item.name}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                item.has 
                  ? "bg-[#2ec4b6]/20 text-[#2ec4b6] border border-[#2ec4b6]/40"
                  : "bg-white/5 text-gray-500"
              }`}>
                {item.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {hasConditions && (
        <div className="bg-[#141724]/90 border border-[#e63946]/30 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#ff758f] font-bold mb-1.5 uppercase text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Condições do Grupo</span>
          </div>
          <div className="space-y-1 text-gray-300 text-[11px] leading-relaxed">
            {groupConditions.pmPerdidosTotal > 0 && (
              <div>• Dreno de Mana: <strong className="text-amber-300">-{groupConditions.pmPerdidosTotal} PM</strong> por membro</div>
            )}
            {groupConditions.modificadorViagem !== 0 && (
              <div>• Modificador de Viagem: <strong className="text-cyan-300">{groupConditions.modificadorViagem > 0 ? '+' : ''}{groupConditions.modificadorViagem}</strong></div>
            )}
            {groupConditions.modificadorSocial !== 0 && (
              <div>• Modificador Social: <strong className="text-red-300">{groupConditions.modificadorSocial}</strong></div>
            )}
            {groupConditions.itensLacrados > 0 && (
              <div>• Itens Arcanos Lacrados: <strong className="text-amber-300">{groupConditions.itensLacrados}</strong></div>
            )}
            {groupConditions.carrocaAbandonada && (
              <div>• Carroça e equipamentos pesados abandonados</div>
            )}
            {groupConditions.cicatrizPurpura && (
              <div className="flex items-center gap-1 text-purple-300">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Cassandra carrega a Cicatriz Púrpura</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
