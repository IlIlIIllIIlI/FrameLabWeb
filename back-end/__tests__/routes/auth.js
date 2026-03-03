import { jest } from "@jest/globals";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import jwt from "jsonwebtoken";

import { prismaMock, resetMock } from "../../config/singleton.js";


jest.unstable_mockModule("../../db/prisma.ts", () => ({
  prisma: prismaMock,
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn().mockResolvedValue(true),
  },
}));




const { default: router } = await import("../../router.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);


describe('Auth Routes', () => {
  beforeEach(() => {
    resetMock();
    process.env.PRIVATE_KEY = 'test';
  });
  describe('POST /api/auth/login', () => {
    test("should login and return a cookie", async () => {
      prismaMock.users.findUniqueOrThrow.mockResolvedValue({ id: 1, password: "password" });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@test.com", password: "Password123!"
        });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    })
  })


  describe("POST /api/auth/register", () => {
    it("should register and return a cookie", async () => {
      prismaMock.users.create.mockResolvedValue({ id: 1 });
      prismaMock.users.findUniqueOrThrow.mockResolvedValue({ id: 1, email: "test@test.com" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@test.com",
          password: "Password123!",
          firstName: "esd",
          lastName: "ezs"
        });

      expect(res.status).toBe(200);
      expect(res.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user info from cookie", async () => {
      const token = jwt.sign({ user: { email: "test@test.com" } }, "test");

      const res = await request(app)
        .get("/api/auth/me")
        .set("Cookie", [`session=${token}`]);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe("test@test.com");
    });
  });


  describe("GET /api/auth/logout", () => {
    it("should clear the cookie if auth", async () => {
      const token = jwt.sign({ user: { email: "test@test.com" } }, "test");

      const res = await request(app)
        .get('/api/auth/logout')
        .set('Cookie', [`session=${token}`]);

      expect(res.status).toBe(200);
      expect(res.headers["set-cookie"][0]).toMatch(/session=;/);
    });
  });


});