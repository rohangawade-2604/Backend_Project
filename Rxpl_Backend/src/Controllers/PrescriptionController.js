const { Prescription } = require("../Schema_models/PrescriptionModel");
const { CreateMatch } = require("../Schema_models/CreateMatches");
const { Mr } = require("../Schema_models/MrModels");
const { Brand } = require("../Schema_models/BrandModel");

const PrescriptionController = async (req, res) => {
  const io = req.app.get("io"); // get io instance from app
  try {
    const { id } = req.params; // ✅ MR ID

    const { DrName, DrNumber, SccCode, NoOfPrescription, brand } = req.body;

    console.log(req.body, "here the fraction");

    // ✅ validation
    if (!DrName || !DrNumber || !SccCode || !NoOfPrescription || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (!/^\d{4,5}$/.test(SccCode)) {
      return res.status(400).json({
        success: false,
        message: "SCC code must be 4-5 digits",
      });
    }

    const files = req.files;

    if (Number(NoOfPrescription) !== 2) {
      return res.status(400).json({
        success: false,
        message: "Upload exactly 2 prescriptions",
      });
    }

    if (!files || files.length !== 2) {
      return res.status(400).json({
        message: "Upload exactly 2 images",
      });
    }

    // ✅ 1. Find MR
    const mr = await Mr.findById(id);

    if (!mr) {
      return res.status(404).json({
        success: false,
        message: "MR not found",
      });
    }

    // if(mr.uploadMatches && mr.uploadMatches.length > 0){
    //   return res.status(404).json({
    //     success:false,
    //     message: "Prescription already uploaded for this MR",
    //   });
    // }

    // ✅ 2. Get roomId from MR
    const roomId = mr.roomId;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "MR has no roomId",
      });
    }

    // ✅ 3. Find Match using roomId
    const match = await CreateMatch.findOne({ roomId });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    // ✅ 4. Check ACTIVE match
    const convert = (d) => {
      const [day, month, year] = d.split("-");
      return new Date(year, month - 1, day);
    };

    const today = new Date();
    const start = convert(match.startDate);
    const end = convert(match.endDate);

    if (!(today >= start && today <= end)) {
      return res.status(400).json({
        success: false,
        message: "Match is not active",
      });
    }

    // ✅ Find the Brand here to update the points

    const brandData = await Brand.findOne({
      BrandName: brand,
    });
    console.log(brandData, "here i got the data");

    if (!brandData) {
      return res.status(404).json({
        success: false,
        message: "Brand not found here",
      });
    }

    const points = brandData.Points; // here we get the points of the brand from the brand collections
    console.log(points, "here i got the points");

    // here the scoring logic begins
    let runs = points;
    let fours = 0;
    let sixes = 0;

    if (points >= 6) {
      sixes = Math.floor(points / 6);
    } else if (points >= 4) {
      fours = Math.floor(points / 4);
    }

    // GET MR stats for this match only here

    const playerStats = mr.mrscoreEachMatch.find(
      (m) => m.matchId.toString() === match._id.toString(),
    );

    if (playerStats) {
      await Mr.updateOne(
        {
          _id: id,
          "mrscoreEachMatch.matchId": match._id,
        },
        {
          $inc: {
            "mrscoreEachMatch.$.stats.runs": runs,
            "mrscoreEachMatch.$.stats.sixes": sixes,
            "mrscoreEachMatch.$.stats.fours": fours,
          },
        },
      );
    } else {
      await Mr.findByIdAndUpdate(id, {
        $push: {
          mrscoreEachMatch: {
            matchId: match._id,
            roomId: match.roomId,
            startDate: match.startDate,
            endDate: match.endDate,
            stats: {
              runs: runs,
              fours: fours,
              sixes: sixes,
            },
          },
        },
      });
    }

    // ✅ 7. 🔥 RECALCULATE TOTALS FROM MATCH DATA
    const updatedMr = await Mr.findById(id);

    const totalRuns = updatedMr.mrscoreEachMatch.reduce(
      (sum, m) => sum + (m.stats?.runs || 0),
      0,
    );

    const totalSixes = updatedMr.mrscoreEachMatch.reduce(
      (sum, m) => sum + (m.stats?.sixes || 0),
      0,
    );

    const totalFours = updatedMr.mrscoreEachMatch.reduce(
      (sum, m) => sum + (m.stats?.fours || 0),
      0,
    );

    await Mr.findByIdAndUpdate(id, {
      $set: {
        TotalRuns: totalRuns,
        TotalSixes: totalSixes,
        TotalFours: totalFours,
      },
    });

    // ✅ 5. Create Prescription
    const prescription = files.map((file) => ({
      image: file.filename,
    }));

    const savedPrescription = await Prescription.create({
      DrName,
      DrNumber,
      SccCode,
      NoOfPrescription,
      prescription,
      Brand: brand,
      status: "pending",
      // ✅ ADD THIS
      mrId: id, // ✅ save mrId
      points: runs, // ✅ save points
      fours: fours, // ✅ save fours
      sixes: sixes,
    });

 

    // ✅ 6. Push into SAME MR
    await Mr.findByIdAndUpdate(
      id, // MR _id from params
      {
        $push: { uploadMatches: savedPrescription._id },
      },
      { new: true },
    );

    // Calculate Team Result on the basis Of mr

    const teamAPlayers = await Mr.find({
      _id: { $in: match.roomPlayersA },
    });

    const teamBPlayers = await Mr.find({
      _id: { $in: match.roomPlayersB },
    });

    // Calculate Match Score and Start the new match with zero
    const teamAScore = teamAPlayers.reduce((sum, player) => {
      const matchStats = player.mrscoreEachMatch.find(
        (m) => m.matchId.toString() === match._id.toString(),
      );
      return sum + (matchStats?.stats?.runs || 0);
    }, 0);

    const teamBScore = teamBPlayers.reduce((sum, player) => {
      const matchStats = player.mrscoreEachMatch.find(
        (m) => m.matchId.toString() === match._id.toString(),
      );
      return sum + (matchStats?.stats?.runs || 0);
    }, 0);

    let result = "Draw";

    if (teamAScore > teamBScore) {
      result = match.teamA;
    } else if (teamBScore > teamAScore) {
      result = match.teamB;
    }

    // Now store the match result in the match collections

    await CreateMatch.findByIdAndUpdate(match._id, {
      $set: {
        MatchResult: {
          teamA: match.teamA,
          teamAScore: teamAScore,
          teamB: match.teamB,
          teamBScore: teamBScore,
          Result: result,
          date: new Date().toISOString().split("T")[0],
        },
      },
    });

    // ✅ fetch FULL MR with prescription
    const updatedMR = await Mr.findById(id).populate("uploadMatches");

    console.log("🔥 Emitting socket event...");
    // Add the socket io here
    io.emit("prescriptionAdded", {
      mrId: id,
      prescription: savedPrescription,
      matchResult: {
        teamA: match.teamA,
        teamAScore,
        teamB: match.teamB,
        teamBScore,
        Result: result,
        date: new Date().toISOString().split("T")[0],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Prescription uploaded & linked to MR",
      data: savedPrescription,
      matchResult: {
        teamA: match.teamA,
        teamAScore,
        teamB: match.teamB,
        teamBScore,
        Result: result,
        date: new Date().toISOString().split("T")[0],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { PrescriptionController };
