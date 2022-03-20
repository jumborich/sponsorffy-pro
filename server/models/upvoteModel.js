const mongoose = require('mongoose');
const postModel = require('./postModel');
const userModel = require('./userModel');

// 1:Many, Parent referencing
const upvoteSchema = new mongoose.Schema({
  voteCount:{
    type:Number,
    max:[4, "A voteCount can't exceed 4."],
    default:4
  },

  createdAt:{ 
    type:Date,
    default:Date.now
  },
  expired:{
    type:Boolean,
    default:false
  },
  postCategory:{
    type:String, 
    required:[true, 'An upvote document must have a post category.']
  },
  postCreatedAt:{
    type:Date,
    required:[true, 'An upvote document must have a post createdAt']
  },
  postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post',
    required: [true, 'An upvote document must have its parent post ID.']
  },
  voterId:{
    type:mongoose.Schema.Types.ObjectId,
    // ref:'User',
    required: [true, 'An upvote document must have the voter\'s ID']
  },
  postCreatorId:{
    type:mongoose.Schema.Types.ObjectId,
    validate:{
      validator: function(ownerId){
        return ownerId.toString() !== this.voterId.toString();
      },
      message: "Sorry, you can't vote for yourself!"
    },
    required:[true, "An upvote must have a post creator ID"]
  },
  countryFrom:{
    type:String,
    required:[true, "An upvote must have an origin country"]
  },
  countryTo:{
    type:String,
    required:[true, "An upvote must have a destination country"]
  },
  season:String
}
);

// The below compound index should ensure that a user cannot have duplicate upvote on a single post.
upvoteSchema.index({postId:1, voterId:1}, {unique:true});

upvoteSchema.pre(/^find/, function (next){
  this.find({expired:{$ne:true}});
  next();
});

// Compute time difference between two given timestamps
const getTimeDifference =(timestamp,timeUnit)=>{
  const now = Date.now();
  const timeDiffMillSecs = now - new Date(timestamp); //milliseconds
  if(timeUnit ==="minutes")return timeDiffMillSecs / 60000 ; //minutes
  if(timeUnit ==="hours")return timeDiffMillSecs / 3600000 ; //hrs
}

const updatePoints_for_Creator= async(update, doc)=>{
  const { postCreatorId, postCategory, countryFrom } = doc; /**add Season */ 

  // 1. Get all posts by this user in this current season
  const userPosts = await postModel.find({creatorId: postCreatorId, countryFrom}).select(["upvoteRate"]).lean(); /**Season */

  // 2. Update total upvotes in this postCategory
  update.points[postCategory] += 4; // 4 represents the new upvote just casted

  // 3. Update overall total upvotes for user
  update.points.total["upvotes"] += 4;  

  // 4. Compute total average upvote rate in this postCategory (units = totalUpvotes/mins)
  let totalRate = 0;
  userPosts.forEach(({upvoteRate}) => totalRate += upvoteRate);

  const avgTotalRate = totalRate / userPosts.length;
  update.rates[postCategory] = avgTotalRate;

  // 5. Update total points for the post creator
  return userModel.findByIdAndUpdate(postCreatorId,update)
}

// Update voter's bonus counter
const updateDB= (voterId, update) => userModel.findByIdAndUpdate(voterId, {"points.bonus":{...update}});

// Increment dailyCount and total Bonus counts by 1
const incrementHelper = async(voterId, {totalCount, dailyCount, dailyTimeStamp})=>{
  if(dailyCount===0) dailyTimeStamp=new Date(); //If first time voting since sign up    
  totalCount +=1;
  dailyCount +=1;
  await updateDB(voterId, {totalCount, dailyCount, dailyTimeStamp});
}

// Restart daily bonus counter and timeStamp
const initBonusTimer = async(voterId, {totalCount, dailyCount, dailyTimeStamp})=>{
  dailyTimeStamp = new Date();
  totalCount +=1;
  dailyCount =1;
  await updateDB(voterId, {totalCount, dailyCount, dailyTimeStamp});
}

const updateBonus_for_Voter= async(voterId, bonus)=>{
  let{totalCount, dailyCount, dailyTimeStamp} = bonus;
  const dailyLimit = 15 //Can change this as required

  // 1. Compute time difference in hrs between now and dailyTimeStamp
  const now = new Date();
  const bonusTimer=new Date(dailyTimeStamp);
  const timeDiffHrs = getTimeDifference(dailyTimeStamp,"hours") ; //hours

  // 2. Initialize Bonus on new season start (Greater than 2months)
  if(Math.abs((now.getMonth() - bonusTimer.getMonth())) > 2){
    dailyTimeStamp=new Date();
    totalCount=1;
    dailyCount=1;
    return await updateDB(voterId, {totalCount, dailyCount, dailyTimeStamp});
  }

  // 3. Add to Bonus (totalCount and dailyCount)
  // Restart daily bonus counter and timeStamp if previous timestamp day is different from today
  if(bonusTimer.getMonth()===now.getMonth() && bonusTimer.getDate() !== now.getDate()){
    return initBonusTimer(voterId, bonus);
  }

  // Check to see if the timeStamp has passed 24Hrs
  if(timeDiffHrs>=24){
    if(dailyCount<dailyLimit){
      return incrementHelper(voterId, bonus);
    }else{
      return initBonusTimer(voterId, bonus);
    }
  }else{
    if(dailyCount<dailyLimit){
      return incrementHelper(voterId, bonus);
    }
  }
}

// Below groups all upvotes on a Post by the postId and returns totalUpvotes. 
upvoteSchema.statics.calcTotalUpvotes = async function(doc){

  const{ postId, voterId, postCreatorId, countryFrom } = doc;

  const stats = await this.aggregate([
    {$match:{$and:[{postId}, {countryFrom}]}}, //Should include season after test-run
    // {$match:{$and:{postId, countryFrom}}}, //Should include season after test-run
    {
      $group:{
        _id: '$postId', //This specifies what to groupBy
        totalUpvotes:{$sum:'$voteCount'}
      } 
    }
  ]);

  // 1. Update upvoteCount for this post
  const upvoteCount = stats.length? Number(stats[0].totalUpvotes) : 0 // 4 represents the new upvote been added

  // 2. Get upvoteRate for this post
  const timeElapsed = getTimeDifference(doc.postCreatedAt,"minutes");
  const upvoteRate =  upvoteCount / timeElapsed; //upvotes/min
  
  // 3. POST SECTION (Update total upvoteCount for this post)
  const[postOwner, postVoter] = await Promise.all([

    userModel.findById(postCreatorId, "points rates",{lean:true}),

    userModel.findById(voterId, "points.bonus",{lean:true}),

    postModel.findByIdAndUpdate(postId, {upvoteCount, upvoteRate}),
  ]);

  // 4. POST CREATOR SECTION 
  await updatePoints_for_Creator(postOwner, doc);

  // 5. POST VOTER SECTION
 await updateBonus_for_Voter(voterId, postVoter.points.bonus);
};

upvoteSchema.post('save', function (){
  //this: points to the current document been saved
  // constructor: points to the instance object that created the current document.
  this.constructor.calcTotalUpvotes(this);
});

const upvoteModel = mongoose.model('Upvote', upvoteSchema);
module.exports = upvoteModel;