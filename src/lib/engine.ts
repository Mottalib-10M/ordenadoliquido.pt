/**
 * Motor de cálculo salarial para Portugal — 2026
 * Calcula salário líquido a partir do bruto, incluindo TSU, IRS,
 * retenção na fonte, subsídio de Natal e subsídio de férias.
 */

import {
  ESCALOES_IRS_2026,
  TSU_TRABALHADOR,
  TSU_EMPREGADOR,
  DEDUCAO_ESPECIFICA,
  DEDUCAO_FAMILIAR_POR_PESSOA,
  SALARIO_MINIMO_2026,
  MESES_ANO,
  MESES_VENCIMENTO,
  IRS_JOVEM_ESCALOES,
  getTaxaRetencao,
  type EstadoCivil,
} from "./baremes-2026";

/* ═══════════════════════════════ Types ═══════════════════════════════ */

export interface SalaryInput {
  /** Salário bruto mensal (14 meses) */
  grossMonthly: number;
  /** Estado civil */
  maritalStatus: EstadoCivil;
  /** Número de dependentes */
  dependents: number;
  /** Ano do regime IRS Jovem (1-5), 0 se não aplicável */
  irsJovem: number;
}

export interface SalaryResult {
  /* ── Rendimento bruto ── */
  grossMonthly: number;
  grossAnnual: number;

  /* ── TSU ── */
  tsuEmployee: number;
  tsuEmployer: number;
  tsuEmployeeAnnual: number;
  tsuEmployerAnnual: number;

  /* ── IRS ── */
  taxableIncome: number;
  irsAnnual: number;
  irsMonthly: number;
  taxRate: number;

  /* ── Retenção na fonte (mensal) ── */
  retencaoMensal: number;
  retencaoTaxa: number;

  /* ── Subsídios ── */
  subsidioNatalBruto: number;
  subsidioNatalLiquido: number;
  subsidioFeriasBruto: number;
  subsidioFeriasLiquido: number;

  /* ── Líquido ── */
  netMonthly: number;
  netAnnual: number;

  /* ── IRS Jovem ── */
  irsJovemDesconto: number;

  /* ── Custo total empregador ── */
  custoEmpregadorMensal: number;
  custoEmpregadorAnual: number;

  /* ── Deduções ── */
  deducaoEspecifica: number;
  deducaoFamiliar: number;
}

/* ═════════════════════════════ Helpers ═════════════════════════════ */

/** Arredonda para 2 casas decimais */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* ═══════════════════════════ Public API ══════════════════════════════ */

/**
 * Calcula a contribuição mensal para a Segurança Social (TSU).
 */
export function calculateTSU(grossMonthly: number): {
  employee: number;
  employer: number;
} {
  return {
    employee: round2(grossMonthly * TSU_TRABALHADOR),
    employer: round2(grossMonthly * TSU_EMPREGADOR),
  };
}

/**
 * Calcula o IRS anual com base no rendimento coletável,
 * usando os escalões progressivos de 2026.
 */
export function calculateIRS(
  annualTaxable: number,
  _maritalStatus: EstadoCivil,
  dependents: number
): number {
  if (annualTaxable <= 0) return 0;

  /* Tributação separada (cada cônjuge declara metade em casado2titulares,
     mas para simplificação usamos escalões individuais) */
  let imposto = 0;
  for (const escalao of ESCALOES_IRS_2026) {
    if (annualTaxable <= escalao.limiteMax) {
      imposto = annualTaxable * escalao.taxa - escalao.parcelaAbater;
      break;
    }
  }

  /* Deduções familiares */
  const deducaoFamiliar = dependents * DEDUCAO_FAMILIAR_POR_PESSOA;
  imposto -= deducaoFamiliar;

  return round2(Math.max(0, imposto));
}

/**
 * Calcula a retenção mensal na fonte.
 */
export function calculateRetencao(
  grossMonthly: number,
  maritalStatus: EstadoCivil,
  dependents: number
): number {
  const taxa = getTaxaRetencao(grossMonthly, maritalStatus, dependents);
  return round2(grossMonthly * taxa);
}

/**
 * Cálculo completo: do salário bruto ao líquido.
 */
export function calculateSalary(input: SalaryInput): SalaryResult {
  const { grossMonthly, maritalStatus, dependents, irsJovem } = input;

  /* ── Rendimento bruto anual (14 meses) ── */
  const grossAnnual = round2(grossMonthly * MESES_ANO);

  /* ── TSU mensal e anual ── */
  const tsu = calculateTSU(grossMonthly);
  const tsuEmployeeAnnual = round2(tsu.employee * MESES_ANO);
  const tsuEmployerAnnual = round2(tsu.employer * MESES_ANO);

  /* ── Rendimento coletável ── */
  const rendimentoBrutoAnual = grossAnnual;
  const deducaoEspecifica = DEDUCAO_ESPECIFICA;
  const contribuicoesSS = tsuEmployeeAnnual;
  const deducaoReal = Math.max(deducaoEspecifica, contribuicoesSS);
  const taxableIncome = round2(Math.max(0, rendimentoBrutoAnual - deducaoReal));

  /* ── Dedução familiar ── */
  const titulares = maritalStatus === "solteiro" ? 1 : 2;
  const deducaoFamiliar = (titulares + dependents) * DEDUCAO_FAMILIAR_POR_PESSOA;

  /* ── IRS anual ── */
  let irsAnnual = calculateIRS(taxableIncome, maritalStatus, dependents);

  /* ── IRS Jovem ── */
  let irsJovemDesconto = 0;
  const irsAnnualAntesJovem = irsAnnual;
  if (irsJovem >= 1 && irsJovem <= 5) {
    const escalao = IRS_JOVEM_ESCALOES[irsJovem - 1];
    const isencao = round2(irsAnnual * escalao.isencaoPercentagem);
    irsJovemDesconto = round2(Math.min(isencao, escalao.limiteIsencao));
    irsAnnual = round2(Math.max(0, irsAnnual - irsJovemDesconto));
  }

  const irsMonthly = round2(irsAnnual / MESES_VENCIMENTO);
  const taxRate = grossAnnual > 0 ? round2((irsAnnual / grossAnnual) * 100) / 100 : 0;

  /* ── Retenção na fonte mensal ── */
  // O IRS Jovem reduz a retenção MENSAL, e não apenas o acerto anual, desde que
  // o trabalhador comunique a situação ao empregador. Sem esta correção, a
  // página dedicada ao regime mostrava exatamente o mesmo líquido que a de um
  // solteiro sem benefício — o desconto existia no IRS anual mas nunca chegava
  // ao salário do mês.
  const retencaoTaxaTabela = getTaxaRetencao(grossMonthly, maritalStatus, dependents);
  const reducaoJovem =
    irsJovemDesconto > 0 && irsAnnualAntesJovem > 0
      ? irsJovemDesconto / irsAnnualAntesJovem
      : 0;
  const retencaoTaxa = round2(retencaoTaxaTabela * (1 - reducaoJovem) * 10000) / 10000;
  const retencaoMensal = round2(grossMonthly * retencaoTaxa);

  /* ── Subsídio de Natal (13.º mês) — taxado à taxa média ── */
  const subsidioNatalBruto = grossMonthly;
  const tsuSubNatal = round2(subsidioNatalBruto * TSU_TRABALHADOR);
  const taxaMedia = grossAnnual > 0 ? irsAnnual / (grossAnnual - tsuEmployeeAnnual) : 0;
  const irsSubNatal = round2(subsidioNatalBruto * taxaMedia);
  const subsidioNatalLiquido = round2(subsidioNatalBruto - tsuSubNatal - irsSubNatal);

  /* ── Subsídio de Férias (14.º mês) — taxado à taxa de retenção normal ── */
  const subsidioFeriasBruto = grossMonthly;
  const tsuSubFerias = round2(subsidioFeriasBruto * TSU_TRABALHADOR);
  const irsSubFerias = round2(subsidioFeriasBruto * retencaoTaxa);
  const subsidioFeriasLiquido = round2(subsidioFeriasBruto - tsuSubFerias - irsSubFerias);

  /* ── Salário líquido mensal (nos 12 meses normais) ── */
  const netMonthly = round2(grossMonthly - tsu.employee - retencaoMensal);

  /* ── Salário líquido anual ── */
  const netAnnual = round2(
    netMonthly * MESES_VENCIMENTO + subsidioNatalLiquido + subsidioFeriasLiquido
  );

  /* ── Custo total para o empregador ── */
  const custoEmpregadorMensal = round2(grossMonthly + tsu.employer);
  const custoEmpregadorAnual = round2(custoEmpregadorMensal * MESES_ANO);

  return {
    grossMonthly,
    grossAnnual,
    tsuEmployee: tsu.employee,
    tsuEmployer: tsu.employer,
    tsuEmployeeAnnual,
    tsuEmployerAnnual,
    taxableIncome,
    irsAnnual,
    irsMonthly,
    taxRate,
    retencaoMensal,
    retencaoTaxa,
    subsidioNatalBruto,
    subsidioNatalLiquido,
    subsidioFeriasBruto,
    subsidioFeriasLiquido,
    netMonthly,
    netAnnual,
    irsJovemDesconto,
    custoEmpregadorMensal,
    custoEmpregadorAnual,
    deducaoEspecifica,
    deducaoFamiliar,
  };
}
