import { test, expect } from '@playwright/test';
import { randomNumber } from '../utils/randomNumber';
import { faker } from '@faker-js/faker';
import { AddUserPage, UserData } from '../pages/AddUserPage.pom';
import { UsersPage } from '../pages/UsersPage.pom';

test('add new user', async ({ page }) => {
    const addUserPage = new AddUserPage(page);
    await addUserPage.goto();

    const id = randomNumber(1000, 9999);
    const user: UserData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `testuser${id}@example.com`,
        phone: `017${randomNumber(10000000, 99999999)}`,
        password: 'Password123!',
        birthDate: '01/15/1995',
        city: 'Dhaka',
        gender: 'Male',
        avatarPath: 'resources/bg.png',
    };

    await addUserPage.addUser(user);

    await expect(page).toHaveURL(/dashboard\/users/);
});

test('scrap data', async ({ page }) => {
    const usersPage = new UsersPage(page);
    await usersPage.goto();

    const tableData = await usersPage.scrapeTableData();
    console.log(tableData);

    await usersPage.saveTableData(tableData);
});
