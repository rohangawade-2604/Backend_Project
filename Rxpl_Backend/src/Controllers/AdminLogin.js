const { Flm } = require("../Schema_models/FlmModels");
const { Slm } = require("../Schema_models/SlmModels");
const { Tlm } = require("../Schema_models/TlmModels");
const { Mr } = require("../Schema_models/MrModels");

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

    // ✅ Check TLM first
    user = await Tlm.findOne({ TLMID: id });
    if (user) {
      role = "TLM";
    }

    // ✅ Check SLM only if not found
    if (!user) {
      user = await Slm.findOne({ SLMID: id });
      if (user) {
        role = "SLM";
      }
    }

    // ✅ Check FLM only if still not found
    if (!user) {
      user = await Flm.findOne({ FLMID: id });
      if (user) {
        role = "FLM";
      }
    }

    if(!user) {
        user = await Mr.findOne({ MRID: id});
        if(user){
            role = "MR"
        }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found in this",
      });
    }

    const userpassword =
      user.TLMPassword || user.SLMPassword || user.FLMPassword || user.MRPassword;

    if (userpassword !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

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
