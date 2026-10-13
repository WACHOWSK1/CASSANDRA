'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { 
  Sparkles, 
  RotateCcw, 
  Undo2, 
  Volume2, 
  VolumeX, 
  Scroll, 
  Plus, 
  Minus,
  AlertTriangle,
  Users,
  BookOpen,
  Package,
  Dices
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { 
    alertLevel, 
    adjustAlert, 
    stepBack, 
    resetSession, 
    soundEnabled, 
    toggleSound, 
    setExportModalOpen, 
    openNPCModal,
    openItemModal,
    setActiveRightTab,
    history 
  } = useAdventureStore();

  const getAlertColor = () => {
    if (alertLevel >= 5) return 'text-[#ff4d6d]';
    if (alertLevel >= 3) return 'text-[#ffd166]';
    return 'text-[#2ec4b6]';
  };

  return (
    <header className="bg-[#12141c]/95 backdrop-blur-md border-b border-[#9d4edd]/25 px-5 py-2.5 flex items-center justify-between z-50 shadow-2xl flex-shrink-0">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9d4edd] to-[#e63946] flex items-center justify-center text-white shadow-[0_0_15px_rgba(157,78,221,0.5)] border border-[#c77dff]/50">
          <Sparkles className="w-5 h-5 text-amber-200" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-sm tracking-wider text-[#ffd166] drop-shadow">
            CASSANDRA: O RESGATE
          </h1>
          <span className="text-[11px] text-[#9aa0b4] tracking-wide block">
            Painel Tático do Mestre • Next.js & Tormenta20
          </span>
        </div>
      </div>

      {/* HUD Central: Medidor de Alerta (Clique para abrir painel de Alertas) */}
      <div 
        onClick={() => setActiveRightTab('alertas')}
        className="flex items-center gap-3 bg-[#0a0b10]/90 px-4 py-1.5 rounded-full border border-[#9d4edd]/40 cursor-pointer hover:border-[#ffd166] transition-all shadow-md group"
        title="Clique para ver consequências detalhadas do Alerta no painel direito"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#9aa0b4] uppercase group-hover:text-[#ffd166]">
          <AlertTriangle className={`w-4 h-4 ${getAlertColor()}`} />
          <span>Alerta:</span>
        </div>
        <span className={`font-mono font-bold text-xs ${getAlertColor()}`}>
          Nível {alertLevel}
        </span>
        
        {/* Pips de Alerta 0-6 */}
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4, 5, 6].map((level) => {
            const isFilled = level <= alertLevel;
            let bgClass = "bg-[#252836] border-[#3c4055]";
            if (isFilled) {
              if (level === 0) bgClass = "bg-[#2ec4b6] border-[#48cae4] shadow-[0_0_8px_rgba(46,196,182,0.6)]";
              else if (level <= 2) bgClass = "bg-[#e0a96d] border-[#ffd166] shadow-[0_0_8px_rgba(224,169,109,0.6)]";
              else if (level <= 4) bgClass = "bg-[#d62828] border-[#e63946] shadow-[0_0_10px_rgba(214,40,40,0.7)]";
              else bgClass = "bg-[#9d0208] border-[#ff4d6d] shadow-[0_0_14px_rgba(255,77,109,0.9)] alert-pulse-animation";
            }
            return (
              <div 
                key={level} 
                className={`w-3 h-3 rounded-full border transition-all ${bgClass}`}
                title={`Alerta Nível ${level}`}
              />
            );
          })}
        </div>

        {/* Controles de Alerta */}
        <div className="flex gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => {
              adjustAlert(-1);
              setActiveRightTab('alertas');
            }} 
            disabled={alertLevel <= 0}
            className="w-5 h-5 rounded bg-white/10 hover:bg-[#9d4edd] text-white flex items-center justify-center text-xs transition-colors disabled:opacity-30"
            title="Reduzir Alerta (-1)"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button 
            onClick={() => {
              adjustAlert(1);
              setActiveRightTab('alertas');
            }} 
            disabled={alertLevel >= 6}
            className="w-5 h-5 rounded bg-white/10 hover:bg-[#9d4edd] text-white flex items-center justify-center text-xs transition-colors disabled:opacity-30"
            title="Aumentar Alerta (+1)"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Ações do Mestre */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => openNPCModal('cassandra')}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#9d4edd] to-[#5a189a] hover:from-[#c77dff] hover:to-[#9d4edd] text-white flex items-center gap-1.5 shadow-[0_0_12px_rgba(157,78,221,0.4)] border border-[#ffd166]/40 transition-all"
          title="Abrir Compêndio de Fichas dos Personagens (12 Fichas T20)"
        >
          <Users className="w-3.5 h-3.5 text-[#ffd166]" />
          <span>Fichas T20</span>
        </button>

        <button 
          onClick={() => openItemModal('ordem_helena')}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#e0a96d]/40 to-[#996515]/60 hover:from-[#ffd166]/60 hover:to-[#e0a96d]/60 text-white flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,209,102,0.3)] border border-[#ffd166]/50 transition-all"
          title="Abrir Compêndio de Itens, Documentos e Artefatos (24 Itens T20)"
        >
          <Package className="w-3.5 h-3.5 text-[#ffd166]" />
          <span>Itens & Artefatos</span>
        </button>

        <button 
          onClick={() => setActiveRightTab('documentos')}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#2a9d8f] to-[#264653] hover:from-[#2ec4b6] hover:to-[#2a9d8f] text-white flex items-center gap-1.5 shadow-[0_0_12px_rgba(42,157,143,0.4)] border border-[#48cae4]/40 transition-all"
          title="Consultar Documentos de Regras (Alerta e Antimagia)"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span>Regras T20</span>
        </button>

        <button 
          onClick={() => setActiveRightTab('dados')}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#9d4edd] to-[#5a189a] hover:from-[#c77dff] hover:to-[#9d4edd] text-white flex items-center gap-1.5 shadow-[0_0_12px_rgba(157,78,221,0.5)] border border-[#ffd166]/50 transition-all"
          title="Abrir Rolador de Dados e Painel de Auditoria Estatística (10.000 rolagens)"
        >
          <Dices className="w-3.5 h-3.5 text-[#ffd166]" />
          <span>Dados & Auditoria</span>
        </button>

        <button 
          onClick={stepBack}
          disabled={history.length <= 1}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/15 border border-[#9d4edd]/30 text-[#f0f2f5] flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Desfazer último passo"
        >
          <Undo2 className="w-3.5 h-3.5 text-[#c77dff]" />
          <span>Desfazer</span>
        </button>

        <button 
          onClick={toggleSound}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/15 border border-[#9d4edd]/30 text-[#f0f2f5] flex items-center gap-1.5 transition-all"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#2ec4b6]" />
              <span>Efeitos</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500">Mudo</span>
            </>
          )}
        </button>

        <button 
          onClick={() => {
            if (confirm("Deseja reiniciar toda a sessão do zero?")) {
              resetSession();
            }
          }}
          className="p-1.5 text-xs rounded-lg bg-[#e63946]/20 hover:bg-[#e63946] text-[#ff758f] hover:text-white border border-[#e63946]/40 transition-all"
          title="Reiniciar Sessão"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
