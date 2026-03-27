const express = require("express");
const router = express.Router();

const {createTournamentMatches} = require("../Controllers/MatchesController");


router.post("/create-tournament", createTournamentMatches);

module.exports = router