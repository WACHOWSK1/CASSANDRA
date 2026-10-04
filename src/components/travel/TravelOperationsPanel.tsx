'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { GOOD_TRAVEL_EVENTS, BAD_TRAVEL_EVENTS, TravelEvent } from '@/data/travelData';
import { 
  Compass, 
  Sparkles, 
  Skull, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Utensils, 
  Truck, 
  Heart, 
  CheckCircle2, 
  Dices, 
  RotateCcw, 
  Plus, 
  Minus,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Award,
  Zap,
  Info
} from 'lucide-react';

export const TravelOperationsPanel: React.FC = () => {
  const { 
    travelState, 
    drawTravelEvent, 
    applyTravelEventBonus, 
    adjustTravelHours, 
    adjustRacoes, 
    setCarrocaCondicao, 
    toggleSalvoConduto 
  } = useAdventureStore();

  const [isDrawing, setIsDrawing] = useState<'bom' | 'ruim' | null>(null);
  const [activeTab, setActiveTab] = useState<'sorteio' | 'compendio_bons' | 'compendio_ruins' | 'historico'>('sorteio');
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<TravelEvent | null>(null);

  const handleDraw = (type: 'bom' | 'ruim') => {
    setIsDrawing(type);
    setTimeout(() => {
      const drawn = drawTravelEvent(type);
      setSelectedEventForDetail(drawn);
      setIsDrawing(null);
    }, 350);
  };

  const displayedEvent = selectedEventForDetail || travelState.ultimoEvento;

  return (
    <div className="bg-[#141724]/90 backdrop-blur-xl border border-[#9d4edd]/30 rounded-2xl p-4 flex flex-col gap-4 shadow-xl text-xs">
      
      {/* 1. BARRA SUPERIOR: STATUS & RECURSOS DA VIAGEM */}
      <div className="bg-[#0a0b10]/95 border border-[#9d4edd]/40 rounded-xl p-3.5 shadow-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#ffd166] animate-spin-slow" />
            <div>
              <h3 className="font-serif font-bold text-sm text-[#ffd166] tracking-wide">
                Expedição a Portsmouth & Milothiann
              </h3>
              <span className="text-[10px] text-gray-400">
                Jornada pelos Ermos de Portsmouth • Travessia da Fronteira
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {travelState.salvoCondutoAtivo && (
              <span className="bg-[#2ec4b6]/20 border border-[#2ec4b6] text-[#48cae4] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(46,196,182,0.5)]">
                <FileCheck className="w-3.5 h-3.5" />
                Salvo-Conduto Ativo
              </span>
            )}

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border font-mono ${
              travelState.carrocaCondicao === 'integra' 
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : travelState.carrocaCondicao === 'avariada'
                ? 'bg-rose-950/60 text-rose-300 border-rose-500 alert-pulse-animation'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
            }`}>
              Carroça: {travelState.carrocaCondicao === 'integra' ? 'Íntegra' : travelState.carrocaCondicao === 'avariada' ? '⚠️ Avariada' : 'Reparada'}
            </span>
          </div>
        </div>

        {/* Marcadores de Tempo, Rações e Veículo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Tempo de Marcha */}
          <div className="bg-[#141724] border border-white/5 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ffd166]" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-semibold">Tempo de Marcha</span>
                <span className="font-mono font-bold text-white text-xs">
                  Dia {travelState.diasViagem} ({travelState.horasViagem}h)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => adjustTravelHours(-6)} 
                className="w-5 h-5 rounded bg-white/10 hover:bg-[#9d4edd] text-white flex items-center justify-center text-xs"
                title="Voltar 6 horas"
              >
                -
              </button>
              <button 
                onClick={() => adjustTravelHours(6)} 
                className="w-5 h-5 rounded bg-white/10 hover:bg-[#9d4edd] text-white flex items-center justify-center text-xs"
                title="Avançar 6 horas"
              >
                +
              </button>
            </div>
          </div>

          {/* Rações de Viagem */}
          <div className="bg-[#141724] border border-white/5 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#2ec4b6]" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-semibold">Rações de Viagem</span>
                <span className="font-mono font-bold text-white text-xs">
                  {travelState.racoesRestantes} {travelState.racoesRestantes <= 4 ? '⚠️' : 'unid.'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => adjustRacoes(-1)} 
                className="w-5 h-5 rounded bg-white/10 hover:bg-[#2ec4b6] hover:text-gray-950 text-white flex items-center justify-center text-xs"
                title="Consumir 1 ração"
              >
                -
              </button>
              <button 
                onClick={() => adjustRacoes(1)} 
                className="w-5 h-5 rounded bg-white/10 hover:bg-[#2ec4b6] hover:text-gray-950 text-white flex items-center justify-center text-xs"
                title="Adicionar 1 ração"
              >
                +
              </button>
            </div>
          </div>

          {/* Condição da Carroça & Salvo Conduto */}
          <div className="bg-[#141724] border border-white/5 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#c77dff]" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase block font-semibold">Estado do Veículo</span>
                <button
                  onClick={() => {
                    const next = travelState.carrocaCondicao === 'integra' ? 'avariada' : travelState.carrocaCondicao === 'avariada' ? 'reparada' : 'integra';
                    setCarrocaCondicao(next);
                  }}
                  className="font-bold text-[#c77dff] hover:underline text-left text-xs"
                  title="Clique para alternar estado da carroça"
                >
                  {travelState.carrocaCondicao.toUpperCase()}
                </button>
              </div>
            </div>

            <button
              onClick={toggleSalvoConduto}
              className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                travelState.salvoCondutoAtivo
                  ? 'bg-[#2ec4b6] text-gray-950 border-[#48cae4]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
              title="Alternar Selo Oficial de Salvo-Conduto"
            >
              {travelState.salvoCondutoAtivo ? 'Selo OK' : '+ Selo'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. OS DOIS BOTÕES PRINCIPAIS DE SORTEIO ALEATÓRIO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* BOTÃO SORTEAR EVENTO BOM */}
        <button
          onClick={() => handleDraw('bom')}
          disabled={isDrawing !== null}
          className="relative group overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#1b3a38] via-[#0f2824] to-[#0a1b18] border-2 border-[#2ec4b6]/60 hover:border-[#48cae4] shadow-[0_0_20px_rgba(46,196,182,0.3)] hover:shadow-[0_0_30px_rgba(46,196,182,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-left disabled:opacity-50"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ec4b6]/10 rounded-full blur-2xl group-hover:bg-[#2ec4b6]/20 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#2ec4b6]/20 border border-[#2ec4b6]/50 flex items-center justify-center text-[#48cae4] group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="font-mono text-[10px] font-bold text-[#48cae4] bg-[#2ec4b6]/20 px-2 py-0.5 rounded-full border border-[#2ec4b6]/40">
              1d10 Benesses
            </span>
          </div>

          <h4 className="font-serif font-bold text-base text-emerald-200 group-hover:text-emerald-100 mb-1 flex items-center gap-1.5">
            <span>Sortear Evento Bom</span>
            <Dices className="w-4 h-4 text-[#ffd166] group-hover:rotate-45 transition-transform" />
          </h4>
          <p className="text-[11px] text-emerald-300/80 leading-snug">
            Mercadores exóticos, clareiras sagradas de Lena, atalhos élficos, bênção de Valkaria e refúgios rebeldes.
          </p>
        </button>

        {/* BOTÃO SORTEAR EVENTO RUIM */}
        <button
          onClick={() => handleDraw('ruim')}
          disabled={isDrawing !== null}
          className="relative group overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-[#3d1216] via-[#260b0e] to-[#170608] border-2 border-[#e63946]/60 hover:border-[#ff4d6d] shadow-[0_0_20px_rgba(230,57,70,0.3)] hover:shadow-[0_0_30px_rgba(230,57,70,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-left disabled:opacity-50"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e63946]/10 rounded-full blur-2xl group-hover:bg-[#e63946]/20 transition-all pointer-events-none" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#e63946]/20 border border-[#e63946]/50 flex items-center justify-center text-[#ff758f] group-hover:scale-110 transition-transform">
              <Skull className="w-5 h-5 text-rose-400" />
            </div>
            <span className="font-mono text-[10px] font-bold text-[#ff758f] bg-[#e63946]/20 px-2 py-0.5 rounded-full border border-[#e63946]/40">
              1d10 Contratempos
            </span>
          </div>

          <h4 className="font-serif font-bold text-base text-rose-200 group-hover:text-rose-100 mb-1 flex items-center gap-1.5">
            <span>Sortear Evento Ruim</span>
            <Dices className="w-4 h-4 text-[#ffd166] group-hover:rotate-45 transition-transform" />
          </h4>
          <p className="text-[11px] text-rose-300/80 leading-snug">
            Emboscadas de gnolls, tempestades ácidas, carroça quebrada, turbas fanáticos e caçadores de arcanistas.
          </p>
        </button>
      </div>

      {/* 3. CARD DE EXIBIÇÃO DO EVENTO SORTEADO OU SELECIONADO */}
      {displayedEvent ? (
        <div className={`rounded-2xl p-4 border-2 shadow-2xl transition-all ${
          displayedEvent.type === 'bom'
            ? 'bg-gradient-to-b from-[#0c2420] to-[#071513] border-[#2ec4b6] shadow-[0_0_25px_rgba(46,196,182,0.3)]'
            : 'bg-gradient-to-b from-[#2a0b0e] to-[#140507] border-[#e63946] shadow-[0_0_25px_rgba(230,57,70,0.3)]'
        }`}>
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                  displayedEvent.type === 'bom'
                    ? 'bg-[#2ec4b6]/20 text-[#48cae4] border-[#2ec4b6]'
                    : 'bg-[#e63946]/20 text-[#ff758f] border-[#e63946]'
                }`}>
                  {displayedEvent.type === 'bom' ? '★ Evento Favorável' : '☠ Contratempo Perigoso'} #{displayedEvent.numero}
                </span>
                <span className="text-[11px] text-gray-400 font-serif">{displayedEvent.subtitulo}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-white">
                {displayedEvent.titulo}
              </h3>
            </div>

            <button
              onClick={() => applyTravelEventBonus(displayedEvent)}
              className={`px-3 py-1.5 rounded-xl font-serif font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                displayedEvent.type === 'bom'
                  ? 'bg-gradient-to-r from-[#2ec4b6] to-[#208b81] text-gray-950 hover:brightness-110'
                  : 'bg-gradient-to-r from-[#e63946] to-[#9d0208] text-white hover:brightness-110'
              }`}
              title="Registrar / Aplicar os efeitos automáticos deste evento no grupo"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aplicar Efeito</span>
            </button>
          </div>

          {/* Narrativa para o Mestre Ler */}
          <div className="bg-black/40 border-l-4 rounded-r-xl p-3 mb-3 text-gray-200 italic leading-relaxed text-xs border-amber-400">
            <span className="not-italic text-[10px] font-bold text-amber-300 uppercase block mb-0.5">
              📜 Descrição Narrativa para Mesa:
            </span>
            "{displayedEvent.narrativa}"
          </div>

          {/* Efeito Mecânico & Regras T20 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-2">
            <div className="bg-[#141724] p-2.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                ⚙️ Efeito Mecânico & Consequência:
              </span>
              <p className="text-gray-200 text-[11px] leading-snug">
                {displayedEvent.efeitoMecanico}
              </p>
            </div>

            <div className="bg-[#141724] p-2.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                🎁 Recompensa / Penalidade:
              </span>
              <p className="text-gray-200 text-[11px] leading-snug">
                {displayedEvent.recompensaOuPenalidade}
              </p>
            </div>
          </div>

          {/* Teste Requerido se houver */}
          {displayedEvent.testeRequerido && (
            <div className="bg-[#1e2235] border border-amber-400/30 rounded-xl p-2.5 text-[11px] space-y-1">
              <div className="flex items-center justify-between font-bold text-amber-300">
                <span>🎯 Teste Requerido: {displayedEvent.testeRequerido.pericia} (CD {displayedEvent.testeRequerido.cd})</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-300 text-[10px]">
                <p><strong>Sucesso:</strong> {displayedEvent.testeRequerido.sucesso}</p>
                <p><strong>Falha:</strong> {displayedEvent.testeRequerido.falha}</p>
              </div>
            </div>
          )}

          {displayedEvent.dicasMestre && (
            <div className="mt-2 text-[10px] text-gray-400 italic bg-white/5 p-2 rounded-lg">
              💡 <strong>Dica do Mestre:</strong> {displayedEvent.dicasMestre}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0a0b10]/60 border border-dashed border-white/10 rounded-2xl p-6 text-center text-gray-400">
          <Dices className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
          <p className="font-serif text-sm text-gray-300 mb-1">Nenhum evento de viagem sorteado ainda</p>
          <p className="text-xs text-gray-500">
            Clique nos botões acima para sortear uma Benesse (Evento Bom) ou um Contratempo (Evento Ruim).
          </p>
        </div>
      )}

      {/* 4. ABAS DE CONSULTA MANUAL & COMPÊNDIO DE EVENTOS */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="font-serif font-bold text-xs text-[#ffd166] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Compêndio de Consulta de Viagem</span>
          </span>

          <div className="flex gap-1 bg-[#0a0b10] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab('compendio_bons')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                activeTab === 'compendio_bons'
                  ? 'bg-[#2ec4b6] text-gray-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              10 Eventos Bons
            </button>
            <button
              onClick={() => setActiveTab('compendio_ruins')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                activeTab === 'compendio_ruins'
                  ? 'bg-[#e63946] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              10 Eventos Ruins
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                activeTab === 'historico'
                  ? 'bg-[#9d4edd] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Histórico ({travelState.historicoEventos.length})
            </button>
          </div>
        </div>

        {/* LISTA DE 10 EVENTOS BONS */}
        {activeTab === 'compendio_bons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {GOOD_TRAVEL_EVENTS.map((ev) => (
              <div 
                key={ev.id}
                onClick={() => setSelectedEventForDetail(ev)}
                className="bg-[#141724] border border-white/5 hover:border-[#2ec4b6]/50 rounded-xl p-2.5 cursor-pointer transition-all space-y-1 hover:bg-[#1a2030]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#48cae4]">#{ev.numero}</span>
                  <span className="text-[9px] bg-[#2ec4b6]/10 text-[#48cae4] px-1.5 py-0.5 rounded">Bom</span>
                </div>
                <strong className="text-white text-xs block truncate">{ev.titulo}</strong>
                <p className="text-gray-400 text-[10px] line-clamp-2">{ev.recompensaOuPenalidade}</p>
              </div>
            ))}
          </div>
        )}

        {/* LISTA DE 10 EVENTOS RUINS */}
        {activeTab === 'compendio_ruins' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {BAD_TRAVEL_EVENTS.map((ev) => (
              <div 
                key={ev.id}
                onClick={() => setSelectedEventForDetail(ev)}
                className="bg-[#141724] border border-white/5 hover:border-[#e63946]/50 rounded-xl p-2.5 cursor-pointer transition-all space-y-1 hover:bg-[#201518]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#ff758f]">#{ev.numero}</span>
                  <span className="text-[9px] bg-[#e63946]/10 text-[#ff758f] px-1.5 py-0.5 rounded">Ruim</span>
                </div>
                <strong className="text-white text-xs block truncate">{ev.titulo}</strong>
                <p className="text-gray-400 text-[10px] line-clamp-2">{ev.recompensaOuPenalidade}</p>
              </div>
            ))}
          </div>
        )}

        {/* HISTÓRICO DE EVENTOS SORTEADOS NA SESSÃO */}
        {activeTab === 'historico' && (
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {travelState.historicoEventos.length === 0 ? (
              <p className="text-gray-500 italic p-3 text-center">Nenhum evento sorteado nesta sessão.</p>
            ) : (
              travelState.historicoEventos.map((ev, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedEventForDetail(ev)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    ev.type === 'bom'
                      ? 'bg-[#141724] border-[#2ec4b6]/30 hover:border-[#2ec4b6]'
                      : 'bg-[#141724] border-[#e63946]/30 hover:border-[#e63946]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${ev.type === 'bom' ? 'bg-[#2ec4b6]' : 'bg-[#e63946]'}`} />
                    <span className="font-bold text-white text-xs">{ev.titulo}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{ev.type === 'bom' ? 'Benesse' : 'Contratempo'}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};
