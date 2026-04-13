import { jest } from "@jest/globals";

jest.unstable_mockModule("../../model/votes.js", () => ({
    getAll: jest.fn(),
    getVoteByEntryAndUser: jest.fn(),
    createVote: jest.fn(),
}));

const voteModelMock = await import("../../model/votes.js");
const { getAllVotes, castVote } = await import("../../controller/votes.js");

describe("Votes Controller", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("getAllVotes()", () => {
        test("should return a JSON list of all votes", async () => {
            voteModelMock.getAll.mockResolvedValue([{ id: 1 }]);
            await getAllVotes(req, res);
            expect(res.json).toHaveBeenCalledWith({ success: true, votes: [{ id: 1 }] });
        });
    });

    describe("castVote()", () => {
        beforeEach(() => {
            req.body = {
                userId: 1, entryId: 1, technicalRating: 5, creativityRating: 5, themeRespectRating: 5
            };
        });

        test("should return 404 if userId is missing", async () => {
            req.body.userId = null;
            await castVote(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "no user" });
        });

        test("should return 404 if entryId is missing", async () => {
            req.body.entryId = null;
            await castVote(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "no entry" });
        });

        test("should return 404 if user has already voted for this entry", async () => {
            voteModelMock.getVoteByEntryAndUser.mockResolvedValue({ success: true });
            await castVote(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "You already have a Vote for this entry" });
        });

        test("should return 404 if themeRespectRating is out of bounds", async () => {
            voteModelMock.getVoteByEntryAndUser.mockResolvedValue({ success: false });

            req.body.themeRespectRating = 6;
            await castVote(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Theme Respect Rating must be between 0 and 5" });

            req.body.themeRespectRating = -1;
            await castVote(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        test("should return 404 if creativityRating is out of bounds", async () => {
            voteModelMock.getVoteByEntryAndUser.mockResolvedValue({ success: false });

            req.body.creativityRating = 6;
            await castVote(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Creativity Rating must be between 0 and 5" });
        });

        test("should return 404 if technicalRating is out of bounds", async () => {
            voteModelMock.getVoteByEntryAndUser.mockResolvedValue({ success: false });

            req.body.technicalRating = 6;
            await castVote(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Technical Rating must be between 0 and 5" });
        });

        test("should successfully create a vote and return a success message", async () => {
            voteModelMock.getVoteByEntryAndUser.mockResolvedValue({ success: false });
            voteModelMock.createVote.mockResolvedValue({ success: true });

            await castVote(req, res);
            expect(res.json).toHaveBeenCalledWith({ message: "Votes created successfully!" });
        });

        test("should drop down to return the error object if creation fails", async () => {
            voteModelMock.getVoteByEntryAndUser.mockResolvedValue({ success: false });

            const fail = { success: false, message: "Error" };
            voteModelMock.createVote.mockResolvedValue(fail);

            await castVote(req, res);
            expect(res.json).toHaveBeenCalledWith(fail);
        });

        test("should return 404 if user has already voted for this entry", async () => {
            req.body.userId = 1;
            req.body.entryId = { userId: 1 };
            await castVote(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "You can't Vote for yourself" });
        });
    });
});