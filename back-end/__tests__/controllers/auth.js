import { jest } from "@jest/globals";

jest.unstable_mockModule("bcrypt", () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn()
    },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
    default: {
        sign: jest.fn(),
        verify: jest.fn()
    },
}));

jest.unstable_mockModule("../../model/users.js", () => ({
    getPasswordByEmail: jest.fn(),
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    getIsAdminByEmail: jest.fn(),
}));

const bcryptMock = (await import("bcrypt")).default;
const jwtMock = (await import("jsonwebtoken")).default;
const userModelMock = await import("../../model/users.js");
const {
    login, register, auth, isAdmin,
    logoutUser, checkPasswordByEmail, getUserByCookie
} = await import("../../controller/auth.js");

describe("Auth Controllers & Middleware", () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.PRIVATE_KEY = "test";

        req = { body: {}, cookies: {}, get: jest.fn() };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn(),
        };
        next = jest.fn();
    });

    describe("login()", () => {
        test("should return 404 if email or password missing", async () => {
            req.body = { email: "test@test.com" };
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Email and password Can't be empty" }));
        });

        test("should return 401 on wrong credentials", async () => {
            req.body = { email: "test@test.com", password: "wrong" };
            userModelMock.getPasswordByEmail.mockResolvedValue("password");
            bcryptMock.compare.mockResolvedValue(false);

            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Incorrect Email or password" }));
        });

        test("should login successfully", async () => {
            req.body = { email: "test@test.com", password: "correct" };
            userModelMock.getPasswordByEmail.mockResolvedValue("password");
            bcryptMock.compare.mockResolvedValue(true);
            userModelMock.getUserByEmail.mockResolvedValue({ id: 1 });
            jwtMock.sign.mockReturnValue("token");

            await login(req, res);
            expect(res.cookie).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, token: "token" }));
        });
    });

    describe("register()", () => {
        test("should fail on missing or bad email", async () => {
            req.body = { email: "bad-email" };
            await register(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Invalid Email" }));
        });

        test("should fail on missing or weak password", async () => {
            req.body = { email: "test@test.com", password: "weak" };
            await register(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining("Invalid password") }));
        });

        test("should fail on missing or empty first name", async () => {
            req.body = { email: "test@test.com", password: "ValidPassword123!", firstName: "   " };
            await register(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "First name can't be empty"
            }));
        });

        test("should fail on missing or empty last name", async () => {
            req.body = { email: "test@test.com", password: "ValidPassword123!", firstName: "John", lastName: "" };
            await register(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Last name can't be empty"
            }));
        });

        test("should fail if email already exists in DB", async () => {
            req.body = { email: "test@test.com", password: "ValidPassword123!", firstName: "J", lastName: "D" };
            bcryptMock.hash.mockResolvedValue("password");
            userModelMock.createUser.mockResolvedValue(false);

            await register(req, res);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Email already exist" }));
        });

        test("should register successfully", async () => {
            req.body = { email: "test@test.com", password: "ValidPassword123!", firstName: "J", lastName: "D" };
            bcryptMock.hash.mockResolvedValue("password");
            userModelMock.createUser.mockResolvedValue(true);
            userModelMock.getUserByEmail.mockResolvedValue({ id: 1 });
            jwtMock.sign.mockReturnValue("token");

            await register(req, res);
            expect(res.cookie).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });
    });

    describe("auth() middleware", () => {
        test("should authenticate via valid cookie session", async () => {
            req.cookies.session = "valid_token";
            jwtMock.verify.mockReturnValue({ user: { id: 1 } });

            await auth(req, res, next);
            expect(req.user.id).toBe(1);
            expect(next).toHaveBeenCalled();
        });

        test("should catch error and return 401 if cookie token is invalid", async () => {
            req.cookies.session = "bad_token";
            jwtMock.verify.mockImplementation(() => { throw new Error("JWT Malformed"); });

            await auth(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
        });

        test("should authenticate via Authorization header", async () => {
            req.get.mockReturnValue("Bearer valid_token");
            jwtMock.verify.mockReturnValue({ user: { id: 2 } });

            await auth(req, res, next);
            expect(req.user.id).toBe(2);
            expect(next).toHaveBeenCalled();
        });

        test("should catch error and return 401 if bearer token is invalid", async () => {
            req.get.mockReturnValue("Bearer bad_token");
            jwtMock.verify.mockImplementation(() => { throw new Error("JWT Malformed"); });

            await auth(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
        });


        test("should authenticate via body email and password", async () => {
            req.body = { email: "test@test.com", password: "password123" };
            userModelMock.getPasswordByEmail.mockResolvedValue("hashed");
            bcryptMock.compare.mockResolvedValue(true);
            userModelMock.getUserByEmail.mockResolvedValue({ id: 3 });

            await auth(req, res, next);
            expect(req.user.id).toBe(3);
            expect(next).toHaveBeenCalled();
        });

        test("should catch TypeError and return 401 if req.body is undefined", async () => {
            req.body = undefined;
            await auth(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "You need to be logged in" });
        });

        test("should return 401 if all auth methods fail", async () => {
            await auth(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "You need to be logged in" });
        });
    });

    describe("isAdmin() middleware", () => {
        test("should reject non-admins with 403", async () => {
            req.user = { email: "user@test.com" };
            userModelMock.getIsAdminByEmail.mockResolvedValue({ is_admin: false });

            await isAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
        });

        test("should call next() for admins", async () => {
            req.user = { email: "admin@test.com" };
            userModelMock.getIsAdminByEmail.mockResolvedValue({ is_admin: true });

            await isAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe("logoutUser()", () => {
        test("should clear the session cookie", async () => {
            await logoutUser(req, res);
            expect(res.clearCookie).toHaveBeenCalledWith("session");
        });
    });

    describe("getUserByCookie()", () => {
        test("should return 404 if no cookie exists", async () => {
            await getUserByCookie(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        test("should catch error and return 401 if token is invalid", async () => {
            req.cookies.session = "bad_token";
            jwtMock.verify.mockImplementation(() => { throw new Error("Invalid or expired token"); });

            await getUserByCookie(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token" });
        });

        test("should return user data if token is valid", async () => {
            req.cookies.session = "good_token";
            jwtMock.verify.mockReturnValue({ user: { email: "test@test.com" } });

            await getUserByCookie(req, res);
            expect(res.json).toHaveBeenCalledWith({ user: { email: "test@test.com" } });
        });
    });

    describe("checkPasswordByEmail()", () => {
        test("should return false if user password is null", async () => {
            userModelMock.getPasswordByEmail.mockResolvedValue(null);
            const result = await checkPasswordByEmail("test@test.com", "pass");
            expect(result).toBe(false);
        });

        test("should return bcrypt.compare result if user exists", async () => {
            userModelMock.getPasswordByEmail.mockResolvedValue("hashed");
            bcryptMock.compare.mockResolvedValue(true);
            const result = await checkPasswordByEmail("test@test.com", "pass");
            expect(result).toBe(true);
            expect(bcryptMock.compare).toHaveBeenCalledWith("pass", "hashed");
        });
    });
});