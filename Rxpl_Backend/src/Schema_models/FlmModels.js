const mongoose = require("mongoose");
const {Schema} = mongoose;


const FLMSchema = new Schema({
    FLMID: String,
    FLMName: String,
    FLMPassword: String,
    FLMHq: String,
    FLMZone: String,
    FLMRegion: String,
    TeamName: String,
    BussinessUnit: String,

    Mr:[
        {
            type: Schema.Types.ObjectId,
            ref: "Mrs"
        }
    ]
})

const Flm = mongoose.model("Flms", FLMSchema);

module.exports = { Flm }