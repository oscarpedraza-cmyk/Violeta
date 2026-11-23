import {
  ArrowLeft,
  Building2,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  Search,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { ReactNode } from 'react';
import { AppView, UserRole } from '../types/violeta';

interface WorkspaceShellProps {
  activeView: AppView;
  activeRole: UserRole;
  breadcrumb: string;
  companyName: string;
  beneficiaryCode: string;
  pendingVerificationsCount: number;
  pendingRequestsForBeneficiary: number;
  onNavigate: (view: AppView) => void;
  onSwitchRole: (role: UserRole) => void;
  onStartOnboarding: (role?: UserRole) => void;
  children: ReactNode;
}

export function WorkspaceShell({
  activeView,
  activeRole,
  breadcrumb,
  companyName,
  beneficiaryCode,
  pendingVerificationsCount,
  pendingRequestsForBeneficiary,
  onNavigate,
  onSwitchRole,
  onStartOnboarding,
  children,
}: WorkspaceShellProps) {
  const navItems: Array<{
    id: AppView;
    label: string;
    icon: typeof Search;
    role: UserRole;
    count?: number;
  }> = [
    {
      id: 'empresa-buscar',
      label: 'Buscar Talento',
      icon: Search,
      role: 'empresa',
    },
    {
      id: 'empresa-dashboard',
      label: 'Matches y DIAN',
      icon: LayoutDashboard,
      role: 'empresa',
    },
    {
      id: 'beneficiaria-panel',
      label: 'Mi Perfil y Solicitudes',
      icon: FileCheck2,
      role: 'beneficiaria',
      count: pendingRequestsForBeneficiary,
    },
    {
      id: 'admin-panel',
      label: 'Verificación e Impacto',
      icon: ShieldCheck,
      role: 'admin',
      count: pendingVerificationsCount,
    },
  ];

  const roleLabel =
    activeRole === 'empresa'
      ? companyName
      : activeRole === 'beneficiaria'
        ? `Beneficiaria · ${beneficiaryCode}`
        : 'Comité Verificador Violeta';

  return (
    <div className="min-h-screen bg-[#F8F8FA] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-[#E4E2EC] flex flex-col justify-between shrink-0">
        <div>
          <div className="px-6 h-16 flex items-center justify-between border-b border-[#E4E2EC]">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="font-display text-lg font-semibold tracking-tight text-[#13111C] cursor-pointer whitespace-nowrap shrink-0"
            >
              Violeta Connect
            </button>
          </div>

          <div className="px-4 py-5 space-y-6">
            <div>
              <p className="px-3 text-xs font-medium text-[#6D6A7C] mb-2">
                Espacio de trabajo
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSwitchRole(item.role);
                        onNavigate(item.id);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#F2F0F7] text-[#3B0764]'
                          : 'text-[#525062] hover:bg-[#F8F8FA] hover:text-[#13111C]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className="font-mono tabular-nums text-xs font-semibold text-[#5B21B6]">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E4E2EC]">
              <p className="px-3 text-xs font-medium text-[#6D6A7C] mb-2">
                Nuevos registros
              </p>
              <button
                type="button"
                onClick={() => onStartOnboarding('beneficiaria')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#525062] hover:bg-[#F8F8FA] hover:text-[#13111C] transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Registro Beneficiaria</span>
              </button>
              <button
                type="button"
                onClick={() => onStartOnboarding('empresa')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#525062] hover:bg-[#F8F8FA] hover:text-[#13111C] transition-colors cursor-pointer"
              >
                <Building2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Registro Empresa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Role Switcher Footer in Sidebar */}
        <div className="p-4 border-t border-[#E4E2EC] space-y-3">
          <div>
            <p className="text-xs text-[#6D6A7C] mb-1.5">Cambiar vista de prototipo</p>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F2F0F7] rounded-lg">
              <button
                type="button"
                onClick={() => {
                  onSwitchRole('empresa');
                  onNavigate('empresa-buscar');
                }}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeRole === 'empresa'
                    ? 'bg-white text-[#13111C] shadow-xs'
                    : 'text-[#525062] hover:text-[#13111C]'
                }`}
              >
                Empresa
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchRole('beneficiaria');
                  onNavigate('beneficiaria-panel');
                }}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeRole === 'beneficiaria'
                    ? 'bg-white text-[#13111C] shadow-xs'
                    : 'text-[#525062] hover:text-[#13111C]'
                }`}
              >
                Mujer
              </button>
              <button
                type="button"
                onClick={() => {
                  onSwitchRole('admin');
                  onNavigate('admin-panel');
                }}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-white text-[#13111C] shadow-xs'
                    : 'text-[#525062] hover:text-[#13111C]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#525062] hover:text-[#13111C] rounded-lg hover:bg-[#F8F8FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Volver al inicio público</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E4E2EC] px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[#525062] min-w-0">
            <span className="truncate font-medium text-[#13111C]">{breadcrumb}</span>
            <span aria-hidden="true" className="text-[#A5A2B4]">/</span>
            <span className="truncate text-xs text-[#6D6A7C]">{roleLabel}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeRole === 'empresa' && activeView !== 'empresa-dashboard' && (
              <button
                type="button"
                onClick={() => onNavigate('empresa-dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ClipboardCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ver Checklist DIAN</span>
              </button>
            )}
            {activeRole === 'empresa' && activeView === 'empresa-dashboard' && (
              <button
                type="button"
                onClick={() => onNavigate('empresa-buscar')}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Buscar Perfiles</span>
              </button>
            )}
            {activeRole === 'beneficiaria' && (
              <button
                type="button"
                onClick={() => onStartOnboarding('beneficiaria')}
                className="px-4 py-2 text-xs font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Cargar Nuevo Certificado
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
