const { Tlm, Slm, Flm, Mr } = require("../../Folders/UserModels/TLM");

const nestedhierarchy = async (req, res) => {
  try {
    const { id } = req.params;
    let data = null;
    let role = "";

    data = await Tlm.findById(id).populate({
      path: "slm",
      populate: {
        path: "flm",
        populate: {
          path: "Mr",
        },
      },
    });

    // main logic concept work for params

    //--------- if TLM object id get here
    if (data) {
      role = "TLM";
      return res.json({ role, data });
    }
    // check for the slm
    data = await Slm.findById(id).populate({
      path: "flm",
      populate: {
        path: "Mr",
      },
    });

    //--------- if SLM object id get here
    if (data) {
      role = "SLM";
      return res.json({ role, data });
    }
    // check for the FLM
    data = await Flm.findById(id).populate("Mr");

    //--------- if FLM object id get here
    if (data) {
      role = "FLM";
      return res.json({ role, data });
    }
    // check for the MR
    data = await Mr.findById(id);

    //--------- if Mr object id get here
    if (data) {
      role = "MR";
      return res.json({ role, data });
    }

    res.status(404).json({ message: "ID not founded" });

    res.json({
      success: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {nestedhierarchy}