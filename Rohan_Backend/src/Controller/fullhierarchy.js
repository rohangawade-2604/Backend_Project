const {Tlm, Flm, Mr, Slm} = require("../../Folders/UserModels/TLM");

const fullhierarchy = async (req, res) => {

    try {
        
        const data = await Tlm.find().populate({
            path:"slm",
            populate:{
                path:"flm",
                populate:{
                    path:"Mr"
                }
            }
        })

        res.status(200).json({
            role: "TLM",
            count: data.length,
            data
        })

    } catch (error) {
        res.status(500).json({
            message:"Server error is been occured",
            error: error.message
        })        
    }
}

module.exports = {fullhierarchy}
