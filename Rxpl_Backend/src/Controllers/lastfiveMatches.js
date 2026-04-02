const { Mr } = require("../Schema_models/MrModels");
const { Tlm } = require("../Schema_models/TlmModels");
const { Flm } = require("../Schema_models/FlmModels");
const { Slm } = require("../Schema_models/SlmModels");
const { CreateMatch } = require("../Schema_models/CreateMatches");

const lastFiveMatches = async (req, res) => {
  try {
    const { id } = req.params;

    // ================= MR =================
    const mr = await Mr.findById(id);

    if (mr) {
      // 🔥 Sort latest 5 matches
      const lastMatches = mr.mrscoreEachMatch
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // 🔥 Attach match result (winner)
      const matchesWithResult = await Promise.all(
        lastMatches.map(async (m) => {
          const matchData = await CreateMatch.findById(m.matchId);

          let winner = "Pending";
          let loser = "Pending";
          let date = null;
          let teamAScore = 0;
          let teamBScore = 0;

          if (matchData?.MatchResult) {
            let resultObj;

            if (Array.isArray(matchData.MatchResult)) {
              resultObj =
                matchData.MatchResult[matchData.MatchResult.length - 1];
            } else {
              resultObj = matchData.MatchResult;
            }

            if (resultObj) {
              winner = resultObj.Result || "Pending";
              date = resultObj.date || null;
              teamAScore = resultObj.teamAScore || 0;
              teamBScore = resultObj.teamBScore || 0;

              // ✅ FIND LOSER
              if (winner !== "Pending") {
                if (winner === matchData.teamA) {
                  loser = matchData.teamB;
                } else if (winner === matchData.teamB) {
                  loser = matchData.teamA;
                }
              }
            }
          }

          return {
            matchId: m.matchId,
            teamA: matchData?.teamA || null,
            teamAScore,
            teamB: matchData?.teamB || null,
            teamBScore,

            winner,
            loser, // ✅ NEW FIELD

            date,
            Startdate: matchData?.startDate || null,
            EndDate: matchData?.endDate || null,

            runs: m.stats?.runs || 0,
            sixes: m.stats?.sixes || 0,
            fours: m.stats?.fours || 0,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        role: "MR",
        player: {
          MRID: mr.MRID,
          MRName: mr.MRName,
          TeamName: mr.TeamName,
        },
        last5Matches: matchesWithResult,
      });
    }

    // ================= FLM =================
    const flm = await Flm.findById(id).populate("Mr");

    if (flm) {
      let MatchMap = new Map();

      // 🔥 collect UNIQUE matches
      flm.Mr.forEach((mr) => {
        mr.mrscoreEachMatch?.forEach((m) => {
          if (m?.matchId) {
            MatchMap.set(m.matchId.toString(), m);
          }
        });
      });

      const lastMatches = Array.from(MatchMap.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const result = await Promise.all(
        lastMatches.map(async (m) => {
          const matchData = await CreateMatch.findById(m.matchId);

          let winner = "Pending";
          let loser = "Pending";
          let resultStatus = "Pending";
          let teamAScore = 0;
          let teamBScore = 0;

          if (matchData?.MatchResult) {
            let resultObj;

            if (Array.isArray(matchData.MatchResult)) {
              resultObj =
                matchData.MatchResult[matchData.MatchResult.length - 1];
            } else {
              resultObj = matchData.MatchResult;
            }

            if (resultObj) {
              winner = resultObj.Result || "Pending";
              teamAScore = resultObj.teamAScore || 0;
              teamBScore = resultObj.teamBScore || 0;

              if (winner !== "Pending") {
                if (winner === matchData.teamA) {
                  loser = matchData.teamB;
                } else {
                  loser = matchData.teamA;
                }

                resultStatus = "Completed";
              }
            }
          }

          return {
            matchId: m.matchId,
            teamA: matchData?.teamA || null,
            teamAScore,
            teamB: matchData?.teamB || null,
            teamBScore,
            winner,
            loser,
            result: resultStatus,
            startDate: matchData?.startDate || null,
            endDate: matchData?.endDate || null,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        role: "FLM",
         player: {
          FLMID: flm.FLMID,
          FLMName: flm.FLMName,
          TeamName: flm.TeamName,
          FLMHq: flm.FLMHq,
          FLMZone: flm.FLMZone,
        },
        totalMatches: MatchMap.size,
        last5Matches: result,
      });
    }

    // ================= SLM =================
    const slm = await Slm.findById(id).populate({
      path: "flm",
      populate: { path: "Mr" },
    });

    if (slm) {
      let MatchMap = new Map(); // avoid the duplicate matches in this

      // collect unique matches in this

      slm.flm.forEach((flm) => {
        flm.Mr.forEach((mr) => {
          mr.mrscoreEachMatch.forEach((m) => {
            MatchMap.set(m.matchId.toString(), m);
          });
        });
      });

      // get last 5 matches
      const lastMatches = Array.from(MatchMap.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const result = await Promise.all(
        lastMatches.map(async (m) => {
          const matchData = await CreateMatch.findById(m.matchId);

          let winner = "Pending";
          let loser = "Pending";
          let resultStatus = "Pending";
          let teamAScore = 0;
          let teamBScore = 0;

          if (matchData?.MatchResult) {
            let resultObj;

            if (Array.isArray(matchData.MatchResult)) {
              resultObj =
                matchData.MatchResult[matchData.MatchResult.length - 1];
            } else {
              resultObj = matchData.MatchResult;
            }

            if (resultObj) {
              winner = resultObj.Result || "Pending";
              teamAScore = resultObj.teamAScore || 0;
              teamBScore = resultObj.teamBScore || 0;

              if (winner !== "Pending") {
                if (winner === matchData.teamA) {
                  loser = matchData.teamB;
                } else {
                  loser = matchData.teamA;
                }

                resultStatus = "Completed";
              }
            }
          }

          return {
            matchId: m.matchId,
            teamA: matchData?.teamA || null,
            teamAScore,
            teamB: matchData?.teamB || null,
            teamBScore,
            winner,
            loser,
            result: resultStatus,
            startDate: matchData?.startDate || null,
            endDate: matchData?.endDate || null,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        role: "SLM",
         player: {
          SLMID: slm.SLMID,
          SLMName: slm.SLMName,
          TeamName: slm.TeamName,
        },
        totalMatches: MatchMap.size, // total matches played
        last5Matches: result,
      });
    }


    // ================= TLM =================
    const tlm = await Tlm.findById(id).populate({
      path: "slm",
      populate: {
        path: "flm",
        populate: { path: "Mr" },
      },
    });

    if (tlm) {
      let MatchMap = new Map();

      // 🔥 collect UNIQUE matches
      tlm.slm.forEach((slmItem) => {
        slmItem.flm.forEach((flmItem) => {
          flmItem.Mr.forEach((mr) => {
            mr.mrscoreEachMatch?.forEach((m) => {
              if (m?.matchId) {
                MatchMap.set(m.matchId.toString(), m);
              }
            });
          });
        });
      });

      const lastMatches = Array.from(MatchMap.values())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      const result = await Promise.all(
        lastMatches.map(async (m) => {
          const matchData = await CreateMatch.findById(m.matchId);

          let winner = "Pending";
          let loser = "Pending";
          let resultStatus = "Pending";
          let teamAScore = 0;
          let teamBScore = 0;

          if (matchData?.MatchResult) {
            let resultObj;

            if (Array.isArray(matchData.MatchResult)) {
              resultObj =
                matchData.MatchResult[matchData.MatchResult.length - 1];
            } else {
              resultObj = matchData.MatchResult;
            }

            if (resultObj) {
              winner = resultObj.Result || "Pending";
              teamAScore = resultObj.teamAScore || 0;
              teamBScore = resultObj.teamBScore || 0;

              if (winner !== "Pending") {
                if (winner === matchData.teamA) {
                  loser = matchData.teamB;
                } else {
                  loser = matchData.teamA;
                }

                resultStatus = "Completed";
              }
            }
          }

          return {
            matchId: m.matchId,
            teamA: matchData?.teamA || null,
            teamAScore,
            teamB: matchData?.teamB || null,
            teamBScore,
            winner,
            loser,
            result: resultStatus,
            startDate: matchData?.startDate || null,
            endDate: matchData?.endDate || null,
          };
        }),
      );

      return res.status(200).json({
        success: true,
        role: "TLM",
         player: {
          TLMID: tlm.TLMID,
          TLMName: tlm.TLMName,
          TeamName: tlm.TeamName,
        },
        totalMatches: MatchMap.size,
        last5Matches: result,
      });
    }

    return res.status(404).json({
      success: false,
      message: "Profile not found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error is been occured in the server",
      error: error.message,
    });
  }
};

module.exports = { lastFiveMatches };
