import { User, UserRole, UserStatus } from '@/types';

export const users: User[] = [
  {
    id: 'usr-001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@honeyapp.in',
    phone: '+91 98765 43210',
    role: UserRole.SALES_EXECUTIVE,
    status: UserStatus.ACTIVE,
    assignedDistributorIds: ['dist-001', 'dist-002', 'dist-003'],
    createdAt: '2025-01-15T09:00:00Z',
    lastLoginAt: '2026-04-11T08:30:00Z',
  },
  {
    id: 'usr-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@honeyapp.in',
    phone: '+91 87654 32109',
    role: UserRole.SALES_EXECUTIVE,
    status: UserStatus.ACTIVE,
    assignedDistributorIds: ['dist-004', 'dist-005'],
    createdAt: '2025-03-10T10:00:00Z',
    lastLoginAt: '2026-04-10T14:15:00Z',
  },
  {
    id: 'usr-003',
    name: 'Amit Verma',
    email: 'amit.verma@honeyapp.in',
    phone: '+91 76543 21098',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    assignedDistributorIds: [],
    createdAt: '2024-11-01T08:00:00Z',
    lastLoginAt: '2026-04-12T07:45:00Z',
  },
];

export const mockPasswords: Record<string, string> = {
  'rajesh.kumar@honeyapp.in': 'Rajesh@123',
  'priya.sharma@honeyapp.in': 'Priya@123',
  'amit.verma@honeyapp.in': 'Admin@123',
};
