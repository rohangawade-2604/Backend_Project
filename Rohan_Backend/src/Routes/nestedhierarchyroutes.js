const express = require("express")
const router = express.Router()

const {Tlm} = require("../../Folders/UserModels/TLM")

router.get("/hierarchy", async (req, res) => {
  try {

    const data = await Tlm.find()
      .populate({
        path: "slm",
        populate: {
          path: "flm",
          populate: {
            path: "Mr"
          }
        }
      });

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router