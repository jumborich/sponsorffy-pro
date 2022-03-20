const upvoteModel = require('../models/upvoteModel');
const postModel = require('../models/postModel');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createUpvote = catchAsync(async (req, res, next) =>{
  try{
    // check if this user is a contestant
    if(!req.user.isContestant) return next(new AppError(
      "Only contestants can vote and earn points! To be, make an upload or take test.",
      401
    ));
    
    const postId = req.params.postId;    
    const voterId = req.user._id; //get current season here
    const {creatorId, category, createdAt,countryTo, countryFrom} = await postModel.findById(postId).lean();

    // ensure post owner can't vote for themselves
    if(creatorId.toString() === voterId.toString()) return next(new AppError("Sorry, you can't vote for yourself!", 400));

    await upvoteModel.create({
      postCreatorId:creatorId,
      postCategory:category,
      postCreatedAt:createdAt,
      countryFrom,
      countryTo,
      // season, Should include season
      voterId,
      postId
    });
    res.status(201).json({ statusText:"success" })
  }
  catch(error){
    if(error.code === 11000){
      return next(new AppError("Sorry, double voting is not allowed!", 400));
    }
    next(error)
  }

});

module.exports = { createUpvote };