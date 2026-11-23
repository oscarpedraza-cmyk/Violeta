import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AppView } from '../types/violeta';

interface TopNavProps {
  onNavigate: (view: AppView) => void;
  onStartOnboarding: (role?: 'beneficiaria' | 'empresa') => void;
}

export function TopNav({ onNavigate, onStartOnboarding }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E4E2EC]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="font-display text-xl font-semibold tracking-tight text-[#13111C] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#5B21B6] focus-visible:outline-offset-4 cursor-pointer"
        >
          Violeta Connect
        </button>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#525062]">
          <a
            href="#beneficio-tributario"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('landing');
              setTimeout(() => {
                document.getElementById('beneficio-tributario')?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="hover:text-[#13111C] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Beneficio 200%
          </a>
          <button
            type="button"
            onClick={() => onNavigate('empresa-buscar')}
            className="hover:text-[#13111C] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Panel Empresas
          </button>
          <button
            type="button"
            onClick={() => onNavigate('beneficiaria-panel')}
            className="hover:text-[#13111C] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Portal Beneficiarias
          </button>
          <button
            type="button"
            onClick={() => onNavigate('admin-panel')}
            className="hover:text-[#13111C] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Verificación Admin
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onStartOnboarding()}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#5B21B6] hover:bg-[#4C1D95] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#5B21B6] focus-visible:outline-offset-2"
          >
            Registrar Perfil
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="md:hidden p-2.5 text-[#13111C] rounded-lg hover:bg-[#F2F0F7] cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#E4E2EC] px-6 py-4 space-y-3">
          <button
            type="button"
            onClick={() => {
              onNavigate('empresa-buscar');
              setMobileOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#13111C]"
          >
            Panel Empresas
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('beneficiaria-panel');
              setMobileOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#13111C]"
          >
            Portal Beneficiarias
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate('admin-panel');
              setMobileOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#13111C]"
          >
            Verificación Admin
          </button>
          <button
            type="button"
            onClick={() => {
              onStartOnboarding();
              setMobileOpen(false);
            }}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-[#5B21B6] rounded-lg"
          >
            Registrar Perfil
          </button>
        </div>
      )}
    </header>
  );
}
