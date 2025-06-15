import { api } from '../config/api';
import { Business } from '../types/business';
import { BusinessSearchRequest, BusinessSearchResponse } from '../types/search';
import { ApiResponse } from '../types/auth';

class BusinessSearchService {
  async searchBusinesses(request: BusinessSearchRequest): Promise<BusinessSearchResponse> {
    try {
      const response = await api.post<ApiResponse<BusinessSearchResponse>>(
        '/api/search/businesses',
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // V3 COMPATIBILITY METHOD - Add this method to support the monitoring component
  async searchBusinessesSimple(params: {
    query: string;
    page?: number;
    size?: number;
  }): Promise<{ businesses: Business[] }> {
    try {
      // Convert simple params to BusinessSearchRequest format
      const searchRequest: BusinessSearchRequest = {
        query: params.query,
        page: params.page || 0,
        size: params.size || 10
      };

      const response = await this.searchBusinesses(searchRequest);
      
      // Return in the format expected by the monitoring component
      return {
        businesses: response.businesses || []
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessByGstin(gstin: string): Promise<Business> {
    try {
      const response = await api.get<ApiResponse<Business>>(
        `/api/search/businesses/gstin/${gstin}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessById(businessId: number): Promise<Business> {
    try {
      const response = await api.get<ApiResponse<Business>>(
        `/api/search/businesses/${businessId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessesByLocation(location: string, page: number = 0, size: number = 10): Promise<Business[]> {
    try {
      const response = await api.get<ApiResponse<Business[]>>(
        `/api/search/businesses/location/${location}?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessesByIndustry(industry: string, page: number = 0, size: number = 10): Promise<Business[]> {
    try {
      const response = await api.get<ApiResponse<Business[]>>(
        `/api/search/businesses/industry/${industry}?page=${page}&size=${size}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getTotalBusinesses(): Promise<number> {
    try {
      const response = await api.get<ApiResponse<number>>(
        '/api/search/stats'
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const errorData = error.response.data;
      return new Error(errorData.message || 'Search failed');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const businessSearchService = new BusinessSearchService();