const express = require("express");

const router = express.Router();


const {updatePrescriptionStatus} = require("../Controllers/UpdateStatus")


router.post("/update-prescription/:id", updatePrescriptionStatus);

module.exports = router;