import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import {SiAirplayvideo} from "react-icons/si"
import { BiTrendingUp } from "react-icons/bi";
import {IoSettingsOutline,IoVideocamOutline,IoVideocam} from "react-icons/io5"
import { AiOutlineLogout } from "react-icons/ai";
import { IoFootballOutline,IoFootballSharp,IoSchoolOutline, IoSchoolSharp} from "react-icons/io5";
import { RiCoinsLine,RiHandHeartLine,RiHandHeartFill} from "react-icons/ri";

import HoverContent from "./hover_content";
import NavLink from "../navigation/navLink";
import Logout from "../auth/Logout";
import { AVATAR } from "../../utils/imageParams";

const Panel = () => {
  let { user } = useSelector((state) => state.user);
  const { component } = useSelector((state) => state.navBar);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showHideMore,setShowHideMore] = useState('hide-more');

  const shared =()=>{
    return(
      <>
        <HoverContent content="Scoreboard" borderRadius={50}>
        <div 
        onClick={()=>navigate('/leaderboard')}
        className="nav-panel-item"
        id="panel-item-search"
        >
        <BiTrendingUp/>
        </div>
      </HoverContent>

      <HoverContent content="Buy Coins" borderRadius={50}>
        <NavLink
          to="/coins"
          className="nav-panel-item"
          inActiveClassName="nav-panel-item-inactive"
          activeClassName="nav-panel-item-active"
        >
          <RiCoinsLine />
        </NavLink>
      </HoverContent>

      <HoverContent content="Sfy.Tv" borderRadius={50}>
        <NavLink
          to="/sponsorfy-tv"
          className="nav-panel-item"
          inActiveClassName="nav-panel-item-inactive"
          activeClassName="nav-panel-item-active"
        >
          <SiAirplayvideo />
        </NavLink>
      </HoverContent>
     </>
    )
  };

  const sharedSettings =(className)=>{
    return(
      <NavLink
      to="/settings"
      className={`${className}`}
      inActiveClassName="panel-item-inactive"
      activeClassName="panel-item-active">

      <span className="icon-wrapper">
        <IoSettingsOutline />
      </span>
      <p>Settings</p>
    </NavLink>
    )
  };

  const sharedLogout =(className)=>{
    return(
      <div onClick={()=>{
        Logout(dispatch,navigate);
      }}
      className={`${className}`}>
      <span className="icon-wrapper">
        <AiOutlineLogout />

      </span>
      <p>Logout</p>
    </div>
    )
  }
  return (
    <div className="panel-container">
      <div className="panel-container-top">
        <div className="panel-logo">Sponsorffy</div>
        <div className="panel-container-avatar">
          <div className="panel-avatar-stack">
            <AVATAR
              onClick={() => {
                const profileUrl =user.username.split(" ").join("");
                navigate(`/${profileUrl}`,{state:{id:user._id}});
              }}
              src={user.photo}
              alt={`Avatar of ${user.username}`}
            />
            <p>{user.username}</p>
            <hr />
            <div className="panel-stack-status">
              <div className="panel-stats">
                <p>{user.totalPoints}</p>
                <small>points</small>
              </div>
              <div className="panel-stats">
                <p>{user.bonusPoints}</p>
                <small>bonus</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="panel-container-bottom">
        <div className="panel-bottom-contents">

          {/**Includes navbar (i.e categories) */}
          <div className="panel-bottom-navbar-items">

            <HoverContent content="Entertain" borderRadius={50}>
              <NavLink
                to="/home/entertainment"
                className="nav-panel-item"
                inActiveClassName="nav-panel-item-inactive"
                activeClassName="nav-panel-item-active"
              >
              {component==="entertainment"? <IoVideocam color="#2142a3"/>:<IoVideocamOutline/>}
              </NavLink>
            </HoverContent>

            <HoverContent content="Academia" borderRadius={50}>
            <NavLink
              to="/home/academia"
              className="nav-panel-item"
              inActiveClassName="nav-panel-item-inactive"
              activeClassName="nav-panel-item-active"
            >
            {component==="academia"?<IoSchoolSharp color="#2142a3"/>:<IoSchoolOutline/>}
            </NavLink>
          </HoverContent>

            <HoverContent content="Handwork" borderRadius={50}>
              <NavLink
                to="/home/handwork"
                className="nav-panel-item"
                inActiveClassName="nav-panel-item-inactive"
                activeClassName="nav-panel-item-active"
              >
               {component==="handwork"?<RiHandHeartFill color="#2142a3"/>:<RiHandHeartLine/>}
              </NavLink>
            </HoverContent>

            <HoverContent content="Sports" borderRadius={50}>
              <NavLink
                to="/home/sports"
                className="nav-panel-item"
                inActiveClassName="nav-panel-item-inactive"
                activeClassName="nav-panel-item-active"
              >
              {component==="sports"? <IoFootballSharp color="#2142a3"/>:<IoFootballOutline/>}
              </NavLink>
            </HoverContent>
            { shared() }
            <HoverContent content="more" borderRadius={50}>
              <div className="nav-panel-item" 
              onClick={() =>{
                setShowHideMore(showHideMore === '' ? 'hide-more' : '');
              }}
              >
                <FiMoreHorizontal />
              </div>
            </HoverContent>

            <div className={`more-dropdown ${showHideMore}`}>
              {sharedSettings("panel-item-more")}
              {sharedLogout("panel-item-more")}
            </div>

          </div>

          {/**Excludes navbar (i.e categories) */}
          <div className="panel-bottom-items">
            {shared()}
            <HoverContent content="Settings" borderRadius={50}>
              {sharedSettings("panel-item")}
            </HoverContent>

            <HoverContent content="Logout" borderRadius={50}>
              {sharedLogout("panel-item")}
            </HoverContent>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Panel;