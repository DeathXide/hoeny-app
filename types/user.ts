export enum UserRole {
  ADMIN = 'admin',
  SALES_EXECUTIVE = 'sales_executive',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  assignedDistributorIds: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
