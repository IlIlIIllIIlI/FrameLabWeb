import { jest } from "@jest/globals";


jest.unstable_mockModule("../../model/users.js", () => ({
    getAll: jest.fn(),
    getUserProfileData: jest.fn(),
    getUserById: jest.fn()
}));

jest.unstable_mockModule("../../utils/voteutils.js", () => ({
    enrichEntriesWithVoteData: jest.fn()
}));

jest.unstable_mockModule("../../model/votes.js", () => ({
    getUserGlobalStats: jest.fn()
}));


const userModelMock = await import("../../model/users.js");
const voteModelMock = await import("../../model/votes.js");
const voteUtilsMock = await import("../../utils/voteutils.js");
const { getAllUsers, getUser } = await import("../../controller/users.js");


describe("Users Controller", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {},
            query: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

    });

    test("should fetch users", async () => {

        const fakeUsersList = [
            { id: 1, email: "test1@test.com" },
            { id: 2, email: "test2@test.com" }
        ];
        userModelMock.getAll.mockResolvedValue(fakeUsersList);

        await getAllUsers(req, res);

        expect(userModelMock.getAll).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            users: fakeUsersList
        });
    });


    describe("getUser()", () => {

        test("should return 404 if standard user is not found", async () => {
            req.params.id = "99";
            userModelMock.getUserById.mockResolvedValue(null);

            await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "User Not Found" });
        });

        test("should return standard user data if found", async () => {
            req.params.id = "1";
            userModelMock.getUserById.mockResolvedValue({ id: 1, email: "test@test.com" });

            await getUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ success: true, user: { id: 1, email: "test@test.com" } });
        });


        test("should return 404 if full user is not found", async () => {
            req.params.id = "99";
            req.query.full = "true";

            userModelMock.getUserProfileData.mockResolvedValue(null);
            voteModelMock.getUserGlobalStats.mockResolvedValue({});

            await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "User Not Found" });
        });

        test("should return full profile with empty entries if user has no entries", async () => {
            req.params.id = "1";
            req.query.full = "true";

            userModelMock.getUserProfileData.mockResolvedValue({ id: 1, firstName: "Bob" });
            voteModelMock.getUserGlobalStats.mockResolvedValue({ global_avg: 4 });

            await getUser(req, res);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                user: {
                    id: 1,
                    firstName: "Bob",
                    entries: [],
                    statistics: {
                        total_entries: 0,
                        global_avg: 4
                    }
                }
            });
        });

        test("should enrich entries and return full profile if user has entries", async () => {
            req.params.id = "1";
            req.query.full = "true";
            req.user.id = 5;

            const fakeEntries = [{ id: 10, image: "img.jpg" }];
            const enrichedEntries = [{ id: 10, image: "img.jpg", hasVoted: true }];

            userModelMock.getUserProfileData.mockResolvedValue({ id: 1, entries: fakeEntries });
            voteModelMock.getUserGlobalStats.mockResolvedValue({ global_avg: 4.5 });
            voteUtilsMock.enrichEntriesWithVoteData.mockResolvedValue(enrichedEntries);

            await getUser(req, res);

            expect(voteUtilsMock.enrichEntriesWithVoteData).toHaveBeenCalledWith(fakeEntries, 5);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                user: {
                    id: 1,
                    entries: enrichedEntries,
                    statistics: {
                        total_entries: 1,
                        global_avg: 4.5
                    }
                }
            });
        });
    });
})