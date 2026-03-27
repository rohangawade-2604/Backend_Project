const {Mr} = require("../Schema_models/MrModels");
const {CreateMatch} = require("../Schema_models/CreateMatches");
const { v4:uuid } = require("uuid");


const createTournamentMatches = async(req, res) => {
    try {
        const {startDate, endDate, creatorId, creatorRole} = req.body;

        // Here we got all TeamName 
        const team = await Mr.distinct("TeamName");

        if(team.length < 2){
            return res.status(400).json({
                message: "Not Enough Teams available for here"
            })
        } 

        let matches = [];

        // just loop betweeen the teams 
        for(let i=0; i<team.length; i++){
            for(let j=i+1; j<team.length; j++){

                const teamA = team[i];
                const teamB = team[j];

                // Get Players of both teams together 
                const playerA = await Mr.find({ TeamName: teamA });
                const playerB = await Mr.find({ TeamName: teamB });

                // Make 1 vs 1 pairs of each team
                const minPlayers = Math.min(playerA.length, playerB.length); 

                let roomPlayer = [];
                let roomPlayerA = [];
                let roomPlayerB = [];

                // just push the values inside it 
                for(let k=0; k < minPlayers; k++){
                    roomPlayer.push(playerA[k]._id)
                    roomPlayer.push(playerB[k]._id)

                    roomPlayerA.push(playerA[k]._id)
                    roomPlayerB.push(playerB[k]._id)
                }


                // now create the matches here 
                const match = await CreateMatch.create({
                    creatorId,
                    creatorRole,
                    teamA,
                    teamB,
                    startDate,
                    endDate,
                    roomId: uuid(),
                    roomPlayer,
                    roomPlayerA,
                    roomPlayerB,
                    DateofCreation: new Date().toISOString().split("T")[0]
                })

                matches.push(match);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Matches created Successfully ",
            totalMatches: matches.length,
            matches,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error is been occured",
            error: error.message
        });
    }
}

module.exports = { createTournamentMatches };