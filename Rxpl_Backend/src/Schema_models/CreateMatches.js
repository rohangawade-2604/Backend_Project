const mongoose = require("mongoose");
const { Schema } = mongoose;

const MatchSchema = new Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  creatorRole: {
    type: String,
  },

  teamA: String,
  teamB: String,

  startDate: String,
  endDate: String,

  roomId: {
    type: String,
  },

  isTournament: {
    type: Boolean,
    default: true,
  },

  roomPlayers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mr",
    },
  ],

  roomPlayersA: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mr",
    },
  ],
  roomPlayersB: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mr",
    },
  ],

  membersAccepted: [],
  MatchResult: [
    {
      teamA: {
        type: String
      },

      teamAScore: {
          type: Number,
          default: 0,
      },

      teamB: {
        type: String
      },

      teamBScore: {
        type: Number,
        default: 0,
      },

      Result: {
        type: String,
        default: null,
      }
    }
  ],

  DateofCreation: {
    type: String,
  },
});

const CreateMatch = mongoose.model("Match", MatchSchema);

module.exports = { CreateMatch };
