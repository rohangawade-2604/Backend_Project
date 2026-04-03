const { Mr } = require("../Schema_models/MrModels");

const PlayersLeaderBoard = async (req, res) => {
  try {
    const mrs = await Mr.find({}, "MRName TeamName TotalRuns mrscoreEachMatch");

    // sort by TotalRuns
    mrs.sort((a, b) => (b.TotalRuns || 0) - (a.TotalRuns || 0));

    // optional: add rank
     const leaderboard = mrs.map((mr, index) => {
      const matches = mr.mrscoreEachMatch || [];

      return {
        MRName: mr.MRName,
        TeamName: mr.TeamName,
        totalRuns: mr.TotalRuns || 0,
        MatchesPlayed: matches.length, // ✅ correct
        rank: index + 1
      };
    });

    return res.status(200).json({
      success: true,
      message: "leaderboard fetch successfully",
      data: leaderboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error is been occured in this",
      error: error.message,
    });
  }
};

module.exports = { PlayersLeaderBoard };
