import { IoFootballOutline,IoSchoolOutline,IoVideocamOutline } from "react-icons/io5";
import { RiHandHeartLine} from "react-icons/ri";
import Format from "../../utils/Format";

const Scoreboard=({ boardData , screenType}) =>{
  const format = new Format();
  const boardIcons = {
    academia:<IoSchoolOutline  size={20}/>,
    handwork:<RiHandHeartLine  size={20}/>,
    sports:<IoFootballOutline  size={20}/>,
    entertainment:<IoVideocamOutline  size={20}/> //entertainment
  }
    
  return(
    <div className="scoreboard-container">
      <header className={`scoreboard-header scoreboard-header-${screenType}`}>
        <span className="sb-category-header">Category points</span>
        <span className="sb-ranking-header">Ranking</span>
      </header>

      <main className="scoreboard-main-container">
      {boardData.points && Object.keys(boardData.points).map(category=>{
        return(
          <div key={category} className="scoreboard-main-content">
            <div className="sb-category">
                <div className="sb-icon-holder">
                    <div className="scoreboard-category-icon-content-o">
                    <div className="scoreboard-category-icon-content-i">
                        <span>{boardIcons[category]}</span>
                    </div>
                </div>
                </div>
                <div className={`sb-point-holder sb-point-holder-${screenType}`}>
                    <span>{category}</span>
                    <span>{format.points(boardData.points[category])} points</span>
                </div>
                <div className="sb-rank-holder">
                    {format.rank(boardData.ranks[category])}
                </div>
            </div>
        </div>
        )
      })}
    </main>
    </div>
  )
}

export default Scoreboard;