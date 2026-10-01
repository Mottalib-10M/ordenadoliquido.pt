/** Mini-simuladores dos guias (RECETTE §9.3), calculados pelo motor salarial português. */
import { calculateSalary, calculateIRS, calculateRetencao } from './engine';
import type { MiniSpec } from './mini-types';

const eur = (x: number, d = 2) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: d, maximumFractionDigits: d }).format(x);
const pct = (x: number) => new Intl.NumberFormat('pt-PT', { style: 'percent', maximumFractionDigits: 1 }).format(x > 1 ? x / 100 : x);
const bruto = (def = 1500) => ({ id: 'b', label: 'Salário bruto mensal', def, unit: '€', max: 100000 });
const ESTADO = { id: 'e', label: 'Situação', def: 0, options: [{ value: '0', label: 'Não casado' }, { value: '1', label: 'Casado, único titular' }, { value: '2', label: 'Casado, dois titulares' }] };
const dep = { id: 'd', label: 'Dependentes', def: 0, unit: '', max: 10 };
const EC = ['solteiro', 'casado1titular', 'casado2titulares'] as const;
const S = (b: number, e = 0, d = 0) => calculateSalary({ grossMonthly: b, maritalStatus: EC[e] ?? 'solteiro', dependents: d, irsJovem: 0 });

const SPECS: Record<string, MiniSpec> = {
  liquido: { title: 'Calcule o seu salário líquido', cta: 'Simulador completo', inputs: [bruto(), ESTADO, dep], run: ({ b, e, d }) => {
    const r = S(b, e, d); return { head: ['Salário líquido por mês', eur(r.netMonthly)], rows: [['Segurança Social (11 %)', eur(r.tsuEmployee)], ['Retenção na fonte de IRS', eur(r.retencaoMensal)], ['Líquido por ano, 14 meses', eur(r.netAnnual, 0)]] };
  } },
  retencao: { title: 'Quanto IRS é retido no seu recibo?', cta: 'Simulador completo', inputs: [bruto(), ESTADO, dep], run: ({ b, e, d }) => {
    const ret = calculateRetencao(b, EC[e] ?? 'solteiro', d); const r = S(b, e, d); return { head: ['Retenção mensal de IRS', eur(ret)], rows: [['Taxa efetiva de retenção', pct(b ? ret / b : 0)], ['IRS anual estimado', eur(r.irsAnnual, 0)]] };
  } },
  escaloes: { title: 'IRS anual pelo seu rendimento coletável', cta: 'Simulador completo', inputs: [{ id: 'c', label: 'Rendimento coletável anual', def: 20000, unit: '€', max: 5000000 }], run: ({ c }) => {
    const t = calculateIRS(c, 'solteiro', 0); return { head: ['IRS anual', eur(t, 0)], rows: [['Taxa média', pct(c ? t / c : 0)], ['Por mês, em 14 prestações', eur(t / 14)]] };
  } },
  deducoes: { title: 'Quanto valem os seus dependentes no IRS?', cta: 'Simulador completo', inputs: [bruto(1800), { id: 'd', label: 'Dependentes', def: 2, unit: '', max: 10 }], run: ({ b, d }) => {
    const a = S(b, 0, 0); const x = S(b, 0, d); return { head: ['IRS poupado por ano', eur(a.irsAnnual - x.irsAnnual, 0)], rows: [['IRS sem dependentes', eur(a.irsAnnual, 0)], ['IRS com dependentes', eur(x.irsAnnual, 0)]] };
  } },
  subsidios: { title: 'Os seus subsídios de Natal e de férias', cta: 'Simulador completo', inputs: [bruto()], run: ({ b }) => {
    const r = S(b); return { head: ['Subsídio de Natal líquido', eur(r.subsidioNatalLiquido)], rows: [['Subsídio de férias líquido', eur(r.subsidioFeriasLiquido)], ['Cada subsídio bruto', eur(r.subsidioNatalBruto)]] };
  } },
  tsu: { title: 'A TSU no seu salário', cta: 'Simulador completo', inputs: [bruto()], run: ({ b }) => {
    const r = S(b); return { head: ['Custo total para a empresa por mês', eur(r.custoEmpregadorMensal)], rows: [['TSU do trabalhador (11 %)', eur(r.tsuEmployee)], ['TSU da empresa (23,75 %)', eur(r.tsuEmployer)], ['Custo anual, 14 meses', eur(r.custoEmpregadorAnual, 0)]] };
  } },
};

export function getSpec(kind: string, _lang?: string): MiniSpec {
  const s = SPECS[kind]; if (!s) throw new Error(`Mini-simulador desconhecido: ${kind}`); return s;
}
