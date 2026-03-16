const {Tlm, Flm, Mr, Slm} = require("../../Folders/UserModels/TLM");

const fullhierarchy = async (req, res) => {

    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;
        const total = await Tlm.countDocuments();

        const data = await Tlm.find()
        .skip(skip)
        .limit(limit)
        .populate({
            path:"slm",
            populate:{
                path:"flm",
                populate:{
                    path:"Mr"
                }
            }
        })

        res.status(200).json({
            page,
            limit,
            totalRecords: total,
            totalPages: Math.ceil(total/limit),
            // role: "TLM",
            // count: data.length,
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
