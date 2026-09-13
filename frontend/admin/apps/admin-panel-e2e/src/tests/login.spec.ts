import { test, expect } from '@playwright/test';
import { firstAdminCredentials } from '../config/environments.config';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => await page.goto('/admin/auth/login'));

  test('has title', async ({ page }) => {
    expect(await page.locator('h1').innerText()).toContain('Sign in');
  });

  test.describe('Login mechanism', () => {
    test.describe.configure({ retries: 3 });

    test.afterEach(async ({ page }) => await page.request.post('/api/v1/auth/logout'));

    test('should move admin to panel after successful login', async ({ page }) => {
      const loginCredentials = { ...firstAdminCredentials };

      const identifierField = page.getByRole('textbox', { name: 'Handle or email' });
      const passwordField = page.locator('input[type="password"]');
      const submitLoginButton = page.getByRole('button', { name: 'Sign in' });

      await identifierField.click();
      await identifierField.fill(loginCredentials.email);
      await passwordField.click();
      await passwordField.fill(loginCredentials.password);
      await submitLoginButton.click();

      const response = await page.waitForResponse((response) => response.url().includes('/login'));

      expect(response.status()).toBe(201);
      await expect(page).toHaveURL(/\/dashboard$/);
    });
  });
});
