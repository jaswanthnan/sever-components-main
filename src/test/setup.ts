import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js Navigation
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    };
  },
  usePathname() {
    return '/candidates/new';
  },
  useSearchParams() {
    return {
      get: vi.fn(),
      toString: vi.fn(),
    };
  },
}));
