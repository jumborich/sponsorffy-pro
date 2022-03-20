import {useEffect, useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import Loader from "../../utils/Loader";
import getMedia from "../feed/getMedia";
import {ProfileGridImg} from "../../utils/imageParams";
import LargeView from "./LargeView";

const ProfileTab =({tabType, user, profileAction, format})=>{
  const{profile} = useSelector(state => state);
  const [placeHolder, setPlaceHolder] = useState(false);
  const [dataFinished, setDataFinished] = useState({post:false, test:false});
  const currentTab = profile[tabType];

  let timerId = useRef({}) //used for clearing timeout

  useEffect(()=>{
    // Check if user data still exists in database and if the user has requested more
    if(dataFinished[tabType]) return; // If no more post/test to fetch

    let creatorId =user._id;
    let nextCursor =currentTab.nextCursor;
    let currentData = currentTab[tabType+"s"]
    let body ={creatorId, nextCursor}

    // Get user's posts from db
    profileAction.getAllData(body,tabType,currentData, setDataFinished);
    
    return() => clearTimeout(timerId);

  },[tabType, profile[tabType].nextCursor]);

  // Displays the individual grid item for tests
  const testGridItem =({version,createdAt})=>{
    return(
      <div className="test-grid-item">
        <div className="version-display"><span>{version}</span></div>
        <span className="date-display">&middot; {format.createdAt(createdAt)}</span>
      </div>
    )
  }
  // Set profile Item large screen view
  const setLargeView =(item)=>{
  profileAction.setIsModal(true,item)
  };

  // Get the user's posts or tests array e.g (profile["post"]["posts"])
  const items = currentTab[tabType+"s"];
  const itemsCount = items.length;

  const fallback = () =>{

    timerId = setTimeout(() =>{
      setPlaceHolder(!currentTab.isFetching && !itemsCount);
      clearTimeout(timerId)
    },10);

    if(placeHolder){
      return(
        <div className="place-holder">
          {tabType === "post"? "You have not made any post yet!" : "You have not taken any test yet!"}
        </div>
      )
    };
    
    return(
      <div className="place-holder">
        {Loader()}
      </div>
    ) 
  }

  return(
    <div className="profile-content-main">
    {
      itemsCount?items.map((item,index)=>{ 
        const points =tabType==="post"? item.upvoteCount : item.total_score; 
        return(
          <div key={index.toString()} className="profile-item-wrapper">
            {tabType==="post"? getMedia(ProfileGridImg, item, false) : testGridItem(item)}  
            <div className="profile-item-btn-container">
              <button className="profile-item-votes">{format.points(points)} {tabType==="post"?"votes":"points"}</button>
              <button className="profile-item-stats-btn" onClick={()=>setLargeView({...item, index})}>see more</button>
            </div>
          </div>
        )
      })
      :
      fallback()
    }

    <LargeView
      tabType={tabType}
      profileAction={profileAction}
    />
    </div>
  );
}
export default ProfileTab;