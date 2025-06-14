export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRoleRequest {
  userId: number;
  role: Role;
  reason?: string;
}

export interface RoleHistoryResponse {
  id: number;
  userId: number;
  userName: string;
  oldRole?: Role;
  newRole: Role;
  changedByName: string;
  reason?: string;
  changedAt: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  SME_USER = 'SME_USER',
  VIEWER = 'VIEWER'
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Administrator',
  [Role.SME_USER]: 'SME User',
  [Role.VIEWER]: 'Viewer'
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  [Role.ADMIN]: 'Full system access, can manage users and roles',
  [Role.SME_USER]: 'Can create and manage business profiles',
  [Role.VIEWER]: 'Read-only access to business information'
};