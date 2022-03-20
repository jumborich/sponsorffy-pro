import RenderBoard from "./renderBoard";
import {CategoryNav,BoardTitle} from "./categoryNav";

const LeaderboardLarge =()=>{
  return(
    <div className="leadership-container">
    <div className="leadership-contents-top">
      <div className="leaderboard-header">
       <BoardTitle/>
      </div>
      <CategoryNav
      screenType={"half-screen"}
      />
    </div>

    <RenderBoard
    screenType={"half-screen"}
    />
   </div>
  )
}
export default LeaderboardLarge;