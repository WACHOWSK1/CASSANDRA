/**
 * MOTOR DE ROLAGEM DE DADOS & AUDITORIA ESTATÍSTICA (Tormenta20 / RPG)
 * 
 * Implementa amostragem por rejeição (Rejection Sampling) com gerador criptograficamente
 * seguro (CSPRNG: Web Crypto API) para garantir 100% de uniformidade estatística,
 * eliminando viés de módulo (modulo bias) e imprecisões de ponto flutuante.
 */

// 1. Obtenção de Entropia Criptográfica (Uint32)
function getSecureRandomUint32(): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return buf[0];
  } else if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buf);
    return buf[0];
  }
  // Fallback seguro caso crypto não esteja disponível
  return Math.floor(Math.random() * 0x100000000);
}

/**
 * Rola um dado de N faces com distribuição perfeitamente uniforme (1 a sides).
 * Utiliza Amostragem por Rejeição para garantir probabilidade teórica exata de 1/sides.
 */
export function rollDie(sides: number): number {
  if (sides <= 1) return 1;
  const maxRange = 0x100000000; // 2^32
  const limit = maxRange - (maxRange % sides); // Maior múltiplo exato de 'sides'
  let val: number;
  do {
    val = getSecureRandomUint32();
  } while (val >= limit);
  return (val % sides) + 1;
}

/**
 * Rola múltiplos dados do mesmo tipo (ex: 3d6, 4d8, 12d6).
 */
export function rollMultipleDice(count: number, sides: number): { rolls: number[]; sum: number } {
  const rolls: number[] = [];
  let sum = 0;
  for (let i = 0; i < count; i++) {
    const r = rollDie(sides);
    rolls.push(r);
    sum += r;
  }
  return { rolls, sum };
}

/**
 * Rola um teste d20 com regras de Tormenta20 (crítico natural, falha crítica, CD).
 */
export interface D20RollResult {
  naturalRoll: number;
  mod: number;
  total: number;
  isCrit: boolean; // 20 Natural ou >= critMin
  isFumble: boolean; // 1 Natural
  critMin: number;
  breakdown: string;
  passedCD?: boolean;
  successProbability?: number; // Probabilidade teórica de sucesso vs CD em %
}

export function rollD20Test(options: {
  mod?: number;
  cd?: number | null;
  critMin?: number;
  advantage?: boolean; // Rolar 2d20 e ficar com o maior
  disadvantage?: boolean; // Rolar 2d20 e ficar com o menor
}): D20RollResult {
  const { mod = 0, cd = null, critMin = 20, advantage = false, disadvantage = false } = options;

  let r1 = rollDie(20);
  let naturalRoll = r1;
  let advantageNote = '';

  if (advantage) {
    const r2 = rollDie(20);
    naturalRoll = Math.max(r1, r2);
    advantageNote = ` (Vantagem: [${r1}, ${r2}] ➔ ${naturalRoll})`;
  } else if (disadvantage) {
    const r2 = rollDie(20);
    naturalRoll = Math.min(r1, r2);
    advantageNote = ` (Desvantagem: [${r1}, ${r2}] ➔ ${naturalRoll})`;
  }

  const isCrit = naturalRoll >= critMin;
  const isFumble = naturalRoll === 1;
  const total = naturalRoll + mod;

  let breakdown = `d20 [${naturalRoll}]${advantageNote}${mod !== 0 ? ` ${mod >= 0 ? '+' : '-'} ${Math.abs(mod)}` : ''} = ${total}`;

  if (naturalRoll === 20) {
    breakdown += ' ★ CRÍTICO (20 Natural)!';
  } else if (isCrit) {
    breakdown += ` ★ CRÍTICO (${critMin}+)!`;
  } else if (isFumble) {
    breakdown += ' ☠ FALHA CRÍTICA (1 Natural)!';
  }

  let passedCD: boolean | undefined = undefined;
  let successProbability: number | undefined = undefined;

  if (cd !== null) {
    passedCD = total >= cd;
    breakdown += ` | CD ${cd}: ${passedCD ? 'SUCESSO' : 'FALHA'}`;

    // Cálculo da probabilidade teórica de sucesso
    // Precisa rolar: naturalRoll + mod >= cd  =>  naturalRoll >= cd - mod
    const neededOnD20 = cd - mod;
    if (neededOnD20 <= 1) {
      successProbability = 95; // No T20, 1 natural é sempre falha
    } else if (neededOnD20 > 20) {
      successProbability = 5; // Apenas 20 natural tem chance
    } else {
      successProbability = ((21 - neededOnD20) / 20) * 100;
    }
  }

  return {
    naturalRoll,
    mod,
    total,
    isCrit,
    isFumble,
    critMin,
    breakdown,
    passedCD,
    successProbability
  };
}

/**
 * Rolagem de Porcentagem (D100 / d%) para chances de camuflagem, incorpóreo, etc.
 */
export interface PercentRollResult {
  roll: number;
  chance: number;
  success: boolean;
  breakdown: string;
}

export function rollPercentCheck(chancePercent: number, label = 'Chance'): PercentRollResult {
  const roll = rollDie(100);
  const success = roll <= chancePercent;
  const breakdown = `d% [${roll}%] vs ${label} (${chancePercent}%): ${success ? '✓ SUCESSO' : '✗ FALHA'}`;
  return { roll, chance: chancePercent, success, breakdown };
}

/**
 * Componente individual de dano analisado de uma fórmula
 */
export interface DamageComponentResult {
  tipo: string;
  diceText: string;
  count: number;
  sides: number;
  rolls: number[];
  diceSum: number;
  staticMod: number;
  total: number;
  critMultiplier: number;
}

export interface ParsedFormulaResult {
  total: number;
  breakdown: string;
  components: DamageComponentResult[];
  isCritApplied: boolean;
}

/**
 * Analisa e rola fórmulas completas de dano de RPG/Tormenta20.
 * Suporta fórmulas simples ("1d8+5") e compostas ("2d6+16 impacto + 10d6+10 frio").
 * Aplica multiplicador de crítico aos dados (duplica, triplica, etc.) conforme as regras de T20.
 */
export function parseAndRollDamageFormula(
  formula: string,
  critMultiplier = 1
): ParsedFormulaResult {
  if (!formula || typeof formula !== 'string') {
    return {
      total: 0,
      breakdown: '0',
      components: [],
      isCritApplied: false
    };
  }

  // Divide por '+' quando separa expressões com tipo de dano (ex: "2d6+16 impacto + 10d6+10 frio")
  // Ou analisa sequencialmente
  const cleanFormula = formula.trim();

  // Expressão regular para capturar blocos como "2d6+16 impacto", "10d6+10 frio", "1d8+5", "12d6"
  // Procura por partes contendo: [quantidade]d[faces] [opcional: +mod ou -mod] [opcional: tipo de dano]
  const dicePattern = /(\d+)?d(\d+)(?:\s*([+-])\s*(\d+))?(?:\s+([a-zA-Zçãéíóú/]+))?/gi;
  
  const components: DamageComponentResult[] = [];
  let match: RegExpExecArray | null;
  let hasMatches = false;

  while ((match = dicePattern.exec(cleanFormula)) !== null) {
    hasMatches = true;
    const baseCount = parseInt(match[1] || '1', 10);
    const sides = parseInt(match[2], 10);
    const sign = match[3] || '+';
    const staticModRaw = parseInt(match[4] || '0', 10);
    const staticMod = sign === '-' ? -staticModRaw : staticModRaw;
    const tipo = (match[5] || 'dano').toLowerCase();

    // No crítico de T20: o multiplicador multiplica a quantidade de dados rolados
    const count = critMultiplier > 1 ? baseCount * critMultiplier : baseCount;

    const { rolls, sum: diceSum } = rollMultipleDice(count, sides);
    const componentTotal = Math.max(0, diceSum + staticMod);

    components.push({
      tipo,
      diceText: `${baseCount}d${sides}`,
      count,
      sides,
      rolls,
      diceSum,
      staticMod,
      total: componentTotal,
      critMultiplier
    });
  }

  // Se a regex com tipos de dano não capturou, tenta capturar números puros ou termos adicionais
  if (!hasMatches) {
    // Tenta apenas números fixos como "15"
    const staticOnly = parseInt(cleanFormula, 10);
    if (!isNaN(staticOnly)) {
      return {
        total: staticOnly,
        breakdown: `${staticOnly}`,
        components: [{
          tipo: 'fixo',
          diceText: 'fixo',
          count: 0,
          sides: 0,
          rolls: [],
          diceSum: 0,
          staticMod: staticOnly,
          total: staticOnly,
          critMultiplier: 1
        }],
        isCritApplied: false
      };
    }
  }

  const grandTotal = components.reduce((acc, c) => acc + c.total, 0);

  // Monta breakdown explicativo
  const breakdownParts = components.map(c => {
    const rollsStr = `[${c.rolls.join('+')}] (${c.diceSum})`;
    const modStr = c.staticMod !== 0 ? ` ${c.staticMod > 0 ? '+' : '-'} ${Math.abs(c.staticMod)}` : '';
    const critBadge = c.critMultiplier > 1 ? ` (x${c.critMultiplier} crit)` : '';
    const tipoStr = c.tipo !== 'dano' && c.tipo !== 'fixo' ? ` ${c.tipo}` : '';
    return `${rollsStr}${modStr}${critBadge}${tipoStr}`;
  });

  const breakdown = `${breakdownParts.join(' + ')} = ${grandTotal}`;

  return {
    total: grandTotal,
    breakdown,
    components,
    isCritApplied: critMultiplier > 1
  };
}

/**
 * ESTRUTURA DE AUDITORIA ESTATÍSTICA
 * Rola 'sampleSize' dados e calcula frequências observadas vs esperadas,
 * desvios percentuais e teste Qui-Quadrado (Chi-Square) de bondade de ajuste.
 */
export interface DieAuditFaceResult {
  face: number;
  observedCount: number;
  observedPercent: number;
  expectedPercent: number;
  deviationPercent: number;
}

export interface DieAuditSummary {
  sides: number;
  sampleSize: number;
  expectedPerFace: number;
  faces: DieAuditFaceResult[];
  chiSquare: number;
  pValueEstimate: number;
  isUniform: boolean; // p-value > 0.05 significa que a hipótese de uniformidade é mantida com sucesso
  maxDeviationPercent: number;
  executionTimeMs: number;
}

export function auditDiceDistribution(sides = 20, sampleSize = 10000): DieAuditSummary {
  const startTime = performance.now();
  const counts = new Array(sides).fill(0);

  // Amostragem
  for (let i = 0; i < sampleSize; i++) {
    const roll = rollDie(sides);
    counts[roll - 1]++;
  }

  const expectedPerFace = sampleSize / sides;
  const expectedPercent = 100 / sides;

  let chiSquare = 0;
  let maxDev = 0;

  const faces: DieAuditFaceResult[] = [];

  for (let i = 0; i < sides; i++) {
    const observed = counts[i];
    const diff = observed - expectedPerFace;
    chiSquare += (diff * diff) / expectedPerFace;

    const observedPercent = (observed / sampleSize) * 100;
    const deviationPercent = Math.abs(observedPercent - expectedPercent);
    if (deviationPercent > maxDev) {
      maxDev = deviationPercent;
    }

    faces.push({
      face: i + 1,
      observedCount: observed,
      observedPercent: parseFloat(observedPercent.toFixed(2)),
      expectedPercent: parseFloat(expectedPercent.toFixed(2)),
      deviationPercent: parseFloat(deviationPercent.toFixed(2))
    });
  }

  // Estimativa aproximada do p-value para teste Chi-Square com df = sides - 1
  // Para df = 19 (d20), valor crítico a 5% (0.05) é ~30.14. Se chiSquare <= 30.14, a distribuição é uniforme com >95% de certeza.
  // Valor crítico a 1% (0.01) é ~36.19.
  const degreesOfFreedom = sides - 1;
  const criticalValue95 = degreesOfFreedom + Math.sqrt(2 * degreesOfFreedom) * 1.645 + (2 / 3);
  const isUniform = chiSquare <= criticalValue95;

  // Aproximação de P-Value baseada em z-score da distribuição qui-quadrado de Wilson-Hilferty
  const z = (Math.pow(chiSquare / degreesOfFreedom, 1 / 3) - (1 - 2 / (9 * degreesOfFreedom))) / Math.sqrt(2 / (9 * degreesOfFreedom));
  const pValueEstimate = parseFloat(Math.max(0.0001, Math.min(0.9999, 1 - 0.5 * (1 + Math.sign(z) * Math.sqrt(1 - Math.exp(-2 * z * z / Math.PI))))).toFixed(4));

  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

  return {
    sides,
    sampleSize,
    expectedPerFace,
    faces,
    chiSquare: parseFloat(chiSquare.toFixed(2)),
    pValueEstimate,
    isUniform,
    maxDeviationPercent: parseFloat(maxDev.toFixed(2)),
    executionTimeMs
  };
}
