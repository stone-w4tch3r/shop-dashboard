# Testing Infrastructure - Implementation Guide

## TDD Testing Architecture

This project implements a **three-level testing pyramid** following TDD principles:

### 1. Component Tests (Vitest + React Testing Library)
**Location**: `src/**/__tests__/*.test.{ts,tsx}`
**Command**: `pnpm test`

- **Purpose**: Unit tests for React components and hooks
- **Framework**: Vitest (fast, Vite-native)
- **DOM Testing**: React Testing Library
- **API Mocking**: MSW (Mock Service Worker)

```tsx
// Example: src/components/ui/__tests__/button.test.tsx
import { render, screen } from '@/test/test-utils'
import { Button } from '../button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

### 2. Integration Tests (Vitest + MSW)
**Location**: `src/**/*.integration.test.{ts,tsx}`
**Command**: `pnpm test`

- **Purpose**: Test feature workflows with mocked backend
- **API Mocking**: MSW handlers simulate backend responses
- **Store Testing**: Test Zustand stores with real API calls (mocked)

**Mock API Configuration**:
- **Handlers**: `src/test/mocks/handlers.ts` - Define API endpoints
- **Server**: `src/test/mocks/server.ts` - MSW server setup
- **Auto-setup**: `src/test/setup.ts` - Automatic start/stop

### 3. E2E Tests (Playwright)
**Location**: `src/test/e2e/*.spec.ts`
**Command**: `pnpm test:e2e`

- **Purpose**: Full user journey tests with real backend
- **Browser**: Multi-browser support (Chromium, Firefox, Safari)
- **Auto-server**: Automatically starts dev server

```ts
// Example: src/test/e2e/dashboard.spec.ts  
test('should navigate to products page', async ({ page }) => {
  await page.goto('/dashboard')
  await page.getByRole('link', { name: /products/i }).click()
  await expect(page).toHaveURL(/.*\/dashboard\/product/)
})
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
# Component & Integration Tests (Vitest)
pnpm test                    # Run all tests once
pnpm test:watch             # Watch mode for development
pnpm test:ui                # Run with Vitest UI
pnpm test:coverage          # Generate coverage reports

# E2E Tests (Playwright) - Requires backend running
pnpm test:e2e               # Run e2e tests headless
pnpm test:e2e:ui            # Run with Playwright UI
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
]
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
├── setup.ts                # Global test configuration
├── test-utils.tsx          # Custom render with providers  
├── mocks/
│   ├── handlers.ts         # MSW API mock handlers
│   └── server.ts           # MSW server setup
└── e2e/
    └── *.spec.ts           # Playwright end-to-end tests

src/features/{domain}/
├── __tests__/              # Integration tests
│   └── *.integration.test.tsx
├── components/
│   └── __tests__/          # Component unit tests  
│       └── *.test.tsx
└── stores/
    └── __tests__/          # Store unit tests
        └── *.test.ts
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
    pnpm test:coverage
    pnpm test:e2e
```

This testing infrastructure ensures **high code quality**, **fast feedback loops**, and **confidence in deployments** through comprehensive test coverage at all levels.