import request from 'supertest';
import { createApp } from '../../app';
import * as express from 'express';

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('User Endpoints', () => {
    it('should create a user', async () => {
      const userData = {
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('should return 400 for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should find user by email', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ email: 'test@example.com' })
        .expect(200);

      expect(response.body).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('Task Endpoints', () => {
    beforeAll(async () => {
      // Create a user first
      await request(app)
        .post('/api/users')
        .send({ email: 'taskuser@example.com' });

      // For this test, we'll simulate having a token
      // In a real scenario, you'd get this from the auth service
    });

    it('should get all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 for creating task without auth', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
      };

      await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);
    });
  });
});
