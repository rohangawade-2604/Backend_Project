// const { Prescription } = require("../Schema_models/PrescriptionModel");
// const { Mr } = require("../Schema_models/MrModels");

// const updatePrescriptionStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { Status } = req.body;

//     const cleanStatus = Status?.toLowerCase().trim();

//     if (!["approved", "rejected"].includes(cleanStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: "Status must be 'approved' or 'rejected'",
//       });
//     }

//     // ✅ Find Prescription
//     const prescriptiondata = await Prescription.findById(id);

//     if (!prescriptiondata) {
//       return res.status(404).json({
//         success: false,
//         message: "Prescription not found",
//       });
//     }

//     // // ✅ Prevent duplicate update
//     // const currentStatus =
//     //   prescriptiondata.Status?.toLowerCase() || prescriptiondata.status;

//     // if (currentStatus === cleanStatus) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: `Already ${cleanStatus}`,
//     //   });
//     // }

//     // ✅ Get MR
//     let mr = null;

//     // ✅ NEW DATA (with mrId)
//     if (prescriptiondata.mrId) {
//       mr = await Mr.findById(prescriptiondata.mrId);
//     }

//     // ✅ OLD DATA (fallback)
//     if (!mr) {
//       mr = await Mr.findOne({
//         uploadMatches: prescriptiondata._id,
//       });
//     }

//     if (!mr) {
//       return res.status(404).json({
//         success: false,
//         message: "MR not found",
//       });
//     }

//     const { points = 0, fours = 0, sixes = 0 } = prescriptiondata;

//     // 🔥 CASE 1: REJECT → subtract score
//     if (cleanStatus === "rejected") {
//       await Mr.findByIdAndUpdate(mr._id, {
//         $inc: {
//           TotalRuns: -points,
//           TotalFours: -fours,
//           TotalSixes: -sixes,
//         },
//       });
//     }

//     // 🔥 CASE 2: APPROVE AFTER REJECT → add back
//     if (cleanStatus === "approved" && currentStatus === "rejected") {
//       await Mr.findByIdAndUpdate(mr._id, {
//         $inc: {
//           TotalRuns: points,
//           TotalFours: fours,
//           TotalSixes: sixes,
//         },
//       });
//     }

//     // ✅ Update status
//     prescriptiondata.Status = cleanStatus;
//     await prescriptiondata.save();

//     return res.status(200).json({
//       success: true,
//       message: `Prescription ${cleanStatus} successfully`,
//       data: prescriptiondata,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// module.exports = { updatePrescriptionStatus };

const { Prescription } = require("../Schema_models/PrescriptionModel");
const { Mr } = require("../Schema_models/MrModels");
const { Brand } = require("../Schema_models/BrandModel");
const { CreateMatch } = require("../Schema_models/CreateMatches");

const updatePrescriptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;

    const cleanStatus = Status?.toLowerCase().trim();

    if (!["approved", "rejected"].includes(cleanStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved' or 'rejected'",
      });
    }

    // Step 1 - Find Prescription
    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found" });
    }

    // const currentStatus = prescription.Status?.toLowerCase();

    // if (currentStatus === cleanStatus) {
    //   return res.status(400).json({ success: false, message: `Already ${cleanStatus}` });
    // }

    // Step 2 - Find MR linked to this prescription
    const mr = await Mr.findOne({ uploadMatches: prescription._id });
    if (!mr) {
      return res.status(404).json({ success: false, message: "MR not found" });
    }

    // Step 3 - Find Brand from prescription and get points
    const brandData = await Brand.findOne({ BrandName: prescription.Brand });
    if (!brandData) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    const points = brandData.Points;

    // Step 4 - Calculate runs, fours, sixes same as prescription controller
    let runs = points;
    let fours = 0;
    let sixes = 0;

    if (points >= 6) {
      sixes = Math.floor(points / 6);
    } else if (points >= 4) {
      fours = Math.floor(points / 4);
    }

    // Step 5 - REJECT → deduct score from MR
    if (cleanStatus === "rejected") {
      // fetch FIRST before any update
      const updatedMr = await Mr.findById(mr._id);

      // deduct from MR total
      await Mr.findByIdAndUpdate(mr._id, {
        $inc: {
          TotalRuns: -runs,
          TotalFours: -fours,
          TotalSixes: -sixes,
        },
      });

      // deduct from mrscoreEachMatch
      for (const matchScore of updatedMr.mrscoreEachMatch) {
        await Mr.updateOne(
          { _id: mr._id, "mrscoreEachMatch.matchId": matchScore.matchId },
          {
            $inc: {
              "mrscoreEachMatch.$.stats.runs": -runs,
              "mrscoreEachMatch.$.stats.fours": -fours,
              "mrscoreEachMatch.$.stats.sixes": -sixes,
            },
          },
        );

        // deduct from match team score
        const match = await CreateMatch.findById(matchScore.matchId);
        if (match) {
          const isTeamA = match.roomPlayersA.some(
            (playerId) => playerId.toString() === mr._id.toString(),
          );
          const isTeamB = match.roomPlayersB.some(
            (playerId) => playerId.toString() === mr._id.toString(),
          );

          if (isTeamA) {
            await CreateMatch.findByIdAndUpdate(match._id, {
              $inc: { "MatchResult.0.teamAScore": -runs },
            });
          } else if (isTeamB) {
            await CreateMatch.findByIdAndUpdate(match._id, {
              $inc: { "MatchResult.0.teamBScore": -runs },
            });
          }
        }
      }
    }

    // Step 6 - APPROVE AFTER REJECT → add score back
    if (cleanStatus === "approved" && currentStatus === "rejected") {
      // add back to MR total
      await Mr.findByIdAndUpdate(mr._id, {
        $inc: {
          TotalRuns: runs,
          TotalFours: fours,
          TotalSixes: sixes,
        },
      });

      // add back to match score
      const match = await CreateMatch.findOne({ roomId: mr.roomId });
      console.log("mr.roomId", mr.roomId);
      console.log("match found", match);
      if (match) {
        await Mr.updateOne(
          { _id: mr._id, "mrscoreEachMatch.matchId": match._id },
          {
            $inc: {
              "mrscoreEachMatch.$.stats.runs": runs,
              "mrscoreEachMatch.$.stats.fours": fours,
              "mrscoreEachMatch.$.stats.sixes": sixes,
            },
          },
        );
      }
    }

    // Step 7 - Update prescription status
    prescription.Status = cleanStatus;
    await prescription.save();

    return res.status(200).json({
      success: true,
      message: `Prescription ${cleanStatus} successfully`,
      data: prescription,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { updatePrescriptionStatus };
// ```

// **The flow is now:**
// ```
// Prescription → Brand name → Brand points → Calculate runs/fours/sixes → Deduct from MR
