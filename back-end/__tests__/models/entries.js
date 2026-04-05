import { jest } from "@jest/globals";
import { prismaMock, resetMock } from "../../config/singleton.js";

jest.unstable_mockModule("../../db/prisma.ts", () => ({
    prisma: prismaMock,
}));

const entriesModel = await import("../../model/entries.js");

describe("Entries Model", () => {
    beforeEach(() => {
        resetMock();
    });

    describe("createEntry()", () => {
        test("should successfully create an entry", async () => {
            const mockEntry = { id: 1, edited_picture_url: "pic.jpg" };
            prismaMock.entries.create.mockResolvedValue(mockEntry);

            const result = await entriesModel.createEntry(1, 2, "pic.jpg");

            expect(result).toEqual({ success: true, entry: mockEntry });
            expect(prismaMock.entries.create).toHaveBeenCalledWith({
                data: { challenge_id: 1, user_id: 2, edited_picture_url: "pic.jpg" }
            });
        });

        test("should catch error and return safe message", async () => {
            prismaMock.entries.create.mockRejectedValue(new Error("Error"));

            const result = await entriesModel.createEntry(1, 2, "pic.jpg");
            expect(result).toEqual({ success: false, message: "Something happened, please try later" });
        });
    });

    describe("getEntryByChallengeAndUser()", () => {
        test("should return the entry if found", async () => {
            const mockEntry = { id: 1 };
            prismaMock.entries.findFirst.mockResolvedValue(mockEntry);

            const result = await entriesModel.getEntryByChallengeAndUser(1, 2);
            expect(result).toEqual({ success: true, entry: mockEntry });
        });

        test("should return failure if no entry exists", async () => {
            prismaMock.entries.findFirst.mockResolvedValue(null);

            const result = await entriesModel.getEntryByChallengeAndUser(1, 2);
            expect(result).toEqual({ success: false, message: "No Entry" });
        });

        test("should catch error and return safe message", async () => {
            prismaMock.entries.findFirst.mockRejectedValue(new Error("Error"));

            const result = await entriesModel.getEntryByChallengeAndUser(1, 2);
            expect(result).toEqual({ success: false, message: "Something happened, please try later" });
        });
    });

    describe("getEntryById()", () => {
        test("should return entry with nested includes", async () => {
            const mockEntry = { id: 1, users: { first_name: "Jcfzn" } };
            prismaMock.entries.findUniqueOrThrow.mockResolvedValue(mockEntry);

            const result = await entriesModel.getEntryById(1);
            expect(result).toEqual({ success: true, entry: mockEntry });
            expect(prismaMock.entries.findUniqueOrThrow).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 1 } })
            );
        });

        test("should catch error if entry does not exist", async () => {
            prismaMock.entries.findUniqueOrThrow.mockRejectedValue(new Error("Error"));

            const result = await entriesModel.getEntryById(99);
            expect(result).toEqual({ success: false, message: "Entry does not exist" });
        });
    });
    describe("getAllEntries()", () => {
        test("should return all entries", async () => {
            const mockEntries = [{ id: 1 }, { id: 2 }];

            prismaMock.entries.findMany.mockResolvedValue(mockEntries);

            const result = await entriesModel.getAllEntries();

            expect(result).toEqual(mockEntries);
            expect(prismaMock.entries.findMany).toHaveBeenCalled();
        });
    });

    describe("getEntriesByChallenge()", () => {
        test("should return entries for a specific challenge", async () => {
            const mockEntries = [{ id: 1, challenge_id: 5 }];

            prismaMock.entries.findMany.mockResolvedValue(mockEntries);

            const result = await entriesModel.getEntriesByChallenge(5);

            expect(result).toEqual(mockEntries);
            expect(prismaMock.entries.findMany).toHaveBeenCalledWith({
                where: { challenge_id: 5 }
            });
        });
    });
});