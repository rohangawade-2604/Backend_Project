const express = require("express");

const router = express.Router();

const {AdminLogin} = require("../Controllers/AdminLogin");


router.post("/adminlogin", AdminLogin);

module.exports = router