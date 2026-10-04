'use client';

import React, { useState } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { Dices, Sparkles } from 'lucide-react';

export const DiceRoller: React.FC = () => {
  const { rollDice, diceRollResult } = useAdventureStore();
  const [mod, setMod] = useState<number>(0);

  return (
    <div className="bg-[#0a0b10]/70 border border-[#9d4edd]/25 rounded-xl p-3 flex flex-col gap-2.5">
      <div className="flex items-center gap-1.5 pb-1 border-b border-[#e0a96d]/20 text-[#ffd166] text-xs font-serif font-bold tracking-wider uppercase">
        <Dices className="w-3.5 h-3.5" />
        <span>Rolador D20 (Tormenta20)</span>
      </div>

      {/* Controles de Rolagem */}
      <div className="flex gap-2">
        <input 
          type="number"
          value={mod}
          onChange={(e) => setMod(parseInt(e.target.value) || 0)}
          placeholder="+0"
          className="w-14 bg-[#1e2230] border border-[#3c425c] focus:border-[#c77dff] rounded-lg px-2 py-1 text-xs text-white font-mono text-center outline-none"
          title="Modificador de Perícia / Bônus"
        />
        <button 
          onClick={() => rollDice("Rolagem Livre", null, mod)}
          className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-[#9d4edd] to-[#5a189a] hover:from-[#c77dff] hover:to-[#9d4edd] text-white flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(157,78,221,0.3)] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span>Rolar d20 + Mod</span>
        </button>
      </div>

      {/* Display de Resultado */}
      <div className="bg-[#0d0f17] border border-white/5 rounded-lg p-2.5 text-center font-mono">
        <div className="text-2xl font-bold text-[#ffd166] drop-shadow-[0_0_10px_rgba(255,209,102,0.4)]">
          {diceRollResult ? diceRollResult.total : "--"}
        </div>
        <div className="text-[11px] text-gray-400 mt-0.5 truncate">
          {diceRollResult ? diceRollResult.breakdown : "Aguardando rolagem de teste..."}
        </div>
      </div>

      {/* Tabela de CDs Rápidas */}
      <div className="bg-[#0a0b10]/60 border border-white/5 rounded-lg p-2 text-[11px] text-gray-400 space-y-0.5">
        <div className="font-bold text-[#ffd166] text-[10px] uppercase">⚡ Guia Rápido de CDs:</div>
        <div>• <strong>CD 15-18:</strong> Desafios Padrão</div>
        <div>• <strong>CD 20-22:</strong> Desafios Severos</div>
        <div>• <strong>CD 24+:</strong> Situações Críticas</div>
        <div>• <strong>CD 30:</strong> Feito Quase Impossível</div>
      </div>
    </div>
  );
};
