import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay in milliseconds.
 * Useful for delaying search input processing.
 *
 * Usage:
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 300);
 *   // Use debouncedSearch for filtering/API calls
 */
export const useDebounce = <T>(value: T, delayMs: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
};
