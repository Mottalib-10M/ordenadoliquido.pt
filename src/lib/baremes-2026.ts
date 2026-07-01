/**
 * Baremes fiscais para Portugal — Ano 2026
 * Escalões de IRS, TSU, deduções e tabelas de retenção na fonte
 */

/* ──────────────────────────── Escalões de IRS 2026 ──────────────────────────── */

export interface EscalaoIRS {
  /** Limite superior do escalão (Infinity para o último) */
  limiteMax: number;
  /** Taxa marginal (ex: 0.1325 = 13.25%) */
  taxa: number;
  /** Parcela a abater acumulada */
  parcelaAbater: number;
}

export const ESCALOES_IRS_2026: EscalaoIRS[] = [
  { limiteMax: 7_703, taxa: 0.1325, parcelaAbater: 0 },
  { limiteMax: 11_623, taxa: 0.18, parcelaAbater: 365.89 },
  { limiteMax: 16_472, taxa: 0.23, parcelaAbater: 946.04 },
  { limiteMax: 21_321, taxa: 0.26, parcelaAbater: 1_440.18 },
  { limiteMax: 27_146, taxa: 0.3275, parcelaAbater: 1_879.52 },
  { limiteMax: 39_791, taxa: 0.37, parcelaAbater: 3_034.72 },
  { limiteMax: 51_997, taxa: 0.435, parcelaAbater: 5_619.33 },
  { limiteMax: 81_199, taxa: 0.45, parcelaAbater: 6_399.60 },
  { limiteMax: Infinity, taxa: 0.48, parcelaAbater: 8_835.57 },
];

/* ────────────────────────── Segurança Social (TSU) ─────────────────────────── */

/** Taxa contributiva do trabalhador (regime geral) */
export const TSU_TRABALHADOR = 0.11;

/** Taxa contributiva da entidade empregadora (regime geral) */
export const TSU_EMPREGADOR = 0.2375;

/* ──────────────────────────── Deduções e valores ────────────────────────────── */

/** Dedução específica (rendimentos categoria A) */
export const DEDUCAO_ESPECIFICA = 4_104;

/** Dedução pessoal e familiar — por titular/dependente */
export const DEDUCAO_FAMILIAR_POR_PESSOA = 250;

/** Salário mínimo nacional mensal em 2026 */
export const SALARIO_MINIMO_2026 = 870;

/** Número de meses de salário por ano (14 meses: 12 + subsídio natal + subsídio férias) */
export const MESES_ANO = 14;

/** Número de meses de vencimento base (sem subsídios) */
export const MESES_VENCIMENTO = 12;

/* ─────────────────────────── IRS Jovem (2026) ──────────────────────────────── */

export interface IrsJovemEscalao {
  ano: number;
  isencaoPercentagem: number;
  limiteIsencao: number;
}

/**
 * IRS Jovem — regime de isenção parcial nos primeiros 5 anos
 * de obtenção de rendimentos do trabalho (aplicável a jovens até 35 anos).
 * Baseado no IAS (Indexante dos Apoios Sociais) 2026: €522,50 (estimado).
 */
export const IAS_2026 = 522.5;

export const IRS_JOVEM_ESCALOES: IrsJovemEscalao[] = [
  { ano: 1, isencaoPercentagem: 1.0, limiteIsencao: 55 * IAS_2026 },
  { ano: 2, isencaoPercentagem: 0.75, limiteIsencao: 40 * IAS_2026 },
  { ano: 3, isencaoPercentagem: 0.50, limiteIsencao: 30 * IAS_2026 },
  { ano: 4, isencaoPercentagem: 0.50, limiteIsencao: 30 * IAS_2026 },
  { ano: 5, isencaoPercentagem: 0.25, limiteIsencao: 20 * IAS_2026 },
];

/* ──────── Tabelas de Retenção na Fonte (simplificadas) — 2026 ──────── */

export type EstadoCivil = "solteiro" | "casado1titular" | "casado2titulares";

export interface TabelaRetencaoLinha {
  limiteMax: number;
  taxaSolteiro0: number;
  taxaSolteiro1: number;
  taxaSolteiro2: number;
  taxaSolteiro3: number;
  taxaSolteiro4: number;
  taxaSolteiro5mais: number;
  taxaCasado1T0: number;
  taxaCasado1T1: number;
  taxaCasado1T2: number;
  taxaCasado1T3: number;
  taxaCasado1T4: number;
  taxaCasado1T5mais: number;
  taxaCasado2T0: number;
  taxaCasado2T1: number;
  taxaCasado2T2: number;
  taxaCasado2T3: number;
  taxaCasado2T4: number;
  taxaCasado2T5mais: number;
}

/**
 * Tabela simplificada de retenção na fonte mensal 2026 (Continente).
 * Taxas em decimais. Cada linha representa um patamar de rendimento bruto mensal.
 * Dependentes: 0, 1, 2, 3, 4, 5+
 */
export const TABELA_RETENCAO_2026: TabelaRetencaoLinha[] = [
  {
    limiteMax: 870,
    taxaSolteiro0: 0.00, taxaSolteiro1: 0.00, taxaSolteiro2: 0.00,
    taxaSolteiro3: 0.00, taxaSolteiro4: 0.00, taxaSolteiro5mais: 0.00,
    taxaCasado1T0: 0.00, taxaCasado1T1: 0.00, taxaCasado1T2: 0.00,
    taxaCasado1T3: 0.00, taxaCasado1T4: 0.00, taxaCasado1T5mais: 0.00,
    taxaCasado2T0: 0.00, taxaCasado2T1: 0.00, taxaCasado2T2: 0.00,
    taxaCasado2T3: 0.00, taxaCasado2T4: 0.00, taxaCasado2T5mais: 0.00,
  },
  {
    limiteMax: 960,
    taxaSolteiro0: 0.042, taxaSolteiro1: 0.006, taxaSolteiro2: 0.00,
    taxaSolteiro3: 0.00, taxaSolteiro4: 0.00, taxaSolteiro5mais: 0.00,
    taxaCasado1T0: 0.00, taxaCasado1T1: 0.00, taxaCasado1T2: 0.00,
    taxaCasado1T3: 0.00, taxaCasado1T4: 0.00, taxaCasado1T5mais: 0.00,
    taxaCasado2T0: 0.00, taxaCasado2T1: 0.00, taxaCasado2T2: 0.00,
    taxaCasado2T3: 0.00, taxaCasado2T4: 0.00, taxaCasado2T5mais: 0.00,
  },
  {
    limiteMax: 1_010,
    taxaSolteiro0: 0.072, taxaSolteiro1: 0.040, taxaSolteiro2: 0.006,
    taxaSolteiro3: 0.00, taxaSolteiro4: 0.00, taxaSolteiro5mais: 0.00,
    taxaCasado1T0: 0.005, taxaCasado1T1: 0.00, taxaCasado1T2: 0.00,
    taxaCasado1T3: 0.00, taxaCasado1T4: 0.00, taxaCasado1T5mais: 0.00,
    taxaCasado2T0: 0.042, taxaCasado2T1: 0.006, taxaCasado2T2: 0.00,
    taxaCasado2T3: 0.00, taxaCasado2T4: 0.00, taxaCasado2T5mais: 0.00,
  },
  {
    limiteMax: 1_150,
    taxaSolteiro0: 0.098, taxaSolteiro1: 0.067, taxaSolteiro2: 0.040,
    taxaSolteiro3: 0.013, taxaSolteiro4: 0.00, taxaSolteiro5mais: 0.00,
    taxaCasado1T0: 0.038, taxaCasado1T1: 0.010, taxaCasado1T2: 0.00,
    taxaCasado1T3: 0.00, taxaCasado1T4: 0.00, taxaCasado1T5mais: 0.00,
    taxaCasado2T0: 0.072, taxaCasado2T1: 0.040, taxaCasado2T2: 0.006,
    taxaCasado2T3: 0.00, taxaCasado2T4: 0.00, taxaCasado2T5mais: 0.00,
  },
  {
    limiteMax: 1_350,
    taxaSolteiro0: 0.122, taxaSolteiro1: 0.091, taxaSolteiro2: 0.065,
    taxaSolteiro3: 0.038, taxaSolteiro4: 0.013, taxaSolteiro5mais: 0.00,
    taxaCasado1T0: 0.064, taxaCasado1T1: 0.036, taxaCasado1T2: 0.012,
    taxaCasado1T3: 0.00, taxaCasado1T4: 0.00, taxaCasado1T5mais: 0.00,
    taxaCasado2T0: 0.098, taxaCasado2T1: 0.067, taxaCasado2T2: 0.040,
    taxaCasado2T3: 0.013, taxaCasado2T4: 0.00, taxaCasado2T5mais: 0.00,
  },
  {
    limiteMax: 1_600,
    taxaSolteiro0: 0.147, taxaSolteiro1: 0.118, taxaSolteiro2: 0.093,
    taxaSolteiro3: 0.066, taxaSolteiro4: 0.041, taxaSolteiro5mais: 0.015,
    taxaCasado1T0: 0.091, taxaCasado1T1: 0.064, taxaCasado1T2: 0.039,
    taxaCasado1T3: 0.014, taxaCasado1T4: 0.00, taxaCasado1T5mais: 0.00,
    taxaCasado2T0: 0.122, taxaCasado2T1: 0.091, taxaCasado2T2: 0.065,
    taxaCasado2T3: 0.038, taxaCasado2T4: 0.013, taxaCasado2T5mais: 0.00,
  },
  {
    limiteMax: 1_850,
    taxaSolteiro0: 0.168, taxaSolteiro1: 0.139, taxaSolteiro2: 0.115,
    taxaSolteiro3: 0.089, taxaSolteiro4: 0.064, taxaSolteiro5mais: 0.040,
    taxaCasado1T0: 0.113, taxaCasado1T1: 0.087, taxaCasado1T2: 0.062,
    taxaCasado1T3: 0.038, taxaCasado1T4: 0.014, taxaCasado1T5mais: 0.00,
    taxaCasado2T0: 0.147, taxaCasado2T1: 0.118, taxaCasado2T2: 0.093,
    taxaCasado2T3: 0.066, taxaCasado2T4: 0.041, taxaCasado2T5mais: 0.015,
  },
  {
    limiteMax: 2_100,
    taxaSolteiro0: 0.189, taxaSolteiro1: 0.162, taxaSolteiro2: 0.139,
    taxaSolteiro3: 0.113, taxaSolteiro4: 0.090, taxaSolteiro5mais: 0.065,
    taxaCasado1T0: 0.136, taxaCasado1T1: 0.112, taxaCasado1T2: 0.087,
    taxaCasado1T3: 0.063, taxaCasado1T4: 0.040, taxaCasado1T5mais: 0.017,
    taxaCasado2T0: 0.168, taxaCasado2T1: 0.139, taxaCasado2T2: 0.115,
    taxaCasado2T3: 0.089, taxaCasado2T4: 0.064, taxaCasado2T5mais: 0.040,
  },
  {
    limiteMax: 2_500,
    taxaSolteiro0: 0.214, taxaSolteiro1: 0.189, taxaSolteiro2: 0.165,
    taxaSolteiro3: 0.140, taxaSolteiro4: 0.118, taxaSolteiro5mais: 0.093,
    taxaCasado1T0: 0.163, taxaCasado1T1: 0.140, taxaCasado1T2: 0.115,
    taxaCasado1T3: 0.092, taxaCasado1T4: 0.068, taxaCasado1T5mais: 0.046,
    taxaCasado2T0: 0.189, taxaCasado2T1: 0.162, taxaCasado2T2: 0.139,
    taxaCasado2T3: 0.113, taxaCasado2T4: 0.090, taxaCasado2T5mais: 0.065,
  },
  {
    limiteMax: 3_000,
    taxaSolteiro0: 0.243, taxaSolteiro1: 0.218, taxaSolteiro2: 0.195,
    taxaSolteiro3: 0.172, taxaSolteiro4: 0.149, taxaSolteiro5mais: 0.127,
    taxaCasado1T0: 0.193, taxaCasado1T1: 0.170, taxaCasado1T2: 0.147,
    taxaCasado1T3: 0.124, taxaCasado1T4: 0.102, taxaCasado1T5mais: 0.080,
    taxaCasado2T0: 0.214, taxaCasado2T1: 0.189, taxaCasado2T2: 0.165,
    taxaCasado2T3: 0.140, taxaCasado2T4: 0.118, taxaCasado2T5mais: 0.093,
  },
  {
    limiteMax: 3_700,
    taxaSolteiro0: 0.275, taxaSolteiro1: 0.252, taxaSolteiro2: 0.231,
    taxaSolteiro3: 0.208, taxaSolteiro4: 0.186, taxaSolteiro5mais: 0.165,
    taxaCasado1T0: 0.226, taxaCasado1T1: 0.205, taxaCasado1T2: 0.182,
    taxaCasado1T3: 0.160, taxaCasado1T4: 0.138, taxaCasado1T5mais: 0.117,
    taxaCasado2T0: 0.243, taxaCasado2T1: 0.218, taxaCasado2T2: 0.195,
    taxaCasado2T3: 0.172, taxaCasado2T4: 0.149, taxaCasado2T5mais: 0.127,
  },
  {
    limiteMax: 4_500,
    taxaSolteiro0: 0.305, taxaSolteiro1: 0.285, taxaSolteiro2: 0.264,
    taxaSolteiro3: 0.244, taxaSolteiro4: 0.223, taxaSolteiro5mais: 0.203,
    taxaCasado1T0: 0.261, taxaCasado1T1: 0.241, taxaCasado1T2: 0.220,
    taxaCasado1T3: 0.199, taxaCasado1T4: 0.178, taxaCasado1T5mais: 0.158,
    taxaCasado2T0: 0.275, taxaCasado2T1: 0.252, taxaCasado2T2: 0.231,
    taxaCasado2T3: 0.208, taxaCasado2T4: 0.186, taxaCasado2T5mais: 0.165,
  },
  {
    limiteMax: 5_500,
    taxaSolteiro0: 0.335, taxaSolteiro1: 0.317, taxaSolteiro2: 0.298,
    taxaSolteiro3: 0.278, taxaSolteiro4: 0.258, taxaSolteiro5mais: 0.240,
    taxaCasado1T0: 0.295, taxaCasado1T1: 0.276, taxaCasado1T2: 0.256,
    taxaCasado1T3: 0.237, taxaCasado1T4: 0.217, taxaCasado1T5mais: 0.198,
    taxaCasado2T0: 0.305, taxaCasado2T1: 0.285, taxaCasado2T2: 0.264,
    taxaCasado2T3: 0.244, taxaCasado2T4: 0.223, taxaCasado2T5mais: 0.203,
  },
  {
    limiteMax: 7_000,
    taxaSolteiro0: 0.370, taxaSolteiro1: 0.353, taxaSolteiro2: 0.335,
    taxaSolteiro3: 0.317, taxaSolteiro4: 0.298, taxaSolteiro5mais: 0.281,
    taxaCasado1T0: 0.330, taxaCasado1T1: 0.313, taxaCasado1T2: 0.294,
    taxaCasado1T3: 0.276, taxaCasado1T4: 0.258, taxaCasado1T5mais: 0.240,
    taxaCasado2T0: 0.335, taxaCasado2T1: 0.317, taxaCasado2T2: 0.298,
    taxaCasado2T3: 0.278, taxaCasado2T4: 0.258, taxaCasado2T5mais: 0.240,
  },
  {
    limiteMax: 9_500,
    taxaSolteiro0: 0.398, taxaSolteiro1: 0.382, taxaSolteiro2: 0.366,
    taxaSolteiro3: 0.349, taxaSolteiro4: 0.333, taxaSolteiro5mais: 0.317,
    taxaCasado1T0: 0.363, taxaCasado1T1: 0.346, taxaCasado1T2: 0.330,
    taxaCasado1T3: 0.314, taxaCasado1T4: 0.298, taxaCasado1T5mais: 0.282,
    taxaCasado2T0: 0.370, taxaCasado2T1: 0.353, taxaCasado2T2: 0.335,
    taxaCasado2T3: 0.317, taxaCasado2T4: 0.298, taxaCasado2T5mais: 0.281,
  },
  {
    limiteMax: 14_000,
    taxaSolteiro0: 0.415, taxaSolteiro1: 0.400, taxaSolteiro2: 0.385,
    taxaSolteiro3: 0.370, taxaSolteiro4: 0.355, taxaSolteiro5mais: 0.341,
    taxaCasado1T0: 0.390, taxaCasado1T1: 0.375, taxaCasado1T2: 0.360,
    taxaCasado1T3: 0.345, taxaCasado1T4: 0.330, taxaCasado1T5mais: 0.316,
    taxaCasado2T0: 0.398, taxaCasado2T1: 0.382, taxaCasado2T2: 0.366,
    taxaCasado2T3: 0.349, taxaCasado2T4: 0.333, taxaCasado2T5mais: 0.317,
  },
  {
    limiteMax: Infinity,
    taxaSolteiro0: 0.435, taxaSolteiro1: 0.420, taxaSolteiro2: 0.408,
    taxaSolteiro3: 0.394, taxaSolteiro4: 0.380, taxaSolteiro5mais: 0.368,
    taxaCasado1T0: 0.415, taxaCasado1T1: 0.400, taxaCasado1T2: 0.388,
    taxaCasado1T3: 0.374, taxaCasado1T4: 0.361, taxaCasado1T5mais: 0.348,
    taxaCasado2T0: 0.415, taxaCasado2T1: 0.400, taxaCasado2T2: 0.385,
    taxaCasado2T3: 0.370, taxaCasado2T4: 0.355, taxaCasado2T5mais: 0.341,
  },
];

/**
 * Obtém a taxa de retenção mensal para um dado salário bruto, estado civil e n.º de dependentes.
 */
export function getTaxaRetencao(
  salarioBrutoMensal: number,
  estadoCivil: EstadoCivil,
  dependentes: number
): number {
  const deps = Math.min(dependentes, 5);
  const linha = TABELA_RETENCAO_2026.find((l) => salarioBrutoMensal <= l.limiteMax);
  if (!linha) return 0;

  const prefix =
    estadoCivil === "solteiro"
      ? "taxaSolteiro"
      : estadoCivil === "casado1titular"
        ? "taxaCasado1T"
        : "taxaCasado2T";

  const suffix = deps >= 5 ? "5mais" : String(deps);
  const key = `${prefix}${suffix}` as keyof TabelaRetencaoLinha;
  return linha[key] as number;
}
