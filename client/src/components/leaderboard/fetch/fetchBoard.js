import _useAxios from "../../../utils/_useAxios";
import {setLeaders,setLeaderCount, setBoardItems} from "../../../redux/leaderBoard/LBActions";

class FetchBoard{
  constructor(dispatch,user){
    this.user = user;
    this.dispatch = dispatch;
  }
  
  // Get scoreboard
  getScoreboard(boardType){
    const body ={
      _id:this.user._id,
      countryTo:this.user.countryTo,
      countryFrom:this.user.countryFrom  
    }
    _useAxios("GET",body,"leaderboard/scoreboard")
    .then(({data})=>{
      this.dispatch(
        setBoardItems({
          boardType,
          scoreboardData:data.boardData
        })
      )
    })
    .catch(err => console.log(err))
  }

  // Get leaderboard
  getLeaderboard(boardType,pages,leaders,leaderCount,currentCategory){
    const body ={
      countryTo:this.user.countryTo,
      countryFrom:this.user.countryFrom,
      category:currentCategory,
      page:pages[currentCategory]
    }
    _useAxios("GET",body,"leaderboard/leaders")
    .then(({data})=>{

      // Set Leaders based on the current category
      const {category,totalData} = data;
      let retrieved =leaderCount[category].retrieved;

      if(retrieved < totalData){
        this.dispatch(
          setLeaders(
            [...leaders[category], ...data.leaders],
            category
          )
        );
          
        // Increase the number of retrieved data in redux
        retrieved += data.leaders.length;
        this.dispatch(
          setLeaderCount(
            {total:totalData,retrieved},
            category
          )
        )
      }

      // set board type
      this.dispatch(
        setBoardItems({
          boardType
        })
      )
    })
    .catch(err => console.log(err))
  }  
}
export default FetchBoard;