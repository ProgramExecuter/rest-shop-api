const multer = require("multer");

const storage = multer.diskStorage({
  // Save the images in ./uploads folder
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },

  // File name assignment
  filename: function (req, file, cb) {
    const newName = Date.now() + file.originalname;
    cb(null, newName);
  },
});

//
// Filter types of files, and allow 'jpeg' and 'png'
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//
// Finalized Multer Object
const upload = multer({
  storage,
  // Images <= 5MB are saved
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

module.exports = upload;
