import { Building2, CheckCircle2, EyeOff, FileCheck2, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { BeneficiaryProfile, CompanyProfile, MatchRequest } from '../types/violeta';
import { formatCOP, formatDateCO } from '../utils/taxCalculator';
import { StatusLabel } from './StatusLabel';

interface BeneficiaryPanelProps {
  beneficiaries: BeneficiaryProfile[];
  activeBeneficiaryId: string;
  onSelectBeneficiary: (id: string) => void;
  matches: MatchRequest[];
  companies: CompanyProfile[];
  onAcceptContactRequest: (matchId: string) => void;
  onDeclineContactRequest: (matchId: string) => void;
  onGoToUpload: () => void;
}

export function BeneficiaryPanel({
  beneficiaries,
  activeBeneficiaryId,
  onSelectBeneficiary,
  matches,
  companies,
  onAcceptContactRequest,
  onDeclineContactRequest,
  onGoToUpload,
}: BeneficiaryPanelProps) {
  const [showPublicPreview, setShowPublicPreview] = useState(false);

  const profile =
    beneficiaries.find((b) => b.id === activeBeneficiaryId) ?? beneficiaries[0];

  if (!profile) {
    return (
      <div className="bg-white border border-[#E4E2EC] rounded-xl p-10 text-center space-y-3">
        <p className="font-display text-lg font-semibold text-[#13111C]">
          No hay perfil registrado todavía
        </p>
        <button
          type="button"
          onClick={onGoToUpload}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] rounded-lg cursor-pointer"
        >
          Registrar mi perfil y certificación
        </button>
      </div>
    );
  }

  const incomingMatches = matches.filter((m) => m.beneficiaryId === profile.id);

  return (
    <div className="space-y-6">
      {/* Header with Profile Switcher for Prototype Testing */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E4E2EC]">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#13111C]">
            Portal de Mujer Beneficiaria
          </h1>
          <p className="text-sm text-[#525062] mt-1">
            Gestiona tu privacidad bajo HABEAS DATA, revisa tu certificación y responde solicitudes
            laborales de empresas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="ben-switcher" className="text-xs text-[#6D6A7C]">
            Perfil activo:
          </label>
          <select
            id="ben-switcher"
            value={profile.id}
            onChange={(e) => onSelectBeneficiary(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-[#E4E2EC] rounded-lg bg-white text-[#13111C] focus:outline-none focus:border-[#5B21B6]"
          >
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.anonymizedCode} — {b.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Privacy & Verification Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-white border border-[#E4E2EC] rounded-xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E4E2EC]">
            <div>
              <p className="font-mono text-xs text-[#5B21B6] font-medium">
                {profile.anonymizedCode}
              </p>
              <h2 className="font-display text-xl font-semibold text-[#13111C] mt-0.5">
                {showPublicPreview ? 'Vista pública anonimizada' : profile.fullName}
              </h2>
              <p className="text-xs text-[#6D6A7C] mt-0.5">
                {showPublicPreview ? profile.publicTitle : profile.documentIdMasked}
              </p>
            </div>
            <StatusLabel status={profile.verificationStatus} />
          </div>

          {/* Toggle Private vs Public Anonymized View */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F2F0F7]">
            <span className="text-xs font-medium text-[#3B0764] flex items-center gap-2">
              {showPublicPreview ? (
                <EyeOff className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              <span>
                {showPublicPreview
                  ? 'Así ven tu perfil las empresas'
                  : 'Tus datos reales están protegidos'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setShowPublicPreview(!showPublicPreview)}
              className="text-xs font-semibold text-[#5B21B6] hover:underline cursor-pointer whitespace-nowrap shrink-0"
            >
              {showPublicPreview ? 'Ver datos privados' : 'Simular vista empresa'}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <p className="text-[#6D6A7C]">Cargo / Perfil laboral</p>
              <p className="text-sm font-medium text-[#13111C] mt-0.5">{profile.publicTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[#6D6A7C]">Ciudad</p>
                <p className="font-medium text-[#13111C] mt-0.5">{profile.city}</p>
              </div>
              <div>
                <p className="text-[#6D6A7C]">Aspiración salarial</p>
                <p className="font-mono font-medium text-[#13111C] tabular-nums mt-0.5">
                  {formatCOP(profile.expectedSalaryCOP)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[#6D6A7C]">Habilidades</p>
              <p className="text-[#13111C] mt-0.5">{profile.skills.join(' · ')}</p>
            </div>
          </div>

          {/* Certificate Audit Box */}
          <div className="pt-4 border-t border-[#E4E2EC] space-y-2.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#13111C]">
              <FileCheck2 className="w-4 h-4 text-[#5B21B6]" aria-hidden="true" />
              <span>Certificación Ley 1257 de 2008</span>
            </div>
            <p className="text-[#525062]">
              Entidad: <strong className="text-[#13111C]">{profile.certificateIssuer}</strong>
            </p>
            <p className="text-[#525062] font-mono tabular-nums">
              Radicado: {profile.certificateNumber} · {formatDateCO(profile.certificateIssueDate)}
            </p>
            <p className="text-[#525062] truncate">Archivo: {profile.certificateFileName}</p>
            {profile.verificationNotes && (
              <p className="p-2.5 rounded bg-[#FEF2F2] text-[#B91C1C]">
                Observación comité: {profile.verificationNotes}
              </p>
            )}
            <div className="flex items-center gap-1.5 text-[#15803D] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>
                Consentimiento HABEAS DATA firmado ({formatDateCO(profile.habeasData.acceptedAt)})
              </span>
            </div>
          </div>
        </div>

        {/* Incoming Company Contact Requests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#13111C]">
                  Solicitudes de Contacto y Ofertas Laborales
                </h2>
                <p className="text-xs text-[#525062] mt-0.5">
                  Ninguna empresa conoce tu identidad hasta que aceptes expresamente su solicitud.
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#5B21B6] tabular-nums">
                {incomingMatches.length}
              </span>
            </div>

            {incomingMatches.length === 0 ? (
              <div className="py-10 text-center border-t border-[#E4E2EC] space-y-2">
                <p className="text-sm font-medium text-[#13111C]">
                  Aún no has recibido solicitudes de contacto para este perfil
                </p>
                <p className="text-xs text-[#525062]">
                  {profile.verificationStatus === 'Verificado'
                    ? 'Tu perfil anónimo ya es visible para empresas verificadas en el panel de búsqueda.'
                    : 'Tu certificación está en proceso de verificación por el Comité Violeta.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E4E2EC] border-t border-[#E4E2EC]">
                {incomingMatches.map((match) => {
                  const company = companies.find((c) => c.id === match.companyId);

                  return (
                    <div key={match.id} className="py-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#6D6A7C]">
                            <Building2 className="w-3.5 h-3.5 text-[#5B21B6]" aria-hidden="true" />
                            <span className="font-medium text-[#13111C]">
                              {company?.businessName ?? 'Empresa Contratante'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{company?.sector}</span>
                          </div>
                          <h3 className="font-display text-lg font-semibold text-[#13111C] mt-1">
                            {match.roleTitle}
                          </h3>
                        </div>
                        <StatusLabel status={match.status} />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-[#F8F8FA] p-3.5 rounded-lg border border-[#E4E2EC]">
                        <div>
                          <p className="text-[#6D6A7C]">Salario base ofrecido</p>
                          <p className="font-mono font-semibold text-[#13111C] tabular-nums mt-0.5">
                            {formatCOP(match.offeredSalaryCOP)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#6D6A7C]">Tipo de contrato</p>
                          <p className="font-medium text-[#13111C] mt-0.5">{match.contractType}</p>
                        </div>
                        <div>
                          <p className="text-[#6D6A7C]">Inicio estimado</p>
                          <p className="font-mono text-[#13111C] tabular-nums mt-0.5">
                            {formatDateCO(match.startDateEstimated)}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-[#525062] leading-relaxed">
                        “{match.messageFromCompany}”
                      </p>

                      {match.status === 'Solicitado' ? (
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => onAcceptContactRequest(match.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Aceptar contacto y autorizar match</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeclineContactRequest(match.id)}
                            className="px-4 py-2 text-xs font-medium text-[#525062] hover:text-[#B91C1C] border border-[#E4E2EC] rounded-lg transition-colors cursor-pointer"
                          >
                            Declinar solicitud
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-[#15803D]">
                          {match.status === 'Match confirmado'
                            ? `Match confirmado (${match.matchCode}). Tu contacto directo ya fue compartido con Recursos Humanos para firma de contrato.`
                            : 'Has aceptado el contacto. El Comité Violeta y la empresa están finalizando el paquete documental DIAN.'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
