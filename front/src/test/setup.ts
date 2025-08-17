import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Setup MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn()
  }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  notFound: vi.fn(),
  redirect: vi.fn()
}));

// Mock Next.js image component
vi.mock('next/image', () => ({
  default: vi
    .fn()
    .mockImplementation(({ src, alt, ...props }) => ({
      type: 'img',
      props: { src, alt, ...props }
    }))
}));

// Mock Clerk hooks for unit tests
vi.mock('@clerk/nextjs', async () => {
  const actual = await vi.importActual('@clerk/nextjs');
  return {
    ...actual,
    useUser: () => ({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: 'test-user-id',
        firstName: 'Test',
        lastName: 'User',
        primaryEmailAddress: { emailAddress: 'test@example.com' },
        imageUrl: 'https://example.com/avatar.jpg'
      }
    }),
    useAuth: () => ({
      isLoaded: true,
      isSignedIn: true,
      userId: 'test-user-id',
      sessionId: 'test-session-id',
      getToken: vi.fn().mockResolvedValue('mock-token'),
      signOut: vi.fn()
    }),
    useClerk: () => ({
      loaded: true,
      user: {
        id: 'test-user-id',
        firstName: 'Test',
        lastName: 'User'
      }
    }),
    SignOutButton: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(
        'button',
        { 'data-testid': 'sign-out-button' },
        children || 'Sign Out'
      )
  };
});

// Global test setup
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock window.location for tests that need it
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    reload: vi.fn(),
    replace: vi.fn(),
    assign: vi.fn()
  },
  writable: true
});
