import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'you@example.com' }).fill(`${process.env.ADMIN_EMAIL}`);
  await page.getByRole('textbox', { name: 'Enter password' }).fill(`${process.env.ADMIN_PASSWORD}`);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/dashboard\/.*/);
  await page.context().storageState({ path: 'auth.json' });
});
