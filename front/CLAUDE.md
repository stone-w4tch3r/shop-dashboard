# Frontend Development Ruleset - Product Management Dashboard

## Project Overview

This is the frontend for a product management system built for fitness bloggers. Built on a Next.js dashboard template, it provides interfaces for managing affiliate products, tracking performance, and viewing analytics.

**Frontend Features:**
- Product management interface (CRUD operations)
- Referral link display and management
- Analytics dashboard with charts and metrics
- Category filtering and search
- Responsive dashboard layout

## Architecture Principles

### Frontend Architecture Pattern

**Primary Pattern**: Feature-Based Modular Architecture
- **Feature-based organization**: Business domains in separate modules (`/features`)
- **Component-based UI**: Reusable components in `/components`  
- **Shared utilities**: Common logic in `/lib`, `/hooks`
- **Flexible imports**: No strict layered dependency rules

**NOT**: Traditional layered architecture or Feature-Sliced Design

### Frontend Module Structure
```
src/
├── app/              # Next.js App Router (routing & pages)
├── features/         # Business domain modules
├── components/       # Shared UI components
├── lib/              # Shared utilities & configuration
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── constants/        # Static data & configuration
```

## State Management Strategy

### Primary Pattern: Zustand-First Architecture
**Why Zustand**: Backend-developer friendly, predictable state updates, built-in business logic support

### 1. Feature-Level Stores - Zustand
**Use for**: Domain-specific state, business logic, CRUD operations
```typescript
// Pattern: Complete domain management in stores
interface ProductStore {
  // State
  products: Product[]
  loading: boolean
  filters: ProductFilters
  
  // CRUD Operations  
  fetchProducts: () => Promise<void>
  createProduct: (data: ProductFormData) => Promise<void>
  
  // Business Logic
  validateProduct: (data: ProductFormData) => ValidationResult
  calculateEarnings: (product: Product) => number
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  filters: { category: 'all' },
  
  fetchProducts: async () => {
    set({ loading: true })
    const products = await productsApi.getAll()
    set({ products, loading: false })
  },
  
  validateProduct: (data) => {
    // Business validation logic here
    if (data.commissionPercent > 50) return { isValid: false, errors: ['Max 50%'] }
    return { isValid: true, errors: [] }
  }
}))
```

### 2. Global Stores - Zustand
**Use for**: Cross-cutting concerns (auth, UI, notifications)
```typescript
// Pattern: Shared application state
export const useUIStore = create<UIStore>()(
  persist((set) => ({
    theme: 'light',
    sidebarCollapsed: false,
    toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  }), { name: 'ui-preferences' })
)
```

### 3. URL State - Nuqs (Supplementary)
**Use for**: Pagination, sorting, filtering, shareable state
```typescript
// Pattern: Search params for bookmarkable state
const [page] = useQueryState('page', parseAsInteger.withDefault(1));
```

### 4. Form State - React Hook Form + Zod
**Use for**: Complex forms with validation
```typescript
// Pattern: Schema-first validation
const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  commissionPercent: z.number().max(50, 'Max 50% commission')
});
```

## Data Flow Patterns

### Frontend Data Flow Pattern
```
Component → Zustand Store → API Client → Backend API
                ↓
      Store Updates → Component Re-renders
```

### Store-Centric Flow
```
User Action → Component → Store Method → API Call → Store State Update → UI Update
```

### API Client Setup (`src/lib/api-client.ts`)
```typescript
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});
```

### Store Error Handling Pattern
```typescript
// Error handling in stores with notifications
export const useProductStore = create<ProductStore>((set, get) => ({
  createProduct: async (data) => {
    try {
      set({ loading: true, error: null })
      const newProduct = await productsApi.create(data)
      set({ products: [...get().products, newProduct], loading: false })
      
      // Success notification
      useNotificationStore.getState().addNotification({
        type: 'success', 
        message: 'Product created successfully'
      })
    } catch (error) {
      set({ error: error.message, loading: false })
      useNotificationStore.getState().addNotification({
        type: 'error',
        message: error.message
      })
    }
  }
}))
```

## Feature Development Rules

### Directory Structure for Features
```
src/features/{domain}/
├── stores/           # Feature-specific Zustand stores
├── components/       # Domain-specific components  
├── api/              # API endpoints (pure HTTP calls)
├── types/            # Domain TypeScript types
└── schemas/          # Zod validation schemas
```

### Store Organization Structure
```
src/stores/
├── global/
│   ├── auth-store.ts        # User authentication
│   ├── ui-store.ts          # Theme, sidebar, modals  
│   └── notification-store.ts # Toast messages, alerts
├── features/
│   ├── product-store.ts     # Product management
│   ├── analytics-store.ts   # Dashboard statistics
│   └── settings-store.ts    # User preferences
└── types/
    └── store-types.ts       # Store interfaces
```

### Component Organization Rules
1. **Shared components** → `src/components/ui/`
2. **Layout components** → `src/components/layout/`  
3. **Feature components** → `src/features/{domain}/components/`
4. **Page components** → `src/app/` (App Router)
5. **Store integration** → Components consume stores via hooks

### Store Development Rules
1. **Feature stores** handle domain-specific state and business logic
2. **Global stores** handle cross-cutting concerns only
3. **Business logic** lives in store methods, not components
4. **API calls** initiated from stores, not components directly
5. **Store communication** via `getState()` calls between stores

### File Naming Conventions
- Components: `PascalCase.tsx`
- Stores: `kebab-case-store.ts`
- API files: `kebab-case.ts`
- Types: `kebab-case.ts`
- Schemas: `kebab-case-schema.ts`

## Frontend Data Types & Models

### Result Pattern Types
```typescript
// Core Result pattern for error handling
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Operation results
type ValidationResult = Result<void, string[]>;
type ApiResult<T> = Result<T, ApiError>;
type BusinessResult<T> = Result<T, BusinessError>;

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface BusinessError {
  message: string;
  field?: string;
  code: string;
}
```

### Frontend Product Types
```typescript
interface Product {
  readonly _id: string;
  readonly userId: string;
  title: string;
  description: string;
  category: 'sports nutrition' | 'equipment' | 'clothing' | 'gadgets';
  price: number;
  commissionPercent: number;
  readonly referralLink: string;
  readonly clicks: number;
  readonly createdAt: string;
}

// Form DTOs for API calls - explicit types
interface CreateProductDto {
  title: string;
  description: string;
  category: Product['category'];
  price: number;
  commissionPercent: number;
}

interface UpdateProductDto {
  title?: string;
  description?: string;
  category?: Product['category'];
  price?: number;
  commissionPercent?: number;
}

// Store state types
interface ProductFilters {
  category: Product['category'] | 'all';
  search: string;
  sortBy: 'createdAt' | 'title' | 'price' | 'clicks';
  sortOrder: 'asc' | 'desc';
}
```

### Frontend Analytics Types
```typescript
interface ProductAnalytics {
  readonly productId: string;
  readonly clicks: number;
  readonly potentialEarnings: number;
  readonly clickHistory: readonly ClickEvent[];
}

interface ClickEvent {
  readonly _id: string;
  readonly productId: string;
  readonly userId: string;
  readonly clickedAt: string;
  readonly ip: string;
}

interface DashboardStats {
  readonly totalProducts: number;
  readonly totalClicks: number;
  readonly totalEarnings: number;
  readonly topPerformingProducts: readonly Product[];
  readonly periodStart: string;
  readonly periodEnd: string;
}

interface AnalyticsFilters {
  timeRange: '7d' | '30d' | '90d' | 'custom';
  startDate?: string;
  endDate?: string;
  productIds?: readonly string[];
}
```

## Frontend Route Structure

### App Router Organization
```
src/app/dashboard/
├── page.tsx              # Main dashboard
├── products/
│   ├── page.tsx          # Product list
│   ├── add/
│   │   └── page.tsx      # Add product
│   └── edit/
│       └── [id]/
│           └── page.tsx  # Edit product
├── stats/
│   └── page.tsx          # Analytics
└── settings/
    └── page.tsx          # User settings
```

### Navigation Configuration
```typescript
// src/constants/data.ts
export const navItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
  { title: 'Products', url: '/dashboard/products', icon: 'product' },
  { title: 'Analytics', url: '/dashboard/stats', icon: 'analytics' },
  { title: 'Settings', url: '/dashboard/settings', icon: 'settings' }
];
```

## Frontend Best Practices

### Code Quality Rules
1. **Explicit TypeScript**: All functions, variables, and returns must have explicit type definitions
2. **Result Pattern**: Use Result<T, E> for operations that can fail
3. **Error Handling**: Always handle loading/error states
4. **Validation**: Use Zod schemas for all forms
5. **Accessibility**: Follow WCAG guidelines
6. **Performance**: Lazy load components when appropriate

### Component Patterns
```typescript
// Pattern: Explicit types + Result pattern integration
interface ProductCardProps {
  readonly product: Product;
}

export function ProductCard({ product }: ProductCardProps): JSX.Element {
  const { calculateEarnings, deleteProduct } = useProductStore();
  
  // Explicit types for all variables
  const earningsResult: BusinessResult<number> = calculateEarnings(product);
  
  const handleDelete = async (): Promise<void> => {
    const result: BusinessResult<void> = await deleteProduct(product._id);
    
    if (!result.success) {
      console.error('Failed to delete product:', result.error.message);
      // Error handled by store notifications
    }
  };
  
  const earnings: number = earningsResult.success ? earningsResult.data : 0;
  
  return (
    <Card>
      <h3>{product.title}</h3>
      <p>Earnings: ${earnings.toFixed(2)}</p>
      <Button 
        onClick={handleDelete}
        disabled={!earningsResult.success}
      >
        Delete
      </Button>
    </Card>
  );
}
```

### Store Patterns
```typescript
// Pattern: Explicit types + Result pattern in stores
interface ProductStore {
  // State - explicit types
  readonly products: readonly Product[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly filters: ProductFilters;
  
  // CRUD Operations - all return Results
  fetchProducts: () => Promise<ApiResult<readonly Product[]>>;
  createProduct: (data: CreateProductDto) => Promise<ApiResult<Product>>;
  updateProduct: (id: string, data: UpdateProductDto) => Promise<ApiResult<Product>>;
  deleteProduct: (id: string) => Promise<BusinessResult<void>>;
  
  // Business Logic - explicit return types
  validateProduct: (data: CreateProductDto) => ValidationResult;
  calculateEarnings: (product: Product) => BusinessResult<number>;
  canDeleteProduct: (product: Product) => BusinessResult<boolean>;
  
  // State Management
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set, get): ProductStore => ({
  // State initialization
  products: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  
  // Explicit implementations with Result pattern
  fetchProducts: async (): Promise<ApiResult<readonly Product[]>> => {
    try {
      set({ loading: true, error: null });
      const response = await productsApi.getAll();
      set({ products: response, loading: false });
      return { success: true, data: response };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: error.status,
        code: error.code
      };
      set({ loading: false, error: apiError.message });
      return { success: false, error: apiError };
    }
  },
  
  validateProduct: (data: CreateProductDto): ValidationResult => {
    const errors: string[] = [];
    
    if (!data.title.trim()) errors.push('Title is required');
    if (data.commissionPercent < 0 || data.commissionPercent > 50) {
      errors.push('Commission must be between 0-50%');
    }
    if (data.price <= 0) errors.push('Price must be positive');
    
    return errors.length === 0 
      ? { success: true, data: undefined }
      : { success: false, error: errors };
  },
  
  calculateEarnings: (product: Product): BusinessResult<number> => {
    try {
      const baseEarnings: number = (product.price * product.commissionPercent / 100) * product.clicks;
      const categoryMultipliers: Record<Product['category'], number> = {
        'sports nutrition': 1.05,
        'equipment': 1.03,
        'clothing': 1.02,
        'gadgets': 1.01
      };
      
      const multiplier: number = categoryMultipliers[product.category];
      const totalEarnings: number = baseEarnings * multiplier;
      
      return { success: true, data: totalEarnings };
    } catch (error) {
      return { 
        success: false, 
        error: { 
          message: 'Failed to calculate earnings', 
          code: 'CALCULATION_ERROR' 
        }
      };
    }
  }
}));
```

### Form Integration Patterns
```typescript
// Pattern: Explicit types + Result pattern in forms
interface ProductFormProps {
  readonly productId?: string; // For edit mode
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export function ProductForm({ productId, onSuccess, onCancel }: ProductFormProps): JSX.Element {
  const { createProduct, updateProduct, validateProduct } = useProductStore();
  
  // Explicit form type
  const form = useForm<CreateProductDto>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'sports nutrition',
      price: 0,
      commissionPercent: 0
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async (data: CreateProductDto): Promise<void> => {
    setIsSubmitting(true);
    
    try {
      // Validate first
      const validationResult: ValidationResult = validateProduct(data);
      if (!validationResult.success) {
        validationResult.error.forEach((error: string) => {
          form.setError('root', { message: error });
        });
        return;
      }
      
      // Perform operation based on mode
      const result: ApiResult<Product> = productId 
        ? await updateProduct(productId, data)
        : await createProduct(data);
      
      if (result.success) {
        form.reset();
        onSuccess?.();
      } else {
        form.setError('root', { 
          message: result.error.message 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Input {...form.register('title')} placeholder="Product title" />
      <Textarea {...form.register('description')} placeholder="Description" />
      <Select {...form.register('category')}>
        <option value="sports nutrition">Sports Nutrition</option>
        <option value="equipment">Equipment</option>
        <option value="clothing">Clothing</option>
        <option value="gadgets">Gadgets</option>
      </Select>
      
      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {productId ? 'Update' : 'Create'} Product
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      
      {form.formState.errors.root && (
        <Alert variant="destructive">
          {form.formState.errors.root.message}
        </Alert>
      )}
    </form>
  );
}
```

## Frontend Development Commands

### Development Commands
```bash
# Development server
pnpm run dev

# Production build
pnpm run build

# Code quality
pnpm run lint
pnpm run lint:fix

# Type checking (via Next.js build)
pnpm run build
```

### Testing Commands
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

## TDD Testing Infrastructure ⚡

### Three-Level Testing Pyramid
1. **Component Tests** (Vitest + React Testing Library + MSW)
2. **Integration Tests** (Vitest + MSW with full store workflows)  
3. **E2E Tests** (Playwright with real backend)

### Test File Organization
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
├── components/__tests__/   # Component unit tests
└── stores/__tests__/       # Store unit tests
```

### TDD Workflow (Red-Green-Refactor)
1. **🔴 Write failing test** first (component, integration, or e2e)
2. **🟢 Write minimal code** to pass the test
3. **🔵 Refactor** while keeping tests green
4. **🔄 Repeat** for next feature

**Key Testing Features**:
- **MSW API Mocking**: Realistic backend simulation for integration tests
- **Custom Test Utils**: Pre-configured render with all providers
- **Global Mocks**: matchMedia, IntersectionObserver, ResizeObserver
- **Multi-browser E2E**: Chromium, Firefox, Safari support
- **Auto Dev Server**: E2E tests automatically start/stop dev server

## Implementation Strategy

### Migration Approach: Hybrid Architecture
We use an **"Islands Architecture"** approach to minimize risk and maximize productivity:

- **Keep existing template code** as-is (stable foundation)
- **Write new features** using our modern architecture (CLAUDE.md patterns)
- **Gradual migration** of existing features only if time permits

### ✅ Template Foundation (Keep As-Is)
- [x] Next.js 15 setup with App Router
- [x] Shadcn/ui component library
- [x] Tailwind CSS configuration  
- [x] TypeScript configuration
- [x] Basic dashboard layout
- [x] Data table components
- [x] Form components with validation
- [x] Authentication setup (Clerk)
- [x] Theme system
- [x] Command palette (kbar)
- [x] Existing product listing (Server Components + mock data)
- [x] Overview dashboard components

### 🆕 New Architecture (Modern Patterns)
**Phase 1: Foundation Setup (1 hour)**
- [ ] Create store directory structure (`/stores/global/`, `/stores/features/`)
- [ ] Add API client setup (`/lib/api-client.ts`)
- [ ] Add Result pattern types (`/types/result.ts`)
- [ ] Add notification store for error handling

**Phase 2: New Features (2-3 hours each)**
- [ ] Analytics dashboard (replace overview with our architecture)
- [ ] Settings page (new feature with our patterns)
- [ ] Enhanced product management (new components using stores)

**Phase 3: Integration (1-2 hours)**
- [ ] Connect existing product listing to new API client
- [ ] Replace mock data with real API calls
- [ ] Add global error handling

### 🔄 Gradual Migration (Optional)
**Only if time permits - not required for MVP:**
- [ ] Convert existing product components to use stores
- [ ] Add Result pattern to existing features
- [ ] Enhance error handling throughout
- [ ] Add explicit types to existing code

### 🗑️ Template Cleanup
- [ ] Remove mock data system (`src/constants/mock-api.ts`)
- [ ] Remove unused overview components (replaced by analytics)
- [ ] Remove sample/demo data

### Architecture Coexistence
```
src/
├── features/
│   ├── products/           # HYBRID: Existing + new store layer
│   ├── analytics/          # NEW: Full modern architecture  
│   └── settings/           # NEW: Full modern architecture
├── stores/                 # NEW: Modern state management
├── components/             # EXISTING: Keep shared components
└── lib/
    └── api-client.ts       # NEW: Replace mock data
```

### Benefits of This Approach
- ✅ **Low Risk**: Template stays functional during development
- ✅ **Fast Delivery**: No massive refactoring required  
- ✅ **Best Practices**: New features use modern patterns
- ✅ **Future-Proof**: Clear migration path for existing code
- ✅ **Time Efficient**: ~4 hours setup vs 15+ hours full migration

## Frontend Environment Configuration

### Required Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

### Frontend Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at http://localhost:3000
```

## Integration Notes

### API Integration
- Backend API expected at `http://localhost:3001`
- All API calls go through `src/lib/api-client.ts`
- React Query handles caching and state management
- Error handling via interceptors and toast notifications

## Development Guidelines

### Code Organization Rules
1. **Existing Code**: Keep template foundation unchanged for stability
2. **New Features**: Must follow CLAUDE.md architecture (Zustand + Result pattern + explicit types)
3. **Hybrid Integration**: New stores can be consumed by existing components gradually
4. **Migration**: Only migrate existing features if time permits, not required for delivery

### Implementation Priority
1. **High Priority**: New features (analytics, settings) with modern architecture
2. **Medium Priority**: API integration replacing mock data
3. **Low Priority**: Migrating existing product features to new patterns

This document serves as the single source of truth for frontend development decisions and architectural patterns. **All new frontend code must follow the established modern patterns**, while existing template code can coexist during the transition period.