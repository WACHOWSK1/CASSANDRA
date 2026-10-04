'use client';

import React, { useState } from 'react';
import { ALERT_RULES, TRANSFER_CLOCK_RULES, ANTIMAGIA_RULES } from '@/data/rulesData';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Flame, 
  AlertTriangle, 
  Shield, 
  Layers, 
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const DadosCompendiumPanel: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'alerta' | 'antimagia'>('alerta');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-3 text-xs">
      
      {/* SELETOR DE DOCUMENTOS */}
      <div className="flex items-center gap-1 bg-[#0a0b10] border border-[#9d4edd]/30 p-1 rounded-xl">
        <button
          onClick={() => setActiveDoc('alerta')}
          className={`flex-1 py-1.5 rounded-lg font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeDoc === 'alerta'
              ? 'bg-gradient-to-r from-[#9d4edd] to-[#5a189a] text-white shadow-[0_0_10px_rgba(157,78,221,0.5)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
          <span>Doc: Medidor de Alerta & Transferência</span>
        </button>

        <button
          onClick={() => setActiveDoc('antimagia')}
          className={`flex-1 py-1.5 rounded-lg font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeDoc === 'antimagia'
              ? 'bg-gradient-to-r from-[#9d4edd] to-[#5a189a] text-white shadow-[0_0_10px_rgba(157,78,221,0.5)]'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-cyan-300" />
          <span>Doc: Rede Antimagia & Pilonos</span>
        </button>
      </div>

      {/* DOCUMENTO 1: MEDIDOR DE ALERTA E TRANSFERÊNCIA */}
      {activeDoc === 'alerta' && (
        <div className="space-y-3">
          <div className="bg-[#0a0b10]/90 border border-[#9d4edd]/30 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <h4 className="font-serif font-bold text-sm text-[#ffd166]">
                  T20: Medidor de Alerta & Relógio de Transferência
                </h4>
                <span className="text-[10px] text-[#c77dff]">
                  Ficha Operacional de Condução em Milothiann e Khorcova
                </span>
              </div>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-mono">
                Oficial / dados
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed text-[11px]">
              <strong>Regra Central do Alerta:</strong> O Alerta responde a uma única pergunta: <em>quanto o regime sabe sobre a presença, a identidade e o objetivo do grupo?</em> Falhas silenciosas e simples demora não fornecem conhecimento ao inimigo.
            </p>
          </div>

          {/* TABELA DE ALERTA NÍVEIS 0 A 6 */}
          <div className="space-y-2">
            <span className="font-serif font-bold text-xs text-[#ffd166] uppercase tracking-wider block">
              Tabela Completa de Níveis de Alerta (0 a 6):
            </span>

            {Object.values(ALERT_RULES).map((rule) => (
              <div 
                key={rule.level}
                className="bg-[#141724] border border-white/5 rounded-xl p-3 space-y-1.5 hover:border-[#9d4edd]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#ffd166] bg-[#ffd166]/10 px-2 py-0.5 rounded">
                    Nível {rule.level}: {rule.estado}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">Alerta {rule.level}</span>
                </div>

                <p className="text-gray-400 italic text-[11px]">
                  "{rule.sinalNarrativo}"
                </p>

                <div className="pt-1 border-t border-white/5 space-y-1 text-[11px]">
                  {rule.consequencias.resumo.map((res, i) => (
                    <div key={i} className="flex items-start gap-1 text-gray-200">
                      <span className="text-[#c77dff] font-bold">›</span>
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* TABELA DO RELÓGIO DA TRANSFERÊNCIA */}
          <div className="bg-[#0a0b10]/90 border border-[#2ec4b6]/30 rounded-2xl p-3.5 space-y-2">
            <h4 className="font-serif font-bold text-xs text-[#48cae4] uppercase tracking-wider">
              Relógio da Transferência de Cassandra (Mede Tempo, Não Conhecimento)
            </h4>

            <div className="space-y-2 text-[11px]">
              {Object.values(TRANSFER_CLOCK_RULES).map((stg) => (
                <div key={stg.stage} className="bg-[#141724] p-2.5 rounded-xl border border-white/5 space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="text-[#2ec4b6] font-mono">Estágio {stg.stage}:</span>
                    <span>{stg.situacao}</span>
                  </div>
                  <p className="text-gray-300 text-[11px]">{stg.efeitoNaCena}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTO 2: REDE ANTIMAGIA: LANTERNAS E PILONOS */}
      {activeDoc === 'antimagia' && (
        <div className="space-y-3">
          <div className="bg-[#0a0b10]/90 border border-[#9d4edd]/30 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <h4 className="font-serif font-bold text-sm text-[#ffd166]">
                  T20: Rede Antimagia: Lanternas e Pilonos
                </h4>
                <span className="text-[10px] text-[#c77dff]">
                  Funcionamento, Contrajogo e Resolução Rápida
                </span>
              </div>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-mono">
                Oficial / dados
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed text-[11px]">
              <strong>Regra Central:</strong> A Lanterna Nula <em>dificulta</em> a conjuração (esfera 9m); a rede dos pilonos <em>pressiona</em> a arena; somente o núcleo de 3m de um pilono ativo <em>suprime completamente</em> a magia.
            </p>
          </div>

          {/* HIERARQUIA DE CAMADAS */}
          <div className="space-y-2">
            <span className="font-serif font-bold text-xs text-[#ffd166] uppercase tracking-wider block">
              As 4 Camadas de Antimagia em Milothiann:
            </span>

            {ANTIMAGIA_RULES.camadas.map((camada, idx) => (
              <div key={idx} className="bg-[#141724] border border-white/5 rounded-xl p-3 space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{camada.nome}</span>
                  <span className="text-[10px] font-mono text-[#c77dff] bg-white/5 px-2 py-0.5 rounded">
                    Alcance: {camada.alcance}
                  </span>
                </div>
                <p className="text-gray-300"><strong>Efeito:</strong> {camada.efeito}</p>
                <p className="text-[#ffd166]/90"><strong>Como Contornar:</strong> {camada.contorno}</p>
              </div>
            ))}
          </div>

          {/* AÇÕES DE JOGADORES CONTRA PILONOS */}
          <div className="bg-[#0a0b10]/90 border border-purple-500/30 rounded-2xl p-3.5 space-y-2">
            <h4 className="font-serif font-bold text-xs text-[#c77dff] uppercase tracking-wider">
              Ações dos Heróis na Arena dos Pilonos
            </h4>

            <div className="space-y-2 text-[11px]">
              {ANTIMAGIA_RULES.acoesPilonos.map((act, idx) => (
                <div key={idx} className="bg-[#141724] p-2.5 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{act.acao}</span>
                    <span className="font-mono text-[10px] text-amber-300">{act.teste}</span>
                  </div>
                  <p className="text-gray-300">{act.resultado}</p>
                  <p className="text-[#2ec4b6] text-[10px] font-semibold">★ Vantagem: {act.vantagem}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
