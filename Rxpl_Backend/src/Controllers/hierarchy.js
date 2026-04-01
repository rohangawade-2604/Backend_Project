const XLSX = require("xlsx");
const fs = require("fs");

const { Tlm } = require("../Schema_models/TlmModels");
const { Flm } = require("../Schema_models/FlmModels");
const { Slm } = require("../Schema_models/SlmModels");
const { Mr } = require("../Schema_models/MrModels");

const uploadHierarchyExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Excel file required",
      });
    }

    const workbook = XLSX.readFile(req.file.path);
    console.log("Uploaded file", req.file);

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return res.status(400).json({
        error: "No sheet available here",
      });
    }

    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    // console.log(data, "we got the data here ");

    for (let row of data) {
      let mrExists = await Mr.findOne({ MRID: row.MRID });

      if (!mrExists) {
        mrExists = await Mr.create({
          MRID: row.MRID,
          MRName: row.MRName,
          MRPassword: row.MRPassword,
          MRHq: row.MRHq,
          MRZone: row.MRZone,
          TeamName: row.MRTeamName,
          BussinessUnit: "CORZA",
        });
      }

      // -------FLM-----------

      let flm = await Flm.findOne({ FLMID: row.FLMID });

      if (!flm) {
        flm = await Flm.create({
          FLMID: row.FLMID,
          FLMName: row.FLMName,
          FLMPassword: row.FLMPassword,
          FLMHq: row.FLMHq,
          TeamName: row.MRTeamName,
          BussinessUnit: "CORZA",
          Mr: [mrExists._id],
        });
      }

    
      if (!flm.Mr.includes(mrExists._id)) {
        flm.Mr.push(mrExists._id);
        await flm.save();
      }

      // ----------SLM-------------

      let slm = await Slm.findOne({ SLMID: row.SLMID });

      if (!slm) {
        slm = await Slm.create({
          SLMID: row.SLMID,
          SLMName: row.SLMName,
          SLMPassword: row.SLMPassword,
          SLMHq: row.SLMHq,
          SLMZone: row.SLMZone,
          TeamName: row.MRTeamName,
          BussinessUnit: "CORZA",
          flm: [flm._id],
        });
      }

      if (!slm.flm.includes(flm._id)) {
        slm.flm.push(flm._id);
        await slm.save();
      }

    //  -------------- TLM ----------------------
      let tlm = await Tlm.findOne({ TLMID: row.TLMID });

      if (!tlm) {
        tlm = await Tlm.create({
          TLMID: row.TLMID,
          TLMName: row.TLMName,
          TLMPassword: row.TLMPassword,
          TLMHq: row.TLMHq,
          TLMZone: row.TLMZone,
          TeamName: row.MRTeamName,
          BussinessUnit: "CORZA",
          slm: [slm._id],
        });
      }

      if (!tlm.slm.includes(slm._id)) {
        tlm.slm.push(slm._id);
        await tlm.save();
      }
    }

    res.json({
      success: true,
      message: "Excel data uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      message: "server error is been occured",
    });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
  }
};

module.exports = { uploadHierarchyExcel };
