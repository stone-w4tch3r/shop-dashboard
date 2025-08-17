import { resolveChromeExecutable } from './scripts/chrome';
import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';

// Load test-specific environment variables
loadEnv({ path: '.env.test.local' });

// Prepare device profile without the channel to avoid conflict with executablePath
const desktopChrome = devices['Desktop Chrome'];
const { channel: _omit, ...desktopChromeNoChannel } = desktopChrome as any;

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2, // Limit workers for speed
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 20000,
  use: {
    headless: !process.argv.includes('--headed'), // Default to headless for SSH compatibility
    viewport: { width: 1280, height: 720 },
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20000,
    navigationTimeout: 20000
  },
  projects: [
    {
      name: 'global setup',
      testMatch: /global\.setup\.ts/
    },
    // Authenticated tests (limited - only one)
    {
      name: 'authenticated',
      testMatch: /.*auth.*\.spec\.ts/,
      use: {
        ...desktopChromeNoChannel,
        launchOptions: {
          executablePath: resolveChromeExecutable()
        },
        storageState: 'playwright/.clerk/user.json'
      },
      dependencies: ['global setup']
    },
    // Fast auth-less tests (majority)
    {
      name: 'auth-less',
      testMatch: /^(?!.*auth).*\.spec\.ts$/, // Exclude auth tests
      use: {
        ...desktopChromeNoChannel,
        launchOptions: {
          executablePath: resolveChromeExecutable()
        }
      },
      dependencies: ['global setup']
    }
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 20000
  }
});
