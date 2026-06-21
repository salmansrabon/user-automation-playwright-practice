import { Page, Locator, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class UsersPage {
    readonly page: Page;
    readonly rows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.rows = page.locator('tbody tr');
    }

    async goto() {
        await this.page.goto('/dashboard/users');
    }

    async scrapeTableData(): Promise<string[][]> {
        const rowCount = await this.rows.count();
        const tableData: string[][] = [];

        for (let i = 0; i < rowCount; i++) {
            const row = this.rows.nth(i);
            await row.waitFor();
            const cells = row.locator('td');
            await expect(cells.first()).toBeVisible();
            const cellTexts = await cells.allInnerTexts();
            tableData.push(cellTexts);
        }

        return tableData;
    }

    async saveTableData(tableData: string[][], fileName = 'users.txt') {
        const outputDir = path.join(process.cwd(), 'data');
        fs.mkdirSync(outputDir, { recursive: true });

        fs.writeFileSync(
            path.join(outputDir, fileName),
            tableData.map(row => row.join(' | ')).join('\n'),
            'utf-8'
        );
    }
}
