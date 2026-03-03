import { jest } from "@jest/globals";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest"
import jwt from "jsonwebtoken";

import { prismaMock, resetMock } from "../config/singleton.js";


jest.unstable_mockModule("../db/prisma.ts", () => ({
  prisma: prismaMock,
}));


const { default: router } = await import("../router.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

describe('User Routes', () => {
  beforeEach(() => {
    resetMock();
    process.env.PRIVATE_KEY = 'test';
  });
  describe('GET /api/users', () => {
    test('should return 401 if user is not authenticated', async () => {
      const res = await request(app).get('/api/users');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('You need to be logged in');
    });

    test('should return all users if authenticated with a valid cookie', async () => {
      const fakeToken = jwt.sign({ user: { email: 'test@test.com' } }, process.env.PRIVATE_KEY);

      prismaMock.users.findMany.mockResolvedValue([
        { id: 1, email: 'user1@test.com', first_name: 'John' },
        { id: 2, email: 'user2@test.com', first_name: 'Jane' }
      ]);

      const res = await request(app)
        .get('/api/users')
        .set('Cookie', [`session=${fakeToken}`]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.users).toHaveLength(2);
      expect(prismaMock.users.findMany).toHaveBeenCalledTimes(1);
    });
  });
})
