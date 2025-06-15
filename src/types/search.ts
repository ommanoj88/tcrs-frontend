import { Business, BusinessType, IndustryCategory } from './business'; // ← Import Business from business types

export interface BusinessSearchRequest {
  query?: string;
  businessName?: string;
  gstin?: string;
  pan?: string;
  city?: string;
  state?: string;
  businessType?: BusinessType;
  industryCategory?: IndustryCategory;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface BusinessSearchResponse {
  businesses: Business[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchFilters {
  businessType?: BusinessType;
  industryCategory?: IndustryCategory;
  city?: string;
  state?: string;
  gstinVerified?: boolean;
  panVerified?: boolean;
}

export interface SearchStats {
  totalBusinesses: number;
  recentSearches: string[];
}