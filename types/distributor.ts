export enum DistributorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface Distributor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  creditLimit: number;
  outstandingBalance: number;
  status: DistributorStatus;
  createdAt: string;
  updatedAt: string;
}
