'use client';

import React from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { X, Download, Scroll } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { 
    isExportModalOpen, 
    setExportModalOpen, 
    act, 
    alertLevel, 
    npcStatus, 
    resources, 
    chronicle 
  } = useAdventureStore();

  if (!isExportModalOpen) return null;

  const generateReport = () => {
    return `# Relatório da Sessão: CASSANDRA - O Resgate e a Ascensão Profana
**Data de Registro:** ${new Date().toLocaleString()}
**Ato Atual Alcançado:** Ato ${act}
**Nível de Alerta Final:** ${alertLevel} / 5+

---

## 🛡️ Status dos Personagens e Aliados
- **Cael:** ${npcStatus.cael.toUpperCase()}
- **Toma:** ${npcStatus.toma.toUpperCase()}
- **Varek:** ${npcStatus.varek.toUpperCase()}
- **Aldren Crane:** ${npcStatus.aldren.toUpperCase()}
- **Cassandra Crane:** ${npcStatus.cassandra.toUpperCase()}

## 🎒 Recursos e Provas Coletadas
- Carta de Helena: ${resources.cartaHelena ? 'Sim' : 'Não'}
- Livro de Khorcova: ${resources.livroKhorcova ? 'Sim' : 'Não'}
- Placa de Greywick: ${resources.placaGreywick ? 'Sim' : 'Não'}
- Sais de Proteção restantes: ${resources.saisProtecao}
- Fagulha Arcana: ${resources.fagulhaArcana || 'Não usada'}
- Máscara de Varek: ${resources.mascaraVarek ? 'Sim' : 'Não'}
- Contrato de Severian: ${resources.contratoSeverian ? 'Sim' : 'Não'}
- Nome Escolhido de Cassandra: ${resources.nomeEscolhido ? 'Desperto' : 'Não'}
- Sinete Crane: ${resources.sineteCrane || 'Não definido'}

---

## 📜 Crônica Passo a Passo da Sessão
${chronicle.map(c => `- ${c}`).join('\n')}

---
*Gerado automaticamente pelo Sistema Tático do Mestre - CASSANDRA.*
`;
  };

  const handleDownload = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CRONICA_CASSANDRA_SESSAO_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) setExportModalOpen(false);
      }}
      className="fixed inset-0 z-50 bg-[#0a0b10]/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-[#141724] border border-[#ffd166]/40 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl relative flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ffd166]/20 pb-2">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-[#ffd166]" />
            <h3 className="font-serif font-bold text-base text-[#ffd166]">
              Crônica Completa da Sessão
            </h3>
          </div>
          <button 
            onClick={() => setExportModalOpen(false)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pré-visualização do Relatório */}
        <div className="bg-[#0a0b10] border border-white/5 rounded-xl p-3.5 font-mono text-xs text-gray-300 overflow-y-auto max-h-96 whitespace-pre-wrap leading-relaxed select-text">
          {generateReport()}
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
          <button 
            onClick={() => setExportModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          >
            Fechar
          </button>
          <button 
            onClick={handleDownload}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#996515] hover:from-[#ffd166] hover:to-[#d4af37] text-gray-950 flex items-center gap-2 shadow-[0_0_12px_rgba(255,209,102,0.4)] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo Markdown (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
