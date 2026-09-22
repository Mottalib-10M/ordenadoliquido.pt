# VALIDATION — ordenadoliquido.pt

## Metodologia

Os cálculos deste simulador baseiam-se nos escalões de IRS, taxas de TSU e tabelas de retenção na fonte oficiais para 2026.

**Fontes oficiais:**
- [Autoridade Tributária e Aduaneira](https://www.portaldasfinancas.gov.pt)
- [Segurança Social](https://www.seg-social.pt)
- Código do IRS (escalões e deduções)

---

## Caso de validação n.°1 — Solteiro, sem dependentes, 1 500 € bruto

**Dados de entrada:**
- Salário bruto mensal: 1 500 €
- Estado civil: Solteiro
- Dependentes: 0
- IRS Jovem: Não

**Cálculo esperado:**
1. TSU empregado (11%): 1 500 × 0,11 = **165,00 €**
2. Base tributável mensal: 1 500 − 165 = **1 335,00 €**
3. Retenção na fonte IRS (tabela): ~**195 €** (taxa marginal ~14,5%)
4. **Salário líquido mensal:** 1 500 − 165 − 195 = **~1 140 €**

---

## Caso de validação n.°2 — Casado, 2 titulares, 2 dependentes, 2 500 € bruto

**Dados de entrada:**
- Salário bruto mensal: 2 500 €
- Estado civil: Casado, 2 titulares
- Dependentes: 2

**Cálculo esperado:**
1. TSU empregado (11%): 2 500 × 0,11 = **275,00 €**
2. Base tributável mensal: 2 500 − 275 = **2 225,00 €**
3. Retenção na fonte IRS (tabela casado 2 tit., 2 dep.): ~**385 €**
4. **Salário líquido mensal:** 2 500 − 275 − 385 = **~1 840 €**

---

## Caso de validação n.°3 — IRS Jovem, 1 200 € bruto

**Dados de entrada:**
- Salário bruto mensal: 1 200 €
- Estado civil: Solteiro
- IRS Jovem: Sim (1.° ano)

**Cálculo esperado:**
1. TSU empregado (11%): 1 200 × 0,11 = **132,00 €**
2. Isenção parcial IRS Jovem (1.° ano): redução significativa da retenção
3. **Salário líquido superior** ao cenário sem IRS Jovem

---

## Build status

- **Build:** 29 pages, 0 errors
- **Tests:** 21/21 passed
- **Sitemap:** auto-generated (sitemap-index.xml)

## Page inventory (29 pages)

| Category | Count | Details |
|---|---|---|
| Home + legal | 3 | index, legal, privacidade |
| Tool pages | 1 | faq |
| Guides index | 1 | /guides/ |
| Guide articles | 8 | escaloes-irs-2026, taxa-social-unica-tsu, irs-jovem-2026, subsidio-natal-ferias, retencao-na-fonte, deducoes-irs, salario-minimo-portugal, recibos-verdes-vs-conta-outrem |
| Salary pages | 12 | salario-[bruto]-bruto-liquido (12 salary levels) |
| Situation pages | 4 | simulador-[situacao] (solteiro, casado-1-titular, casado-2-titulares, irs-jovem) |

## Components

- SalaryCalculator.tsx (Portuguese gross-to-net calculator with IRS Jovem)

## Data files

- baremes-2026.ts — IRS brackets, TSU rates, withholding tables, IRS Jovem
- salarios-data.ts — 12 salary entries with pre-calculated examples
- situacoes-data.ts — 4 situation entries (marital status variants)

## Quality gates

- [x] Build passes (29 pages, 0 errors)
- [x] Tests pass (21/21)
- [x] Sitemap generated
- [x] Schema.org on every page (WebApplication, FAQPage, BreadcrumbList)
- [x] Analytics: Plausible + GA4 placeholder
- [x] robots.txt present
- [x] llms.txt present
- [x] All guide pages > 1500 words
- [x] Disclaimer in footer
- [x] Mobile-responsive navigation (hamburger menu)
- [x] Internal cross-linking between tools and guides
