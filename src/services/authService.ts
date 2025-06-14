import { api, setTokens, clearTokens } from '../config/api';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  User,
} from '../types/auth';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        '/api/auth/login',
        credentials
      );

      const authData = response.data.data;
      
      // Store tokens and user data
      setTokens(authData.accessToken, authData.refreshToken);
      localStorage.setItem('user', JSON.stringify(authData.user));

      return authData;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        '/api/auth/register',
        userData
      );

      const authData = response.data.data;
      
      // Store tokens and user data
      setTokens(authData.accessToken, authData.refreshToken);
      localStorage.setItem('user', JSON.stringify(authData.user));

      return authData;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/api/auth/me');
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<ApiResponse<AuthResponse>>(
        '/api/auth/refresh',
        { refreshToken }
      );

      const authData = response.data.data;
      
      // Update tokens and user data
      setTokens(authData.accessToken, authData.refreshToken);
      localStorage.setItem('user', JSON.stringify(authData.user));

      return authData;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      clearTokens();
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      await api.get('/api/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  }

  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      
      if (errorData.validationErrors) {
        // Validation errors
        const errorMessage = Object.values(errorData.validationErrors).join(', ');
        return new Error(errorMessage);
      }
      
      return new Error(errorData.message || 'An error occurred');
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const authService = new AuthService();