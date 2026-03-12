const express = require("express");
const router = express.Router();

const {upload} = require("../../Folders/Middleware/upload")
const {uploadHierarchyExcel} = require("../Controller/hierarchy")



router.post("/upload-excel", upload.single("file"), uploadHierarchyExcel);

module.exports = router

