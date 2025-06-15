export interface CreditMonitoringRequest {
  businessId: number;
  monitoringName: string;
  monitoringType: MonitoringType;
  creditScoreThresholdMin?: number;
  creditScoreThresholdMax?: number;
  creditScoreChangeThreshold?: number;
  paymentDelayThresholdDays?: number;
  overdueAmountThreshold?: number;
  newTradeReferenceAlert?: boolean;
  newPaymentHistoryAlert?: boolean;
  creditReportGenerationAlert?: boolean;
  businessProfileChangeAlert?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  inAppNotifications?: boolean;
  notificationFrequency: NotificationFrequency;
  notes?: string;
}

export interface CreditMonitoringResponse {
  id: number;
  businessId: number;
  businessName: string;
  monitoringName: string;
  monitoringType: MonitoringType;
  isActive: boolean;
  creditScoreThresholdMin?: number;
  creditScoreThresholdMax?: number;
  creditScoreChangeThreshold?: number;
  paymentDelayThresholdDays?: number;
  overdueAmountThreshold?: number;
  newTradeReferenceAlert: boolean;
  newPaymentHistoryAlert: boolean;
  creditReportGenerationAlert: boolean;
  businessProfileChangeAlert: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  notificationFrequency: NotificationFrequency;
  lastCheckDate?: string;
  lastAlertDate?: string;
  totalAlertsSent: number;
  lastCreditScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditAlertResponse {
  id: number;
  businessId: number;
  businessName: string;
  alertNumber: string;
  alertType: AlertType;
  severityLevel: AlertSeverity;
  title: string;
  description: string;
  details?: string;
  previousValue?: string;
  currentValue?: string;
  thresholdValue?: string;
  changeAmount?: number;
  changePercentage?: number;
  isRead: boolean;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedDate?: string;
  acknowledgmentNotes?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  expiresAt?: string;
  createdAt: string;
}

export interface AlertStatistics {
  totalAlerts: number;
  unreadAlerts: number;
  unacknowledgedAlerts: number;
  activeMonitoring: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  lowAlerts: number;
  recentAlerts: number;
  alertTypeDistribution: Record<string, number>;
}

export enum MonitoringType {
  COMPREHENSIVE = 'COMPREHENSIVE',
  CREDIT_SCORE_ONLY = 'CREDIT_SCORE_ONLY',
  PAYMENT_BEHAVIOR = 'PAYMENT_BEHAVIOR',
  TRADE_REFERENCES = 'TRADE_REFERENCES',
  BUSINESS_PROFILE = 'BUSINESS_PROFILE',
  CUSTOM = 'CUSTOM'
}

export enum AlertType {
  CREDIT_SCORE_CHANGE = 'CREDIT_SCORE_CHANGE',
  CREDIT_SCORE_THRESHOLD = 'CREDIT_SCORE_THRESHOLD',
  PAYMENT_DELAY = 'PAYMENT_DELAY',
  OVERDUE_AMOUNT = 'OVERDUE_AMOUNT',
  NEW_TRADE_REFERENCE = 'NEW_TRADE_REFERENCE',
  TRADE_REFERENCE_VERIFIED = 'TRADE_REFERENCE_VERIFIED',
  NEW_PAYMENT_HISTORY = 'NEW_PAYMENT_HISTORY',
  CREDIT_REPORT_GENERATED = 'CREDIT_REPORT_GENERATED',
  BUSINESS_PROFILE_UPDATED = 'BUSINESS_PROFILE_UPDATED',
  RISK_LEVEL_CHANGE = 'RISK_LEVEL_CHANGE',
  CREDIT_LIMIT_CHANGE = 'CREDIT_LIMIT_CHANGE',
  DISPUTE_REPORTED = 'DISPUTE_REPORTED',
  SYSTEM_ALERT = 'SYSTEM_ALERT'
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum NotificationFrequency {
  IMMEDIATE = 'IMMEDIATE',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY'
}

export const MONITORING_TYPE_LABELS: Record<MonitoringType, string> = {
  [MonitoringType.COMPREHENSIVE]: 'Comprehensive Monitoring',
  [MonitoringType.CREDIT_SCORE_ONLY]: 'Credit Score Only',
  [MonitoringType.PAYMENT_BEHAVIOR]: 'Payment Behavior',
  [MonitoringType.TRADE_REFERENCES]: 'Trade References',
  [MonitoringType.BUSINESS_PROFILE]: 'Business Profile',
  [MonitoringType.CUSTOM]: 'Custom Rules'
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  [AlertType.CREDIT_SCORE_CHANGE]: 'Credit Score Change',
  [AlertType.CREDIT_SCORE_THRESHOLD]: 'Credit Score Threshold',
  [AlertType.PAYMENT_DELAY]: 'Payment Delay',
  [AlertType.OVERDUE_AMOUNT]: 'Overdue Amount',
  [AlertType.NEW_TRADE_REFERENCE]: 'New Trade Reference',
  [AlertType.TRADE_REFERENCE_VERIFIED]: 'Trade Reference Verified',
  [AlertType.NEW_PAYMENT_HISTORY]: 'New Payment History',
  [AlertType.CREDIT_REPORT_GENERATED]: 'Credit Report Generated',
  [AlertType.BUSINESS_PROFILE_UPDATED]: 'Business Profile Updated',
  [AlertType.RISK_LEVEL_CHANGE]: 'Risk Level Change',
  [AlertType.CREDIT_LIMIT_CHANGE]: 'Credit Limit Change',
  [AlertType.DISPUTE_REPORTED]: 'Dispute Reported',
  [AlertType.SYSTEM_ALERT]: 'System Alert'
};

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: 'Low',
  [AlertSeverity.MEDIUM]: 'Medium',
  [AlertSeverity.HIGH]: 'High',
  [AlertSeverity.CRITICAL]: 'Critical'
};

export const ALERT_SEVERITY_COLORS: Record<AlertSeverity, string> = {
  [AlertSeverity.LOW]: 'bg-gray-100 text-gray-800',
  [AlertSeverity.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [AlertSeverity.HIGH]: 'bg-orange-100 text-orange-800',
  [AlertSeverity.CRITICAL]: 'bg-red-100 text-red-800'
};

export const NOTIFICATION_FREQUENCY_LABELS: Record<NotificationFrequency, string> = {
  [NotificationFrequency.IMMEDIATE]: 'Immediate',
  [NotificationFrequency.HOURLY]: 'Hourly Digest',
  [NotificationFrequency.DAILY]: 'Daily Digest',
  [NotificationFrequency.WEEKLY]: 'Weekly Summary'
};