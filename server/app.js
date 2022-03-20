require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require("compression");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { protect } = require("./controllers/authController") 

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const authRouter = require('./routes/authRoutes')
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const testRouter = require('./routes/testRoutes');
const upvoteRouter = require('./routes/upvoteRoutes');
const tokenRouter = require('./routes/tokenRoutes');
const leaderBoardRouter = require('./routes/leaderBoardRoutes')

const app = express();

// Compress every response
app.use(compression()); 

// 1) GLOBAL MIDDLEWARES

// FOR ALLOWING CROSS-ORIGIN RESOURCE SHARING
let corsConfig = {
  origin: process.env.ORIGIN,
  methods: "GET,PATCH,POST,DELETE",
  credentials:true,
  preflightContinue: false,
  optionsSuccessStatus: 204, 
}

// corsConfig
app.use(cors(corsConfig));

// SET SECURITY HTTP HEADERS
app.use(helmet());

// LOGGING TO THE CONSOLE WHILE IN  DEVELOPMENT
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //Enables logging of the HTTP Verb method and the resource endpoint in the console
}

//LIMIT REQUESTS FROM THE SAME API ENDPOINT
const limiter = rateLimit({
  max:10000,   //This allows 10000 requests from the same IP address in .........
  windowMS: 60 * 60 * 1000,  //....in 1 hour
  message: 'Too many requests in 1 hour!'
});

app.use('/api',limiter);


// BODY PARSER: READIG DATA FROM THE BODY INTO REQ.BODY
app.use(express.urlencoded({extended:true, limit:"50mb"}))
app.use(express.json({ limit:"50mb" })); //This is a middleware that enables express parse the post request body

app.use(cookieParser());

// ------ Data sanitization against NoSQL query injection --------- e.g: email:{$gt:""}
app.use(mongoSanitize());

// ------ Data sanitization against XSS ------- e.g Attaching some HTML and Javascript code
app.use(xss());

// Should come before protected routes
app.use('/api/v1/auth', authRouter);

// Check if user is authenticated (protect below routes)
app.use(protect)

// ----- ROUTES -----
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/tests', testRouter);
app.use('/api/v1/upvotes', upvoteRouter);
app.use('/api/v1/tokens', tokenRouter);
app.use('/api/v1/leaderboard', leaderBoardRouter);

app.all('*', (req, res, next) => {
  const err = new AppError('Page not found', 404);

  next(err);
});

//GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
