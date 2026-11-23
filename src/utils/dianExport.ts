import { BeneficiaryProfile, CompanyProfile, MatchRequest } from '../types/violeta';
import { calculateIncentivoVioleta, formatCOP, formatDateCO } from './taxCalculator';

export function buildDianSummaryText(
  match: MatchRequest,
  company: CompanyProfile,
  beneficiary: BeneficiaryProfile
): string {
  const tax = calculateIncentivoVioleta(match.offeredSalaryCOP, 1);
  const isConfirmed = match.status === 'Match confirmado';

  const lines = [
    '========================================================================',
    'VIOLETA CONNECT — EXPEDIENTE DE SOPORTE TRIBUTARIO DIAN',
    'Incentivo Violeta · Ley 1257 de 2008 (Art. 23) · Decreto 2733 de 2012',
    '========================================================================',
    '',
    `Código de Trazabilidad Match: ${match.matchCode}`,
    `Estado Actual del Proceso:    ${match.status}`,
    `Fecha de Emisión del Resumen: ${formatDateCO(new Date().toISOString())}`,
    '',
    '1. DATOS DEL CONTRIBUYENTE (EMPRESA CONTRATANTE)',
    '------------------------------------------------------------------------',
    `Razón Social:        ${company.businessName}`,
    `NIT:                 ${company.nit}`,
    `Régimen Tributario:  ${company.taxRegime}`,
    `Ciudad / Domicilio:  ${company.city}`,
    `Responsable RR.HH.:  ${company.hrContactName} (${company.hrEmail})`,
    '',
    '2. DATOS DE LA TRABAJADORA VINCULADA (CUMPLIMIENTO HABEAS DATA LEY 1581)',
    '------------------------------------------------------------------------',
    `Código Anonimizado:  ${beneficiary.anonymizedCode}`,
    `Nombre Completo:     ${isConfirmed ? beneficiary.fullName : '[RESERVADO HASTA CONFIRMACIÓN FINAL]'}`,
    `Identificación:      ${isConfirmed ? beneficiary.documentIdMasked : '[RESERVADO HASTA CONFIRMACIÓN FINAL]'}`,
    `Autoridad Emisora:   ${beneficiary.certificateIssuer}`,
    `Radicado Certificado:${beneficiary.certificateNumber}`,
    `Fecha Certificación: ${formatDateCO(beneficiary.certificateIssueDate)}`,
    `Consentimiento Datos:${beneficiary.habeasData.acceptedSensitiveData ? 'Otorgado bajo Art. 6 Ley 1581 de 2012' : 'Pendiente'}`,
    '',
    '3. CONDICIONES CONTRACTUALES Y PROYECCIÓN DE DEDUCCIÓN DIAN (200%)',
    '------------------------------------------------------------------------',
    `Cargo Desempeñado:   ${match.roleTitle}`,
    `Tipo de Contrato:    ${match.contractType}`,
    `Fecha Inicio Est.:   ${formatDateCO(match.startDateEstimated)}`,
    `Salario Base Mensual:${formatCOP(tax.monthlySalaryCOP)}`,
    `Prestaciones Est.:   ${formatCOP(tax.monthlyBenefitsCOP)} / mes`,
    `Base Salarial Anual: ${formatCOP(tax.annualBasePayrollCOP)}`,
    `Deducción 200% Anual:${formatCOP(tax.annualDeduction200COP)}`,
    `Ahorro Renta Año 1:  ${formatCOP(tax.annualNetTaxSavingsCOP)} (Tarifa 35%)`,
    `Ahorro Proy. 3 Años: ${formatCOP(tax.threeYearNetTaxSavingsCOP)}`,
    '',
    '4. CHECKLIST DE DOCUMENTACIÓN REQUERIDA ANTE FISCALIZACIÓN DIAN',
    '------------------------------------------------------------------------',
    ...match.dianChecklist.map(
      (item, idx) =>
        `${idx + 1}. [${item.completed ? 'COMPLETO' : 'PENDIENTE'}] ${item.title}\n` +
        `   Norma: ${item.legalReference} | Responsable: ${item.responsible}` +
        (item.documentRef ? ` | Ref: ${item.documentRef}` : '')
    ),
    '',
    '5. DECLARACIÓN DE RESERVA Y PROTECCIÓN DE DATOS SENSIBLES',
    '------------------------------------------------------------------------',
    'En cumplimiento de la Ley 1581 de 2012 y el Decreto 2733 de 2012, el empleador',
    'se obliga a custodiar la certificación de la trabajadora con reserva legal',
    'estricta, absteniéndose de divulgar los hechos victimizantes al interior de',
    'la organización y utilizándola exclusivamente como soporte de la deducción',
    'del 200% en la declaración del impuesto sobre la renta ante la DIAN.',
    '========================================================================',
  ];

  return lines.join('\n');
}

export function triggerTextDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
