const express = require("express");

const routes = express.Router();

const {PlayersLeaderBoard} = require("../Controllers/PlayersLeaderboard");

routes.get("/player-leaderboard", PlayersLeaderBoard);

module.exports = routes