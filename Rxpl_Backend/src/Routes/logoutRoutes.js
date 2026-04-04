const express = require("express");

const router = express.Router();

const {AdminLogout} = require("../Controllers/logoutController");

router.post("/adminlogout", AdminLogout);

module.exports = router