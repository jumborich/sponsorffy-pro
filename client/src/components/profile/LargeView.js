import {Fragment} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import BackDrop from "../Modal/backdrop";
import {AiOutlineClose} from "react-icons/ai";
import {BsArrowUp} from "react-icons/bs";
import {IoMdShareAlt} from "react-icons/io";
import {IoSchoolSharp} from "react-icons/io5";
import Format from "../../utils/Format";
import FeedAction from "../../utils/FeedAction";
import ErrorModal from "../Modal/errorModal";
import { canVote } from '../../utils/verify';
import { UploadSpinner } from "../../utils/Loader"
import { LargeViewImg } from "../../utils/imageParams";
import ShareModal from "../Modal/shareModal"
import { showAlert } from "../../redux/utils/postActions";
import Toast from "../feed/toast";

const getMedia = (item) =>{
  const{ fileType, fileUrl, _id } = item;
  switch (fileType){
    case "image":
     return <LargeViewImg id={_id} src={fileUrl} className="large-view-img" alt="user posted file"/>;

    case "video":
      return(
        <video src={item.fileUrl} id={_id} poster={item.poster} controls muted playsInline disablePictureInPicture  className="large-view-video"/>
      )

    default: return null;
  }
};

const View = ({profileAction,tabType, closeView}) =>{
  const dispatch = useDispatch();
  const format = new Format();
  const feedState = useSelector(state => state);
  const {_id:currentUserId, isContestant} =feedState["user"].user;
  const {isModal,modalItem} =useSelector(state => state.profile.shared);
  const dispatchModal =()=>{
    profileAction.setIsModal(false,{});

    if(typeof closeView === "function") closeView()
  }
  
  const getRate=(amount=0,time=0)=>{
    let rate=0;
    if(tabType==="post"){
      amount=modalItem.upvoteCount; time=modalItem.createdAt
      const now = new Date();
      const timeDiffMillSecs = now - new Date(time); //returns this in milliseconds
      const timeDiffMins= timeDiffMillSecs / 60000 //returns this in mins
      const upvoteRate = amount / timeDiffMins //Rate of upvote per day 
      rate=upvoteRate.toFixed(4);
    }

    if(tabType==="test"){
      amount=modalItem.totalAnswered; time=modalItem.timeToComplete
      rate = (amount / time).toFixed(2);
      if(amount===0 || time===0) rate=0; //avoids NAN/Undefined
    };
    return rate;
  };

  // for test components
  const getScore=(score)=>(score).toFixed(2);

  // Close modal
  const closeModal=(e)=> {
    const lvContainer ="profile-item-view-container";
    if(e.target.className !== lvContainer && tabType !=="test"){
      return;
    }
    dispatchModal();
  };

  const renderTabView=()=>{
    const shared =()=>(
      <Fragment>
        <li><span>Created</span><span className="stats-value">{format.createdAt(modalItem.createdAt)}</span></li>
        <li><span>Expired</span><span className="stats-value">{modalItem.expired.toString()}</span></li>
      </Fragment>
    );
    
    if(tabType==="post"){
      // Enables the post actions
      const { postIdSaver="" } = feedState[modalItem.category];
      const feedAction = new FeedAction(postIdSaver, modalItem.category, dispatch);
      return(
        <Fragment>
          <div className="profile-item-large-view-l">
            {getMedia(modalItem)}
          </div>
          <div className="profile-item-large-view-r">
            <div className="item-stats-container">
              {
                modalItem.creatorId._id === currentUserId?
                <Fragment>
                  <p className="stats-header">Post Stats</p>
                  <div className="stats-item">
                    <li><span>Upvotes</span><span className="stats-value">{modalItem.upvoteCount}</span></li>
                    <li><span>Upvote Rate</span> <span className="stats-value">{getRate()}/mins</span></li>
                  </div>
                </Fragment>:null
              }

              <p className="stats-header">Post Details</p>
              <div className="stats-item">
                {
                  modalItem.creatorId._id === currentUserId? null:
                  <li><span>Creator</span><span className="stats-value">{modalItem.creatorId.username}</span></li>
                }
                {shared()}
                <li><span>Category</span><span className="stats-value">{modalItem.category}</span></li>
                <li><span>Sub-Category</span><span className="stats-value">{modalItem.subCategory}</span></li>
              </div>

              <p className="stats-header">Post Actions</p>
              <div className="largeview-post-action">
              {
                feedAction.hasUpVoted(modalItem.upvotes,modalItem._id,currentUserId)? 
                <button className="upvoted">
                  <BsArrowUp size={20}/>
                  <span>upvoted</span>
                </button>
                : 
                <Fragment>
                  { window && window.__item_id__ === modalItem._id && <Toast parentName={"entertainment"} className={"bonus-alert"} alertType={"bonus"} timeOut={1200}/> }
                  <button 
                  disabled={modalItem.creatorId._id === currentUserId} 
                  onClick={() =>{
                    if(canVote(isContestant, dispatch)){

                      dispatch(showAlert({main:"bonus: ", subMain:"+1", alertName:"bonus", onClick:null}, "entertainment"));
                      if(typeof window !== "undefined") window.__item_id__ = modalItem._id;

                      // Timer allows for animation
                      const timer = setTimeout(() =>{
                        feedAction.createUpvote(modalItem);
                        clearTimeout(timer);
                      },1210);
                    };
                  }}>
                    <BsArrowUp size={20}/>
                    <span>upvote</span>
                  </button>
                </Fragment>
              }
                <button onClick={()=> feedAction.sharePost(modalItem)}><IoMdShareAlt size={20}/>share</button>
              </div>
            </div>
          </div>
          <ErrorModal/>
          <ShareModal/>
        </Fragment>
      )
    }

    if(tabType === "test"){
      return(
        <Fragment>
          <div className="profile-item-large-view-l grad-hat-large-view">
            <IoSchoolSharp className="grad-hat-icon"/>
          </div>
          <div className="profile-item-large-view-r">
            <div className="item-stats-container">
              <p className="stats-header">Test Stats</p>
              <div className="stats-item">
                <li><span>Total Points</span><span className="stats-value">{getScore(modalItem.total_score)}</span></li>
                <li><span>Reading</span> <span className="stats-value">{getScore(modalItem.reading_score)}</span></li>
                <li><span>Writing</span> <span className="stats-value">{getScore(modalItem.writing_score)}</span></li>
                <li><span>Listening</span> <span className="stats-value">{getScore(modalItem.listening_score)}</span></li>
                <li><span>Speaking</span> <span className="stats-value">{getScore(modalItem.speaking_score)}</span></li>
                <li><span>Speed</span> <span className="stats-value">{getRate()} Q/min</span></li>
              </div>

              <p className="stats-header">Test Details</p>
              <div className="stats-item">
              <li><span>Mode</span><span className="stats-value">{modalItem.testMode}</span></li>
              <li><span>Version</span><span className="stats-value">{modalItem.version}</span></li>
                {shared()}
              </div>
            </div>
           </div>
        </Fragment>
      )
    }
  };

  return(
    <BackDrop isModal={isModal}>
      <div className="profile-item-view-container" onClick={closeModal}>
      <div className="confirmationModal-closeBtn">
        <button onClick={dispatchModal}>
          <AiOutlineClose size={20}/>
        </button>
      </div>
        {
          Object.keys(modalItem).length>0 ?
          renderTabView() : <UploadSpinner canSpin={true}/>
        }
      </div>
    </BackDrop>
  );
};
export default View;