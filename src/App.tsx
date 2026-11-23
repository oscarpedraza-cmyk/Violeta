import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { BeneficiaryPanel } from './components/BeneficiaryPanel';
import { CompanyDashboard } from './components/CompanyDashboard';
import { CompanySearchPanel } from './components/CompanySearchPanel';
import { LandingPage } from './components/LandingPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { TopNav } from './components/TopNav';
import { WorkspaceShell } from './components/WorkspaceShell';
import {
  createDefaultDianChecklist,
  INITIAL_BENEFICIARIES,
  INITIAL_COMPANIES,
  INITIAL_MATCHES,
} from './data/seedData';
import {
  AppView,
  BeneficiaryProfile,
  CompanyProfile,
  MatchRequest,
  UserRole,
  VerificationStatus,
} from './types/violeta';

const STORAGE_KEY = 'violeta_connect_state_v1';

interface PersistedState {
  beneficiaries: BeneficiaryProfile[];
  companies: CompanyProfile[];
  matches: MatchRequest[];
  activeCompanyId: string;
  activeBeneficiaryId: string;
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (
        Array.isArray(parsed.beneficiaries) &&
        Array.isArray(parsed.companies) &&
        Array.isArray(parsed.matches)
      ) {
        return parsed;
      }
    }
  } catch {
    // Fallback to clean seeded data
  }
  return {
    beneficiaries: INITIAL_BENEFICIARIES,
    companies: INITIAL_COMPANIES,
    matches: INITIAL_MATCHES,
    activeCompanyId: INITIAL_COMPANIES[0].id,
    activeBeneficiaryId: INITIAL_BENEFICIARIES[1].id,
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [activeRole, setActiveRole] = useState<UserRole>('empresa');
  const [onboardingRole, setOnboardingRole] = useState<UserRole>('beneficiaria');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const activeCompany =
    state.companies.find((c) => c.id === state.activeCompanyId) ?? state.companies[0];
  const activeBeneficiary =
    state.beneficiaries.find((b) => b.id === state.activeBeneficiaryId) ??
    state.beneficiaries[0];

  const handleNavigate = (view: AppView) => {
    if (view === 'empresa-buscar' || view === 'empresa-dashboard') {
      setActiveRole('empresa');
    } else if (view === 'beneficiaria-panel') {
      setActiveRole('beneficiaria');
    } else if (view === 'admin-panel') {
      setActiveRole('admin');
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOnboarding = (role: UserRole = 'beneficiaria') => {
    setOnboardingRole(role === 'empresa' ? 'empresa' : 'beneficiaria');
    setActiveView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateBeneficiary = (profile: BeneficiaryProfile) => {
    setState((prev) => ({
      ...prev,
      beneficiaries: [profile, ...prev.beneficiaries],
      activeBeneficiaryId: profile.id,
    }));
    setActiveRole('beneficiaria');
    setActiveView('beneficiaria-panel');
    showToast(
      `Perfil ${profile.anonymizedCode} registrado con HABEAS DATA y enviado a verificación.`
    );
  };

  const handleCreateCompany = (company: CompanyProfile) => {
    setState((prev) => ({
      ...prev,
      companies: [company, ...prev.companies],
      activeCompanyId: company.id,
    }));
    setActiveRole('empresa');
    setActiveView('empresa-buscar');
    showToast(`Empresa ${company.businessName} registrada correctamente.`);
  };

  const handleCreateMatchRequest = (payload: {
    beneficiaryId: string;
    roleTitle: string;
    offeredSalaryCOP: number;
    contractType: 'Término Indefinido' | 'Término Fijo (1 año+)';
    startDateEstimated: string;
    messageFromCompany: string;
  }) => {
    const targetBen = state.beneficiaries.find((b) => b.id === payload.beneficiaryId);
    const matchNumber = String(state.matches.length + 29).padStart(3, '0');
    const newMatch: MatchRequest = {
      id: `m-${Date.now()}`,
      matchCode: `VC-MATCH-2026-${matchNumber}`,
      companyId: activeCompany.id,
      beneficiaryId: payload.beneficiaryId,
      roleTitle: payload.roleTitle,
      offeredSalaryCOP: payload.offeredSalaryCOP,
      contractType: payload.contractType,
      startDateEstimated: payload.startDateEstimated,
      messageFromCompany: payload.messageFromCompany,
      status: 'Solicitado',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dianChecklist: createDefaultDianChecklist(
        targetBen?.verificationStatus === 'Verificado',
        false,
        targetBen?.certificateNumber ?? 'PENDIENTE'
      ),
    };

    setState((prev) => ({
      ...prev,
      matches: [newMatch, ...prev.matches],
      activeBeneficiaryId: payload.beneficiaryId,
    }));
    showToast(
      `Solicitud ${newMatch.matchCode} enviada. El flujo documental DIAN quedó activado.`
    );
  };

  const handleToggleChecklistItem = (matchId: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) => {
        if (m.id !== matchId) return m;
        const updatedChecklist = m.dianChecklist.map((item) =>
          item.id === itemId
            ? {
                ...item,
                completed: !item.completed,
                documentRef: !item.completed ? 'Soporte validado por empleador' : undefined,
              }
            : item
        );
        return {
          ...m,
          status:
            m.status === 'Aceptado por candidata' ? 'Documentación en curso' : m.status,
          updatedAt: new Date().toISOString(),
          dianChecklist: updatedChecklist,
        };
      }),
    }));
  };

  const handleConfirmMatch = (matchId: string) => {
    setState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          status: 'Match confirmado',
          updatedAt: new Date().toISOString(),
          dianChecklist: m.dianChecklist.map((item) => ({
            ...item,
            completed: true,
            documentRef: item.documentRef ?? 'Confirmado en expediente DIAN',
          })),
        };
      }),
    }));
    showToast('Match confirmado. Identidad revelada y Certificado DIAN emitido.');
  };

  const handleAcceptContactRequest = (matchId: string) => {
    setState((prev) => ({
      ...prev,
      matches: prev.matches.map((m) =>
        m.id === matchId
          ? {
              ...m,
              status: 'Aceptado por candidata',
              updatedAt: new Date().toISOString(),
            }
          : m
      ),
    }));
    showToast('Contacto aceptado. La empresa puede avanzar con el paquete DIAN.');
  };

  const handleDeclineContactRequest = (matchId: string) => {
    setState((prev) => ({
      ...prev,
      matches: prev.matches.filter((m) => m.id !== matchId),
    }));
    showToast('Solicitud declinada. Tu identidad se mantuvo protegida.');
  };

  const handleVerifyBeneficiary = (
    beneficiaryId: string,
    status: VerificationStatus,
    notes?: string
  ) => {
    setState((prev) => ({
      ...prev,
      beneficiaries: prev.beneficiaries.map((b) =>
        b.id === beneficiaryId
          ? {
              ...b,
              verificationStatus: status,
              verificationNotes: notes,
            }
          : b
      ),
      matches: prev.matches.map((m) => {
        if (m.beneficiaryId !== beneficiaryId) return m;
        return {
          ...m,
          dianChecklist: m.dianChecklist.map((item) =>
            item.id === 'chk-1' ? { ...item, completed: status === 'Verificado' } : item
          ),
        };
      }),
    }));
    showToast(
      status === 'Verificado'
        ? 'Certificación aprobada. Perfil habilitado para búsqueda empresarial.'
        : 'Observación enviada para subsanación documental.'
    );
  };

  const verifiedCount = state.beneficiaries.filter(
    (b) => b.verificationStatus === 'Verificado'
  ).length;
  const pendingVerificationsCount = state.beneficiaries.filter(
    (b) => b.verificationStatus === 'En revisión'
  ).length;
  const confirmedMatchesCount = state.matches.filter(
    (m) => m.status === 'Match confirmado'
  ).length;
  const pendingRequestsForBeneficiary = state.matches.filter(
    (m) => m.beneficiaryId === activeBeneficiary.id && m.status === 'Solicitado'
  ).length;

  const breadcrumbMap: Record<AppView, string> = {
    landing: 'Inicio',
    onboarding: 'Registro',
    'empresa-buscar': 'Buscar Talento Certificado',
    'empresa-dashboard': 'Matches y Expediente DIAN',
    'beneficiaria-panel': 'Portal Beneficiaria',
    'admin-panel': 'Comité Verificador e Impacto',
  };

  return (
    <>
      {activeView === 'landing' && (
        <div className="min-h-screen flex flex-col">
          <TopNav onNavigate={handleNavigate} onStartOnboarding={handleStartOnboarding} />
          <main className="flex-1">
            <LandingPage
              verifiedProfilesCount={verifiedCount}
              confirmedMatchesCount={confirmedMatchesCount}
              onNavigate={handleNavigate}
              onStartOnboarding={handleStartOnboarding}
            />
          </main>
        </div>
      )}

      {activeView === 'onboarding' && (
        <OnboardingFlow
          initialRole={onboardingRole}
          onCancel={() => handleNavigate('landing')}
          onCreateBeneficiary={handleCreateBeneficiary}
          onCreateCompany={handleCreateCompany}
        />
      )}

      {activeView !== 'landing' && activeView !== 'onboarding' && (
        <WorkspaceShell
          activeView={activeView}
          activeRole={activeRole}
          breadcrumb={breadcrumbMap[activeView]}
          companyName={activeCompany.businessName}
          beneficiaryCode={activeBeneficiary.anonymizedCode}
          pendingVerificationsCount={pendingVerificationsCount}
          pendingRequestsForBeneficiary={pendingRequestsForBeneficiary}
          onNavigate={handleNavigate}
          onSwitchRole={(role) => setActiveRole(role)}
          onStartOnboarding={handleStartOnboarding}
        >
          {activeView === 'empresa-buscar' && (
            <CompanySearchPanel
              beneficiaries={state.beneficiaries}
              company={activeCompany}
              existingMatches={state.matches}
              onCreateMatchRequest={handleCreateMatchRequest}
              onGoToDashboard={() => handleNavigate('empresa-dashboard')}
            />
          )}

          {activeView === 'empresa-dashboard' && (
            <CompanyDashboard
              company={activeCompany}
              matches={state.matches}
              beneficiaries={state.beneficiaries}
              onToggleChecklistItem={handleToggleChecklistItem}
              onConfirmMatch={handleConfirmMatch}
              onGoToSearch={() => handleNavigate('empresa-buscar')}
            />
          )}

          {activeView === 'beneficiaria-panel' && (
            <BeneficiaryPanel
              beneficiaries={state.beneficiaries}
              activeBeneficiaryId={activeBeneficiary.id}
              onSelectBeneficiary={(id) =>
                setState((prev) => ({ ...prev, activeBeneficiaryId: id }))
              }
              matches={state.matches}
              companies={state.companies}
              onAcceptContactRequest={handleAcceptContactRequest}
              onDeclineContactRequest={handleDeclineContactRequest}
              onGoToUpload={() => handleStartOnboarding('beneficiaria')}
            />
          )}

          {activeView === 'admin-panel' && (
            <AdminDashboard
              beneficiaries={state.beneficiaries}
              companies={state.companies}
              matches={state.matches}
              onVerifyBeneficiary={handleVerifyBeneficiary}
              onConfirmMatchByAdmin={handleConfirmMatch}
            />
          )}
        </WorkspaceShell>
      )}

      {/* Accessible Non-Blocking Notification Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-md bg-[#13111C] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" aria-hidden="true" />
          <span className="leading-snug">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Cerrar notificación"
            className="text-white/70 hover:text-white ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
