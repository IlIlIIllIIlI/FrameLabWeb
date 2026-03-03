import { jest } from "@jest/globals";

const fsMock = {
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
};
jest.unstable_mockModule("fs", () => ({
    default: fsMock
}));

let storageConfig;
let multerConfig;
let mockSingleMiddleware = jest.fn();

class FakeMulterError extends Error {
    constructor(code) {
        super(code);
        this.code = code;
    }
}


jest.unstable_mockModule("multer", () => {
    const multerMock = jest.fn((config) => {
        multerConfig = config;
        return {
            single: jest.fn().mockReturnValue(mockSingleMiddleware),
        };
    });

    multerMock.diskStorage = jest.fn((config) => {
        storageConfig = config;
        return "fake_storage";
    });

    multerMock.MulterError = FakeMulterError;

    return { default: multerMock };
});

const { uploadImage } = await import("../../config/mutler.js");

describe("Multer Configuration", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Storage : destination()", () => {
        test("should create the ./temp/ directory if test does not exist", () => {
            fsMock.existsSync.mockReturnValue(false);
            const cb = jest.fn();

            storageConfig.destination({}, {}, cb);

            expect(fsMock.mkdirSync).toHaveBeenCalledWith("./temp/", { recursive: true });
            expect(cb).toHaveBeenCalledWith(null, "./temp/");
        });

        test("should not create the directory if test already exists", () => {
            fsMock.existsSync.mockReturnValue(true);
            const cb = jest.fn();

            storageConfig.destination({}, {}, cb);

            expect(fsMock.mkdirSync).not.toHaveBeenCalled();
            expect(cb).toHaveBeenCalledWith(null, "./temp/");
        });
    });

    describe("Storage : filename()", () => {
        test("should generate a unique filename with a timestamp", () => {
            jest.spyOn(Date, "now").mockReturnValue(1234567890);

            const file = { fieldname: "picture", originalname: "my-image.png" };
            const cb = jest.fn();

            storageConfig.filename({}, file, cb);

            expect(cb).toHaveBeenCalledWith(null, "picture-1234567890.png");

            Date.now.mockRestore();
        });
    });

    describe("File : checkFileType()", () => {
        test("should accept valid image types", () => {
            const cb = jest.fn();
            const validFile = { originalname: "test.jpg", mimetype: "image/jpeg" };

            multerConfig.fileFilter({}, validFile, cb);

            expect(cb).toHaveBeenCalledWith(null, true);
        });

        test("should reject non-image file types (e.g. PDF)", () => {
            const cb = jest.fn();
            const invalidFile = { originalname: "document.pdf", mimetype: "application/pdf" };

            multerConfig.fileFilter({}, invalidFile, cb);

            expect(cb).toHaveBeenCalledWith("Error: Images only! (jpeg, jpg, png, gif)");
        });
    });

    describe("Middleware: uploadImage()", () => {
        let req, res, next;

        beforeEach(() => {
            req = {};
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            next = jest.fn();
        });

        test("should call next() if there are no errors", () => {
            mockSingleMiddleware.mockImplementationOnce((req, res, cb) => cb());

            uploadImage(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
        });

        test("should return 413 if file is too large (LIMIT_FILE_SIZE)", () => {
            mockSingleMiddleware.mockImplementationOnce((req, res, cb) => {
                cb(new FakeMulterError("LIMIT_FILE_SIZE"));
            });

            uploadImage(req, res, next);

            expect(res.status).toHaveBeenCalledWith(413);
            expect(res.json).toHaveBeenCalledWith({ message: "File is too big! Max size is 10MB." });
        });

        test("should return 400 for any other Multer error", () => {
            const weirdError = new FakeMulterError("LIMIT_UNEXPECTED_FILE");
            weirdError.message = "Too many files";

            mockSingleMiddleware.mockImplementationOnce((req, res, cb) => {
                cb(weirdError);
            });

            uploadImage(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Too many files" });
        });

        test("should return 400 for a generic/unknown error (like wrong file type)", () => {
            mockSingleMiddleware.mockImplementationOnce((req, res, cb) => {
                cb("Error: Images only! (jpeg, jpg, png, gif)");
            });

            uploadImage(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Error: Images only! (jpeg, jpg, png, gif)" });
        });
    });
});