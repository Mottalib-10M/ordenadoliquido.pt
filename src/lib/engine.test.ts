import { describe, it, expect } from "vitest";
import { calculateTSU, calculateIRS, calculateRetencao, calculateSalary } from "./engine";
import {
  TSU_TRABALHADOR,
  TSU_EMPREGADOR,
  SALARIO_MINIMO_2026,
  DEDUCAO_ESPECIFICA,
} from "./baremes-2026";

/* ═══════════════════════ TSU Tests ═══════════════════════ */

describe("calculateTSU", () => {
  it("should calculate employee TSU at 11%", () => {
    const result = calculateTSU(1000);
    expect(result.employee).toBe(110);
  });

  it("should calculate employer TSU at 23.75%", () => {
    const result = calculateTSU(1000);
    expect(result.employer).toBe(237.5);
  });

  it("should return 0 for zero gross", () => {
    const result = calculateTSU(0);
    expect(result.employee).toBe(0);
    expect(result.employer).toBe(0);
  });

  it("should handle minimum wage correctly", () => {
    const result = calculateTSU(SALARIO_MINIMO_2026);
    expect(result.employee).toBe(Math.round(SALARIO_MINIMO_2026 * TSU_TRABALHADOR * 100) / 100);
    expect(result.employer).toBe(Math.round(SALARIO_MINIMO_2026 * TSU_EMPREGADOR * 100) / 100);
  });
});

/* ═══════════════════════ IRS Tests ═══════════════════════ */

describe("calculateIRS", () => {
  it("should return 0 for zero income", () => {
    expect(calculateIRS(0, "solteiro", 0)).toBe(0);
  });

  it("should return 0 for negative income", () => {
    expect(calculateIRS(-1000, "solteiro", 0)).toBe(0);
  });

  it("should apply 12.5% for the first bracket, less the 250 € general deduction", () => {
    const result = calculateIRS(5000, "solteiro", 0);
    expect(result).toBe(5000 * 0.125 - 250);
  });

  it("should apply progressive rates for higher income", () => {
    const result = calculateIRS(10000, "solteiro", 0);
    // 10000 * 0.157 - 266.94 (parcela a abater) - 250 = 1053.06
    expect(result).toBe(1053.06);
  });

  it("should reduce tax by dependent deduction", () => {
    const withoutDeps = calculateIRS(20000, "solteiro", 0);
    const withDeps = calculateIRS(20000, "solteiro", 2);
    expect(withDeps).toBe(withoutDeps - 1200); // 2 * 600
  });

  it("should handle the top bracket (>86,634)", () => {
    const result = calculateIRS(100_000, "solteiro", 0);
    // 100000 * 0.48 - 11387.28 (parcela a abater) - 250
    expect(result).toBeCloseTo(36362.72, 1);
  });

  it("applies the conjugal quotient for a married single earner", () => {
    // 30000 / 2 = 15000 : 15000 * 0.212 - 959.23 = 2220.77 ; x 2 = 4441.54 ; less 2 x 250
    expect(calculateIRS(30_000, "casado1titular", 0)).toBeCloseTo(3941.54, 1);
  });
});

/* ═══════════════════════ Retenção Tests ═══════════════════════ */

describe("calculateRetencao", () => {
  it("should return 0 for minimum wage solteiro 0 deps", () => {
    const result = calculateRetencao(870, "solteiro", 0);
    expect(result).toBe(0);
  });

  it("should return non-zero for salaries above minimum wage", () => {
    const result = calculateRetencao(1500, "solteiro", 0);
    expect(result).toBeGreaterThan(0);
  });

  it("should return lower withholding for casado1titular", () => {
    const solteiro = calculateRetencao(2000, "solteiro", 0);
    const casado = calculateRetencao(2000, "casado1titular", 0);
    expect(casado).toBeLessThan(solteiro);
  });

  it("should reduce withholding with more dependents", () => {
    const noDeps = calculateRetencao(2000, "solteiro", 0);
    const withDeps = calculateRetencao(2000, "solteiro", 2);
    expect(withDeps).toBeLessThan(noDeps);
  });
});

/* ═══════════════════════ Full Calculation Tests ═══════════════════════ */

describe("calculateSalary", () => {
  it("should calculate net < gross", () => {
    const result = calculateSalary({
      grossMonthly: 1500,
      maritalStatus: "solteiro",
      dependents: 0,
      irsJovem: 0,
    });
    expect(result.netMonthly).toBeLessThan(result.grossMonthly);
  });

  it("should have 14 months of gross annually", () => {
    const result = calculateSalary({
      grossMonthly: 1000,
      maritalStatus: "solteiro",
      dependents: 0,
      irsJovem: 0,
    });
    expect(result.grossAnnual).toBe(14000);
  });

  it("should have subsidio natal equal to gross monthly", () => {
    const result = calculateSalary({
      grossMonthly: 2000,
      maritalStatus: "solteiro",
      dependents: 0,
      irsJovem: 0,
    });
    expect(result.subsidioNatalBruto).toBe(2000);
    expect(result.subsidioFeriasBruto).toBe(2000);
  });

  it("should include employer cost with TSU", () => {
    const result = calculateSalary({
      grossMonthly: 1000,
      maritalStatus: "solteiro",
      dependents: 0,
      irsJovem: 0,
    });
    expect(result.custoEmpregadorMensal).toBe(1000 + 237.5);
  });

  it("should apply IRS Jovem discount in year 1", () => {
    const normal = calculateSalary({
      grossMonthly: 1500,
      maritalStatus: "solteiro",
      dependents: 0,
      irsJovem: 0,
    });
    const jovem = calculateSalary({
      grossMonthly: 1500,
      maritalStatus: "solteiro",
      dependents: 0,
      irsJovem: 1,
    });
    expect(jovem.irsJovemDesconto).toBeGreaterThan(0);
    expect(jovem.irsAnnual).toBeLessThan(normal.irsAnnual);
  });

  it("should have the 2026 specific deduction (8,54 x IAS)", () => {
    const result = calculateSalary({
      grossMonthly: 2000,
      maritalStatus: "solteiro",
      dependents: 0,
      irsJovem: 0,
    });
    expect(result.deducaoEspecifica).toBe(DEDUCAO_ESPECIFICA);
  });

  it("should handle minimum wage correctly", () => {
    const result = calculateSalary({
      grossMonthly: SALARIO_MINIMO_2026,
      maritalStatus: "solteiro",
      dependents: 0,
      irsJovem: 0,
    });
    expect(result.retencaoMensal).toBe(0);
    expect(result.netMonthly).toBe(SALARIO_MINIMO_2026 - result.tsuEmployee);
    expect(result.netMonthly).toBe(818.8);
  });

  it("follows the official 2026 withholding tables (Despacho n.º 233-A/2026)", () => {
    // Tabela I, 1 819 € : 1819 x 24,10 % - 193,33 = 245,04 (taxa efetiva 13,5 %)
    expect(calculateRetencao(1819, "solteiro", 0)).toBeCloseTo(245.04, 1);
    // Tabela I, 1 042 € : 12,5 % x 1042 - 12,5 % x 2,60 x (1273,85 - 1042) = 54,90 (5,3 %)
    expect(calculateRetencao(1042, "solteiro", 0)).toBeCloseTo(54.9, 1);
    // Tabela II : 34,29 € por dependente
    expect(calculateRetencao(1819, "solteiro", 1)).toBeCloseTo(245.04 - 34.29, 1);
    // Tabela III, 1 432 € : 1432 x 12,72 % - 98,64 = 83,51 (5,8 %)
    expect(calculateRetencao(1432, "casado1titular", 0)).toBeCloseTo(83.51, 1);
    // Três dependentes : taxa marginal menos um ponto
    expect(calculateRetencao(3000, "casado2titulares", 3)).toBeCloseTo(3000 * 0.3736 - 487.66 - 3 * 21.43, 1);
  });
});
