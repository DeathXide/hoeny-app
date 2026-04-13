/**
 * Generates a unique ID in the format "id-{timestamp}-{random}".
 * Suitable for local/mock IDs. Replace with server-generated IDs in production.
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `id-${timestamp}-${random}`;
};
