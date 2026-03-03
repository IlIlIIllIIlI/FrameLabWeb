import { jest } from "@jest/globals";
import { prismaMock, resetMock } from "../../config/singleton.js";


jest.unstable_mockModule("../../db/prisma.ts", () => ({
    prisma: prismaMock,
}));

const userModel = await import("../../model/users.js");

describe("Users Model", () => {
    beforeEach(() => {
        resetMock();
    });

    describe("getAll", () => {
        test("should call findMany and omit passwords", async () => {
            const mockUsers = [{ id: 1, email: "test@test.com" }, { id: 2, email: "test2@test2.com" }];
            prismaMock.users.findMany.mockResolvedValue(mockUsers);

            const result = await userModel.getAll();

            expect(result).toEqual(mockUsers);
            expect(prismaMock.users.findMany).toHaveBeenCalledWith({
                omit: { password: true },
            });
        })
    });

    describe("getPasswordByEmail", () => {
        test("should return the password if user exists", async () => {
            prismaMock.users.findUniqueOrThrow.mockResolvedValue({ password: "password" });

            const result = await userModel.getPasswordByEmail("test@test.com");

            expect(result).toBe("password");
            expect(prismaMock.users.findUniqueOrThrow).toHaveBeenCalledWith(
                expect.objectContaining({ where: { email: "test@test.com" } })
            );
        })

        test("should throw error if the user doesn't exist", async () => {
            prismaMock.users.findUniqueOrThrow.mockRejectedValue(new Error("User not found"));

            await expect(userModel.getPasswordByEmail("test@test.com")).rejects.toThrow("User not found");
        });
    })

    describe("getUserByEmail", () => {
        test("should return the user if the Email exists", async () => {
            const mockUser = { id: 1, email: "test@test.com", first_name: "Yay" };
            prismaMock.users.findUniqueOrThrow.mockResolvedValue(mockUser);

            const result = await userModel.getUserByEmail("test@test.com");

            expect(result).toEqual(mockUser);
        })
        test("should return false if the Email doesn't exist", async () => {
            prismaMock.users.findUniqueOrThrow.mockRejectedValue(new Error("Not found"));

            const result = await userModel.getUserByEmail("test@test.com");

            expect(result).toBe(false);
        })
    })

    describe("createUser", () => {
        test("should create user", async () => {
            prismaMock.users.create.mockResolvedValue({ id: 1 });

            const result = await userModel.createUser("test@test.com", "yay", "yey", "123");

            expect(result).toBe(true);
            expect(prismaMock.users.create).toHaveBeenCalledWith({
                data: {
                    email: "test@test.com",
                    first_name: "yay",
                    last_name: "yey",
                    password: "123",
                },
            });
        })

        test("should return false if wrong info", async () => {
            prismaMock.users.create.mockRejectedValue(new Error("Wrong Info"));

            const result = await userModel.createUser("test@test.com", "yey", "yey", "123");

            expect(result).toBe(false);
        })
    })

    describe("getIsAdminByEmail()", () => {
        it("should return is_admin", async () => {
            const mockData = { is_admin: true };
            prismaMock.users.findUniqueOrThrow.mockResolvedValue(mockData);

            const result = await userModel.getIsAdminByEmail("admin@test.com");

            expect(result).toEqual(mockData);
            expect(prismaMock.users.findUniqueOrThrow).toHaveBeenCalledWith({
                where: { email: "admin@test.com" },
                select: { is_admin: true },
            });
        });

        it("should return false if the user does not exist or an error occurs", async () => {
            prismaMock.users.findUniqueOrThrow.mockRejectedValue(new Error("User not found"));

            const result = await userModel.getIsAdminByEmail("unknown@test.com");


            expect(result).toBe(false);
        });
    });
})
