const express = require("express");

const router = express.Router();

const {upload} = require("../Middleware/upload")
const {PrescriptionController} = require("../Controllers/PrescriptionController");


router.post("/create-prescription/:id", upload.array("images", 2), PrescriptionController);

module.exports = router