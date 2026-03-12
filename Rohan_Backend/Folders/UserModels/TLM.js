const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ----------- TLM ----------- */
const TLMSchema = new Schema(
{
  TLMID: String,
  TLMName: String,
  TLMPassword: Number,
  TLMHq: String,
  TLMZone: String,
  slm: [{
    type: Schema.Types.ObjectId,
    ref: "Slms"
  }]
},
);

/* ----------- SLM ----------- */
const SLMSchema = new Schema(
{
  SLMID: String,
  SLMName: String,
  SLMPassword: Number,
  SLMHq: String,
  SLMZone: String,
  flm: [{
    type: Schema.Types.ObjectId,
    ref: "Flms"
  }]
},
);

/* ----------- FLM ----------- */
const FLMSchema = new Schema(
{
  FLMID: String,
  FLMName: String,
  FLMPassword: Number,
  FLMHq: String,
  FLMZone: String,
  FLMRegion: String,
  Mr: [{
    type: Schema.Types.ObjectId,
    ref: "Mrs"
  }]
},
);

/* ----------- MR ----------- */
const MRSchema = new Schema({
  MRID: String,
  MRName: String,
  MRPassword: Number,
  MRHq: String,
  MRZone: String,
});

/* ----------- Models ----------- */
const Tlm = mongoose.model("Tlms", TLMSchema);
const Slm = mongoose.model("Slms", SLMSchema);
const Flm = mongoose.model("Flms", FLMSchema);
const Mr = mongoose.model("Mrs", MRSchema);

module.exports = { Tlm, Slm, Flm, Mr };