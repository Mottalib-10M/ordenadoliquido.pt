/**
 * Motor de cálculo salarial para Portugal, 2026
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
  DEDUCAO_POR_DEPENDENTE,
  MINIMO_EXISTENCIA_2026,
  getTaxaRetencao,
  retencaoMensal as retencaoTabela,
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
  /** Ano do regime IRS Jovem (1-10), 0 se não aplicável */
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
  maritalStatus: EstadoCivil,
  dependents: number
): number {
  if (annualTaxable <= 0) return 0;

  /* Casado, único titular : tributação conjunta com quociente conjugal (o rendimento coletável divide-se por dois,
     aplica-se a taxa e multiplica-se o imposto por dois). Nos outros casos, escalões individuais. */
  const quociente = maritalStatus === "casado1titular" ? 2 : 1;
  const base = annualTaxable / quociente;
  let imposto = 0;
  for (const escalao of ESCALOES_IRS_2026) {
    if (base <= escalao.limiteMax) {
      imposto = (base * escalao.taxa - escalao.parcelaAbater) * quociente;
      break;
    }
  }

  /* Deduções à coleta : despesas gerais familiares por sujeito passivo e dedução por dependente */
  const titulares = maritalStatus === "casado1titular" ? 2 : 1;
  imposto -= titulares * DEDUCAO_FAMILIAR_POR_PESSOA + dependents * DEDUCAO_POR_DEPENDENTE;

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
  return retencaoTabela(grossMonthly, maritalStatus, dependents);
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
  const titulares = maritalStatus === "casado1titular" ? 2 : 1;
  const deducaoFamiliar = titulares * DEDUCAO_FAMILIAR_POR_PESSOA + dependents * DEDUCAO_POR_DEPENDENTE;

  /* ── IRS anual ── */
  let irsAnnual = calculateIRS(taxableIncome, maritalStatus, dependents);
  /* Mínimo de existência : o imposto não pode deixar o rendimento abaixo de 12 880 € */
  irsAnnual = round2(Math.min(irsAnnual, Math.max(0, grossAnnual - MINIMO_EXISTENCIA_2026)));

  /* ── IRS Jovem : parte do rendimento fica isenta (até 55 × IAS) ; o imposto baixa na mesma proporção ── */
  let irsJovemDesconto = 0;
  const irsAnnualAntesJovem = irsAnnual;
  if (irsJovem >= 1 && irsJovem <= IRS_JOVEM_ESCALOES.length && grossAnnual > 0) {
    const escalao = IRS_JOVEM_ESCALOES[irsJovem - 1];
    const rendimentoIsento = Math.min(grossAnnual * escalao.isencaoPercentagem, escalao.limiteIsencao);
    irsJovemDesconto = round2(irsAnnual * (rendimentoIsento / grossAnnual));
    irsAnnual = round2(Math.max(0, irsAnnual - irsJovemDesconto));
  }

  const irsMonthly = round2(irsAnnual / MESES_VENCIMENTO);
  const taxRate = grossAnnual > 0 ? round2((irsAnnual / grossAnnual) * 100) / 100 : 0;

  /* ── Retenção na fonte mensal ── */
  // O IRS Jovem reduz a retenção MENSAL, e não apenas o acerto anual, desde que
  // o trabalhador comunique a situação ao empregador. Sem esta correção, a
  // página dedicada ao regime mostrava exatamente o mesmo líquido que a de um
  // solteiro sem benefício, o desconto existia no IRS anual mas nunca chegava
  // ao salário do mês.
  const retencaoTaxaTabela = getTaxaRetencao(grossMonthly, maritalStatus, dependents);
  const reducaoJovem =
    irsJovemDesconto > 0 && irsAnnualAntesJovem > 0
      ? irsJovemDesconto / irsAnnualAntesJovem
      : 0;
  const retencaoTaxa = round2(retencaoTaxaTabela * (1 - reducaoJovem) * 10000) / 10000;
  const retencaoMensal = round2(grossMonthly * retencaoTaxa);

  /* ── Subsídios de Natal e de férias : a retenção calcula-se em separado, com a mesma tabela (Despacho, n.º 10) ── */
  const subsidioNatalBruto = grossMonthly;
  const subsidioNatalLiquido = round2(subsidioNatalBruto - round2(subsidioNatalBruto * TSU_TRABALHADOR) - round2(subsidioNatalBruto * retencaoTaxa));
  const subsidioFeriasBruto = grossMonthly;
  const subsidioFeriasLiquido = round2(subsidioFeriasBruto - round2(subsidioFeriasBruto * TSU_TRABALHADOR) - round2(subsidioFeriasBruto * retencaoTaxa));

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
