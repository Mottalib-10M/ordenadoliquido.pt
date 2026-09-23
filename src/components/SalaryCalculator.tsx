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
  // Le texte saisi est la source de verite ; le nombre en est derive. Sans cela, un
  // champ vide est rejete et React y reecrit l'ancienne valeur a chaque frappe.
  const [grossText, setGrossText] = useState<string>("1500");
  const grossMonthly = useMemo(() => {
    const v = parseFloat(grossText.replace(",", "."));
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }, [grossText]);
  const [maritalStatus, setMaritalStatus] = useState<SalaryInput["maritalStatus"]>("solteiro");
  const [dependents, setDependents] = useState<number>(0);
  const [irsJovem, setIrsJovem] = useState<number>(0);

  const input: SalaryInput = useMemo(
    () => ({ grossMonthly, maritalStatus, dependents, irsJovem }),
    [grossMonthly, maritalStatus, dependents, irsJovem]
  );

  const result: SalaryResult = useMemo(() => calculateSalary(input), [input]);

  const handleGrossChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGrossText(e.target.value);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ── Input Form ── */}
      <div className="bg-white rounded-2xl shadow-xl shadow-primary-900/5 ring-1 ring-neutral-200 overflow-hidden mb-6">
        <div className="regua-bandeira h-1.5" aria-hidden="true" />
        <div className="p-6 md:p-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-primary-50 ring-1 ring-primary-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          A sua situa&ccedil;&atilde;o
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
                step="any"
                inputMode="decimal"
                value={grossText}
                onChange={handleGrossChange}
                className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-xl text-lg font-semibold bg-neutral-50
                  focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/15 focus:outline-none transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-semibold">&euro;</span>
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-base bg-neutral-50
                focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/15 focus:outline-none transition-all"
            >
              <option value="solteiro">Solteiro / Divorciado / Vi&uacute;vo</option>
              <option value="casado1titular">Casado, &Uacute;nico Titular</option>
              <option value="casado2titulares">Casado (dois titulares)</option>
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-base bg-neutral-50
                focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/15 focus:outline-none transition-all"
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
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-base bg-neutral-50
                focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/15 focus:outline-none transition-all"
            >
              <option value={0}>N&atilde;o aplic&aacute;vel</option>
              <option value={1}>1.&ordm; ano, Isen&ccedil;&atilde;o 100%</option>
              <option value={2}>2.&ordm; ano, Isen&ccedil;&atilde;o 75%</option>
              <option value={3}>3.&ordm; ano, Isen&ccedil;&atilde;o 50%</option>
              <option value={4}>4.&ordm; ano, Isen&ccedil;&atilde;o 50%</option>
              <option value={5}>5.&ordm; ano, Isen&ccedil;&atilde;o 25%</option>
            </select>
          </div>
        </div>
        </div>
      </div>

      {/*
          Resultats. Trois cartes de meme poids ne disaient pas laquelle
          repondait a la question posee. La carte du net occupe maintenant la
          moitie de la largeur, sur le vert du drapeau, et porte en dessous la
          repartition reelle de chaque euro brut : ce que le salarie garde, ce
          qui part en Securite sociale, ce qui part en IRS. La barre est
          calculee, pas decorative.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="relative bg-primary-800 rounded-2xl shadow-xl shadow-primary-900/20 p-6 md:p-7 text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 85% 15%, #ffc72c 0, transparent 55%)" }}
            aria-hidden="true"
          />
          <div className="relative">
            <p className="text-primary-200 text-xs font-semibold uppercase tracking-widest">
              Sal&aacute;rio l&iacute;quido mensal
            </p>
            <p className="text-5xl md:text-6xl font-extrabold mt-2 tracking-tight tabular-nums">
              {formatCurrency(result.netMonthly)}
            </p>
            <p className="text-primary-100 text-sm mt-2">
              {formatPercent(result.grossMonthly > 0 ? result.netMonthly / result.grossMonthly : 0)} do sal&aacute;rio bruto
            </p>

            <div className="mt-6 pt-5 border-t border-white/15">
              <Reparticao result={result} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          <div className="bg-white rounded-2xl ring-1 ring-neutral-200 p-6 flex flex-col justify-center">
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest">
              L&iacute;quido anual, 14 meses
            </p>
            <p className="text-3xl font-extrabold text-neutral-900 mt-1.5 tabular-nums">
              {formatCurrency(result.netAnnual)}
            </p>
            <p className="text-neutral-500 text-sm mt-1.5">
              Bruto anual {formatCurrency(result.grossAnnual)}
            </p>
          </div>

          <div className="bg-white rounded-2xl ring-1 ring-neutral-200 p-6 flex flex-col justify-center">
            <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest">
              Custo para a empresa
            </p>
            <p className="text-3xl font-extrabold text-neutral-900 mt-1.5 tabular-nums">
              {formatCurrency(result.custoEmpregadorMensal)}
            </p>
            <p className="text-neutral-500 text-sm mt-1.5">
              Por ano {formatCurrency(result.custoEmpregadorAnual)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Detailed Breakdown ── */}
      <div className="bg-white rounded-2xl ring-1 ring-neutral-200 overflow-hidden">
        <div className="px-6 md:px-8 py-5 border-b border-neutral-200 flex items-center gap-3">
          <span className="borda-bandeira w-1 h-6 rounded-full" aria-hidden="true" />
          <h3 className="text-base font-bold text-neutral-900">Detalhe do c&aacute;lculo</h3>
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
          <Section title="IRS, Imposto sobre o Rendimento">
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
          <div className="px-6 md:px-8 py-5 bg-primary-50 border-t border-primary-200">
            <div className="flex justify-between items-baseline gap-4">
              <span className="text-base font-bold text-primary-900">Sal&aacute;rio l&iacute;quido mensal</span>
              <span className="text-2xl font-extrabold text-primary-800 tabular-nums">{formatCurrency(result.netMonthly)}</span>
            </div>
            <div className="flex justify-between items-baseline gap-4 mt-2">
              <span className="text-sm font-semibold text-primary-800">L&iacute;quido anual</span>
              <span className="text-lg font-bold text-primary-700 tabular-nums">{formatCurrency(result.netAnnual)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

/**
 * Ou va chaque euro du salaire brut.
 *
 * Les trois parts, net, Securite sociale, IRS, se deduisent du resultat du
 * moteur et se somment exactement au brut : aucune valeur n'est saisie ici.
 * Les couleurs sont celles du drapeau, le vert pour ce qui reste au salarie,
 * le rouge pour l'impot, l'or pour la contribution sociale.
 */
function Reparticao({ result }: { result: SalaryResult }) {
  const bruto = result.grossMonthly;
  if (bruto <= 0) return null;

  const partes = [
    { rotulo: "L\u00edquido", valor: result.netMonthly, cor: "#6fc79e" },
    { rotulo: "Seguran\u00e7a Social", valor: result.tsuEmployee, cor: "#ffc72c" },
    { rotulo: "Reten\u00e7\u00e3o de IRS", valor: result.retencaoMensal, cor: "#ec5f52" },
  ].filter((p) => p.valor > 0);

  return (
    <div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-white/20" role="presentation">
        {partes.map((p) => (
          <div
            key={p.rotulo}
            style={{ width: `${(p.valor / bruto) * 100}%`, backgroundColor: p.cor }}
            title={`${p.rotulo}: ${formatCurrency(p.valor)}`}
          />
        ))}
      </div>
      <dl className="mt-3 space-y-1.5">
        {partes.map((p) => (
          <div key={p.rotulo} className="flex items-center gap-2 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: p.cor }}
              aria-hidden="true"
            />
            <dt className="text-primary-100">{p.rotulo}</dt>
            <dd className="ml-auto font-semibold tabular-nums">
              {formatCurrency(p.valor)}
              <span className="text-primary-200 font-normal ml-2">
                {formatPercent(p.valor / bruto)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}


function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-6 md:px-8 py-4">
      <h4
        className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-3"
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
    ? "text-secondary-700"
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
      <span className={`text-sm font-semibold tabular-nums ${valueColor}`}>{value}</span>
    </div>
  );
}
