import { test, expect } from '@playwright/test';
import { randomNumber } from '../utils/randomNumber';
import fs from 'fs';
import path from 'path';

test('add new user', async ({ page }) => {
    await page.goto('/dashboard/add-user');

    await page.getByRole('textbox', { name: 'John', exact: true }).fill('Test');
    await page.getByRole('textbox', { name: 'Doe' }).fill('User');
    const id = randomNumber(1000, 9999);
    const email = `testuser${id}@example.com`;
    await page.getByRole('textbox', { name: 'john@example.com' }).fill(email);
    const phone = `017${randomNumber(10000000, 99999999)}`;
    await page.getByRole('textbox', { name: 'Must start with 01 and be 11' }).fill(phone);

    const bloodGroupSelect = page.getByRole('combobox').first();
    //await expect(bloodGroupSelect.locator('option').nth(1)).toBeAttached();
    await bloodGroupSelect.press('ArrowDown');

    await page.getByRole('textbox', { name: 'Create a password' }).fill('Password123!');

    const birthDateInput = page.getByRole('textbox', { name: 'MM/dd/yyyy' });
    await birthDateInput.click();
    await birthDateInput.fill('01/15/1995');

    await page.getByRole('combobox').nth(1).selectOption('Dhaka');
    await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByRole('checkbox', { name: 'I confirm this user registration' }).check();
    await page.locator('input[type="file"]').setInputFiles('resources/bg.png');
    await page.getByRole('button', { name: 'Create User' }).click();

    await expect(page).toHaveURL(/dashboard\/users/);
});

test('scrap data', async ({ page }) => {
    await page.goto('/dashboard/users');
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    const tableData: string[][] = [];

    for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        await row.waitFor();
        const cells = row.locator('td');
        await expect(cells.first()).toBeVisible();
        const cellTexts = await cells.allInnerTexts();
        tableData.push(cellTexts);
    }

    console.log(tableData);

    const outputDir = path.join(process.cwd(), 'data');

    fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(
        path.join(outputDir, 'users.txt'),
        tableData.map(row => row.join(' | ')).join('\n'),
        'utf-8'
    );
});
