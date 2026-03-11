const XLSX = require("xlsx");
const fs = require("fs");

const { Tlm, Slm, Flm, Mr } = require("../UserModels/TLM");

const uploadHierarchyExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Excel file required" });
    }

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return res.status(400).json({ error: "No sheet found in Excel file" });
    }

    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (let row of data) {
      //------- TLM -------------//
      let tlm = await Tlm.findOne({ TLMID: row.TLMID });

      if (!tlm) {
        tlm = await Tlm.create({
          TLMID: row.TLMID,
          TLMName: row.TLMNAME,
          TLMPassword: row.TLMPASSWORD,
          TLMHq: row.TLMHQ,
          TLMZone: row.TLMZONE,
        });
      }

      //------- SLM -------------//

      let slm = await Slm.findOne({ SLMID: row.SLMID });

      if (!slm) {
        slm = await Slm.create({
          SLMID: row.SLMID,
          SLMName: row.SLMNAME,
          SLMPassword: row.SLMPASSWORD,
          SLMHq: row.SLMHQ,
          SLMZone: row.SLMZONE,
          tlm: tlm._id,
        });
      }

      /* ---------- FLM ---------- */

      let flm = await Flm.findOne({ FLMID: row.FLMID });

      if (!flm) {
        flm = await Flm.create({
          FLMID: row.FLMID,
          FLMName: row.FLMNAME,
          FLMPassword: row.FLMPASSWORD,
          FLMHq: row.FLMHQ,
          FLMZone: row.FLMZONE,
          FLMRegion: row.FLMREGION,
          slm: slm._id,
        });
      }

      /* ---------- MR ---------- */

      const mrExists = await Mr.findOne({ MRID: row.MRID });

      if (!mrExists) {
        await Mr.create({
          MRID: row.MRID,
          MRName: row.MRNAME,
          MRPassword: row.MRPASSWORD,
          MRHq: row.MRHQ,
          MRZone: row.MRZONE,
          flm: flm._id,
        });
      }
    }

    res.json({
      success: true,
      message: "Excel data uploaded Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
  }
};

module.exports = { uploadHierarchyExcel };
