import {useContext} from 'react';
import {useSelector} from "react-redux";
import {BoardContext} from "./contexts/leaderboardContext"

// 1) Determines the current leaderboard category in display
const CategoryPill = ({ name, screenType, activeClass,setCurrentCat }) =>{

  /**
   * screenType takes on values of full-screen || half-screen.
   */
    return (
      <div 
      id={`${name}-${screenType}`}
      className={`leadership-category-pill category-pill-${screenType} ${activeClass}`}
      onClick={()=>{
        return(
          name === "entertain"?setCurrentCat("entertainment"):setCurrentCat(name)
        )
      }}
      >
        <p>{name}</p>
      </div>
    );
};

export const BoardTitle =()=>{
  const {boardItems}= useSelector(state => state.leaderboard);
  const {boardType} =boardItems;

  if(boardType === "score"){
    return(
      <p>Scoreboard</p>
    )
  }
  
  if(boardType === "leader"){
    return(
      <p>Leaderboard</p>
    )
  }
  return null;
}

export const BoardDescription =({boardType,user})=>{
  if(boardType==="score"){
    return(
        <span className="scoreboard-subtitle scoreboard-desc">
          <span style={{color:"black"}}>{user.username}'s</span> points and ranking by category <br/>
          {
            /**updated &middot; 2mins ago */
          }
        </span>      
    )
  }

  if(boardType==="leader"){
    return(
        <div className="scoreboard-subtitle">
          List of winners at first-half by category
        </div>
    )
  }

  return(
    null
  )
};

export const CategoryNav = ({ screenType })=>{
  const {currentCategory, setCurrentCategory} = useContext(BoardContext);
  const {user}= useSelector(state => state.user);
  const {boardItems}= useSelector(state => state.leaderboard);
  const {boardType} =boardItems;

  const getClass=(name) =>{
    if(currentCategory===name){
      return(
        "category-pill-active"
      )
    }

    return(
      "category-pill-inactive"
    )
  }

  const selectCategory=()=>{
    if(boardType==="leader"){
      return(
        <div className="leadership-categories">
          <CategoryPill
          name="all" 
          screenType={screenType}
          setCurrentCat={setCurrentCategory} 
          activeClass={getClass("all")}
          />

          <CategoryPill
          name="entertain"
          screenType={screenType} 
          setCurrentCat={setCurrentCategory}
          activeClass={getClass("entertainment")}
          />

          <CategoryPill
          name="academia"
          screenType={screenType}
          setCurrentCat={setCurrentCategory} 
          activeClass={getClass("academia")}
          />

          <CategoryPill
          name="handwork"
          screenType={screenType} 
          setCurrentCat={setCurrentCategory} 
          activeClass={getClass("handwork")}
          />

          <CategoryPill 
          name="sports"
          screenType={screenType} 
          setCurrentCat={setCurrentCategory} 
          activeClass={getClass("sports")}
          />
      </div>
      )
    }
  }
    
  return(
    <>
      <BoardDescription
        user={user}
        boardType={boardType}
      />
      {selectCategory()}
    </>
  )
}