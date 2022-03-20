import { setErrMesage } from "../redux/navBar/NavActions";
/**
 * Checks if the user still has enough coins and
 * returns true or false based on the findings
 */

export const canContest = (coins, dispatch) =>{
  if(coins === -1) return true;
  // if(coins >= 5) return true;

  // If not enough coins
  dispatch(setErrMesage({
    type:"balance", 
    errAction:"",
    message:"You are either low on coins or used up your free coins. To continue, buy coins."
  }))

  return false;
};

/**
 * Checks if the user has made an upload or taken test for this season and
 * returns true or false based on the findings
 */
export const canVote = (isContestant, dispatch) =>{
  // Allow user cast vote if a contestant
  if(isContestant) return true;
  
  dispatch(setErrMesage({
    type:"upvote", 
    errAction:"",
    message:"Only contestants can vote and earn points! To be, make an upload or take test."
  }));

  return false;
}