'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { SESSION_ITEMS, SessionItem, ItemCategory } from '@/data/itemsData';
import { 
  X, 
  Search, 
  Sparkles, 
  Shield, 
  FileText, 
  Scroll, 
  BookOpen, 
  Award, 
  Eye, 
  ZapOff, 
  Key, 
  Flame, 
  Lock, 
  EyeOff, 
  FlameKindling, 
  Link, 
  Truck, 
  HeartHandshake, 
  Activity, 
  CheckCircle2, 
  FileWarning, 
  FileSignature, 
  BookMarked, 
  Coffee, 
  Wand2,
  Filter,
  Check,
  Ban
} from 'lucide-react';

const CATEGORY_TABS: { id: ItemCategory | 'todos'; label: string; count?: number }[] = [
  { id: 'todos', label: 'Todos os Itens' },
  { id: 'documento', label: '📜 Documentos & Provas' },
  { id: 'artefato', label: '🔮 Artefatos & Mágicos' },
  { id: 'mecanismo', label: '⚙️ Mecanismos & Enigmas' },
  { id: 'especial', label: '✨ Recursos Especiais' }
];

export const ItemModal: React.FC = () => {
  const { 
    selectedItemForModal, 
    closeItemModal, 
    openItemModal, 
    resources, 
    toggleResourceItem 
  } = useAdventureStore();

  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  if (!selectedItemForModal) return null;

  const currentItem: SessionItem = SESSION_ITEMS[selectedItemForModal] || Object.values(SESSION_ITEMS)[0];

  const allItemsList = Object.values(SESSION_ITEMS);

  const filteredItems = allItemsList.filter((item) => {
    const matchesCategory = activeCategory === 'todos' || item.categoria === activeCategory;
    const matchesSearch = 
      item.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.funcaoNarrativa.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getItemIcon = (iconName: string, className: string = "w-4 h-4") => {
    switch (iconName) {
      case 'Shield': return <Shield className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'Scroll': return <Scroll className={className} />;
      case 'FileSignature': return <FileSignature className={className} />;
      case 'FileCheck': return <FileText className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'BookMarked': return <BookMarked className={className} />;
      case 'FileWarning': return <FileWarning className={className} />;
      case 'ScrollText': return <Scroll className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Coffee': return <Coffee className={className} />;
      case 'Eye': return <Eye className={className} />;
      case 'ZapOff': return <ZapOff className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Key': return <Key className={className} />;
      case 'Wand2': return <Wand2 className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Lock': return <Lock className={className} />;
      case 'EyeOff': return <EyeOff className={className} />;
      case 'FlameKindling': return <FlameKindling className={className} />;
      case 'Link': return <Link className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'Activity': return <Activity className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const isResourceActive = (resKey?: string) => {
    if (!resKey || !resources) return false;
    const val = resources[resKey as keyof typeof resources];
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val > 0;
    return !!val;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1017] border-2 border-[#9d4edd]/50 rounded-3xl w-full max-w-5xl h-[92vh] max-h-[850px] shadow-[0_0_50px_rgba(157,78,221,0.3)] flex flex-col overflow-hidden text-xs">
        
        {/* TOP BAR MODAL */}
        <div className="p-3.5 px-5 bg-[#141724] border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9d4edd] to-[#5a189a] flex items-center justify-center text-[#ffd166] shadow-[0_0_12px_rgba(157,78,221,0.6)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#ffd166] tracking-wide">
                Compêndio de Itens, Artefatos & Enigmas
              </h2>
              <span className="text-[10px] text-gray-400">
                A Última Chama dos Crane • Documentos, Chaves, Mecanismos e Bênçãos
              </span>
            </div>
          </div>

          <button
            onClick={closeItemModal}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-600 text-gray-400 hover:text-white flex items-center justify-center transition-all border border-white/10"
            title="Fechar compêndio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CORPO MODAL EM 2 COLUNAS */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* COLUNA ESQUERDA: LISTA E BUSCA DE ITENS */}
          <div className="w-full md:w-80 bg-[#0a0b10] border-r border-white/10 flex flex-col flex-shrink-0">
            {/* Campo de Busca */}
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar item ou documento..."
                  className="w-full bg-[#141724] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#9d4edd]"
                />
              </div>
            </div>

            {/* Categorias Filtros */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-white/5 bg-[#0e1017]">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    activeCategory === tab.id
                      ? 'bg-[#9d4edd] text-white shadow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Lista Scrollável de Itens */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
              {filteredItems.map((item) => {
                const isSelected = item.id === currentItem.id;
                const isPossessed = isResourceActive(item.resourceKey);
                return (
                  <button
                    key={item.id}
                    onClick={() => openItemModal(item.id)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all border flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#9d4edd]/30 to-[#264653]/40 border-[#ffd166] text-white shadow-md'
                        : 'bg-[#141724]/70 border-white/5 hover:border-white/20 text-gray-300 hover:bg-[#141724]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      isSelected ? 'bg-[#ffd166] text-gray-950' : 'bg-white/5 text-[#c77dff]'
                    }`}>
                      {getItemIcon(item.icone, "w-4 h-4")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <strong className="text-xs font-bold truncate block">{item.nome}</strong>
                        {isPossessed && (
                          <span className="w-2 h-2 rounded-full bg-[#2ec4b6] flex-shrink-0 shadow-[0_0_6px_rgba(46,196,182,0.8)]" title="Obtido pelo grupo" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 truncate block">{item.subtitulo}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUNA DIREITA: DETALHES COMPLETOS DO ITEM SELECIONADO */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0e1017] space-y-4 scrollbar-thin">
            
            {/* CABEÇALHO DO ITEM */}
            <div className="bg-[#141724] border border-[#9d4edd]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9d4edd] to-[#5a189a] flex items-center justify-center text-[#ffd166] shadow-[0_0_16px_rgba(157,78,221,0.5)]">
                  {getItemIcon(currentItem.icone, "w-6 h-6")}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#9d4edd]/20 text-[#c77dff] border border-[#9d4edd]/40 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold">
                      {currentItem.categoria.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      📍 {currentItem.portadorOuLocal}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    {currentItem.nome}
                  </h3>
                </div>
              </div>

              {/* Botão de Alternar Posse / Obtenção se for um recurso monitorável */}
              {currentItem.resourceKey && (
                <button
                  onClick={() => toggleResourceItem(currentItem.resourceKey as any)}
                  className={`px-3.5 py-1.5 rounded-xl font-serif font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                    isResourceActive(currentItem.resourceKey)
                      ? 'bg-[#2ec4b6] text-gray-950 hover:brightness-110 shadow-[0_0_10px_rgba(46,196,182,0.5)]'
                      : 'bg-white/10 text-gray-400 hover:text-white border border-white/10'
                  }`}
                  title="Clique para marcar se o grupo já encontrou/possui este item"
                >
                  {isResourceActive(currentItem.resourceKey) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Em Posse do Grupo</span>
                    </>
                  ) : (
                    <>
                      <Ban className="w-3.5 h-3.5" />
                      <span>Não Obtido</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* SEÇÃO 1: APARÊNCIA & DESCRIÇÃO VISUAL */}
            <div className="bg-[#141724]/80 border border-white/5 rounded-2xl p-3.5 space-y-1.5">
              <span className="font-serif font-bold text-xs text-[#ffd166] uppercase tracking-wider block">
                👁️ Aparência & Descrição Visual
              </span>
              <p className="text-gray-200 leading-relaxed text-xs">
                {currentItem.aparencia}
              </p>
            </div>

            {/* SEÇÃO 2: FUNÇÃO NARRATIVA & ENREDO */}
            <div className="bg-[#141724]/80 border border-white/5 rounded-2xl p-3.5 space-y-1.5">
              <span className="font-serif font-bold text-xs text-[#48cae4] uppercase tracking-wider block">
                📜 Função Narrativa na Sessão
              </span>
              <p className="text-gray-200 leading-relaxed text-xs">
                {currentItem.funcaoNarrativa}
              </p>
            </div>

            {/* SEÇÃO 3: MECÂNICA T20 & REGRAS DE JOGO */}
            <div className="bg-gradient-to-r from-[#9d4edd]/15 to-[#141724] border border-[#9d4edd]/40 rounded-2xl p-4 space-y-2">
              <span className="font-serif font-bold text-xs text-[#c77dff] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Mecânica Tormenta20 & Regras de Mesa</span>
              </span>
              <p className="text-white leading-relaxed text-xs whitespace-pre-line font-sans">
                {currentItem.mecanicaT20}
              </p>
            </div>

            {/* SEÇÃO 4: TESTES E DESAFIOS REQUERIDOS (SE HOUVER) */}
            {currentItem.testesEPericias && currentItem.testesEPericias.length > 0 && (
              <div className="bg-[#141724] border border-amber-400/30 rounded-2xl p-3.5 space-y-2">
                <span className="font-serif font-bold text-xs text-amber-300 uppercase tracking-wider block">
                  🎯 Testes & CDs Oficiais
                </span>
                <div className="space-y-1.5">
                  {currentItem.testesEPericias.map((t, idx) => (
                    <div key={idx} className="bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-start justify-between gap-2">
                      <div>
                        <strong className="text-white block text-xs">{t.pericia} (CD {t.cd})</strong>
                        <span className="text-gray-300 text-[11px] leading-snug">{t.efeito}</span>
                      </div>
                      <span className="font-mono font-bold text-[10px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 flex-shrink-0">
                        CD {t.cd}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEÇÃO 5: LIMITES, CUSTOS & RESTRIÇÕES */}
            {currentItem.limitesECustos && (
              <div className="bg-[#141724] border-l-4 border-rose-500 rounded-r-2xl p-3.5 space-y-1">
                <span className="font-serif font-bold text-[11px] text-rose-400 uppercase tracking-wider block">
                  🚫 Limites & O que NÃO faz na mesa
                </span>
                <p className="text-gray-300 text-xs leading-snug">
                  {currentItem.limitesECustos}
                </p>
              </div>
            )}

            {/* SEÇÃO 6: DICAS DO MESTRE */}
            {currentItem.dicaMestre && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-[11px] text-gray-400 italic">
                💡 <strong>Dica do Mestre:</strong> {currentItem.dicaMestre}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
