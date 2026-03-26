const mongoose = require("mongoose");
const {Schema} = mongoose;

const SLMSchema = new Schema({
    SLMID: String,
    SLMName: String,
    SLMPassword: String,
    SLMHq: String,
    SLMZone: String,
    TeamName: String,
    BussinessUnit: String,

    flm:[
        {
            type:Schema.Types.ObjectId,
            ref: "Flms",
        }
    ]
})

const Slm = mongoose.model("Slms", SLMSchema);

module.exports = { Slm }