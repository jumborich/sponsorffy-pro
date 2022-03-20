const {Router} = require('express');
// const router = Router();
const router = Router({mergeParams:true});

const { createUpvote } = require('../controllers/upvoteController');

// router.get('/',getAllUpvotes)
router.post("/",createUpvote);

module.exports = router;
