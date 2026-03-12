const {LoginModule} = require("../../Folders/UserModels/login")

const {Flm, Mr, Slm, Tlm} = require("../../Folders/UserModels/TLM")


const loginUser = async (req, res) =>{
    try {
        
        const {id, password} = req.body;

        if(!id || !password) {
            return res.send.status(400).json({
                success: false,
                message: "Username and Password required"
            })
        }

        // ---------------For TLM users------------

        let user = await Tlm.findOne({ TLMID: id });

        if(user && user.TLMPassword == password){
            return res.json({
                success: true,
                role: "TLM",
                data: user
            });
        }

         // ---------------For SLM users------------

         user = await Slm.findOne({ SLMID: id });

         if(user && user.SLMPassword == password){
            return res.json({
                success: true,
                role: "SLM",
                data: user
            });
         }

          // ---------------For FLM users------------

         user = await Flm.findOne({ FLMID: id })
            
            if(user && user.FLMPassword){
                return res.json({
                    success: true,
                    role: "FLM",
                    data: user
                });
         }

          // ---------------For Mr users------------

          user = await Mr.findOne({ MRID: id })

          if(user && user.MRPassword) {
            return res.json({
                success: true,
                role: "MR",
                data: user
            })
          }


          return res.status(401).json({
            success:false,
            message: "Invalid ID or Password"
          });

    } catch (error) {
        
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = { loginUser }