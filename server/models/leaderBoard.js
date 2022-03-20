const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    countryFrom:{
        type:String,
        default:"nigeria",
        required:true
    },
    countryTo:{
        type:String,
        default:"canada",
        required:true
    },
    leaders:mongoose.Schema.Types.Array,
    season:String // F-2021, W-2021
},
{
    timestamps:true
}
);

const leaderboard = mongoose.model("leaderboard", leaderboardSchema)

module.exports = leaderboard;

// leaders: An array of objects
// leaderItem: {userId,overallRank, categoryRank, points, categoryName}