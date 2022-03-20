import {useContext} from "react";
import { useSelector, useDispatch } from "react-redux";
import LeaderBoardItem from "./leaderboard_item"
import {setPages} from "../../redux/leaderBoard/LBActions"
import {BoardContext} from "../leaderboard/contexts/leaderboardContext"
/**
 * Displays all leaders in a list
 */
const RenderLeaders = ()=> {

  const dispatch = useDispatch();
  const {setShouldFetch,currentCategory} = useContext(BoardContext)
  const {leaders,leaderCount,pages} = useSelector(state => state.leaderboard);

  // Helps with Pagination
  const paginate = () => {
    let pageCount = pages[currentCategory] + 1;

    // Update new page count
    dispatch(setPages(pageCount,currentCategory))

    // Fetch next list items
    setShouldFetch(true);
  }
  
    return (
      <div>
      <div className="leadership-lists">
      {leaders[currentCategory].length >0 && leaders[currentCategory].map((leader, i) =>{
        let getRank = i + 1
  
        let {categoryName} = leader
        let{total,bonus} = leader.points;
        if(currentCategory !== "all") total = leader.points[categoryName]; //Use category points instead of overrall point
  
        if (getRank === 1) {
          return (
            <LeaderBoardItem
              key={i}
              rank={getRank}
              user={leader}
              points={total + bonus.totalCount}
              categoryName={currentCategory ==="all"?categoryName:null}
              borderClassName="rank-first"
              pillClassName="first"
            />
          );
        }
        if (getRank === 2) {
          return (
            <LeaderBoardItem
              key={i}
              rank={getRank}
              user={leader}
              points={total + bonus.totalCount}
              categoryName={currentCategory ==="all"?categoryName:null}
              borderClassName="rank-second"
              pillClassName="second"
            />
          );
        }
        if (getRank === 3) {
          return (
            <LeaderBoardItem
              key={i}
              rank={getRank}
              user={leader}
              points={total + bonus.totalCount}
              categoryName={currentCategory ==="all"?categoryName:null}
              borderClassName="rank-third"
              pillClassName="third"
            />
          );
        } else {
          return(
            <LeaderBoardItem
            key={i} 
            rank={getRank} 
            user={leader} 
            points={total + bonus.totalCount} 
            categoryName={currentCategory==="all"?categoryName:null}
            />
          )
        }
      })}
    </div>
  
    <section className="more-leadership-list">
    {leaderCount[currentCategory].retrieved < leaderCount[currentCategory].total ? <p onClick={paginate}>See more</p>:null}
    </section>
   </div>
  )
}

export default RenderLeaders