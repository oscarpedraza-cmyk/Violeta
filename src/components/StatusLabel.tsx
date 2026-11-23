import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { MatchStatus, VerificationStatus } from '../types/violeta';

interface StatusLabelProps {
  status: VerificationStatus | MatchStatus;
}

export function StatusLabel({ status }: StatusLabelProps) {
  if (status === 'Verificado' || status === 'Match confirmado') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#15803D] whitespace-nowrap shrink-0">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (status === 'Subsanación requerida') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B91C1C] whitespace-nowrap shrink-0">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  if (status === 'Aceptado por candidata' || status === 'Documentación en curso') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5B21B6] whitespace-nowrap shrink-0">
        <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B45309] whitespace-nowrap shrink-0">
      <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
