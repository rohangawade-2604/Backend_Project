const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // 1. Added mongoose import
const dns = require('dns');
const hierarchyRoute  = require("./Routes/hierarchyRoute")

dns.setServers(['8.8.8.8', '8.8.4.4']);


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", hierarchyRoute)


app.get("/", (req, res) => {
    res.send("Rohan runs in backend....");
    console.log("rohan runs in backend");
});


const PORT = process.env.PORT || 5950; 
app.listen(PORT, async () => {
    console.log(`Server is connected with ${PORT}`);
    
  
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            family: 4, 
        });
        console.log("Port is running on DB connected Successfully");
    } catch (error) {
        console.log("DB connection get failed");
        console.log(error, "error occurs");
    }
});