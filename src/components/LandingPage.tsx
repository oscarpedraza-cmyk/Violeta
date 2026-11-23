import { ArrowRight, Building2, Check, FileText, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { AppView, UserRole } from '../types/violeta';
import { calculateIncentivoVioleta, formatCOP } from '../utils/taxCalculator';

interface LandingPageProps {
  verifiedProfilesCount: number;
  confirmedMatchesCount: number;
  onNavigate: (view: AppView) => void;
  onStartOnboarding: (role?: UserRole) => void;
}

export function LandingPage({
  verifiedProfilesCount,
  confirmedMatchesCount,
  onNavigate,
  onStartOnboarding,
}: LandingPageProps) {
  const [simEmployees, setSimEmployees] = useState(3);
  const [simSalary, setSimSalary] = useState(2400000);
  const [collectiveCompanies, setCollectiveCompanies] = useState(25);
  const [heroImgError, setHeroImgError] = useState(false);
  const [legalImgError, setLegalImgError] = useState(false);
  const [portraitImgError, setPortraitImgError] = useState(false);

  const taxSim = calculateIncentivoVioleta(simSalary, simEmployees, 0.35);
  const collectiveWomenEmployed = Math.round(collectiveCompanies * 2.5);
  const collectiveAnnualTaxSavings = collectiveCompanies * 18200000;

  const institutionalAllies = [
    {
      initials: 'SDM',
      name: 'Secretaría Distrital de la Mujer',
      circleClass: 'bg-[#6D28D9] text-white',
    },
    {
      initials: 'CFB',
      name: 'Comisarías de Familia de Bogotá',
      circleClass: 'bg-[#1D4ED8] text-white',
    },
    {
      initials: 'ML',
      name: 'Medicina Legal',
      circleClass: 'bg-[#14532D] text-white',
    },
    {
      initials: 'CRB',
      name: 'Casas Refugio Bogotá',
      circleClass: 'bg-[#EA580C] text-white',
    },
    {
      initials: 'DIAN',
      name: 'DIAN',
      circleClass: 'bg-[#475569] text-white',
    },
  ];

  return (
    <div className="bg-[#F8F8FA] text-[#13111C]">
      {/* Hero Section: 2-column stretch split */}
      <section className="bg-white border-b border-[#E4E2EC]">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <p className="text-xs font-medium text-[#5B21B6] tracking-wide">
                Ley 1257 de 2008 · Artículo 23 · Decreto 2733 de 2012
              </p>

              <h1
                className="font-display font-semibold tracking-tight text-[#13111C] text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', lineHeight: 1.08 }}
              >
                Convierte el Incentivo Violeta en empleo formal y deducción del 200% en renta
              </h1>

              <p className="text-base lg:text-lg text-[#525062] leading-relaxed max-w-2xl">
                Violeta Connect conecta empresas colombianas con mujeres certificadas como víctimas
                de violencia, automatizando la reserva de identidad bajo HABEAS DATA y el expediente
                tributario exigido por la DIAN durante hasta 3 años por trabajadora.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('empresa-buscar')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5B21B6] focus-visible:outline-offset-2"
                >
                  <span>Explorar talento certificado</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onStartOnboarding('beneficiaria')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-[#13111C] bg-white border border-[#E4E2EC] hover:border-[#5B21B6]/40 hover:bg-[#F8F8FA] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Registrar perfil y certificado</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[280px] lg:min-h-[380px] rounded-xl overflow-hidden border border-[#E4E2EC] bg-[#F2F0F7] relative">
                {!heroImgError ? (
                  <img
                    src="/src/assets/images/hero_colombia_workplace_1795451105667.jpg"
                    alt="Profesionales colombianas colaborando en una oficina moderna en Bogotá"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#F2F0F7] to-[#E4E2EC]">
                    <Building2 className="w-10 h-10 text-[#5B21B6] mb-3" aria-hidden="true" />
                    <p className="font-display text-lg font-semibold text-[#13111C]">
                      Inclusión laboral con respaldo jurídico
                    </p>
                    <p className="text-sm text-[#525062] mt-1">Bogotá · Medellín · Cali · Barranquilla</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-column KPI strip below hero split */}
          <div className="mt-12 pt-8 border-t border-[#E4E2EC] grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="font-display text-2xl lg:text-3xl font-semibold text-[#13111C] tabular-nums">
                200%
              </p>
              <p className="text-xs text-[#525062] mt-1">
                Deducción de salarios y prestaciones en impuesto de renta
              </p>
            </div>
            <div>
              <p className="font-display text-2xl lg:text-3xl font-semibold text-[#13111C] tabular-nums">
                Hasta 3 años
              </p>
              <p className="text-xs text-[#525062] mt-1">
                Vigencia del beneficio tributario por cada trabajadora vinculada
              </p>
            </div>
            <div>
              <p className="font-display text-2xl lg:text-3xl font-semibold text-[#13111C] tabular-nums">
                {verifiedProfilesCount} perfiles
              </p>
              <p className="text-xs text-[#525062] mt-1">
                Certificaciones verificadas listas para contratación directa
              </p>
            </div>
            <div>
              <p className="font-display text-2xl lg:text-3xl font-semibold text-[#13111C] tabular-nums">
                Ley 1581
              </p>
              <p className="text-xs text-[#525062] mt-1">
                Anonimización estricta hasta confirmar el match ({confirmedMatchesCount} activos)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Collective Impact Calculator ("Impacto en números reales") */}
      <section className="bg-[#2E1065] text-white border-b border-[#4C1D95]">
        <div className="max-w-6xl mx-auto px-6 py-14 lg:py-16 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-medium text-[#DDD6FE] tracking-wide">
                Calculadora de Impacto Colectivo
              </p>
              <h2 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-white text-balance">
                Impacto en números reales
              </h2>
              <p className="text-sm text-[#E9D5FF] leading-relaxed">
                Desliza el número de empresas vinculadas para estimar el impacto conjunto en empleo
                formal y ahorro tributario anual en Colombia.
              </p>
            </div>

            <div className="lg:w-96 space-y-2.5 bg-[#3B0764]/70 border border-[#6D28D9]/60 rounded-xl p-5">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="collective-companies-slider"
                  className="text-xs font-medium text-[#EDE9FE]"
                >
                  Empresas participantes
                </label>
                <span className="font-mono text-base font-semibold text-white tabular-nums">
                  {collectiveCompanies}{' '}
                  {collectiveCompanies === 1 ? 'empresa' : 'empresas'}
                </span>
              </div>
              <input
                id="collective-companies-slider"
                type="range"
                min={1}
                max={100}
                step={1}
                value={collectiveCompanies}
                onChange={(e) => setCollectiveCompanies(Number(e.target.value))}
                className="w-full accent-[#C4B5FD] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono tabular-nums text-[#C4B5FD]">
                <span>1 empresa</span>
                <span>50 empresas</span>
                <span>100 empresas</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#5B21B6]">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[#DDD6FE]">Mujeres empleadas</p>
              <p className="font-display text-4xl lg:text-5xl font-semibold text-white tabular-nums">
                {collectiveWomenEmployed}
              </p>
              <p className="text-xs text-[#C4B5FD] tabular-nums">
                Promedio de 2,5 vinculaciones directas por empresa
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[#DDD6FE]">
                Ahorro tributario total generado
              </p>
              <p className="font-display text-3xl lg:text-4xl font-semibold text-white font-mono tabular-nums">
                {formatCOP(collectiveAnnualTaxSavings)}
              </p>
              <p className="text-xs text-[#C4B5FD] tabular-nums">
                Proyección anual promedio ($18.200.000 COP / empresa)
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[#DDD6FE]">
                Años de beneficio proyectado
              </p>
              <p className="font-display text-4xl lg:text-5xl font-semibold text-white tabular-nums">
                Hasta 3 años
              </p>
              <p className="text-xs text-[#C4B5FD]">
                Por trabajadora vinculada (Art. 23 Ley 1257 de 2008)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tax Calculator Section */}
      <section id="beneficio-tributario" className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-medium text-[#5B21B6]">Simulador Fiscal DIAN</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-[#13111C] text-balance">
              Calcula el impacto real del Incentivo Violeta en tu declaración de renta
            </h2>
            <p className="text-sm lg:text-base text-[#525062] leading-relaxed">
              Al vincular directamente mediante contrato laboral a una mujer víctima de violencia
              certificada, tu empresa puede deducir el 200% del valor de sus salarios y prestaciones
              sociales (tarifa general de renta 35%, Art. 240 E.T.).
            </p>
            <div className="pt-2 space-y-2 text-sm text-[#525062]">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Aplica sobre salario base y prestaciones legales (prima, cesantías, intereses, vacaciones).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Requiere vinculación laboral directa y custodia de la certificación oficial.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#E4E2EC] rounded-xl p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="sim-employees" className="text-sm font-medium text-[#13111C]">
                    Trabajadoras a vincular
                  </label>
                  <span className="font-mono text-sm font-semibold tabular-nums text-[#5B21B6]">
                    {simEmployees} {simEmployees === 1 ? 'persona' : 'personas'}
                  </span>
                </div>
                <input
                  id="sim-employees"
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={simEmployees}
                  onChange={(e) => setSimEmployees(Number(e.target.value))}
                  className="w-full accent-[#5B21B6] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#6D6A7C] mt-1 font-mono tabular-nums">
                  <span>1</span>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="sim-salary" className="text-sm font-medium text-[#13111C]">
                    Salario mensual promedio
                  </label>
                  <span className="font-mono text-sm font-semibold tabular-nums text-[#5B21B6]">
                    {formatCOP(simSalary)}
                  </span>
                </div>
                <input
                  id="sim-salary"
                  type="range"
                  min={1423500}
                  max={8000000}
                  step={100000}
                  value={simSalary}
                  onChange={(e) => setSimSalary(Number(e.target.value))}
                  className="w-full accent-[#5B21B6] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[#6D6A7C] mt-1 font-mono tabular-nums">
                  <span>1 SMMLV</span>
                  <span>$4.5M</span>
                  <span>$8.0M</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E4E2EC] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-[#6D6A7C]">Nómina + prestaciones anual</p>
                <p className="font-mono text-lg font-semibold text-[#13111C] tabular-nums mt-1">
                  {formatCOP(taxSim.annualBasePayrollCOP)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6D6A7C]">Deducción base 200% (Año 1)</p>
                <p className="font-mono text-lg font-semibold text-[#5B21B6] tabular-nums mt-1">
                  {formatCOP(taxSim.annualDeduction200COP)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6D6A7C]">Ahorro neto en renta (3 años)</p>
                <p className="font-mono text-xl font-semibold text-[#15803D] tabular-nums mt-1">
                  {formatCOP(taxSim.threeYearNetTaxSavingsCOP)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E2EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-[#6D6A7C]">
                Estimación referencial con factor prestacional del 29.5% y tarifa de renta del 35%.
              </p>
              <button
                type="button"
                onClick={() => onStartOnboarding('empresa')}
                className="px-4 py-2 text-xs font-medium text-white bg-[#13111C] hover:bg-[#2A263D] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Registrar mi empresa
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanism & Editorial Architecture (Asymmetric Grid) */}
      <section className="bg-white border-y border-[#E4E2EC]">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20 space-y-12">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#5B21B6] mb-2">Arquitectura de Confianza</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-[#13111C] text-balance">
              Privacidad absoluta para la trabajadora, trazabilidad jurídica para la DIAN
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 border border-[#E4E2EC] rounded-xl p-6 lg:p-8 flex flex-col justify-between bg-[#F8F8FA]">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#13111C]">
                    01. Certificación y HABEAS DATA (Ley 1581 de 2012)
                  </h3>
                  <p className="text-sm text-[#525062] mt-2 leading-relaxed">
                    Las mujeres cargan su certificado emitido por Comisaría de Familia, Fiscalía,
                    Medicina Legal o Casa Refugio con consentimiento explícito para datos sensibles.
                    El equipo verificador valida el radicado sin exponer la historia clínica ni la
                    identidad en búsquedas públicas.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E4E2EC]">
                  <h3 className="font-display text-xl font-semibold text-[#13111C]">
                    02. Matching anónimo por habilidades y ciudad
                  </h3>
                  <p className="text-sm text-[#525062] mt-2 leading-relaxed">
                    Las empresas filtran por competencia técnica, ciudad, disponibilidad y tipo de
                    certificado verificado. Solo cuando la candidata acepta la oferta formal y se
                    confirma el vínculo laboral se revela su identidad completa.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E4E2EC]">
                  <h3 className="font-display text-xl font-semibold text-[#13111C]">
                    03. Paquete documental listo para fiscalización DIAN
                  </h3>
                  <p className="text-sm text-[#525062] mt-2 leading-relaxed">
                    Cada contratación genera automáticamente el Certificado de Match Violeta Connect
                    y el checklist completo exigido por el Decreto 2733 de 2012: contrato directo,
                    PILA, certificación de autoridad y acta de reserva.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex-1 rounded-xl overflow-hidden border border-[#E4E2EC] bg-[#F2F0F7] min-h-[220px]">
                {!legalImgError ? (
                  <img
                    src="/src/assets/images/editorial_legal_compliance_1795451106196.jpg"
                    alt="Documentación de cumplimiento tributario DIAN y certificados verificados"
                    referrerPolicy="no-referrer"
                    onError={() => setLegalImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <FileText className="w-8 h-8 text-[#5B21B6] mb-2" aria-hidden="true" />
                    <p className="text-sm font-medium text-[#13111C]">Expediente DIAN Automatizado</p>
                  </div>
                )}
              </div>

              <div className="border border-[#E4E2EC] rounded-xl p-6 bg-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-[#5B21B6]">
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Cero estigma en el lugar de trabajo</span>
                </div>
                <p className="text-sm text-[#525062] leading-relaxed">
                  El Decreto 2733 de 2012 protege la confidencialidad de la trabajadora: la
                  certificación reposa únicamente en la reserva contable y de recursos humanos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Role Entry & Proof */}
      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#E4E2EC] bg-[#F2F0F7] min-h-[280px]">
            {!portraitImgError ? (
              <img
                src="/src/assets/images/impact_portrait_mentor_1795451106058.jpg"
                alt="Profesional contratada mediante programa de inclusión formal en Colombia"
                referrerPolicy="no-referrer"
                onError={() => setPortraitImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <UserCheck className="w-8 h-8 text-[#5B21B6] mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-[#13111C]">Autonomía económica sostenible</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <Building2 className="w-6 h-6 text-[#5B21B6]" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-[#13111C]">
                  Empresas Contratantes
                </h3>
                <p className="text-sm text-[#525062] leading-relaxed">
                  Accede a talento verificado en todo el país, proyecta tu ahorro en impuesto de
                  renta y descarga el paquete documental listo para tu equipo contable.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onNavigate('empresa-buscar')}
                  className="w-full px-4 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                >
                  Ir al panel de búsqueda
                </button>
                <button
                  type="button"
                  onClick={() => onStartOnboarding('empresa')}
                  className="w-full px-4 py-2 text-xs font-medium text-[#525062] hover:text-[#13111C] transition-colors cursor-pointer"
                >
                  Registrar NIT empresarial
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#E4E2EC] rounded-xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <ShieldCheck className="w-6 h-6 text-[#5B21B6]" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-[#13111C]">
                  Mujeres Beneficiarias
                </h3>
                <p className="text-sm text-[#525062] leading-relaxed">
                  Registra tus habilidades laborales y carga tu certificación de Comisaría, Fiscalía,
                  Medicina Legal o Casa Refugio con protección integral de tu identidad.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onStartOnboarding('beneficiaria')}
                  className="w-full px-4 py-2.5 text-sm font-medium text-[#13111C] bg-[#F2F0F7] hover:bg-[#E4E2EC] rounded-lg transition-colors cursor-pointer"
                >
                  Crear perfil protegido
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('beneficiaria-panel')}
                  className="w-full px-4 py-2 text-xs font-medium text-[#525062] hover:text-[#13111C] transition-colors cursor-pointer"
                >
                  Ver portal de beneficiaria
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Institutional Alliances ("Red institucional") */}
      <section className="bg-white border-t border-[#E4E2EC]">
        <div className="max-w-6xl mx-auto px-6 py-14 lg:py-16 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-[#5B21B6]">Articulación Institucional</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-[#13111C]">
              Red institucional
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {institutionalAllies.map((ally) => (
              <div
                key={ally.initials}
                className="border border-[#E4E2EC] rounded-xl p-5 bg-[#F8F8FA] flex flex-col items-center text-center gap-3"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-xs font-semibold tracking-tight shrink-0 ${ally.circleClass}`}
                  aria-hidden="true"
                >
                  {ally.initials}
                </div>
                <p className="text-xs font-semibold text-[#13111C] leading-snug">
                  {ally.name}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm text-[#525062] pt-2 border-t border-[#E4E2EC]">
            Violeta Connect opera en articulación con las entidades certificadoras reconocidas por la
            Ley 1257 de 2008
          </p>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-[#E4E2EC]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#6D6A7C]">
          <div className="space-y-1">
            <p className="font-display text-sm font-semibold text-[#13111C]">Violeta Connect</p>
            <p>
              Vinculación laboral formal · Ley 1257 de 2008 (Art. 23) · Protección de Datos Ley 1581 de 2012
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('empresa-buscar')}
              className="hover:text-[#13111C] transition-colors cursor-pointer"
            >
              Panel Empresas
            </button>
            <button
              type="button"
              onClick={() => onNavigate('beneficiaria-panel')}
              className="hover:text-[#13111C] transition-colors cursor-pointer"
            >
              Portal Beneficiarias
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin-panel')}
              className="hover:text-[#13111C] transition-colors cursor-pointer"
            >
              Comité Verificador
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
