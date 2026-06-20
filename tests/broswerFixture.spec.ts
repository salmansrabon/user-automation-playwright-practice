import { test, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

let context: BrowserContext;
let page: Page;

test.describe('Practice Components - Browser Fixture', () => {
    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext({ storageState: 'auth.json' });
        page = await context.newPage();
        await page.goto('/dashboard/practice-components');
    });

    test.afterAll(async () => {
        await context.close();
    });

    test('doubleClick', async () => {
        let alertMessage = '';
        page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });
        await page.getByRole('button', { name: 'Double Click Me' }).dblclick();
        expect(alertMessage).toBe('double clicked!');
    });

    test('contextClick', async () => {
        let alertMessage = '';
        page.once('dialog', async dialog => {
            alertMessage = dialog.message();
            await dialog.accept();
        });
        await page.getByRole('button', { name: 'Right Click Me' }).click({ button: 'right' });
        expect(alertMessage).toBe('context clicked!');
    });

    test('openNewTab', async () => {
        const newPagePromise = context.waitForEvent('page');
        await page.getByRole('button', { name: 'Open New Tab' }).click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain('example.com');
        await newPage.close();
    });

    test('openNewWindow', async () => {
        const newPagePromise = context.waitForEvent('page');
        await page.getByRole('button', { name: 'Open New Window' }).click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();
        expect(newPage.url()).toContain('example.com');
        await newPage.close();
    });

    test('openModal', async () => {
        await page.getByRole('button', { name: 'Open Modal' }).click();
        const modal = page.getByRole('dialog');
        await expect(modal).toBeVisible();
        await expect(modal.getByText('This is a simple modal for practice.')).toBeVisible();
        await modal.getByRole('button', { name: 'Close' }).first().click();
        await expect(modal).not.toBeVisible();
    });

    test('setNextJSDateTime', async () => {
        const dateTimeInput = page.locator('input[type="datetime-local"]');
        await dateTimeInput.fill('2024-01-15T10:30');
        await expect(dateTimeInput).toHaveValue('2024-01-15T10:30');
    });

    test('setReadOnlyDateTime', async () => {
        const readonlyEl = await page.locator('input[readonly]').elementHandle();
        await readonlyEl!.evaluate((el: HTMLInputElement) => {
            el.removeAttribute('readonly');
            el.value = '2024-01-15';
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });
        const value = await readonlyEl!.getProperty('value');
        expect(await value.jsonValue()).toBe('2024-01-15');
    });

    test('setReactJSDateTime', async () => {
        const reactDatePicker = page.getByPlaceholder('Select date');
        await reactDatePicker.click();
        await reactDatePicker.fill('01/15/2024');
        await page.keyboard.press('Tab');
        await expect(reactDatePicker).toHaveValue('01/15/2024');
    });

    test('automateIframe', async () => {
        const frame = page.frameLocator('iframe');
        await expect(frame.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
        await frame.getByRole('textbox', { name: 'you@example.com' }).fill('admin@test.com');
        await frame.getByRole('textbox', { name: 'Enter password' }).fill('1234');
        const iframeFrame = page.frames()[1];
        await Promise.all([
            iframeFrame.waitForURL(/dashboard\/.*/),
            frame.getByRole('button', { name: 'Login' }).click(),
        ]);
    });
});
