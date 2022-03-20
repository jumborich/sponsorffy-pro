const userModel = require("../models/userModel");
const testModel = require('../models/testModel');
const questionModel = require('../models/sponsorfy/questionModel');
const solutionModel = require('../models/sponsorfy/solutionModel');
const AppError = require('../utils/appError');
const { canContest, updateBalance} = require("../utils/verify");
const { getDuration, getTimeToComplete } = require('../utils/getDuration');
const uuid = require('uuid').v4;
const catchAsync = require('../utils/catchAsync');
const uploadMedia= require('../utils/handleMedia');
const uploadTestMedia = uploadMedia.testUploads().array("audioBlob") //uploads to server for processing before AWS
const uploadBlobHelper = require('../utils/uploadBlobHelper');//Uploads audio to amazonaws
const{ markSpeaking, useMarker } = require("../utils/markTestHelpers");

const getTestsHelper =(initQuery)=>{
  return initQuery
  .sort("-createdAt")
  .limit(5) //Should change this to 15 or as needed
  .select("-reading_ans -writing_ans -listening_ans -speaking_ans -testId -candidateId -creatorId")//removes these fields from the doc
  .lean();
}

// Used for getting all tests taken by user for their profile
const getAllTests = catchAsync(async(req, res, next)=>{
  try{
    let initQuery; //Holds initial Query
    const {creatorId, nextCursor} =req.query;
  
    // Adding reqType property for conditional Query execution in TestModel
    testModel.schema.statics.reqType ="profile";
  
    // Build query
    if(nextCursor){
      initQuery  = testModel.find({creatorId, _id:{$lt:nextCursor}});
    } else {
      initQuery = testModel.find({creatorId});
    }
    
    const tests = await getTestsHelper(initQuery); //applies further query item
  
    // Delete the reqType property initially added to schema
    delete testModel.schema.statics.reqType;
  
    res.status(200).json({
      tests,
      status: "success"
    });
  }catch(error) {

    next(error);
  }

});

// This will create a new user tests that will later be populated with users solutions and grade after submission
const createUserOwnTest =(req, test, candidateId) =>{
  const { _id:creatorId, countryTo, countryFrom } = req.user;

  const { _id:testId, testMode, version} = test;

  return testModel.create({ testId, testMode, version, candidateId, creatorId, countryTo, countryFrom });
};

// // This will create a new user tests that will later be populated with users solutions and grade after submission
// const createNewTest = catchAsync(async (req, res, next) =>{
//   try{
//     const { testId, testMode, version, candidateId, creatorId, countryTo, countryFrom } = req.body;

//     const test = await testModel.create({ testId, testMode, version, candidateId, creatorId, countryTo, countryFrom });

//     res.status(201).json({ test });
//   } 
//   catch(error){
//     console.log(error);
//     next(error);
//   }
// })

// This is for an active test session that has been created by the user
const getUserSavedAns = catchAsync(async (req, res, next)=>{
  try{
    const{testId,creatorId,candidateId} = req.query;
    const test = await testModel
    .findOne({testId,creatorId,candidateId})
    .select(" reading_ans writing_ans listening_ans speaking_ans ")
    .lean();

    res.status(200).json({ test })
  }
  catch(error){
    next(error)
  }
})

// This is for the user to get a new test to take...
const getNewTest = catchAsync(async(req, res, next) =>{

  // 1) Checks if the test _id is passed in params in cases of page refresh from user
  try{
    const { testId = "", testMode = ""} = req.query;

    if(testId && req.user.testSession.testId){ //"617662c3bbd805bc3b23cc17"
      const test =  await questionModel.findById(testId).lean();
      
      if(!test) return next(new AppError("Network Error",503));

      res.status(200).json({ test });
    }
    else{

      // Check user's coin balance
      if(testMode === "contest") canContest(req, next)

      const VERSIONS = { practice:["A","B"], contest:["X","Y","Z"] }; //Increase this upon addition of more versions

      if(testMode !== "contest" && testMode !== "practice") return next(new AppError("The mode of test is required!",400));

      // 1) Get users previous tests and create a new VERSIONS array excluding those test they previously took
      // The query options should also include the season since versions remain const across varying seasons
      // const previousTests = await testModel.find({creatorId:req.user._id, testMode}).select(["version"]).lean();

      // let unUsedVersions = [];
      // if(previousTests.length){
      //   const testVersionsTaken = previousTests.map((test) => test?.version?.toLowerCase());
      //   unUsedVersions = VERSIONS[testMode].filter(version=>!testVersionsTaken.includes(version?.toLowerCase()));
      // }

      // // 2) Randomize the remaining test by versions and pick a version
      // const getRandomVersion = (versionCount) =>Math.floor(Math.random() * versionCount);

      // response variables
      let test, candidateId, duration_Millis;

      // **************** DO THIS CHECK IN PRODUCTION ****************
      // if(unUsedVersions.length){
      //   const versionCount = unUsedVersions.length;
      //   const selectedVersion = unUsedVersions[getRandomVersion(versionCount)];
      //   test = await questionModel.find({version:selectedVersion});
      //   candidateId = uuid();
      //   error = null;
      // }
      // else{
      //   /** Below should be sent back in production
      //    * test:[], candidate:"", error:"Exhausted all versions"
      //    */
      // }
      // if(!unUsedVersions.length) unUsedVersions = VERSIONS[testMode] //DON'T USE IN PRODUCTION

      // const versionCount = unUsedVersions.length;
      // const selectedVersion = unUsedVersions[getRandomVersion(versionCount)];

      // test = await questionModel.findOne({version:selectedVersion, testMode}).lean(); //add season to options OBJ
      test = await questionModel.findOne({_id:"617662c3bbd805bc3b23cc17", version:"A", testMode}).lean(); //add season to options OBJ
      const { _id:testId, version, duration, totalPoints } = test;
      candidateId = uuid();
      duration_Millis = getDuration(duration) //Time in millisecs

      // Create new ownUserTest
      const { _id: userOwnTestId } = await createUserOwnTest(req, test, candidateId);

      // 4) update user's testSession
      const testSession = {testId, version, duration, duration_Millis, candidateId, totalPoints, userOwnTestId};

      // Check and assign user a contestant status, update coins
      let { coins, isContestant } = req.user;
      if(testMode === "contest"){
        isContestant = true;
        coins = updateBalance(req);
      }

      // Update user with testSession,coins,isContestant,etc
      await userModel.findByIdAndUpdate(req.user._id,{testSession, isContestant, coins});

      // 5) Send response to the user
      res.status(200).json({ test, candidateId, duration, duration_Millis })
    };
      
  }
  catch(error){
    next(error) 
  }
});

const markTest = catchAsync(async (req, res, next) =>{ //JANUARY:19TH-22ND,2021
  try{
    const{ version, testId, candidateId } = req.body;

    const{recentScore,duration,duration_Millis} = req.user.testSession;

    const timeToComplete = getTimeToComplete(duration, duration_Millis);

    // calculate user time to complete here

    let[ to_Be_Marked, marking_scheme] = await Promise.all([
      
      testModel.findOne({version,testId,candidateId}).lean(),// 1)Get the user's test to be marked 

      solutionModel.findOne({version,testId}).lean(), //Get the solutions to the test from the testSolnModel

      // Makes sure user's testSession is cleared and updated
      userModel.findByIdAndUpdate(req.user._id, {"testSession":{recentScore}})
    ]);

    if(to_Be_Marked && marking_scheme){

      // 1) MARK READING COMPONENT OF TEST 
      to_Be_Marked = await useMarker("Reading", to_Be_Marked, marking_scheme)

      // 2) MARK WRITING COMPONENT OF TEST
      to_Be_Marked = await useMarker("Writing" , to_Be_Marked, marking_scheme);

      // 3) MARK LISTENING COMPONENT OF TEST
      to_Be_Marked = await useMarker("Listening", to_Be_Marked, marking_scheme);

      // 4) MARK SPEAKING COMPONENT OF TEST
      markSpeaking(to_Be_Marked, marking_scheme)
      .then((markedTest) =>updateAcademiaPoints(res,next,markedTest,candidateId,timeToComplete))
      .catch(() => updateAcademiaPoints(res,next,to_Be_Marked,candidateId,timeToComplete));
    };    
  } 
  catch(error){
    console.log(error);
    next(new AppError("Internal server error", 500));
  }
});

// Updates academia points,rates, details after a user's test get marked
const updateAcademiaPoints = async( res, next, markedTest, candidateId, timeToComplete)=>{
  try{
    // Get test velocity/rate of the currently marked test
    const testRate = markedTest.totalAnswered / timeToComplete; // Q/mins

    let USER_UPDATES;

    const removeItems = "-reading_ans -writing_ans -listening_ans -speaking_ans -id -testId -candidateId -creatorId";

    if(markedTest.testMode === "contest"){
      // Get all tests previously taken by this user
      const prevTests = await testModel.find({creatorId:markedTest.creatorId, testMode:"contest"})
      .select(["total_score","testRate","candidateId"]).lean();

      // Get Running sum of all the test taken
      const total_Tests_Taken = prevTests.length;

      // Get running sum of the total score  && velocity  of all tests taken by user
      let sumTotalScore = 0;
      let sumTotalRate = 0;

      prevTests.forEach(test =>{
        if(test.candidateId === candidateId) test.testRate = testRate;

        sumTotalScore = sumTotalScore + test.total_score;
        sumTotalRate = sumTotalRate + test.testRate;
      })

      // 4. Get Average test rate
      let avgAcademiaRate = sumTotalRate / total_Tests_Taken;

      let avgAcademiaPoints = sumTotalScore / total_Tests_Taken
      
      // 5. Update the user's details (Points, rate, and testSession) in the Database
      USER_UPDATES ={
        "points.academia"   : avgAcademiaPoints,
        "rates.academia"    : avgAcademiaRate,
        "points.total.tests": avgAcademiaPoints,
        "testSession"       :{recentScore: markedTest.total_score}
      };
    };

    if(markedTest.testMode === "practice"){

      USER_UPDATES = {"testSession":{recentScore: markedTest.total_score}}
    };

    const[ gradedTest ] = await Promise.all([

      testModel.findByIdAndUpdate(markedTest._id, {timeToComplete,testRate}, {new:true}).select(removeItems),
      
      userModel.findByIdAndUpdate(markedTest.creatorId, USER_UPDATES)
    ])

    res.status(200).json({ status:"success", gradedTest});

  }catch(error){
    next(new AppError("Marking network Error", 500))
  }
}

/** saves user's ans in db
 * where type = reading_ans, writing_ans or listening_ans
 * and task = task_1 or task_2
 */
const updateTest= catchAsync(async(req, res, next)=>{
  try{
    const{ userOwnTestId, type, task, answers} = req.body
    
    if(type !== "speaking_ans"){
      // For all test types but SPEAKING
      await testModel.findByIdAndUpdate(userOwnTestId, {[`${type}.${task}`] : answers});
      const test = await testModel.findById(userOwnTestId);
      
      res.status(200).json({status: 'success'});

    }else{
      // For SPEAKING test type
      uploadBlob(req, res, next)
    }
  }
  catch(error){
    console.log(error);
    next(new AppError("Error updating test", 500))
  }
});

// For Test Type SPEAKING
const uploadBlob = catchAsync(async(req, res, next)=>{
  try{
    const{ userOwnTestId, task} = req.body

    const answers = JSON.parse(req.body.answers);

    // Check if multer middleware received any audioBlobs in files
    if(req.files.length){
      uploadBlobHelper(task,answers,userOwnTestId,req,res);

    }else{
      // Update Db incase text answers were sent
      await testModel.findByIdAndUpdate(userOwnTestId, {[`speaking_ans.${task}`]: answers});

      res.status(200).json({status:"success"});
    }
  }catch(error){
    console.log(error);
    next(error)
  };
});

module.exports={ getAllTests, getNewTest, getUserSavedAns, markTest, updateTest, uploadTestMedia};