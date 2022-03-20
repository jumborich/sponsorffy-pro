import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoFootballOutline,IoFootballSharp,IoSchoolOutline, IoSchoolSharp, IoVideocamOutline,IoVideocam} from "react-icons/io5";
import { RiHandHeartLine,RiHandHeartFill} from "react-icons/ri";
import handleMedia from "../../utils/handleMediaUpload";
import RenderCountDown from "../leaderboard/renderCountDown";
import NavLink from "./navLink";
import { canContest } from "../../utils/verify";
import { setUpload,setModal } from "../../redux/navBar/NavActions";

const Navbar = () => {
  const [isSettings, setIsSettings] = useState(false);
  const [fixedNav, setFixedNav] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const { component } = useSelector((state) => state.navBar);
  const { user } = useSelector((state) => state.user);
  const [btnText, setBtnText] = useState("Upload");

  // toggle upload and take test btn
  useEffect(() => {
    if (component === "academia") {
      setBtnText("Take Test");
    } else {
      setBtnText("Upload");
    }
  }, [component]);

  // send file object to server
  const uploadMedia = (e) => {

    // Checking for available coins
    if(!canContest(user.coins, dispatch)) return null;

    const uploadedFile = e.target.files[0];
    if(uploadedFile){
    
      // Sets file url for display on modal
      dispatch(setUpload(uploadedFile));
      dispatch(setModal("upload", true));

      // Sets the error/success message from handling media upload
      const fieldname = "feed-media"
      handleMedia(uploadedFile, fieldname, dispatch);
    };
  };

  //show navbar title on /settings route
  useEffect(() => {
    if (
      location.pathname.split("/")[1] === "settings" ||
      location.pathname.split("/")[1] === "profile"
    ) {
      setIsSettings(true);
      if (location.pathname.split("/")[1] === "profile") {
        setFixedNav("fixed-navbar");
      }
    }

    return () => {
      setIsSettings(false);
    };
  }, [location]);

  return (
    <div className={`navbar-container ${fixedNav}`}>
      <div className="nav-items">
        {isSettings ? (
          <div className="navbar-title">
            <p>Sponsorffy</p>
          </div>
        ) : (
          ""
        )}
        <NavLink
          to="/home/talent"
          className="nav-item"
          inActiveClassName="nav-inactive"
          activeClassName="nav-active"
        >
          {component==="entertainment"? <IoVideocam size={22}/>:<IoVideocamOutline size={22}/>}
          <div className="nav-cat-name">Talent</div>
        </NavLink>
        <NavLink
          to="/home/academia"
          className="nav-item"
          inActiveClassName="nav-inactive"
          activeClassName="nav-active"
        >
        {component==="academia"?<IoSchoolSharp size={22}/>:<IoSchoolOutline size={22}/>}
        <div className="nav-cat-name">Academia</div>
        </NavLink>
      </div>
    

    {component ? (
      <div className="navbar-search" title="upload" aria-label="upload">
        <div className="upload">
          <label htmlFor="doc_uploads">
            <span>
              {btnText}
              {/* <AiOutlineUpload/> */}
            </span>
          </label>
          {component !== "academia" ? (
            <input
              type="file"
              id="doc_uploads"
              accept="image/*,video/*"
              name="media"
              onChange={uploadMedia}
              onClick={({ target }) => {
                target.value =null;
              }}
            />
          ) : (
            <input
              type="text"
              id="doc_uploads"
              // name="media"
              onClick={() =>{dispatch(setModal("test", true))}} 
            />
          )}
        </div>
        <div className="search-field">
            <RenderCountDown/>
        </div>
      </div>
    ) : null}
    </div>
  );
};
export default Navbar;


{/**
  <NavLink
    to="/home/entertainment"
    className="nav-item"
    inActiveClassName="nav-inactive"
    activeClassName="nav-active"
  >
    {component==="entertainment"? <IoVideocam size={22}/>:<IoVideocamOutline size={22}/>}
    <div className="nav-cat-name">Entertain</div>
  </NavLink>
  <NavLink
    to="/home/academia"
    className="nav-item"
    inActiveClassName="nav-inactive"
    activeClassName="nav-active"
  >
  {component==="academia"?<IoSchoolSharp size={22}/>:<IoSchoolOutline size={22}/>}
  <div className="nav-cat-name">Academia</div>
  </NavLink>

  <NavLink
    to="/home/handwork"
    className="nav-item"
    inActiveClassName="nav-inactive"
    activeClassName="nav-active"
  >
    {component==="handwork"?<RiHandHeartFill size={22}/>:<RiHandHeartLine size={22}/>}
    <div className="nav-cat-name">Handwork</div>
  </NavLink>

  <NavLink
    to="/home/sports"
    className="nav-item"
    inActiveClassName="nav-inactive"
    activeClassName="nav-active"
  >
    {component==="sports"? <IoFootballSharp size={22}/>:<IoFootballOutline size={22}/>}
    <div className="nav-cat-name">Sports</div>
  </NavLink>
</div>
*/
}