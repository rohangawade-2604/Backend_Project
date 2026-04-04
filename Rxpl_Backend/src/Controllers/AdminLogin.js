const { Flm } = require("../Schema_models/FlmModels");
const { Slm } = require("../Schema_models/SlmModels");
const { Tlm } = require("../Schema_models/TlmModels");
const { Mr } = require("../Schema_models/MrModels");
const { LiveUser } = require("../Schema_models/UserLiveModel");
const AdminLogin = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        success: false,
        message: "Id and password is required",
      });
    }

    let user = null;
    let role = "";
    let Username = "";

    // ✅ Check TLM first
    user = await Tlm.findOne({ TLMID: id });
    if (user) {
      role = "TLM";
      Username = user.TLMName;
    }

    // ✅ Check SLM only if not found
    if (!user) {
      user = await Slm.findOne({ SLMID: id });
      if (user) {
        role = "SLM";
        Username = user.SLMName;
      }
    }

    // ✅ Check FLM only if still not found
    if (!user) {
      user = await Flm.findOne({ FLMID: id });
      if (user) {
        role = "FLM";
        Username = user.FLMName;
      }
    }

    if (!user) {
      user = await Mr.findOne({ MRID: id });
      if (user) {
        role = "MR";
        Username = user.MRName;
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found in this",
      });
    }

    const userpassword =
      user.TLMPassword ||
      user.SLMPassword ||
      user.FLMPassword ||
      user.MRPassword;

    if (userpassword !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Insert into the liveUsers collections
    await LiveUser.findOneAndUpdate(
      { userId: id },
      {
        userId: id,
        Username,
        role,
        status: true,
      },
      { upsert: true, new: true },
    );

      const allUsers = await LiveUser.find({});
      req.app.get("io").emit("liveUsers", allUsers);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      role,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error is been occured",
      error: error.message,
    });
  }
};

module.exports = { AdminLogin };
