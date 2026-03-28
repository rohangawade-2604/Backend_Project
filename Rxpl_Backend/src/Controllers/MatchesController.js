const XLSX = require("xlsx");
const fs = require("fs");
const { Mr } = require("../Schema_models/MrModels");
const { Slm } = require("../Schema_models/SlmModels");
const { CreateMatch } = require("../Schema_models/CreateMatches");
const { v4: uuid } = require("uuid");
// const {Mr} = require("../Schema_models/MrModels")
// const { threadName } = require("worker_threads");

const createMatchFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Excel file required",
      });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    function excelDateToFormattedDate(serial) {
      const excelStartDate = new Date(1900, 0, 1);
      const jsDate = new Date(
        excelStartDate.getTime() + (serial - 2) * 86400000,
      );

      const day = String(jsDate.getDate()).padStart(2, "0");
      const month = String(jsDate.getMonth() + 1).padStart(2, "0");
      const year = jsDate.getFullYear();

      return `${day}-${month}-${year}`;
    }

    let results = [];

    for (let row of data) {
      const { challengeStartDate, challengeEndDate, playerAId, playerBId } =
        row;

      const startDate =
        typeof challengeStartDate === "number"
          ? excelDateToFormattedDate(challengeStartDate)
          : challengeStartDate;

      const endDate =
        typeof challengeEndDate === "number"
          ? excelDateToFormattedDate(challengeEndDate)
          : challengeEndDate;

      //   Find the players here

      const playerA = await Slm.findOne({ SLMID: String(playerAId) });
      const playerB = await Slm.findOne({ SLMID: String(playerBId) });

      //   const playerA = await Mr.findOne({
      //     MRID: { $in: [playerAId, String(playerAId)] },
      //   });

      //   const playerB = await Mr.findOne({
      //     MRID: { $in: [playerBId, String(playerBId)] },
      //   });

      if (!playerA || !playerB) {
        console.log("Player not found:", row);
        continue;
      }

      // Get the team Names
      const teamA = playerA.TeamName;
      const teamB = playerB.TeamName;

      //   Get all players from both teams
      const teamAPlayers = await Mr.find({ TeamName: teamA });
      const teamBPlayers = await Mr.find({ TeamName: teamB });

      //   Extract IDs
      const teamsAId = teamAPlayers.map((p) => p._id);
      const teamsBId = teamBPlayers.map((p) => p._id);

      // 5️⃣ Create roomPlayers (FULL teams)
      const roomPlayers = [...teamsAId, ...teamsBId];

      const roomId = uuid();

      // Create the matches between them

      const match = await CreateMatch.create({
        teamA,
        teamB,
        startDate,
        endDate,
        roomPlayers, // FULL players
        roomPlayersA: teamsAId,
        roomPlayersB: teamsBId,
        roomId,
        DateofCreation: new Date().toISOString().split("T")[0],
      });

      // only push the required value here in response
      results.push({
        teamA,
        teamB,
        startDate,
        endDate,
        roomPlayers,
        roomPlayersA: teamsAId.length,
        roomPlayersB: teamsBId.length,
        roomId,
        DateofCreation: new Date().toISOString().split("T")[0],
      });
    }

    // // ✅ Match Status Logic here 

    // const today = new Date();


    // // convert "DD-MM-YYYY" → Date
    // const convert = (d) => {
    //   const [day, month, year] = d.split("-");
    //   return new Date(year, month-1, day);
    // }

    // let activeMRs = [];

    // // use results OR fetch from DB
    // const allMatches = await CreateMatch.find();

    // allMatches.forEach((match) => {
    //   const start = convert(match.startDate);
    //   const end = convert(match.endDate);

    //   if(today >= start && today <= end){
    //     activeMRs.push(...match.roomPlayers);
    //   }
    // });

    // // remove duplicates 
    // activeMRs = [...new Set(activeMRs)];

    // // ✅ make active → true
    // await Mr.updateMany(
    //   { _id: {$in: activeMRs} },
    //   { isMatchOn: true }
    // )

    // // ✅ make others → false
    // await Mr.updateMany(
    //   { _id: {$nin: activeMRs} },
    //   { isMatchOn: false }
    // )

    return res.status(200).json({
      success: true,
      message: "Matches created Successfully",
      data: results,
    });

    console.log(data, "here the data comes");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error is been occured",
      error: error.message,
    });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
  }
};

module.exports = { createMatchFromExcel };
