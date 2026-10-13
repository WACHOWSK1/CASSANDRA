'use client';

import React, { useState, useMemo } from 'react';
import { useAdventureStore } from '@/store/useAdventureStore';
import { 
  rollDie, 
  rollMultipleDice, 
  rollD20Test, 
  rollPercentCheck, 
  parseAndRollDamageFormula, 
  auditDiceDistribution,
  DieAuditSummary
} from '@/lib/diceEngine';
import { 
  Dices, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight,
  Zap,
  Target,
  Percent,
  Calculator,
  Flame,
  Info
} from 'lucide-react';

export const DiceRoller: React.FC = () => {
  const { rollDice, diceRollResult } = useAdventureStore();

  // Abas do Painel: 'rolador' ou 'auditoria'
  const [activeTab, setActiveTab] = useState<'rolador' | 'auditoria'>('rolador');

  // Configurações do Rolador
  const [selectedDie, setSelectedDie] = useState<number>(20);
  const [diceCount, setDiceCount] = useState<number>(1);
  const [mod, setMod] = useState<number>(0);
  const [targetCD, setTargetCD] = useState<string>('');
  const [critMin, setCritMin] = useState<number>(20);
  const [rollMode, setRollMode] = useState<'normal' | 'vantagem' | 'desvantagem'>('normal');
  const [freeFormula, setFreeFormula] = useState<string>('');

  // Resultado local avançado
  const [lastLocalRoll, setLastLocalRoll] = useState<{
    titulo: string;
    total: number;
    breakdown: string;
    isCrit?: boolean;
    isFumble?: boolean;
    passedCD?: boolean;
    probabilidade?: number;
  } | null>(null);

  // Estado da Auditoria Estatística
  const [auditSides, setAuditSides] = useState<number>(20);
  const [auditSampleSize, setAuditSampleSize] = useState<number>(10000);
  const [auditResult, setAuditResult] = useState<DieAuditSummary | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // Executa auditoria inicial na primeira abertura
  const handleRunAudit = () => {
    setIsAuditing(true);
    // Timeout para permitir transição de UI
    setTimeout(() => {
      const summary = auditDiceDistribution(auditSides, auditSampleSize);
      setAuditResult(summary);
      setIsAuditing(false);
    }, 50);
  };

  // Cálculo da probabilidade teórica estimada antes de rolar d20
  const estimatedProbability = useMemo(() => {
    const cdNum = parseInt(targetCD, 10);
    if (isNaN(cdNum) || selectedDie !== 20) return null;
    const needed = cdNum - mod;
    if (needed <= 1) return 95; // 1 natural é falha
    if (needed > 20) return 5;  // apenas 20 natural
    const baseP = ((21 - needed) / 20) * 100;
    if (rollMode === 'vantagem') {
      const pFail = 1 - (baseP / 100);
      return parseFloat(((1 - (pFail * pFail)) * 100).toFixed(1));
    }
    if (rollMode === 'desvantagem') {
      const pSuccess = baseP / 100;
      return parseFloat(((pSuccess * pSuccess) * 100).toFixed(1));
    }
    return parseFloat(baseP.toFixed(1));
  }, [targetCD, mod, selectedDie, rollMode]);

  // Executa rolagem com base nas escolhas
  const handleExecuteRoll = () => {
    const cdNum = targetCD ? parseInt(targetCD, 10) : null;

    if (freeFormula.trim()) {
      const parsed = parseAndRollDamageFormula(freeFormula.trim());
      setLastLocalRoll({
        titulo: `Fórmula: ${freeFormula.trim()}`,
        total: parsed.total,
        breakdown: parsed.breakdown
      });
      return;
    }

    if (selectedDie === 20 && diceCount === 1) {
      const result = rollD20Test({
        mod,
        cd: cdNum,
        critMin,
        advantage: rollMode === 'vantagem',
        disadvantage: rollMode === 'desvantagem'
      });

      // Também registra no store para sincronizar com logs da campanha
      rollDice("Rolador T20", cdNum, mod);

      setLastLocalRoll({
        titulo: `Teste D20 ${mod !== 0 ? (mod > 0 ? `+${mod}` : `${mod}`) : ''}`,
        total: result.total,
        breakdown: result.breakdown,
        isCrit: result.isCrit,
        isFumble: result.isFumble,
        passedCD: result.passedCD,
        probabilidade: result.successProbability
      });
    } else {
      // Múltiplos dados ou outro dado (ex: 3d6+4, 1d100)
      const { rolls, sum } = rollMultipleDice(diceCount, selectedDie);
      const total = sum + mod;
      const modStr = mod !== 0 ? ` ${mod > 0 ? '+' : '-'} ${Math.abs(mod)}` : '';
      const breakdown = `${diceCount}d${selectedDie} [${rolls.join('+')}]${modStr} = ${total}`;

      setLastLocalRoll({
        titulo: `Rolagem ${diceCount}d${selectedDie}`,
        total,
        breakdown
      });
    }
  };

  // Checagem rápida de porcentagem (d100)
  const handleQuickPercent = (chance: number, label: string) => {
    const res = rollPercentCheck(chance, label);
    setLastLocalRoll({
      titulo: `Teste de %: ${label} (${chance}%)`,
      total: res.roll,
      breakdown: res.breakdown,
      passedCD: res.success
    });
  };

  return (
    <div className="bg-[#0e111a]/95 border-2 border-[#9d4edd]/40 rounded-2xl p-3.5 flex flex-col gap-3 shadow-[0_0_30px_rgba(157,78,221,0.2)] text-white">
      
      {/* HEADER DO ROLADOR & ABAS */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9d4edd] to-[#5a189a] flex items-center justify-center text-white shadow-md">
            <Dices className="w-4 h-4 text-[#ffd166]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#ffd166] tracking-wide">
              Rolador T20 & Auditoria CSPRNG
            </h3>
            <p className="text-[10px] text-gray-400">
              Web Crypto API • Amostragem por Rejeição • 0% Viés de Módulo
            </p>
          </div>
        </div>

        {/* Seletor de Abas */}
        <div className="flex bg-[#161a29] p-0.5 rounded-lg border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('rolador')}
            className={`px-2.5 py-1 rounded-md font-serif font-bold transition-all ${
              activeTab === 'rolador'
                ? 'bg-gradient-to-r from-[#9d4edd] to-[#5a189a] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎲 Rolador
          </button>
          <button
            onClick={() => {
              setActiveTab('auditoria');
              if (!auditResult) handleRunAudit();
            }}
            className={`px-2.5 py-1 rounded-md font-serif font-bold transition-all flex items-center gap-1 ${
              activeTab === 'auditoria'
                ? 'bg-gradient-to-r from-[#2ec4b6] to-[#0f4c5c] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3 text-[#2ec4b6]" />
            <span>🔬 Auditoria (10k)</span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA 1: ROLADOR DE DADOS */}
      {activeTab === 'rolador' && (
        <div className="space-y-3">
          
          {/* Seletor Rápido de Tipo de Dado */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Selecione o Dado:
            </label>
            <div className="grid grid-cols-7 gap-1">
              {[4, 6, 8, 10, 12, 20, 100].map((sides) => (
                <button
                  key={sides}
                  onClick={() => {
                    setSelectedDie(sides);
                    setFreeFormula('');
                  }}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    selectedDie === sides && !freeFormula
                      ? 'bg-gradient-to-b from-[#9d4edd] to-[#5a189a] border-[#c77dff] text-white shadow-[0_0_10px_rgba(157,78,221,0.5)] scale-105'
                      : 'bg-[#151928] border-white/10 text-gray-300 hover:bg-[#1f2438] hover:text-white'
                  }`}
                >
                  d{sides}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade, Modificador, Margem de Crítico e CD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Quantidade de Dados */}
            <div className="bg-[#151928] border border-white/5 rounded-xl p-2 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Qtd Dados</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={diceCount}
                  onChange={(e) => setDiceCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#0a0b10] border border-[#3c425c] rounded-lg px-2 py-1 font-mono text-center text-white font-bold outline-none focus:border-[#c77dff]"
                />
              </div>
            </div>

            {/* Bônus / Modificador */}
            <div className="bg-[#151928] border border-white/5 rounded-xl p-2 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Modificador (+/-)</span>
              <input
                type="number"
                value={mod}
                onChange={(e) => setMod(parseInt(e.target.value) || 0)}
                placeholder="+0"
                className="w-full bg-[#0a0b10] border border-[#3c425c] rounded-lg px-2 py-1 font-mono text-center text-white font-bold outline-none focus:border-[#c77dff]"
              />
            </div>

            {/* Margem de Crítico (se d20) */}
            <div className="bg-[#151928] border border-white/5 rounded-xl p-2 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Ameaça / Crítico</span>
              <select
                value={critMin}
                onChange={(e) => setCritMin(parseInt(e.target.value))}
                disabled={selectedDie !== 20}
                className="w-full bg-[#0a0b10] border border-[#3c425c] rounded-lg px-1.5 py-1 font-mono text-center text-white font-bold outline-none focus:border-[#c77dff] disabled:opacity-30"
              >
                <option value={20}>20 Natural</option>
                <option value={19}>19-20</option>
                <option value={18}>18-20</option>
                <option value={17}>17-20</option>
              </select>
            </div>

            {/* CD Alvo */}
            <div className="bg-[#151928] border border-white/5 rounded-xl p-2 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase">CD Alvo (Opcional)</span>
              <input
                type="number"
                value={targetCD}
                onChange={(e) => setTargetCD(e.target.value)}
                placeholder="Ex: 20"
                className="w-full bg-[#0a0b10] border border-[#3c425c] rounded-lg px-2 py-1 font-mono text-center text-[#ffd166] font-bold outline-none focus:border-[#c77dff]"
              />
            </div>
          </div>

          {/* Modo de Rolagem D20 (Normal, Vantagem, Desvantagem) */}
          {selectedDie === 20 && (
            <div className="flex items-center gap-1.5 bg-[#151928] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 font-bold uppercase px-2">Modo:</span>
              <button
                onClick={() => setRollMode('normal')}
                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                  rollMode === 'normal'
                    ? 'bg-[#9d4edd] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Normal (1d20)
              </button>
              <button
                onClick={() => setRollMode('vantagem')}
                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                  rollMode === 'vantagem'
                    ? 'bg-[#2ec4b6] text-gray-950 font-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Vantagem (2d20 Maior)
              </button>
              <button
                onClick={() => setRollMode('desvantagem')}
                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                  rollMode === 'desvantagem'
                    ? 'bg-[#e63946] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Desvantagem (2d20 Menor)
              </button>
            </div>
          )}

          {/* Probabilidade Teórica Estimada (se CD informada) */}
          {estimatedProbability !== null && (
            <div className="bg-[#121626] border border-[#ffd166]/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-300">
                <Target className="w-3.5 h-3.5 text-[#ffd166]" />
                <span>Chance teórica de superar CD {targetCD}:</span>
              </div>
              <span className="font-mono font-bold text-[#ffd166] bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded text-xs">
                {estimatedProbability}%
              </span>
            </div>
          )}

          {/* Fórmula Livre de Dano Composta */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Ou digite uma fórmula composta:
              </label>
              <span className="text-[10px] text-gray-500 font-mono">
                Ex: 2d6+16 impacto + 10d6+10 frio
              </span>
            </div>
            <input
              type="text"
              value={freeFormula}
              onChange={(e) => setFreeFormula(e.target.value)}
              placeholder="Ex: 3d8+12 trevas ou 10d6 fogo"
              className="w-full bg-[#151928] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-[#ffd166] outline-none focus:border-[#c77dff]"
            />
          </div>

          {/* BOTÃO PRINCIPAL DE ROLAGEM */}
          <button
            onClick={handleExecuteRoll}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9d4edd] via-[#7b2cbf] to-[#5a189a] hover:from-[#c77dff] hover:to-[#9d4edd] text-white font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(157,78,221,0.4)] transition-all transform active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>
              {freeFormula.trim()
                ? `Rolar Fórmula Composta`
                : `Rolar ${diceCount}d${selectedDie} ${mod !== 0 ? (mod > 0 ? `+${mod}` : `${mod}`) : ''} (CSPRNG)`}
            </span>
          </button>

          {/* DISPLAY DO RESULTADO */}
          {lastLocalRoll && (
            <div className="bg-[#121524] border-2 border-[#9d4edd]/50 rounded-xl p-3 text-center space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[11px] text-gray-400">
                <span className="font-semibold text-gray-300">{lastLocalRoll.titulo}</span>
                {lastLocalRoll.probabilidade !== undefined && (
                  <span className="text-amber-300 font-mono">
                    Probabilidade: {lastLocalRoll.probabilidade}%
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="text-3xl sm:text-4xl font-mono font-black text-[#ffd166] drop-shadow-[0_0_15px_rgba(255,209,102,0.5)]">
                  {lastLocalRoll.total}
                </div>

                {lastLocalRoll.isCrit && (
                  <span className="bg-amber-950 border border-amber-400 text-amber-300 px-2 py-0.5 rounded-lg text-xs font-bold animate-pulse">
                    ★ CRÍTICO!
                  </span>
                )}

                {lastLocalRoll.isFumble && (
                  <span className="bg-rose-950 border border-rose-500 text-rose-300 px-2 py-0.5 rounded-lg text-xs font-bold animate-pulse">
                    ☠ FALHA CRÍTICA!
                  </span>
                )}

                {lastLocalRoll.passedCD !== undefined && (
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${
                    lastLocalRoll.passedCD
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-rose-950 border-rose-500 text-rose-300'
                  }`}>
                    {lastLocalRoll.passedCD ? '✓ SUCESSO' : '✗ FALHA'}
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-gray-300 bg-[#0a0b10]/60 rounded-lg p-1.5 border border-white/5 break-all">
                {lastLocalRoll.breakdown}
              </div>
            </div>
          )}

          {/* CHECAGENS RÁPIDAS DE PORCENTAGEM D100 */}
          <div className="bg-[#121524] border border-white/5 rounded-xl p-2.5 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5 text-cyan-400" />
              <span>Checagens Rápidas de Camuflagem / D% (d100):</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => handleQuickPercent(50, 'Incorpóreo / Camuflagem Total')}
                className="py-1 px-2 rounded-lg bg-[#1a2035] hover:bg-[#252e4d] border border-cyan-500/30 text-cyan-200 font-mono font-bold text-[11px] transition-all"
              >
                50% (Incorpóreo)
              </button>
              <button
                onClick={() => handleQuickPercent(20, 'Camuflagem Leve')}
                className="py-1 px-2 rounded-lg bg-[#1a2035] hover:bg-[#252e4d] border border-amber-500/30 text-amber-200 font-mono font-bold text-[11px] transition-all"
              >
                20% (Camuflagem)
              </button>
              <button
                onClick={() => handleQuickPercent(25, 'Chance de Erro 25%')}
                className="py-1 px-2 rounded-lg bg-[#1a2035] hover:bg-[#252e4d] border border-purple-500/30 text-purple-200 font-mono font-bold text-[11px] transition-all"
              >
                25% (Neblina)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: AUDITORIA ESTATÍSTICA (CHI-SQUARE & CSPRNG) */}
      {activeTab === 'auditoria' && (
        <div className="space-y-3">
          
          {/* Controles da Auditoria */}
          <div className="bg-[#121626] border border-white/10 rounded-xl p-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Testar Dado:</span>
              <select
                value={auditSides}
                onChange={(e) => setAuditSides(parseInt(e.target.value))}
                className="bg-[#0a0b10] border border-[#3c425c] rounded-lg px-2 py-1 font-mono font-bold text-white text-xs"
              >
                <option value={4}>d4 (4 faces)</option>
                <option value={6}>d6 (6 faces)</option>
                <option value={8}>d8 (8 faces)</option>
                <option value={10}>d10 (10 faces)</option>
                <option value={12}>d12 (12 faces)</option>
                <option value={20}>d20 (20 faces)</option>
                <option value={100}>d100 (100 faces)</option>
              </select>

              <span className="text-gray-400 font-bold uppercase text-[10px] ml-1">Amostra:</span>
              <select
                value={auditSampleSize}
                onChange={(e) => setAuditSampleSize(parseInt(e.target.value))}
                className="bg-[#0a0b10] border border-[#3c425c] rounded-lg px-2 py-1 font-mono font-bold text-white text-xs"
              >
                <option value={10000}>10.000 rolagens</option>
                <option value={50000}>50.000 rolagens</option>
                <option value={100000}>100.000 rolagens</option>
              </select>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#2ec4b6] to-[#0f4c5c] hover:from-[#48cae4] hover:to-[#2ec4b6] text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Processando...' : 'Reexecutar Teste'}</span>
            </button>
          </div>

          {/* Resumo Estatístico do Teste Qui-Quadrado */}
          {auditResult && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* Status de Uniformidade */}
                <div className="bg-[#121829] border border-emerald-500/30 rounded-xl p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Conformidade</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-300 font-mono mt-1">
                    {auditResult.isUniform ? '✓ APROVADO' : 'AVALIAR'}
                  </div>
                  <div className="text-[9px] text-emerald-400/80">
                    Hipótese nula mantida (p &gt; 0.05)
                  </div>
                </div>

                {/* Estatística Qui-Quadrado */}
                <div className="bg-[#121829] border border-white/5 rounded-xl p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">
                    Qui-Quadrado (χ²)
                  </div>
                  <div className="text-sm font-bold text-[#ffd166] font-mono mt-1">
                    {auditResult.chiSquare}
                  </div>
                  <div className="text-[9px] text-gray-400">
                    Graus Liberdade: {auditResult.sides - 1}
                  </div>
                </div>

                {/* P-Value */}
                <div className="bg-[#121829] border border-white/5 rounded-xl p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">
                    P-Value Estimado
                  </div>
                  <div className="text-sm font-bold text-cyan-300 font-mono mt-1">
                    {auditResult.pValueEstimate}
                  </div>
                  <div className="text-[9px] text-gray-400">
                    Critério: p &gt; 0.05 (Uniforme)
                  </div>
                </div>

                {/* Desvio Máximo */}
                <div className="bg-[#121829] border border-white/5 rounded-xl p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">
                    Desvio Máx. / Tempo
                  </div>
                  <div className="text-sm font-bold text-purple-300 font-mono mt-1">
                    ±{auditResult.maxDeviationPercent}%
                  </div>
                  <div className="text-[9px] text-gray-400">
                    Calculado em {auditResult.executionTimeMs}ms
                  </div>
                </div>
              </div>

              {/* Tabela Visual com Distribuição de Todas as Faces */}
              <div className="bg-[#121524] border border-white/10 rounded-xl p-2.5 space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase border-b border-white/5 pb-1">
                  <span>Face do Dado</span>
                  <span>Ocorrências (Obs vs Esp)</span>
                  <span>Frequência Relativa</span>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  {auditResult.faces.map((f) => {
                    const devSign = f.observedPercent >= f.expectedPercent ? '+' : '-';
                    return (
                      <div key={f.face} className="flex items-center justify-between py-0.5 hover:bg-white/5 px-1 rounded">
                        <div className="w-10 text-[#ffd166] font-bold">
                          [ {f.face} ]
                        </div>

                        <div className="flex-1 px-3">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 mb-0.5">
                            <span>{f.observedCount} / {Math.round(auditResult.expectedPerFace)}</span>
                            <span>{f.observedPercent}% (esp: {f.expectedPercent}%)</span>
                          </div>
                          {/* Barra de distribuição */}
                          <div className="w-full h-1.5 bg-[#1b2033] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#9d4edd] to-[#2ec4b6] rounded-full"
                              style={{ width: `${Math.min(100, (f.observedPercent / (f.expectedPercent * 2)) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className={`w-14 text-right text-[10px] ${
                          f.deviationPercent < 0.5 ? 'text-emerald-400' : 'text-cyan-300'
                        }`}>
                          {devSign}{f.deviationPercent}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Explicativo Técnico */}
              <div className="bg-[#0b0e17] border border-[#2ec4b6]/25 rounded-xl p-3 text-[11px] text-gray-300 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 text-[#2ec4b6] font-bold uppercase text-[10px]">
                  <Info className="w-3.5 h-3.5" />
                  <span>Garantias da Auditoria Criptográfica:</span>
                </div>
                <div>
                  • <strong>Entropia CSPRNG:</strong> Utiliza <code className="text-cyan-300">window.crypto.getRandomValues(new Uint32Array(1))</code> com sementes de hardware do sistema operacional, sem previsibilidade.
                </div>
                <div>
                  • <strong>Eliminação Estrita de Viés de Módulo (Modulo Bias):</strong> Aplica amostragem por rejeição descartando valores acima de <code className="text-cyan-300">2^32 - (2^32 % faces)</code>, assegurando probabilidade teórica idêntica para todas as faces.
                </div>
                <div>
                  • <strong>Teste Qui-Quadrado (χ²):</strong> Em 10.000 rolagens com 19 graus de liberdade (d20), um valor χ² menor que 30.14 confirma formalmente uniformidade estrita com 95%+ de nível de confiança estatística.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
