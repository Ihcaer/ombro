const { defineConfig, devices } = require('@playwright/test');
const { nxE2EPreset } = require('@nx/playwright/preset');
const { workspaceRoot } = require('@nx/devkit');

const skipWebserver = process.env['SKIP_WEBSERVER'] === 'true' || true;
const baseURL =
  (process.env['BASE_URL'] || `http://localhost:${skipWebserver ? 80 : 4200}`) + '/admin';

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
  webServer: skipWebserver
    ? undefined
    : {
        command: 'npx nx run skema-admin-frontend:serve',
        url: baseURL,
        reuseExistingServer: true,
        cwd: workspaceRoot,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Uncomment for mobile browsers support
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    }, */
  ],
});
