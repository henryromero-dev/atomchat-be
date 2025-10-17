import request from 'supertest';
import { createApp } from '../../app';
import * as express from 'express';

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    app = createApp();
  }, 30000);

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    }, 10000);
  });

  describe('User Endpoints', () => {
    it('should return 400 for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation error');
    }, 10000);

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ email: 'nonexistent@example.com' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    }, 10000);
  });

  describe('Task Endpoints', () => {
    it('should return 401 for creating task without auth', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
      };

      await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(401);
    }, 10000);

    it('should return 401 for getting tasks without auth', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401);
    }, 10000);
  });
});