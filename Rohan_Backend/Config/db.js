require("dotenv").config();
const mongoose = require("mongoose");

const Connections = mongoose.connect(process.env.MONGO_URL);

module.exports = {Connections}