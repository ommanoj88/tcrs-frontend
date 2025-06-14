import { api } from '../config/api';
import { UserResponse, UserRoleRequest, RoleHistoryResponse, Role } from '../types/Role';
import { ApiResponse } from '../types/auth';

class RoleService {
  async getAllUsers(): Promise<UserResponse[]> {
    try {
      const response = await api.get<ApiResponse<UserResponse[]>>(
        '/api/admin/roles/users'
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async assignRole(request: UserRoleRequest): Promise<UserResponse> {
    try {
      const response = await api.post<ApiResponse<UserResponse>>(
        '/api/admin/roles/assign',
        request
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async toggleUserStatus(userId: number, reason?: string): Promise<UserResponse> {
    try {
      const response = await api.post<ApiResponse<UserResponse>>(
        `/api/admin/roles/toggle-status/${userId}`,
        reason ? { reason } : {}
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getRoleHistory(): Promise<RoleHistoryResponse[]> {
    try {
      const response = await api.get<ApiResponse<RoleHistoryResponse[]>>(
        '/api/admin/roles/history'
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUserRoleHistory(userId: number): Promise<RoleHistoryResponse[]> {
    try {
      const response = await api.get<ApiResponse<RoleHistoryResponse[]>>(
        `/api/admin/roles/history/${userId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAvailableRoles(): Promise<Role[]> {
    try {
      const response = await api.get<ApiResponse<Role[]>>(
        '/api/admin/roles/available'
      );
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
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

export const roleService = new RoleService();