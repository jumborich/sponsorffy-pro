import {useContext} from "react";
import {useSelector} from 'react-redux';
import Loader from "../../utils/Loader";
import {BoardContext} from "./../leaderboard/contexts/leaderboardContext";
import Scoreboard from "./scoreboard";
import RenderLeaders from "./renderLeaders"
// const RenderLeaders = Loadable({
//   loader:() => import(/* webpackChunkName: "RenderLeaders" */ "./renderLeaders"),
//   loading: () => <div>Loading...</div>
// })

const RenderBoard=({screenType})=>{

  const {setShouldFetch,currentCategory} = useContext(BoardContext);
  const {boardItems}= useSelector(state => state.leaderboard);
  const {boardType,scoreboardData} = boardItems;

  const toggleBoard = ()=>{
    if(boardType==="score"){
      return(
        <Scoreboard 
        screenType={screenType}
        boardData={scoreboardData}
      />
      )
    }

    if(boardType==="leader"){
      return(
        <RenderLeaders
        setShouldFetch={setShouldFetch}
        currentCategory={currentCategory}
        />
      )
    }
    
    return <Loader/>
  }

  return(
      toggleBoard()
  )
};

export default RenderBoard;