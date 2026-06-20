import { test, expect } from '@playwright/test';

const PAGE = '/dashboard/practice-components';

test('doubleClick', async ({ page }) => {
    await page.goto(PAGE);
    let alertMessage = '';
    page.on('dialog', async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
    });
    await page.getByRole('button', { name: 'Double Click Me' }).dblclick();
    expect(alertMessage).toBe('double clicked!');
});

test('contextClick', async ({ page }) => {
    await page.goto(PAGE);
    let alertMessage = '';
    page.on('dialog', async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
    });
    await page.getByRole('button', { name: 'Right Click Me' }).click({ button: 'right' });
    expect(alertMessage).toBe('context clicked!');
});

test('openNewTab', async ({ page, context }) => {
    await page.goto(PAGE);
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('button', { name: 'Open New Tab' }).click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('example.com');
    await newPage.close();
});

test('openNewWindow', async ({ page, context }) => {
    await page.goto(PAGE);
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('button', { name: 'Open New Window' }).click(),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain('example.com');
    await newPage.close();
});

test('openModal', async ({ page }) => {
    await page.goto(PAGE);
    await page.getByRole('button', { name: 'Open Modal' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('This is a simple modal for practice.')).toBeVisible();
    await modal.getByRole('button', { name: 'Close' }).first().click();
    await expect(modal).not.toBeVisible();
});

test('setNextJSDateTime', async ({ page }) => {
    await page.goto(PAGE);
    const dateTimeInput = page.locator('input[type="datetime-local"]');
    await dateTimeInput.fill('2024-01-15T10:30');
    await expect(dateTimeInput).toHaveValue('2024-01-15T10:30');
});

test('setReadOnlyDateTime', async ({ page }) => {
    await page.goto(PAGE);
    const readonlyEl = await page.locator('input[readonly]').elementHandle();
    await readonlyEl!.evaluate((el: HTMLInputElement) => {
        el.removeAttribute('readonly');
        el.value = '2024-01-15';
        el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const value = await readonlyEl!.getProperty('value');
    expect(await value.jsonValue()).toBe('2024-01-15');
});

test('setReactJSDateTime', async ({ page }) => {
    await page.goto(PAGE);
    const reactDatePicker = page.getByPlaceholder('Select date');
    await reactDatePicker.click();
    await reactDatePicker.fill('01/15/2024');
    await page.keyboard.press('Tab');
    await expect(reactDatePicker).toHaveValue('01/15/2024');
});

test('automateIframe', async ({ page }) => {
    await page.goto(PAGE);
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
