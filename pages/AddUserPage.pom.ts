import { Page, Locator } from '@playwright/test';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    birthDate: string;
    city: string;
    gender: 'Male' | 'Female';
    avatarPath: string;
}

export class AddUserPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly bloodGroupSelect: Locator;
    readonly passwordInput: Locator;
    readonly birthDateInput: Locator;
    readonly citySelect: Locator;
    readonly confirmCheckbox: Locator;
    readonly fileInput: Locator;
    readonly createUserButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByRole('textbox', { name: 'John', exact: true });
        this.lastNameInput = page.getByRole('textbox', { name: 'Doe' });
        this.emailInput = page.getByRole('textbox', { name: 'john@example.com' });
        this.phoneInput = page.getByRole('textbox', { name: 'Must start with 01 and be 11' });
        this.bloodGroupSelect = page.getByRole('combobox').first();
        this.passwordInput = page.getByRole('textbox', { name: 'Create a password' });
        this.birthDateInput = page.getByRole('textbox', { name: 'MM/dd/yyyy' });
        this.citySelect = page.getByRole('combobox').nth(1);
        this.confirmCheckbox = page.getByRole('checkbox', { name: 'I confirm this user registration' });
        this.fileInput = page.locator('input[type="file"]');
        this.createUserButton = page.getByRole('button', { name: 'Create User' });
    }

    async goto() {
        await this.page.goto('/dashboard/add-user');
    }

    async addUser(user: UserData) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.emailInput.fill(user.email);
        await this.phoneInput.fill(user.phone);

        await this.bloodGroupSelect.press('ArrowDown');

        await this.passwordInput.fill(user.password);

        await this.birthDateInput.click();
        await this.birthDateInput.fill(user.birthDate);

        await this.citySelect.selectOption(user.city);
        await this.page.getByRole('radio', { name: user.gender, exact: true }).check();
        await this.confirmCheckbox.check();
        await this.fileInput.setInputFiles(user.avatarPath);
        await this.createUserButton.click();
    }
}
