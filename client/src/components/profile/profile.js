import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate,useParams,useLocation} from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { BsCollectionPlay,BsFillCollectionPlayFill } from "react-icons/bs";
import {IoSchoolOutline, IoSchoolSharp} from "react-icons/io5";
import ProfileTab from "./ProfileTab";
import ProfileActions from "../../redux/profile/action";
import {motion} from 'framer-motion';
import Format from "../../utils/Format";
import { AVATAR, avatarParam } from "../../utils/imageParams";

const variants = {
  show:{
    opacity:1,
    transition:{
      duration:0.5,
      ease:"easeIn"
    },
  },
  hidden:{
    opacity:0,
    transition:{
      duration:0.5,
      ease:"easeOut"
      
    }
  }
}

const Profile = ( ) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileAction = new ProfileActions(dispatch);
  const format = new Format();

  const { user } = useSelector((state) => state.user);
  const {username} = useParams();
  const location = useLocation();
  const pTab = location.state && location.state.profileTab;

  const [isScroll, setIsScroll] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const [profileTab, setProfileTab] = useState(pTab || "post");

  //checking url param to see if username exit
  //if  not return 404
  useEffect(()=>{
    const paramUserName = user.username.split(" ").join("");
    let paramUserId;
    if(location.state) paramUserId = location.state.id;

    if(user._id !==paramUserId || username !==  paramUserName){
      setIsUser(false)
    }
    else{
      setIsUser(true)
    }
    return () =>{
      // clearing user's data to enable re-fetching when profile mounts initially
      ["POST", "TEST"].forEach((tabType) =>{
        profileAction.setNextCursor(null, tabType);
        profileAction.fetchProfileFeed([], tabType);
      });
    }
  },[]) //username

  // Get user profile from db
  useEffect(()=>profileAction.getMe(),[])

  function verticalScrollListener() {
    const avatar = document && document.getElementById("user-avatar");
    const avatarVisibility = avatar && avatar.getBoundingClientRect().bottom; //Get the visibility of avatar from the viewport
    if(avatarVisibility < 67){
      setIsScroll(true);
    }
    else{
      setIsScroll(false)
    }

	}

	useEffect(() => {
    if(typeof window !== "undefined"){
      // setting animation 
      const profileWrapper = document && document.querySelector(".profile-wrapper");

      if(window.innerWidth < 600){
        profileWrapper &&  profileWrapper.addEventListener('scroll',verticalScrollListener);
      }
    
      return ()=>{
        profileWrapper &&  profileWrapper.removeEventListener('scroll', verticalScrollListener);
      }
    }
  });
  

  if(!isUser){
    return <h4>404 not found!</h4>
    // 
  }

  return (
    <div className="profile-wrapper">
    
    {/**Mobile */}
    <div className="profile-res-mo">
      <div className="profile-res-mo-left">
          <button onClick={()=> navigate("/home")} className="profile-arr-back">
              <BiArrowBack/><span className="profile-res-name">Back</span>
          </button>
      </div>
      <div className="profile-res-mo-mid">
        <motion.img 
          animate={isScroll ? "show" : "hidden"}
          initial="hidden"
          variants={variants}
          src={`${user.photo}?${avatarParam("73")}`} alt={`Avatar of ${user.username}`}

        />
      </div>
      <div className="profile-more-stats">
      {/* <RiMenu3Line/> */}
      </div>
    </div>

        {/**Desktop*/}
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-content-top">
            <div onClick={()=> navigate("/home")} className="profile-arr-back">
              <BiArrowBack color="white" size={30}/><span className="profile-res-name">Back</span>
            </div>
            <div className="profile-content-stats">
              <div className="profile-counts">
                <span>{format.points(user.points.total.tests) || 0}</span>
                <p>Test(pts)</p>
              </div>
              <div className="profile-counts-ml">
                <span>{user.points.total.upvotes || 0}</span>
                <p>Upvotes</p>
              </div>
            </div>
            <AVATAR src={user.photo} alt={`Avatar of ${user.username}`} id="user-avatar" isLargeAvatar={true}/>

            <div className="profile-content-stats-right">
              <div className="profile-counts">
                <span>{format.points(user.points.bonus.totalCount) || 0}</span>
                <p>Bonus</p>
              </div>
              <div className="profile-counts-ml">
                <span>{user.coins || 0}</span>
                <p>Tokens</p>

              </div>
            </div>
          </div>
          <div className="profile-content-name">
            <p>{user.fullname}</p>
          </div>

          {/**Mobile */}
          <div className="profile-res-mob-stats">
          <div className="profile-counts">
                <span>{format.points(user.points.total.tests) || 0}</span>
                <p>Test(pts)</p>
              </div>
              <div className="profile-counts">
                <span>{user.points.total.upvotes || 0}</span>
                <p>Upvotes</p>
              </div>
              <div className="profile-counts">
                <span>{ format.points(user.points.bonus.totalCount) || 0}</span>
                <p>Bonus</p>
              </div>
              <div className="profile-counts">
                <span>{user.coins || 0}</span>
                <p>Tokens</p>
              </div>
          </div>
          
             {/**Bottom Navs */}
          <div className="profile-content-navigation">
            <div className="profile-tabs-container">
              <div className="profile-tabs">
              <div className="profile-tab" onClick={() =>setProfileTab("post")}>
                {profileTab==="post"?<BsFillCollectionPlayFill size={27} color="#2142a3"/>:<BsCollectionPlay size={27} color="slategrey"/>}
              </div>
              <div className="profile-tab" onClick={() =>setProfileTab("test")}>
                {profileTab==="test"?<IoSchoolSharp size={27} color="#2142a3"/>:<IoSchoolOutline size={27} color="slategrey"/>}
              </div>
              </div>
            </div>
            <hr/>

            <ProfileTab 
              tabType={profileTab} 
              user={user} 
              profileAction={profileAction} 
              format={format}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;