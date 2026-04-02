const express = require("express");

const router = express.Router();

const {ProfileController} = require("../Controllers/ProfileController");

router.get("/profile/:id", ProfileController);

module.exports = router;