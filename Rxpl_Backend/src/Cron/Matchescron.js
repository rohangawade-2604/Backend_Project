const cron = require("node-cron");
const { Mr } = require("../Schema_models/MrModels");
const { CreateMatch } = require("../Schema_models/CreateMatches");

const convert = (d) => {
  const [day, month, year] = d.split("-");
  return new Date(year, month - 1, day);
};

cron.schedule("*/1 * * * *", async () => {
  console.log("Running cron...");

  const today = new Date();
  let activeMRs = [];

  const matches = await CreateMatch.find();

  for (let match of matches) {   // ✅ FIXED
    const start = convert(match.startDate);
    const end = convert(match.endDate);

    if (today >= start && today <= end && match.roomPlayers) {

      activeMRs.push(...match.roomPlayers);

      // ✅ assign roomId + true
      await Mr.updateMany(
        { _id: { $in: match.roomPlayers } },
        {
          isMatchOn: true,
          roomId: match.roomId
        }
      );
    }
  }

  // remove duplicates
  activeMRs = [...new Set(activeMRs)];

  // ❌ reset others
  await Mr.updateMany(
    { _id: { $nin: activeMRs } },
    {
      isMatchOn: false,
      roomId: null
    }
  );

  console.log("Match status updated successfully");
});