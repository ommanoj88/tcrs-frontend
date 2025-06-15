import { api } from '../config/api';
import { TradeReferenceRequest, TradeReferenceResponse, TradeReferenceAnalyticsResponse, ReferenceVerificationStatus, VerificationMethod } from '../types/tradeReference';
import { ApiResponse } from '../types/auth';

class TradeReferenceService {
  async addTradeReference(request: TradeReferenceRequest): Promise<TradeReferenceResponse> {
    try {
      const response = await api.post<ApiResponse<TradeReferenceResponse>>(
        '/api/trade-references',
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateTradeReference(id: number, request: TradeReferenceRequest): Promise<TradeReferenceResponse> {
    try {
      const response = await api.put<ApiResponse<TradeReferenceResponse>>(
        `/api/trade-references/${id}`,
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getTradeReference(id: number): Promise<TradeReferenceResponse> {
    try {
      const response = await api.get<ApiResponse<TradeReferenceResponse>>(
        `/api/trade-references/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessTradeReferences(businessId: number): Promise<TradeReferenceResponse[]> {
    try {
      const response = await api.get<ApiResponse<TradeReferenceResponse[]>>(
        `/api/trade-references/business/${businessId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessTradeReferencesPaginated(
    businessId: number, 
    page: number = 0, 
    size: number = 10
  ): Promise<{
    content: TradeReferenceResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/api/trade-references/business/${businessId}/paginated?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUserTradeReferences(page: number = 0, size: number = 10): Promise<{
    content: TradeReferenceResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/api/trade-references/my-references?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getPendingVerifications(page: number = 0, size: number = 10): Promise<{
    content: TradeReferenceResponse[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>(
        `/api/trade-references/pending-verifications?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getTradeReferenceAnalytics(businessId: number): Promise<TradeReferenceAnalyticsResponse> {
    try {
      const response = await api.get<ApiResponse<TradeReferenceAnalyticsResponse>>(
        `/api/trade-references/business/${businessId}/analytics`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async verifyTradeReference(
    id: number, 
    status: ReferenceVerificationStatus, 
    method: VerificationMethod,
    notes?: string,
    response?: string
  ): Promise<string> {
    try {
      const requestBody = {
        status: status.toString(),
        method: method.toString(),
        notes: notes || '',
        response: response || ''
      };
      
      const apiResponse = await api.post<ApiResponse<string>>(
        `/api/trade-references/${id}/verify`,
        requestBody
      );
      return apiResponse.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async markContactAttempted(id: number, notes?: string): Promise<string> {
    try {
      const response = await api.post<ApiResponse<string>>(
        `/api/trade-references/${id}/contact-attempted`,
        { notes: notes || '' }
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async searchTradeReferences(businessId: number, searchTerm: string): Promise<TradeReferenceResponse[]> {
    try {
      const response = await api.get<ApiResponse<TradeReferenceResponse[]>>(
        `/api/trade-references/business/${businessId}/search?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteTradeReference(id: number): Promise<string> {
    try {
      const response = await api.delete<ApiResponse<string>>(
        `/api/trade-references/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const errorData = error.response.data;
      return new Error(errorData.message || 'Trade reference operation failed');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const tradeReferenceService = new TradeReferenceService();