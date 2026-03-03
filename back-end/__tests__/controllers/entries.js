import { jest } from "@jest/globals";

jest.unstable_mockModule("fs", () => ({
    default: {
        existsSync: jest.fn(),
        mkdirSync: jest.fn(),
        renameSync: jest.fn(),
        unlinkSync: jest.fn(),
    }
}));

jest.unstable_mockModule("../../model/entries.js", () => ({
    createEntry: jest.fn(),
    getEntryByChallengeAndUser: jest.fn(),
    getEntryById: jest.fn(),
}));

const fsMock = (await import("fs")).default;
const entriesModelMock = await import("../../model/entries.js");
const { createEntry, getEntryById } = await import("../../controller/entries.js");

describe("Entries Controller", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {},
            params: {},
            file: { filename: "entry.jpg", path: "/tmp/entry.jpg" }
        };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    describe("createEntry()", () => {
        beforeEach(() => {
            req.body = { userId: "1", challengeId: "2" };
        });

        test("should return 401 if userId is missing", async () => {
            req.body.userId = null;
            await createEntry(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "No User" });
        });

        test("should return 401 if challengeId is missing", async () => {
            req.body.challengeId = null;
            await createEntry(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "No Challenge" });
        });

        test("should return 404 if user already has an entry for this challenge", async () => {
            entriesModelMock.getEntryByChallengeAndUser.mockResolvedValue({ success: true });
            await createEntry(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "You already have an Entry for this challenge" });
        });

        test("should create directory, move file, and return 200 on success", async () => {
            entriesModelMock.getEntryByChallengeAndUser.mockResolvedValue({ success: false });
            entriesModelMock.createEntry.mockResolvedValue({ success: true });
            fsMock.existsSync.mockReturnValue(false);

            await createEntry(req, res);

            expect(fsMock.existsSync).toHaveBeenCalledWith("./public/entries/2/1");
            expect(fsMock.mkdirSync).toHaveBeenCalledWith("./public/entries/2/1", { recursive: true });
            expect(fsMock.renameSync).toHaveBeenCalledWith("/tmp/entry.jpg", "./public/entries/2/1/entry.jpg");
            expect(res.json).toHaveBeenCalledWith({ message: "Entry created successfully!" });
        });

        test("should skip directory creation if test already exists", async () => {
            entriesModelMock.getEntryByChallengeAndUser.mockResolvedValue({ success: false });
            entriesModelMock.createEntry.mockResolvedValue({ success: true });
            fsMock.existsSync.mockReturnValue(true);

            await createEntry(req, res);

            expect(fsMock.mkdirSync).not.toHaveBeenCalled();
            expect(fsMock.renameSync).toHaveBeenCalled();
        });

        test("should delete temp file and return 500 if DB creation fails", async () => {
            entriesModelMock.getEntryByChallengeAndUser.mockResolvedValue({ success: false });
            const fail = { success: false, message: "Error" };
            entriesModelMock.createEntry.mockResolvedValue(fail);

            await createEntry(req, res);

            expect(fsMock.unlinkSync).toHaveBeenCalledWith("/tmp/entry.jpg");
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(fail);
        });
    });

    describe("getEntryById()", () => {
        test("should return 200 and entry data if successful", async () => {
            req.params.id = "1";
            entriesModelMock.getEntryById.mockResolvedValue({ success: true, entry: { id: 1 } });
            await getEntryById(req, res);
            expect(res.json).toHaveBeenCalledWith({ success: true, entry: { id: 1 } });
        });

        test("should return 404 and error message if not found", async () => {
            req.params.id = "99";
            entriesModelMock.getEntryById.mockResolvedValue({ success: false, message: "Entry does not exist" });
            await getEntryById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Entry does not exist" });
        });
    });
});