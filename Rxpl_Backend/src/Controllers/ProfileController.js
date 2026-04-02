const { Tlm } = require("../Schema_models/TlmModels");
const { Slm } = require("../Schema_models/SlmModels");
const { Flm } = require("../Schema_models/FlmModels");
const { Mr } = require("../Schema_models/MrModels");

const ProfileController = async (req, res) => {
  try {
    const { id } = req.params;

    let role = null;
    let totalRuns = 0;
    let totalSixes = 0;
    let totalFours = 0;

    // ================= MR =================
    const mr = await Mr.findById(id);

    if (mr) {
      role = "MR";

      const totalRuns = mr.mrscoreEachMatch.reduce(
        (sum, m) => sum + (m.stats?.runs || 0),
        0,
      );
      const totalSixes = mr.mrscoreEachMatch.reduce(
        (sum, m) => sum + (m.stats?.sixes || 0),
        0,
      );
      const totalFours = mr.mrscoreEachMatch.reduce(
        (sum, m) => sum + (m.stats?.fours || 0),
        0,
      );

      return res.status(200).json({
        success: true,
        role: "MR",
        data: mr,
        stats: {
          totalRuns,
          totalSixes,
          totalFours,
        },
      });
    }

    // ================= FLM =================
    const flm = await Flm.findById(id).populate("Mr"); // ✅ FIXED

    if (flm) {
      role = "FLM";

      const mrList = flm.Mr.map((mr) => {
        // ✅ FIXED
        totalRuns += mr.TotalRuns || 0;
        totalSixes += mr.TotalSixes || 0;
        totalFours += mr.TotalFours || 0;

        return {
          MRID: mr.MRID,
          MRName: mr.MRName,
          TotalRuns: mr.TotalRuns || 0,
          TotalSixes: mr.TotalSixes || 0,
          TotalFours: mr.TotalFours || 0,
        };
      });

      return res.status(200).json({
        success: true,
        role,
        // data: flm,
        flm: {
          _id: flm._id,
          FLMID: flm.FLMID,
          FLMName: flm.FLMName,
          FLMHq: flm.FLMHq,
          FLMZone: flm.FLMZone,
          TeamName: flm.TeamName,
          BussinessUnit: flm.BussinessUnit,
        },
        mrs: mrList, // ✅ NEW
        stats: { totalRuns, totalSixes, totalFours },
      });
    }

    // ================= SLM =================
    const slm = await Slm.findById(id).populate({
      path: "flm",
      populate: {
        path: "Mr", // ✅ FIXED
      },
    });

    if (slm) {
      role = "SLM";

      const mrList = [];

      slm.flm.forEach((flmItem) => {
        flmItem.Mr.forEach((mr) => {
          // ✅ FIXED
          totalRuns += mr.TotalRuns || 0;
          totalSixes += mr.TotalSixes || 0;
          totalFours += mr.TotalFours || 0;

          mrList.push({
            MRID: mr.MRID,
            MRName: mr.MRName,
            TotalRuns: mr.TotalRuns || 0,
            TotalSixes: mr.TotalSixes || 0,
            TotalFours: mr.TotalFours || 0,
          });
        });
      });

      return res.status(200).json({
        success: true,
        role,
        // data: slm,
        slm: {
          _id: slm._id,
          SLMID: slm.SLMID,
          SLMName: slm.SLMName,
          SLMHq: slm.SLMHq,
          SLMZone: slm.SLMZone,
          TeamName: slm.TeamName,
          BussinessUnit: slm.BussinessUnit,
        },
        mrs: mrList, // ✅ NEW
        stats: { totalRuns, totalSixes, totalFours },
      });
    }

    // ================= TLM =================
    const tlm = await Tlm.findById(id).populate({
      path: "slm",
      populate: {
        path: "flm",
        populate: {
          path: "Mr", // ✅ FIXED
        },
      },
    });

    if (tlm) {
      role = "TLM";

      const mrList = [];

      tlm.slm.forEach((slmItem) => {
        slmItem.flm.forEach((flmItem) => {
          flmItem.Mr.forEach((mr) => {
            // ✅ FIXED
            totalRuns += mr.TotalRuns || 0;
            totalSixes += mr.TotalSixes || 0;
            totalFours += mr.TotalFours || 0;

            mrList.push({
              MRID: mr.MRID,
              MRName: mr.MRName,
              TotalRuns: mr.TotalRuns || 0,
              TotalSixes: mr.TotalSixes || 0,
              TotalFours: mr.TotalFours || 0,
            });
          });
        });
      });

      return res.status(200).json({
        success: true,
        role,
        // data: tlm,
        Tlm: {
          _id: tlm._id,
          TLMID: tlm.TLMID,
          TLMName: tlm.TLMName,
          TLMHq: tlm.TLMHq,
          TLMZone: tlm.TLMZone,
          TeamName: tlm.TeamName,
          BussinessUnit: tlm.BussinessUnit,
        },
        mrs: mrList, // ✅ NEW
        stats: { totalRuns, totalSixes, totalFours },
      });
    }

    // ================= NOT FOUND =================
    return res.status(404).json({
      success: false,
      message: "Profile not found with given id",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error is been occured",
      error: error.message,
    });
  }
};

module.exports = { ProfileController };
