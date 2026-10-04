'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { AlertsAndTransferPanel } from './AlertsAndTransferPanel';
import { AntimagiaPylonsPanel } from './AntimagiaPylonsPanel';
import { DadosCompendiumPanel } from './DadosCompendiumPanel';
import { 
  AlertTriangle, 
  Flame, 
  BookOpen, 
  Layers, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export const MasterOperationsPanel: React.FC = () => {
  const { activeRightTab, setActiveRightTab, alertLevel, pylonsList, transferClock } = useAdventureStore();

  const activePylons = pylonsList.filter(p => p.status === 'ativo').length;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* ABAS SUPERIORES DO PAINEL DIREITO */}
      <div className="flex items-center gap-1 bg-[#0a0b10]/90 border border-[#9d4edd]/30 p-1 rounded-xl flex-shrink-0">
        <button
          onClick={() => setActiveRightTab('alertas')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeRightTab === 'alertas'
              ? 'bg-gradient-to-r from-[#e63946] to-[#9d0208] text-white shadow-[0_0_12px_rgba(230,57,70,0.5)] border border-[#ff758f]'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Medidor de Alerta e Relógio de Transferência"
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${activeRightTab === 'alertas' ? 'text-amber-200' : 'text-amber-400'}`} />
          <span>Alerta ({alertLevel})</span>
        </button>

        <button
          onClick={() => setActiveRightTab('antimagia')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeRightTab === 'antimagia'
              ? 'bg-gradient-to-r from-[#9d4edd] to-[#5a189a] text-white shadow-[0_0_12px_rgba(157,78,221,0.5)] border border-[#c77dff]'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Pilonos Arcanos e Lanternas Nulas"
        >
          <Flame className={`w-3.5 h-3.5 ${activeRightTab === 'antimagia' ? 'text-amber-300' : 'text-purple-400'}`} />
          <span>Pilonos ({activePylons}/4)</span>
        </button>

        <button
          onClick={() => setActiveRightTab('documentos')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeRightTab === 'documentos'
              ? 'bg-gradient-to-r from-[#2a9d8f] to-[#264653] text-white shadow-[0_0_12px_rgba(42,157,143,0.5)] border border-[#48cae4]'
              : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Consulta Completa dos Documentos Oficiais"
        >
          <BookOpen className={`w-3.5 h-3.5 ${activeRightTab === 'documentos' ? 'text-cyan-200' : 'text-cyan-400'}`} />
          <span>Regras T20</span>
        </button>
      </div>

      {/* CONTEÚDO ATIVO */}
      <div className="flex-1 overflow-y-auto pr-0.5 scrollbar-thin">
        {activeRightTab === 'alertas' && <AlertsAndTransferPanel />}
        {activeRightTab === 'antimagia' && <AntimagiaPylonsPanel />}
        {activeRightTab === 'documentos' && <DadosCompendiumPanel />}
      </div>
    </div>
  );
};
