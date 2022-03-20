const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const modifyUser = require('../utils/modifyUser');
const { copyFromTemp } = require("../utils/awsConfig");

const filterObj = (body, ...allowedFields) => {
  const newObj = {};
  Object.keys(body).forEach(elem => {
    if(allowedFields.includes(elem)) {
      newObj[elem] = body[elem];
    
    }
  });

  return newObj;
};

// Get user (profile)
const getMe = catchAsync(async(req,res,next) =>{
  try{
    res.status(200).json({
      status: "success",
      user:modifyUser(req.user)
    })
  }
  catch(error){
    next()
  }

})
 
const updateMe = catchAsync(async(req, res, next) =>{
  try{
    // 1) Filter unwanted field names from the request body not allowed to be modified:Can only update username,phone,email,country and photo fields....
    const filteredBody = filterObj(req.body, 'username','email','countryFrom','countryTo','phone');

    // 2. Copy image from temp folder to permanent folder in S3
    const media_id = req.body?.media_id;
    if(media_id){
      try{
        filteredBody.photo = await copyFromTemp(media_id);
      }catch(error){
        next(new AppError("Error with post media. Pls try again.", 400))
      }
    };

    // If user removed avatar for the default
    if(req.body?.defaultAvatar) filteredBody.photo = process.env.DEFAULT_AVATAR_URL;

    // 3) Update user object
    const updatedUser = await userModel.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators:true});

    res.status(200).json({ status: 'success', user: modifyUser(updatedUser)});
  }
  catch(error){
    next(error);
  }
});

// THIS IS THE ONLY ROUTE AVAILABLE TO ALL USERS ON DELETE REQUEST
const deleteMe = catchAsync(async (req, res,next) => {
  // This deactivates the user from the user collection
  await userModel.findByIdAndUpdate(req.user.id, {active:false});

  // This deactivates the user's posts from the posts collection
  res.status(204).json({
    status: 'success',
    data:null
  })
});


// A func that Checks for available coins and precedes the endpoints: getNewTest, CreateNewTest, and CreatePost
const checkCoins = (req, next)=>{

  let { coins, id } =  req.user;
  if(coins < 5) return next(new AppError("Insufficient coins. Please load up your coin balance", 401));

  // Subtract amount of coins needed for this category
  coins -=  5;

  // Update users' available coins
  return userModel.findByIdAndUpdate(id, { coins });
}

module.exports = { updateMe, deleteMe, getMe, checkCoins };
