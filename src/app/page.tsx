'use client';

import React from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { useAdventureStore } from '@/store/useAdventureStore';
import { HydrationGuard } from '@/components/providers/HydrationGuard';
import { TopHeader } from '@/components/layout/TopHeader';
import { ResourcesSidebar } from '@/components/layout/ResourcesSidebar';
import { NPCSidebar } from '@/components/layout/NPCSidebar';
import { SceneCard } from '@/components/scene/SceneCard';
import { TravelOperationsPanel } from '@/components/travel/TravelOperationsPanel';
import { AudioPlayerPanel } from '@/components/audio/AudioPlayerPanel';
import { FloatingAudioBar } from '@/components/audio/FloatingAudioBar';
import { MasterOperationsPanel } from '@/components/operations/MasterOperationsPanel';
import { NPCModal } from '@/components/modals/NPCModal';
import { ItemModal } from '@/components/modals/ItemModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { GripVertical, Music, Compass, Sparkles } from 'lucide-react';

export default function MasterDashboardPage() {
  const { 
    actView, 
    setActView, 
    audioViewActive, 
    toggleAudioView,
    jumpToNode 
  } = useAdventureStore();

  const handleSelectAct = (actNum: number) => {
    setActView(actNum);
    const actFirstNodes: Record<number, string> = {
      1: "S",
      2: "M",
      3: "VER_VERDADE"
    };
    const targetNodeId = actFirstNodes[actNum];
    if (targetNodeId) {
      jumpToNode(targetNodeId);
    }
  };

  return (
    <HydrationGuard>
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0b10]">
      {/* Top Header HUD */}
      <TopHeader />

      {/* Main Resizable Workspace */}
      <main className="flex-1 overflow-hidden p-2.5">
        <PanelGroup direction="horizontal" className="h-full gap-1">
          <Panel defaultSize={20} minSize={14} maxSize={30}>
            <div className="bg-[#141724]/90 backdrop-blur-xl border border-[#9d4edd]/25 rounded-2xl p-3 flex flex-col gap-4 overflow-y-auto h-full shadow-xl scrollbar-thin">
              <ResourcesSidebar />
              <NPCSidebar />
            </div>
          </Panel>

          {/* Divisor Redimensionável 1 */}
          <PanelResizeHandle className="w-1.5 hover:w-2 bg-transparent hover:bg-[#9d4edd]/40 rounded-full transition-all flex items-center justify-center cursor-col-resize group">
            <GripVertical className="w-3 h-3 text-gray-600 group-hover:text-[#c77dff] transition-colors" />
          </PanelResizeHandle>

          {/* PAINEL CENTRAL: NAVEGAÇÃO, CENA ATUAL, EXPEDIÇÃO DE VIAGEM & MÚSICAS */}
          <Panel defaultSize={56} minSize={35} className="flex flex-col">
            {/* Wrapper scrollável — necessário porque o Panel aplica overflow:hidden inline */}
            <div className="flex flex-col gap-2.5 overflow-y-auto h-full px-1 scrollbar-thin">
            {/* Abas de Navegação dos Atos, Viagem e Banco de Músicas */}
            <div className="flex gap-1.5 bg-[#12141c]/90 border border-[#9d4edd]/25 p-1 rounded-xl flex-shrink-0">
              <button
                onClick={() => handleSelectAct(1)}
                className={`flex-1 py-1.5 text-xs font-serif font-bold rounded-lg transition-all ${
                  actView === 1 && !audioViewActive
                    ? 'bg-gradient-to-r from-[#9d4edd]/40 to-[#264653]/50 text-[#ffd166] border border-[#c77dff] shadow-[0_0_12px_rgba(157,78,221,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Ato I: A Jornada
              </button>

              <button
                onClick={() => handleSelectAct(2)}
                className={`flex-1 py-1.5 text-xs font-serif font-bold rounded-lg transition-all ${
                  actView === 2 && !audioViewActive
                    ? 'bg-gradient-to-r from-[#9d4edd]/40 to-[#264653]/50 text-[#ffd166] border border-[#c77dff] shadow-[0_0_12px_rgba(157,78,221,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Ato II: O Resgate
              </button>

              <button
                onClick={() => handleSelectAct(3)}
                className={`flex-1 py-1.5 text-xs font-serif font-bold rounded-lg transition-all ${
                  actView === 3 && !audioViewActive
                    ? 'bg-gradient-to-r from-[#9d4edd]/40 to-[#264653]/50 text-[#ffd166] border border-[#c77dff] shadow-[0_0_12px_rgba(157,78,221,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Ato III: A Verdade & Fuga
              </button>

              <button
                onClick={toggleAudioView}
                className={`px-3 py-1.5 text-xs font-serif font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                  audioViewActive
                    ? 'bg-gradient-to-r from-[#9d4edd] to-[#5a189a] text-white border border-[#c77dff] shadow-[0_0_12px_rgba(157,78,221,0.5)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Music className="w-3.5 h-3.5 text-[#ffd166]" />
                <span>Banco de Músicas (32 Categorias)</span>
              </button>
            </div>

            {/* Condução da Cena Atual */}
            <SceneCard />

            {/* Painel de Músicas ou Status & Eventos de Viagem */}
            {audioViewActive ? (
              <AudioPlayerPanel />
            ) : (
              <TravelOperationsPanel />
            )}
            </div>{/* Fim do wrapper scrollável */}
          </Panel>

          {/* Divisor Redimensionável 2 */}
          <PanelResizeHandle className="w-1.5 hover:w-2 bg-transparent hover:bg-[#9d4edd]/40 rounded-full transition-all flex items-center justify-center cursor-col-resize group">
            <GripVertical className="w-3 h-3 text-gray-600 group-hover:text-[#c77dff] transition-colors" />
          </PanelResizeHandle>

          {/* PAINEL DIREITO: OPERAÇÕES DO MESTRE (ALERTAS, PILONOS, ANTIMAGIA & REGRAS T20) */}
          <Panel defaultSize={26} minSize={18} maxSize={38}>
            <div className="bg-[#141724]/90 backdrop-blur-xl border border-[#9d4edd]/25 rounded-2xl p-3 flex flex-col gap-3 overflow-y-auto h-full shadow-xl scrollbar-thin">
              <MasterOperationsPanel />
            </div>
          </Panel>
        </PanelGroup>
      </main>

      {/* Barra Inferior Flutuante do Player de Áudio */}
      <FloatingAudioBar />

      {/* Modais Globais */}
      <NPCModal />
      <ItemModal />
      <ExportModal />
    </div>
    </HydrationGuard>
  );
}
