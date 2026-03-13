const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // 1. Added mongoose import
const dns = require('dns');

// routing the urls and pages 
const hierarchyRoute  = require("./src/Routes/hierarchyRoute")
const loginroutes = require("./src/Routes/loginroute")
const nestedhierarchyroutes = require("./src/Routes/nestedhierarchyroutes")

dns.setServers(['8.8.8.8', '8.8.4.4']);


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", hierarchyRoute)
app.use("/api", loginroutes)
app.use("/api", nestedhierarchyroutes)


app.get("/", (req, res) => {
    res.send("Rohan runs in backend....");
    console.log("rohan runs in backend");
});


const PORT = process.env.PORT || 5950; 
app.listen(PORT, async () => {
    console.log(`Ye Mera Saamsuung ka ${PORT} Number hai, is pe run kr`);
    
  
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            family: 4, 
        });
        console.log("Saat Crore..!!! ✅ ");
    } catch (error) {
        console.log("❌ Gadbad hogaya re Baba..!!!! ⚠️ ");
        console.log(error, "error occurs");
    }
});