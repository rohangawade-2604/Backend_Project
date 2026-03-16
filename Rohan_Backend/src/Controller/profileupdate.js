const { Collection } = require("mongoose");
const {Flm, Mr, Slm, Tlm} = require("../../Folders/UserModels/TLM");


const updateProfileController = async (req, res) => {
    try {
        
        const {id} = req.params

        if(!req.file){
            return res.json({
                message: "Profile picture pahije lavdya..!!! "
            })
        }

        const profilePic = req.file.filename;

        const models = [Tlm, Slm, Flm, Mr];

        for(let model of models){
            const user = await model.findById(id);
            console.log(user, "we found data here");
            

            if(user){

                user.profile_pic = profilePic;
                await user.save();

                return res.status(200).json({
                    message: "Profile picture updated Successfully ",
                    Collection: model.modelName
                });
             }
        }

        return res.status(404).json({
            message: "User Gayab..!!!!"
        })

    } catch (error) {
        res.status(500).json({
            message: "Server Error hai bhaiii..!!!",
            error: error.message
        })
    }
}

module.exports = {updateProfileController}