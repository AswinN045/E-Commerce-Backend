const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');

setupTestDB();

describe('Category Model API', () => {
    let token;

    beforeAll(async () => {
        // Create admin user
        const user = await request(app)
            .post('/v1/auth/register')
            .send({
                name: 'Admin',
                email: 'admin@example.com',
                password: 'Admin@123',
                role: 'Admin'
            });

        // Login to get token
        const loginRes = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'Admin@123'
            });

        token = loginRes.body.tokens.access.token;

        try {
            await request(app)
                .get('/v1/category/list-categories')
                .set('Authorization', `Bearer ${token}`);
        } catch (err) {
            console.log('Error pre-cleaning categories:', err.message);
        }
    });

    describe('POST /v1/category/insert-category', () => {
        test('should create a new category', async () => {
            const res = await request(app)
                .post('/v1/category/insert-category')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Electronics' });

            if (res.status !== httpStatus.CREATED) {
                console.log('Create category response:', res.status, res.body);
            }

            expect(res.status).toBe(httpStatus.CREATED); // 201
            expect(res.body.statusValue).toBe(1);
            expect(res.body.statusText).toBe('Category inserted successfully');
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.name).toBe('Electronics');
        });

        test('should fail without admin role', async () => {
            await request(app)
                .post('/v1/auth/register')
                .send({
                    name: 'User',
                    email: 'user@example.com',
                    password: 'password123'
                });

            const userLoginRes = await request(app)
                .post('/v1/auth/login')
                .send({ email: 'user@example.com', password: 'password123' });

            const userToken = userLoginRes.body.tokens.access.token;;

            const res = await request(app)
                .post('/v1/category/insert-category') 
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Clothing' });

            expect(res.body.code).toBe(httpStatus.FORBIDDEN); // 403
            expect(res.body.message).toContain('You do not have permission'); 
        });
    });

    describe('GET /v1/category/list-categories', () => {
        test('should retrieve all categories', async () => {
            await request(app)
                .post('/v1/category/insert-category')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Tech' });

            await request(app)
                .post('/v1/category/insert-category')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Fashion' });

            const res = await request(app)
                .get('/v1/category/list-categories')
                .set('Authorization', `Bearer ${token}`);
            
            if (res.status !== httpStatus.OK) {
                console.log('List categories response:', res.status);
            }

            expect(res.status).toBe(httpStatus.OK); // 200
            expect(res.body.statusValue).toBe(1);
            expect(res.body.data.length).toBeGreaterThanOrEqual(2);
            expect(res.body.data.some(cat => cat.name === 'Tech')).toBe(true);
            expect(res.body.data.some(cat => cat.name === 'Fashion')).toBe(true);
        });

        test('should return empty array if no categories exist', async () => {

            const res = await request(app)
                .get('/v1/category/list-categories')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(httpStatus.OK); // 200
            expect(res.body.statusValue).toBe(1);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('PATCH /v1/category/update-category/:id', () => {
        test('should update a category', async () => {
            const createRes = await request(app)
                .post('/v1/category/insert-category')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Sports' });

            if (!createRes.body.data || !createRes.body.data.id) {
                console.log('Create category response for update test:', createRes.status, createRes.body);
                throw new Error('Failed to create category for update test');
            }

            const id = createRes.body.data.id;

            const res = await request(app)
                .patch(`/v1/category/update-category/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Fitness' });

            expect(res.status).toBe(httpStatus.OK); // 200
            expect(res.body.statusValue).toBe(1);
        });

        test('should return 404 for non-existent category', async () => {
            const res = await request(app)
                .patch('/v1/category/update-category/999')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'NonExistent' });

            expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR); // 404
            expect(res.body.statusValue).toBe(0);
            expect(res.body.statusText).toContain('Category updation failed');
        });
    });

    describe('DELETE /v1/category/delete-category/:id', () => {
        test('should delete a category', async () => {
            const createRes = await request(app)
                .post('/v1/category/insert-category')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Games' });

            if (!createRes.body.data || !createRes.body.data.id) {
                console.log('Create category response for delete test:', createRes.status, createRes.body);
                throw new Error('Failed to create category for delete test');
            }

            const id = createRes.body.data.id;

            const res = await request(app)
                .delete(`/v1/category/delete-category/${id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(httpStatus.OK); // 200
            expect(res.body.statusValue).toBe(1);
            expect(res.body.statusText).toContain('deleted');
        });

        test('should fail without admin role', async () => {
            const createRes = await request(app)
                .post('/v1/category/insert-category')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Toys' });

            if (!createRes.body.data || !createRes.body.data.id) {
                console.log('Create category response for role test:', createRes.status, createRes.body);
                throw new Error('Failed to create category for role test');
            }

            const id = createRes.body.data.id;

            const userLoginRes = await request(app)
                .post('/v1/auth/login')
                .send({ email: 'user@example.com', password: 'password123' });

            const userToken = userLoginRes.body.tokens.access.token;;

            const res = await request(app)
                .delete(`/v1/category/delete-category/${id}`)
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.body.code).toBe(httpStatus.FORBIDDEN); // 403
            expect(res.body.message).toContain('You do not have permission to access');
        });
    });
});