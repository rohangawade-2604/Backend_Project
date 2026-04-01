const {Prescription} = require("../Schema_models/PrescriptionModel");
const {Mr} = require("../Schema_models/MrModels");
const {Slm} = require("../Schema_models/SlmModels");
const {Flm} = require("../Schema_models/FlmModels");
const {Tlm} = require("../Schema_models/TlmModels");
const mongoose = require("mongoose");


const getPrescription = async (req, res) => {
       
    try {
        const {id} = req.params;
        // const objectId = new mongoose.Types.ObjectId(id);

        let mrIds = [];
        let role = "";

        // check the TLM role

      const tlm = await Tlm.findById(id)

      if(tlm){
        role = "TLM";

        const slms = await Slm.find({ _id: { $in: tlm.slm }});
        const flmIds = slms.flatMap(slm => slm.flm);
        const flms = await Flm.find({ _id: { $in: flmIds}});
        mrIds = flms.flatMap(flm => flm.Mr);
      }

        // check the SLM role

        if(!mrIds.length){
            const slm = await Slm.findById(id);

            if(slm){
                role = "SLM";

                const flms = await Flm.find({ _id: { $in: slm.flm}});

                mrIds = flms.flatMap((f) => f.Mr);
            }
        }

        // check for FLM role 

        if(!mrIds.length){
            const flm = await Flm.findById(id);

            if(flm){
                role = "FLM";
                mrIds = flm.Mr;
            }
        }

        // if nothing found here 
        if(!mrIds.length){
            return res.status(404).json({
                success:false,
                message: "No MRs found here for this ID...!!!!"
            })
        }

    //  Get MRs + Prescription Details 

    const mrs = await Mr.find({ _id: { $in: mrIds}})
    .populate("uploadMatches");

    if(!mrs.length){
        return res.status(404).json({
            success: false,
            message: "No prescription found for this id",
        })
    }

        // format response we should get the prescription details 

        const result = mrs.map((mr) => ({
            mrId: mr._id,
            mrName: mr.MRName,
            role, // SLM, FLM, TLM
            Prescription: mr.uploadMatches, 
        }))

        return res.status(200).json({
            success: true,
            message: "Prescription details retrieved successfully",
            count: result.length,
            data: result
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error is been occured",
            error: error.message,
        })
    }
}

module.exports = {getPrescription};

