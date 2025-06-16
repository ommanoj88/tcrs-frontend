import { api } from '../config/api';
import { ApiResponse } from '../types/auth';

export interface KycDocument {
  id: number;
  businessId: number;
  businessName: string;
  documentType: string;
  documentNumber: string;
  originalFilename: string;
  fileSize: string;
  mimeType: string;
  verificationStatus: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'RESUBMISSION_REQUIRED';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  expiryDate?: string;
  isPrimary: boolean;
  confidenceScore?: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface KycProfile {
  id: number;
  businessId: number;
  businessName: string;
  kycStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'COMPLETED' | 'REJECTED' | 'EXPIRED' | 'ON_HOLD';
  kycLevel: 'BASIC' | 'STANDARD' | 'ENHANCED' | 'PREMIUM';
  completionPercentage: number;
  riskScore?: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  businessVerificationStatus: boolean;
  directorVerificationStatus: boolean;
  financialVerificationStatus: boolean;
  addressVerificationStatus: boolean;
  bankingVerificationStatus: boolean;
  lastVerificationDate?: string;
  nextReviewDate?: string;
  assignedOfficer?: string;
  verificationNotes?: string;
  complianceFlags?: string;
  documents: KycDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface KycAnalytics {
  totalDocuments: number;
  pendingDocuments: number;
  verifiedDocuments: number;
  rejectedDocuments: number;
  totalProfiles: number;
  completedProfiles: number;
  inProgressProfiles: number;
  pendingReviewProfiles: number;
  lowRiskProfiles: number;
  mediumRiskProfiles: number;
  highRiskProfiles: number;
  veryHighRiskProfiles: number;
  averageCompletionPercentage: number;
  averageRiskScore: number;
}

export interface DocumentUploadRequest {
  businessId: number;
  documentType: string;
  documentNumber: string;
  expiryDate?: string;
  isPrimary?: boolean;
  notes?: string;
}

export interface DocumentVerificationRequest {
  documentId: number;
  verificationStatus: string;
  verificationNotes?: string;
  confidenceScore?: number;
}

// Extended API Response for paginated data
interface PaginatedApiResponse<T> extends ApiResponse<T> {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

class KycService {
  // Document Upload
  async uploadDocument(file: File, request: DocumentUploadRequest): Promise<KycDocument> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('businessId', request.businessId.toString());
      formData.append('documentType', request.documentType);
      formData.append('documentNumber', request.documentNumber);
      
      if (request.expiryDate) {
        formData.append('expiryDate', request.expiryDate);
      }
      
      if (request.isPrimary !== undefined) {
        formData.append('isPrimary', request.isPrimary.toString());
      }

      const response = await api.post<ApiResponse<KycDocument>>('/api/kyc/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get Documents by Business
  async getDocumentsByBusiness(businessId: number): Promise<KycDocument[]> {
    try {
      const response = await api.get<ApiResponse<KycDocument[]>>(`/api/kyc/documents/business/${businessId}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get Single Document
  async getDocument(documentId: number): Promise<KycDocument> {
    try {
      const response = await api.get<ApiResponse<KycDocument>>(`/api/kyc/documents/${documentId}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Delete Document
  async deleteDocument(documentId: number): Promise<void> {
    try {
      await api.delete(`/api/kyc/documents/${documentId}`);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Verify Document (Admin only)
  async verifyDocument(request: DocumentVerificationRequest): Promise<KycDocument> {
    try {
      const response = await api.post<ApiResponse<KycDocument>>('/api/kyc/documents/verify', request);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Get Pending Documents (Admin only) - Fixed pagination handling
  async getPendingDocuments(page: number = 0, size: number = 20): Promise<{
    documents: KycDocument[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    try {
      const response = await api.get<PaginatedApiResponse<KycDocument[]>>(`/api/kyc/documents/pending?page=${page}&size=${size}`);
      
      return {
        documents: response.data.data,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        currentPage: response.data.currentPage || page,
        pageSize: response.data.pageSize || size,
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // KYC Profile Methods
  async getKycProfile(businessId: number): Promise<KycProfile> {
    try {
      const response = await api.get<ApiResponse<KycProfile>>(`/api/kyc/profile/${businessId}`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async refreshKycProfile(businessId: number): Promise<KycProfile> {
    try {
      const response = await api.post<ApiResponse<KycProfile>>(`/api/kyc/profile/${businessId}/refresh`);
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Analytics (Admin only)
  async getKycAnalytics(): Promise<KycAnalytics> {
    try {
      const response = await api.get<ApiResponse<KycAnalytics>>('/api/kyc/analytics');
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getHighRiskProfiles(): Promise<KycProfile[]> {
    try {
      const response = await api.get<ApiResponse<KycProfile[]>>('/api/kyc/profiles/high-risk');
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getProfilesNeedingReview(): Promise<KycProfile[]> {
    try {
      const response = await api.get<ApiResponse<KycProfile[]>>('/api/kyc/profiles/review-needed');
      return response.data.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const errorData = error.response.data;
      return new Error(errorData.message || 'KYC request failed');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const kycService = new KycService();