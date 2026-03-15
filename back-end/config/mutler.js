import multer from "multer";
import fs from "fs";
import path from "path";

// Defines where the file will be saved and how it will be named.
const storage = multer.diskStorage({
  // which folder to save the uploaded files into.
  destination: function (req, file, cb) {
    const dir = "./temp/";

    // Check if the directory exists. If it doesn't, create it.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Pass the directory path
    cb(null, dir);
  },

  // Generates a unique name for the file
  filename: function (req, file, cb) {
    // Format: "fieldname-1623456789012.ext" (e.g., picture-1623456789012.jpg)
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});


// Combines the storage engine, limits, and file filters into one usable object.
const upload = multer({
  storage: storage,
  // Limit size 10,000,000 bytes = 10 MB.
  limits: { fileSize: 10000000 },
  // File Filter before saving it.
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});


export function uploadImage(req, res, next) {
  // Looks for a single file uploaded under the form field name "picture"
  const image = upload.single("picture");

  // Execute multer upload process
  image(req, res, (err) => {

    // Catching errors
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message: "File is too big! Max size is 10MB.",
        });
      }

      return res.status(400).json({ message: err.message });

    } else if (err) {
      return res.status(400).json({ message: err });
    }

    next();
  });
}

// Ensures only specific image formats are allowed through the filter.
function checkFileType(file, cb) {
  // Define the allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;

  // Test if the file's extension matches the allowed list
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Test if the file's MIME type matches the allowed list 
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only! (jpeg, jpg, png, gif)");
  }
}