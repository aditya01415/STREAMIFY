import multer from "multer";
import fs from "fs";
import path from "path";

const tempDirectory = path.resolve("public/temp");
fs.mkdirSync(tempDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDirectory);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ""; // get .mp4, .jpg etc.
    cb(null, Date.now() + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "videoFile" && !file.mimetype.startsWith("video/")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }

  if (file.fieldname === "thumbnail" && !file.mimetype.startsWith("image/")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }

  cb(null, true);
};

export const upload = multer({ 
    storage,
    fileFilter,
    limits: {
      files: 2,
      fileSize: 500 * 1024 * 1024
    }
})