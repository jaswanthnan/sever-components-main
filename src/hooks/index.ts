import { useEffect, useState, type RefObject } from 'react';

/**
 * useDebounce: Returns a debounced version of the provided value.
 * Delays rapid input changes to improve search and filtering performance.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useLocalStorage: Syncs state with localStorage.
 * Persists React state in browser local storage.
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      return;
    }
  };

  return [storedValue, setValue];
};

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * useFetch: Handles data fetching with AbortController support.
 * Handles API requests with cancellation to prevent memory leaks and stale updates.
 */
export const useFetch = <T>(url: string, options: RequestInit = {}): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toggle, setToggle] = useState<boolean>(false);

  const refetch = () => setToggle(prev => !prev);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, { ...options, signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = (await response.json()) as T;
        setData(json);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Request failed');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [options, toggle, url]);

  return { data, loading, error, refetch };
};

/**
 * useIntersectionObserver: Detects when an element enters the viewport.
 * Useful for lazy loading and scroll-based features.
 */
export const useIntersectionObserver = (
  ref: RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options, ref]);

  return isIntersecting;
};
