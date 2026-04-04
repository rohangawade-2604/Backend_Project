const mongoose = require("mongoose");
const {Schema} = mongoose;

const LiveUserSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },

    Username : {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true
    },

    status: {
        type: Boolean,
        default: true,        
    },
})

const LiveUser = mongoose.model("liveUser", LiveUserSchema);
module.exports = {LiveUser}

