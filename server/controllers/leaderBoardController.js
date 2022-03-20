const leaderBoardModel = require("../models/leaderBoard");
const userModel = require("../models/userModel");
const startRanking = require("../utils/rankUsers") //Ranks all users and creates winners
const catchAsync = require('../utils/catchAsync');
const socket = require("socket.io");
// TimeStamp: FEB 9TH - FEB 26TH

//Time to end/start of season
let end =new Date('Oct 31, 2021').getTime();
let start =new Date('Jan 20, 2022').getTime();
let BoardType="score"; //score || leader
let countDownTo = end;   //end || start


exports.getScoreboard = catchAsync(async(req, res)=>{
  try{
    const {ranks,points}=await userModel
    .findOne(req.query)
    .select(["points", "ranks"])
    .lean();   

    const boardData={
      ranks,
      points:{
        entertainment:points.entertainment,
        academia:points.academia,
        handwork:points.handwork,
        sports:points.sports 
      }
    }

    res.status(200).json({
      status:"success",
      boardData
    })
  } 
  catch(error){
    res.status(400).json({
      status:"Data Not found",
      boardData:{}
    })
  }
})

exports.getLeaderboard= catchAsync(async(req, res)=>{
  try{
    let{countryTo,countryFrom,category,page}=req.query

    const{leaders} = await leaderBoardModel
    .findOne({countryTo,countryFrom,category})
    .select(["leaders"])
    .lean();

    let fewLeaders=paginateLeaders(leaders,page);
    res.status(200).json({
      status:"success",
      leaders:fewLeaders,
      category,
      totalData:leaders.length
    })
  }
  catch(error){
    res.status(400).json({
      status:"Data Not found",
      leaders:[]
    })
  }
})
// startRanking()
//Wait for server availability before executing
setTimeout(() => {
  //1) Setup socket with the server
  const server = require("../server");
  let io = socket(server,{
    cors: {
      origin:[process.env.ORIGIN,"http://localhost:5000"], //Client url
    }
  })

  //2) Start socket events
  io.on("connection",(socket)=>{ 

    /**
     * Recalculate and rank all contestants on the app 
     * at 2MINS intervals
     * Optional  Params: countries(To & From), ListCount
     * setInterval(() =>{ startRanking() },120000);
     */

    /**
     * Send user the boardType and its corresponding data
     * boardTypes = score and leader
     */

    const emitChangeBoardType =()=>{
      socket.emit("changeBoard",{BoardType,countDownTo},(err)=>{
        if(err) return;
        console.log("Success");
      });
    }

    // Should run on intervals based on rank calc.
    emitChangeBoardType();

    // Runs when a user refreshes board page
    socket.on("getBoardType", () =>{
      emitChangeBoardType()
    })
  })
},.001);

const paginateLeaders = (leaders,pageNumber) =>{
  const page = pageNumber * 1;
  const limit = 10; //Can vary how we like
  const skip = (page - 1) * limit;
  const newLeaders = [];

  for(let i = 0; i < leaders.length; i++){
    if(newLeaders.length < limit){
      if((i + 1) > skip) newLeaders.push(leaders[i]);
    }
  }

  return newLeaders;
}