const express = require("express");

const router = express.Router();


// const { logincontroller } = require("../Controller/loginuser")
const { loginUser } = require("../Controller/loginuser")

router.post("/login", loginUser);

module.exports = router


