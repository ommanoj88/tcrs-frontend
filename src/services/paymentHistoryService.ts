import { api } from '../config/api';
import { PaymentHistoryRequest, PaymentHistoryResponse, PaymentAnalyticsResponse } from '../types/payment';
import { ApiResponse } from '../types/auth';

class PaymentHistoryService {
  async addPaymentHistory(request: PaymentHistoryRequest): Promise<PaymentHistoryResponse> {
    try {
      const response = await api.post<ApiResponse<PaymentHistoryResponse>>(
        '/api/payment-history',
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updatePaymentHistory(id: number, request: PaymentHistoryRequest): Promise<PaymentHistoryResponse> {
    try {
      const response = await api.put<ApiResponse<PaymentHistoryResponse>>(
        `/api/payment-history/${id}`,
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getPaymentHistory(id: number): Promise<PaymentHistoryResponse> {
    try {
      const response = await api.get<ApiResponse<PaymentHistoryResponse>>(
        `/api/payment-history/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessPaymentHistory(businessId: number): Promise<PaymentHistoryResponse[]> {
    try {
      const response = await api.get<ApiResponse<PaymentHistoryResponse[]>>(
        `/api/payment-history/business/${businessId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessPaymentHistoryPaginated(
    businessId: number, 
    page: number = 0, 
    size: number = 10
  ): Promise<{
    content: PaymentHistoryResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/api/payment-history/business/${businessId}/paginated?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUserPaymentHistories(page: number = 0, size: number = 10): Promise<{
    content: PaymentHistoryResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/api/payment-history/my-reports?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getPaymentAnalytics(businessId: number): Promise<PaymentAnalyticsResponse> {
    try {
      const response = await api.get<ApiResponse<PaymentAnalyticsResponse>>(
        `/api/payment-history/business/${businessId}/analytics`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async verifyPaymentHistory(id: number, approve: boolean, reason?: string): Promise<string> {
    try {
      const response = await api.post<ApiResponse<string>>(
        `/api/payment-history/${id}/verify`,
        { approve, reason }
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deletePaymentHistory(id: number): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `/api/payment-history/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const errorData = error.response.data;
      return new Error(errorData.message || 'Payment history operation failed');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const paymentHistoryService = new PaymentHistoryService();