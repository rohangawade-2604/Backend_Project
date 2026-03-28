const { Prescription } = require("../Schema_models/PrescriptionModel");
const { CreateMatch } = require("../Schema_models/CreateMatches");
const { Mr } = require("../Schema_models/MrModels");

const PrescriptionController = async (req, res) => {
  try {
    const { id } = req.params; // ✅ MR ID

    const { DrName, DrNumber, SccCode, NoOfPrescription } = req.body;

    // ✅ validation
    if (!DrName || !DrNumber || !SccCode || !NoOfPrescription) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (!/^\d{4,5}$/.test(SccCode)) {
      return res.status(400).json({
        success: false,
        message: "SCC code must be 4-5 digits",
      });
    }

    const files = req.files;

    if (Number(NoOfPrescription) !== 2) {
      return res.status(400).json({
        success: false,
        message: "Upload exactly 2 prescriptions",
      });
    }

    if (!files || files.length !== 2) {
      return res.status(400).json({
        message: "Upload exactly 2 images",
      });
    }

    // ✅ 1. Find MR
    const mr = await Mr.findById(id);

    if (!mr) {
      return res.status(404).json({
        success: false,
        message: "MR not found",
      });
    }

    // ✅ 2. Get roomId from MR
    const roomId = mr.roomId;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "MR has no roomId",
      });
    }

    // ✅ 3. Find Match using roomId
    const match = await CreateMatch.findOne({ roomId });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    // ✅ 4. Check ACTIVE match
    const convert = (d) => {
      const [day, month, year] = d.split("-");
      return new Date(year, month - 1, day);
    };

    const today = new Date();
    const start = convert(match.startDate);
    const end = convert(match.endDate);

    if (!(today >= start && today <= end)) {
      return res.status(400).json({
        success: false,
        message: "Match is not active",
      });
    }

    // ✅ 5. Create Prescription
    const prescription = files.map((file) => ({
      image: file.path,
    }));

    const savedPrescription = await Prescription.create({
      DrName,
      DrNumber,
      SccCode,
      NoOfPrescription,
      prescription,
    });

    // ✅ 6. Push into SAME MR
    await Mr.findByIdAndUpdate(
      id, // MR _id from params
      {
        $push: { uploadMatches: savedPrescription._id },
      },
      { new: true },
    );

    // ✅ fetch FULL MR with prescription
    const updatedMR = await Mr.findById(id).populate("uploadMatches");

    return res.status(200).json({
      success: true,
      message: "Prescription uploaded & linked to MR",
      data: savedPrescription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { PrescriptionController };
