export interface PaymentHistoryRequest {
  businessId: number;
  transactionReference: string;
  invoiceNumber?: string;
  transactionAmount: number;
  dueDate: string;
  paymentDate?: string;
  paymentStatus: PaymentStatus;
  transactionType: TransactionType;
  daysOverdue?: number;
  penaltyAmount?: number;
  settledAmount?: number;
  paymentMethod?: string;
  paymentTerms?: string;
  tradeRelationship: string;
  paymentRating?: number;
  comments?: string;
  disputeStatus?: DisputeStatus;
  disputeReason?: string;

  
}

export interface PaymentHistoryResponse {
  id: number;
  businessId: number;
  businessName: string;
  businessGstin: string;
  transactionReference: string;
  invoiceNumber?: string;
  transactionAmount: number;
  dueDate: string;
  paymentDate?: string;
  paymentStatus: PaymentStatus;
  transactionType: TransactionType;
  daysOverdue?: number;
  penaltyAmount?: number;
  settledAmount?: number;
  paymentMethod?: string;
  paymentTerms?: string;
  tradeRelationship: string;
  paymentRating?: number;
  comments?: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedDate?: string;
  disputeStatus: DisputeStatus;
  disputeReason?: string;
  reportedByName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  
}

export interface PaymentAnalyticsResponse {
  businessId: number;
  businessName: string;
  
  // Overall Statistics
  totalTransactions: number;
  totalTransactionValue: number;
  averagePaymentDelay: number;
  onTimePaymentPercentage: number;
  overduePaymentPercentage: number;
  totalOverdueTransactions: number;
  totalOverdueAmount: number;
  
  // Payment Behavior Scores
  paymentReliabilityScore: number;
  paymentSpeedScore: number;
  disputeFrequencyScore: number;
  overallPaymentScore: number;
  
  // Distribution Analysis
  paymentStatusDistribution: Record<string, number>;
  paymentAmountByStatus: Record<string, number>;
  paymentDelayDistribution: Record<number, number>;
  
  // Recent Trends
  monthlyPaymentTrends: Record<string, number>;
  monthlyTransactionCounts: Record<string, number>;
  
  // Risk Indicators
  consecutiveDelays: number;
  totalDisputes: number;
  largestOverdueAmount: number;
  longestPaymentDelay: number;
  
  // Trade Relationship Summary
  relationshipTypeBreakdown: Record<string, number>;
  averageRatingByRelationship: Record<string, number>;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  DEFAULTED = 'DEFAULTED',
  DISPUTED = 'DISPUTED',
  WRITTEN_OFF = 'WRITTEN_OFF'
}

export enum TransactionType {
  INVOICE_PAYMENT = 'INVOICE_PAYMENT',
  CREDIT_NOTE = 'CREDIT_NOTE',
  ADVANCE_PAYMENT = 'ADVANCE_PAYMENT',
  REFUND = 'REFUND',
  PENALTY = 'PENALTY',
  SETTLEMENT = 'SETTLEMENT'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  DISPUTED = 'DISPUTED',
  REJECTED = 'REJECTED',
  AUTO_VERIFIED = 'AUTO_VERIFIED'
}

export enum DisputeStatus {
  NO_DISPUTE = 'NO_DISPUTE',
  DISPUTE_RAISED = 'DISPUTE_RAISED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED'
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.OVERDUE]: 'Overdue',
  [PaymentStatus.PARTIAL]: 'Partially Paid',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.DEFAULTED]: 'Defaulted',
  [PaymentStatus.DISPUTED]: 'Disputed',
  [PaymentStatus.WRITTEN_OFF]: 'Written Off'
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [PaymentStatus.OVERDUE]: 'bg-red-100 text-red-800',
  [PaymentStatus.PARTIAL]: 'bg-orange-100 text-orange-800',
  [PaymentStatus.PAID]: 'bg-green-100 text-green-800',
  [PaymentStatus.DEFAULTED]: 'bg-red-100 text-red-800',
  [PaymentStatus.DISPUTED]: 'bg-purple-100 text-purple-800',
  [PaymentStatus.WRITTEN_OFF]: 'bg-gray-100 text-gray-800'
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.INVOICE_PAYMENT]: 'Invoice Payment',
  [TransactionType.CREDIT_NOTE]: 'Credit Note',
  [TransactionType.ADVANCE_PAYMENT]: 'Advance Payment',
  [TransactionType.REFUND]: 'Refund',
  [TransactionType.PENALTY]: 'Penalty',
  [TransactionType.SETTLEMENT]: 'Settlement'
};

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: 'Pending Verification',
  [VerificationStatus.VERIFIED]: 'Verified',
  [VerificationStatus.DISPUTED]: 'Under Dispute',
  [VerificationStatus.REJECTED]: 'Rejected',
  [VerificationStatus.AUTO_VERIFIED]: 'Auto Verified'
};

export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [VerificationStatus.VERIFIED]: 'bg-green-100 text-green-800',
  [VerificationStatus.DISPUTED]: 'bg-red-100 text-red-800',
  [VerificationStatus.REJECTED]: 'bg-red-100 text-red-800',
  [VerificationStatus.AUTO_VERIFIED]: 'bg-blue-100 text-blue-800'
};

export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  [DisputeStatus.NO_DISPUTE]: 'No Dispute',
  [DisputeStatus.DISPUTE_RAISED]: 'Dispute Raised',
  [DisputeStatus.UNDER_REVIEW]: 'Under Review',
  [DisputeStatus.RESOLVED]: 'Resolved',
  [DisputeStatus.ESCALATED]: 'Escalated'
};