const {LiveUser} = require("../Schema_models/UserLiveModel");

const AdminLogout = async(req, res) => {
    try {

        const {id} = req.body;
        
        if(!id){
            return res.status(400).json({
                success: false,
                message:"User id is required here"
            })
        }

        const liveUser = await LiveUser.findOne({ userId: id })
        
       

        if(!liveUser){
            return res.status(400).json({
                success: false,
                message: "User not found in the live Session",
            })
        }

        if(!liveUser.status){
            return res.status(404).json({
                success: false,
                message: "User is already logout",
            })
        }

        await LiveUser.findOneAndUpdate(
            {userId: id},
            {
                status: false,
            },
            {new: true}
        );

         const allUsers = await LiveUser.find({});
        req.app.get("io").emit("liveUsers", allUsers)

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error is been occured here",
            error: error.message
        })
    }
}

module.exports = {AdminLogout}