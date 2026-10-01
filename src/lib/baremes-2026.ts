/**
 * Baremes fiscais para Portugal, Ano 2026
 * Fontes : Lei n.º 73-A/2025 (Orçamento do Estado para 2026) para os escalões de IRS ;
 * Despacho n.º 233-A/2026, de 6 de janeiro, para as tabelas de retenção na fonte (continente) ;
 * Decreto-Lei da RMMG 2026 (920 €) ; IAS 2026 = 537,13 €.
 * Até 2026-10-01 este ficheiro continha os escalões de 2024, o salário mínimo de 2025 e o IRS Jovem antigo.
 */

/* ──────────────────────────── Escalões de IRS 2026 ──────────────────────────── */

export interface EscalaoIRS {
  /** Limite superior do escalão (Infinity para o último) */
  limiteMax: number;
  /** Taxa marginal (ex: 0.125 = 12,5%) */
  taxa: number;
  /** Parcela a abater acumulada */
  parcelaAbater: number;
}

const ESCALOES_BASE: Array<[number, number]> = [
  [8_342, 0.125],
  [12_587, 0.157],
  [17_838, 0.212],
  [23_089, 0.241],
  [29_397, 0.311],
  [43_090, 0.349],
  [46_566, 0.431],
  [86_634, 0.446],
  [Infinity, 0.48],
];
/** A parcela a abater de cada escalão resulta dos limites e das taxas : não se escreve à mão. */
export const ESCALOES_IRS_2026: EscalaoIRS[] = ESCALOES_BASE.reduce<EscalaoIRS[]>((acc, [limiteMax, taxa], i) => {
  const ant = acc[i - 1];
  const parcelaAbater = i === 0 ? 0 : Math.round((ant.parcelaAbater + ant.limiteMax * (taxa - ant.taxa)) * 100) / 100;
  acc.push({ limiteMax, taxa, parcelaAbater });
  return acc;
}, []);

/* ────────────────────────── Segurança Social (TSU) ─────────────────────────── */

/** Taxa contributiva do trabalhador (regime geral) */
export const TSU_TRABALHADOR = 0.11;

/** Taxa contributiva da entidade empregadora (regime geral) */
export const TSU_EMPREGADOR = 0.2375;

/* ──────────────────────────── Deduções e valores ────────────────────────────── */

/** Indexante dos Apoios Sociais 2026 */
export const IAS_2026 = 537.13;

/** Dedução específica (rendimentos categoria A) : 8,54 × IAS */
export const DEDUCAO_ESPECIFICA = Math.round(8.54 * IAS_2026 * 100) / 100;

/** Dedução das despesas gerais familiares, por sujeito passivo (limite) */
export const DEDUCAO_FAMILIAR_POR_PESSOA = 250;

/** Dedução por dependente */
export const DEDUCAO_POR_DEPENDENTE = 600;

/** Salário mínimo nacional mensal em 2026 */
export const SALARIO_MINIMO_2026 = 920;

/** Mínimo de existência 2026 : o rendimento depois de IRS não pode ficar abaixo deste valor */
export const MINIMO_EXISTENCIA_2026 = 12_880;

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
 * IRS Jovem (regime em vigor desde 2025, art. 12.º-B do CIRS) : até aos 35 anos, durante 10 anos.
 * Isenção de 100 % no 1.º ano, 75 % do 2.º ao 4.º, 50 % do 5.º ao 7.º e 25 % do 8.º ao 10.º,
 * sobre o rendimento, até 55 × IAS por ano.
 */
export const IRS_JOVEM_LIMITE = Math.round(55 * IAS_2026 * 100) / 100;
export const IRS_JOVEM_ESCALOES: IrsJovemEscalao[] = [1, 0.75, 0.75, 0.75, 0.5, 0.5, 0.5, 0.25, 0.25, 0.25].map((p, i) => ({ ano: i + 1, isencaoPercentagem: p, limiteIsencao: IRS_JOVEM_LIMITE }));

/* ──────── Tabelas de Retenção na Fonte 2026, continente (Despacho n.º 233-A/2026) ──────── */

export type EstadoCivil = "solteiro" | "casado1titular" | "casado2titulares";

/** Linha de uma tabela de retenção : limite, taxa marginal máxima e parcela a abater (valor fixo ou fórmula em R). */
export interface LinhaRetencao { limiteMax: number; taxa: number; parcela: number | { fator: number; ref: number } }

/** Tabelas I e II : mesmas linhas ; só muda a parcela adicional por dependente. */
export const TABELA_RETENCAO_I: LinhaRetencao[] = [
  { limiteMax: 920, taxa: 0, parcela: 0 },
  { limiteMax: 1_042, taxa: 0.125, parcela: { fator: 2.6, ref: 1_273.85 } },
  { limiteMax: 1_108, taxa: 0.157, parcela: { fator: 1.35, ref: 1_554.83 } },
  { limiteMax: 1_154, taxa: 0.157, parcela: 94.71 },
  { limiteMax: 1_212, taxa: 0.212, parcela: 158.18 },
  { limiteMax: 1_819, taxa: 0.241, parcela: 193.33 },
  { limiteMax: 2_119, taxa: 0.311, parcela: 320.66 },
  { limiteMax: 2_499, taxa: 0.349, parcela: 401.19 },
  { limiteMax: 3_305, taxa: 0.3836, parcela: 487.66 },
  { limiteMax: 5_547, taxa: 0.3969, parcela: 531.62 },
  { limiteMax: 20_221, taxa: 0.4495, parcela: 823.4 },
  { limiteMax: Infinity, taxa: 0.4717, parcela: 1_272.31 },
];
/** Tabela III : casado, único titular. */
export const TABELA_RETENCAO_III: LinhaRetencao[] = [
  { limiteMax: 991, taxa: 0, parcela: 0 },
  { limiteMax: 1_042, taxa: 0.125, parcela: { fator: 2.6, ref: 1_372.15 } },
  { limiteMax: 1_108, taxa: 0.125, parcela: { fator: 1.35, ref: 1_677.85 } },
  { limiteMax: 1_119, taxa: 0.125, parcela: 96.17 },
  { limiteMax: 1_432, taxa: 0.1272, parcela: 98.64 },
  { limiteMax: 1_962, taxa: 0.157, parcela: 141.32 },
  { limiteMax: 2_240, taxa: 0.1938, parcela: 213.53 },
  { limiteMax: 2_773, taxa: 0.2277, parcela: 289.47 },
  { limiteMax: 3_389, taxa: 0.257, parcela: 370.72 },
  { limiteMax: 5_965, taxa: 0.2881, parcela: 476.12 },
  { limiteMax: 20_265, taxa: 0.3843, parcela: 1_049.96 },
  { limiteMax: Infinity, taxa: 0.4717, parcela: 2_821.13 },
];
/** Parcela adicional a abater por dependente : Tabela I (casado, dois titulares), II (não casado), III (casado, único titular). */
export const PARCELA_DEPENDENTE: Record<EstadoCivil, number> = { casado2titulares: 21.43, solteiro: 34.29, casado1titular: 42.86 };

/**
 * Retenção mensal em euros : R × taxa marginal máxima − parcela a abater − parcela por dependente × n.º de dependentes.
 * Com três ou mais dependentes, a taxa marginal máxima baixa um ponto percentual. Nunca inferior a zero.
 */
export function retencaoMensal(salarioBrutoMensal: number, estadoCivil: EstadoCivil, dependentes: number): number {
  const R = Math.max(0, salarioBrutoMensal); const n = Math.max(0, Math.floor(dependentes));
  const tabela = estadoCivil === "casado1titular" ? TABELA_RETENCAO_III : TABELA_RETENCAO_I;
  const linha = tabela.find((l) => R <= l.limiteMax)!;
  if (linha.taxa === 0) return 0;
  const taxa = n >= 3 ? linha.taxa - 0.01 : linha.taxa;
  const parcela = typeof linha.parcela === "number" ? linha.parcela : linha.taxa * linha.parcela.fator * (linha.parcela.ref - R);
  const valor = R * taxa - parcela - PARCELA_DEPENDENTE[estadoCivil] * n;
  return Math.max(0, Math.floor(valor * 100) / 100);
}

/**
 * Taxa efetiva de retenção mensal (retenção ÷ remuneração), para um dado salário bruto, estado civil e n.º de dependentes.
 */
export function getTaxaRetencao(
  salarioBrutoMensal: number,
  estadoCivil: EstadoCivil,
  dependentes: number
): number {
  return salarioBrutoMensal > 0 ? retencaoMensal(salarioBrutoMensal, estadoCivil, dependentes) / salarioBrutoMensal : 0;
}
