'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { Package, ShieldAlert, Sparkles } from 'lucide-react';

export const ResourcesSidebar: React.FC = () => {
  const { resources, groupConditions } = useAdventureStore();

  const items = [
    { name: "Carta de Helena", has: resources.cartaHelena, badge: resources.cartaHelena ? "Em Mãos" : "Não Obtida" },
    { name: "Livro de Khorcova", has: resources.livroKhorcova, badge: resources.livroKhorcova ? "Canal CD 18" : "Perdido (CD 24)" },
    { name: "Placa de Greywick", has: resources.placaGreywick, badge: resources.placaGreywick ? "+2 Cortejo" : "Ausente" },
    { name: "Sais de Proteção", has: resources.saisProtecao > 0, badge: `${resources.saisProtecao} Carga(s)` },
    { name: "Fagulha Arcana", has: !!resources.fagulhaArcana, badge: resources.fagulhaArcana ? resources.fagulhaArcana.toUpperCase() : "Não Usada" },
    { name: "Máscara de Varek", has: resources.mascaraVarek, badge: resources.mascaraVarek ? "+2 Enganação" : "Não Obtida" },
    { name: "Contrato de Severian", has: resources.contratoSeverian, badge: resources.contratoSeverian ? "Provas Reais" : "Oculto" },
    { name: "Nome Escolhido", has: resources.nomeEscolhido, badge: resources.nomeEscolhido ? "Desperto" : "Bloqueado" },
    { name: "Determinação Familiar", has: resources.determinacaoFamiliar, badge: resources.determinacaoFamiliar ? "+2 Vontade" : "Bloqueado" }
  ];

  const hasConditions = 
    groupConditions.pmPerdidosTotal > 0 || 
    groupConditions.modificadorViagem !== 0 || 
    groupConditions.modificadorSocial !== 0 || 
    groupConditions.itensLacrados > 0 ||
    groupConditions.carrocaAbandonada ||
    groupConditions.cicatrizPurpura;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-1.5 pb-1.5 mb-2 border-b border-[#e0a96d]/20 text-[#ffd166] text-xs font-serif font-bold tracking-wider uppercase">
          <Package className="w-3.5 h-3.5" />
          <span>Inventário & Provas</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                item.has 
                  ? "bg-[#9d4edd]/15 border-[#c77dff]/40 shadow-[0_0_10px_rgba(157,78,221,0.2)] text-white"
                  : "bg-[#0a0b10]/60 border-white/5 text-gray-400"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={item.has ? "text-[#c77dff]" : "text-gray-600"}>
                  {item.has ? '✦' : '✧'}
                </span>
                <span className="font-medium">{item.name}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                item.has 
                  ? "bg-[#2ec4b6]/20 text-[#2ec4b6] border border-[#2ec4b6]/40"
                  : "bg-white/5 text-gray-500"
              }`}>
                {item.badge}
              </span>
            </div>
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
