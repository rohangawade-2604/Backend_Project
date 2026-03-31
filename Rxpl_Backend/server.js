const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const dns = require('dns');
const http = require("http");
const { Server } = require("socket.io")
require("./src/Cron/Matchescron");

const hierarchyRoute = require("./src/Routes/hierarchyRoutes");
const MatchesRoutes  = require("./src/Routes/MatchesRoutes");
const PrescriptionRoutes = require("./src/Routes/PrescriptionRoutes");

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
const app = express();

// create HTTP Server 
const server = http.createServer(app);

// attach socket.io to the server 

const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

// make io globally acccesable 
app.set("io", io);

// socket connections 
io.on("connection", (socket) => {
    console.log("Client connections is being successfully", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });
})

app.use(cors());
app.use(express.json());
app.use("/api", hierarchyRoute);
app.use("/api", MatchesRoutes);
app.use("/api", PrescriptionRoutes);



app.get("/", (req, res) => {
    res.send("Rng run in backend");
    console.log("rng run in backend");
})


const PORT = process.env.PORT || 5000;

server.listen(PORT, async() => {
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