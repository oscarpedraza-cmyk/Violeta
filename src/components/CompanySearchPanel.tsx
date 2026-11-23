import {
  CheckCircle2,
  FileCheck2,
  Lock,
  MapPin,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import {
  AvailabilityType,
  BeneficiaryProfile,
  CertificateIssuer,
  CompanyProfile,
  MatchRequest,
} from '../types/violeta';
import { calculateIncentivoVioleta, formatCOP } from '../utils/taxCalculator';
import { StatusLabel } from './StatusLabel';

interface CompanySearchPanelProps {
  beneficiaries: BeneficiaryProfile[];
  company: CompanyProfile;
  existingMatches: MatchRequest[];
  onCreateMatchRequest: (payload: {
    beneficiaryId: string;
    roleTitle: string;
    offeredSalaryCOP: number;
    contractType: 'Término Indefinido' | 'Término Fijo (1 año+)';
    startDateEstimated: string;
    messageFromCompany: string;
  }) => void;
  onGoToDashboard: () => void;
}

const CITIES = [
  'Todas',
  'Bogotá D.C.',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Bucaramanga',
  'Cartagena',
];

const AVAILABILITIES: Array<'Todas' | AvailabilityType> = [
  'Todas',
  'Inmediata',
  'En 15 días',
  'Tiempo completo',
  'Medio tiempo',
];

const ISSUERS: Array<'Todos' | CertificateIssuer> = [
  'Todos',
  'Comisaría de Familia',
  'Fiscalía General de la Nación',
  'Medicina Legal',
  'Casa Refugio',
];

export function CompanySearchPanel({
  beneficiaries,
  company,
  existingMatches,
  onCreateMatchRequest,
  onGoToDashboard,
}: CompanySearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('Todas');
  const [availabilityFilter, setAvailabilityFilter] = useState<'Todas' | AvailabilityType>('Todas');
  const [issuerFilter, setIssuerFilter] = useState<'Todos' | CertificateIssuer>('Todos');
  const [onlyVerified, setOnlyVerified] = useState(true);

  const [selectedProfile, setSelectedProfile] = useState<BeneficiaryProfile | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  // Contact Request Form State
  const [roleTitle, setRoleTitle] = useState('');
  const [offeredSalaryCOP, setOfferedSalaryCOP] = useState(2500000);
  const [contractType, setContractType] = useState<'Término Indefinido' | 'Término Fijo (1 año+)'>(
    'Término Indefinido'
  );
  const [startDateEstimated, setStartDateEstimated] = useState('2026-12-15');
  const [messageFromCompany, setMessageFromCompany] = useState('');
  const [justSubmittedCode, setJustSubmittedCode] = useState<string | null>(null);

  const filteredBeneficiaries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return beneficiaries.filter((b) => {
      if (onlyVerified && b.verificationStatus !== 'Verificado') return false;
      if (cityFilter !== 'Todas' && b.city !== cityFilter) return false;
      if (availabilityFilter !== 'Todas' && b.availability !== availabilityFilter) return false;
      if (issuerFilter !== 'Todos' && b.certificateIssuer !== issuerFilter) return false;
      if (q) {
        const haystack = [
          b.anonymizedCode,
          b.publicTitle,
          b.city,
          b.summaryPublic,
          ...b.skills,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [beneficiaries, onlyVerified, cityFilter, availabilityFilter, issuerFilter, searchQuery]);

  const openProfile = (profile: BeneficiaryProfile) => {
    setSelectedProfile(profile);
    setShowContactForm(false);
    setRoleTitle(profile.publicTitle);
    setOfferedSalaryCOP(profile.expectedSalaryCOP);
    setMessageFromCompany(
      `En ${company.businessName} estamos interesados en tu perfil para vincular mediante contrato directo en ${profile.city}.`
    );
    setJustSubmittedCode(null);
  };

  const getExistingMatch = (beneficiaryId: string) =>
    existingMatches.find((m) => m.beneficiaryId === beneficiaryId && m.companyId === company.id);

  const handleSubmitContact = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProfile || !roleTitle.trim()) return;

    onCreateMatchRequest({
      beneficiaryId: selectedProfile.id,
      roleTitle: roleTitle.trim(),
      offeredSalaryCOP: Number(offeredSalaryCOP) || selectedProfile.expectedSalaryCOP,
      contractType,
      startDateEstimated,
      messageFromCompany: messageFromCompany.trim(),
    });
    setJustSubmittedCode(selectedProfile.anonymizedCode);
    setShowContactForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E4E2EC]">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#13111C]">
            Búsqueda y Matching de Talento Certificado
          </h1>
          <p className="text-sm text-[#525062] mt-1">
            Perfiles anonimizados bajo Ley 1581 de 2012. Selecciona una candidata para proyectar el
            beneficio DIAN del 200% y solicitar contacto formal.
          </p>
        </div>
        <div className="text-left sm:text-right text-xs text-[#6D6A7C] shrink-0">
          <p className="font-medium text-[#13111C]">{company.businessName}</p>
          <p className="font-mono tabular-nums">NIT {company.nit}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E4E2EC] rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search
              className="w-4 h-4 text-[#6D6A7C] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por habilidad (ej. NIIF, React, SAP, Inglés)..."
              aria-label="Buscar por habilidad o cargo"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              aria-label="Filtrar por ciudad"
              className="w-full px-3 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'Todas' ? 'Ciudad: Todas' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={availabilityFilter}
              onChange={(e) =>
                setAvailabilityFilter(e.target.value as 'Todas' | AvailabilityType)
              }
              aria-label="Filtrar por disponibilidad"
              className="w-full px-3 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
            >
              {AVAILABILITIES.map((a) => (
                <option key={a} value={a}>
                  {a === 'Todas' ? 'Disponibilidad' : a}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={issuerFilter}
              onChange={(e) => setIssuerFilter(e.target.value as 'Todos' | CertificateIssuer)}
              aria-label="Filtrar por tipo de certificado"
              className="w-full px-3 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
            >
              {ISSUERS.map((issuer) => (
                <option key={issuer} value={issuer}>
                  {issuer === 'Todos' ? 'Entidad certificadora: Todas' : issuer}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E4E2EC]">
          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#525062] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="accent-[#5B21B6] w-4 h-4"
            />
            <span>Mostrar solo certificaciones verificadas listas para deducción DIAN</span>
          </label>

          <p className="text-xs text-[#6D6A7C] tabular-nums">
            {filteredBeneficiaries.length}{' '}
            {filteredBeneficiaries.length === 1 ? 'perfil encontrado' : 'perfiles encontrados'}
          </p>
        </div>
      </div>

      {/* Results Grid */}
      {filteredBeneficiaries.length === 0 ? (
        <div className="bg-white border border-[#E4E2EC] rounded-xl p-10 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-[#13111C]">
            No hay perfiles que coincidan con los filtros actuales
          </p>
          <p className="text-sm text-[#525062]">
            Intenta ampliar la ciudad o limpiar la búsqueda por palabra clave.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCityFilter('Todas');
              setAvailabilityFilter('Todas');
              setIssuerFilter('Todos');
            }}
            className="px-4 py-2 text-xs font-medium text-[#5B21B6] border border-[#E4E2EC] hover:bg-[#F2F0F7] rounded-lg cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBeneficiaries.map((profile) => {
            const tax = calculateIncentivoVioleta(profile.expectedSalaryCOP, 1);
            const activeMatch = getExistingMatch(profile.id);

            return (
              <article
                key={profile.id}
                className="bg-white border border-[#E4E2EC] rounded-xl p-6 flex flex-col justify-between gap-5 hover:border-[#5B21B6]/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-[#13111C] leading-snug">
                        {profile.publicTitle}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#6D6A7C] mt-1">
                        <span className="font-mono font-medium text-[#13111C]">
                          {profile.anonymizedCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{profile.city}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{profile.experienceYears} años exp.</span>
                        <span aria-hidden="true">·</span>
                        <span>{profile.availability}</span>
                      </div>
                    </div>
                    <StatusLabel status={profile.verificationStatus} />
                  </div>

                  <p className="text-sm text-[#525062] leading-relaxed line-clamp-2">
                    {profile.summaryPublic}
                  </p>

                  {/* Unboxed Skills List */}
                  <p className="text-xs text-[#525062]">
                    <span className="font-medium text-[#13111C]">Habilidades: </span>
                    {profile.skills.join(' · ')}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E4E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs text-[#6D6A7C]">
                      Certificado: <span className="text-[#13111C] font-medium">{profile.certificateIssuer}</span>
                    </p>
                    <p className="text-xs text-[#15803D] font-mono tabular-nums font-medium">
                      Ahorro DIAN est. {formatCOP(tax.annualNetTaxSavingsCOP)} / año
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {activeMatch ? (
                      <>
                        {activeMatch.status === 'Match confirmado' ? (
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `Hola, soy ${company.businessName} y me contacto a través de Violeta Connect para hablar sobre la oportunidad laboral que te compartimos.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors whitespace-nowrap shrink-0"
                          >
                            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Contactar por WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-xs text-[#6D6A7C] whitespace-nowrap">
                            Disponible al confirmar match
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => openProfile(profile)}
                          className="px-3 py-2 text-xs font-medium text-[#5B21B6] bg-[#F2F0F7] hover:bg-[#E4E2EC] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Ver ficha
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-[#6D6A7C] whitespace-nowrap">
                          Disponible al confirmar match
                        </span>
                        <button
                          type="button"
                          onClick={() => openProfile(profile)}
                          className="px-4 py-2 text-xs font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Ver perfil anónimo
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Anonymized Profile & Contact Request Modal */}
      {selectedProfile && (
        <div
          className="fixed inset-0 z-50 bg-[#13111C]/50 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
        >
          <div className="bg-white border border-[#E4E2EC] rounded-xl max-w-2xl w-full my-8 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-[#E4E2EC] flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#5B21B6] font-medium">
                  PERFIL ANONIMIZADO · {selectedProfile.anonymizedCode}
                </p>
                <h2 id="profile-modal-title" className="font-display text-xl font-semibold text-[#13111C]">
                  {selectedProfile.publicTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                aria-label="Cerrar perfil"
                className="p-2 text-[#6D6A7C] hover:text-[#13111C] rounded-lg hover:bg-[#F8F8FA] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
              {/* Privacy Lock Notice */}
              <div className="p-4 rounded-lg bg-[#F2F0F7] border border-[#E4E2EC] flex items-start gap-3">
                <Lock className="w-4 h-4 text-[#5B21B6] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-[#3B0764] leading-relaxed">
                  <strong>Reserva HABEAS DATA (Ley 1581 de 2012):</strong> El nombre completo,
                  cédula y datos de contacto de la candidata se mantienen ocultos. Se revelarán
                  únicamente tras tu solicitud formal y la aceptación expresa de la trabajadora.
                </p>
              </div>

              {justSubmittedCode === selectedProfile.anonymizedCode ? (
                <div className="p-6 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-[#14532D]">
                        Solicitud de contacto enviada y flujo documental activado
                      </h3>
                      <p className="text-xs text-[#166534] leading-relaxed">
                        La candidata recibirá tu propuesta laboral de manera confidencial. Hemos
                        creado el checklist de requisitos DIAN en tu panel de empresa.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={onGoToDashboard}
                      className="px-4 py-2 text-xs font-medium text-white bg-[#15803D] hover:bg-[#166534] rounded-lg cursor-pointer"
                    >
                      Ir a Matches y Checklist DIAN
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProfile(null)}
                      className="px-4 py-2 text-xs font-medium text-[#13111C] bg-white border border-[#E4E2EC] rounded-lg cursor-pointer"
                    >
                      Seguir buscando
                    </button>
                  </div>
                </div>
              ) : !showContactForm ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-[#6D6A7C]">Ciudad</p>
                      <p className="font-medium text-[#13111C] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#5B21B6]" aria-hidden="true" />
                        {selectedProfile.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#6D6A7C]">Disponibilidad</p>
                      <p className="font-medium text-[#13111C] mt-0.5">{selectedProfile.availability}</p>
                    </div>
                    <div>
                      <p className="text-[#6D6A7C]">Modalidad</p>
                      <p className="font-medium text-[#13111C] mt-0.5">{selectedProfile.modality}</p>
                    </div>
                    <div>
                      <p className="text-[#6D6A7C]">Aspiración salarial</p>
                      <p className="font-mono font-semibold text-[#13111C] tabular-nums mt-0.5">
                        {formatCOP(selectedProfile.expectedSalaryCOP)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-[#6D6A7C]">Resumen de perfil laboral</h3>
                    <p className="text-sm text-[#13111C] leading-relaxed">
                      {selectedProfile.summaryPublic}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-[#6D6A7C]">Competencias verificadas</h3>
                    <p className="text-sm text-[#525062]">{selectedProfile.skills.join(' · ')}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F8FA] border border-[#E4E2EC] space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#13111C]">
                        <ShieldCheck className="w-4 h-4 text-[#15803D]" aria-hidden="true" />
                        Certificación Ley 1257 verificada
                      </span>
                      <span className="text-xs text-[#6D6A7C]">
                        {selectedProfile.certificateIssuer}
                      </span>
                    </div>

                    {(() => {
                      const projection = calculateIncentivoVioleta(selectedProfile.expectedSalaryCOP, 1);
                      return (
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#E4E2EC] text-xs">
                          <div>
                            <p className="text-[#6D6A7C]">Deducción 200% año</p>
                            <p className="font-mono font-semibold text-[#5B21B6] tabular-nums mt-0.5">
                              {formatCOP(projection.annualDeduction200COP)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#6D6A7C]">Ahorro renta año 1</p>
                            <p className="font-mono font-semibold text-[#15803D] tabular-nums mt-0.5">
                              {formatCOP(projection.annualNetTaxSavingsCOP)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[#6D6A7C]">Ahorro total 3 años</p>
                            <p className="font-mono font-semibold text-[#15803D] tabular-nums mt-0.5">
                              {formatCOP(projection.threeYearNetTaxSavingsCOP)}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {(() => {
                    const modalMatch = getExistingMatch(selectedProfile.id);
                    const isConfirmed = modalMatch?.status === 'Match confirmado';
                    const waMessage = `Hola, soy ${company.businessName} y me contacto a través de Violeta Connect para hablar sobre la oportunidad laboral que te compartimos.`;
                    const waUrl = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;

                    return (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E4E2EC]">
                        <div>
                          {isConfirmed ? (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors whitespace-nowrap shrink-0"
                            >
                              <MessageCircle className="w-4 h-4" aria-hidden="true" />
                              <span>Contactar por WhatsApp</span>
                            </a>
                          ) : (
                            <span className="text-xs text-[#6D6A7C]">
                              WhatsApp: Disponible al confirmar match
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedProfile(null)}
                            className="px-4 py-2 text-sm font-medium text-[#525062] hover:text-[#13111C] cursor-pointer"
                          >
                            Cerrar
                          </button>
                          {modalMatch ? (
                            <button
                              type="button"
                              onClick={onGoToDashboard}
                              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                            >
                              <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                              <span>Gestionar en Checklist DIAN</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowContactForm(true)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                            >
                              <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                              <span>Solicitar contacto y activar flujo DIAN</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-4">
                  <h3 className="font-display text-lg font-semibold text-[#13111C]">
                    Solicitud de Contacto Formal y Propuesta Laboral
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="offer-role" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Cargo ofrecido *
                      </label>
                      <input
                        id="offer-role"
                        type="text"
                        required
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>

                    <div>
                      <label htmlFor="offer-salary" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Salario base mensual ofrecido (COP) *
                      </label>
                      <input
                        id="offer-salary"
                        type="number"
                        min={1423500}
                        step={50000}
                        required
                        value={offeredSalaryCOP}
                        onChange={(e) => setOfferedSalaryCOP(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>

                    <div>
                      <label htmlFor="offer-contract" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Tipo de vinculación directa (Decreto 2733)
                      </label>
                      <select
                        id="offer-contract"
                        value={contractType}
                        onChange={(e) =>
                          setContractType(
                            e.target.value as 'Término Indefinido' | 'Término Fijo (1 año+)'
                          )
                        }
                        className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
                      >
                        <option value="Término Indefinido">Término Indefinido</option>
                        <option value="Término Fijo (1 año+)">Término Fijo (1 año+)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="offer-date" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Fecha estimada de inicio
                      </label>
                      <input
                        id="offer-date"
                        type="date"
                        value={startDateEstimated}
                        onChange={(e) => setStartDateEstimated(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="offer-msg" className="block text-xs font-medium text-[#13111C] mb-1.5">
                      Mensaje confidencial de presentación
                    </label>
                    <textarea
                      id="offer-msg"
                      rows={3}
                      value={messageFromCompany}
                      onChange={(e) => setMessageFromCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#E4E2EC]">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-4 py-2 text-sm font-medium text-[#525062] hover:text-[#13111C] cursor-pointer"
                    >
                      Volver al perfil
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>Enviar solicitud formal</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
