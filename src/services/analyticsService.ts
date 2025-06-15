import { api } from '../config/api';
import { ApiResponse } from '../types/auth';

export interface DashboardAnalytics {
  overview: OverviewMetrics;
  businessAnalytics: BusinessAnalytics;
  creditAnalytics: CreditAnalytics;
  paymentAnalytics: PaymentAnalytics;
  alertAnalytics: AlertAnalytics;
  trends: TrendData;
  geographicDistribution: GeographicData[];
  industryDistribution: IndustryData[];
}

export interface OverviewMetrics {
  totalBusinesses: number;
  totalCreditReports: number;
  totalPaymentRecords: number;
  totalTradeReferences: number;
  totalAlerts: number;
  activeUsers: number;
  systemHealth: number;
  lastUpdated: string;
}

export interface BusinessAnalytics {
  totalBusinesses: number;
  newBusinessesThisMonth: number;
  verifiedBusinesses: number;
  verificationRate: number;
  businessTypeDistribution: Record<string, number>;
  industryDistribution: Record<string, number>;
  businessGrowthTrend: TrendDataPoint[];
}

export interface CreditAnalytics {
  averageCreditScore: number;
  medianCreditScore: number;
  highRiskBusinesses: number;
  lowRiskBusinesses: number;
  creditScoreDistribution: Record<string, number>;
  riskCategoryDistribution: Record<string, number>;
  creditScoreTrend: TrendDataPoint[];
  creditReportsGenerated: number;
}

export interface PaymentAnalytics {
  onTimePaymentRate: number;
  averagePaymentDelay: number;
  totalOverdueAmount: number;
  overduePayments: number;
  paymentStatusDistribution: Record<string, number>;
  paymentPerformanceTrend: TrendDataPoint[];
  topDefaulters: TopDefaulter[];
}

export interface AlertAnalytics {
  totalAlertsGenerated: number;
  unreadAlerts: number;
  criticalAlerts: number;
  alertAcknowledgmentRate: number;
  alertTypeDistribution: Record<string, number>;
  alertSeverityDistribution: Record<string, number>;
  alertTrend: TrendDataPoint[];
}

export interface TrendData {
  businessRegistrations: TrendDataPoint[];
  creditReportGeneration: TrendDataPoint[];
  paymentActivity: TrendDataPoint[];
  userActivity: TrendDataPoint[];
  alertActivity: TrendDataPoint[];
}

export interface TrendDataPoint {
  period: string;
  value: number;
  count: number;
  label: string;
}

export interface GeographicData {
  state: string;
  city?: string;
  businessCount: number;
  averageCreditScore: number;
  latitude?: number;
  longitude?: number;
}

export interface IndustryData {
  industry: string;
  businessCount: number;
  averageCreditScore: number;
  averagePaymentDelay: number;
  riskLevel: number;
}

export interface TopDefaulter {
  businessId: number;
  businessName: string;
  overdueAmount: number;
  daysPastDue: number;
  creditScore: number;
}

class AnalyticsService {
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await api.get<ApiResponse<DashboardAnalytics>>('/api/analytics/dashboard');
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessMetrics(filters?: {
    period?: string;
    industry?: string;
    location?: string;
  }): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (filters?.period) params.append('period', filters.period);
      if (filters?.industry) params.append('industry', filters.industry);
      if (filters?.location) params.append('location', filters.location);

      const response = await api.get<ApiResponse<any>>(`/api/analytics/business-metrics?${params}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCreditTrends(months: number = 12): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>(`/api/analytics/credit-trends?months=${months}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getPaymentAnalysis(filters?: {
    industry?: string;
    riskLevel?: string;
  }): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (filters?.industry) params.append('industry', filters.industry);
      if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);

      const response = await api.get<ApiResponse<any>>(`/api/analytics/payment-analysis?${params}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async exportAnalytics(format: 'pdf' | 'excel' | 'csv', reportType: string): Promise<Blob> {
    try {
      const response = await api.get(`/api/analytics/export?format=${format}&reportType=${reportType}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const errorData = error.response.data;
      return new Error(errorData.message || 'Analytics request failed');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const analyticsService = new AnalyticsService();