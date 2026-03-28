// const mongoose = require("mongoose");
// const {Schema} = mongoose

// const PrescriptionSchema = new Schema({
//     DrName: {
//         type: String,
//         required: true
//     },

//     DrNumber: {
//         type: String,
//         required: true
//     },

//     SccCode: {
//         type: String,
//         required: true,
//         match: [/^\d{4,5}$/, "SCC Code must be 4-5 digits"]
//     },

//     NoOfPrescription: {
//         type: Number,
//         required: true,
//         enum: [2]
//     },

//     Prescription: [
//         {
//             image: {
//                 type: String,
//                 required: true
//             }
//         }
//     ]
// }, {timestamps: true});

// const Prescription = mongoose.model("prescriptions", PrescriptionSchema);

// module.exports = { Prescription }

const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  DrName: String,
  DrNumber: String,
  SccCode: String,
  NoOfPrescription: Number,
  prescription: [
    {
      image: String
    }
  ]
}, { timestamps: true });

// ⚠️ THIS NAME MUST MATCH 'ref'
const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = { Prescription };