const express = require("express");

const router = express.Router();

const {lastFiveMatches} = require("../Controllers/lastfiveMatches");


router.get("/lastfive/:id", lastFiveMatches);

module.exports = router;
