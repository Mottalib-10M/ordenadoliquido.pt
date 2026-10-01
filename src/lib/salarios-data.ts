/**
 * Páginas programáticas de salário bruto → líquido.
 * Todos os valores saem do motor engine.ts (solteiro, 0 dependentes, sem IRS Jovem) :
 * nenhum número é escrito à mão, para que os textos acompanhem as tabelas do ano.
 */
import { calculateSalary, type SalaryResult } from "./engine";
import { ESCALOES_IRS_2026, SALARIO_MINIMO_2026 } from "./baremes-2026";

export interface SalarioEntry {
  slug: string;
  brutoMensal: number;
  liquidoMensal: number;
  tsuTrabalhador: number;
  retencaoMensal: number;
  retencaoTaxa: number;
  irsAnual: number;
  liquidoAnual: number;
  custoEmpregadorMensal: number;
  descricao: string;
  contexto: string;
  faq: { pergunta: string; resposta: string }[];
}

/** 1166.83 → « 1.166,83€ » ; 132 → « 132€ » */
function e(n: number): string {
  const [int, dec] = (Math.round(n * 100) / 100).toFixed(2).split(".");
  const milhares = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (dec === "00" ? milhares : `${milhares},${dec}`) + "€";
}
/** 0.1121 → « 11,2% » */
function p(taxa: number): string {
  return (Math.round(taxa * 1000) / 10).toString().replace(".", ",") + "%";
}
const SMN = e(SALARIO_MINIMO_2026);
const vezesSMN = (b: number) => (Math.round((b / SALARIO_MINIMO_2026) * 10) / 10).toString().replace(".", ",");

function escalao(r: SalaryResult): { ordem: number; taxa: string } {
  const i = ESCALOES_IRS_2026.findIndex((x) => r.taxableIncome <= x.limiteMax);
  return { ordem: i + 1, taxa: p(ESCALOES_IRS_2026[i].taxa) };
}

type Textos = Pick<SalarioEntry, "descricao" | "contexto" | "faq">;
type Calc = (b: number) => SalaryResult;

const calc: Calc = (b) => calculateSalary({ grossMonthly: b, maritalStatus: "solteiro", dependents: 0, irsJovem: 0 });

const TEXTOS: Record<string, (r: SalaryResult, c: Calc) => Textos> = {
  "820": (r) => ({
    descricao: `O salário de 820€ brutos mensais situa-se abaixo do salário mínimo nacional de 2026 (${SMN}), que era o valor em vigor em 2024. Hoje serve de referência para contratos a tempo parcial ou situações especiais. A este nível salarial, não há retenção na fonte de IRS.`,
    contexto: `Com um salário bruto de 820€, o trabalhador recebe ${e(r.netMonthly)} líquidos por mês. O único desconto aplicável é a contribuição para a Segurança Social (TSU) de 11%, que corresponde a ${e(r.tsuEmployee)} mensais. Este valor está isento de retenção na fonte de IRS, o que significa que todo o rendimento após TSU chega à conta bancária do trabalhador.`,
    faq: [
      { pergunta: "Um salário de 820€ brutos paga IRS?", resposta: `Não. Com um salário bruto mensal de 820€, o trabalhador está isento de retenção na fonte de IRS. O único desconto obrigatório é a contribuição para a Segurança Social de 11% (${e(r.tsuEmployee)}), ficando com um líquido mensal de ${e(r.netMonthly)}.` },
      { pergunta: "Quanto desconta de Segurança Social com 820€ brutos?", resposta: `A contribuição do trabalhador para a Segurança Social é de 11% do salário bruto, o que corresponde a ${e(r.tsuEmployee)} por mês. A entidade empregadora paga adicionalmente 23,75% (${e(r.tsuEmployer)}).` },
      { pergunta: "Qual o custo total para a empresa de um salário de 820€?", resposta: `O custo mensal para o empregador é de ${e(r.custoEmpregadorMensal)} (820€ de salário bruto + ${e(r.tsuEmployer)} de TSU patronal). Anualmente, considerando 14 meses, o custo total é de ${e(r.custoEmpregadorAnual)}.` },
    ],
  }),
  "1000": (r) => ({
    descricao: `Um salário bruto de 1.000€ mensais é um valor comum em Portugal, pouco acima do salário mínimo de ${SMN}, especialmente para posições de entrada ou a tempo inteiro com pouca experiência. Após descontos, o trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos.`,
    contexto: `Com 1.000€ brutos mensais, os descontos incluem ${e(r.tsuEmployee)} de Segurança Social (11%) e ${e(r.retencaoMensal)} de retenção na fonte de IRS (${p(r.retencaoTaxa)}). O salário líquido mensal resultante é de ${e(r.netMonthly)}. Anualmente, incluindo subsídios de Natal e férias, o rendimento líquido total atinge ${e(r.netAnnual)}.`,
    faq: [
      { pergunta: "Quanto recebo de líquido com 1.000€ brutos?", resposta: `Com um salário bruto de 1.000€ mensais, um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos por mês. Os descontos incluem ${e(r.tsuEmployee)} de TSU (11%) e ${e(r.retencaoMensal)} de retenção na fonte de IRS (${p(r.retencaoTaxa)}).` },
      { pergunta: "Qual a taxa de retenção de IRS para 1.000€ brutos?", resposta: `Para um trabalhador solteiro sem dependentes, a retenção na fonte representa ${p(r.retencaoTaxa)} do salário bruto. Isto significa que são retidos ${e(r.retencaoMensal)} por mês a título de IRS. Se tiver dependentes, a retenção será inferior.` },
      { pergunta: "Qual o líquido anual com 1.000€ brutos mensais?", resposta: `O rendimento líquido anual, incluindo os 12 meses de vencimento mais os subsídios de Natal e férias, é de ${e(r.netAnnual)}.` },
    ],
  }),
  "1200": (r) => ({
    descricao: `O salário de 1.200€ brutos é frequente em funções administrativas, comércio e serviços em Portugal. Representa um valor acima do salário mínimo, com uma retenção de IRS de ${p(r.retencaoTaxa)} para solteiros sem dependentes.`,
    contexto: `Com 1.200€ brutos, o trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos mensais. Os descontos mensais incluem ${e(r.tsuEmployee)} de TSU e ${e(r.retencaoMensal)} de retenção na fonte. O líquido anual, com subsídios, atinge ${e(r.netAnnual)}.`,
    faq: [
      { pergunta: "Quanto fica de líquido com 1.200€ brutos em 2026?", resposta: `Um trabalhador solteiro sem dependentes com 1.200€ brutos recebe ${e(r.netMonthly)} líquidos por mês em 2026. São descontados ${e(r.tsuEmployee)} de TSU (11%) e ${e(r.retencaoMensal)} de IRS (${p(r.retencaoTaxa)}).` },
      { pergunta: "Os 1.200€ brutos incluem subsídio de alimentação?", resposta: "Não. O salário bruto de 1.200€ refere-se apenas à retribuição base mensal. O subsídio de alimentação é um complemento separado, normalmente pago em cartão refeição (isento de impostos até 10,46€/dia) ou em dinheiro (tributado acima de 6,15€/dia)." },
      { pergunta: "Qual a diferença entre 1.200€ brutos e líquidos?", resposta: `A diferença é de ${e(r.grossMonthly - r.netMonthly)} mensais. De 1.200€ brutos, são descontados ${e(r.tsuEmployee)} de Segurança Social e ${e(r.retencaoMensal)} de retenção na fonte de IRS, resultando em ${e(r.netMonthly)} líquidos.` },
    ],
  }),
  "1500": (r) => ({
    descricao: `Um salário de 1.500€ brutos mensais é um valor de referência importante em Portugal, correspondendo a cerca de ${vezesSMN(1500)} vezes o salário mínimo. É comum em funções técnicas, profissionais qualificados e quadros intermédios.`,
    contexto: `Com 1.500€ brutos, o trabalhador solteiro recebe ${e(r.netMonthly)} líquidos mensais, após descontos de ${e(r.tsuEmployee)} de TSU e ${e(r.retencaoMensal)} de retenção na fonte (${p(r.retencaoTaxa)}). O custo total para o empregador é de ${e(r.custoEmpregadorMensal)} mensais.`,
    faq: [
      { pergunta: "Quanto recebo líquido com um salário de 1.500€ brutos?", resposta: `Com 1.500€ brutos mensais, um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos. Os descontos totalizam ${e(r.grossMonthly - r.netMonthly)}: ${e(r.tsuEmployee)} de TSU (11%) e ${e(r.retencaoMensal)} de retenção de IRS (${p(r.retencaoTaxa)}).` },
      { pergunta: "Quanto custa à empresa um funcionário com 1.500€ brutos?", resposta: `O custo mensal total para o empregador é de ${e(r.custoEmpregadorMensal)} (1.500€ brutos + ${e(r.tsuEmployer)} de TSU patronal a 23,75%). Anualmente, incluindo 14 meses, o custo ascende a ${e(r.custoEmpregadorAnual)}.` },
      { pergunta: "Qual o IRS anual com 1.500€ brutos mensais?", resposta: `O IRS anual estimado para um trabalhador solteiro sem dependentes com 1.500€ brutos mensais é de ${e(r.irsAnnual)}, antes das deduções por despesas, o que corresponde a uma taxa efetiva de cerca de ${p(r.irsAnnual / r.grossAnnual)}.` },
    ],
  }),
  "1800": (r) => ({
    descricao: "O salário de 1.800€ brutos posiciona-se acima da média salarial portuguesa. É típico de profissionais com experiência, funções técnicas especializadas ou cargos de supervisão.",
    contexto: `Com 1.800€ brutos, o trabalhador solteiro recebe ${e(r.netMonthly)} líquidos após descontos de ${e(r.tsuEmployee)} de TSU e ${e(r.retencaoMensal)} de retenção na fonte (${p(r.retencaoTaxa)}). O rendimento líquido anual, com subsídios, é de ${e(r.netAnnual)}.`,
    faq: [
      { pergunta: "Qual o salário líquido mensal de 1.800€ brutos?", resposta: `Um trabalhador solteiro sem dependentes com 1.800€ brutos recebe ${e(r.netMonthly)} líquidos por mês. A retenção na fonte é de ${p(r.retencaoTaxa)} (${e(r.retencaoMensal)}) e a TSU é de 11% (${e(r.tsuEmployee)}).` },
      { pergunta: "Quanto pago de IRS com 1.800€ brutos?", resposta: `A retenção mensal na fonte é de ${e(r.retencaoMensal)} (${p(r.retencaoTaxa)}). Anualmente, o IRS estimado é de ${e(r.irsAnnual)}. O valor final do imposto é apurado na declaração anual de IRS.` },
      { pergunta: "Quanto recebo de subsídio de Natal com 1.800€ brutos?", resposta: `O subsídio de Natal bruto é de 1.800€. Após descontos de TSU (${e(r.tsuEmployee)}) e de retenção de IRS, calculada em separado com a mesma tabela, o valor líquido do subsídio de Natal é de ${e(r.subsidioNatalLiquido)}.` },
    ],
  }),
  "2000": (r, c) => {
    const a = c(1500);
    return {
      descricao: `Um salário de 2.000€ brutos mensais é um marco importante para muitos trabalhadores portugueses. Corresponde a ${vezesSMN(2000)} vezes o salário mínimo e é comum em quadros médios, profissões liberais e setores especializados.`,
      contexto: `Com 2.000€ brutos, o trabalhador solteiro recebe ${e(r.netMonthly)} líquidos mensais. A retenção na fonte sobe para ${p(r.retencaoTaxa)}, com ${e(r.retencaoMensal)} retidos mensalmente. O custo total para o empregador atinge ${e(r.custoEmpregadorMensal)} por mês.`,
      faq: [
        { pergunta: "Quanto fica de líquido com 2.000€ brutos em Portugal?", resposta: `Com um salário bruto de 2.000€, um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos por mês. Os descontos incluem ${e(r.tsuEmployee)} de TSU (11%) e ${e(r.retencaoMensal)} de retenção de IRS (${p(r.retencaoTaxa)}).` },
        { pergunta: "Qual a percentagem de descontos sobre 2.000€ brutos?", resposta: `Os descontos totais representam cerca de ${p(0.11 + r.retencaoTaxa)} do salário bruto: 11% para a Segurança Social (${e(r.tsuEmployee)}) e ${p(r.retencaoTaxa)} para retenção na fonte de IRS (${e(r.retencaoMensal)}). Ao todo, são descontados ${e(r.grossMonthly - r.netMonthly)} mensais.` },
        { pergunta: "Compensa pedir aumento de 1.500€ para 2.000€ brutos?", resposta: `Sim. Apesar de a retenção subir de ${p(a.retencaoTaxa)} para ${p(r.retencaoTaxa)}, o ganho líquido mensal é de ${e(r.netMonthly - a.netMonthly)} (de ${e(a.netMonthly)} para ${e(r.netMonthly)}). Num aumento de 500€ brutos, recebe efetivamente mais ${e(r.netMonthly - a.netMonthly)} líquidos por mês.` },
      ],
    };
  },
  "2500": (r) => ({
    descricao: "O salário de 2.500€ brutos mensais coloca o trabalhador acima da média nacional. É um valor típico de quadros superiores, profissionais de tecnologia, engenharia e gestão em Portugal.",
    contexto: `Com 2.500€ brutos, o líquido mensal é de ${e(r.netMonthly)} para um solteiro sem dependentes, após descontos de ${e(r.tsuEmployee)} de TSU e ${e(r.retencaoMensal)} de retenção na fonte (${p(r.retencaoTaxa)}). O rendimento líquido anual atinge ${e(r.netAnnual)}.`,
    faq: [
      { pergunta: "Quanto recebo líquido com 2.500€ brutos mensais?", resposta: `Um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos por mês com um salário bruto de 2.500€. Os descontos são de ${e(r.tsuEmployee)} (TSU) e ${e(r.retencaoMensal)} (IRS, ${p(r.retencaoTaxa)} do bruto).` },
      { pergunta: "Qual o escalão de IRS para 2.500€ brutos?", resposta: `Com um rendimento bruto anual de ${e(r.grossAnnual)} (14 meses), após dedução específica, o rendimento coletável situa-se no ${escalao(r).ordem}.º escalão de IRS (taxa marginal de ${escalao(r).taxa}). Contudo, a taxa efetiva é bastante inferior.` },
      { pergunta: "Quanto é o líquido anual incluindo subsídios?", resposta: `O rendimento líquido anual com 2.500€ brutos, incluindo os subsídios de Natal e férias (líquidos de descontos), é de ${e(r.netAnnual)}.` },
    ],
  }),
  "3000": (r) => ({
    descricao: `Um salário de 3.000€ brutos é considerado elevado em Portugal, correspondendo a mais de 3 vezes o salário mínimo. É habitual em cargos de direção, consultoria, TI sénior e profissões altamente qualificadas.`,
    contexto: `Com 3.000€ brutos, o trabalhador solteiro recebe ${e(r.netMonthly)} líquidos mensais. A retenção na fonte sobe para ${p(r.retencaoTaxa)} (${e(r.retencaoMensal)}) e a TSU mantém-se em 11% (${e(r.tsuEmployee)}). O custo para o empregador é de ${e(r.custoEmpregadorMensal)} por mês.`,
    faq: [
      { pergunta: "Qual o salário líquido de 3.000€ brutos em 2026?", resposta: `Com 3.000€ brutos mensais, um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos. Os descontos totalizam ${e(r.grossMonthly - r.netMonthly)}: ${e(r.tsuEmployee)} de TSU e ${e(r.retencaoMensal)} de retenção na fonte (${p(r.retencaoTaxa)}).` },
      { pergunta: "Quanto pago de impostos com 3.000€ brutos?", resposta: `A retenção mensal na fonte é de ${e(r.retencaoMensal)} (${p(r.retencaoTaxa)}). Anualmente, o IRS estimado é de ${e(r.irsAnnual)}. Somando a TSU anual de ${e(r.tsuEmployeeAnnual)}, os descontos totais anuais rondam os ${e(Math.round(r.irsAnnual + r.tsuEmployeeAnnual))}.` },
      { pergunta: "Qual o custo para a empresa de 3.000€ brutos?", resposta: `O custo mensal total para o empregador é de ${e(r.custoEmpregadorMensal)} (3.000€ + ${e(r.tsuEmployer)} de TSU patronal). Anualmente, o custo ascende a ${e(r.custoEmpregadorAnual)}, incluindo 14 meses.` },
    ],
  }),
  "3500": (r, c) => {
    const liquidoPorEuro = Math.round((c(3600).netMonthly - r.netMonthly)) ;
    return {
      descricao: "O salário de 3.500€ brutos coloca o trabalhador no topo da distribuição salarial portuguesa. É frequente em cargos de gestão sénior, direção e especialidades muito procuradas como medicina, engenharia e tecnologia.",
      contexto: `Com 3.500€ brutos, o líquido mensal é de ${e(r.netMonthly)} após descontos de ${e(r.tsuEmployee)} de TSU e ${e(r.retencaoMensal)} de retenção na fonte (${p(r.retencaoTaxa)}). O rendimento líquido anual, incluindo subsídios, atinge ${e(r.netAnnual)}.`,
      faq: [
        { pergunta: "Quanto recebo líquido com 3.500€ brutos?", resposta: `Um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos por mês com um salário de 3.500€ brutos. A retenção na fonte é de ${p(r.retencaoTaxa)}, resultando em descontos totais de ${e(r.grossMonthly - r.netMonthly)}.` },
        { pergunta: "Quantos por cento desconto com 3.500€ brutos?", resposta: `Os descontos totalizam ${p(0.11 + r.retencaoTaxa)} do salário bruto: 11% de TSU (${e(r.tsuEmployee)}) e ${p(r.retencaoTaxa)} de retenção na fonte de IRS (${e(r.retencaoMensal)}). Fica com ${p(1 - 0.11 - r.retencaoTaxa)} do valor bruto.` },
        { pergunta: "Compensa negociar benefícios em vez de aumento?", resposta: `A este nível, cada 100 euros adicionais de salário bruto rendem cerca de ${liquidoPorEuro} euros líquidos, porque a retenção marginal é bem superior à retenção média. Benefícios como seguro de saúde, cartão refeição ou contribuições para PPR podem ser fiscalmente mais eficientes.` },
      ],
    };
  },
  "4000": (r) => ({
    descricao: "Um salário de 4.000€ brutos mensais é considerado muito elevado no contexto português, situando-se no top 10% dos rendimentos. É típico de diretores, gestores sénior, médicos especialistas e profissionais de TI altamente qualificados.",
    contexto: `Com 4.000€ brutos, o trabalhador solteiro recebe ${e(r.netMonthly)} líquidos mensais. A retenção na fonte atinge ${p(r.retencaoTaxa)} (${e(r.retencaoMensal)}) e a TSU é de ${e(r.tsuEmployee)}. O custo para o empregador sobe para ${e(r.custoEmpregadorMensal)} mensais.`,
    faq: [
      { pergunta: "Qual o líquido de 4.000€ brutos em Portugal?", resposta: `Com 4.000€ brutos, um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos mensais. Os descontos totais são de ${e(r.grossMonthly - r.netMonthly)}: ${e(r.tsuEmployee)} de TSU e ${e(r.retencaoMensal)} de retenção na fonte (${p(r.retencaoTaxa)}).` },
      { pergunta: "Quanto pago de IRS com 4.000€ brutos?", resposta: `O IRS anual estimado é de ${e(r.irsAnnual)}. A retenção mensal na fonte é de ${e(r.retencaoMensal)} (${p(r.retencaoTaxa)}). Na declaração anual, o valor retido é confrontado com o imposto efetivamente devido.` },
      { pergunta: "Como reduzir impostos com salário de 4.000€?", resposta: "As principais estratégias incluem: maximizar deduções (saúde, educação, habitação), ter dependentes no agregado familiar, contribuir para PPR, e verificar se é elegível para o IRS Jovem. Consulte um contabilista para otimizar a sua situação fiscal." },
    ],
  }),
  "5000": (r) => ({
    descricao: "O salário de 5.000€ brutos mensais coloca o trabalhador entre os rendimentos mais elevados em Portugal. É habitual em cargos de direção executiva, profissões altamente especializadas e setores como banca, farmacêutica e tecnologia.",
    contexto: `Com 5.000€ brutos, o trabalhador solteiro recebe ${e(r.netMonthly)} líquidos mensais, com uma retenção de ${p(r.retencaoTaxa)}. Os descontos mensais totalizam ${e(r.grossMonthly - r.netMonthly)} (${e(r.tsuEmployee)} de TSU + ${e(r.retencaoMensal)} de IRS). O custo para o empregador é de ${e(r.custoEmpregadorMensal)} por mês.`,
    faq: [
      { pergunta: "Quanto recebo líquido com 5.000€ brutos?", resposta: `Com um salário de 5.000€ brutos, um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos por mês. Isto representa ${p(r.netMonthly / r.grossMonthly)} do valor bruto, sendo descontados ${p(1 - r.netMonthly / r.grossMonthly)} entre TSU e IRS.` },
      { pergunta: "Qual o escalão de IRS para 5.000€ brutos?", resposta: `Com um rendimento bruto anual de ${e(r.grossAnnual)} (14 meses), após dedução das contribuições sociais, o rendimento coletável situa-se no ${escalao(r).ordem}.º escalão de IRS (taxa marginal de ${escalao(r).taxa}). A taxa efetiva, no entanto, é substancialmente inferior.` },
      { pergunta: "Qual o líquido anual com 5.000€ brutos?", resposta: `O rendimento líquido anual, incluindo os subsídios de Natal e férias após descontos, é de ${e(r.netAnnual)}. O custo anual total para o empregador é de ${e(r.custoEmpregadorAnual)}.` },
    ],
  }),
  "7000": (r) => ({
    descricao: "O salário de 7.000€ brutos mensais representa o topo da pirâmide salarial portuguesa. É típico de CEO, diretores-gerais, parceiros de escritórios de advogados, médicos especialistas em prática privada e profissionais de tecnologia em multinacionais.",
    contexto: `Com 7.000€ brutos, o trabalhador solteiro recebe ${e(r.netMonthly)} líquidos mensais. A retenção na fonte atinge ${p(r.retencaoTaxa)} (${e(r.retencaoMensal)}) e a TSU é de ${e(r.tsuEmployee)}. Os descontos totais representam ${p(1 - r.netMonthly / r.grossMonthly)} do salário bruto. O custo para o empregador é de ${e(r.custoEmpregadorMensal)} por mês.`,
    faq: [
      { pergunta: "Quanto recebo líquido com 7.000€ brutos?", resposta: `Com 7.000€ brutos mensais, um trabalhador solteiro sem dependentes recebe ${e(r.netMonthly)} líquidos. Os descontos totalizam ${e(r.grossMonthly - r.netMonthly)} por mês: ${e(r.tsuEmployee)} de TSU (11%) e ${e(r.retencaoMensal)} de retenção na fonte (${p(r.retencaoTaxa)}).` },
      { pergunta: "Qual a taxa efetiva de IRS com 7.000€ brutos?", resposta: `O IRS anual estimado é de ${e(r.irsAnnual)} sobre um rendimento bruto anual de ${e(r.grossAnnual)} (14 meses), resultando numa taxa efetiva de ${p(r.irsAnnual / r.grossAnnual)}. A retenção na fonte representa ${p(r.retencaoTaxa)} do salário bruto.` },
      { pergunta: "Quanto custa 7.000€ brutos ao empregador?", resposta: `O custo mensal total para a empresa é de ${e(r.custoEmpregadorMensal)} (7.000€ + ${e(r.tsuEmployer)} de TSU patronal). Anualmente, o custo atinge ${e(r.custoEmpregadorAnual)}, incluindo 14 meses.` },
    ],
  }),
};

export const SALARIOS: SalarioEntry[] = Object.entries(TEXTOS).map(([slug, textos]) => {
  const brutoMensal = Number(slug);
  const r = calc(brutoMensal);
  return {
    slug,
    brutoMensal,
    liquidoMensal: r.netMonthly,
    tsuTrabalhador: r.tsuEmployee,
    retencaoMensal: r.retencaoMensal,
    retencaoTaxa: r.retencaoTaxa,
    irsAnual: r.irsAnnual,
    liquidoAnual: r.netAnnual,
    custoEmpregadorMensal: r.custoEmpregadorMensal,
    ...textos(r, calc),
  };
});
