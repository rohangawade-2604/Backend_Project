const express = require("express");
const dotenv = require("dotenv")
const {Connection} = require("./src/config/db")
const http = require("http")
const cors = require("cors");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Alla response..!!!");
    console.log("Got the response successfully");
})

const PORT = process.env.PORT || 0;

app.listen(PORT, async() => {
    console.log(`${PORT} access successfully`);

    await Connection.connect((error) => {
        if(error){
            console.log(" ❌ Error is been occured here ❌ ", error);
        }
        else{
            console.log(" ✅ Don't worry broo , its working here...!!!! ✅");
            
        }
    })
    
})