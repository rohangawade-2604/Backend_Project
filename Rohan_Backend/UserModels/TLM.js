const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ----------- TLM ----------- */
const TLMSchema = new Schema({
  TLMID: String,
  TLMName: String,
  TLMPassword: Number,
  TLMHq: String,
  TLMZone: String
});

/* ----------- SLM ----------- */
const SLMSchema = new Schema({
  SLMID: String,
  SLMName: String,
  SLMPassword: Number,
  SLMHq: String,
  SLMZone: String,
  tlm: {
    type: Schema.Types.ObjectId,
    ref: "Tlms"
  }
});

/* ----------- FLM ----------- */
const FLMSchema = new Schema({
  FLMID: String,
  FLMName: String,
  FLMPassword: Number,
  FLMHq: String,
  FLMZone: String,
  FLMRegion: String,
  slm: {
    type: Schema.Types.ObjectId,
    ref: "Slms"
  }
});

/* ----------- MR ----------- */
const MRSchema = new Schema({
  MRID: String,
  MRName: String,
  MRPassword: Number,
  MRHq: String,
  MRZone: String,
  flm: {
    type: Schema.Types.ObjectId,
    ref: "Flms"
  }
});

/* ----------- Models ----------- */
const Tlm = mongoose.model("Tlms", TLMSchema);
const Slm = mongoose.model("Slms", SLMSchema);
const Flm = mongoose.model("Flms", FLMSchema);
const Mr = mongoose.model("Mrs", MRSchema);

module.exports = { Tlm, Slm, Flm, Mr };