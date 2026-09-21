/**
 * salary-content.ts
 * Helpers that produce UNIQUE, calculated content for each salary page.
 * All strings use Unicode escapes (\u00e3 for a-tilde, \u00e7 for c-cedilla, etc.)
 * so the .ts compiler never chokes on encoding.
 *
 * Key technique: variationIndex = Math.floor(amount / 1000) % N
 * selects different sentence structures per salary amount.
 */

import { ESCALOES_IRS_2026, DEDUCAO_ESPECIFICA, IRS_JOVEM_ESCALOES, IAS_2026 } from "./baremes-2026";
import { SALARIOS, type SalarioEntry } from "./salarios-data";

/* ================================================================== */
/*  Tiny formatters                                                    */
/* ================================================================== */

function eur(v: number): string {
  return v.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\u00a0\u20ac";
}

function pct(v: number): string {
  return (v * 100).toFixed(1) + "%";
}

function pctRaw(v: number): string {
  return (v * 100).toFixed(1);
}

/* ================================================================== */
/*  Derived numbers every helper can reuse                             */
/* ================================================================== */

export interface DerivedNumbers {
  brutoAnual: number;
  tsuAnual: number;
  rendimentoColetavel: number;
  descontosTotaisMensal: number;
  descontosTotaisAnual: number;
  taxaDescontoTotal: number;
  liquidoDiario: number;
  liquidoSemanal: number;
  liquidoHora: number;
  custoEmpregadorAnual: number;
  tsuPatronal: number;
  tsuPatronalAnual: number;
  escalaoIndex: number;
  escalaoTaxa: number;
  escalaoLimite: number;
  taxaEfetiva: number;
  ratioLiquidoBruto: number;
  diferencaBrutoLiquido: number;
  subNatalLiquido: number;
  subFeriasLiquido: number;
}

export function derivedNumbers(s: SalarioEntry): DerivedNumbers {
  const brutoAnual = s.brutoMensal * 14;
  const tsuAnual = s.tsuTrabalhador * 14;
  const rendimentoColetavel = Math.max(0, brutoAnual - Math.max(DEDUCAO_ESPECIFICA, tsuAnual));
  const descontosTotaisMensal = s.tsuTrabalhador + s.retencaoMensal;
  const descontosTotaisAnual = tsuAnual + s.irsAnual;
  const taxaDescontoTotal = descontosTotaisMensal / s.brutoMensal;
  const liquidoDiario = s.liquidoMensal / 22;
  const liquidoSemanal = s.liquidoMensal / 4.33;
  const liquidoHora = s.liquidoMensal / (22 * 8);
  const tsuPatronal = s.custoEmpregadorMensal - s.brutoMensal;
  const custoEmpregadorAnual = s.custoEmpregadorMensal * 14;
  const tsuPatronalAnual = tsuPatronal * 14;

  // find escalao
  let escalaoIndex = 0;
  let escalaoTaxa = 0;
  let escalaoLimite = 0;
  for (let i = 0; i < ESCALOES_IRS_2026.length; i++) {
    if (rendimentoColetavel <= ESCALOES_IRS_2026[i].limiteMax) {
      escalaoIndex = i + 1;
      escalaoTaxa = ESCALOES_IRS_2026[i].taxa;
      escalaoLimite = ESCALOES_IRS_2026[i].limiteMax;
      break;
    }
  }

  const taxaEfetiva = brutoAnual > 0 ? s.irsAnual / brutoAnual : 0;
  const ratioLiquidoBruto = s.liquidoMensal / s.brutoMensal;
  const diferencaBrutoLiquido = s.brutoMensal - s.liquidoMensal;

  // Approximate sub liquidos
  const subTsu = s.brutoMensal * 0.11;
  const taxaMedia = brutoAnual > 0 ? s.irsAnual / (brutoAnual - tsuAnual) : 0;
  const subNatalLiquido = s.brutoMensal - subTsu - (s.brutoMensal * taxaMedia);
  const subFeriasLiquido = s.brutoMensal - subTsu - (s.brutoMensal * s.retencaoTaxa);

  return {
    brutoAnual, tsuAnual, rendimentoColetavel, descontosTotaisMensal,
    descontosTotaisAnual, taxaDescontoTotal, liquidoDiario, liquidoSemanal,
    liquidoHora, custoEmpregadorAnual, tsuPatronal, tsuPatronalAnual,
    escalaoIndex, escalaoTaxa, escalaoLimite, taxaEfetiva,
    ratioLiquidoBruto, diferencaBrutoLiquido, subNatalLiquido, subFeriasLiquido,
  };
}

/* ================================================================== */
/*  Helper: get adjacent salaries                                      */
/* ================================================================== */

function getAdjacentSalaries(slug: string): { prev: SalarioEntry | null; next: SalarioEntry | null } {
  const idx = SALARIOS.findIndex((s) => s.slug === slug);
  return {
    prev: idx > 0 ? SALARIOS[idx - 1] : null,
    next: idx < SALARIOS.length - 1 ? SALARIOS[idx + 1] : null,
  };
}

/* ================================================================== */
/*  PORTUGUESE MEDIAN for comparisons                                  */
/* ================================================================== */

const MEDIANA_BRUTA_PT = 1100; // INE 2025 estimate
const MEDIA_BRUTA_PT = 1450;  // Pordata 2025 estimate
const SMN_2026 = 870;

/* ================================================================== */
/*  5bis. Unique Comparisons helper                                    */
/* ================================================================== */

export interface UniqueComparison {
  texto: string;
}

export function getUniqueComparisons(s: SalarioEntry, d: DerivedNumbers): UniqueComparison[] {
  const comparisons: UniqueComparison[] = [];
  const { prev, next } = getAdjacentSalaries(s.slug);
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 5;

  // Comparison to minimum wage (870 EUR)
  const ratioSMN = s.brutoMensal / SMN_2026;
  const dailyNet = d.liquidoDiario;
  const diffToMedian = s.brutoMensal - MEDIANA_BRUTA_PT;
  const pctAboveMedian = diffToMedian / MEDIANA_BRUTA_PT;

  // Variation 0: Focus on daily/hourly breakdown
  // Variation 1: Focus on median comparison
  // Variation 2: Focus on percentage retained
  // Variation 3: Focus on annual perspective
  // Variation 4: Focus on employer cost ratio
  const introVariations = [
    `Com ${eur(s.brutoMensal)} brutos, o seu rendimento di\u00e1rio l\u00edquido \u00e9 de ${eur(dailyNet)} (${eur(d.liquidoHora)}/hora), totalizando ${eur(d.liquidoSemanal)} por semana. Este sal\u00e1rio equivale a ${ratioSMN.toFixed(2)}x o sal\u00e1rio m\u00ednimo nacional de ${eur(SMN_2026)}.`,
    `O sal\u00e1rio de ${eur(s.brutoMensal)} brutos situa-se ${diffToMedian > 0 ? `${eur(diffToMedian)} acima` : `${eur(Math.abs(diffToMedian))} abaixo`} da mediana salarial portuguesa (${eur(MEDIANA_BRUTA_PT)}), representando ${diffToMedian > 0 ? "+" : ""}${pctRaw(pctAboveMedian)}% face a esse referencial. Ap\u00f3s impostos, ganha ${eur(dailyNet)} por dia \u00fatil.`,
    `De cada euro bruto que recebe (${eur(s.brutoMensal)}/m\u00eas), ficam-lhe ${eur(d.ratioLiquidoBruto)} l\u00edquidos \u2014 ou seja, ret\u00e9m ${pct(d.ratioLiquidoBruto)} do bruto. Isto traduz-se em ${eur(d.liquidoHora)} por hora trabalhada e ${eur(dailyNet)} por dia \u00fatil (22 dias/m\u00eas).`,
    `Numa perspetiva anual, os seus ${eur(s.brutoMensal)} brutos mensais geram ${eur(s.liquidoAnual)} l\u00edquidos em 14 meses. Por dia \u00fatil (252 dias/ano), o rendimento l\u00edquido \u00e9 de ${eur(s.liquidoAnual / 252)}, e por hora efetiva de trabalho (2.016 horas/ano), ${eur(s.liquidoAnual / 2016)}.`,
    `O empregador despende ${eur(s.custoEmpregadorMensal)} para que receba ${eur(s.liquidoMensal)} l\u00edquidos \u2014 uma diferen\u00e7a de ${eur(s.custoEmpregadorMensal - s.liquidoMensal)} absorvida por impostos e contribui\u00e7\u00f5es. O seu sal\u00e1rio de ${eur(s.brutoMensal)} corresponde a ${ratioSMN.toFixed(2)}x o m\u00ednimo nacional.`,
  ];
  comparisons.push({ texto: introVariations[variationIndex] });

  // Comparison to previous salary
  if (prev) {
    const prevD = derivedNumbers(prev);
    const diffLiquido = s.liquidoMensal - prev.liquidoMensal;
    const diffBruto = s.brutoMensal - prev.brutoMensal;
    const taxaMarginalEfetiva = 1 - (diffLiquido / diffBruto);
    const diffAnualLiq = s.liquidoAnual - prev.liquidoAnual;
    const diffHora = d.liquidoHora - prevD.liquidoHora;

    const prevVariations = [
      `Relativamente a ${eur(prev.brutoMensal)} brutos, ganhar ${eur(s.brutoMensal)} acrescenta ${eur(diffLiquido)} l\u00edquidos mensais (${eur(diffAnualLiq)} anuais). A taxa marginal efetiva sobre o incremento de ${eur(diffBruto)} \u00e9 de ${pct(taxaMarginalEfetiva)}, pois a reten\u00e7\u00e3o sobe de ${pct(prev.retencaoTaxa)} para ${pct(s.retencaoTaxa)}.`,
      `A transi\u00e7\u00e3o de ${eur(prev.brutoMensal)} para ${eur(s.brutoMensal)} brutos gera mais ${eur(diffHora)}/hora l\u00edquida (de ${eur(prevD.liquidoHora)} para ${eur(d.liquidoHora)}). Mensalmente, o ganho \u00e9 de ${eur(diffLiquido)}, mas ${pct(taxaMarginalEfetiva)} do aumento bruto de ${eur(diffBruto)} fica retido em impostos.`,
      `O aumento de ${eur(prev.brutoMensal)} para ${eur(s.brutoMensal)} brutos (+${eur(diffBruto)}) traduz-se em +${eur(diffLiquido)} l\u00edquidos/m\u00eas. A efici\u00eancia marginal \u00e9 de ${pct(1 - taxaMarginalEfetiva)}: por cada euro de aumento, ${eur(1 - taxaMarginalEfetiva)} chega \u00e0 conta e ${eur(taxaMarginalEfetiva)} vai para o Estado.`,
    ];
    comparisons.push({ texto: prevVariations[variationIndex % 3] });
  }

  // Comparison to next salary (promotion scenario)
  if (next) {
    const nextD = derivedNumbers(next);
    const diffLiquido = next.liquidoMensal - s.liquidoMensal;
    const diffBruto = next.brutoMensal - s.brutoMensal;
    const diffAnual = next.liquidoAnual - s.liquidoAnual;
    const diffDiario = nextD.liquidoDiario - d.liquidoDiario;

    const nextVariations = [
      `Uma promo\u00e7\u00e3o de ${eur(s.brutoMensal)} para ${eur(next.brutoMensal)} aumentaria o l\u00edquido mensal em ${eur(diffLiquido)} (de ${eur(s.liquidoMensal)} para ${eur(next.liquidoMensal)}). Anualmente, incluindo subs\u00eddios, o ganho seria de ${eur(diffAnual)} l\u00edquidos adicionais.`,
      `Se evoluir para ${eur(next.brutoMensal)} brutos, o seu dia de trabalho passaria a valer ${eur(nextD.liquidoDiario)} l\u00edquidos (+${eur(diffDiario)}/dia). O ganho mensal de ${eur(diffLiquido)} acumula ${eur(diffAnual)} anuais extras (14 meses).`,
      `A diferen\u00e7a entre ${eur(s.brutoMensal)} e ${eur(next.brutoMensal)} brutos \u00e9 de ${eur(diffBruto)}, que geram +${eur(diffLiquido)} l\u00edquidos/m\u00eas. Em termos hor\u00e1rios, passaria de ${eur(d.liquidoHora)} para ${eur(nextD.liquidoHora)} l\u00edquidos por hora trabalhada.`,
    ];
    comparisons.push({ texto: nextVariations[variationIndex % 3] });
  }

  // Annual savings potential at this income level
  const savingsRate = s.brutoMensal <= 1200 ? 0.05 : s.brutoMensal <= 2000 ? 0.10 : s.brutoMensal <= 3500 ? 0.15 : 0.20;
  const monthlySavings = s.liquidoMensal * savingsRate;
  const annualSavings = monthlySavings * 14;
  const fiveYearSavings = annualSavings * 5 * 1.03;
  const tenYearSavings = annualSavings * 10 * 1.05;
  const emergencyMonths = 6;
  const emergencyFund = s.liquidoMensal * emergencyMonths;
  const monthsToEmergency = Math.ceil(emergencyFund / monthlySavings);

  const savingsVariations = [
    `Com o seu l\u00edquido de ${eur(s.liquidoMensal)}, poupando ${pctRaw(savingsRate)}% (${eur(monthlySavings)}/m\u00eas), acumularia ${eur(annualSavings)} por ano. Em 5 anos, com retorno m\u00e9dio de 3%, teria aproximadamente ${eur(fiveYearSavings)} de patrim\u00f3nio financeiro.`,
    `Para construir um fundo de emerg\u00eancia de ${emergencyMonths} meses (${eur(emergencyFund)}), poupando ${eur(monthlySavings)}/m\u00eas (${pctRaw(savingsRate)}% do l\u00edquido de ${eur(s.liquidoMensal)}), necessitaria de ${monthsToEmergency} meses. Em 10 anos, o patrim\u00f3nio cresceria para ${eur(tenYearSavings)}.`,
    `A taxa de poupan\u00e7a recomendada para ${eur(s.liquidoMensal)} l\u00edquidos \u00e9 de ${pctRaw(savingsRate)}% (${eur(monthlySavings)}/m\u00eas, ${eur(annualSavings)}/ano). Isto deixa ${eur(s.liquidoMensal - monthlySavings)} para despesas mensais e gera ${eur(fiveYearSavings)} em 5 anos a 3% de retorno.`,
  ];
  comparisons.push({ texto: savingsVariations[variationIndex % 3] });

  // Cost per euro for employer
  const custoPorEuroLiquido = s.custoEmpregadorMensal / s.liquidoMensal;
  const percentRetidoEstado = (d.descontosTotaisMensal + d.tsuPatronal) / s.custoEmpregadorMensal;
  const custoAnualTotal = d.custoEmpregadorAnual;
  const liquidoAnualTotal = s.liquidoAnual;
  const wedgeAnual = custoAnualTotal - liquidoAnualTotal;

  const employerVariations = [
    `Para o empregador pagar ${eur(s.liquidoMensal)} l\u00edquidos, despende ${eur(s.custoEmpregadorMensal)} (custo total com TSU patronal). Por cada euro na sua conta, o empregador gasta ${custoPorEuroLiquido.toFixed(2)}\u00a0\u20ac. O Estado retira ${pct(percentRetidoEstado)} do custo total em impostos e contribui\u00e7\u00f5es.`,
    `A "cunha fiscal" sobre o seu sal\u00e1rio de ${eur(s.brutoMensal)} \u00e9 de ${eur(wedgeAnual)} por ano \u2014 a diferen\u00e7a entre o custo do empregador (${eur(custoAnualTotal)}/ano) e o que recebe (${eur(liquidoAnualTotal)}/ano). O r\u00e1cio custo/l\u00edquido \u00e9 de ${custoPorEuroLiquido.toFixed(2)}:1.`,
    `O custo total anual para manter o seu posto de trabalho \u00e9 de ${eur(custoAnualTotal)} (14 meses a ${eur(s.custoEmpregadorMensal)}). Deste montante, ${eur(liquidoAnualTotal)} chegam-lhe (${pct(liquidoAnualTotal / custoAnualTotal)}) e ${eur(wedgeAnual)} v\u00e3o para o Estado (${pct(wedgeAnual / custoAnualTotal)}).`,
  ];
  comparisons.push({ texto: employerVariations[variationIndex % 3] });

  return comparisons;
}

/* ================================================================== */
/*  1. Band context - unique paragraph per salary level                */
/* ================================================================== */

interface BandInfo {
  bandLabel: string;
  careerExamples: string;
  marketContext: string;
  lifeContext: string;
  negociationTip: string;
}

const BAND_MAP: Record<string, BandInfo> = {
  "820": {
    bandLabel: "abaixo do sal\u00e1rio m\u00ednimo",
    careerExamples: "est\u00e1gios profissionais, contratos a tempo parcial e trabalhadores sazonais na restaura\u00e7\u00e3o, agricultura ou turismo",
    marketContext: "Este valor situa-se abaixo do sal\u00e1rio m\u00ednimo nacional de 870\u00a0\u20ac em 2026, sendo aplic\u00e1vel essencialmente a trabalhadores a tempo parcial ou a est\u00e1gios IEFP. Segundo dados do INE, cerca de 12% dos contratos em Portugal s\u00e3o a tempo parcial",
    lifeContext: "Com um sal\u00e1rio l\u00edquido nesta faixa, a gest\u00e3o or\u00e7amental torna-se priorit\u00e1ria. \u00c9 fundamental aproveitar todos os apoios sociais dispon\u00edveis, como o complemento solid\u00e1rio para idosos, abono de fam\u00edlia e tarifas sociais de energia e \u00e1gua",
    negociationTip: "Considere negociar a convers\u00e3o para contrato a tempo inteiro ao sal\u00e1rio m\u00ednimo de 870\u00a0\u20ac, o que garantiria cobertura total da Seguran\u00e7a Social e acesso a todas as presta\u00e7\u00f5es sociais"
  },
  "1000": {
    bandLabel: "pr\u00f3ximo do sal\u00e1rio m\u00ednimo",
    careerExamples: "assistentes administrativos, operadores de loja, t\u00e9cnicos de apoio ao cliente, rececionistas e auxiliares de educa\u00e7\u00e3o",
    marketContext: "Um sal\u00e1rio de 1.000\u00a0\u20ac brutos representa cerca de 1,15 vezes o sal\u00e1rio m\u00ednimo nacional. Segundo o Relat\u00f3rio \u00danico do Minist\u00e9rio do Trabalho, este \u00e9 o patamar salarial mais comum em Portugal, abrangendo quase 30% dos trabalhadores do setor privado",
    lifeContext: "Este n\u00edvel salarial permite cobrir despesas b\u00e1sicas, embora com margens apertadas nas grandes cidades como Lisboa e Porto, onde o custo da habita\u00e7\u00e3o pode absorver mais de 40% do rendimento l\u00edquido",
    negociationTip: "Pode beneficiar do subs\u00eddio de alimenta\u00e7\u00e3o em cart\u00e3o refei\u00e7\u00e3o (isento at\u00e9 10,20\u00a0\u20ac/dia), o que acrescenta at\u00e9 224,40\u00a0\u20ac l\u00edquidos mensais ao seu rendimento efetivo"
  },
  "1200": {
    bandLabel: "ligeiramente acima da mediana nacional",
    careerExamples: "assistentes t\u00e9cnicos, profissionais de secretariado, vendedores qualificados, t\u00e9cnicos de contabilidade j\u00fanior e operadores de log\u00edstica",
    marketContext: "O sal\u00e1rio de 1.200\u00a0\u20ac brutos posiciona-se ligeiramente acima da mediana salarial portuguesa. De acordo com o INE, a remunera\u00e7\u00e3o bruta mensal mediana ronda os 1.100\u00a0\u20ac em 2025, tornando este patamar um referencial para fun\u00e7\u00f5es t\u00e9cnicas de n\u00edvel intermedi\u00e1rio",
    lifeContext: "Com 1.200\u00a0\u20ac brutos, \u00e9 poss\u00edvel manter um estilo de vida modesto mas confort\u00e1vel fora dos grandes centros urbanos. Em cidades como Braga, Coimbra ou Aveiro, a rela\u00e7\u00e3o sal\u00e1rio/custo de vida \u00e9 significativamente mais favor\u00e1vel",
    negociationTip: "Explore benef\u00edcios como seguro de sa\u00fade empresarial, forma\u00e7\u00e3o profissional paga pela empresa ou hor\u00e1rio flex\u00edvel, que t\u00eam valor real sem aumentar a carga fiscal"
  },
  "1500": {
    bandLabel: "acima da m\u00e9dia nacional",
    careerExamples: "t\u00e9cnicos especializados, enfermeiros, professores com tempo de servi\u00e7o, programadores j\u00fanior, gestores de loja e t\u00e9cnicos de manuten\u00e7\u00e3o industrial",
    marketContext: "O patamar de 1.500\u00a0\u20ac brutos representa cerca de 1,7 vezes o sal\u00e1rio m\u00ednimo, posicionando-se acima da m\u00e9dia nacional. Segundo dados da Pordata, a remunera\u00e7\u00e3o m\u00e9dia mensal em Portugal rondava os 1.450\u00a0\u20ac em 2025, pelo que 1.500\u00a0\u20ac j\u00e1 supera essa refer\u00eancia",
    lifeContext: "A este n\u00edvel salarial, come\u00e7a a ser poss\u00edvel poupar de forma consistente, especialmente fora de Lisboa e Porto. Uma taxa de poupan\u00e7a de 10-15% do l\u00edquido \u00e9 realista, permitindo construir um fundo de emerg\u00eancia ou investir em PPR",
    negociationTip: "Ao negociar aumento, pe\u00e7a uma revis\u00e3o anual indexada \u00e0 infla\u00e7\u00e3o mais produtividade. A diferen\u00e7a de 1.500\u00a0\u20ac para 1.800\u00a0\u20ac brutos traduz-se em aproximadamente mais 185\u00a0\u20ac l\u00edquidos mensais"
  },
  "1800": {
    bandLabel: "na faixa de profissionais qualificados",
    careerExamples: "engenheiros j\u00fanior, contabilistas certificados, gestores de projeto j\u00fanior, t\u00e9cnicos superiores da administra\u00e7\u00e3o p\u00fablica, designers s\u00e9nior e analistas financeiros",
    marketContext: "Com 1.800\u00a0\u20ac brutos, o trabalhador situa-se claramente acima da m\u00e9dia nacional. Este patamar \u00e9 t\u00edpico de profissionais com 3-5 anos de experi\u00eancia ou de fun\u00e7\u00f5es t\u00e9cnicas que requerem forma\u00e7\u00e3o superior. No setor p\u00fablico, corresponde aproximadamente \u00e0 posi\u00e7\u00e3o remuner\u00e1toria 11-14 da tabela \u00fanica",
    lifeContext: "Este sal\u00e1rio permite manter um n\u00edvel de vida confort\u00e1vel em qualquer cidade portuguesa, incluindo Lisboa e Porto, embora a poupan\u00e7a para habita\u00e7\u00e3o pr\u00f3pria requeira disciplina financeira",
    negociationTip: "Nesta faixa, os benef\u00edcios extra-salariais ganham relev\u00e2ncia fiscal: seguro de sa\u00fade (cerca de 50\u00a0\u20ac/m\u00eas por pessoa) e cart\u00e3o refei\u00e7\u00e3o (224,40\u00a0\u20ac/m\u00eas) podem equivaler a mais 274\u00a0\u20ac l\u00edquidos mensais"
  },
  "2000": {
    bandLabel: "no patamar de quadros m\u00e9dios",
    careerExamples: "engenheiros plenos, gestores de projeto, consultores de gest\u00e3o j\u00fanior, farmac\u00eauticos, professores universit\u00e1rios auxiliares e programadores s\u00e9nior",
    marketContext: "O sal\u00e1rio de 2.000\u00a0\u20ac brutos ultrapassa o dobro do sal\u00e1rio m\u00ednimo e representa um marco simb\u00f3lico para muitos trabalhadores portugueses. Segundo dados do INE, apenas cerca de 25% dos trabalhadores por conta de outrem auferem acima deste valor",
    lifeContext: "Com 2.000\u00a0\u20ac brutos, o trabalhador disp\u00f5e de capacidade financeira para constituir poupan\u00e7as, investir e come\u00e7ar a planear objetivos de m\u00e9dio prazo, como a compra de habita\u00e7\u00e3o pr\u00f3pria. A taxa de esfor\u00e7o para cr\u00e9dito habitacional deve manter-se abaixo de 30% do l\u00edquido",
    negociationTip: "A partir deste patamar, considere contribui\u00e7\u00f5es para PPR (Plano de Poupan\u00e7a Reforma) at\u00e9 ao limite fiscal de 2.000\u00a0\u20ac anuais, gerando uma dedu\u00e7\u00e3o fiscal de at\u00e9 400\u00a0\u20ac no IRS"
  },
  "2500": {
    bandLabel: "no segmento de quadros superiores",
    careerExamples: "engenheiros s\u00e9nior, gestores de equipa, developers full-stack s\u00e9nior, auditores, analistas de dados, m\u00e9dicos em forma\u00e7\u00e3o especializada e arquitetos",
    marketContext: "O sal\u00e1rio de 2.500\u00a0\u20ac brutos posiciona o trabalhador no top 20% da distribui\u00e7\u00e3o salarial portuguesa. \u00c9 um valor particularmente comum nos setores de tecnologia, consultoria e servi\u00e7os financeiros, sobretudo na \u00e1rea metropolitana de Lisboa",
    lifeContext: "Neste patamar, a gest\u00e3o de patrim\u00f3nio ganha import\u00e2ncia. O trabalhador deve diversificar entre poupan\u00e7a l\u00edquida (3-6 meses de despesas), PPR, ETF e possivelmente investimento imobili\u00e1rio, mantendo uma taxa de poupan\u00e7a de 20-25%",
    negociationTip: "Com a taxa marginal de IRS j\u00e1 no 6.\u00ba escal\u00e3o, negocie componentes n\u00e3o salariais como stock options, b\u00f3nus de performance ou dias extra de f\u00e9rias, que t\u00eam menor impacto fiscal"
  },
  "3000": {
    bandLabel: "nos rendimentos elevados",
    careerExamples: "diretores de departamento, consultores s\u00e9nior, m\u00e9dicos especialistas no SNS, advogados associados, engenheiros de software lead e gestores de produto",
    marketContext: "Com 3.000\u00a0\u20ac brutos mensais, o trabalhador situa-se no top 15% dos sal\u00e1rios em Portugal. Este patamar corresponde a mais de 3 vezes o sal\u00e1rio m\u00ednimo e \u00e9 frequente em cargos com responsabilidades de gest\u00e3o de equipas ou projetos complexos",
    lifeContext: "A este n\u00edvel, o planeamento fiscal torna-se uma ferramenta essencial de otimiza\u00e7\u00e3o. Recomenda-se a consulta anual com um contabilista certificado para maximizar dedu\u00e7\u00f5es e explorar ve\u00edculos de investimento fiscalmente eficientes",
    negociationTip: "Explore a possibilidade de regime de teletrabalho parcial ou total, o que pode reduzir despesas de desloca\u00e7\u00e3o em 100-200\u00a0\u20ac/m\u00eas e melhorar a qualidade de vida sem impacto fiscal"
  },
  "3500": {
    bandLabel: "no topo da pir\u00e2mide salarial",
    careerExamples: "diretores de \u00e1rea, partners de consultoria j\u00fanior, m\u00e9dicos especialistas com pr\u00e1tica privada, engenheiros de software staff, gestores s\u00e9nior de multinacionais e advogados s\u00e9nior",
    marketContext: "O sal\u00e1rio de 3.500\u00a0\u20ac brutos coloca o trabalhador no top 10% dos rendimentos em Portugal. \u00c9 um valor que reflete compet\u00eancias altamente especializadas ou responsabilidades de lideran\u00e7a significativas, sendo mais comum em multinacionais ou grandes empresas nacionais",
    lifeContext: "Com este rendimento, \u00e9 poss\u00edvel manter um estilo de vida confort\u00e1vel em qualquer cidade portuguesa e simultaneamente construir patrim\u00f3nio atrav\u00e9s de investimentos diversificados. A acumula\u00e7\u00e3o patrimonial deve incluir imobili\u00e1rio, mercados financeiros e poupan\u00e7a reforma",
    negociationTip: "A cada euro adicional nesta faixa, a reten\u00e7\u00e3o marginal \u00e9 significativa. Negocie pacotes de compensa\u00e7\u00e3o total que incluam viaturas de servi\u00e7o, seguros de vida e sa\u00fade familiar, e participa\u00e7\u00e3o nos lucros"
  },
  "4000": {
    bandLabel: "entre os rendimentos mais elevados do pa\u00eds",
    careerExamples: "diretores executivos de PME, vice-presidentes de multinacionais, m\u00e9dicos especialistas com pr\u00e1tica privada consolidada, partners de escrit\u00f3rios de advogados e CTO de startups",
    marketContext: "Um sal\u00e1rio de 4.000\u00a0\u20ac brutos posiciona o trabalhador no top 5-7% da distribui\u00e7\u00e3o salarial. Segundo dados do INE, menos de 7% dos trabalhadores por conta de outrem em Portugal auferem acima deste valor, concentrando-se em Lisboa e no setor financeiro",
    lifeContext: "A este n\u00edvel, a otimiza\u00e7\u00e3o fiscal e o planeamento patrimonial tornam-se indispens\u00e1veis. Considere constituir um portf\u00f3lio diversificado: PPR (isen\u00e7\u00e3o fiscal at\u00e9 400\u00a0\u20ac/ano), ETF acumulativos (efici\u00eancia fiscal no longo prazo) e possivelmente investimento imobili\u00e1rio para arrendamento",
    negociationTip: "Analise se a constitui\u00e7\u00e3o de uma sociedade unipessoal (para presta\u00e7\u00e3o de servi\u00e7os) poderia ser fiscalmente mais vantajosa, dependendo da natureza da atividade. Consulte um fiscalista"
  },
  "5000": {
    bandLabel: "no segmento executivo",
    careerExamples: "CEO de PME, diretores-gerais, m\u00e9dicos especialistas em pr\u00e1tica privada com volume elevado, partners s\u00e9nior de consultoria e advogados de grandes societ\u00e1rias",
    marketContext: "O sal\u00e1rio de 5.000\u00a0\u20ac brutos situa o trabalhador no top 3-4% dos rendimentos em Portugal. \u00c9 um valor associado a posi\u00e7\u00f5es de lideran\u00e7a executiva ou a profiss\u00f5es altamente regulamentadas com barreiras de entrada significativas",
    lifeContext: "Neste patamar, o foco financeiro deve passar da acumula\u00e7\u00e3o para a otimiza\u00e7\u00e3o. Estruture o patrim\u00f3nio entre diferentes classes de ativos: fundos de investimento, imobili\u00e1rio, obriga\u00e7\u00f5es e a\u00e7\u00f5es individuais, mantendo sempre 6-12 meses de despesas em liquidez",
    negociationTip: "Nesta faixa, cada 500\u00a0\u20ac de aumento bruto gera apenas cerca de 300\u00a0\u20ac l\u00edquidos. Privilegie compensa\u00e7\u00e3o diferida: planos de pens\u00f5es complementares, stock options com vesting period, e b\u00f3nus plurianuais"
  },
  "7000": {
    bandLabel: "no topo absoluto da tabela salarial",
    careerExamples: "CEO e administradores de empresas cotadas, partners s\u00e9nior de grandes escrit\u00f3rios internacionais, diretores de bancos e seguradoras, e profissionais de private equity",
    marketContext: "Com 7.000\u00a0\u20ac brutos mensais, o trabalhador encontra-se no top 1-2% da distribui\u00e7\u00e3o salarial portuguesa. Este n\u00edvel de remunera\u00e7\u00e3o \u00e9 t\u00edpico de posi\u00e7\u00f5es C-level em grandes empresas ou de profissionais com d\u00e9cadas de experi\u00eancia em setores de elevado valor acrescentado",
    lifeContext: "A gest\u00e3o patrimonial profissional torna-se aconselhada. Considere trabalhar com um consultor financeiro independente para otimizar a aloca\u00e7\u00e3o de ativos, planear a reforma, e explorar ve\u00edculos de investimento internacionais quando aplic\u00e1vel",
    negociationTip: "Com a taxa marginal pr\u00f3xima do topo (45-48%), negocie compensa\u00e7\u00e3o n\u00e3o monet\u00e1ria de elevado valor: sabaticals, forma\u00e7\u00e3o executiva internacional (MBA, programas do INSEAD ou LBS), e equity na empresa"
  }
};

export function getBandContext(s: SalarioEntry, d: DerivedNumbers): string {
  const b = BAND_MAP[s.slug] || BAND_MAP["1500"];
  const { prev, next } = getAdjacentSalaries(s.slug);
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 4;

  // Different opening structures based on variationIndex
  const openings = [
    `O sal\u00e1rio bruto de ${eur(s.brutoMensal)} mensais posiciona-se ${b.bandLabel} em Portugal. Este valor \u00e9 frequente em fun\u00e7\u00f5es como ${b.careerExamples}. ${b.marketContext}.`,
    `Com ${eur(s.brutoMensal)} brutos por m\u00eas, o trabalhador enquadra-se ${b.bandLabel}. Profiss\u00f5es t\u00edpicas neste patamar incluem ${b.careerExamples}. ${b.marketContext}.`,
    `Um vencimento de ${eur(s.brutoMensal)} brutos mensais classifica-se ${b.bandLabel} no mercado portugu\u00eas. Fun\u00e7\u00f5es como ${b.careerExamples} s\u00e3o representativas deste n\u00edvel. ${b.marketContext}.`,
    `Na distribui\u00e7\u00e3o salarial portuguesa, ${eur(s.brutoMensal)} brutos situam-se ${b.bandLabel}. Este patamar abrange fun\u00e7\u00f5es como ${b.careerExamples}. ${b.marketContext}.`,
  ];

  let text = openings[variationIndex];

  // Unique calculation paragraph
  const diffToMedia = s.brutoMensal - MEDIA_BRUTA_PT;
  const pctDiffMedia = diffToMedia / MEDIA_BRUTA_PT;
  text += ` Ap\u00f3s descontos obrigat\u00f3rios de Seguran\u00e7a Social (${eur(s.tsuTrabalhador)}) e reten\u00e7\u00e3o na fonte de IRS (${eur(s.retencaoMensal)}), `
    + `o trabalhador solteiro sem dependentes recebe ${eur(s.liquidoMensal)} l\u00edquidos mensais, correspondendo a ${pct(d.ratioLiquidoBruto)} do sal\u00e1rio bruto. `
    + `Comparado com a remunera\u00e7\u00e3o m\u00e9dia nacional de ${eur(MEDIA_BRUTA_PT)}, este sal\u00e1rio \u00e9 ${diffToMedia >= 0 ? `${pctRaw(pctDiffMedia)}% superior` : `${pctRaw(Math.abs(pctDiffMedia))}% inferior`}. `;

  // Unique adjacent salary comparison
  if (prev) {
    const diffLiq = s.liquidoMensal - prev.liquidoMensal;
    text += `Comparativamente ao patamar de ${eur(prev.brutoMensal)} brutos, o trabalhador com ${eur(s.brutoMensal)} recebe mais ${eur(diffLiq)} l\u00edquidos por m\u00eas (mais ${eur(diffLiq * 14)} por ano). `;
  }

  // Ratio to minimum wage with unique daily rate
  const ratioSMN = s.brutoMensal / SMN_2026;
  text += `O seu sal\u00e1rio representa ${ratioSMN.toFixed(2)}x o sal\u00e1rio m\u00ednimo nacional. Ap\u00f3s impostos, ganha ${eur(d.liquidoDiario)} por dia \u00fatil e ${eur(d.liquidoHora)} por hora. `;

  // Life context and negotiation
  text += `${b.lifeContext}. `
    + `${b.negociationTip}.`;

  // Unique paragraph about next salary step
  if (next) {
    const diffNext = next.liquidoMensal - s.liquidoMensal;
    const diffAnual = next.liquidoAnual - s.liquidoAnual;
    text += ` Se pretende evoluir para ${eur(next.brutoMensal)} brutos, o ganho l\u00edquido mensal seria de ${eur(diffNext)}, elevando o rendimento anual de ${eur(s.liquidoAnual)} para ${eur(next.liquidoAnual)} (+${eur(diffAnual)}).`;
  }

  return text;
}

/* ================================================================== */
/*  NEW: getCareerDescription - unique career text per salary          */
/* ================================================================== */

export function getCareerDescription(s: SalarioEntry): string {
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 5;
  const ratioSMN = s.brutoMensal / SMN_2026;
  const yearsExperience = Math.max(0, Math.floor((s.brutoMensal - 870) / 150));
  const percentileEstimate = s.brutoMensal <= 870 ? 50 : s.brutoMensal <= 1100 ? 55 : s.brutoMensal <= 1500 ? 65 : s.brutoMensal <= 2000 ? 75 : s.brutoMensal <= 2500 ? 80 : s.brutoMensal <= 3500 ? 90 : s.brutoMensal <= 5000 ? 95 : 98;
  const hourlyBruto = s.brutoMensal / 176;
  const hourlyLiquido = s.liquidoMensal / 176;

  const structures = [
    `O sal\u00e1rio de ${eur(s.brutoMensal)} brutos (${eur(hourlyBruto)}/hora bruta, ${eur(hourlyLiquido)}/hora l\u00edquida) corresponde tipicamente a profissionais com ${yearsExperience}+ anos de experi\u00eancia em Portugal. Este valor posiciona-se no percentil ${percentileEstimate} da distribui\u00e7\u00e3o salarial nacional (${ratioSMN.toFixed(1)}x o sal\u00e1rio m\u00ednimo). Para atingir este patamar, o percurso habitual inclui forma\u00e7\u00e3o superior, especializa\u00e7\u00e3o t\u00e9cnica ou fun\u00e7\u00f5es de gest\u00e3o intermed\u00e1ria.`,
    `Quem aufere ${eur(s.brutoMensal)} brutos mensais (percentil ${percentileEstimate}) situa-se ${ratioSMN.toFixed(1)}x acima do sal\u00e1rio m\u00ednimo, com um valor hor\u00e1rio de ${eur(hourlyBruto)} em termos brutos. Este n\u00edvel remuner\u00e1torio \u00e9 t\u00edpico de profissionais com ${yearsExperience} ou mais anos no mercado de trabalho, em fun\u00e7\u00f5es que exigem qualifica\u00e7\u00f5es espec\u00edficas ou responsabilidades de coordena\u00e7\u00e3o.`,
    `Na carreira t\u00edpica portuguesa, ${eur(s.brutoMensal)} brutos (${eur(hourlyLiquido)} l\u00edquidos/hora) correspondem a aproximadamente ${yearsExperience} anos de evolu\u00e7\u00e3o profissional p\u00f3s-entrada no mercado. Este sal\u00e1rio situa-se no percentil ${percentileEstimate} e representa ${ratioSMN.toFixed(1)} vezes o m\u00ednimo nacional de ${eur(SMN_2026)}.`,
    `Com ${eur(s.brutoMensal)} brutos mensais, o profissional encontra-se no percentil ${percentileEstimate} dos sal\u00e1rios em Portugal. O valor hor\u00e1rio bruto de ${eur(hourlyBruto)} (${eur(hourlyLiquido)} l\u00edquido) reflete tipicamente ${yearsExperience}+ anos de experi\u00eancia acumulada, competências especializadas ou responsabilidade hier\u00e1rquica.`,
    `O patamar de ${eur(s.brutoMensal)} brutos (${ratioSMN.toFixed(1)}x SMN, percentil ${percentileEstimate}) traduz-se em ${eur(hourlyBruto)} brutos por hora ou ${eur(hourlyLiquido)} l\u00edquidos por hora efetiva de trabalho. Alcan\u00e7ar este n\u00edvel requer geralmente ${yearsExperience}+ anos de progresso cont\u00ednuo, com forma\u00e7\u00e3o acad\u00e9mica ou t\u00e9cnica especializada.`,
  ];

  return structures[variationIndex];
}

/* ================================================================== */
/*  NEW: getRaiseSimulation - what happens with a 5%, 10%, 20% raise  */
/* ================================================================== */

export interface RaiseScenario {
  percentagem: string;
  novoBruto: string;
  novoLiquido: string;
  ganhoMensal: string;
  ganhoAnual: string;
  taxaMarginalEfetiva: string;
}

export function getRaiseSimulation(s: SalarioEntry, d: DerivedNumbers): { intro: string; cenarios: RaiseScenario[] } {
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 3;
  const raises = [0.05, 0.10, 0.20];
  const cenarios: RaiseScenario[] = [];

  for (const r of raises) {
    const novoBruto = s.brutoMensal * (1 + r);
    const novoAnual = novoBruto * 14;
    const novoTsu = novoBruto * 0.11;
    const novoRC = Math.max(0, novoAnual - Math.max(DEDUCAO_ESPECIFICA, novoTsu * 14));
    let novoIrs = 0;
    for (let i = 0; i < ESCALOES_IRS_2026.length; i++) {
      if (novoRC <= ESCALOES_IRS_2026[i].limiteMax) {
        novoIrs = novoRC * ESCALOES_IRS_2026[i].taxa - ESCALOES_IRS_2026[i].parcelaAbater;
        break;
      }
    }
    novoIrs = Math.max(0, novoIrs);
    const novoLiqAnual = novoAnual - (novoTsu * 14) - novoIrs;
    const novoLiqMensal = novoLiqAnual / 14;
    const ganhoMensal = novoLiqMensal - s.liquidoMensal;
    const ganhoAnual = novoLiqAnual - s.liquidoAnual;
    const incrementoBruto = novoBruto - s.brutoMensal;
    const taxaMarg = incrementoBruto > 0 ? 1 - (ganhoMensal / incrementoBruto) : 0;

    cenarios.push({
      percentagem: `+${(r * 100).toFixed(0)}%`,
      novoBruto: eur(novoBruto),
      novoLiquido: eur(novoLiqMensal),
      ganhoMensal: eur(ganhoMensal),
      ganhoAnual: eur(ganhoAnual),
      taxaMarginalEfetiva: pct(taxaMarg),
    });
  }

  const intros = [
    `Simulamos tr\u00eas cen\u00e1rios de aumento salarial sobre os seus ${eur(s.brutoMensal)} brutos (l\u00edquido atual: ${eur(s.liquidoMensal)}). A taxa marginal efetiva mostra quanto do aumento bruto fica retido em impostos e contribui\u00e7\u00f5es \u2014 quanto maior o sal\u00e1rio, menor a efici\u00eancia de cada euro adicional.`,
    `Partindo do seu sal\u00e1rio atual de ${eur(s.brutoMensal)} brutos (${eur(s.liquidoMensal)} l\u00edquidos, taxa efetiva ${pct(d.taxaEfetiva)}), apresentamos o impacto real de diferentes percentagens de aumento. Note como a progressividade do IRS afeta o ganho l\u00edquido \u00e0 medida que o bruto sobe.`,
    `Com ${eur(s.brutoMensal)} brutos no ${d.escalaoIndex}.\u00ba escal\u00e3o (taxa marginal ${pct(d.escalaoTaxa)}), analisamos quanto realmente ganharia com aumentos de 5%, 10% e 20%. O rendimento l\u00edquido atual de ${eur(s.liquidoMensal)} serve de base para calcular os ganhos reais.`,
  ];

  return { intro: intros[variationIndex], cenarios };
}

/* ================================================================== */
/*  2. How IRS works section - escaloes explanation                    */
/* ================================================================== */

export interface EscalaoDisplay {
  numero: string;
  limiteInf: string;
  limiteSup: string;
  taxa: string;
  parcelaAbater: string;
  isActive: boolean;
}

export function getEscaloesDisplay(escalaoIndex: number): EscalaoDisplay[] {
  let prevLim = 0;
  return ESCALOES_IRS_2026.map((e, i) => {
    const inf = prevLim;
    prevLim = e.limiteMax === Infinity ? 0 : e.limiteMax;
    return {
      numero: `${i + 1}.\u00ba`,
      limiteInf: eur(inf),
      limiteSup: e.limiteMax === Infinity ? "Superior" : eur(e.limiteMax),
      taxa: pct(e.taxa),
      parcelaAbater: eur(e.parcelaAbater),
      isActive: i + 1 === escalaoIndex,
    };
  });
}

export function getIrsExplanation(s: SalarioEntry, d: DerivedNumbers): string {
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 3;

  // Different opening structures
  const openings = [
    `Com um sal\u00e1rio bruto de ${eur(s.brutoMensal)} mensais (${eur(d.brutoAnual)} anuais em 14 meses), o rendimento colet\u00e1vel ap\u00f3s a dedu\u00e7\u00e3o espec\u00edfica de ${eur(DEDUCAO_ESPECIFICA)} \u00e9 de ${eur(d.rendimentoColetavel)}. Este montante situa o trabalhador no ${d.escalaoIndex}.\u00ba escal\u00e3o de IRS, com uma taxa marginal de ${pct(d.escalaoTaxa)}.`,
    `O c\u00e1lculo do IRS para ${eur(s.brutoMensal)} brutos mensais parte do rendimento anual de ${eur(d.brutoAnual)} (14 meses). Subtraindo a dedu\u00e7\u00e3o espec\u00edfica (${eur(DEDUCAO_ESPECIFICA)}), obt\u00e9m-se um rendimento colet\u00e1vel de ${eur(d.rendimentoColetavel)}, enquadrado no ${d.escalaoIndex}.\u00ba escal\u00e3o (taxa marginal: ${pct(d.escalaoTaxa)}).`,
    `Para determinar o IRS sobre ${eur(s.brutoMensal)} brutos/m\u00eas: rendimento bruto anual = ${eur(d.brutoAnual)}, menos dedu\u00e7\u00e3o espec\u00edfica de ${eur(DEDUCAO_ESPECIFICA)}, resulta rendimento colet\u00e1vel de ${eur(d.rendimentoColetavel)}. Escal\u00e3o aplic\u00e1vel: ${d.escalaoIndex}.\u00ba, taxa marginal ${pct(d.escalaoTaxa)}.`,
  ];

  let text = openings[variationIndex] + " ";

  // Show exact IRS calculation steps for THIS salary
  const escalao = ESCALOES_IRS_2026[d.escalaoIndex - 1];
  if (escalao) {
    const irsCalculado = d.rendimentoColetavel * escalao.taxa - escalao.parcelaAbater;
    text += `O c\u00e1lculo do IRS para ${eur(s.brutoMensal)} brutos \u00e9: ${eur(d.rendimentoColetavel)} \u00d7 ${pct(escalao.taxa)} - ${eur(escalao.parcelaAbater)} (parcela a abater) = ${eur(Math.max(0, irsCalculado))} de imposto base. `;
  }

  text += `Gra\u00e7as ao sistema progressivo, a taxa efetiva de IRS \u00e9 de apenas ${pct(d.taxaEfetiva)}, `
    + `resultando num imposto anual estimado de ${eur(s.irsAnual)}. `
    + `A reten\u00e7\u00e3o na fonte mensal \u00e9 de ${eur(s.retencaoMensal)} (taxa de ${pct(s.retencaoTaxa)}). `;

  // Add specific comparison: effective rate vs marginal rate
  const diferencaTaxas = d.escalaoTaxa - d.taxaEfetiva;
  text += `A diferen\u00e7a entre a taxa marginal (${pct(d.escalaoTaxa)}) e a taxa efetiva (${pct(d.taxaEfetiva)}) \u00e9 de ${pctRaw(diferencaTaxas)} pontos percentuais, o que demonstra como o sistema progressivo protege os rendimentos nos escal\u00f5es inferiores. `;

  // Add: gap to next escalao
  if (d.escalaoIndex < ESCALOES_IRS_2026.length) {
    const nextEscalao = ESCALOES_IRS_2026[d.escalaoIndex];
    const gapToNext = d.escalaoLimite - d.rendimentoColetavel;
    const gapBrutoMensal = gapToNext / 14;
    if (gapToNext > 0 && gapToNext < 50000) {
      text += `Se recebesse mais ${eur(gapBrutoMensal)} brutos por m\u00eas (mais ${eur(gapToNext)} de rendimento colet\u00e1vel anual), passaria ao ${d.escalaoIndex + 1}.\u00ba escal\u00e3o com taxa marginal de ${pct(nextEscalao.taxa)}. `;
    }
  }

  // Unique monetary amount that varies per salary
  const irsPerDay = s.irsAnual / 252;
  const irsPerHour = s.irsAnual / 2016;
  text += `Em termos pr\u00e1ticos, paga ${eur(irsPerDay)} de IRS por dia \u00fatil ou ${eur(irsPerHour)} por hora de trabalho. `;

  text += `Importa notar que a reten\u00e7\u00e3o na fonte \u00e9 um adiantamento do imposto \u2014 o valor final ser\u00e1 apurado aquando da entrega da declara\u00e7\u00e3o anual de IRS, podendo resultar em reembolso ou pagamento adicional.`;

  return text;
}

/* ================================================================== */
/*  3. Monthly budget breakdown                                        */
/* ================================================================== */

export interface BudgetLine {
  categoria: string;
  percentagem: string;
  valor: string;
}

export function getBudgetBreakdown(netMonthly: number): BudgetLine[] {
  let housingPct: number, foodPct: number, transportPct: number;
  let utilitiesPct: number, healthPct: number, leisurePct: number;
  let savingsPct: number, otherPct: number;

  if (netMonthly < 850) {
    housingPct = 0.35; foodPct = 0.20; transportPct = 0.10;
    utilitiesPct = 0.08; healthPct = 0.05; leisurePct = 0.07;
    savingsPct = 0.05; otherPct = 0.10;
  } else if (netMonthly < 1200) {
    housingPct = 0.33; foodPct = 0.18; transportPct = 0.10;
    utilitiesPct = 0.06; healthPct = 0.05; leisurePct = 0.08;
    savingsPct = 0.10; otherPct = 0.10;
  } else if (netMonthly < 1800) {
    housingPct = 0.30; foodPct = 0.15; transportPct = 0.10;
    utilitiesPct = 0.05; healthPct = 0.05; leisurePct = 0.10;
    savingsPct = 0.15; otherPct = 0.10;
  } else if (netMonthly < 2500) {
    housingPct = 0.28; foodPct = 0.13; transportPct = 0.08;
    utilitiesPct = 0.04; healthPct = 0.06; leisurePct = 0.11;
    savingsPct = 0.20; otherPct = 0.10;
  } else {
    housingPct = 0.25; foodPct = 0.10; transportPct = 0.07;
    utilitiesPct = 0.03; healthPct = 0.06; leisurePct = 0.12;
    savingsPct = 0.25; otherPct = 0.12;
  }

  return [
    { categoria: "Habita\u00e7\u00e3o (renda/presta\u00e7\u00e3o)", percentagem: `${(housingPct * 100).toFixed(0)}%`, valor: eur(netMonthly * housingPct) },
    { categoria: "Alimenta\u00e7\u00e3o e supermercado", percentagem: `${(foodPct * 100).toFixed(0)}%`, valor: eur(netMonthly * foodPct) },
    { categoria: "Transportes", percentagem: `${(transportPct * 100).toFixed(0)}%`, valor: eur(netMonthly * transportPct) },
    { categoria: "Servi\u00e7os essenciais (\u00e1gua, luz, g\u00e1s, internet)", percentagem: `${(utilitiesPct * 100).toFixed(0)}%`, valor: eur(netMonthly * utilitiesPct) },
    { categoria: "Sa\u00fade e seguros", percentagem: `${(healthPct * 100).toFixed(0)}%`, valor: eur(netMonthly * healthPct) },
    { categoria: "Lazer e cultura", percentagem: `${(leisurePct * 100).toFixed(0)}%`, valor: eur(netMonthly * leisurePct) },
    { categoria: "Poupan\u00e7a e investimento", percentagem: `${(savingsPct * 100).toFixed(0)}%`, valor: eur(netMonthly * savingsPct) },
    { categoria: "Outras despesas", percentagem: `${(otherPct * 100).toFixed(0)}%`, valor: eur(netMonthly * otherPct) },
  ];
}

/* ================================================================== */
/*  4. Tax optimization tips per band                                  */
/* ================================================================== */

export interface TaxTip {
  titulo: string;
  descricao: string;
}

export function getTaxTips(s: SalarioEntry, d: DerivedNumbers): TaxTip[] {
  const tips: TaxTip[] = [];
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 3;

  // IRS Jovem - salary-specific
  const irsJovemY1 = IRS_JOVEM_ESCALOES[0];
  const irsJovemSaving = Math.min(s.irsAnual, irsJovemY1.limiteIsencao);
  const irsJovemSavingMensal = irsJovemSaving / 12;
  const irsJovemY2Saving = Math.min(s.irsAnual * 0.75, 40 * IAS_2026);
  const irsJovemY3Saving = Math.min(s.irsAnual * 0.50, 30 * IAS_2026);
  const irsJovem5YearTotal = irsJovemSaving + irsJovemY2Saving + irsJovemY3Saving + irsJovemY3Saving + Math.min(s.irsAnual * 0.25, 20 * IAS_2026);

  const irsJovemVariations = [
    `Com o seu sal\u00e1rio de ${eur(s.brutoMensal)} brutos, o IRS Jovem pouparia ${eur(irsJovemSavingMensal)} por m\u00eas (${eur(irsJovemSaving)} por ano) no 1.\u00ba ano de atividade. No 2.\u00ba ano (75% de isen\u00e7\u00e3o, at\u00e9 ${eur(40 * IAS_2026)}), a poupan\u00e7a seria de ${eur(irsJovemY2Saving)} anuais. Ao longo dos 5 anos, poderia poupar ${eur(irsJovem5YearTotal)} em IRS.`,
    `O IRS Jovem aplicado a ${eur(s.brutoMensal)} brutos gera uma poupan\u00e7a total estimada de ${eur(irsJovem5YearTotal)} em 5 anos. No 1.\u00ba ano: ${eur(irsJovemSaving)}/ano (100% isen\u00e7\u00e3o). No 3.\u00ba ano (50%): ${eur(irsJovemY3Saving)}/ano. \u00c9 como receber um b\u00f3nus de ${eur(irsJovem5YearTotal / 60)}/m\u00eas durante 5 anos.`,
    `Para jovens at\u00e9 35 anos com ${eur(s.brutoMensal)} brutos: IRS Jovem poupa ${eur(irsJovemSavingMensal)}/m\u00eas no 1.\u00ba ano, ${eur(irsJovemY2Saving / 12)}/m\u00eas no 2.\u00ba ano, e ${eur(irsJovemY3Saving / 12)}/m\u00eas no 3.\u00ba-4.\u00ba ano. Total em 5 anos: ${eur(irsJovem5YearTotal)} de IRS poupado, equivalente a ${(irsJovem5YearTotal / s.liquidoMensal).toFixed(1)} meses de sal\u00e1rio l\u00edquido.`,
  ];
  tips.push({
    titulo: "IRS Jovem",
    descricao: irsJovemVariations[variationIndex]
  });

  // Deducoes - salary-specific amounts
  const deducaoMaxSaude = Math.min(1000, s.irsAnual * 0.15);
  const deducaoMaxEduc = Math.min(800, s.irsAnual * 0.30);
  const totalDeducoes = deducaoMaxSaude + deducaoMaxEduc + 502 + 250;
  const pctIrsRecuperado = totalDeducoes / s.irsAnual;

  const deducoesVariations = [
    `Para o seu rendimento de ${eur(d.brutoAnual)} anuais, pode deduzir: despesas de sa\u00fade (15%, at\u00e9 ${eur(deducaoMaxSaude)}), educa\u00e7\u00e3o (30%, at\u00e9 ${eur(deducaoMaxEduc)}), habita\u00e7\u00e3o (15% das rendas, at\u00e9 502\u00a0\u20ac) e despesas gerais familiares (35%, at\u00e9 250\u00a0\u20ac). O total m\u00e1ximo de dedu\u00e7\u00f5es pode atingir ${eur(totalDeducoes)}, reduzindo o IRS de ${eur(s.irsAnual)} em at\u00e9 ${pct(pctIrsRecuperado)}.`,
    `Com IRS anual de ${eur(s.irsAnual)}, as dedu\u00e7\u00f5es podem recuperar at\u00e9 ${eur(totalDeducoes)} (${pct(pctIrsRecuperado)} do imposto): sa\u00fade ${eur(deducaoMaxSaude)}, educa\u00e7\u00e3o ${eur(deducaoMaxEduc)}, habita\u00e7\u00e3o 502\u00a0\u20ac, gerais 250\u00a0\u20ac. Por m\u00eas, equivale a recuperar ${eur(totalDeducoes / 12)} que de outra forma iriam para o Estado.`,
    `Maximize as dedu\u00e7\u00f5es sobre o seu IRS de ${eur(s.irsAnual)}: exija fatura em despesas de sa\u00fade (recupera at\u00e9 ${eur(deducaoMaxSaude)}), educa\u00e7\u00e3o (at\u00e9 ${eur(deducaoMaxEduc)}), rendas (at\u00e9 502\u00a0\u20ac) e supermercado/combust\u00edvel (at\u00e9 250\u00a0\u20ac). Total potencial: ${eur(totalDeducoes)}, que reduz a taxa efetiva de ${pct(d.taxaEfetiva)} para ${pct(d.taxaEfetiva - (totalDeducoes / d.brutoAnual))}.`,
  ];
  tips.push({
    titulo: "Dedu\u00e7\u00f5es \u00e0 Coleta",
    descricao: deducoesVariations[variationIndex]
  });

  // PPR - salary-specific
  if (d.brutoAnual >= 14000) {
    const pprIdeal = Math.min(2000, s.liquidoMensal * 0.15 * 12);
    const pprBenefit = Math.min(400, pprIdeal * 0.20);
    const pprMensal = pprIdeal / 12;
    const pprPctLiquido = pprMensal / s.liquidoMensal;
    const ppr10Years = pprIdeal * 10 * 1.04;
    tips.push({
      titulo: "PPR \u2014 Plano Poupan\u00e7a Reforma",
      descricao: `Com o seu l\u00edquido de ${eur(s.liquidoMensal)}, investir ${eur(pprMensal)} por m\u00eas (${pctRaw(pprPctLiquido)}% do l\u00edquido) num PPR gera uma dedu\u00e7\u00e3o fiscal de ${eur(pprBenefit)} no IRS. Isso reduz a taxa efetiva de ${pct(d.taxaEfetiva)} para aproximadamente ${pct(d.taxaEfetiva - (pprBenefit / d.brutoAnual))}. Em 10 anos, com retorno m\u00e9dio de 4%, acumularia ${eur(ppr10Years)} (contribui\u00e7\u00f5es de ${eur(pprIdeal)}/ano + ${eur(pprBenefit * 10)} de benef\u00edcios fiscais acumulados).`
    });
  }

  // Sub alimentacao - salary-specific savings
  const subAlimPotencial = 224.40;
  const subAlimTaxSaving = subAlimPotencial * (s.retencaoTaxa + 0.11);
  const subAlimAnual = subAlimTaxSaving * 11;
  tips.push({
    titulo: "Subs\u00eddio de Alimenta\u00e7\u00e3o em Cart\u00e3o",
    descricao: `Com a sua taxa de reten\u00e7\u00e3o de ${pct(s.retencaoTaxa)} mais 11% de TSU, o subs\u00eddio de alimenta\u00e7\u00e3o em cart\u00e3o refei\u00e7\u00e3o (10,20\u00a0\u20ac/dia, ${eur(subAlimPotencial)}/m\u00eas) representa uma poupan\u00e7a fiscal de ${eur(subAlimTaxSaving)} mensais face ao pagamento em sal\u00e1rio. Anualmente (11 meses), s\u00e3o ${eur(subAlimAnual)} de ganho fiscal. Para o seu sal\u00e1rio de ${eur(s.brutoMensal)} brutos, isto equivale a um aumento l\u00edquido efetivo de ${pct(subAlimTaxSaving / s.liquidoMensal)}.`
  });

  // Dependentes - salary-specific
  if (s.retencaoTaxa > 0.1) {
    const reducaoRetencao = s.brutoMensal * 0.025;
    const ganhoAnual = reducaoRetencao * 12 + 250;
    const mesesSalario = ganhoAnual / s.liquidoMensal;
    tips.push({
      titulo: "Dependentes e Agrega\u00e7\u00e3o Familiar",
      descricao: `Com ${eur(s.brutoMensal)} brutos e reten\u00e7\u00e3o de ${pct(s.retencaoTaxa)}, cada dependente reduziria a reten\u00e7\u00e3o mensal em aproximadamente ${eur(reducaoRetencao)}, mais uma dedu\u00e7\u00e3o fixa de 250\u00a0\u20ac \u00e0 coleta. No total, um dependente acrescenta ${eur(ganhoAnual)} l\u00edquidos por ano (${mesesSalario.toFixed(1)} meses de sal\u00e1rio l\u00edquido equivalente), reduzindo a taxa efetiva de ${pct(d.taxaEfetiva)} para cerca de ${pct(d.taxaEfetiva - (ganhoAnual / d.brutoAnual))}.`
    });
  }

  // Regime casado 2 titulares
  if (s.retencaoTaxa >= 0.15) {
    const poupancaConjunta = s.irsAnual * 0.06;
    const irsConjunto = s.irsAnual - poupancaConjunta;
    const poupancaMensal = poupancaConjunta / 12;
    tips.push({
      titulo: "Tributa\u00e7\u00e3o Conjunta vs. Separada",
      descricao: `Com ${eur(s.brutoMensal)} brutos (IRS de ${eur(s.irsAnual)}/ano), se o c\u00f4njuge ganha significativamente menos, a tributa\u00e7\u00e3o conjunta pode reduzir o IRS para cerca de ${eur(irsConjunto)}, uma poupan\u00e7a de ${eur(poupancaConjunta)} anuais (${eur(poupancaMensal)}/m\u00eas). No ${d.escalaoIndex}.\u00ba escal\u00e3o (taxa marginal ${pct(d.escalaoTaxa)}), o splitting permite que parte do rendimento de ${eur(d.rendimentoColetavel)} seja tributada a taxas inferiores.`
    });
  }

  return tips;
}

/* ================================================================== */
/*  5. FAQs - 6 unique questions with calculated values                */
/* ================================================================== */

export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export function buildFaqs(s: SalarioEntry, d: DerivedNumbers): FaqItem[] {
  const faqs: FaqItem[] = [];
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 3;

  // Q1 - always: quanto recebo liquido (with variation)
  const q1Variations = [
    `Com um sal\u00e1rio bruto de ${eur(s.brutoMensal)} mensais, um trabalhador solteiro sem dependentes recebe ${eur(s.liquidoMensal)} l\u00edquidos por m\u00eas em Portugal (2026). Os descontos mensais totalizam ${eur(d.descontosTotaisMensal)}: ${eur(s.tsuTrabalhador)} de Seguran\u00e7a Social (TSU a 11%) e ${eur(s.retencaoMensal)} de reten\u00e7\u00e3o na fonte de IRS (${pct(s.retencaoTaxa)}). Anualmente, incluindo subs\u00eddios de Natal e f\u00e9rias, o rendimento l\u00edquido atinge ${eur(s.liquidoAnual)}.`,
    `O sal\u00e1rio l\u00edquido de ${eur(s.brutoMensal)} brutos \u00e9 de ${eur(s.liquidoMensal)} por m\u00eas (${pct(d.ratioLiquidoBruto)} do bruto). S\u00e3o retidos ${eur(d.descontosTotaisMensal)} mensais: TSU de ${eur(s.tsuTrabalhador)} (11%) mais IRS de ${eur(s.retencaoMensal)} (${pct(s.retencaoTaxa)}). O rendimento l\u00edquido anual, com 14 meses, totaliza ${eur(s.liquidoAnual)}. Por hora, ganha ${eur(d.liquidoHora)} l\u00edquidos.`,
    `Recebe ${eur(s.liquidoMensal)} l\u00edquidos mensais com ${eur(s.brutoMensal)} brutos (2026, solteiro, 0 dependentes). Descontos: ${eur(s.tsuTrabalhador)} SS + ${eur(s.retencaoMensal)} IRS = ${eur(d.descontosTotaisMensal)}/m\u00eas (${pct(d.taxaDescontoTotal)} do bruto). Anualmente: ${eur(s.liquidoAnual)} l\u00edquidos em 14 meses. Di\u00e1rio: ${eur(d.liquidoDiario)}. Hor\u00e1rio: ${eur(d.liquidoHora)}.`,
  ];

  faqs.push({
    pergunta: `Quanto recebo de l\u00edquido com um sal\u00e1rio de ${s.brutoMensal}\u00a0\u20ac brutos em 2026?`,
    resposta: q1Variations[variationIndex]
  });

  // Q2 - escalao de IRS
  faqs.push({
    pergunta: `Qual o escal\u00e3o de IRS aplic\u00e1vel a ${s.brutoMensal}\u00a0\u20ac brutos mensais?`,
    resposta: `Com ${eur(s.brutoMensal)} brutos mensais (${eur(d.brutoAnual)} anuais), o rendimento colet\u00e1vel ap\u00f3s a dedu\u00e7\u00e3o espec\u00edfica de ${eur(DEDUCAO_ESPECIFICA)} \u00e9 de ${eur(d.rendimentoColetavel)}. Este montante situa-se no ${d.escalaoIndex}.\u00ba escal\u00e3o de IRS, com taxa marginal de ${pct(d.escalaoTaxa)}. Contudo, a taxa efetiva \u00e9 de apenas ${pct(d.taxaEfetiva)}, resultando num IRS anual estimado de ${eur(s.irsAnual)}. A diferen\u00e7a entre taxa marginal e efetiva \u00e9 de ${pctRaw(d.escalaoTaxa - d.taxaEfetiva)} pontos percentuais.`
  });

  // Q3 - custo para a empresa
  const custoPorEuroLiq = s.custoEmpregadorMensal / s.liquidoMensal;
  faqs.push({
    pergunta: `Quanto custa \u00e0 empresa um sal\u00e1rio de ${s.brutoMensal}\u00a0\u20ac brutos?`,
    resposta: `O custo mensal total para o empregador \u00e9 de ${eur(s.custoEmpregadorMensal)}, que inclui o sal\u00e1rio bruto de ${eur(s.brutoMensal)} mais ${eur(d.tsuPatronal)} de TSU patronal (23,75%). Anualmente, considerando os 14 meses obrigat\u00f3rios, o custo total ascende a ${eur(d.custoEmpregadorAnual)}. Por cada euro l\u00edquido que recebe, o empregador gasta ${custoPorEuroLiq.toFixed(2)}\u00a0\u20ac.`
  });

  // Q4 - band-specific unique question
  const q4Map: Record<string, FaqItem> = {
    "820": {
      pergunta: "Um sal\u00e1rio de 820\u00a0\u20ac brutos est\u00e1 isento de IRS?",
      resposta: `Sim. Com ${eur(820)} brutos mensais, o trabalhador est\u00e1 isento de reten\u00e7\u00e3o na fonte de IRS. O \u00fanico desconto obrigat\u00f3rio \u00e9 a contribui\u00e7\u00e3o para a Seguran\u00e7a Social de 11% (${eur(s.tsuTrabalhador)}), resultando num l\u00edquido mensal de ${eur(s.liquidoMensal)}. Na declara\u00e7\u00e3o anual de IRS, poder\u00e1 existir um pequeno imposto a pagar (estimado em ${eur(s.irsAnual)} anuais), mas tamb\u00e9m \u00e9 poss\u00edvel obter reembolso se tiver dedu\u00e7\u00f5es.`
    },
    "1000": {
      pergunta: "Qual a diferen\u00e7a l\u00edquida entre o sal\u00e1rio m\u00ednimo (870\u00a0\u20ac) e 1.000\u00a0\u20ac brutos?",
      resposta: `O sal\u00e1rio m\u00ednimo de 870\u00a0\u20ac \u00e9 isento de reten\u00e7\u00e3o na fonte, resultando num l\u00edquido de cerca de 774,30\u00a0\u20ac. Com 1.000\u00a0\u20ac brutos, o l\u00edquido \u00e9 de ${eur(s.liquidoMensal)}, com reten\u00e7\u00e3o de ${pct(s.retencaoTaxa)}. A diferen\u00e7a l\u00edquida \u00e9 de aproximadamente ${eur(s.liquidoMensal - 774.30)}, porque o aumento de 130\u00a0\u20ac brutos gera apenas este incremento l\u00edquido ap\u00f3s descontos. A taxa marginal efetiva sobre estes 130\u00a0\u20ac \u00e9 de ${pct(1 - ((s.liquidoMensal - 774.30) / 130))}.`
    },
    "1200": {
      pergunta: "Quanto recebo por hora com um sal\u00e1rio de 1.200\u00a0\u20ac brutos?",
      resposta: `Considerando 22 dias \u00fateis por m\u00eas e 8 horas di\u00e1rias (176 horas/m\u00eas), o sal\u00e1rio l\u00edquido de ${eur(s.liquidoMensal)} traduz-se em ${eur(d.liquidoHora)} l\u00edquidos por hora. Em termos brutos, o valor hor\u00e1rio \u00e9 de ${eur(s.brutoMensal / 176)}. O valor di\u00e1rio l\u00edquido \u00e9 de ${eur(d.liquidoDiario)} e o semanal de ${eur(d.liquidoSemanal)}.`
    },
    "1500": {
      pergunta: "Compensa fazer horas extra com um sal\u00e1rio de 1.500\u00a0\u20ac brutos?",
      resposta: `As horas extra s\u00e3o remuneradas com acr\u00e9scimo: 25% na primeira hora e 37,5% nas seguintes. Com ${eur(s.brutoMensal)} brutos, o valor hora base \u00e9 de ${eur(s.brutoMensal / 176)}. Uma hora extra rende ${eur((s.brutoMensal / 176) * 1.25)} brutos. Ap\u00f3s descontos (taxa marginal de ${pct(s.retencaoTaxa)} + 11% TSU), cada hora extra l\u00edquida vale ${eur((s.brutoMensal / 176) * 1.25 * (1 - s.retencaoTaxa - 0.11))}. Em 20 horas extra/m\u00eas, ganharia mais ${eur((s.brutoMensal / 176) * 1.25 * (1 - s.retencaoTaxa - 0.11) * 20)} l\u00edquidos.`
    },
    "1800": {
      pergunta: "Quanto recebo de subs\u00eddio de Natal e f\u00e9rias com 1.800\u00a0\u20ac brutos?",
      resposta: `O subs\u00eddio de Natal bruto \u00e9 de ${eur(s.brutoMensal)}. Ap\u00f3s TSU (${eur(s.tsuTrabalhador)}) e IRS \u00e0 taxa m\u00e9dia, o l\u00edquido estimado \u00e9 de ${eur(d.subNatalLiquido)}. O subs\u00eddio de f\u00e9rias l\u00edquido \u00e9 de ${eur(d.subFeriasLiquido)}. No total, os dois subs\u00eddios acrescentam ${eur(d.subNatalLiquido + d.subFeriasLiquido)} l\u00edquidos ao rendimento anual, representando ${pct((d.subNatalLiquido + d.subFeriasLiquido) / s.liquidoAnual)} do l\u00edquido anual total.`
    },
    "2000": {
      pergunta: "Quanto aumento l\u00edquido ganho se passar de 1.500\u00a0\u20ac para 2.000\u00a0\u20ac brutos?",
      resposta: `O aumento de 500\u00a0\u20ac brutos traduz-se num ganho l\u00edquido mensal de ${eur(s.liquidoMensal - 1114.50)} (de 1.114,50\u00a0\u20ac para ${eur(s.liquidoMensal)}). A taxa marginal efetiva deste aumento \u00e9 de ${pct(1 - ((s.liquidoMensal - 1114.50) / 500))}, pois a reten\u00e7\u00e3o sobe de 14,7% para ${pct(s.retencaoTaxa)} e a TSU de 11% mant\u00e9m-se. Anualmente, o ganho l\u00edquido \u00e9 de ${eur(s.liquidoAnual - 15586.52)}. Por hora, ganha mais ${eur(d.liquidoHora - (1114.50 / 176))}.`
    },
    "2500": {
      pergunta: "Qual o impacto de ter 1 dependente com sal\u00e1rio de 2.500\u00a0\u20ac brutos?",
      resposta: `Com 1 dependente, a taxa de reten\u00e7\u00e3o na fonte desce de ${pct(s.retencaoTaxa)} para aproximadamente 18,9%, e h\u00e1 uma dedu\u00e7\u00e3o adicional de 250\u00a0\u20ac \u00e0 coleta. Poupan\u00e7a mensal: ${eur(s.brutoMensal * (s.retencaoTaxa - 0.189))}. Poupan\u00e7a anual (incl. dedu\u00e7\u00e3o): ${eur(s.brutoMensal * (s.retencaoTaxa - 0.189) * 12 + 250)}. O l\u00edquido mensal subiria de ${eur(s.liquidoMensal)} para aproximadamente ${eur(s.liquidoMensal + s.brutoMensal * (s.retencaoTaxa - 0.189))}.`
    },
    "3000": {
      pergunta: "Qual a taxa efetiva total de impostos sobre 3.000\u00a0\u20ac brutos?",
      resposta: `Os descontos totais mensais s\u00e3o de ${eur(d.descontosTotaisMensal)}, representando ${pct(d.taxaDescontoTotal)} do sal\u00e1rio bruto. Destes, ${eur(s.tsuTrabalhador)} (11%) s\u00e3o SS e ${eur(s.retencaoMensal)} (${pct(s.retencaoTaxa)}) \u00e9 IRS. Taxa efetiva anual de IRS: ${pct(d.taxaEfetiva)}, inferior \u00e0 taxa marginal de ${pct(d.escalaoTaxa)}. Incluindo TSU patronal de ${eur(d.tsuPatronal)}, o Estado arrecada ${pct((d.descontosTotaisMensal + d.tsuPatronal) / s.custoEmpregadorMensal)} do custo total.`
    },
    "3500": {
      pergunta: "Recebo mais l\u00edquido se passar de 3.000\u00a0\u20ac para 3.500\u00a0\u20ac brutos?",
      resposta: `Sim. O aumento de 500\u00a0\u20ac brutos gera +${eur(s.liquidoMensal - 1941)} l\u00edquidos/m\u00eas (de 1.941\u00a0\u20ac para ${eur(s.liquidoMensal)}). Taxa marginal efetiva sobre o aumento: ${pct(1 - ((s.liquidoMensal - 1941) / 500))}. Anualmente: +${eur((s.liquidoMensal - 1941) * 14)}. Por hora: de ${eur(1941 / 176)} para ${eur(d.liquidoHora)}. A efici\u00eancia decrescente refor\u00e7a a import\u00e2ncia de complementos n\u00e3o salariais.`
    },
    "4000": {
      pergunta: "Como reduzir a carga fiscal com um sal\u00e1rio de 4.000\u00a0\u20ac brutos?",
      resposta: `Com ${eur(s.brutoMensal)} brutos e reten\u00e7\u00e3o de ${pct(s.retencaoTaxa)}, cada 100\u00a0\u20ac de aumento bruto gera apenas ${eur(100 * (1 - s.retencaoTaxa - 0.11))} l\u00edquidos. Estrat\u00e9gias: (1) PPR ${eur(2000)}/ano = 400\u00a0\u20ac dedu\u00e7\u00e3o; (2) dedu\u00e7\u00f5es sa\u00fade+educa\u00e7\u00e3o; (3) cart\u00e3o refei\u00e7\u00e3o (poupan\u00e7a de ${eur(224.40 * (s.retencaoTaxa + 0.11))}/m\u00eas); (4) tributa\u00e7\u00e3o conjunta se casado. Total potencial: ${eur(400 + 224.40 * (s.retencaoTaxa + 0.11) * 11 + s.irsAnual * 0.06)}/ano.`
    },
    "5000": {
      pergunta: "Qual o rendimento l\u00edquido di\u00e1rio, semanal e hor\u00e1rio com 5.000\u00a0\u20ac brutos?",
      resposta: `Com l\u00edquido mensal de ${eur(s.liquidoMensal)} (22 dias/m\u00eas, 8h/dia): di\u00e1rio ${eur(d.liquidoDiario)}, semanal ${eur(d.liquidoSemanal)}, hor\u00e1rio ${eur(d.liquidoHora)}. Em termos brutos: ${eur(s.brutoMensal / 176)}/hora. Apenas ${pct(d.ratioLiquidoBruto)} chega ao trabalhador. Anualizado: ${eur(s.liquidoAnual / 252)} l\u00edquidos por dia \u00fatil (252 dias/ano) ou ${eur(s.liquidoAnual / 2016)} por hora efetiva.`
    },
    "7000": {
      pergunta: "Quanto pago de impostos e Seguran\u00e7a Social com 7.000\u00a0\u20ac brutos por m\u00eas?",
      resposta: `Descontos mensais: ${eur(d.descontosTotaisMensal)} (${pct(d.taxaDescontoTotal)} do bruto): ${eur(s.tsuTrabalhador)} SS (11%) + ${eur(s.retencaoMensal)} IRS (${pct(s.retencaoTaxa)}). Anualmente: ${eur(d.descontosTotaisAnual)} do trabalhador. Com TSU patronal (${eur(d.tsuPatronalAnual)}/ano), o Estado arrecada ${eur(d.descontosTotaisAnual + d.tsuPatronalAnual)}/ano com este sal\u00e1rio. Por dia \u00fatil, paga ${eur(d.descontosTotaisMensal / 22)} em impostos.`
    }
  };

  faqs.push(q4Map[s.slug] || q4Map["1500"]);

  // Q5 - progression comparison (salary-specific)
  const raisedBruto = s.brutoMensal * 1.10;
  const raisedAnual = raisedBruto * 14;
  const raisedRC = Math.max(0, raisedAnual - Math.max(DEDUCAO_ESPECIFICA, raisedBruto * 0.11 * 14));
  let raisedIrs = 0;
  for (let i = 0; i < ESCALOES_IRS_2026.length; i++) {
    if (raisedRC <= ESCALOES_IRS_2026[i].limiteMax) {
      raisedIrs = raisedRC * ESCALOES_IRS_2026[i].taxa - ESCALOES_IRS_2026[i].parcelaAbater;
      break;
    }
  }
  const raisedLiquidoAnual = raisedAnual - (raisedBruto * 0.11 * 14) - Math.max(0, raisedIrs);
  const raisedLiquidoMensal = raisedLiquidoAnual / 14;
  const netDiff = raisedLiquidoMensal - s.liquidoMensal;
  const incrementoBruto = raisedBruto - s.brutoMensal;
  const marginRateOnRaise = incrementoBruto > 0 ? 1 - (netDiff / incrementoBruto) : 0;

  const q5Variations = [
    `Se o seu sal\u00e1rio subisse 10% para ${eur(raisedBruto)} brutos, o l\u00edquido mensal subiria ${eur(netDiff)} (de ${eur(s.liquidoMensal)} para ${eur(raisedLiquidoMensal)}). A taxa efetiva sobre o aumento \u00e9 de ${pct(marginRateOnRaise)}: dos ${eur(incrementoBruto)} de aumento bruto, ${eur(incrementoBruto - netDiff)} ficam retidos. Ganho anual: ${eur(netDiff * 14)}.`,
    `Um aumento de 10% (de ${eur(s.brutoMensal)} para ${eur(raisedBruto)} brutos) geraria +${eur(netDiff)} l\u00edquidos/m\u00eas. Dos ${eur(incrementoBruto)} adicionais brutos, apenas ${eur(netDiff)} chegam \u00e0 conta (efici\u00eancia de ${pct(1 - marginRateOnRaise)}). Em termos hor\u00e1rios, passaria de ${eur(d.liquidoHora)} para ${eur(raisedLiquidoMensal / 176)}/hora.`,
    `Com +10% (${eur(incrementoBruto)} brutos adicionais), o novo l\u00edquido seria ${eur(raisedLiquidoMensal)}/m\u00eas (+${eur(netDiff)}). A progressividade do IRS absorve ${pct(marginRateOnRaise)} do aumento. Anualmente: +${eur(netDiff * 14)} l\u00edquidos (de ${eur(s.liquidoAnual)} para ${eur(raisedLiquidoAnual)}).`,
  ];

  faqs.push({
    pergunta: `Se o meu sal\u00e1rio de ${s.brutoMensal}\u00a0\u20ac subisse 10%, quanto mais receberia l\u00edquido?`,
    resposta: q5Variations[variationIndex]
  });

  // Q6 - savings advice specific to this salary
  const savingsRate = s.brutoMensal <= 1200 ? 0.05 : s.brutoMensal <= 2000 ? 0.10 : s.brutoMensal <= 3500 ? 0.15 : 0.20;
  const monthlySavings = s.liquidoMensal * savingsRate;
  const emergencyFund = s.liquidoMensal * 6;
  const pprContrib = Math.min(2000, monthlySavings * 12);
  const pprDeducao = Math.min(400, pprContrib * 0.20);
  const monthsToEmergency = Math.ceil(emergencyFund / monthlySavings);

  faqs.push({
    pergunta: `Quanto devo poupar com um sal\u00e1rio l\u00edquido de ${eur(s.liquidoMensal)} por m\u00eas?`,
    resposta: `Com ${eur(s.liquidoMensal)} l\u00edquidos, poupe ${pctRaw(savingsRate)}% (${eur(monthlySavings)}/m\u00eas). Prioridades: (1) fundo de emerg\u00eancia de ${eur(emergencyFund)} (6 meses) \u2014 atingido em ${monthsToEmergency} meses; (2) PPR de ${eur(pprContrib)}/ano para dedu\u00e7\u00e3o de ${eur(pprDeducao)}; (3) ETF/dep\u00f3sitos. Em 12 meses: ${eur(monthlySavings * 12)} acumulados. Restam ${eur(s.liquidoMensal - monthlySavings)}/m\u00eas para despesas correntes.`
  });

  // Q7 - unique per-salary working time equivalent
  const hoursForRent = 600 / d.liquidoHora; // avg rent in PT ~600 EUR
  const hoursForFood = 300 / d.liquidoHora;
  faqs.push({
    pergunta: `Quantas horas de trabalho preciso para pagar despesas b\u00e1sicas com ${s.brutoMensal}\u00a0\u20ac brutos?`,
    resposta: `Com o seu rendimento l\u00edquido hor\u00e1rio de ${eur(d.liquidoHora)}: uma renda m\u00e9dia de 600\u00a0\u20ac requer ${hoursForRent.toFixed(0)} horas de trabalho (${(hoursForRent / 8).toFixed(1)} dias); alimenta\u00e7\u00e3o mensal de 300\u00a0\u20ac requer ${hoursForFood.toFixed(0)} horas (${(hoursForFood / 8).toFixed(1)} dias). No total, as despesas essenciais consomem aproximadamente ${((hoursForRent + hoursForFood) / 176 * 100).toFixed(0)}% do seu tempo de trabalho mensal (176 horas).`
  });

  return faqs;
}

/* ================================================================== */
/*  6. Seguranca Social explanation (unique per band)                   */
/* ================================================================== */

export function getSSExplanation(s: SalarioEntry, d: DerivedNumbers): string {
  const { prev, next } = getAdjacentSalaries(s.slug);
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 3;

  const openings = [
    `A contribui\u00e7\u00e3o para a Seguran\u00e7a Social (TSU) incide sobre a totalidade do sal\u00e1rio bruto, incluindo os subs\u00eddios de Natal e f\u00e9rias. Com ${eur(s.brutoMensal)} brutos, o trabalhador contribui com 11% (${eur(s.tsuTrabalhador)} por m\u00eas), e a entidade empregadora paga 23,75% (${eur(d.tsuPatronal)} por m\u00eas).`,
    `Com um sal\u00e1rio bruto de ${eur(s.brutoMensal)}, a Seguran\u00e7a Social retira mensalmente ${eur(s.tsuTrabalhador)} da remunera\u00e7\u00e3o do trabalhador (taxa fixa de 11%) e ${eur(d.tsuPatronal)} ao empregador (23,75%). Estas contribui\u00e7\u00f5es incidem sobre os 14 meses anuais.`,
    `Para o sal\u00e1rio espec\u00edfico de ${eur(s.brutoMensal)} brutos, as contribui\u00e7\u00f5es sociais obrigat\u00f3rias s\u00e3o: trabalhador ${eur(s.tsuTrabalhador)}/m\u00eas (11%), empregador ${eur(d.tsuPatronal)}/m\u00eas (23,75%). A taxa combinada de 34,75% torna a Seguran\u00e7a Social o maior desconto sobre o trabalho.`,
  ];

  let text = openings[variationIndex] + " ";

  // Annual totals - unique per salary
  const tsuMensalTotal = s.tsuTrabalhador + d.tsuPatronal;
  const tsuAnualTotal = d.tsuAnual + d.tsuPatronalAnual;
  text += `Anualmente, a contribui\u00e7\u00e3o total para a Seguran\u00e7a Social \u00e9 de ${eur(tsuAnualTotal)} `
    + `(${eur(d.tsuAnual)} do trabalhador + ${eur(d.tsuPatronalAnual)} do empregador), distribu\u00edda por 14 meses. `
    + `Mensalmente, ${eur(tsuMensalTotal)} s\u00e3o canalizados para o sistema (${pct(tsuMensalTotal / s.custoEmpregadorMensal)} do custo total do empregador). `;

  // Comparison with adjacent
  if (prev) {
    const prevTsu = prev.tsuTrabalhador;
    const diffTsu = s.tsuTrabalhador - prevTsu;
    const diffTsuAnual = diffTsu * 14;
    text += `Comparativamente a ${eur(prev.brutoMensal)} brutos, a sua contribui\u00e7\u00e3o \u00e9 superior em ${eur(diffTsu)} por m\u00eas (${eur(diffTsuAnual)} por ano). `;
  }

  if (next) {
    const nextTsu = next.brutoMensal * 0.11;
    const diffTsuNext = nextTsu - s.tsuTrabalhador;
    text += `Se subisse para ${eur(next.brutoMensal)} brutos, a TSU aumentaria em ${eur(diffTsuNext)}/m\u00eas. `;
  }

  // Per-hour SS cost
  const tsuPerHora = s.tsuTrabalhador / 176;
  text += `Por hora trabalhada, contribui ${eur(tsuPerHora)} para a Seguran\u00e7a Social. `;
  text += `Esta contribui\u00e7\u00e3o garante acesso a pens\u00e3o de velhice, doen\u00e7a, desemprego, parentalidade e invalidez.`;

  return text;
}

/* ================================================================== */
/*  7. Salary comparison text                                          */
/* ================================================================== */

export function getComparisonText(s: SalarioEntry, d: DerivedNumbers): string {
  const ratioSMN = s.brutoMensal / SMN_2026;
  const { prev, next } = getAdjacentSalaries(s.slug);
  const variationIndex = Math.floor(s.brutoMensal / 1000) % 3;
  const diffToMediana = s.brutoMensal - MEDIANA_BRUTA_PT;
  const diffToMedia = s.brutoMensal - MEDIA_BRUTA_PT;

  const openings = [
    `O sal\u00e1rio bruto de ${eur(s.brutoMensal)} corresponde a ${ratioSMN.toFixed(2)}x o sal\u00e1rio m\u00ednimo nacional (${eur(SMN_2026)} em 2026) e situa-se ${eur(Math.abs(diffToMediana))} ${diffToMediana >= 0 ? "acima" : "abaixo"} da mediana (${eur(MEDIANA_BRUTA_PT)}) e ${eur(Math.abs(diffToMedia))} ${diffToMedia >= 0 ? "acima" : "abaixo"} da m\u00e9dia (${eur(MEDIA_BRUTA_PT)}).`,
    `Com ${eur(s.brutoMensal)} brutos mensais (${ratioSMN.toFixed(2)}x o SMN de ${eur(SMN_2026)}), posiciona-se ${diffToMediana >= 0 ? "+" : ""}${eur(diffToMediana)} face \u00e0 mediana portuguesa (${eur(MEDIANA_BRUTA_PT)}) e ${diffToMedia >= 0 ? "+" : ""}${eur(diffToMedia)} face \u00e0 m\u00e9dia nacional (${eur(MEDIA_BRUTA_PT)}).`,
    `Na hierarquia salarial portuguesa, ${eur(s.brutoMensal)} brutos representam ${ratioSMN.toFixed(2)} vezes o m\u00ednimo (${eur(SMN_2026)}), ${pct(diffToMediana / MEDIANA_BRUTA_PT)} ${diffToMediana >= 0 ? "acima" : "abaixo"} da mediana, e ${pct(Math.abs(diffToMedia) / MEDIA_BRUTA_PT)} ${diffToMedia >= 0 ? "acima" : "abaixo"} da m\u00e9dia nacional.`,
  ];

  let text = openings[variationIndex] + " ";

  text += `Enquanto o sal\u00e1rio m\u00ednimo gera um l\u00edquido de aproximadamente 774,30\u00a0\u20ac, `
    + `os ${eur(s.brutoMensal)} brutos resultam em ${eur(s.liquidoMensal)} l\u00edquidos. `
    + `A diferen\u00e7a entre bruto e l\u00edquido \u00e9 de ${eur(d.diferencaBrutoLiquido)} mensais, dos quais `
    + `${eur(s.tsuTrabalhador)} se destinam \u00e0 Seguran\u00e7a Social e ${eur(s.retencaoMensal)} \u00e0 reten\u00e7\u00e3o de IRS. `
    + `O custo total para a empresa atinge ${eur(s.custoEmpregadorMensal)} mensais (${eur(d.custoEmpregadorAnual)} anuais), `
    + `significando que por cada euro l\u00edquido, o empregador despende ${(s.custoEmpregadorMensal / s.liquidoMensal).toFixed(2)}\u00a0\u20ac. `;

  // Add unique comparison with adjacent salaries
  if (prev && next) {
    const diffPrev = s.liquidoMensal - prev.liquidoMensal;
    const diffNext = next.liquidoMensal - s.liquidoMensal;
    text += `Na escala salarial, ${eur(s.brutoMensal)} posiciona-se entre ${eur(prev.brutoMensal)} (l\u00edquido ${eur(prev.liquidoMensal)}) e ${eur(next.brutoMensal)} (l\u00edquido ${eur(next.liquidoMensal)}). Diferen\u00e7a para o inferior: +${eur(diffPrev)}/m\u00eas (+${eur(diffPrev * 14)}/ano). Diferen\u00e7a para o superior: -${eur(diffNext)}/m\u00eas (-${eur(diffNext * 14)}/ano).`;
  } else if (next) {
    const diffNext = next.liquidoMensal - s.liquidoMensal;
    text += `No patamar seguinte de ${eur(next.brutoMensal)} brutos, o l\u00edquido sobe para ${eur(next.liquidoMensal)}, um ganho de ${eur(diffNext)} mensais (${eur(diffNext * 14)} anuais).`;
  } else if (prev) {
    const diffPrev = s.liquidoMensal - prev.liquidoMensal;
    text += `No patamar anterior de ${eur(prev.brutoMensal)} brutos, o l\u00edquido era de ${eur(prev.liquidoMensal)}, ou seja, menos ${eur(diffPrev)} mensais (menos ${eur(diffPrev * 14)} anuais).`;
  }

  return text;
}

/* ================================================================== */
/*  8. Author / E-E-A-T box data                                      */
/* ================================================================== */

export function getAuthorBox(): { name: string; credentials: string; bio: string } {
  return {
    name: "Radif Partners Éditeur de calculateurs et de guides pratiques",
    credentials: "Éditeur de calculateurs et de guides pratiques",
    bio: "Radif Partners \u00e9 uma editora de calculadoras e guias pr\u00e1ticos, com experi\u00eancia em finan\u00e7as, consultoria e fiscalidade. Especializada por literacia financeira, criou o salarioliquido.pt para ajudar trabalhadores portugueses a compreenderem a sua folha de vencimento e a otimizarem a sua situa\u00e7\u00e3o fiscal.",
  };
}
