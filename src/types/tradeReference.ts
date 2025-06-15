export interface TradeReferenceRequest {
  businessId: number;
  referenceProviderId?: number;
  companyName: string;
  contactPerson: string;
  designation?: string;
  email: string;
  phone: string;
  companyAddress?: string;
  companyGstin?: string;
  referenceType: ReferenceType;
  relationshipType: RelationshipType;
  relationshipDurationMonths?: number;
  relationshipStartDate?: string;
  relationshipEndDate?: string;
  averageMonthlyBusiness?: number;
  totalBusinessValue?: number;
  creditLimitProvided?: number;
  paymentTerms?: string;
  paymentBehavior: PaymentBehavior;
  paymentRating?: number;
  overallRating?: number;
  hasDisputes?: boolean;
  disputeDetails?: string;
  referenceComments?: string;
  recommendationLevel?: RecommendationLevel;
  isConfidential?: boolean;
}

export interface TradeReferenceResponse {
  id: number;
  businessId: number;
  businessName: string;
  referenceProviderId?: number;
  referenceProviderName?: string;
  referenceNumber: string;
  companyName: string;
  contactPerson: string;
  designation?: string;
  email: string;
  phone: string;
  companyAddress?: string;
  companyGstin?: string;
  referenceType: ReferenceType;
  relationshipType: RelationshipType;
  relationshipDurationMonths?: number;
  relationshipStartDate?: string;
  relationshipEndDate?: string;
  averageMonthlyBusiness?: number;
  totalBusinessValue?: number;
  creditLimitProvided?: number;
  paymentTerms?: string;
  paymentBehavior: PaymentBehavior;
  paymentRating?: number;
  overallRating?: number;
  hasDisputes: boolean;
  disputeDetails?: string;
  referenceComments?: string;
  recommendationLevel?: RecommendationLevel;
  verificationStatus: ReferenceVerificationStatus;
  verificationMethod?: VerificationMethod;
  verifiedBy?: string;
  verifiedDate?: string;
  verificationNotes?: string;
  referenceResponse?: string;
  contactAttemptedDate?: string;
  isConfidential: boolean;
  addedByName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TradeReferenceAnalyticsResponse {
  businessId: number;
  businessName: string;
  totalReferences: number;
  verifiedReferences: number;
  pendingReferences: number;
  positiveReferences: number;
  negativeReferences: number;
  confidentialReferences: number;
  referencesWithDisputes: number;
  averagePaymentRating: number;
  averageOverallRating: number;
  verificationRate: number;
  positiveReferenceRate: number;
  disputeRate: number;
  totalBusinessValue: number;
  averageMonthlyBusinessTotal: number;
  averageBusinessValuePerReference: number;
  totalCreditLimitProvided: number;
  referenceTypeDistribution: Record<string, number>;
  relationshipTypeDistribution: Record<string, number>;
  paymentBehaviorDistribution: Record<string, number>;
  recommendationLevelDistribution: Record<string, number>;
  verificationStatusDistribution: Record<string, number>;
  longTermRelationships: number;
  highValueRelationships: number;
  averageRelationshipDuration: number;
  excellentPaymentBehaviorCount: number;
  highlyRecommendedCount: number;
  recentVerifications: number;
}

export enum ReferenceType {
  TRADE_REFERENCE = 'TRADE_REFERENCE',
  BANK_REFERENCE = 'BANK_REFERENCE',
  SUPPLIER_REFERENCE = 'SUPPLIER_REFERENCE',
  CUSTOMER_REFERENCE = 'CUSTOMER_REFERENCE',
  PARTNER_REFERENCE = 'PARTNER_REFERENCE',
  CREDIT_REFERENCE = 'CREDIT_REFERENCE'
}

export enum RelationshipType {
  SUPPLIER = 'SUPPLIER',
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  DISTRIBUTOR = 'DISTRIBUTOR',
  CONTRACTOR = 'CONTRACTOR',
  JOINT_VENTURE = 'JOINT_VENTURE',
  LICENSEE = 'LICENSEE',
  AFFILIATE = 'AFFILIATE',
  OTHER = 'OTHER'
}

export enum PaymentBehavior {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  SATISFACTORY = 'SATISFACTORY',
  POOR = 'POOR',
  VERY_POOR = 'VERY_POOR',
  DEFAULTED = 'DEFAULTED'
}

export enum RecommendationLevel {
  HIGHLY_RECOMMENDED = 'HIGHLY_RECOMMENDED',
  RECOMMENDED = 'RECOMMENDED',
  CONDITIONALLY_RECOMMENDED = 'CONDITIONALLY_RECOMMENDED',
  NOT_RECOMMENDED = 'NOT_RECOMMENDED',
  UNKNOWN = 'UNKNOWN'
}

export enum ReferenceVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  PARTIALLY_VERIFIED = 'PARTIALLY_VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  DECLINED = 'DECLINED',
  INVALID = 'INVALID',
  EXPIRED = 'EXPIRED'
}

export enum VerificationMethod {
  PHONE_CALL = 'PHONE_CALL',
  EMAIL = 'EMAIL',
  WRITTEN_RESPONSE = 'WRITTEN_RESPONSE',
  SITE_VISIT = 'SITE_VISIT',
  DIGITAL_VERIFICATION = 'DIGITAL_VERIFICATION',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  THIRD_PARTY = 'THIRD_PARTY'
}

export const REFERENCE_TYPE_LABELS: Record<ReferenceType, string> = {
  [ReferenceType.TRADE_REFERENCE]: 'Trade Reference',
  [ReferenceType.BANK_REFERENCE]: 'Bank Reference',
  [ReferenceType.SUPPLIER_REFERENCE]: 'Supplier Reference',
  [ReferenceType.CUSTOMER_REFERENCE]: 'Customer Reference',
  [ReferenceType.PARTNER_REFERENCE]: 'Partner Reference',
  [ReferenceType.CREDIT_REFERENCE]: 'Credit Reference'
};

export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  [RelationshipType.SUPPLIER]: 'Supplier',
  [RelationshipType.CUSTOMER]: 'Customer',
  [RelationshipType.VENDOR]: 'Vendor',
  [RelationshipType.DISTRIBUTOR]: 'Distributor',
  [RelationshipType.CONTRACTOR]: 'Contractor',
  [RelationshipType.JOINT_VENTURE]: 'Joint Venture',
  [RelationshipType.LICENSEE]: 'Licensee',
  [RelationshipType.AFFILIATE]: 'Affiliate',
  [RelationshipType.OTHER]: 'Other'
};

export const PAYMENT_BEHAVIOR_LABELS: Record<PaymentBehavior, string> = {
  [PaymentBehavior.EXCELLENT]: 'Excellent',
  [PaymentBehavior.GOOD]: 'Good',
  [PaymentBehavior.SATISFACTORY]: 'Satisfactory',
  [PaymentBehavior.POOR]: 'Poor',
  [PaymentBehavior.VERY_POOR]: 'Very Poor',
  [PaymentBehavior.DEFAULTED]: 'Defaulted'
};

export const PAYMENT_BEHAVIOR_COLORS: Record<PaymentBehavior, string> = {
  [PaymentBehavior.EXCELLENT]: 'bg-green-100 text-green-800',
  [PaymentBehavior.GOOD]: 'bg-blue-100 text-blue-800',
  [PaymentBehavior.SATISFACTORY]: 'bg-yellow-100 text-yellow-800',
  [PaymentBehavior.POOR]: 'bg-orange-100 text-orange-800',
  [PaymentBehavior.VERY_POOR]: 'bg-red-100 text-red-800',
  [PaymentBehavior.DEFAULTED]: 'bg-red-100 text-red-800'
};

export const RECOMMENDATION_LEVEL_LABELS: Record<RecommendationLevel, string> = {
  [RecommendationLevel.HIGHLY_RECOMMENDED]: 'Highly Recommended',
  [RecommendationLevel.RECOMMENDED]: 'Recommended',
  [RecommendationLevel.CONDITIONALLY_RECOMMENDED]: 'Conditionally Recommended',
  [RecommendationLevel.NOT_RECOMMENDED]: 'Not Recommended',
  [RecommendationLevel.UNKNOWN]: 'Unknown'
};

export const RECOMMENDATION_LEVEL_COLORS: Record<RecommendationLevel, string> = {
  [RecommendationLevel.HIGHLY_RECOMMENDED]: 'bg-green-100 text-green-800',
  [RecommendationLevel.RECOMMENDED]: 'bg-blue-100 text-blue-800',
  [RecommendationLevel.CONDITIONALLY_RECOMMENDED]: 'bg-yellow-100 text-yellow-800',
  [RecommendationLevel.NOT_RECOMMENDED]: 'bg-red-100 text-red-800',
  [RecommendationLevel.UNKNOWN]: 'bg-gray-100 text-gray-800'
};

export const VERIFICATION_STATUS_LABELS: Record<ReferenceVerificationStatus, string> = {
  [ReferenceVerificationStatus.PENDING]: 'Pending Verification',
  [ReferenceVerificationStatus.VERIFIED]: 'Verified',
  [ReferenceVerificationStatus.PARTIALLY_VERIFIED]: 'Partially Verified',
  [ReferenceVerificationStatus.UNVERIFIED]: 'Unverified',
  [ReferenceVerificationStatus.DECLINED]: 'Declined',
  [ReferenceVerificationStatus.INVALID]: 'Invalid',
  [ReferenceVerificationStatus.EXPIRED]: 'Expired'
};

export const VERIFICATION_STATUS_COLORS: Record<ReferenceVerificationStatus, string> = {
  [ReferenceVerificationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ReferenceVerificationStatus.VERIFIED]: 'bg-green-100 text-green-800',
  [ReferenceVerificationStatus.PARTIALLY_VERIFIED]: 'bg-blue-100 text-blue-800',
  [ReferenceVerificationStatus.UNVERIFIED]: 'bg-gray-100 text-gray-800',
  [ReferenceVerificationStatus.DECLINED]: 'bg-red-100 text-red-800',
  [ReferenceVerificationStatus.INVALID]: 'bg-red-100 text-red-800',
  [ReferenceVerificationStatus.EXPIRED]: 'bg-orange-100 text-orange-800'
};

export const VERIFICATION_METHOD_LABELS: Record<VerificationMethod, string> = {
  [VerificationMethod.PHONE_CALL]: 'Phone Call',
  [VerificationMethod.EMAIL]: 'Email',
  [VerificationMethod.WRITTEN_RESPONSE]: 'Written Response',
  [VerificationMethod.SITE_VISIT]: 'Site Visit',
  [VerificationMethod.DIGITAL_VERIFICATION]: 'Digital Verification',
  [VerificationMethod.DOCUMENT_VERIFICATION]: 'Document Verification',
  [VerificationMethod.THIRD_PARTY]: 'Third Party'
};