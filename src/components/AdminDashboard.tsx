import { CheckCircle2, FileCheck2, ShieldAlert, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  BeneficiaryProfile,
  CompanyProfile,
  MatchRequest,
  VerificationStatus,
} from '../types/violeta';
import { calculateIncentivoVioleta, formatCOP, formatDateCO } from '../utils/taxCalculator';
import { DianPacketModal } from './DianPacketModal';
import { StatusLabel } from './StatusLabel';

interface AdminDashboardProps {
  beneficiaries: BeneficiaryProfile[];
  companies: CompanyProfile[];
  matches: MatchRequest[];
  onVerifyBeneficiary: (
    beneficiaryId: string,
    status: VerificationStatus,
    notes?: string
  ) => void;
  onConfirmMatchByAdmin: (matchId: string) => void;
}

export function AdminDashboard({
  beneficiaries,
  companies,
  matches,
  onVerifyBeneficiary,
  onConfirmMatchByAdmin,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'documentos' | 'matches' | 'impacto'>('documentos');
  const [docFilter, setDocFilter] = useState<'Todos' | VerificationStatus>('Todos');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>(
    beneficiaries.find((b) => b.verificationStatus === 'En revisión')?.id ??
      beneficiaries[0]?.id ??
      ''
  );
  const [subsanacionNote, setSubsanacionNote] = useState('');
  const [inspectingMatchId, setInspectingMatchId] = useState<string | null>(null);

  const verifiedCount = beneficiaries.filter((b) => b.verificationStatus === 'Verificado').length;
  const pendingCount = beneficiaries.filter((b) => b.verificationStatus === 'En revisión').length;
  const confirmedMatches = matches.filter((m) => m.status === 'Match confirmado');

  const total3YearTaxEnabled = useMemo(() => {
    return matches.reduce((sum, m) => {
      const calc = calculateIncentivoVioleta(m.offeredSalaryCOP, 1);
      return sum + calc.threeYearNetTaxSavingsCOP;
    }, 0);
  }, [matches]);

  const totalMonthlySalaries = useMemo(() => {
    return confirmedMatches.reduce((sum, m) => sum + m.offeredSalaryCOP, 0);
  }, [confirmedMatches]);

  const filteredDocs = beneficiaries.filter((b) =>
    docFilter === 'Todos' ? true : b.verificationStatus === docFilter
  );

  const selectedBeneficiary =
    beneficiaries.find((b) => b.id === selectedBeneficiaryId) ?? filteredDocs[0] ?? null;

  // Impact Breakdown by City & Issuer
  const byCity = useMemo(() => {
    const map = new Map<string, number>();
    beneficiaries.forEach((b) => map.set(b.city, (map.get(b.city) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [beneficiaries]);

  const byIssuer = useMemo(() => {
    const map = new Map<string, number>();
    beneficiaries.forEach((b) =>
      map.set(b.certificateIssuer, (map.get(b.certificateIssuer) ?? 0) + 1)
    );
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [beneficiaries]);

  const inspectingMatch = inspectingMatchId
    ? matches.find((m) => m.id === inspectingMatchId) ?? null
    : null;
  const inspectingCompany = inspectingMatch
    ? companies.find((c) => c.id === inspectingMatch.companyId) ?? companies[0]
    : null;
  const inspectingBeneficiary = inspectingMatch
    ? beneficiaries.find((b) => b.id === inspectingMatch.beneficiaryId) ?? null
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E4E2EC]">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#13111C]">
            Panel de Administración, Verificación e Impacto
          </h1>
          <p className="text-sm text-[#525062] mt-1">
            Auditoría de certificaciones Ley 1257 de 2008, validación HABEAS DATA y confirmación de
            matches DIAN.
          </p>
        </div>
      </div>

      {/* 4-column Admin KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E4E2EC] rounded-xl p-5">
          <p className="text-xs text-[#6D6A7C]">Perfiles registrados</p>
          <p className="font-display text-2xl font-semibold text-[#13111C] tabular-nums mt-1">
            {beneficiaries.length}
          </p>
          <p className="text-xs text-[#15803D] mt-1 tabular-nums">
            {verifiedCount} verificados en catálogo
          </p>
        </div>

        <div className="bg-white border border-[#E4E2EC] rounded-xl p-5">
          <p className="text-xs text-[#6D6A7C]">Pendientes de verificación</p>
          <p className="font-display text-2xl font-semibold text-[#B45309] tabular-nums mt-1">
            {pendingCount}
          </p>
          <p className="text-xs text-[#525062] mt-1">Certificados por auditar</p>
        </div>

        <div className="bg-white border border-[#E4E2EC] rounded-xl p-5">
          <p className="text-xs text-[#6D6A7C]">Matches confirmados / activos</p>
          <p className="font-display text-2xl font-semibold text-[#13111C] tabular-nums mt-1">
            {confirmedMatches.length} / {matches.length}
          </p>
          <p className="text-xs text-[#525062] mt-1">Con trazabilidad DIAN</p>
        </div>

        <div className="bg-white border border-[#E4E2EC] rounded-xl p-5">
          <p className="text-xs text-[#6D6A7C]">Ahorro fiscal habilitado (3 años)</p>
          <p className="font-mono text-xl font-semibold text-[#5B21B6] tabular-nums mt-1">
            {formatCOP(total3YearTaxEnabled)}
          </p>
          <p className="text-xs text-[#525062] mt-1">Deducción 200% en curso</p>
        </div>
      </div>

      {/* Segmented Workspace Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#F2F0F7] rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('documentos')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'documentos'
              ? 'bg-white text-[#13111C] shadow-xs'
              : 'text-[#525062] hover:text-[#13111C]'
          }`}
        >
          Verificación de Documentos ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'matches'
              ? 'bg-white text-[#13111C] shadow-xs'
              : 'text-[#525062] hover:text-[#13111C]'
          }`}
        >
          Estado de Matches ({matches.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('impacto')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'impacto'
              ? 'bg-white text-[#13111C] shadow-xs'
              : 'text-[#525062] hover:text-[#13111C]'
          }`}
        >
          Métricas de Impacto
        </button>
      </div>

      {/* TAB 1: Document Verification Queue */}
      {activeTab === 'documentos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 bg-white border border-[#E4E2EC] rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E4E2EC] flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#13111C]">
                Cola de certificaciones
              </span>
              <select
                value={docFilter}
                onChange={(e) => setDocFilter(e.target.value as 'Todos' | VerificationStatus)}
                aria-label="Filtrar cola por estado"
                className="px-2.5 py-1.5 text-xs border border-[#E4E2EC] rounded-md bg-white text-[#13111C]"
              >
                <option value="Todos">Todos ({beneficiaries.length})</option>
                <option value="En revisión">En revisión ({pendingCount})</option>
                <option value="Verificado">Verificado ({verifiedCount})</option>
                <option value="Subsanación requerida">Subsanación requerida</option>
              </select>
            </div>

            <div className="divide-y divide-[#E4E2EC]">
              {filteredDocs.map((ben) => (
                <button
                  key={ben.id}
                  type="button"
                  onClick={() => {
                    setSelectedBeneficiaryId(ben.id);
                    setSubsanacionNote(ben.verificationNotes ?? '');
                  }}
                  className={`w-full text-left px-5 py-3.5 transition-colors cursor-pointer ${
                    selectedBeneficiary?.id === ben.id ? 'bg-[#F2F0F7]/70' : 'hover:bg-[#F8F8FA]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#13111C] truncate">
                        {ben.anonymizedCode} · {ben.fullName}
                      </p>
                      <p className="text-xs text-[#6D6A7C] mt-0.5 truncate">
                        {ben.certificateIssuer} · <span className="font-mono">{ben.certificateNumber}</span>
                      </p>
                    </div>
                    <StatusLabel status={ben.verificationStatus} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedBeneficiary && (
            <div className="lg:col-span-6 bg-white border border-[#E4E2EC] rounded-xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E4E2EC]">
                <div>
                  <p className="font-mono text-xs text-[#5B21B6] font-medium">
                    EXPEDIENTE RESERVADO · {selectedBeneficiary.anonymizedCode}
                  </p>
                  <h2 className="font-display text-xl font-semibold text-[#13111C] mt-0.5">
                    {selectedBeneficiary.fullName}
                  </h2>
                  <p className="text-xs text-[#6D6A7C] font-mono tabular-nums mt-0.5">
                    {selectedBeneficiary.documentIdMasked} · {selectedBeneficiary.city}
                  </p>
                </div>
                <StatusLabel status={selectedBeneficiary.verificationStatus} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[#6D6A7C]">Autoridad emisora</p>
                  <p className="font-medium text-[#13111C] mt-0.5">
                    {selectedBeneficiary.certificateIssuer}
                  </p>
                </div>
                <div>
                  <p className="text-[#6D6A7C]">Radicado / Resolución</p>
                  <p className="font-mono font-medium text-[#13111C] mt-0.5">
                    {selectedBeneficiary.certificateNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[#6D6A7C]">Fecha de expedición</p>
                  <p className="font-mono text-[#13111C] tabular-nums mt-0.5">
                    {formatDateCO(selectedBeneficiary.certificateIssueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[#6D6A7C]">Soporte adjunto</p>
                  <p className="font-mono text-[#5B21B6] truncate mt-0.5">
                    {selectedBeneficiary.certificateFileName}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F8F8FA] border border-[#E4E2EC] space-y-1.5 text-xs">
                <p className="font-semibold text-[#13111C] flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
                  Cumplimiento HABEAS DATA (Ley 1581 de 2012)
                </p>
                <p className="text-[#525062]">
                  Consentimiento de datos sensibles:{' '}
                  <strong>
                    {selectedBeneficiary.habeasData.acceptedSensitiveData ? 'Firmado' : 'Pendiente'}
                  </strong>{' '}
                  · {formatDateCO(selectedBeneficiary.habeasData.acceptedAt)}
                </p>
                <p className="text-[#525062]">
                  Reserva de identidad activa hasta confirmación de match:{' '}
                  <strong>
                    {selectedBeneficiary.habeasData.acceptedIdentityRevealOnMatch ? 'Sí' : 'No'}
                  </strong>
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="admin-obs"
                  className="block text-xs font-medium text-[#13111C]"
                >
                  Observaciones de auditoría (requerido si se solicita subsanación)
                </label>
                <textarea
                  id="admin-obs"
                  rows={2}
                  value={subsanacionNote}
                  onChange={(e) => setSubsanacionNote(e.target.value)}
                  placeholder="Ej. El número de radicado es legible y corresponde a medida vigente."
                  className="w-full px-3 py-2 text-xs border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E4E2EC]">
                <button
                  type="button"
                  onClick={() =>
                    onVerifyBeneficiary(selectedBeneficiary.id, 'Verificado', subsanacionNote)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#15803D] hover:bg-[#166534] rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Aprobar y habilitar en catálogo</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onVerifyBeneficiary(
                      selectedBeneficiary.id,
                      'Subsanación requerida',
                      subsanacionNote || 'Adjuntar certificación legible con fecha de expedición.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] rounded-lg transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Solicitar subsanación</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Match Status & DIAN Release */}
      {activeTab === 'matches' && (
        <div className="bg-white border border-[#E4E2EC] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E4E2EC] bg-[#F8F8FA] text-xs font-semibold text-[#6D6A7C]">
                  <th className="py-3 px-4">Código Match</th>
                  <th className="py-3 px-4">Empresa</th>
                  <th className="py-3 px-4">Beneficiaria</th>
                  <th className="py-3 px-4 text-right">Salario Base</th>
                  <th className="py-3 px-4">Checklist DIAN</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E2EC] text-xs">
                {matches.map((match) => {
                  const comp = companies.find((c) => c.id === match.companyId);
                  const ben = beneficiaries.find((b) => b.id === match.beneficiaryId);
                  const readyCount = match.dianChecklist.filter((i) => i.completed).length;

                  return (
                    <tr key={match.id} className="hover:bg-[#F8F8FA]">
                      <td className="py-3 px-4 font-mono font-medium text-[#13111C] whitespace-nowrap">
                        {match.matchCode}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-[#13111C]">{comp?.businessName}</p>
                        <p className="text-[#6D6A7C] font-mono tabular-nums">NIT {comp?.nit}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-mono font-medium text-[#13111C]">{ben?.anonymizedCode}</p>
                        <p className="text-[#6D6A7C]">{ben?.city}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#13111C] whitespace-nowrap">
                        {formatCOP(match.offeredSalaryCOP)}
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-[#525062]">
                        {readyCount}/{match.dianChecklist.length}
                      </td>
                      <td className="py-3 px-4">
                        <StatusLabel status={match.status} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                        {match.status !== 'Match confirmado' && (
                          <button
                            type="button"
                            onClick={() => onConfirmMatchByAdmin(match.id)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#15803D] hover:bg-[#166534] rounded-md cursor-pointer"
                          >
                            Confirmar Match
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setInspectingMatchId(match.id)}
                          className="px-3 py-1.5 text-xs font-medium text-[#5B21B6] border border-[#E4E2EC] hover:bg-[#F2F0F7] rounded-md cursor-pointer"
                        >
                          Ver DIAN
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Impact Metrics */}
      {activeTab === 'impacto' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#13111C]">
              Distribución territorial de perfiles
            </h2>
            <div className="space-y-3">
              {byCity.map(([city, count]) => {
                const pct = Math.round((count / Math.max(1, beneficiaries.length)) * 100);
                return (
                  <div key={city} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#13111C]">{city}</span>
                      <span className="font-mono tabular-nums text-[#525062]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#F2F0F7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5B21B6] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 space-y-5">
            <h2 className="font-display text-lg font-semibold text-[#13111C]">
              Certificaciones por autoridad emisora
            </h2>
            <div className="space-y-3">
              {byIssuer.map(([issuer, count]) => {
                const pct = Math.round((count / Math.max(1, beneficiaries.length)) * 100);
                return (
                  <div key={issuer} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#13111C]">{issuer}</span>
                      <span className="font-mono tabular-nums text-[#525062]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#F2F0F7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#15803D] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#E4E2EC] flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-[#5B21B6] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs text-[#525062] space-y-1">
                <p className="font-semibold text-[#13111C]">
                  Nómina mensual colocada (matches confirmados):{' '}
                  <span className="font-mono tabular-nums text-[#15803D]">
                    {formatCOP(totalMonthlySalaries)}
                  </span>
                </p>
                <p>
                  El 100% de los perfiles cuenta con consentimiento explícito HABEAS DATA bajo Ley
                  1581 de 2012.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sustainability Revenue Model ("Modelo de sostenibilidad") */}
      <section className="pt-4 border-t border-[#E4E2EC] space-y-5">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold text-[#13111C]">
            Modelo de sostenibilidad
          </h2>
          <p className="text-xs text-[#525062]">
            Estructura de ingresos B2B para escalar la verificación documental y la colocación laboral sin costo para las mujeres beneficiarias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#6D6A7C]">Para validación inicial</p>
              <h3 className="font-display text-lg font-semibold text-[#13111C]">Plan Gratuito</h3>
              <p className="font-mono text-xl font-semibold text-[#13111C] tabular-nums">
                $0 COP <span className="text-xs font-sans font-normal text-[#6D6A7C]">/ mes</span>
              </p>
            </div>
            <p className="text-sm text-[#525062] leading-relaxed">
              Hasta 3 búsquedas/mes, sin expediente DIAN automatizado.
            </p>
          </div>

          <div className="bg-white border border-[#5B21B6] rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#5B21B6]">Suscripción empresarial recurrente</p>
              <h3 className="font-display text-lg font-semibold text-[#13111C]">Plan Pro</h3>
              <p className="font-mono text-xl font-semibold text-[#5B21B6] tabular-nums">
                $290.000 COP{' '}
                <span className="text-xs font-sans font-normal text-[#6D6A7C]">/ mes por empresa</span>
              </p>
            </div>
            <p className="text-sm text-[#525062] leading-relaxed">
              Búsquedas ilimitadas, expediente DIAN descargable, soporte prioritario.
            </p>
          </div>

          <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#15803D]">Alineado a resultado fiscal</p>
              <h3 className="font-display text-lg font-semibold text-[#13111C]">Plan Comisión</h3>
              <p className="font-mono text-xl font-semibold text-[#13111C] tabular-nums">
                8% <span className="text-xs font-sans font-normal text-[#6D6A7C]">ahorro año 1</span>
              </p>
            </div>
            <p className="text-sm text-[#525062] leading-relaxed">
              8% del ahorro tributario del primer año, solo al confirmar match exitoso.
            </p>
          </div>
        </div>

        <div className="bg-[#F2F0F7] border border-[#E4E2EC] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-sm font-medium text-[#3B0764] tabular-nums">
            Con 20 empresas en Plan Pro = <strong className="font-mono">$5.800.000 COP/mes</strong> en ingresos recurrentes
          </p>
          <span className="text-xs text-[#5B21B6] font-mono tabular-nums">
            $69.600.000 COP / año base SaaS
          </span>
        </div>
      </section>

      {inspectingMatch && inspectingCompany && inspectingBeneficiary && (
        <DianPacketModal
          match={inspectingMatch}
          company={inspectingCompany}
          beneficiary={inspectingBeneficiary}
          onClose={() => setInspectingMatchId(null)}
        />
      )}
    </div>
  );
}
