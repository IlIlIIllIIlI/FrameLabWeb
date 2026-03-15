import { jest } from "@jest/globals";

jest.unstable_mockModule("../../model/comments.js", () => ({
    getAll: jest.fn(),
    getCommentById: jest.fn(),
    deleteCommentById: jest.fn(),
    createComment: jest.fn(),
}));

const commentModelMock = await import("../../model/comments.js");
const { getAllComments, getCommentById, deleteCommentById, addComment } = await import("../../controller/comments.js");

describe("Comments Controller", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("getAllComments()", () => {
        test("should return json list of comments", async () => {
            commentModelMock.getAll.mockResolvedValue([{ id: 1 }]);
            await getAllComments(req, res);
            expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
        });
    });

    describe("getCommentById()", () => {
        test("should return a single comment", async () => {
            req.params.id = 1;
            commentModelMock.getCommentById.mockResolvedValue({ id: 1 });
            await getCommentById(req, res);
            expect(res.json).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe("deleteCommentById()", () => {
        test("should return success true if deleted", async () => {
            req.params.id = "1";
            commentModelMock.deleteCommentById.mockResolvedValue(true);
            await deleteCommentById(req, res);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: "Message deleted successfully" });
        });

        test("should return error if not found", async () => {
            req.params.id = "99";
            commentModelMock.deleteCommentById.mockResolvedValue(false);
            await deleteCommentById(req, res);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Comment not found" });
        });
    });

    describe("addComment()", () => {
        test("should return 404 if content is missing", async () => {
            req.body = { userId: 1, entryId: 1 };
            await addComment(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "No content" });
        });

        test("should return 404 if userId is missing", async () => {
            req.body = { content: "hello", entryId: 1 };
            await addComment(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "No User" });
        });

        test("should return 404 if entryId is missing", async () => {
            req.body = { content: "hello", userId: 1 };
            await addComment(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "No entryId" });
        });

        test("should return success message if creation succeeds", async () => {
            req.body = { content: "hello", userId: 1, entryId: 2 };
            commentModelMock.createComment.mockResolvedValue({ success: true });
            await addComment(req, res);
            expect(res.json).toHaveBeenCalledWith({ message: "Comment created successfully!" });
        });

        test("should return error object if creation fails", async () => {
            req.body = { content: "hello", userId: 1, entryId: 2 };
            const fail = { success: false, message: "Error" };
            commentModelMock.createComment.mockResolvedValue(fail);
            await addComment(req, res);
            expect(res.json).toHaveBeenCalledWith(fail);
        });
    });
});