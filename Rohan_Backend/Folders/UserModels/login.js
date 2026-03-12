const mongoose = require("mongoose");

const Login = mongoose.Schema({
    UserID: String,
    password: String,
},
    {versionKey: false}
)

const LoginModule = mongoose.model("logins", Login)

module.exports = { LoginModule }

