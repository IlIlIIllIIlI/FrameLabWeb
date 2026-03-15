import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { prismaMock, resetMock } from "../../config/singleton.js";

jest.unstable_mockModule("../../db/prisma.ts", () => ({ prisma: prismaMock }));

const { default: router } = await import("../../router.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

describe("Votes Routes", () => {
    let userToken;

    beforeEach(() => {
        resetMock();
        process.env.PRIVATE_KEY = "test";
        userToken = jwt.sign({ user: { email: "user@test.com" } }, "test");
    });

    describe("GET /api/votes", () => {
        test("should return 401 if not authenticated", async () => {
            const res = await request(app).get("/api/votes");
            expect(res.status).toBe(401);
        });

        test("should fetch all votes if authenticated", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "user@test.com" });
            prismaMock.votes.findMany.mockResolvedValue([{ id: 1, technical_rating: 5 }]);

            const res = await request(app)
                .get("/api/votes")
                .set("Cookie", [`session=${userToken}`]);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.votes[0].id).toBe(1);
        });
    });

    describe("POST /api/votes", () => {
        test("should cast a vote successfully", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "user@test.com" });

            prismaMock.votes.findFirst.mockResolvedValue(null);

            prismaMock.votes.create.mockResolvedValue({ id: 1 });

            const res = await request(app)
                .post("/api/votes")
                .set("Cookie", [`session=${userToken}`])
                .send({
                    userId: 1, entryId: 1, technicalRating: 4, creativityRating: 4, themeRespectRating: 4
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Votes created successfully!");
            expect(prismaMock.votes.create).toHaveBeenCalledTimes(1);
        });
    });
});