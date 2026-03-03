import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { prismaMock, resetMock } from "../../config/singleton.js";

jest.unstable_mockModule("../../db/prisma.ts", () => ({
    prisma: prismaMock
}));

jest.unstable_mockModule("../../config/mutler.js", () => ({
    uploadImage: (req, res, next) => {
        req.file = { filename: "mock.jpg", path: "/fake/path/mock.jpg" };
        next();
    },
}));

jest.unstable_mockModule("fs", () => ({
    default: { existsSync: jest.fn(), mkdirSync: jest.fn(), renameSync: jest.fn(), unlinkSync: jest.fn() }
}));

const { default: router } = await import("../../router.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

describe("Entries Routes", () => {
    let userToken;

    beforeEach(() => {
        resetMock();
        process.env.PRIVATE_KEY = "test";
        userToken = jwt.sign({ user: { email: "user@test.com" } }, "test");
    });

    describe("GET /api/entries/:id", () => {
        test("should return a specific entry publicly", async () => {
            const mockEntry = { id: 1 };
            prismaMock.entries.findUniqueOrThrow.mockResolvedValue(mockEntry);

            const res = await request(app).get("/api/entries/1");
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe("POST /api/entries", () => {
        test("should allow an authenticated user to post an entry with an image", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "user@test.com" });

            prismaMock.entries.findFirst.mockResolvedValue(null);
            prismaMock.entries.create.mockResolvedValue({ id: 1 });

            const res = await request(app)
                .post("/api/entries")
                .set("Cookie", [`session=${userToken}`])
                .send({ userId: 1, challengeId: 2 });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Entry created successfully!");
        });
    });
});