const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const sendEmail = require('../utils/email');
const modifyUser = require("../utils/modifyUser");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Code refactoring to avoid Repetitions
const createSendToken = (user,statusCode,res) =>{
  const token =  signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    user: modifyUser(user) 
  });
} 

const signup = catchAsync(async (req, res, next) => {
  const user = await userModel.create({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    countryFrom: req.body.countryFrom,
  });

  createSendToken(user,201,res);
});

const login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return next(new appError('Password and email are required', 400));
  }

  const user = await userModel.findOne({ email }).select('+password');

  const passwordsMatch = user && (await user.correctPassword(password, user.password));

  if (!user || !passwordsMatch) {
    return next(new appError('Incorrect email or password', 401));
  }

  createSendToken(user,200,res);
});

const logout = catchAsync(async (req, res, next) => {
  // Send a none verifiable cookie type syntax with a life span of 1ms
  res.cookie('jwt', "", { maxAge:1,httpOnly: true});
  res.status(200).json({
    status: 'success'
  });
})

// Allow user access to protected routes
const protect = catchAsync(async(req, res, next) => {

  const token = req.cookies.jwt || req.headers.cookie;
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, async(err, decodedToken)=>{
      if(err) return next(new appError("Error with jwt verification",401));

      // Check if user still exists
      const user = await userModel.findById(decodedToken.id);
      if(!user) return next(new appError('user does not exist', 401));
    
      // Grant Access To Protected Route
      req.user = user;
      next();
    });

  }
  else{
    next(new appError('Log in to gain access.', 401));
  }
});

const forgotPassword = catchAsync(async(req,res,next) => {

  // 1) Get user based on posted email 
  const user = await userModel.findOne({ email: req.body.email});
  if(!user) {
    return next(new appError('A user with that email email does not exist.', 404));
  }

  // 2) Generate the random token 
  const resetToken =  user.createPasswordResetToken()
  await user.save({validateBeforeSave:false});

  // 3) Send it to user's email address
 const resetURL =  `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

 const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

 try {

  await sendEmail({
    email:user.email,
    subject:'Your password reset token (valid for 5 mins).',
    message
  });
  
  res.status(200).json({
    status: 'success',
    message:'Token sent to email'
  })
 } catch (error) {
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;

   await user.save({validateBeforeSave:false});

   return next(new appError('There was an error sending the email.Try again later!',500))
 }


})
const resetPassword = catchAsync (async (req,res,next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await userModel.findOne({ passwordResetToken: hashedToken, passwordResetExpires:{$gt: Date.now()} });
  // 2) If token has not expired, and there is user, set the new password
  if(!user) {
    return next(new appError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password;
  // user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT

  createSendToken(user,200,res);
});

// This is used when the user is already logged in and just wants to change their password
const updatePassword = catchAsync(async(req, res, next) => {

  // 1) Get the user from the collection
    const user = await userModel.findById(req.user.id).select('+password');

    // 2) Check if the posted password is correct
    const correctPassword = await user.correctPassword(req.body.currentPassword, user.password)
    if(!correctPassword){
      return next(new appError('The current password is incorrect.', 401));
    }

    // 3) If correct, update password
    user.password = req.body.newPassword;
    await user.save();

  // 4) Log user in, send JWT
  createSendToken(user,200,res);
});

module.exports = {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout
};
