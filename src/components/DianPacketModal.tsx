import { CheckCircle2, Download, Printer, ShieldCheck, X } from 'lucide-react';
import { BeneficiaryProfile, CompanyProfile, MatchRequest } from '../types/violeta';
import { buildDianSummaryText, triggerTextDownload } from '../utils/dianExport';
import { calculateIncentivoVioleta, formatCOP, formatDateCO } from '../utils/taxCalculator';

interface DianPacketModalProps {
  match: MatchRequest;
  company: CompanyProfile;
  beneficiary: BeneficiaryProfile;
  onClose: () => void;
}

export function DianPacketModal({
  match,
  company,
  beneficiary,
  onClose,
}: DianPacketModalProps) {
  const tax = calculateIncentivoVioleta(match.offeredSalaryCOP, 1);
  const isConfirmed = match.status === 'Match confirmado';
  const completedCount = match.dianChecklist.filter((i) => i.completed).length;

  const handleDownload = () => {
    const content = buildDianSummaryText(match, company, beneficiary);
    triggerTextDownload(`${match.matchCode}_Expediente_DIAN.txt`, content);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#13111C]/50 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dian-modal-title"
    >
      <div className="bg-white border border-[#E4E2EC] rounded-xl max-w-3xl w-full my-8 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#E4E2EC] flex items-center justify-between gap-4">
          <div>
            <h2 id="dian-modal-title" className="font-display text-lg font-semibold text-[#13111C]">
              Certificado de Match y Paquete Documental DIAN
            </h2>
            <p className="text-xs text-[#6D6A7C] font-mono tabular-nums">
              {match.matchCode} · Ley 1257 de 2008 Art. 23 · Decreto 2733 de 2012
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#13111C] border border-[#E4E2EC] hover:bg-[#F8F8FA] rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Descargar TXT</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="p-2 text-[#6D6A7C] hover:text-[#13111C] rounded-lg hover:bg-[#F8F8FA] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Body */}
        <div id="dian-printable-dossier" className="p-6 lg:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#E4E2EC]">
            <div>
              <p className="text-xs font-medium text-[#5B21B6] mb-1">
                VIOLETA CONNECT · TRAZABILIDAD TRIBUTARIA Y HABEAS DATA
              </p>
              <h3 className="font-display text-2xl font-semibold text-[#13111C]">
                Expediente de Deducción Renta 200%
              </h3>
              <p className="text-sm text-[#525062] mt-1">
                Soporte normativo para declaración del impuesto sobre la renta ante la DIAN.
              </p>
            </div>
            <div className="sm:text-right font-mono text-xs text-[#525062] space-y-1 tabular-nums">
              <p className="font-semibold text-[#13111C]">{match.matchCode}</p>
              <p>Estado: {match.status}</p>
              <p>Requisitos listos: {completedCount}/{match.dianChecklist.length}</p>
            </div>
          </div>

          {/* Two-column entity summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5 border-b border-[#E4E2EC]">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#6D6A7C]">Contribuyente Empleador</p>
              <p className="text-sm font-semibold text-[#13111C]">{company.businessName}</p>
              <p className="text-xs text-[#525062] font-mono tabular-nums">NIT {company.nit}</p>
              <p className="text-xs text-[#525062]">
                {company.taxRegime} · {company.city}
              </p>
              <p className="text-xs text-[#525062]">
                Contacto RR.HH.: {company.hrContactName} ({company.hrEmail})
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#6D6A7C]">Trabajadora Certificada</p>
              <p className="text-sm font-semibold text-[#13111C]">
                {isConfirmed ? beneficiary.fullName : `Perfil Anonimizado ${beneficiary.anonymizedCode}`}
              </p>
              <p className="text-xs text-[#525062] font-mono tabular-nums">
                {isConfirmed ? beneficiary.documentIdMasked : 'Identidad reservada hasta confirmación final'}
              </p>
              <p className="text-xs text-[#525062]">
                Autoridad: {beneficiary.certificateIssuer} · Rad. {beneficiary.certificateNumber}
              </p>
              <p className="text-xs text-[#525062]">
                Expedición: {formatDateCO(beneficiary.certificateIssueDate)}
              </p>
            </div>
          </div>

          {/* Fiscal Math Summary */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#6D6A7C]">
              Proyección Base para Declaración de Renta (Art. 23 Ley 1257 de 2008)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8F8FA] border border-[#E4E2EC] rounded-lg">
              <div>
                <p className="text-xs text-[#6D6A7C]">Salario base mes</p>
                <p className="text-sm font-semibold font-mono tabular-nums text-[#13111C] mt-0.5">
                  {formatCOP(tax.monthlySalaryCOP)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6D6A7C]">Base anual c/prest.</p>
                <p className="text-sm font-semibold font-mono tabular-nums text-[#13111C] mt-0.5">
                  {formatCOP(tax.annualBasePayrollCOP)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6D6A7C]">Deducción 200% anual</p>
                <p className="text-sm font-semibold font-mono tabular-nums text-[#5B21B6] mt-0.5">
                  {formatCOP(tax.annualDeduction200COP)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6D6A7C]">Ahorro neto 3 años</p>
                <p className="text-sm font-semibold font-mono tabular-nums text-[#15803D] mt-0.5">
                  {formatCOP(tax.threeYearNetTaxSavingsCOP)}
                </p>
              </div>
            </div>
          </div>

          {/* Checklist Table */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#6D6A7C]">
              Relación de Documentos Exigibles por la DIAN
            </p>
            <div className="border border-[#E4E2EC] rounded-lg divide-y divide-[#E4E2EC]">
              {match.dianChecklist.map((item) => (
                <div key={item.id} className="px-4 py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        item.completed ? 'text-[#15803D]' : 'text-[#A5A2B4]'
                      }`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#13111C]">{item.title}</p>
                      <p className="text-xs text-[#6D6A7C] mt-0.5">
                        {item.legalReference} · Responsable: {item.responsible}
                        {item.documentRef ? ` · ${item.documentRef}` : ''}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap shrink-0 ${
                      item.completed ? 'text-[#15803D]' : 'text-[#B45309]'
                    }`}
                  >
                    {item.completed ? 'Completo' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Habeas Data Legal Clause */}
          <div className="p-4 bg-[#F2F0F7] border border-[#E4E2EC] rounded-lg flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#5B21B6] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-[#3B0764] leading-relaxed">
              <strong>Cláusula de Reserva Legal (Ley 1581 de 2012 y Decreto 2733 de 2012):</strong>{' '}
              Los datos sensibles contenidos en la certificación de autoridad competente cuentan con
              autorización explícita de la titular para fines estrictamente laborales y fiscales. La
              empresa contratante debe conservar este soporte en carpeta de reserva contable ante
              eventuales requerimientos de fiscalización de la DIAN.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
