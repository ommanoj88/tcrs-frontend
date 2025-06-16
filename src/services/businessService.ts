import { api } from '../config/api';
import { Business, BusinessCreateRequest } from '../types/business';
import { ApiResponse } from '../types/auth';

class BusinessService {
  async createBusiness(businessData: BusinessCreateRequest): Promise<Business> {
    try {
      const response = await api.post<ApiResponse<Business>>(
        '/api/business/create',
        businessData
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getMyBusinesses(): Promise<Business[]> {
    try {
      const response = await api.get<ApiResponse<Business[]>>(
        '/api/business/my-businesses'
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessById(businessId: number): Promise<Business> {
    try {
      const response = await api.get<ApiResponse<Business>>(
        `/api/business/${businessId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getBusinessByGstin(gstin: string): Promise<Business> {
    try {
      const response = await api.get<ApiResponse<Business>>(
        `/api/business/gstin/${gstin}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
  async getAllBusinesses(): Promise<Business[]> {
  try {
    const response = await api.get<ApiResponse<Business[]>>('/api/businesses/all');
    return response.data.data;
  } catch (error: any) {
    // Fallback to getMyBusinesses if getAllBusinesses doesn't exist
    return this.getMyBusinesses();
  }
}

  private handleError(error: any): Error {
    if (error.response) {
      const errorData = error.response.data;
      
      if (errorData.validationErrors) {
        const errorMessage = Object.values(errorData.validationErrors).join(', ');
        return new Error(errorMessage);
      }
      
      return new Error(errorData.message || 'An error occurred');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const businessService = new BusinessService();