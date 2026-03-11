const express = require("express");
const router = express.Router();
const {upload} = require("../Middleware/upload")
const {uploadHierarchyExcel} = require("../Controller/hierarchy")
const { Mr } = require("../UserModels/TLM");

router.post("/upload-excel", upload.single("file"), uploadHierarchyExcel);


router.get("/hierarchy", async (req, res) => {
  try {

    const data = await Mr.find()
      .populate({
        path: "flm",
        populate: {
          path: "slm",
          populate: {
            path: "tlm"
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

