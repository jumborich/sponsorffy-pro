const leaderboard = require("../controllers/leaderBoardController");
const {Router} = require("express");
const router = Router()

router.get("/leaders", leaderboard.getLeaderboard)
router.get("/scoreboard", leaderboard.getScoreboard)

module.exports = router;