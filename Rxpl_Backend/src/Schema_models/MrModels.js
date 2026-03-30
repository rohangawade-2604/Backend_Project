const mongoose = require("mongoose");
const { Schema } = mongoose;

const MRSchema = new Schema({
  MRID: String,
  MRName: String,
  MRPassword: String,
  MRHq: String,
  MRZone: String,
  TeamName: String,
  BussinessUnit: String,
  isMatchOn: {
    type: Boolean,
    default: false,
  },
  roomId: {
    type: String,
    ref: "CreateMatch",
    default: null,
  },
  uploadMatches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription", // 🔥 must match model name EXACTLY
    },
  ],
  TotalRuns: {
    type: Number,
    default: 0,
  },

  TotalSixes: {
    type: Number,
    default: 0,
  },

  TotalFours: {
    type: Number,
    default: 0,
  },
});

const Mr = mongoose.model("Mrs", MRSchema);

module.exports = { Mr };
