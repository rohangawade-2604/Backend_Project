const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ----------- TLM ----------- */
const TLMSchema = new Schema({
  TLMID: String,
  TLMName: String,
  TLMPassword: Number,
  TLMHq: String,
  TLMZone: String,
  profile_pic: {
    type: String,
    default: null,
  },
  slm: [
    {
      type: Schema.Types.ObjectId,
      ref: "Slms",
    },
  ],
});

/* ----------- SLM ----------- */
const SLMSchema = new Schema({
  SLMID: String,
  SLMName: String,
  SLMPassword: Number,
  SLMHq: String,
  SLMZone: String,
  profile_pic: {
    type: String,
    default: null,
  },
  flm: [
    {
      type: Schema.Types.ObjectId,
      ref: "Flms",
    },
  ],
});

/* ----------- FLM ----------- */
const FLMSchema = new Schema({
  FLMID: String,
  FLMName: String,
  FLMPassword: Number,
  FLMHq: String,
  FLMZone: String,
  FLMRegion: String,
  profile_pic: {
    type: String,
    default: null,
  },
  Mr: [
    {
      type: Schema.Types.ObjectId,
      ref: "Mrs",
    },
  ],
});

/* ----------- MR ----------- */
const MRSchema = new Schema({
  MRID: String,
  MRName: String,
  MRPassword: Number,
  MRHq: String,
  MRZone: String,
  profile_pic: {
    type: String,
    default: null,
  },
});

/* ----------- Models ----------- */
const Tlm = mongoose.model("Tlms", TLMSchema);
const Slm = mongoose.model("Slms", SLMSchema);
const Flm = mongoose.model("Flms", FLMSchema);
const Mr = mongoose.model("Mrs", MRSchema);

module.exports = { Tlm, Slm, Flm, Mr };
