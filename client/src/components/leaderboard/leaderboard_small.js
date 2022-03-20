import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import RenderBoard from "./renderBoard";
import RenderCountDown from "./renderCountDown";
import {CategoryNav,BoardTitle} from "./categoryNav";
import BoardContextProvider from "./contexts/leaderboardContext";
import { AVATAR } from "../../utils/imageParams";

const LeaderBoardMobile = () => {
  const navigate = useNavigate();
  const {user} = useSelector(state => state.user);
  return (
    <BoardContextProvider>
      <div className="leaderboard-small-wrapper">
        <div className="leaderboard-small-container">
          <div className="leaderboard-small-container-top">
            <div className="leaderboard-small-arrow-back">
              <button onClick={() => navigate(-1)}>
                <BiArrowBack />
              </button>
            </div>
            <div className="leaderboard-small-logo">
              <BoardTitle/>
            </div>
            <div className="leaderboard-small-user">
              <AVATAR
                src={user.photo}
                alt={`Avatar of ${user.username}`}
              />
            </div>
          </div>
          <div className="count-down-small">
              <RenderCountDown/>
          </div>
            <CategoryNav
            screenType={"full-screen"}
            />
          <div className="leaderboard-small-lists">
            <div className="leaderboard-small-lists-contents">
                <RenderBoard
                screenType={"full-screen"}
                />
            </div>
          </div>
        </div>
      </div>
   </BoardContextProvider>
  );
};

export default LeaderBoardMobile;