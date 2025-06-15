import { api } from '../config/api';
import { 
  CreditMonitoringRequest, 
  CreditMonitoringResponse, 
  CreditAlertResponse,
  AlertStatistics
} from '../types/creditMonitoring';
import { ApiResponse } from '../types/auth';

class CreditMonitoringService {
  async setupCreditMonitoring(request: CreditMonitoringRequest): Promise<CreditMonitoringResponse> {
    try {
      const response = await api.post<ApiResponse<CreditMonitoringResponse>>(
        '/api/credit-monitoring',
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateCreditMonitoring(id: number, request: CreditMonitoringRequest): Promise<CreditMonitoringResponse> {
    try {
      const response = await api.put<ApiResponse<CreditMonitoringResponse>>(
        `/api/credit-monitoring/${id}`,
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUserCreditMonitoring(page: number = 0, size: number = 10): Promise<{
    content: CreditMonitoringResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/api/credit-monitoring/my-monitoring?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUserAlerts(
    page: number = 0, 
    size: number = 10, 
    unreadOnly: boolean = false
  ): Promise<{
    content: CreditAlertResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/api/credit-monitoring/alerts?page=${page}&size=${size}&unreadOnly=${unreadOnly}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async markAlertAsRead(alertId: number): Promise<CreditAlertResponse> {
    try {
      const response = await api.post<ApiResponse<CreditAlertResponse>>(
        `/api/credit-monitoring/alerts/${alertId}/mark-read`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async acknowledgeAlert(alertId: number, notes?: string): Promise<CreditAlertResponse> {
    try {
      const response = await api.post<ApiResponse<CreditAlertResponse>>(
        `/api/credit-monitoring/alerts/${alertId}/acknowledge`,
        { notes: notes || '' }
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUserAlertStatistics(): Promise<AlertStatistics> {
    try {
      const response = await api.get<ApiResponse<AlertStatistics>>(
        '/api/credit-monitoring/statistics'
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deactivateMonitoring(id: number): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `/api/credit-monitoring/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const errorData = error.response.data;
      return new Error(errorData.message || 'Credit monitoring operation failed');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const creditMonitoringService = new CreditMonitoringService();