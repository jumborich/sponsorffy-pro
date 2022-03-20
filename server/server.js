const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');
const server = http.createServer(app);

const port = process.env.PORT || 3001;

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception!');
  console.log(err.name, err.message);
  process.exit(1);
});

//Connecting database url with mongoose
// const DB = process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);

mongoose.connect(process.env.DB_URL,{
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useFindAndModify: false, 
  useUnifiedTopology: true
})
.then((result) =>server.listen(port))
.catch((err) => console.log("DB connection ERR: ", err));

// UNHANDLED ASYNC EXCEPTIONS
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});


// For use in leaderboard controller
module.exports = server;