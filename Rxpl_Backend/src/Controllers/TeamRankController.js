const { Mr } = require("../Schema_models/MrModels");

const TeamRank = async (req, res) => {
  try {
    const mrs = await Mr.find({}, " TeamName TotalRuns mrscoreEachMatch");

    const teamMap = {};

    mrs.forEach((mr) => {
      const team = mr.TeamName || "Unknown";
      const runs = mr.TotalRuns || 0;
      const matches = Array.isArray(mr.mrscoreEachMatch)
        ? mr.mrscoreEachMatch
        : [];

      if (!teamMap[team]) {
        teamMap[team] = {
          TeamName: team,
          totalRuns: 0,
          // totalMatches: 0
          matchIds: new Set(),
        };
      }

      teamMap[team].totalRuns += runs;
      // teamMap[team].totalMatches += matches;

      matches.forEach((m) => {
        if (m.matchId) {
          teamMap[team].matchIds.add(m.matchId.toString());
        }
      });
    });

    // convert object to array
    let teamsranks = Object.values(teamMap).map((team) => ({
      TeamName: team.TeamName,
      totalRuns: team.totalRuns,
      totalMatchesPlayed: team.matchIds.size,
    }));

    // sort by runs
    teamsranks.sort((a, b) => b.totalRuns - a.totalRuns);

    // add ranks
    teamsranks = teamsranks.map((team, index) => ({
      ...team,
      rank: index + 1,
    }));

    return res.status(200).json({
      success: true,
      message: "Team Rank builded Successfully",
      data: teamsranks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error is been occured ",
      error: error.message,
    });
  }
};

module.exports = { TeamRank };
