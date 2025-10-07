import request from 'supertest';
import express from 'express';
import profileRoutes from '../routes/profile';
import { pool } from '../db';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/', profileRoutes);

describe('Profile Routes', () => {
  const testUser = {
    email: 'profiletest@example.com',
    password: 'password123'
  };
  let userId: string;
  let validToken: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    
    // Create a test user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [testUser.email, hashedPassword]
    );
    userId = result.rows[0].id;
    
    // Generate a valid token
    validToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    // Clean up test data
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    await pool.end();
  });

  describe('GET /profile', () => {
    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('authorization-token', validToken)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body).toHaveProperty('created_at');
    });

    it('should return error when no token is provided', async () => {
      const response = await request(app)
        .get('/profile')
        .expect(401);

      expect(response.body).toEqual({ error: 'No token provided' });
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('authorization-token', 'invalid_token')
        .expect(401);

      expect(response.body).toEqual({ error: 'Invalid token' });
    });

    it('should return error with expired token', async () => {
      const expiredToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: '-1h', // Expired token
      });

      const response = await request(app)
        .get('/profile')
        .set('authorization-token', expiredToken)
        .expect(401);

      expect(response.body).toEqual({ error: 'Invalid token' });
    });

    it('should return error with malformed token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('authorization-token', 'not.a.valid.jwt.token')
        .expect(401);

      expect(response.body).toEqual({ error: 'Invalid token' });
    });
  });
});
