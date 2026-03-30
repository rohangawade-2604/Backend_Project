const mongoose = require("mongoose");
const {Schema} = mongoose;

const BrandSchema = new Schema({
    BrandName: String,
    Points: Number,
}, { collection: "Brands" });

const Brand = mongoose.model("Brand", BrandSchema);

module.exports = {Brand}