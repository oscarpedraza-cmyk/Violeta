import {
  CheckSquare,
  FileText,
  Lock,
  MessageCircle,
  Square,
  Unlock,
} from 'lucide-react';
import { useState } from 'react';
import { BeneficiaryProfile, CompanyProfile, MatchRequest } from '../types/violeta';
import { calculateIncentivoVioleta, formatCOP, formatDateCO } from '../utils/taxCalculator';
import { DianPacketModal } from './DianPacketModal';
import { StatusLabel } from './StatusLabel';

interface CompanyDashboardProps {
  company: CompanyProfile;
  matches: MatchRequest[];
  beneficiaries: BeneficiaryProfile[];
  onToggleChecklistItem: (matchId: string, itemId: string) => void;
  onConfirmMatch: (matchId: string) => void;
  onGoToSearch: () => void;
}

export function CompanyDashboard({
  company,
  matches,
  beneficiaries,
  onToggleChecklistItem,
  onConfirmMatch,
  onGoToSearch,
}: CompanyDashboardProps) {
  const companyMatches = matches.filter((m) => m.companyId === company.id);
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    companyMatches[0]?.id ?? ''
  );
  const [showDianModal, setShowDianModal] = useState(false);

  const selectedMatch =
    companyMatches.find((m) => m.id === selectedMatchId) ?? companyMatches[0] ?? null;
  const selectedBeneficiary = selectedMatch
    ? beneficiaries.find((b) => b.id === selectedMatch.beneficiaryId) ?? null
    : null;

  // Aggregate fiscal savings across active & confirmed matches
  const confirmedMatches = companyMatches.filter((m) => m.status === 'Match confirmado');
  const totalAnnualSavings = companyMatches.reduce((acc, m) => {
    const calc = calculateIncentivoVioleta(m.offeredSalaryCOP, 1);
    return acc + calc.annualNetTaxSavingsCOP;
  }, 0);
  const totalThreeYearSavings = totalAnnualSavings * 3;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E4E2EC]">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#13111C]">
            Dashboard Empresarial e Incentivo DIAN
          </h1>
          <p className="text-sm text-[#525062] mt-1">
            {company.businessName} · <span className="font-mono">NIT {company.nit}</span> ·{' '}
            {company.taxRegime}
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToSearch}
          className="px-4 py-2 text-xs font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Buscar más talento
        </button>
      </div>

      {/* 4-column KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E4E2EC] rounded-xl p-5">
          <p className="text-xs text-[#6D6A7C]">Matches confirmados</p>
          <p className="font-display text-2xl font-semibold text-[#13111C] tabular-nums mt-1">
            {confirmedMatches.length}
          </p>
          <p className="text-xs text-[#525062] mt-1">Con expediente DIAN habilitado</p>
        </div>

        <div className="bg-white border border-[#E4E2EC] rounded-xl p-5">
          <p className="text-xs text-[#6D6A7C]">Solicitudes totales</p>
          <p className="font-display text-2xl font-semibold text-[#13111C] tabular-nums mt-1">
            {companyMatches.length}
          </p>
          <p className="text-xs text-[#525062] mt-1">Procesos de vinculación directa</p>
        </div>

        <div className="bg-white border border-[#E4E2EC] rounded-xl p-5">
          <p className="text-xs text-[#6D6A7C]">Ahorro tributario Año 1</p>
          <p className="font-mono text-xl font-semibold text-[#5B21B6] tabular-nums mt-1">
            {formatCOP(totalAnnualSavings)}
          </p>
          <p className="text-xs text-[#525062] mt-1">Deducción 200% · Renta 35%</p>
        </div>

        <div className="bg-white border border-[#E4E2EC] rounded-xl p-5">
          <p className="text-xs text-[#6D6A7C]">Ahorro proyectado 3 años</p>
          <p className="font-mono text-xl font-semibold text-[#15803D] tabular-nums mt-1">
            {formatCOP(totalThreeYearSavings)}
          </p>
          <p className="text-xs text-[#525062] mt-1">Vigencia Art. 23 Ley 1257</p>
        </div>
      </div>

      {companyMatches.length === 0 ? (
        <div className="bg-white border border-[#E4E2EC] rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#13111C]">
            Aún no tienes solicitudes o matches activos
          </p>
          <p className="text-sm text-[#525062]">
            Explora el catálogo de perfiles verificados y envía tu primera solicitud formal.
          </p>
          <button
            type="button"
            onClick={onGoToSearch}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] rounded-lg cursor-pointer"
          >
            Ir al buscador de talento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Matches List Table */}
          <div className="lg:col-span-5 bg-white border border-[#E4E2EC] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E4E2EC]">
              <h2 className="text-sm font-semibold text-[#13111C]">
                Procesos de vinculación ({companyMatches.length})
              </h2>
            </div>

            <div className="divide-y divide-[#E4E2EC]">
              {companyMatches.map((match) => {
                const ben = beneficiaries.find((b) => b.id === match.beneficiaryId);
                const isSelected = selectedMatch?.id === match.id;
                const isConfirmed = match.status === 'Match confirmado';
                const completedItems = match.dianChecklist.filter((i) => i.completed).length;

                return (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => setSelectedMatchId(match.id)}
                    className={`w-full text-left px-5 py-4 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F2F0F7]/70' : 'hover:bg-[#F8F8FA]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#13111C] truncate">
                          {match.roleTitle}
                        </p>
                        <p className="text-xs text-[#6D6A7C] mt-0.5 truncate">
                          {isConfirmed && ben ? ben.fullName : ben?.anonymizedCode} ·{' '}
                          <span className="font-mono tabular-nums">
                            {formatCOP(match.offeredSalaryCOP)}
                          </span>
                        </p>
                      </div>
                      <StatusLabel status={match.status} />
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs text-[#6D6A7C] font-mono tabular-nums">
                      <span>{match.matchCode}</span>
                      <span>
                        DIAN {completedItems}/{match.dianChecklist.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Match Detail & DIAN Checklist */}
          {selectedMatch && selectedBeneficiary && (
            <div className="lg:col-span-7 bg-white border border-[#E4E2EC] rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#E4E2EC]">
                <div>
                  <p className="font-mono text-xs text-[#5B21B6] font-medium">
                    {selectedMatch.matchCode}
                  </p>
                  <h2 className="font-display text-xl font-semibold text-[#13111C] mt-0.5">
                    {selectedMatch.roleTitle}
                  </h2>
                  <p className="text-xs text-[#525062] mt-1">
                    {selectedMatch.contractType} · Inicio estimado:{' '}
                    {formatDateCO(selectedMatch.startDateEstimated)}
                  </p>
                </div>
                <StatusLabel status={selectedMatch.status} />
              </div>

              {/* Identity Reveal Gate */}
              <div className="p-4 rounded-lg bg-[#F8F8FA] border border-[#E4E2EC] space-y-2">
                {selectedMatch.status === 'Match confirmado' ? (
                  <>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#15803D]">
                      <Unlock className="w-4 h-4" aria-hidden="true" />
                      <span>Identidad autorizada tras confirmación de match</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <p className="text-[#13111C]">
                        <span className="text-[#6D6A7C]">Nombre: </span>
                        <strong>{selectedBeneficiary.fullName}</strong>
                      </p>
                      <p className="text-[#13111C] font-mono tabular-nums">
                        <span className="text-[#6D6A7C] font-sans">Documento: </span>
                        {selectedBeneficiary.documentIdMasked}
                      </p>
                      <p className="text-[#13111C]">
                        <span className="text-[#6D6A7C]">Correo: </span>
                        {selectedBeneficiary.email}
                      </p>
                      <p className="text-[#13111C] font-mono tabular-nums">
                        <span className="text-[#6D6A7C] font-sans">Teléfono: </span>
                        {selectedBeneficiary.phone}
                      </p>
                    </div>
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Hola, soy ${company.businessName} y me contacto a través de Violeta Connect para hablar sobre la oportunidad laboral que te compartimos.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Contactar por WhatsApp</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-[#5B21B6] shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="text-xs text-[#525062] space-y-1">
                        <p className="font-semibold text-[#13111C]">
                          Perfil reservado: {selectedBeneficiary.anonymizedCode} ({selectedBeneficiary.city})
                        </p>
                        <p>
                          {selectedMatch.status === 'Solicitado'
                            ? 'Esperando que la candidata revise y acepte la propuesta laboral desde su portal.'
                            : 'La candidata aceptó el contacto. Completa el checklist documental y confirma el match para desbloquear el expediente final.'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#6D6A7C] whitespace-nowrap shrink-0">
                      Disponible al confirmar match
                    </span>
                  </div>
                )}
              </div>

              {/* Tax Projection for this Hire */}
              {(() => {
                const calc = calculateIncentivoVioleta(selectedMatch.offeredSalaryCOP, 1);
                return (
                  <div className="grid grid-cols-3 gap-4 py-3 border-y border-[#E4E2EC] text-xs">
                    <div>
                      <p className="text-[#6D6A7C]">Salario mensual</p>
                      <p className="font-mono font-semibold text-[#13111C] tabular-nums mt-0.5">
                        {formatCOP(calc.monthlySalaryCOP)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6D6A7C]">Deducción 200% anual</p>
                      <p className="font-mono font-semibold text-[#5B21B6] tabular-nums mt-0.5">
                        {formatCOP(calc.annualDeduction200COP)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6D6A7C]">Ahorro neto 3 años</p>
                      <p className="font-mono font-semibold text-[#15803D] tabular-nums mt-0.5">
                        {formatCOP(calc.threeYearNetTaxSavingsCOP)}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Interactive DIAN Requirements Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#13111C]">
                    Checklist de Requisitos DIAN (Decreto 2733 de 2012)
                  </h3>
                  <span className="text-xs font-mono tabular-nums text-[#6D6A7C]">
                    {selectedMatch.dianChecklist.filter((i) => i.completed).length}/
                    {selectedMatch.dianChecklist.length} listos
                  </span>
                </div>

                <div className="border border-[#E4E2EC] rounded-lg divide-y divide-[#E4E2EC]">
                  {selectedMatch.dianChecklist.map((item) => {
                    const isCompanyTask = item.responsible === 'Empresa';
                    return (
                      <div
                        key={item.id}
                        className="px-4 py-3 flex items-start justify-between gap-3"
                      >
                        <button
                          type="button"
                          onClick={() => onToggleChecklistItem(selectedMatch.id, item.id)}
                          disabled={!isCompanyTask && selectedMatch.status !== 'Match confirmado'}
                          className="flex items-start gap-2.5 text-left cursor-pointer disabled:cursor-default"
                        >
                          {item.completed ? (
                            <CheckSquare
                              className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                          ) : (
                            <Square
                              className="w-4 h-4 text-[#A5A2B4] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                          )}
                          <div>
                            <p
                              className={`text-xs font-medium ${
                                item.completed ? 'text-[#13111C]' : 'text-[#525062]'
                              }`}
                            >
                              {item.title}
                            </p>
                            <p className="text-[11px] text-[#6D6A7C] mt-0.5">
                              {item.legalReference} · Responsable: {item.responsible}
                            </p>
                          </div>
                        </button>

                        <span
                          className={`text-[11px] font-medium whitespace-nowrap shrink-0 ${
                            item.completed ? 'text-[#15803D]' : 'text-[#B45309]'
                          }`}
                        >
                          {item.completed ? 'Completo' : isCompanyTask ? 'Marcar listo' : 'Auto / Admin'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {selectedMatch.status !== 'Match confirmado' ? (
                  <button
                    type="button"
                    onClick={() => onConfirmMatch(selectedMatch.id)}
                    disabled={selectedMatch.status === 'Solicitado'}
                    className="px-4 py-2.5 text-xs font-medium text-white bg-[#15803D] hover:bg-[#166534] disabled:bg-[#E4E2EC] disabled:text-[#6D6A7C] rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {selectedMatch.status === 'Solicitado'
                      ? 'Esperando aceptación de la candidata'
                      : 'Confirmar Match y emitir Certificado DIAN'}
                  </button>
                ) : (
                  <span className="text-xs font-medium text-[#15803D]">
                    Certificado de Match emitido y listo para declaración de renta
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setShowDianModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Generar resumen y Certificado DIAN</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showDianModal && selectedMatch && selectedBeneficiary && (
        <DianPacketModal
          match={selectedMatch}
          company={company}
          beneficiary={selectedBeneficiary}
          onClose={() => setShowDianModal(false)}
        />
      )}
    </div>
  );
}
