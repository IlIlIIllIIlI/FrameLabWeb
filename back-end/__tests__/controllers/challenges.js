import { jest } from "@jest/globals";

jest.unstable_mockModule("fs", () => ({
    default: {
        existsSync: jest.fn(),
        mkdirSync: jest.fn(),
        renameSync: jest.fn(),
        unlinkSync: jest.fn(),
    },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
    default: {
        verify: jest.fn()
    },
}));

jest.unstable_mockModule("../../utils/voteutils.js", () => ({
    enrichEntriesWithVoteData: jest.fn()
}));

jest.unstable_mockModule("../../model/challenges.js", () => ({
    getArchived: jest.fn(),
    getCurrent: jest.fn(),
    getChallenge: jest.fn(),
    create: jest.fn(),
    getLatest: jest.fn(),
    archiveChallenge: jest.fn(),
}));

const fsMock = (await import("fs")).default;
const challengeModelMock = await import("../../model/challenges.js");
const {
    getArchivedChallenges,
    getCurrentChallenge,
    getChallengeById,
    createChallenge,
    archiveChallenge
} = await import("../../controller/challenges.js");

describe("Challenges Controller", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.PRIVATE_KEY = "test";

        req = {
            body: {},
            params: {},
            cookies: {},
            file: { filename: "image.jpg", path: "/tmp/image.jpg" }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("getArchivedChallenges()", () => {
        test("should return archived challenges", async () => {
            const mockData = [{ id: 1, title: "Archived" }];
            challengeModelMock.getArchived.mockResolvedValue(mockData);

            await getArchivedChallenges(req, res);

            expect(challengeModelMock.getArchived).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockData);
        });
    });

    describe("getCurrentChallenge()", () => {
        test("should return the current challenge", async () => {
            const mockData = { success: true, challenge: { id: 2 } };
            challengeModelMock.getCurrent.mockResolvedValue(mockData);

            await getCurrentChallenge(req, res);

            expect(challengeModelMock.getCurrent).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockData);
        });
    });

    describe("getChallengeById()", () => {
        test("should return 200 and challenge data if successful", async () => {
            req.params.id = "5";
            const mockData = { success: true, challenge: { id: 5 } };
            challengeModelMock.getChallenge.mockResolvedValue(mockData);

            await getChallengeById(req, res);

            expect(challengeModelMock.getChallenge).toHaveBeenCalledWith(5);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        test("should return 404 and error message if challenge fails/does not exist", async () => {
            req.params.id = "999";
            const mockData = { success: false, message: "Does not exist" };
            challengeModelMock.getChallenge.mockResolvedValue(mockData);

            await getChallengeById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(mockData);
        });

        test("should enrich entries with vote data if challenge has entries and user is logged in", async () => {
            req.params.id = "5";
            req.cookies.session = "valid_token";

            const mockChallengeData = {
                success: true,
                challenge: {
                    id: 5,
                    entries: [{ id: 10, image: "test.jpg" }]
                }
            };
            challengeModelMock.getChallenge.mockResolvedValue(mockChallengeData);

            const jwtMock = (await import("jsonwebtoken")).default;
            jwtMock.verify.mockReturnValue({ user: { id: 99 } });

            const enrichedEntries = [{ id: 10, image: "test.jpg", hasVoted: false }];
            const voteUtilsMock = await import("../../utils/voteutils.js");
            voteUtilsMock.enrichEntriesWithVoteData.mockResolvedValue(enrichedEntries);

            await getChallengeById(req, res);

            expect(jwtMock.verify).toHaveBeenCalledWith("valid_token", "test");
            expect(voteUtilsMock.enrichEntriesWithVoteData).toHaveBeenCalledWith(
                [{ id: 10, image: "test.jpg" }],
                99
            );

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                challenge: {
                    id: 5,
                    entries: enrichedEntries
                }
            });
        });
    });

    describe("createChallenge()", () => {
        beforeEach(() => {
            req.body = {
                title: "Valid Title",
                description: "Valid Desc",
                start_date: "2026-01-01",
                end_date: "2026-01-10",
            };
        });

        test("should fail if title is missing or empty", async () => {
            req.body.title = "   ";
            await createChallenge(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid Title" });
        });

        test("should fail if description is missing or empty", async () => {
            req.body.description = null;
            await createChallenge(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid description" });
        });

        test("should fail if start_date is missing or empty", async () => {
            req.body.start_date = "";
            await createChallenge(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid start date" });
        });

        test("should fail if end_date is missing or empty", async () => {
            req.body.end_date = "   ";
            await createChallenge(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid end date" });
        });

        test("should return 404 if a challenge is currently running", async () => {
            challengeModelMock.getCurrent.mockResolvedValue({ success: true });

            await createChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "There is already a challenge going on" });
        });

        test("should create directory, move file, and return success if DB create succeeds", async () => {
            challengeModelMock.getCurrent.mockResolvedValue({ success: false });
            challengeModelMock.getLatest.mockResolvedValue({ success: true, challenge: { id: 5 } });
            challengeModelMock.create.mockResolvedValue({ success: true });
            fsMock.existsSync.mockReturnValue(false);

            await createChallenge(req, res);

            expect(fsMock.existsSync).toHaveBeenCalledWith("./public/challenges/6");
            expect(fsMock.mkdirSync).toHaveBeenCalledWith("./public/challenges/6", { recursive: true });
            expect(fsMock.renameSync).toHaveBeenCalledWith("/tmp/image.jpg", "./public/challenges/6/image.jpg");
            expect(res.json).toHaveBeenCalledWith({ message: "Challenge created successfully!" });
        });

        test("should NOT create directory if test already exists", async () => {
            challengeModelMock.getCurrent.mockResolvedValue({ success: false });
            challengeModelMock.getLatest.mockResolvedValue({ success: false });
            challengeModelMock.create.mockResolvedValue({ success: true });
            fsMock.existsSync.mockReturnValue(true);

            await createChallenge(req, res);

            expect(fsMock.existsSync).toHaveBeenCalledWith("./public/challenges/1");
            expect(fsMock.mkdirSync).not.toHaveBeenCalled();
            expect(fsMock.renameSync).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: "Challenge created successfully!" });
        });

        test("should delete uploaded temp file and return 500 if DB creation fails", async () => {
            challengeModelMock.getCurrent.mockResolvedValue({ success: false });
            challengeModelMock.getLatest.mockResolvedValue({ success: true, challenge: { id: 5 } });
            const failResponse = { success: false, message: "DB Error" };
            challengeModelMock.create.mockResolvedValue(failResponse);

            await createChallenge(req, res);

            expect(fsMock.unlinkSync).toHaveBeenCalledWith("/tmp/image.jpg");
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(failResponse);
        });
    });

    describe("archiveChallenge()", () => {
        test("should return 404 if the challenge to archive does not exist", async () => {
            req.body.id = 99;
            challengeModelMock.getChallenge.mockResolvedValue({ success: false });

            await archiveChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Challenge does not exist" });
        });

        test("should return 403 if the challenge is already archived", async () => {
            req.body.id = 1;
            challengeModelMock.getChallenge.mockResolvedValue({
                success: true,
                challenge: { is_archived: true }
            });

            await archiveChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: "Challenge is already archived" });
        });

        test("should return 200 if archive update is successful", async () => {
            req.body.id = 1;
            challengeModelMock.getChallenge.mockResolvedValue({
                success: true,
                challenge: { is_archived: false }
            });

            const successData = { success: true };
            challengeModelMock.archiveChallenge.mockResolvedValue(successData);

            await archiveChallenge(req, res);

            expect(res.json).toHaveBeenCalledWith(successData);
        });

        test("should return 404 if archive update fails in the database", async () => {
            req.body.id = 1;
            challengeModelMock.getChallenge.mockResolvedValue({
                success: true,
                challenge: { is_archived: false }
            });

            const failData = { success: false, message: "Update failed" };
            challengeModelMock.archiveChallenge.mockResolvedValue(failData);

            await archiveChallenge(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(failData);
        });
    });
});