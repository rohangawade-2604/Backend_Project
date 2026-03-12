const express = require("express");
const router = express.Router();
// const {upload} = require("../../Middleware/upload") 
const {upload} = require("../../Folders/Middleware/upload")
const {uploadHierarchyExcel} = require("../Controller/hierarchy")
// const { Mr } = require("../../UserModels/TLM");
const {Tlm} = require("../../Folders/UserModels/TLM")

router.post("/upload-excel", upload.single("file"), uploadHierarchyExcel);


router.get("/hierarchy", async (req, res) => {
  try {

    const data = await Tlm.find()
      .populate({
        path: "slms",
        populate: {
          path: "flms",
          populate: {
            path: "mrs"
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

