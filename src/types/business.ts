export interface Business {
  id: number;
  businessName: string;
  gstin: string;
  pan: string;
  businessType: BusinessType;
  industryCategory: IndustryCategory;
  registrationDate?: string;
  businessDescription?: string;
  registeredAddress: string;
  city: string;
  state: string;
  pincode: string;
    address?: string; // Add optional address field
  phoneNumber?: string; // Add optional phone field
  email?: string; // Add optional email field
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  gstinVerified: boolean;
  panVerified: boolean;
  isActive: boolean;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessCreateRequest {
  businessName: string;
  gstin: string;
  pan: string;
  businessType: BusinessType;
  industryCategory: IndustryCategory;
  registrationDate?: string;
  businessDescription?: string;
  registeredAddress: string;
  city: string;
  state: string;
  pincode: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
}

export enum BusinessType {
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
  PARTNERSHIP = 'PARTNERSHIP',
  PRIVATE_LIMITED = 'PRIVATE_LIMITED',
  PUBLIC_LIMITED = 'PUBLIC_LIMITED',
  LLP = 'LLP',
  OPC = 'OPC'
}

export enum IndustryCategory {
  MANUFACTURING = 'MANUFACTURING',
  TRADING = 'TRADING',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  RETAIL = 'RETAIL',
  LOGISTICS = 'LOGISTICS',
  TEXTILE = 'TEXTILE',
  FOOD_PROCESSING = 'FOOD_PROCESSING',
  CONSTRUCTION = 'CONSTRUCTION',
  TECHNOLOGY = 'TECHNOLOGY',
  HEALTHCARE = 'HEALTHCARE',
  AGRICULTURE = 'AGRICULTURE',
  AUTOMOTIVE = 'AUTOMOTIVE',
  CHEMICALS = 'CHEMICALS',
  OTHER = 'OTHER'
}

// Display labels for enums
export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  [BusinessType.SOLE_PROPRIETORSHIP]: 'Sole Proprietorship',
  [BusinessType.PARTNERSHIP]: 'Partnership',
  [BusinessType.PRIVATE_LIMITED]: 'Private Limited',
  [BusinessType.PUBLIC_LIMITED]: 'Public Limited',
  [BusinessType.LLP]: 'Limited Liability Partnership (LLP)',
  [BusinessType.OPC]: 'One Person Company (OPC)'
};

export const INDUSTRY_CATEGORY_LABELS: Record<IndustryCategory, string> = {
  [IndustryCategory.MANUFACTURING]: 'Manufacturing',
  [IndustryCategory.TRADING]: 'Trading',
  [IndustryCategory.SERVICE_PROVIDER]: 'Service Provider',
  [IndustryCategory.RETAIL]: 'Retail',
  [IndustryCategory.LOGISTICS]: 'Logistics',
  [IndustryCategory.TEXTILE]: 'Textile',
  [IndustryCategory.FOOD_PROCESSING]: 'Food Processing',
  [IndustryCategory.CONSTRUCTION]: 'Construction',
  [IndustryCategory.TECHNOLOGY]: 'Technology',
  [IndustryCategory.HEALTHCARE]: 'Healthcare',
  [IndustryCategory.AGRICULTURE]: 'Agriculture',
  [IndustryCategory.AUTOMOTIVE]: 'Automotive',
  [IndustryCategory.CHEMICALS]: 'Chemicals',
  [IndustryCategory.OTHER]: 'Other'
};