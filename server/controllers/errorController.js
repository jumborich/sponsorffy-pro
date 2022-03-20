const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]; //CONFIRM THIS WITH USERS COLLECTION
  const message = `Duplicate field value: ${value}. Use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((errElem) => errElem.message);

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = () => new AppError('Token expired. Please log in again!', 401);

const sendErrorDev = (err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    isOperational: err.isOperational,
    stack: err.stack,
  });
};
const sendErrorProd = (err, req, res, next) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't send error details to client
  } else {

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res, next);
  } else if (process.env.NODE_ENV === 'production') {

    let errorObj = err;

    // HANDLING INVALID DATABASE IDs PASSED AS PARAM ID
    if(err.name && err.name === 'CastError'){
      errorObj = handleCastErrorDB(errorObj);
    }

    // HANDLING DUPLICATE FIELDS GETTING PASSED TO THE DATABASE
    if(err.code && err.code === 11000){
      errorObj = handleDuplicateFieldsDB(errorObj);
    }

    // HANDLING FIELD VALIDATION ERROR BEFORE GETTING PASSED TO THE DATABASE
    if(err.name && err.name === 'ValidationError'){
      errorObj = handleValidationErrorDB(errorObj);
    }

    // HANDLING ERROR DUE TO INVALID JSONWEBTOKEN
    if(err.name && err.name === 'JsonWebTokenError'){
      errorObj = handleJWTError();
    }

    // HANDLING ERRORS DUE TO EXPIRED JWT
    if(err.name && err.name === 'TokenExpiredError'){
      errorObj = handleTokenExpiredError();
    }

    sendErrorProd(errorObj, req, res, next);
  }
};