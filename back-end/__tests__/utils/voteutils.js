import { jest } from "@jest/globals";

jest.unstable_mockModule("../../model/votes.js", () => ({
    getVoteByEntryAndUser: jest.fn(),
    getEntryGlobalStats: jest.fn()
}));

const voteModelMock = await import("../../model/votes.js");
const { enrichEntriesWithVoteData } = await import("../../utils/voteutils.js");

describe("enrichEntriesWithVoteData()", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("1. should handle a single entry without user ID and not archived", async () => {
        const entry = { id: 1 };

        const result = await enrichEntriesWithVoteData(entry, null);

        expect(result).toEqual({ id: 1, stats: null, has_voted: false });
        expect(voteModelMock.getVoteByEntryAndUser).not.toHaveBeenCalled();
        expect(voteModelMock.getEntryGlobalStats).not.toHaveBeenCalled();
    });

    test("2. should handle an array of entries where user hasn't voted", async () => {
        const entries = [{ id: 1 }, { id: 2 }];
        voteModelMock.getVoteByEntryAndUser.mockResolvedValue({ success: false });

        const result = await enrichEntriesWithVoteData(entries, 99);

        expect(result).toEqual([
            { id: 1, stats: null, has_voted: false },
            { id: 2, stats: null, has_voted: false }
        ]);
        expect(voteModelMock.getVoteByEntryAndUser).toHaveBeenCalledTimes(2);
        expect(voteModelMock.getEntryGlobalStats).not.toHaveBeenCalled();
    });

    test("should fetch stats and attach vote data if user has voted", async () => {
        const entry = { id: 1 };
        const mockVote = { technical_rating: 5 };
        const mockStats = { totalVotes: 5, averages: { global: 4 } };

        voteModelMock.getVoteByEntryAndUser.mockResolvedValue({ success: true, vote: mockVote });
        voteModelMock.getEntryGlobalStats.mockResolvedValue(mockStats);

        const result = await enrichEntriesWithVoteData(entry, 99);

        expect(result).toEqual({
            id: 1,
            stats: mockStats,
            has_voted: true,
            user_vote: mockVote
        });
        expect(voteModelMock.getEntryGlobalStats).toHaveBeenCalledWith(1);
    });

    test("should fetch stats if challenge is archived, even if user hasn't voted", async () => {
        const entry = { id: 1, challenges: { is_archived: true } };
        const mockStats = { totalVotes: 10, averages: { global: 4.5 } };

        voteModelMock.getEntryGlobalStats.mockResolvedValue(mockStats);

        const result = await enrichEntriesWithVoteData(entry, null);

        expect(result).toEqual({
            id: 1,
            challenges: { is_archived: true },
            stats: mockStats,
            has_voted: false,
            user_vote: null
        });
        expect(voteModelMock.getEntryGlobalStats).toHaveBeenCalledWith(1);
    });
});