import {useEffect, memo} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {useSelector,useDispatch} from 'react-redux';
import getMedia from "./getMedia";
import { BsArrowUp } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import Format from "../../utils/Format";
import { canVote } from "../../utils/verify";
import FeedAction from "../../utils/FeedAction";
import { AVATAR, FEEDIMG } from "../../utils/imageParams";
import ProfileAction from "../../redux/profile/action";
import { showAlert } from "../../redux/utils/postActions";
import Toast from "./toast";

const FeedItem = ({item, isFetching, parentName}) =>{

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const{user} = useSelector(state => state.user);
  const feedState = useSelector(state => state);
  const {postIdSaver} = feedState[parentName];
  const format = new Format();
  const feedAction = new FeedAction(postIdSaver,parentName,dispatch)

  // Observes the entire page to enable infinite scroll
  const handleObserver = (fileType)=>{
    const feed = feedState[parentName].posts; //Gets posts for infinite loading below

    let options = {
      root:null,
      rootMargin: '0px',
      threshold: [0,0.25,0.5,0.75,1]
    };

    let observer = new IntersectionObserver((entries) =>{
      entries.forEach((entry, i)=>{
        if(entry.isIntersecting){
          // Observes for play/pause of multimedia element
          if(fileType === "video"){
            // Play media on intersection
            if(entry.intersectionRatio >=0.85){
              entry.target?.player?.play().then(resp =>{}).catch(err =>{});
            }

            // Pause media on off-intersection
            if(entry.intersectionRatio < 0.85){
              entry.target?.player?.pause();
              entry.target?.player?.volume(0);
            };  
          }

          // Observes for infite loading
          if(feed.length >=2){
            if((entry.intersectionRatio >= .1) && (entry.target.id === feed[feed.length - 3]._id)) {
              isFetching(true);
            } else{ //else if(entry.target.id !== feed[feed.length - 2]._id) 
              isFetching(false);
              
            }   
          }  
        }
      })
    },options);

    return observer;
  };
  
  useEffect(() => {
    // 1. Define the needed variable
    const observeItem=document.getElementById(item._id);

    // 2. Start the observing process
    const observer = handleObserver(item.fileType);
    
    // 3. Subscribe to observing events
    observer.observe(observeItem);

    // 4. Unsubscribe from observing events
    return()=>observer.unobserve(observeItem);
  },[]);

return (
  <div className="feed-item-container"
  onClick={()=>{
    new ProfileAction(dispatch).setIsModal(true, item);
    navigate(`/uploads/${item._id}`, {state:{...item, from:pathname}})
  }} 
  >
    <div className="feed-item-contents">
    <div className="feed-item-top">
      <div className="feed-user">
      <AVATAR
      src={item.creatorId.photo}
      alt={`Avatar of ${item.creatorId.username}`}
      />

      </div>
      <div className="feed-user-info">
        <section className="feed-user-name">
          {item.creatorId.username} 
          <span> &middot; {format.createdAt(item.createdAt)}</span>
        </section>
          
        <div className="feed-subcat-title-container">
          {item.subCategory} &middot; {item.title}
        </div>
      </div>
    </div>
    <div className="feed-media">
      {getMedia(FEEDIMG, item)}
    </div>
    <div className="feed-actions">
      {
        feedAction.hasUpVoted(item.upvotes,item._id,user._id)? 
        <button style={{backgroundColor:'#32df9d1a',color:'#45e2a4', cursor:'default', fontWeight:'bold'}}>
          <BsArrowUp size={20} color={'#45e2a4'}/>
          <span>upvoted</span>
        </button>
        : 
        <>
        {window && window.__item_id__ === item._id && <Toast parentName={parentName} className={"bonus-alert"} alertType={"bonus"} timeOut={1200}/>}
        <button 
          disabled={item.creatorId._id === user._id}  
          onClick={(e)=>{
            // Allow user cast vote if a contestant
            if(canVote(user.isContestant, dispatch)){
              dispatch(showAlert({main:"bonus: ", subMain:"+1", alertName:"bonus", onClick:null}, parentName ))

              if(typeof window !== "undefined") window.__item_id__ = item._id;

              // Timer allows for animation
              const timer = setTimeout(() =>{
                feedAction.createUpvote(item);
                clearTimeout(timer);
              },1210);
            };
            e.stopPropagation();
          }}>
            <BsArrowUp size={20}/>
            <span>upvote</span>
          </button>
        </>
      }
      <button onClick={(e) =>{
        feedAction.sharePost(item);
        e.stopPropagation();
      }}>
      <IoMdShareAlt size={20} />
      <span>share</span>
      </button>
    </div>
    </div>
  </div>
);
};
export default memo(FeedItem);