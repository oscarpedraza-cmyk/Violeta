export interface TaxBenefitBreakdown {
  monthlySalaryCOP: number;
  monthlyBenefitsCOP: number;
  totalMonthlyLaborCostCOP: number;
  annualBasePayrollCOP: number;
  annualDeduction200COP: number;
  annualNetTaxSavingsCOP: number;
  threeYearDeduction200COP: number;
  threeYearNetTaxSavingsCOP: number;
  employeesCount: number;
  incomeTaxRate: number;
}

/**
 * Calcula el beneficio tributario según el Artículo 23 de la Ley 1257 de 2008
 * y su decreto reglamentario (Decreto 2733 de 2012):
 * Deducción del 200% del valor de salarios y prestaciones sociales pagados
 * a trabajadoras certificadas, hasta por 3 años gravables por trabajadora vinculada.
 *
 * Factor prestacional estándar estimado: 29.5% sobre salario base
 * (Prima 8.33% + Cesantías 8.33% + Intereses 1.0% + Vacaciones 4.17% + Base parafiscal/SS computable 7.67%).
 */
export function calculateIncentivoVioleta(
  monthlySalaryCOP: number,
  employeesCount = 1,
  incomeTaxRate = 0.35,
  benefitsRate = 0.295
): TaxBenefitBreakdown {
  const safeSalary = Math.max(0, monthlySalaryCOP);
  const safeEmployees = Math.max(1, employeesCount);
  const monthlyBenefitsCOP = Math.round(safeSalary * benefitsRate);
  const totalMonthlyLaborCostCOP = safeSalary + monthlyBenefitsCOP;

  const annualBasePerEmployee = totalMonthlyLaborCostCOP * 12;
  const annualBasePayrollCOP = annualBasePerEmployee * safeEmployees;
  const annualDeduction200COP = annualBasePayrollCOP * 2;
  const annualNetTaxSavingsCOP = Math.round(annualDeduction200COP * incomeTaxRate);

  const threeYearDeduction200COP = annualDeduction200COP * 3;
  const threeYearNetTaxSavingsCOP = annualNetTaxSavingsCOP * 3;

  return {
    monthlySalaryCOP: safeSalary,
    monthlyBenefitsCOP,
    totalMonthlyLaborCostCOP,
    annualBasePayrollCOP,
    annualDeduction200COP,
    annualNetTaxSavingsCOP,
    threeYearDeduction200COP,
    threeYearNetTaxSavingsCOP,
    employeesCount: safeEmployees,
    incomeTaxRate,
  };
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateCO(isoDate: string): string {
  if (!isoDate) return '—';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}
