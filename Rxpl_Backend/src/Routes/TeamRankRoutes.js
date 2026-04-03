const express = require("express");

const router = express.Router();

const {TeamRank} = require("../Controllers/TeamRankController")


router.get("/getTeamRank", TeamRank);

module.exports = router