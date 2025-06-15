import { api } from '../config/api';
import { CreditReportRequest, CreditReportResponse } from '../types/credit';
import { ApiResponse } from '../types/auth';

class CreditReportService {
  async generateCreditReport(request: CreditReportRequest): Promise<CreditReportResponse> {
    try {
      const response = await api.post<ApiResponse<CreditReportResponse>>(
        '/api/credit/generate',
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCreditReport(reportNumber: string): Promise<CreditReportResponse> {
    try {
      const response = await api.get<ApiResponse<CreditReportResponse>>(
        `/api/credit/report/${reportNumber}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCreditReportById(reportId: number): Promise<CreditReportResponse> {
    try {
      const response = await api.get<ApiResponse<CreditReportResponse>>(
        `/api/credit/report/id/${reportId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessCreditHistory(businessId: number): Promise<CreditReportResponse[]> {
    try {
      const response = await api.get<ApiResponse<CreditReportResponse[]>>(
        `/api/credit/business/${businessId}/history`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUserCreditReports(page: number = 0, size: number = 10): Promise<{
    content: CreditReportResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/api/credit/my-reports?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const errorData = error.response.data;
      return new Error(errorData.message || 'Credit report operation failed');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const creditReportService = new CreditReportService();