/**
 * Returns a promise that resolves after the given number of milliseconds.
 * Used to simulate network latency in the mock service layer.
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
