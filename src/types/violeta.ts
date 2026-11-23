export type UserRole = 'beneficiaria' | 'empresa' | 'admin';

export type AppView =
  | 'landing'
  | 'onboarding'
  | 'empresa-buscar'
  | 'empresa-dashboard'
  | 'beneficiaria-panel'
  | 'admin-panel';

export type CertificateIssuer =
  | 'Comisaría de Familia'
  | 'Fiscalía General de la Nación'
  | 'Medicina Legal'
  | 'Casa Refugio';

export type AvailabilityType =
  | 'Inmediata'
  | 'En 15 días'
  | 'Tiempo completo'
  | 'Medio tiempo';

export type VerificationStatus =
  | 'Verificado'
  | 'En revisión'
  | 'Subsanación requerida';

export type MatchStatus =
  | 'Solicitado'
  | 'Aceptado por candidata'
  | 'Documentación en curso'
  | 'Match confirmado';

export type TaxRegime =
  | 'Régimen Ordinario (35%)'
  | 'Gran Contribuyente'
  | 'ZOMAC / Régimen Especial';

export interface HabeasDataConsent {
  acceptedSensitiveData: boolean;
  acceptedEncryptedStorage: boolean;
  acceptedIdentityRevealOnMatch: boolean;
  acceptedAt: string;
}

export interface BeneficiaryProfile {
  id: string;
  anonymizedCode: string;
  publicTitle: string;
  city: string;
  skills: string[];
  experienceYears: number;
  availability: AvailabilityType;
  modality: 'Presencial' | 'Híbrido' | 'Remoto';
  expectedSalaryCOP: number;
  summaryPublic: string;
  // Private fields revealed strictly after Match confirmado
  fullName: string;
  documentIdMasked: string;
  email: string;
  phone: string;
  // Certificate & Compliance
  certificateIssuer: CertificateIssuer;
  certificateNumber: string;
  certificateIssueDate: string;
  certificateFileName: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  habeasData: HabeasDataConsent;
  createdAt: string;
}

export interface CompanyProfile {
  id: string;
  businessName: string;
  nit: string;
  sector: string;
  employeeCount: number;
  taxRegime: TaxRegime;
  city: string;
  hrContactName: string;
  hrEmail: string;
  createdAt: string;
}

export interface DianChecklistItem {
  id: string;
  title: string;
  legalReference: string;
  responsible: 'Empresa' | 'Beneficiaria' | 'Violeta Connect';
  completed: boolean;
  documentRef?: string;
}

export interface MatchRequest {
  id: string;
  matchCode: string;
  companyId: string;
  beneficiaryId: string;
  roleTitle: string;
  offeredSalaryCOP: number;
  contractType: 'Término Indefinido' | 'Término Fijo (1 año+)';
  startDateEstimated: string;
  messageFromCompany: string;
  status: MatchStatus;
  createdAt: string;
  updatedAt: string;
  dianChecklist: DianChecklistItem[];
}
