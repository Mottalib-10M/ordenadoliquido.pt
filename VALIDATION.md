# VALIDATION — salarioliquido.pt

## Project Overview
Portuguese salary calculator (Calculadora de Salário Líquido) for 2026, built with Astro 5, React 19, and Tailwind v4.

## File Structure

```
salarioliquido.pt/
├── package.json                  # Project config (name: salarioliquido-pt)
├── tsconfig.json                 # TypeScript strict config
├── astro.config.mjs              # Astro 5 + React + Sitemap + Tailwind v4
├── vitest.config.ts              # Vitest test runner config
├── .gitignore                    # Git ignore rules
├── VALIDATION.md                 # This file
├── public/
│   ├── robots.txt                # Search engine directives
│   ├── llms.txt                  # LLM-readable site description
│   └── favicon.svg               # Green/red Portuguese favicon
└── src/
    ├── env.d.ts                  # Astro type reference
    ├── styles/
    │   └── global.css            # Tailwind v4 + Portuguese color theme
    ├── lib/
    │   ├── baremes-2026.ts       # Tax brackets, TSU, withholding tables
    │   ├── engine.ts             # Salary calculation engine
    │   └── engine.test.ts        # 17 unit tests
    ├── components/
    │   └── SalaryCalculator.tsx  # React interactive calculator
    ├── layouts/
    │   └── Layout.astro          # Base layout (lang=pt, Schema.org)
    └── pages/
        ├── index.astro           # Homepage + calculator + SEO content
        ├── faq/
        │   └── index.astro       # FAQ page (10 questions)
        ├── legal/
        │   └── index.astro       # Legal notices page
        └── privacidade/
            └── index.astro       # Privacy policy (RGPD)
```

## Tax Data (baremes-2026.ts)

| Feature | Value | Status |
|---------|-------|--------|
| IRS Brackets | 9 escalões (13.25% → 48%) | Implemented |
| TSU Employee | 11% | Implemented |
| TSU Employer | 23.75% | Implemented |
| Specific Deduction | €4,104 | Implemented |
| Family Deduction | €250/person | Implemented |
| Minimum Wage | €870/month | Implemented |
| Withholding Tables | 17 brackets × 3 statuses × 6 dep levels | Implemented |
| IRS Jovem | 5 years, declining exemption | Implemented |
| Subsídio de Natal | Mandatory, avg rate tax | Implemented |
| Subsídio de Férias | Mandatory, normal withholding | Implemented |

## Engine Functions (engine.ts)

| Function | Description |
|----------|-------------|
| `calculateTSU(grossMonthly)` | Social security contributions |
| `calculateIRS(annualTaxable, maritalStatus, dependents)` | Progressive income tax |
| `calculateRetencao(grossMonthly, maritalStatus, dependents)` | Monthly withholding |
| `calculateSalary(input)` | Full gross→net calculation |

## Types

- `SalaryInput`: grossMonthly, maritalStatus, dependents, irsJovem
- `SalaryResult`: 25+ fields covering all calculation details

## Tests (engine.test.ts)

17 tests across 4 test suites:
- `calculateTSU`: 4 tests (employee rate, employer rate, zero, minimum wage)
- `calculateIRS`: 4 tests (zero, negative, first bracket, progressive, dependents, top bracket)
- `calculateRetencao`: 4 tests (minimum wage, above minimum, casado vs solteiro, dependents)
- `calculateSalary`: 5 tests (net < gross, 14 months, subsidies, employer cost, IRS Jovem, deductions, minimum wage)

## SEO & Accessibility

- [x] `lang="pt"` on HTML element
- [x] Schema.org WebApplication markup
- [x] Open Graph and Twitter meta tags
- [x] Canonical URLs on all pages
- [x] Sitemap generation via @astrojs/sitemap
- [x] robots.txt with sitemap reference
- [x] llms.txt for AI crawlers
- [x] Semantic HTML structure
- [x] 1500+ words of Portuguese educational content on homepage
- [x] Mobile-responsive design (Tailwind)

## Build Validation

- [ ] `npm install` — dependencies installed
- [ ] `npm test` — all 17 tests pass
- [ ] `npm run build` — production build succeeds
- [ ] Git commit created
- [ ] Pushed to GitHub
