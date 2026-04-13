import { User, LoginCredentials } from '@/types';
import { mockUsers, mockPasswords } from '@/data';
import { delay } from '@/utils/delay';

/**
 * Authenticates a user with email and password.
 * Returns the User object on success, null on failure.
 */
export const login = async (credentials: LoginCredentials): Promise<User | null> => {
  await delay(1000);

  const expectedPassword = mockPasswords[credentials.email];
  if (!expectedPassword || expectedPassword !== credentials.password) {
    return null;
  }

  const user = mockUsers.find((u) => u.email === credentials.email);
  return user ?? null;
};

/**
 * Returns the list of all users (for admin user management).
 */
export const getUsers = async (): Promise<User[]> => {
  await delay(500);
  return mockUsers;
};
