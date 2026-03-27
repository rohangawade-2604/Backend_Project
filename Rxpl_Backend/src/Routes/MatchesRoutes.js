const express = require("express");
const router = express.Router();
const {upload} = require("../Middleware/upload")

const {createMatchFromExcel} = require("../Controllers/MatchesController");

router.post("/upload-match-excel", upload.single("file"), createMatchFromExcel);

module.exports = router