const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const dns = require('dns');

const hierarchyRoute = require("./src/Routes/hierarchyRoutes")
const MatchesRoutes  = require("./src/Routes/MatchesRoutes")

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
app.use("/api", hierarchyRoute);
app.use("/api", MatchesRoutes);



app.get("/", (req, res) => {
    res.send("Rng run in backend");
    console.log("rng run in backend");
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
    console.log(`Player ${PORT} , Eliminated .!!!! `);

    try{
        await mongoose.connect(process.env.MONGO_URL, {
            family: 4
        })
        console.log("Ye le port chalu kr diya tera...");
        
    }
    catch(error){
        console.log("Kuch to Gadbad kiya tuneee !!!");
        console.log("Error aayenga , error aayenga reee...!!!");
    } 
})