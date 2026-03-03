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

describe("Comments Routes", () => {
    let userToken, adminToken;

    beforeEach(() => {
        resetMock();
        process.env.PRIVATE_KEY = "test";
        userToken = jwt.sign({ user: { email: "user@test.com" } }, "test");
        adminToken = jwt.sign({ user: { email: "admin@test.com" } }, "test");
    });

    describe("GET /api/comments", () => {
        test("should fetch all comments for an authenticated user", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "user@test.com" });
            prismaMock.comments.findMany.mockResolvedValue([{ id: 1, content: "Test" }]);

            const res = await request(app).get("/api/comments").set("Cookie", [`session=${userToken}`]);
            expect(res.status).toBe(200);
            expect(res.body[0].content).toBe("Test");
        });
    });

    describe("POST /api/comments", () => {
        test("should add a comment for an authenticated user", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "user@test.com" });
            prismaMock.comments.create.mockResolvedValue({ id: 1 });

            const res = await request(app)
                .post("/api/comments")
                .set("Cookie", [`session=${userToken}`])
                .send({ content: "lkko!", userId: 1, entryId: 1 });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Comment created successfully!");
        });
    });

    describe("GET /api/comments/:id", () => {
        test("should get a specific comment", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "user@test.com" });
            prismaMock.comments.findUnique.mockResolvedValue({ id: 5, content: "kopl" });

            const res = await request(app).get("/api/comments/5").set("Cookie", [`session=${userToken}`]);
            expect(res.status).toBe(200);
            expect(res.body.content).toBe("kopl");
        });
    });

    describe("DELETE /api/comments/:id", () => {
        test("should block non-admins from deleting comments", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "user@test.com", is_admin: false });

            const res = await request(app)
                .delete("/api/comments/1")
                .set("Cookie", [`session=${userToken}`]);

            expect(res.status).toBe(403);
        });

        test("should allow admins to delete comments", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ email: "admin@test.com", is_admin: true });
            prismaMock.comments.delete.mockResolvedValue({ id: 1 });

            const res = await request(app)
                .delete("/api/comments/1")
                .set("Cookie", [`session=${adminToken}`]);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});