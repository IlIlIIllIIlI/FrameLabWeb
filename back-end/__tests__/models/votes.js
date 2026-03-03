import { jest } from "@jest/globals";
import { prismaMock, resetMock } from "../../config/singleton.js";

jest.unstable_mockModule("../../db/prisma.ts", () => ({
    prisma: prismaMock,
}));

const voteModel = await import("../../model/votes.js");

describe("Votes Model", () => {
    beforeEach(() => {
        resetMock();
    });

    describe("getAll()", () => {
        test("should return all votes", async () => {
            const mockVotes = [{ id: 1, technical_rating: 5 }];
            prismaMock.votes.findMany.mockResolvedValue(mockVotes);

            const result = await voteModel.getAll();
            expect(result).toEqual(mockVotes);
        });
    });

    describe("createVote()", () => {
        test("should return success and the vote object on creation", async () => {
            const mockVote = { id: 1, technical_rating: 5 };
            prismaMock.votes.create.mockResolvedValue(mockVote);

            const result = await voteModel.createVote(1, 1, 5, 5, 5);

            expect(result).toEqual({ success: true, vote: mockVote });
            expect(prismaMock.votes.create).toHaveBeenCalledWith({
                data: {
                    entry_id: 1, user_id: 1, technical_rating: 5, creativity_rating: 5, theme_respect_rating: 5
                }
            });
        });

        test("should catch error and return a safe message if creation fails", async () => {
            prismaMock.votes.create.mockRejectedValue(new Error("Error"));

            const result = await voteModel.createVote(1, 1, 5, 5, 5);
            expect(result).toEqual({ success: false, message: "Something happened, please try later" });
        });
    });

    describe("getVoteByEntryAndUser()", () => {
        test("should return success true and the vote if test exists", async () => {
            const mockVote = { id: 1 };
            prismaMock.votes.findFirst.mockResolvedValue(mockVote);

            const result = await voteModel.getVoteByEntryAndUser(1, 2);

            expect(result).toEqual({ success: true, vote: mockVote });
            expect(prismaMock.votes.findFirst).toHaveBeenCalledWith({
                where: { entry_id: 1, user_id: 2 }
            });
        });

        test("should return success false if the vote does not exist", async () => {
            prismaMock.votes.findFirst.mockResolvedValue(null);

            const result = await voteModel.getVoteByEntryAndUser(1, 2);
            expect(result).toEqual({ success: false, message: "No vote" });
        });

        test("should catch error and return failure message if DB throws", async () => {
            prismaMock.votes.findFirst.mockRejectedValue(new Error("Error"));

            const result = await voteModel.getVoteByEntryAndUser(1, 2);
            expect(result).toEqual({ success: false, message: "Something happened, please try later" });
        });
    });
});