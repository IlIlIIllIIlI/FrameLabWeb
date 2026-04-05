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
    describe("getUserGlobalStats()", () => {
        test("should return calculated stats with existing averages", async () => {
            prismaMock.votes.aggregate.mockResolvedValue({
                _avg: { creativity_rating: 4, technical_rating: 3, theme_respect_rating: 5 },
                _count: { id: 10 }
            });

            const result = await voteModel.getUserGlobalStats(1);

            expect(prismaMock.votes.aggregate).toHaveBeenCalledWith(
                expect.objectContaining({ where: { entries: { user_id: 1 } } })
            );
            expect(result).toEqual({
                totalVotes: 10,
                averages: { creativity: 4, technical: 3, theme: 5, global: 4 }
            });
        });

        test("should handle null averages by defaulting to 0", async () => {
            prismaMock.votes.aggregate.mockResolvedValue({
                _avg: { creativity_rating: null, technical_rating: null, theme_respect_rating: null },
                _count: { id: 0 }
            });

            const result = await voteModel.getUserGlobalStats(1);

            expect(result.averages).toEqual({ creativity: 0, technical: 0, theme: 0, global: 0 });
        });
    });

    describe("getEntryGlobalStats()", () => {
        test("should return calculated stats with existing averages", async () => {
            prismaMock.votes.aggregate.mockResolvedValue({
                _avg: { creativity_rating: 5, technical_rating: 5, theme_respect_rating: 5 },
                _count: { id: 3 }
            });

            const result = await voteModel.getEntryGlobalStats(2);

            expect(prismaMock.votes.aggregate).toHaveBeenCalledWith(
                expect.objectContaining({ where: { entries: { id: 2 } } })
            );
            expect(result).toEqual({
                totalVotes: 3,
                averages: { creativity: 5, technical: 5, theme: 5, global: 5 }
            });
        });

        test("should handle null averages by defaulting to 0", async () => {
            prismaMock.votes.aggregate.mockResolvedValue({
                _avg: { creativity_rating: null, technical_rating: null, theme_respect_rating: null },
                _count: { id: 0 }
            });

            const result = await voteModel.getEntryGlobalStats(2);

            expect(result.averages).toEqual({ creativity: 0, technical: 0, theme: 0, global: 0 });
        });
    });

    describe("getUserEntryStats()", () => {
        test("should map and format groupBy results with existing averages", async () => {
            const mockGroupBy = [{
                entry_id: 10,
                _avg: { creativity_rating: 3, technical_rating: 3, theme_respect_rating: 3 },
                _count: { _all: 2 }
            }];
            prismaMock.votes.groupBy.mockResolvedValue(mockGroupBy);

            const result = await voteModel.getUserEntryStats(1);

            expect(prismaMock.votes.groupBy).toHaveBeenCalledWith(
                expect.objectContaining({ by: ['entry_id'], where: { entries: { user_id: 1 } } })
            );
            expect(result).toEqual([{
                entry_id: 10,
                totalVotes: 2,
                averages: { creativity: 3, technical: 3, theme: 3, global: 3 }
            }]);
        });

        test("should handle null averages in groupBy results by defaulting to 0", async () => {
            const mockGroupBy = [{
                entry_id: 20,
                _avg: { creativity_rating: null, technical_rating: null, theme_respect_rating: null },
                _count: { _all: 0 }
            }];
            prismaMock.votes.groupBy.mockResolvedValue(mockGroupBy);

            const result = await voteModel.getUserEntryStats(1);

            expect(result[0].averages).toEqual({ creativity: 0, technical: 0, theme: 0, global: 0 });
        });
    });
});