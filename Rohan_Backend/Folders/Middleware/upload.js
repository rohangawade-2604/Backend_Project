const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "DataFiles_Files"); // folder where files go
    cb(null, path.join(__dirname, "../../DataFiles/Files"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = { upload };
