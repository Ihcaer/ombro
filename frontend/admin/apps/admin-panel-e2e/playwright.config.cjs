const { defineConfig, devices } = require('@playwright/test');
const { nxE2EPreset } = require('@nx/playwright/preset');
const { workspaceRoot } = require('@nx/devkit');

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

const configFile = __filename;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
module.exports = defineConfig({
  ...nxE2EPreset(configFile, { testDir: './src' }),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx nx run skema-admin-frontend:serve',
    url: 'http://localhost:4200/admin/',
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects: [
    /* {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }, */
    /* {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, */
    // Uncomment for mobile browsers support
    /*
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    */
    // Uncomment for branded browsers
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
