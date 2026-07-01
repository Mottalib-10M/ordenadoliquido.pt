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
    expect(result.employee).toBe(Math.round(870 * TSU_TRABALHADOR * 100) / 100);
    expect(result.employer).toBe(Math.round(870 * TSU_EMPREGADOR * 100) / 100);
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

  it("should apply 13.25% for the first bracket", () => {
    const result = calculateIRS(5000, "solteiro", 0);
    expect(result).toBe(Math.round(5000 * 0.1325 * 100) / 100);
  });

  it("should apply progressive rates for higher income", () => {
    const result = calculateIRS(10000, "solteiro", 0);
    // 10000 * 0.18 - 365.89 = 1800 - 365.89 = 1434.11
    expect(result).toBe(1434.11);
  });

  it("should reduce tax by dependent deduction", () => {
    const withoutDeps = calculateIRS(20000, "solteiro", 0);
    const withDeps = calculateIRS(20000, "solteiro", 2);
    expect(withDeps).toBe(withoutDeps - 500); // 2 * 250
  });

  it("should handle the top bracket (>81,199)", () => {
    const result = calculateIRS(100_000, "solteiro", 0);
    // 100000 * 0.48 - 8835.57 = 48000 - 8835.57 = 39164.43
    expect(result).toBe(39164.43);
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

  it("should have deducao especifica of 4104", () => {
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
    expect(result.netMonthly).toBe(870 - result.tsuEmployee);
  });
});
