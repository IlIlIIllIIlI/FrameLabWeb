import { jest } from "@jest/globals";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest"
import jwt from "jsonwebtoken";

import { prismaMock, resetMock } from "../../config/singleton.js";


jest.unstable_mockModule("../../db/prisma.ts", () => ({
    prisma: prismaMock,
}));


jest.unstable_mockModule("../../config/mutler.js", () => ({
    uploadImage: (req, res, next) => {
        req.file = { filename: "mock.jpg", path: "/path/mock.jpg" };
        next();
    },
}));


jest.unstable_mockModule("fs", () => ({
    default: {
        existsSync: jest.fn(),
        mkdirSync: jest.fn(),
        renameSync: jest.fn(),
        unlinkSync: jest.fn()
    }
}));


const { default: router } = await import("../../router.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

describe("Challenges Routes", () => {
    let adminToken;
    let userToken;

    beforeEach(() => {
        resetMock();
        process.env.PRIVATE_KEY = "test";
        userToken = jwt.sign({ user: { email: "user@test.com" } }, "test");
        adminToken = jwt.sign({ user: { email: "admin@test.com" } }, "test");
    });

    describe("POST /api/challenges", () => {
        test("should allow an admin to create a challenge", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "admin@test.com", is_admin: true });

            prismaMock.challenges.findFirstOrThrow.mockRejectedValueOnce(new Error("No active"));
            prismaMock.challenges.findFirstOrThrow.mockResolvedValueOnce({ id: 1 });
            prismaMock.challenges.create.mockResolvedValue({ id: 2 });

            const res = await request(app)
                .post("/api/challenges")
                .set("Cookie", [`session=${adminToken}`])
                .send({
                    title: "New Challenge",
                    description: "Desc",
                    start_date: "2026-01-01",
                    end_date: "2026-01-10"
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Challenge created successfully!");
            expect(prismaMock.challenges.create).toHaveBeenCalled();
        });
    });

    describe("GET /api/challenges/:id", () => {
        test("should return a specific challenge if test exists", async () => {
            const mockChallenge = { id: 5, theme_title: "Specific Challenge" };
            prismaMock.challenges.findUniqueOrThrow.mockResolvedValue(mockChallenge);

            const res = await request(app).get("/api/challenges/5");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.challenge).toEqual(mockChallenge);
        });

        test("should return 404 if the challenge does not exist", async () => {
            prismaMock.challenges.findUniqueOrThrow.mockRejectedValue(new Error("Not found"));

            const res = await request(app).get("/api/challenges/1");

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/challenges/current", () => {
        test("should return 401 if user is not authenticated", async () => {
            const res = await request(app).get("/api/challenges/current");
            expect(res.status).toBe(401);
        });

        test("should return the active challenge for authenticated users", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "user@test.com" });
            const mockCurrent = { id: 2, theme_title: "Active Challenge", is_archived: false };
            prismaMock.challenges.findFirstOrThrow.mockResolvedValue(mockCurrent);

            const res = await request(app)
                .get("/api/challenges/current")
                .set("Cookie", [`session=${userToken}`]);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.challenge).toEqual(mockCurrent);
        });
    });

    describe("PUT /api/challenges/current", () => {
        test("should allow an admin to archive a challenge", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "admin@test.com", is_admin: true });

            prismaMock.challenges.findUniqueOrThrow.mockResolvedValue({
                id: 1,
                is_archived: false
            });

            prismaMock.challenges.update.mockResolvedValue({ id: 1, is_archived: true });

            const res = await request(app)
                .put("/api/challenges/current")
                .set("Cookie", [`session=${adminToken}`])
                .send({ id: 1 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(prismaMock.challenges.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { is_archived: true }
            });
        });

        test("should return 403 if trying to archive an already archived challenge", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "admin@test.com", is_admin: true });

            prismaMock.challenges.findUniqueOrThrow.mockResolvedValue({
                id: 1,
                is_archived: true
            });

            const res = await request(app)
                .put("/api/challenges/current")
                .set("Cookie", [`session=${adminToken}`])
                .send({ id: 1 });

            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Challenge is already archived");
        });
    });


});

