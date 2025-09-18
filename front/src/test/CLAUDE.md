# Testing Infrastructure - Implementation Guide

## TDD Testing Architecture

This project implements a **three-level testing pyramid** following TDD principles:

### 1. Component Tests (Vitest + React Testing Library)

**Location**: `src/**/__tests__/*.test.{ts,tsx}` | **Command**: `pnpm test`

- **Purpose**: Unit tests for React components and hooks
- **Framework**: Vitest (fast, Vite-native) + React Testing Library
- **Features**: Component rendering, user interactions, accessibility testing
- **Execution**: ~10 seconds for 29 tests

```tsx
// Example: Component test with Clerk auth bypass
import { render, screen } from '@/test/test-utils';
import { Button } from '../button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### 2. Integration Tests (Vitest + MSW)

**Location**: `src/**/*.integration.test.{ts,tsx}` | **Command**: `pnpm test`

- **Purpose**: Feature workflows with mocked backend APIs
- **Framework**: Vitest + MSW (Mock Service Worker)
- **Features**: Store integration, API calls, state management
- **Configuration**: Auto-configured in `src/test/setup.ts`

### 3. E2E Tests (Playwright)

**Location**: `src/test/e2e/*.spec.ts` | **Command**: `pnpm test:e2e`

- **Purpose**: Full user journeys with real authentication
- **Framework**: Playwright with multi-browser support
- **Features**: Complete workflow testing, Clerk authentication
- **Configuration**: Automatic dev server startup

```ts
// Example: E2E test with authentication
test('dashboard navigation', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: /products/i }).click();
  await expect(page).toHaveURL(/.*\/dashboard\/products/);
});
```

## Test Configuration Files

### Core Config

- **`vitest.config.ts`**: Vitest configuration with React plugin
- **`playwright.config.ts`**: Playwright E2E configuration
- **`src/test/setup.ts`**: Global test setup (MSW, mocks, jest-dom)
- **`src/test/test-utils.tsx`**: Custom render with providers

### Mock Infrastructure

- **`src/test/mocks/handlers.ts`**: API endpoint mocks
- **`src/test/mocks/server.ts`**: MSW server for Node.js tests

## Test Commands Reference

```bash
# Three-Level Testing Pyramid
pnpm test:unit              # Component & Integration tests (Vitest)
pnpm test:e2e:headless      # End-to-end tests (Playwright)
pnpm test:all               # Complete test suite (both levels)

# Development & Debugging
pnpm test:unit:watch        # Watch mode for TDD development
pnpm test:unit:coverage     # Generate coverage reports
```

## TDD Development Workflow

### Red-Green-Refactor Cycle

1. **🔴 Red**: Write failing test first
2. **🟢 Green**: Write minimal code to pass
3. **🔵 Refactor**: Improve code while keeping tests green
4. **🔄 Repeat**: Next feature/requirement

### Test-First Implementation Pattern

```bash
# 1. Write component test (fails)
touch src/features/products/components/__tests__/ProductCard.test.tsx

# 2. Write integration test (fails)
touch src/features/products/__tests__/ProductStore.integration.test.tsx

# 3. Implement component (tests pass)
touch src/features/products/components/ProductCard.tsx

# 4. Implement store (integration tests pass)
touch src/features/products/stores/product-store.ts

# 5. Write E2E test (fails)
touch src/test/e2e/products.spec.ts

# 6. Connect API integration (E2E passes)
```

## Mock API Data Structure

### Product Mock Data

```typescript
// src/test/mocks/handlers.ts
const mockProducts = [
  {
    _id: '1',
    userId: 'test-user',
    title: 'Protein Powder',
    description: 'High-quality whey protein',
    category: 'sports nutrition',
    price: 49.99,
    commissionPercent: 15,
    referralLink: 'https://example.com/ref/protein-powder',
    clicks: 25,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];
```

### API Endpoint Coverage

- **GET** `/api/products` - List products
- **GET** `/api/products/:id` - Get product by ID
- **POST** `/api/products` - Create product
- **PUT** `/api/products/:id` - Update product
- **DELETE** `/api/products/:id` - Delete product
- **GET** `/api/analytics/dashboard` - Dashboard stats
- **GET** `/api/analytics/products/:id` - Product analytics

## Test File Organization

```
src/test/
├── setup.ts                # Global test configuration & mocks
├── test-utils.tsx          # Custom render with providers
├── mocks/                  # MSW API mock infrastructure
└── e2e/                    # Playwright end-to-end tests

src/{domain}/__tests__/     # Component & integration tests
├── *.test.tsx             # Component unit tests
└── *.integration.test.tsx # Feature integration tests
```

## Testing Best Practices

### Component Testing

- **Test behavior, not implementation**
- **Use semantic queries** (`getByRole`, `getByLabelText`)
- **Mock external dependencies** (API calls, date functions)
- **Test user interactions** with `userEvent`

### Integration Testing

- **Test complete workflows** (user action → API → store → UI update)
- **Use MSW handlers** for consistent API responses
- **Test error scenarios** and loading states
- **Verify store state changes**

### E2E Testing

- **Test critical user paths** only
- **Use Page Object Model** for complex interactions
- **Test cross-browser compatibility**
- **Avoid testing implementation details**

## Authentication Testing Setup

### ✅ Unit Test Authentication Implementation

**Current Status**: **All 29 unit tests passing** with proper Clerk authentication bypass.

**Implementation**: Comprehensive Clerk mocking infrastructure for component tests:

- **Global Clerk mocks** in `src/test/setup.ts` for useUser, useAuth, SignOutButton
- **Local test mocks** for component-specific Clerk hooks
- **Test utilities** with ClerkProvider integration
- **Server auth mocking** for async Server Components (Dashboard page/layout)

### Unit Test Mock Configuration

```typescript
// src/test/setup.ts - Global Clerk mocking
vi.mock('@clerk/nextjs', async () => ({
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
    getToken: vi.fn().mockResolvedValue('mock-token'),
    signOut: vi.fn()
  }),
  SignOutButton: ({ children }) =>
    React.createElement(
      'button',
      { 'data-testid': 'sign-out-button' },
      children || 'Sign Out'
    )
}));

// Server-side auth mocking for async components
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-user-id' })
}));
```

### Component Test Strategies

#### 1. **Simple Components** (Header, Button)

- Use mock components to avoid complex dependency chains
- Focus on core functionality and accessibility
- Avoid testing implementation details of theme/context providers

#### 2. **Layout Components** (AppSidebar, Dashboard Layout)

- Mock complex UI dependencies (SidebarProvider, theme contexts)
- Test structural integrity and navigation patterns
- Verify async Server Component rendering

#### 3. **Server Components** (Dashboard Page)

- Mock Clerk server auth with `@clerk/nextjs/server`
- Handle async component rendering with `await` pattern
- Test authentication flow and redirect logic

### E2E Testing Strategy

**Approach**: Unified E2E test suite covering critical user journeys with authentication.

**Authentication Configuration**:

- **Clerk integration**: Uses `.env.test.local` with development credentials
- **State persistence**: Saves auth state to `playwright/.clerk/user.json`
- **Global setup**: `src/test/e2e/global.setup.ts` handles Clerk configuration

### Test Results Summary

#### Component & Integration Tests ✅

- **Status**: **0 failed, 29 passed** (100% success rate)
- **Execution time**: ~10 seconds consistently
- **Coverage**: All UI components with Clerk authentication bypass
- **Command**: `pnpm test`

#### E2E Tests ✅

- **Status**: Full user journey coverage with authentication
- **Execution time**: Optimized for reasonable performance
- **Coverage**: Critical paths including dashboard functionality
- **Command**: `pnpm test:e2e`

## Development Integration

### Pre-commit Testing

The project husky hooks will run:

```bash
# Lint and format (pre-commit)
npx lint-staged

# Build verification (pre-push)
cd front && pnpm run build
```

### CI/CD Integration Ready

```yaml
# Example GitHub Actions
- name: Run Tests
  run: |
    pnpm test:unit:coverage
    pnpm test:e2e:headless
```

This testing infrastructure ensures **high code quality**, **fast feedback loops**, and **confidence in deployments** through comprehensive test coverage at all levels.
