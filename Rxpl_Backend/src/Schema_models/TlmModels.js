const mongoose = require("mongoose");
const {Schema} = mongoose;


const TLMSchema = new Schema({
    TLMID: String,
    TLMName: String,
    TLMPassword: String,
    TLMHq: String,
    TLMZone: String,
    TeamName: String,
    BussinessUnit: String,

    slm:[
        {
            type:Schema.Types.ObjectId,
            ref: "Slms"
        }
    ]
})

//------------- Models --------------
const Tlm = mongoose.model("Tlms", TLMSchema);

module.exports = { Tlm };