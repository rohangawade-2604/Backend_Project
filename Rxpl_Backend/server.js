const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");



dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());



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
        console.log("Error aayenge , error aayenge reee...!!!");
    }
    
})