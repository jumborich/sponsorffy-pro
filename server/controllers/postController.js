const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { canContest, updateBalance} = require("../utils/verify");
const handlerFactory = require('./handlerFactory');
// const uploadToCloudinary = require("../utils/cloudinaryConfig")
const { copyFromTemp } = require("../utils/awsConfig");

const getPost = handlerFactory.getOne(postModel,{path:'upvotes',model:'Upvote'});

const queryHelper = (query) => {
  const initQuery =  query.sort("-createdAt").limit(5) //Should change this to 15 or as needed

  return initQuery.populate([{path:"upvotes", select:"voterId"}, {path:"creatorId", select:"username photo"}]).lean();
  // return initQuery.populate({path:'upvotes',model:'Upvote', select:'voterId'}).lean();
};

// Gets Posts for feed screens
const getAllPosts = catchAsync(async (req, res, next)=>{
  try{
    let doc; //stores query result
    let filterOBJ ={};
    // let {category,nextCursor,creatorId} = req.query;
    let {nextCursor,creatorId} = req.query;

    // Checking if request for post is from feed
    // if(category){

    //   if(nextCursor){
    //     // filterOBJ = {category, _id:{$lt:nextCursor}}
    //     filterOBJ = { _id:{$lt:nextCursor} }
    //   }else{
    //     filterOBJ = {category}
    //   }
    // }

    // Checking if request for post is from user's profile
    if(creatorId){
      // Building filter object
      if(nextCursor){
        filterOBJ = {creatorId, _id:{$lt:nextCursor}}
      }else{
        filterOBJ = {creatorId}
      }

    }else{
      if(nextCursor) filterOBJ = { _id:{$lt:nextCursor} }
    }

    // Execute the query
    const initQuery =  postModel.find(filterOBJ);
    doc = await queryHelper(initQuery);

    res.status(200).json({ status: 'success',  posts: doc });  
  }
  catch(error){
    next(error);
  };
})

const createPost = catchAsync(async(req, res, next)=>{
  try{

    // 0) Check if this user has enough coin balance
    canContest(req, next);

    // 1) Get media_id from req body
    const media_id  = req.body?.media_id
    if(!media_id) return next(new AppError("Invalid or no media_id", 400))

    const {_id:creatorId, countryFrom, countryTo} = req.user; //
    req.body = {...req.body, creatorId, countryFrom, countryTo};
    const ORDER = req.body.ORDER || "" //Used for tracking video transcoding phase

    // 2) Build Post body to contain only allowed fields
    let filteredBody = {};
    const reqBody = Object.keys(req.body);
    const allowedFields = ["title", "fileType", "creatorId", "category", "subCategory", "countryTo", "countryFrom"];
    if(reqBody?.length){
      for(let i = 0; i < reqBody.length; i++){
        const key = reqBody[i];

        if(allowedFields.includes(key)){
          filteredBody[key] = req.body[key];
        }
      }
    };

    // 3. Copy media(video or img) from temp folder to permanent folder in S3
    if(req.body?.fileType === "image"){
      fileName = await copyFromTemp(media_id.image, req.body.fileType, next);

      filteredBody["fileUrl"] = process.env.IMG_BASE_URL + fileName;

    }else{
      const filenames = {poster_name:media_id.image, video_name:media_id.video};

      const {derivedUrls ,fileUrl} = await copyFromTemp(filenames, req.body?.fileType, next);

      filteredBody["poster"] = process.env.IMG_BASE_URL + media_id.image; //url = imgix + video thumbnail

      // 4. Upload video file to cloudinary
      // const {fileUrl, derivedUrls} = await uploadToCloudinary(filenames.video_name, next);
      filteredBody = {...filteredBody, fileUrl, derivedUrls};
    }

    // 5) Save new post to database
    const post = await postModel.create(filteredBody);

    // 6) Update user's coin balance and isContestant status
    await userModel.findByIdAndUpdate(req.user._id, {coins:updateBalance(req), isContestant:true});

    res.status(201).json({status:"success", post, media_id:media_id.video, ORDER});  
  }
  catch(error){
    next(new AppError(error));
  }
});

const uploadMedia = catchAsync(async (req, res, next)=>{
  try{

    // If final phase of video compression
    if(req.ORDER && req.ORDER === "FINAL") return res.status(204).json(req.media_id)

    res.status(200).json(req.media_id)
  }
  catch(error){
    next(error)
  }
});

module.exports = { getAllPosts, getPost, createPost, uploadMedia };