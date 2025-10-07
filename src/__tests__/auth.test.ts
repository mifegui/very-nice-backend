import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth';
import { pool } from '../db';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  const testUser = {
    email: 'testuser@example.com',
    password: 'password123'
  };

  beforeAll(async () => {
    // Clean up any existing test data
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await pool.end();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toEqual({ message: 'User registered' });
    });

    it('should return error when user already exists', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toEqual({ error: 'User already exists' });
    });

    it('should return error when email is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ password: 'password123' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error when password is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test2@example.com' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should return error with invalid email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toEqual({ error: 'Invalid credentials' });
    });

    it('should return error with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toEqual({ error: 'Invalid credentials' });
    });

    it('should return error when email is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error when password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
