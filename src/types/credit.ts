export interface CreditReportRequest {
  businessId: number;
  purpose?: string;
  comments?: string;
}

export interface CreditReportResponse {
  id: number;
  reportNumber: string;
  businessId: number;
  businessName: string;
  businessGstin: string;
  businessPan: string;
  creditScoreGrade: CreditGrade;
  creditScore: number;
  creditLimitRecommendation: number;
  riskCategory: RiskCategory;
  
  // Component Scores
  financialStrengthScore: number;
  paymentBehaviorScore: number;
  businessStabilityScore: number;
  complianceScore: number;
  
  // Business Metrics
  yearsInBusiness: number;
  gstComplianceStatus: boolean;
  panVerificationStatus: boolean;
  tradeReferencesCount: number;
  positiveReferencesCount: number;
  negativeReferencesCount: number;
  
  // Report Content
  summary: string;
  recommendations: string;
  riskFactors: string;
  positiveIndicators: string;
  
  // Report Metadata
  reportValidUntil: string;
  reportStatus: ReportStatus;
  requestedByName: string;
  createdAt: string;
  updatedAt: string;
}

export enum CreditGrade {
  AAA = 'AAA',
  AA = 'AA',
  A = 'A',
  BBB = 'BBB',
  BB = 'BB',
  B = 'B',
  CCC = 'CCC',
  CC = 'CC',
  C = 'C',
  D = 'D'
}

export enum RiskCategory {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export enum ReportStatus {
  GENERATED = 'GENERATED',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED'
}

export const CREDIT_GRADE_LABELS: Record<CreditGrade, string> = {
  [CreditGrade.AAA]: 'AAA - Excellent',
  [CreditGrade.AA]: 'AA - Very Good',
  [CreditGrade.A]: 'A - Good',
  [CreditGrade.BBB]: 'BBB - Satisfactory',
  [CreditGrade.BB]: 'BB - Fair',
  [CreditGrade.B]: 'B - Poor',
  [CreditGrade.CCC]: 'CCC - Very Poor',
  [CreditGrade.CC]: 'CC - Extremely Poor',
  [CreditGrade.C]: 'C - Highest Risk',
  [CreditGrade.D]: 'D - Default/Inactive'
};

export const CREDIT_GRADE_COLORS: Record<CreditGrade, string> = {
  [CreditGrade.AAA]: 'bg-green-100 text-green-800',
  [CreditGrade.AA]: 'bg-green-100 text-green-800',
  [CreditGrade.A]: 'bg-blue-100 text-blue-800',
  [CreditGrade.BBB]: 'bg-blue-100 text-blue-800',
  [CreditGrade.BB]: 'bg-yellow-100 text-yellow-800',
  [CreditGrade.B]: 'bg-yellow-100 text-yellow-800',
  [CreditGrade.CCC]: 'bg-orange-100 text-orange-800',
  [CreditGrade.CC]: 'bg-red-100 text-red-800',
  [CreditGrade.C]: 'bg-red-100 text-red-800',
  [CreditGrade.D]: 'bg-red-100 text-red-800'
};

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  [RiskCategory.LOW]: 'Low Risk',
  [RiskCategory.MODERATE]: 'Moderate Risk',
  [RiskCategory.HIGH]: 'High Risk',
  [RiskCategory.VERY_HIGH]: 'Very High Risk'
};

export const RISK_CATEGORY_COLORS: Record<RiskCategory, string> = {
  [RiskCategory.LOW]: 'bg-green-100 text-green-800',
  [RiskCategory.MODERATE]: 'bg-yellow-100 text-yellow-800',
  [RiskCategory.HIGH]: 'bg-orange-100 text-orange-800',
  [RiskCategory.VERY_HIGH]: 'bg-red-100 text-red-800'
};