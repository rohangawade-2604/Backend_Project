const mongoose = require("mongoose");
const {Schema} = mongoose;


const MRSchema = new Schema({
    MRID: String,
    MRName: String,
    MRPassword: String,
    MRHq: String,
    MRZone: String,
    TeamName: String,
    BussinessUnit: String,jkds;ahf
})

const Mr = mongoose.model("Mrs", MRSchema);

module.exports = {Mr}