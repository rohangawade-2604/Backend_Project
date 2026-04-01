const express = require("express");

const router = express.Router();

const {getPrescription} = require("../Controllers/getPrescription");

router.get("/get-prescription/:id", getPrescription);

module.exports = router;
