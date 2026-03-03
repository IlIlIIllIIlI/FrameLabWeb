import { jest } from "@jest/globals";
import { prismaMock, resetMock } from "../../config/singleton.js";

jest.unstable_mockModule("../../db/prisma.ts", () => ({
    prisma: prismaMock,
}));

const challengeModel = await import("../../model/challenges.js");

describe("Challenges Model", () => {
    beforeEach(() => {
        resetMock();
    });

    describe("getArchived()", () => {
        test("should return a list of all archived challenges", async () => {
            const mockData = [{ id: 1, theme_title: "Old Challenge", is_archived: true }];
            prismaMock.challenges.findMany.mockResolvedValue(mockData);

            const result = await challengeModel.getArchived();

            expect(result).toEqual(mockData);
            expect(prismaMock.challenges.findMany).toHaveBeenCalledWith({
                where: { is_archived: true },
            });
        });
    });

    describe("getCurrent()", () => {
        test("should return the active challenge if one exists", async () => {
            const mockData = { id: 1, theme_title: "Active Challenge", is_archived: false };
            prismaMock.challenges.findFirstOrThrow.mockResolvedValue(mockData);

            const result = await challengeModel.getCurrent();

            expect(result).toEqual({ success: true, challenge: mockData });
            expect(prismaMock.challenges.findFirstOrThrow).toHaveBeenCalledWith({
                where: { is_archived: false },
            });
        });

        test("should return a failure message if no active challenge exists", async () => {
            prismaMock.challenges.findFirstOrThrow.mockRejectedValue(new Error("Not found"));

            const result = await challengeModel.getCurrent();

            expect(result).toEqual({ success: false, message: "No challenge for now" });
        });
    });

    describe("getLatest()", () => {
        test("should return the most recently created challenge", async () => {
            const mockData = { id: 5, theme_title: "Latest Challenge" };
            prismaMock.challenges.findFirstOrThrow.mockResolvedValue(mockData);

            const result = await challengeModel.getLatest();

            expect(result).toEqual({ success: true, challenge: mockData });
            expect(prismaMock.challenges.findFirstOrThrow).toHaveBeenCalledWith({
                orderBy: { id: "desc" },
            });
        });

        test("should return a failure message if no challenges exist at all", async () => {
            prismaMock.challenges.findFirstOrThrow.mockRejectedValue(new Error("Not found"));

            const result = await challengeModel.getLatest();

            expect(result).toEqual({ success: false, message: "No challenge" });
        });
    });

    describe("create()", () => {
        test("should successfully create a new challenge and convert dates", async () => {
            const mockData = { id: 6, theme_title: "New Theme" };
            prismaMock.challenges.create.mockResolvedValue(mockData);

            const startDate = "2026-01-01";
            const endDate = "2026-01-10";

            const result = await challengeModel.create(
                "New Theme",
                "Description",
                startDate,
                endDate,
                "path/to/pic.jpg"
            );

            expect(result).toEqual({ success: true, challenge: mockData });
            expect(prismaMock.challenges.create).toHaveBeenCalledWith({
                data: {
                    theme_title: "New Theme",
                    theme_description: "Description",
                    start_date: new Date(startDate),
                    end_date: new Date(endDate),
                    required_picture_url: "path/to/pic.jpg",
                },
            });
        });

        test("should catch database errors and return a safe error message", async () => {
            prismaMock.challenges.create.mockRejectedValue(new Error("error"));

            const result = await challengeModel.create("T", "D", "2026-01-01", "2026-01-10", "pic.jpg");

            expect(result).toEqual({ success: false, message: "Something happened, please try later" });
        });
    });

    describe("archiveChallenge()", () => {
        test("should successfully update the challenge to be archived", async () => {
            prismaMock.challenges.update.mockResolvedValue({ id: 1, is_archived: true });

            const result = await challengeModel.archiveChallenge(1);

            expect(result).toEqual({ success: true });
            expect(prismaMock.challenges.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { is_archived: true },
            });
        });

        test("should catch errors during update and return a safe error message", async () => {
            prismaMock.challenges.update.mockRejectedValue(new Error("Update failed"));

            const result = await challengeModel.archiveChallenge(999);

            expect(result).toEqual({ success: false, message: "Something happened, please try later" });
        });
    });

    describe("getChallenge()", () => {
        test("should return a specific challenge including its nested entries and user data", async () => {
            const mockData = {
                id: 1,
                theme_title: "Test",
                entries: [{ id: 1, users: { first_name: "ij", last_name: "Djijie" } }]
            };

            prismaMock.challenges.findUniqueOrThrow.mockResolvedValue(mockData);

            const result = await challengeModel.getChallenge(1);

            expect(result).toEqual({ success: true, challenge: mockData });

            expect(prismaMock.challenges.findUniqueOrThrow).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    entries: {
                        include: {
                            users: {
                                select: { first_name: true, last_name: true },
                            },
                        },
                    },
                },
            });
        });

        test("should catch error and return failure message if challenge does not exist", async () => {
            prismaMock.challenges.findUniqueOrThrow.mockRejectedValue(new Error("not found"));

            const result = await challengeModel.getChallenge(999);

            expect(result).toEqual({ success: false, message: "Challenge does not exist" });
        });
    });
});