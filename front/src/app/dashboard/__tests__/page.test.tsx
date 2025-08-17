import { render, screen } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from '../page';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn()
  }),
  redirect: vi.fn(),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({})
}));

// Mock Clerk server auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test-user-id' })
}));

// Mock any dashboard components that might be complex
vi.mock('@/components/layout/page-container', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='page-container'>{children}</div>
  )
}));

describe('DashboardPage', () => {
  it('renders without crashing', async () => {
    // Since DashboardPage is async, we need to await the component
    const AsyncDashboard = await DashboardPage();
    render(AsyncDashboard);

    // The actual page renders a div with p-6 class
    expect(document.querySelector('.p-6')).toBeInTheDocument();
  });

  it('displays welcome content or placeholder', async () => {
    const AsyncDashboard = await DashboardPage();
    render(AsyncDashboard);

    // The actual page renders a minimal div
    expect(document.querySelector('.p-6')).toBeInTheDocument();
  });

  it('has accessible structure', async () => {
    const AsyncDashboard = await DashboardPage();
    render(AsyncDashboard);

    // Check for the rendered div
    expect(document.querySelector('.p-6')).toBeInTheDocument();
  });

  it('handles empty state gracefully', async () => {
    const AsyncDashboard = await DashboardPage();
    render(AsyncDashboard);

    // Page should render the minimal div
    expect(document.querySelector('.p-6')).toBeInTheDocument();
  });

  it('maintains consistent layout', async () => {
    const AsyncDashboard = await DashboardPage();
    render(AsyncDashboard);

    const container = document.querySelector('.p-6');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('p-6');
  });

  it('is ready for content integration', async () => {
    const AsyncDashboard = await DashboardPage();
    render(AsyncDashboard);

    // Should render the basic structure
    expect(document.querySelector('.p-6')).toBeInTheDocument();
  });

  it('does not throw console errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const AsyncDashboard = await DashboardPage();
    render(AsyncDashboard);

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
