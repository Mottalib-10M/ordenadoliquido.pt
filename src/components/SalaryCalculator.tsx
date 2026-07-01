import { useState, useCallback, useMemo } from "react";
import { calculateSalary, type SalaryInput, type SalaryResult } from "../lib/engine";
import { SALARIO_MINIMO_2026 } from "../lib/baremes-2026";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export default function SalaryCalculator() {
  const [grossMonthly, setGrossMonthly] = useState<number>(1500);
  const [maritalStatus, setMaritalStatus] = useState<SalaryInput["maritalStatus"]>("solteiro");
  const [dependents, setDependents] = useState<number>(0);
  const [irsJovem, setIrsJovem] = useState<number>(0);

  const input: SalaryInput = useMemo(
    () => ({ grossMonthly, maritalStatus, dependents, irsJovem }),
    [grossMonthly, maritalStatus, dependents, irsJovem]
  );

  const result: SalaryResult = useMemo(() => calculateSalary(input), [input]);

  const handleGrossChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= 0) setGrossMonthly(val);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ── Input Form ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calcular Sal&aacute;rio L&iacute;quido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salário Bruto */}
          <div>
            <label htmlFor="gross" className="block text-sm font-semibold text-neutral-700 mb-2">
              Sal&aacute;rio Bruto Mensal
            </label>
            <div className="relative">
              <input
                id="gross"
                type="number"
                min={0}
                step={50}
                value={grossMonthly}
                onChange={handleGrossChange}
                className="w-full pl-8 pr-4 py-3 border-2 border-neutral-300 rounded-xl text-lg font-semibold
                  focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold">&euro;</span>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">
              Sal&aacute;rio m&iacute;nimo 2026: {formatCurrency(SALARIO_MINIMO_2026)}
            </p>
          </div>

          {/* Estado Civil */}
          <div>
            <label htmlFor="marital" className="block text-sm font-semibold text-neutral-700 mb-2">
              Estado Civil
            </label>
            <select
              id="marital"
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value as SalaryInput["maritalStatus"])}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl text-base
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
            >
              <option value="solteiro">Solteiro / Divorciado / Vi&uacute;vo</option>
              <option value="casado1titular">Casado &mdash; &Uacute;nico Titular</option>
              <option value="casado2titulares">Casado &mdash; Dois Titulares</option>
            </select>
          </div>

          {/* Dependentes */}
          <div>
            <label htmlFor="deps" className="block text-sm font-semibold text-neutral-700 mb-2">
              N&uacute;mero de Dependentes
            </label>
            <select
              id="deps"
              value={dependents}
              onChange={(e) => setDependents(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl text-base
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "dependente" : "dependentes"}
                </option>
              ))}
            </select>
          </div>

          {/* IRS Jovem */}
          <div>
            <label htmlFor="irsJovem" className="block text-sm font-semibold text-neutral-700 mb-2">
              IRS Jovem
            </label>
            <select
              id="irsJovem"
              value={irsJovem}
              onChange={(e) => setIrsJovem(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl text-base
                focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
            >
              <option value={0}>N&atilde;o aplic&aacute;vel</option>
              <option value={1}>1.&ordm; ano &mdash; Isen&ccedil;&atilde;o 100%</option>
              <option value={2}>2.&ordm; ano &mdash; Isen&ccedil;&atilde;o 75%</option>
              <option value={3}>3.&ordm; ano &mdash; Isen&ccedil;&atilde;o 50%</option>
              <option value={4}>4.&ordm; ano &mdash; Isen&ccedil;&atilde;o 50%</option>
              <option value={5}>5.&ordm; ano &mdash; Isen&ccedil;&atilde;o 25%</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Net Monthly Card */}
        <div className="bg-primary-600 rounded-2xl shadow-lg p-6 text-white lg:col-span-1">
          <p className="text-primary-100 text-sm font-medium uppercase tracking-wide">Sal&aacute;rio L&iacute;quido Mensal</p>
          <p className="text-4xl font-extrabold mt-2">{formatCurrency(result.netMonthly)}</p>
          <p className="text-primary-200 text-sm mt-2">
            {formatPercent(result.grossMonthly > 0 ? result.netMonthly / result.grossMonthly : 0)} do bruto
          </p>
        </div>

        {/* Net Annual Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:col-span-1">
          <p className="text-neutral-500 text-sm font-medium uppercase tracking-wide">L&iacute;quido Anual (14 meses)</p>
          <p className="text-3xl font-extrabold text-neutral-900 mt-2">{formatCurrency(result.netAnnual)}</p>
          <p className="text-neutral-400 text-sm mt-2">Bruto anual: {formatCurrency(result.grossAnnual)}</p>
        </div>

        {/* Employer Cost Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 lg:col-span-1">
          <p className="text-neutral-500 text-sm font-medium uppercase tracking-wide">Custo Empregador Mensal</p>
          <p className="text-3xl font-extrabold text-neutral-900 mt-2">{formatCurrency(result.custoEmpregadorMensal)}</p>
          <p className="text-neutral-400 text-sm mt-2">Anual: {formatCurrency(result.custoEmpregadorAnual)}</p>
        </div>
      </div>

      {/* ── Detailed Breakdown ── */}
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
        <div className="px-6 md:px-8 py-5 bg-neutral-50 border-b border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-800">Detalhe do C&aacute;lculo</h3>
        </div>

        <div className="divide-y divide-neutral-100">
          {/* Rendimento */}
          <Section title="Rendimento">
            <Row label="Sal&aacute;rio Bruto Mensal" value={formatCurrency(result.grossMonthly)} />
            <Row label="Sal&aacute;rio Bruto Anual (14 meses)" value={formatCurrency(result.grossAnnual)} />
          </Section>

          {/* Segurança Social */}
          <Section title="Seguran&ccedil;a Social (TSU)">
            <Row label="TSU Trabalhador (11%)" value={`-${formatCurrency(result.tsuEmployee)}`} negative />
            <Row label="TSU Trabalhador Anual" value={`-${formatCurrency(result.tsuEmployeeAnnual)}`} negative />
            <Row label="TSU Empregador (23,75%)" value={formatCurrency(result.tsuEmployer)} info />
            <Row label="TSU Empregador Anual" value={formatCurrency(result.tsuEmployerAnnual)} info />
          </Section>

          {/* IRS */}
          <Section title="IRS &mdash; Imposto sobre o Rendimento">
            <Row label="Dedu&ccedil;&atilde;o Espec&iacute;fica" value={formatCurrency(result.deducaoEspecifica)} info />
            <Row label="Rendimento Colet&aacute;vel" value={formatCurrency(result.taxableIncome)} />
            <Row label="IRS Anual" value={`-${formatCurrency(result.irsAnnual)}`} negative />
            {result.irsJovemDesconto > 0 && (
              <Row label="Desconto IRS Jovem" value={formatCurrency(result.irsJovemDesconto)} positive />
            )}
            <Row label="Reten&ccedil;&atilde;o Mensal na Fonte" value={`-${formatCurrency(result.retencaoMensal)}`} negative />
            <Row label="Taxa de Reten&ccedil;&atilde;o" value={formatPercent(result.retencaoTaxa)} />
            <Row label="Taxa Efetiva IRS" value={formatPercent(result.taxRate)} />
          </Section>

          {/* Subsídios */}
          <Section title="Subs&iacute;dios">
            <Row label="Subs&iacute;dio de Natal (bruto)" value={formatCurrency(result.subsidioNatalBruto)} />
            <Row label="Subs&iacute;dio de Natal (l&iacute;quido)" value={formatCurrency(result.subsidioNatalLiquido)} positive />
            <Row label="Subs&iacute;dio de F&eacute;rias (bruto)" value={formatCurrency(result.subsidioFeriasBruto)} />
            <Row label="Subs&iacute;dio de F&eacute;rias (l&iacute;quido)" value={formatCurrency(result.subsidioFeriasLiquido)} positive />
          </Section>

          {/* Líquido */}
          <div className="px-6 md:px-8 py-5 bg-primary-50 border-t-2 border-primary-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary-800">Sal&aacute;rio L&iacute;quido Mensal</span>
              <span className="text-2xl font-extrabold text-primary-700">{formatCurrency(result.netMonthly)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-base font-semibold text-primary-700">L&iacute;quido Anual</span>
              <span className="text-xl font-bold text-primary-600">{formatCurrency(result.netAnnual)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-6 md:px-8 py-4">
      <h4
        className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  negative,
  positive,
  info,
}: {
  label: string;
  value: string;
  negative?: boolean;
  positive?: boolean;
  info?: boolean;
}) {
  const valueColor = negative
    ? "text-secondary-600"
    : positive
      ? "text-primary-600"
      : info
        ? "text-neutral-500"
        : "text-neutral-800";

  return (
    <div className="flex justify-between items-center py-1">
      <span
        className="text-sm text-neutral-600"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}
