import { jest } from "@jest/globals";


jest.unstable_mockModule("../../model/users.js", () => ({
    getAll: jest.fn(),
}));

const userModelMock = await import("../../model/users.js");
const { getAllUsers } = await import("../../controller/users.js");

describe("Users Controller", () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {};
        res = {
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
})