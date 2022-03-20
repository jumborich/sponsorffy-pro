const userModel = require("../models/userModel");
const leaderBoardModel = require("../models/leaderBoard");

/** Adds up total points to equal tests + upvotes */
const getTotal = (points) => points.total.tests + points.total.upvotes;

// SORT Helper function
const sortHelper=(a,a_bonus,b,b_bonus,categoryName)=>{   

  // 1. First compare users based on their (average category(academia, sports, etc..) points + bonus)
  if(categoryName === "academia"){ //based on points first
    if(a.points[categoryName] > b.points[categoryName]) return -1; //a comes before b
    if(a.points[categoryName] < b.points[categoryName]) return 1; //b comes before a
  }
  else{ //based on points + bonus first
    if(a.points[categoryName] + a_bonus > b.points[categoryName] + b_bonus) return -1; //a comes before b
    if(a.points[categoryName] + a_bonus < b.points[categoryName] + b_bonus) return 1; //b comes before a
  }
  
  // 2. If Tie found, then sort them by Average testRate/upvoteRate
  // Note- More upvotes/Questions in a shorter duration, the better. Hence, higher the rate the better(Avg.rate = total upvote / timeSincePost creation || total Q Ans. / timeToTestCompletion) units= upvotes/min || Questions/min.
  if(a.rates[categoryName] > b.rates[categoryName]) return -1; //a comes before b
  if(a.rates[categoryName] < b.rates[categoryName]) return 1; //b comes before a

  // 3. If tie still exists then sort Overall points: This is incase a user may have contested in more than a category
  const aTotal = getTotal(a.points), bTotal = getTotal(b.points);
  if(aTotal + a_bonus > bTotal + b_bonus) return -1; //a comes before b
  if(aTotal + a_bonus < bTotal + b_bonus) return 1; //b comes before a

}

// 1. Sort contestant array
const sortContestants = (contestantArray,categoryName)=>{ 
  return contestantArray.sort((a,b) =>{
    const {totalCount:a_bonus} = a.points.bonus;
    const {totalCount:b_bonus} = b.points.bonus;
    return sortHelper(a,a_bonus,b,b_bonus,categoryName);
  })
}

// 2. Rank contestants array
const rankContestants = async(filterOptions,rankListCount,categoryName)=>{

  // 0) Get All users on (Sponsorfy OR within a countryFrom&countryTo) if isContestant: id,username,photo,points,upvotes,rank,rate
  let contestantArray = await userModel.find(filterOptions)
  .where(`points.${categoryName}`).gt(0)
  .select([
    "points.total",
    "points.bonus.totalCount",
    `points.${categoryName}`,
    `rates.${categoryName}`,
    "photo","username"
  ])
  .lean();

  //1. Sort Contestants
  let sortedContestants = sortContestants(contestantArray,categoryName);

  //2. Rank the sorted contestants
  for(let i = 0; i <sortedContestants.length; i++){
      let a = sortedContestants[i]; //This defines the (ith) object
      let a_categoryPoint = a.points[categoryName] + a.points.bonus
      let a_totalPoint = a.points.total + a.points.bonus;
      let a_rate = a.rates[categoryName]

      for(let j = i+1; j <sortedContestants.length + 1; j++){ 
        let b = sortedContestants[j];//This defines the (jth) object
        if(b){
          let b_categoryPoint = b.points[categoryName] + b.points.bonus
          let b_totalPoint = b.points.total + b.points.bonus;
          let b_rate = b.rates[categoryName];

          if(!b.hasTie){
            if(a_categoryPoint === b_categoryPoint && a_totalPoint === b_totalPoint && a_rate === b_rate){ //Checking for ties before ranking
              a.rank = b.rank = i+1; //Assign both the same rank
              a.hasTie = b.hasTie = true; //Making both know they have ties
            }
          }
        }
      };

    // If this user has no ties, then assign them a rank 
    if(!a.rank) a.rank =i+1;

    // assign the categoryName
    a.categoryName = categoryName

    // Update contestant's ranking in the DB
    if(categoryName==="sports")await userModel.findByIdAndUpdate(a._id,{"ranks.sports":a.rank})
    if(categoryName==="handwork")await userModel.findByIdAndUpdate(a._id,{"ranks.handwork":a.rank})
    if(categoryName==="academia")await userModel.findByIdAndUpdate(a._id,{"ranks.academia":a.rank})
    if(categoryName==="entertainment")await userModel.findByIdAndUpdate(a._id,{"ranks.entertainment":a.rank})
  };

  // After sorting & Ranking, push the top contestants within the rankListCount into category Leaders Array!
  let leaders = [];
  const arrCount =sortedContestants.length;
  
  for(let i = 0; i < rankListCount; i++){
    if(arrCount && sortedContestants[i]){
      leaders.push(sortedContestants[i]);
    }
    else{
      break;
    }
  }

  return leaders;
}

// Avoid duplicates in the 'All' leader category
const avoidDuplicates =(allLeaders)=>{
  const uniqueLeaders=[];
  const uniqueIdHolder=[];

  const duplicates =[];
  const duplicateIdHolder=[];

  // Only add unique users to uniqueLeaders arr
  const leaderCount = allLeaders.length;
  for(let i=0; i<leaderCount; i++){
    const leader = allLeaders[i];
    const leaderId = leader._id.toString(); //ensures string to string comparison

    if(uniqueIdHolder.length){
      const id_Exists =uniqueIdHolder.includes(leaderId);

      if(id_Exists){
        duplicates.push(leader)
        duplicateIdHolder.push(leaderId);

      }else{
        uniqueLeaders.push(leader);
        uniqueIdHolder.push(leaderId);
      }
    }else{
      uniqueLeaders.push(leader)
      uniqueIdHolder.push(leaderId);
    }
  }

  //Add removed duplicates to leader's [others] prop
  const uniqueCount =uniqueLeaders.length;
  for(let i = 0; i <uniqueCount; i++){
    const uniqueLeader = uniqueLeaders[i];
    const uniqueLeaderId = uniqueLeader._id.toString();

    if(duplicateIdHolder.length){
      if(duplicateIdHolder.includes(uniqueLeaderId)){
        uniqueLeader.others =duplicates.filter((item=>{
          return(
            uniqueLeaderId === item._id.toString()
          )
        }))
      }
    }else{
      break;
    }
  };

  // Sort leaders numerically (points.total + bonus.totalCount);
  return uniqueLeaders.sort((a,b)=>{
    const a_totalPoints=a.points.total+ a.points.bonus.totalCount;
    const b_totalPoints=b.points.total+ b.points.bonus.totalCount;
    if(a_totalPoints > b_totalPoints)return -1;
    if(a_totalPoints < b_totalPoints)return 1;
  });
}

//Push winners by their category to db
const createLeaderboard =(winners,countries)=>{
  try{
    Object.keys(winners).forEach(async(category)=>{
      await leaderBoardModel.create({
        category,
        leaders:winners[category],
        countryTo:countries.countryTo || "canada",
        countryFrom:countries.countryFrom || "nigeria"
      })
    })
  }
  catch(error){
    console.log(error)
  }
}

// Ranks users based on category and countryTo and countryFrom
const startRanking=async(countries={}, rankListCount=15, isOver=false)=>{

  // 1) Get All users on (Sponsorfy OR within a countryFrom&countryTo) if isContestant: id,username,photo,points,upvotes,rank,rate
  let filterOptions ={};
  if(countries.countryTo){
    filterOptions={
      countryTo:countries.countryTo,
      countryFrom:countries.countryFrom
    }
  };

  const categories = ["academia", "entertainment", "handwork", "sports"];
  const categoryPromises = categories.map((catName =>rankContestants(filterOptions,rankListCount,catName))); //returns an array of winners

  // 2)Get Academia winners---> Sort users on the following: 1.Total Avg. test points, 2.average testRate, 3.Overall points(points from all category + BONUS) then update users rank in DB
  const[ academia, entertainment, handwork, sports ] = await Promise.all(categoryPromises);

  // 3 Merge and return Ranks for All leaders display
  if(isOver){ //When contest ends
    let all = [...entertainment,...academia,...handwork,...sports];
    all = avoidDuplicates(all);
  
    // push leaders/winners to db
    const winners={
      academia,
      entertainment,
      handwork,
      sports,
      all
    }
    /** Should be update leadership board in db  **/
    createLeaderboard(winners,countries)
  }
}

module.exports=startRanking;