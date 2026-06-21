import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { randomNumber } from '../utils/randomNumber';

test.describe.serial('User Integration Flow', () => {
    let authToken: string;
    let createdUserEmail: string;
    let lastUserId: string;

    test.beforeAll(async ({ request }) => {
        const res = await request.post('/api/login', {
            headers: { 'Content-Type': 'application/json' },
            data: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            },
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body.message).toBe('Logged in');
        authToken = body.token;
    });

    test('create a new user', async ({ request }) => {
        const id = randomNumber(1000, 9999);
        createdUserEmail = `integration${id}@test.com`;

        const res = await request.post('/api/signup', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: createdUserEmail,
                password: 'Test1234!',
                phoneNumber: `017${randomNumber(10000000, 99999999)}`,
                gender: 'Male',
                agreement: true,
            },
        });
        expect(res.status()).toBe(201);
        const body = await res.json();
        expect(body.message).toBe('User registered successfully');
    });

    test('list all users', async ({ request }) => {
        const res = await request.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            params: { pageSize: 1000 },
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(Array.isArray(body.data)).toBeTruthy();
        expect(body.data.length).toBeGreaterThan(0);
        expect(typeof body.total).toBe('number');

        lastUserId = body.data[body.data.length - 1].id;
    });

    test('search for created user by email', async ({ request }) => {
        const res = await request.get('/api/users', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            params: { q: createdUserEmail },
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body.data.length).toBeGreaterThan(0);
        expect(body.data[0].email).toBe(createdUserEmail);
    });

    test('update last user phone number', async ({ request }) => {
        const updatedPhone = `018${randomNumber(10000000, 99999999)}`;

        const res = await request.put(`/api/users/${lastUserId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            data: { phoneNumber: updatedPhone },
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body.user.phoneNumber).toBe(updatedPhone);
    });

    test('delete the last user', async ({ request }) => {
        const res = await request.delete(`/api/users/${lastUserId}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body.message).toBe('Deleted');
    });
});
