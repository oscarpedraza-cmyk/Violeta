import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileUp,
  Lock,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import {
  AvailabilityType,
  BeneficiaryProfile,
  CertificateIssuer,
  CompanyProfile,
  TaxRegime,
  UserRole,
} from '../types/violeta';

interface OnboardingFlowProps {
  initialRole: UserRole;
  onCancel: () => void;
  onCreateBeneficiary: (profile: BeneficiaryProfile) => void;
  onCreateCompany: (company: CompanyProfile) => void;
}

const CITIES = [
  'Bogotá D.C.',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Bucaramanga',
  'Cartagena',
  'Pereira',
];

const ISSUERS: CertificateIssuer[] = [
  'Comisaría de Familia',
  'Fiscalía General de la Nación',
  'Medicina Legal',
  'Casa Refugio',
];

export function OnboardingFlow({
  initialRole,
  onCancel,
  onCreateBeneficiary,
  onCreateCompany,
}: OnboardingFlowProps) {
  const [selectedRole, setSelectedRole] = useState<'beneficiaria' | 'empresa'>(
    initialRole === 'empresa' ? 'empresa' : 'beneficiaria'
  );
  const [benStep, setBenStep] = useState<1 | 2>(1);
  const [formError, setFormError] = useState<string>('');

  // Beneficiary State
  const [fullName, setFullName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [publicTitle, setPublicTitle] = useState('');
  const [city, setCity] = useState('Bogotá D.C.');
  const [experienceYears, setExperienceYears] = useState(3);
  const [availability, setAvailability] = useState<AvailabilityType>('Inmediata');
  const [modality, setModality] = useState<'Presencial' | 'Híbrido' | 'Remoto'>('Híbrido');
  const [expectedSalaryCOP, setExpectedSalaryCOP] = useState(2400000);
  const [skillsInput, setSkillsInput] = useState('Excel Avanzado, Gestión Administrativa, Atención al Cliente');
  const [summaryPublic, setSummaryPublic] = useState('');

  // Certificate & Habeas Data State
  const [certificateIssuer, setCertificateIssuer] = useState<CertificateIssuer>('Comisaría de Familia');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificateIssueDate, setCertificateIssueDate] = useState('2026-10-15');
  const [certificateFileName, setCertificateFileName] = useState('');
  const [acceptedSensitiveData, setAcceptedSensitiveData] = useState(false);
  const [acceptedEncryptedStorage, setAcceptedEncryptedStorage] = useState(false);
  const [acceptedIdentityRevealOnMatch, setAcceptedIdentityRevealOnMatch] = useState(false);

  // Company State
  const [businessName, setBusinessName] = useState('');
  const [nit, setNit] = useState('');
  const [sector, setSector] = useState('Servicios y Tecnología');
  const [employeeCount, setEmployeeCount] = useState(45);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>('Régimen Ordinario (35%)');
  const [companyCity, setCompanyCity] = useState('Bogotá D.C.');
  const [hrContactName, setHrContactName] = useState('');
  const [hrEmail, setHrEmail] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFileName(file.name);
      setFormError('');
    }
  };

  const handleBeneficiaryStep1Next = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !documentId.trim() || !email.trim() || !publicTitle.trim() || !summaryPublic.trim()) {
      setFormError('Completa los campos obligatorios del perfil laboral y datos confidenciales.');
      return;
    }
    setFormError('');
    setBenStep(2);
  };

  const handleBeneficiarySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!certificateNumber.trim()) {
      setFormError('Ingresa el número de radicado o resolución de la certificación.');
      return;
    }
    if (!certificateFileName.trim()) {
      setFormError('Adjunta el archivo PDF o imagen de tu certificación oficial.');
      return;
    }
    if (!acceptedSensitiveData || !acceptedEncryptedStorage || !acceptedIdentityRevealOnMatch) {
      setFormError(
        'Debes aceptar las tres cláusulas de tratamiento de datos sensibles bajo Ley 1581 de 2012 (HABEAS DATA).'
      );
      return;
    }

    const cityPrefix = city.slice(0, 3).toUpperCase().replace('Ó', 'O').replace('Í', 'I');
    const randomNum = Math.floor(150 + Math.random() * 800);
    const digitsOnly = documentId.replace(/\D/g, '');
    const last3 = digitsOnly.slice(-3) || '000';
    const first4 = digitsOnly.slice(0, 4) || '1.000';

    const newProfile: BeneficiaryProfile = {
      id: `ben-${Date.now()}`,
      anonymizedCode: `VC-${cityPrefix}-${randomNum}`,
      publicTitle: publicTitle.trim(),
      city,
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      experienceYears: Number(experienceYears) || 1,
      availability,
      modality,
      expectedSalaryCOP: Number(expectedSalaryCOP) || 1423500,
      summaryPublic: summaryPublic.trim(),
      fullName: fullName.trim(),
      documentIdMasked: `C.C. ${first4}.•••.${last3}`,
      email: email.trim(),
      phone: phone.trim() || '+57 300 ••• 0000',
      certificateIssuer,
      certificateNumber: certificateNumber.trim(),
      certificateIssueDate,
      certificateFileName,
      verificationStatus: 'En revisión',
      habeasData: {
        acceptedSensitiveData,
        acceptedEncryptedStorage,
        acceptedIdentityRevealOnMatch,
        acceptedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    onCreateBeneficiary(newProfile);
  };

  const handleCompanySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !nit.trim() || !hrContactName.trim() || !hrEmail.trim()) {
      setFormError('Completa la razón social, NIT y datos de contacto de Recursos Humanos.');
      return;
    }
    if (!/^\d{6,10}(-\d)?$/.test(nit.replace(/\./g, '').trim())) {
      setFormError('Ingresa un formato de NIT colombiano válido (ej. 900.482.193-4).');
      return;
    }

    const newCompany: CompanyProfile = {
      id: `emp-${Date.now()}`,
      businessName: businessName.trim(),
      nit: nit.trim(),
      sector,
      employeeCount: Number(employeeCount) || 10,
      taxRegime,
      city: companyCity,
      hrContactName: hrContactName.trim(),
      hrEmail: hrEmail.trim(),
      createdAt: new Date().toISOString(),
    };

    onCreateCompany(newCompany);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA] py-8 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#525062] hover:text-[#13111C] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver</span>
          </button>
          <span className="font-display text-base font-semibold text-[#13111C]">
            Violeta Connect
          </span>
        </div>

        {/* Differentiated Role Switcher */}
        <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 space-y-4">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold text-[#13111C]">
              Registro y vinculación en la plataforma
            </h1>
            <p className="text-sm text-[#525062]">
              Selecciona tu perfil para completar el registro diferenciado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('beneficiaria');
                setFormError('');
              }}
              className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                selectedRole === 'beneficiaria'
                  ? 'border-[#5B21B6] bg-[#F2F0F7]/70'
                  : 'border-[#E4E2EC] bg-white hover:bg-[#F8F8FA]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck
                  className={`w-4 h-4 shrink-0 ${
                    selectedRole === 'beneficiaria' ? 'text-[#5B21B6]' : 'text-[#6D6A7C]'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[#13111C]">
                  Soy Mujer Beneficiaria
                </span>
              </div>
              <p className="text-xs text-[#525062] mt-1.5">
                Perfil laboral anonimizado y carga segura de certificación Ley 1257.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('empresa');
                setFormError('');
              }}
              className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${
                selectedRole === 'empresa'
                  ? 'border-[#5B21B6] bg-[#F2F0F7]/70'
                  : 'border-[#E4E2EC] bg-white hover:bg-[#F8F8FA]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2
                  className={`w-4 h-4 shrink-0 ${
                    selectedRole === 'empresa' ? 'text-[#5B21B6]' : 'text-[#6D6A7C]'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[#13111C]">
                  Soy Empresa Contratante
                </span>
              </div>
              <p className="text-xs text-[#525062] mt-1.5">
                Registro con NIT para búsqueda de talento y deducción del 200% ante la DIAN.
              </p>
            </button>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#B91C1C]"
          >
            {formError}
          </div>
        )}

        {/* Beneficiary Onboarding */}
        {selectedRole === 'beneficiaria' && (
          <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 lg:p-8 space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center gap-4 pb-5 border-b border-[#E4E2EC]">
              <button
                type="button"
                onClick={() => setBenStep(1)}
                className={`text-xs font-medium cursor-pointer ${
                  benStep === 1 ? 'text-[#5B21B6]' : 'text-[#15803D]'
                }`}
              >
                01. Perfil laboral y datos reservados
              </button>
              <span aria-hidden="true" className="text-[#A5A2B4]">
                →
              </span>
              <span
                className={`text-xs font-medium ${
                  benStep === 2 ? 'text-[#5B21B6]' : 'text-[#6D6A7C]'
                }`}
              >
                02. Certificación Ley 1257 y HABEAS DATA
              </span>
            </div>

            {benStep === 1 ? (
              <form onSubmit={handleBeneficiaryStep1Next} className="space-y-5">
                <div className="p-4 rounded-lg bg-[#F2F0F7] border border-[#E4E2EC] flex items-start gap-3">
                  <Lock className="w-4 h-4 text-[#5B21B6] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-[#3B0764] leading-relaxed">
                    <strong>Privacidad garantizada:</strong> Tu nombre, cédula, teléfono y correo
                    permanecerán ocultos para las empresas. Solo se mostrará tu código anónimo y tus
                    habilidades hasta que aceptes una oferta formal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ben-name" className="block text-xs font-medium text-[#13111C] mb-1.5">
                      Nombre completo (confidencial) *
                    </label>
                    <input
                      id="ben-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Laura Marcela Gómez"
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>
                  <div>
                    <label htmlFor="ben-cc" className="block text-xs font-medium text-[#13111C] mb-1.5">
                      Cédula de ciudadanía (confidencial) *
                    </label>
                    <input
                      id="ben-cc"
                      type="text"
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                      placeholder="Ej. 1020456789"
                      className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>
                  <div>
                    <label htmlFor="ben-email" className="block text-xs font-medium text-[#13111C] mb-1.5">
                      Correo electrónico (confidencial) *
                    </label>
                    <input
                      id="ben-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="laura.gomez@correo.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>
                  <div>
                    <label htmlFor="ben-phone" className="block text-xs font-medium text-[#13111C] mb-1.5">
                      Teléfono de contacto (confidencial)
                    </label>
                    <input
                      id="ben-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 310 555 1234"
                      className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E2EC] space-y-4">
                  <p className="text-xs font-semibold text-[#6D6A7C]">
                    Información laboral visible (anonimizada)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="ben-title" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Cargo o perfil profesional público *
                      </label>
                      <input
                        id="ben-title"
                        type="text"
                        value={publicTitle}
                        onChange={(e) => setPublicTitle(e.target.value)}
                        placeholder="Ej. Auxiliar Contable y Facturación Electrónica"
                        className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>

                    <div>
                      <label htmlFor="ben-city" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Ciudad de residencia
                      </label>
                      <select
                        id="ben-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ben-exp" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Años de experiencia
                      </label>
                      <input
                        id="ben-exp"
                        type="number"
                        min={0}
                        max={40}
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>

                    <div>
                      <label htmlFor="ben-avail" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Disponibilidad
                      </label>
                      <select
                        id="ben-avail"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value as AvailabilityType)}
                        className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
                      >
                        <option value="Inmediata">Inmediata</option>
                        <option value="En 15 días">En 15 días</option>
                        <option value="Tiempo completo">Tiempo completo</option>
                        <option value="Medio tiempo">Medio tiempo</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ben-salary" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Aspiración salarial mensual (COP)
                      </label>
                      <input
                        id="ben-salary"
                        type="number"
                        min={1423500}
                        step={50000}
                        value={expectedSalaryCOP}
                        onChange={(e) => setExpectedSalaryCOP(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>

                    <div>
                      <label htmlFor="ben-mod" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Modalidad preferida
                      </label>
                      <select
                        id="ben-mod"
                        value={modality}
                        onChange={(e) => setModality(e.target.value as 'Presencial' | 'Híbrido' | 'Remoto')}
                        className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
                      >
                        <option value="Presencial">Presencial</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Remoto">Remoto</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ben-skills" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Habilidades principales (separadas por coma)
                      </label>
                      <input
                        id="ben-skills"
                        type="text"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="ben-summary" className="block text-xs font-medium text-[#13111C] mb-1.5">
                        Resumen de experiencia (sin incluir nombres propios ni direcciones) *
                      </label>
                      <textarea
                        id="ben-summary"
                        rows={3}
                        value={summaryPublic}
                        onChange={(e) => setSummaryPublic(e.target.value)}
                        placeholder="Describe tu experiencia laboral, logros y áreas de fortaleza..."
                        className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                  >
                    Continuar a Certificación y HABEAS DATA
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBeneficiarySubmit} className="space-y-6">
                {/* HABEAS DATA Legal Notice */}
                <div className="p-5 rounded-xl bg-[#F8F8FA] border border-[#E4E2EC] space-y-3">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-[#5B21B6] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1.5">
                      <h2 className="text-sm font-semibold text-[#13111C]">
                        Aviso de Privacidad y Tratamiento de Datos Sensibles — HABEAS DATA (Ley 1581 de 2012)
                      </h2>
                      <p className="text-xs text-[#525062] leading-relaxed">
                        De conformidad con los artículos 5 y 6 de la Ley 1581 de 2012 y el Decreto
                        2733 de 2012, la certificación de condición de víctima constituye un{' '}
                        <strong>dato sensible</strong> cuyo otorgamiento es facultativo. Violeta
                        Connect tratará este documento exclusivamente para: (1) verificar la validez
                        ante la autoridad emisora, (2) habilitar la trazabilidad del beneficio
                        tributario del Art. 23 de la Ley 1257 de 2008 ante la empresa contratante y
                        la DIAN. Nunca será publicado ni compartido sin tu autorización expresa.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificate Metadata & Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cert-issuer" className="block text-xs font-medium text-[#13111C] mb-1.5">
                      Autoridad emisora de la certificación *
                    </label>
                    <select
                      id="cert-issuer"
                      value={certificateIssuer}
                      onChange={(e) => setCertificateIssuer(e.target.value as CertificateIssuer)}
                      className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
                    >
                      {ISSUERS.map((issuer) => (
                        <option key={issuer} value={issuer}>
                          {issuer}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cert-num" className="block text-xs font-medium text-[#13111C] mb-1.5">
                      Número de radicado / resolución *
                    </label>
                    <input
                      id="cert-num"
                      type="text"
                      value={certificateNumber}
                      onChange={(e) => setCertificateNumber(e.target.value)}
                      placeholder="Ej. CF-BOG-2026-10492"
                      className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>

                  <div>
                    <label htmlFor="cert-date" className="block text-xs font-medium text-[#13111C] mb-1.5">
                      Fecha de expedición del certificado
                    </label>
                    <input
                      id="cert-date"
                      type="date"
                      value={certificateIssueDate}
                      onChange={(e) => setCertificateIssueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>
                </div>

                {/* File Upload Dropzone */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-[#13111C]">
                    Archivo de certificación (PDF, JPG o PNG) *
                  </label>
                  <div className="border border-dashed border-[#A5A2B4] rounded-xl p-6 text-center bg-[#F8F8FA] space-y-3">
                    <FileUp className="w-7 h-7 text-[#5B21B6] mx-auto" aria-hidden="true" />
                    {certificateFileName ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#15803D] flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          <span>{certificateFileName}</span>
                        </p>
                        <p className="text-xs text-[#6D6A7C]">Documento cifrado en tránsito listo para verificación</p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#525062]">
                        Selecciona tu medida de protección, constancia de Fiscalía, dictamen de
                        Medicina Legal o certificación de Casa Refugio.
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <label className="px-4 py-2 text-xs font-medium text-[#13111C] bg-white border border-[#E4E2EC] hover:bg-[#F2F0F7] rounded-lg transition-colors cursor-pointer">
                        <span>Seleccionar archivo</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCertificateFileName(
                            `certificado_${certificateIssuer.toLowerCase().replace(/\s+/g, '_')}_2026.pdf`
                          );
                          if (!certificateNumber) {
                            setCertificateNumber(`VC-DOC-${Math.floor(10000 + Math.random() * 89999)}`);
                          }
                          setFormError('');
                        }}
                        className="px-3 py-2 text-xs font-medium text-[#5B21B6] hover:underline cursor-pointer"
                      >
                        Usar documento de ejemplo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Explicit Consent Checkboxes */}
                <div className="space-y-3 pt-2 border-t border-[#E4E2EC]">
                  <p className="text-xs font-semibold text-[#13111C]">
                    Autorización expresa de la titular (Obligatorio)
                  </p>

                  <label className="flex items-start gap-3 text-xs text-[#525062] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedSensitiveData}
                      onChange={(e) => setAcceptedSensitiveData(e.target.checked)}
                      className="mt-0.5 accent-[#5B21B6] w-4 h-4 shrink-0"
                    />
                    <span>
                      Autorizo de manera previa, expresa e informada el tratamiento de mis{' '}
                      <strong>datos sensibles</strong> conforme al Art. 6 de la Ley 1581 de 2012,
                      entendiendo que no estoy obligada a suministrarlos y que su único fin es la
                      validación del beneficio laboral de la Ley 1257 de 2008.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-[#525062] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedEncryptedStorage}
                      onChange={(e) => setAcceptedEncryptedStorage(e.target.checked)}
                      className="mt-0.5 accent-[#5B21B6] w-4 h-4 shrink-0"
                    />
                    <span>
                      Entiendo que mi certificación será custodiada con acceso restringido al comité
                      verificador y nunca se mostrará en resultados de búsqueda abiertos.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-[#525062] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedIdentityRevealOnMatch}
                      onChange={(e) => setAcceptedIdentityRevealOnMatch(e.target.checked)}
                      className="mt-0.5 accent-[#5B21B6] w-4 h-4 shrink-0"
                    />
                    <span>
                      Autorizo revelar mi nombre y documento de soporte a la empresa contratante{' '}
                      <strong>únicamente después</strong> de que yo acepte expresamente una solicitud
                      de contacto y se formalice el match laboral para efectos de la DIAN.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E4E2EC]">
                  <button
                    type="button"
                    onClick={() => setBenStep(1)}
                    className="px-4 py-2 text-sm font-medium text-[#525062] hover:text-[#13111C] cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                  >
                    Enviar perfil y certificación a verificación
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Company Onboarding */}
        {selectedRole === 'empresa' && (
          <form
            onSubmit={handleCompanySubmit}
            className="bg-white border border-[#E4E2EC] rounded-xl p-6 lg:p-8 space-y-5"
          >
            <div className="space-y-1 pb-4 border-b border-[#E4E2EC]">
              <h2 className="font-display text-xl font-semibold text-[#13111C]">
                Perfil Empresarial Contratante
              </h2>
              <p className="text-xs text-[#525062]">
                Esta información se utilizará para generar automáticamente los certificados de match
                y el paquete tributario ante la DIAN.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emp-name" className="block text-xs font-medium text-[#13111C] mb-1.5">
                  Razón Social *
                </label>
                <input
                  id="emp-name"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ej. Servicios Integrales del Norte S.A.S."
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                />
              </div>
              <div>
                <label htmlFor="emp-nit" className="block text-xs font-medium text-[#13111C] mb-1.5">
                  NIT (con dígito de verificación) *
                </label>
                <input
                  id="emp-nit"
                  type="text"
                  value={nit}
                  onChange={(e) => setNit(e.target.value)}
                  placeholder="Ej. 901.234.567-8"
                  className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div>
                <label htmlFor="emp-sector" className="block text-xs font-medium text-[#13111C] mb-1.5">
                  Sector económico
                </label>
                <select
                  id="emp-sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
                >
                  <option value="Servicios y Tecnología">Servicios y Tecnología</option>
                  <option value="Transporte, Logística y Cadena de Suministro">
                    Transporte y Logística
                  </option>
                  <option value="Manufactura y Confección">Manufactura y Confección</option>
                  <option value="Comercio y Retail">Comercio y Retail</option>
                  <option value="Salud y Bienestar">Salud y Bienestar</option>
                  <option value="Agroindustria">Agroindustria</option>
                </select>
              </div>

              <div>
                <label htmlFor="emp-employees" className="block text-xs font-medium text-[#13111C] mb-1.5">
                  Número de empleados actuales
                </label>
                <input
                  id="emp-employees"
                  type="number"
                  min={1}
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm font-mono border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div>
                <label htmlFor="emp-regime" className="block text-xs font-medium text-[#13111C] mb-1.5">
                  Régimen tributario ante la DIAN
                </label>
                <select
                  id="emp-regime"
                  value={taxRegime}
                  onChange={(e) => setTaxRegime(e.target.value as TaxRegime)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
                >
                  <option value="Régimen Ordinario (35%)">Régimen Ordinario (35%)</option>
                  <option value="Gran Contribuyente">Gran Contribuyente</option>
                  <option value="ZOMAC / Régimen Especial">ZOMAC / Régimen Especial</option>
                </select>
              </div>

              <div>
                <label htmlFor="emp-city" className="block text-xs font-medium text-[#13111C] mb-1.5">
                  Ciudad sede principal
                </label>
                <select
                  id="emp-city"
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg bg-white focus:outline-none focus:border-[#5B21B6]"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="emp-hr" className="block text-xs font-medium text-[#13111C] mb-1.5">
                  Responsable de Talento Humano *
                </label>
                <input
                  id="emp-hr"
                  type="text"
                  value={hrContactName}
                  onChange={(e) => setHrContactName(e.target.value)}
                  placeholder="Ej. Andrés Mejía"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div>
                <label htmlFor="emp-email" className="block text-xs font-medium text-[#13111C] mb-1.5">
                  Correo corporativo *
                </label>
                <input
                  id="emp-email"
                  type="email"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  placeholder="talento@empresa.com.co"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#E4E2EC] rounded-lg focus:outline-none focus:border-[#5B21B6]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E4E2EC]">
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
              >
                Activar cuenta empresarial y buscar talento
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
