const express = require("express");
const router = express.Router();

const profile = require("../../Folders/Middleware/profile")


const {updateProfileController} = require("../Controller/profileupdate");


router.put("/upload-profile/:id", profile.single("profile_pic"), updateProfileController )



module.exports = router