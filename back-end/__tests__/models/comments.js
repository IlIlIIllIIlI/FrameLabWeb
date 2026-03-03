import { jest } from "@jest/globals";
import { prismaMock, resetMock } from "../../config/singleton.js";

jest.unstable_mockModule("../../db/prisma.ts", () => ({
    prisma: prismaMock,
}));

const commentModel = await import("../../model/comments.js");

describe("Comments Model", () => {
    beforeEach(() => {
        resetMock();
    });

    describe("getAll()", () => {
        test("should return all comments", async () => {
            const mockData = [{ id: 1, content: "Hello" }];
            prismaMock.comments.findMany.mockResolvedValue(mockData);

            const result = await commentModel.getAll();
            expect(result).toEqual(mockData);
        });
    });

    describe("getCommentById()", () => {
        test("should return a specific comment", async () => {
            const mockData = { id: 5, content: "Hi" };
            prismaMock.comments.findUnique.mockResolvedValue(mockData);

            const result = await commentModel.getCommentById(5);
            expect(result).toEqual(mockData);
            expect(prismaMock.comments.findUnique).toHaveBeenCalledWith({ where: { id: 5 } });
        });
    });

    describe("deleteCommentById()", () => {
        test("should return true if deletion succeeds", async () => {
            prismaMock.comments.delete.mockResolvedValue({ id: 1 });

            const result = await commentModel.deleteCommentById(1);
            expect(result).toBe(true);
        });

        test("should catch error and return false if deletion fails", async () => {
            prismaMock.comments.delete.mockRejectedValue(new Error("Not found"));

            const result = await commentModel.deleteCommentById(99);
            expect(result).toBe(false);
        });
    });

    describe("createComment()", () => {
        test("should return success and comment data on creation", async () => {
            const mockData = { id: 1, content: "Nfzfw" };
            prismaMock.comments.create.mockResolvedValue(mockData);

            const result = await commentModel.createComment(1, 2, "Nfzfw");
            expect(result).toEqual({ success: true, comment: mockData });
        });

        test("should catch error and return success: false on failure", async () => {
            prismaMock.comments.create.mockRejectedValue(new Error("Error"));

            const result = await commentModel.createComment(1, 2, "Nplfapkfajw");
            expect(result).toEqual({ success: false, message: "Something happened, please try later" });
        });
    });
});