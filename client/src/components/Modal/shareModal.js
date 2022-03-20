import { useState,useEffect } from "react";
import { useSelector, useDispatch} from 'react-redux';
import BackDrop from "./backdrop";
import {AiOutlineClose} from "react-icons/ai";
import {FacebookShareButton,FacebookMessengerShareButton,TwitterShareButton,WhatsappShareButton,EmailShareButton,PinterestShareButton,FacebookIcon,FacebookMessengerIcon,TwitterIcon,WhatsappIcon,EmailIcon,PinterestIcon} from 'react-share'

const ShareModal=()=>{ 

  const[shareUrl, setShareUrl] = useState('');
  const[shareText, setShareText] = useState('');
  const shareIconSize = 50;
  const[isRounded, setIsRounded] = useState('');
  const[pinterestMedia, setPinterestMedia] = useState('');
  const dispatch = useDispatch();
  const{isModal,postDetails} = useSelector(state => state.entertainment.sharePost);
  const { _id, fileUrl, fileType, countryTo} = postDetails || {};

  // Enables the user to share posts to other platforms
  useEffect(() =>{
    // 1) pause/play media  on modal opening;
    let isModalPaused=false; //Check if media was paused due to modal opening
    const media = document.getElementById(_id);
    if(fileType === "audio" || fileType === "video"){
      if(!media.paused){
        media?.player?.pause();
        isModalPaused = true;
      }
    }

    const url = `https://www.sponsorffy.com/uploads/${_id}`// to share current page
    const title = `Hey friend(s), help me win this Free and Full Sponsorship to ${countryTo?countryTo.toUpperCase():countryTo} by upvoting my post on sponsorffy.com! Here is the link:`;

    setIsRounded(true);
    setShareText(title);
    setShareUrl(url);
    setPinterestMedia(fileUrl);
    
    return()=>{
      if(fileType === "video"){
        if(isModalPaused){
          // media.play(); Vanila
          media?.player?.play();
        }
      }
    }
  },[isModal]) //isModal,postDetails

  const closeModal=()=> {
    dispatch({
      type:"SHARE_POST",
      payload:{
        isModal:false,
        postDetails:{}
      }
    });
  };

  return (
    isModal?
    <BackDrop isModal={isModal} handleModal={closeModal}>
      <div className="share-modal" >
        <div className="shareModal-closeBtn">
          <button onClick={closeModal}><AiOutlineClose size={20}/></button>
        </div>
        <h6 className="share-modal-header">Choose a platform to share to</h6>
        <div style={{marginTop:'60px'}}>
        <div className="share-btn-row" >
          <FacebookShareButton url={shareUrl} quote={shareText} hashtag='#sponsorffy=FreeAndFullyPaidSponsorshipAbroad'>
          <div className="share-btn-row-item">
          <FacebookIcon size={shareIconSize} round={isRounded}/>
          <p>Facebook</p>
          </div>
          </FacebookShareButton>

          <FacebookMessengerShareButton url={shareUrl}>
          <div className="share-btn-row-item">
            <FacebookMessengerIcon size={shareIconSize} round={isRounded}/>
            <p>Messenger</p>
            </div>
          </FacebookMessengerShareButton>

          <TwitterShareButton url={shareUrl} title={shareText} via='sponsorffy' hashtags={['sponsorffy', 'FreeAndFullyPaidSponsorshipAbroad', 'upvotes']}>
            <div className="share-btn-row-item">
              <TwitterIcon size={shareIconSize} round={isRounded}/>
              <p>Twitter</p>
            </div>
          </TwitterShareButton>
        </div>

        <div className="share-btn-row-2">
        <WhatsappShareButton url={shareUrl} title={shareText}>
        <div className="share-btn-row-item">
        <WhatsappIcon size={shareIconSize} round={isRounded}/>
        <p>Whatsapp</p>
        </div>
        </WhatsappShareButton>

        <EmailShareButton url={shareUrl} subject='Free and fully paid sponsorship abroad!' body={shareText}>
        <div className="share-btn-row-item">
          <EmailIcon size={shareIconSize} round={isRounded}/>
          <p>Email</p>
          </div>
        </EmailShareButton>
          <PinterestShareButton url={shareUrl} description={shareText} media={pinterestMedia}>
            <div className="share-btn-row-item">
              <PinterestIcon size={shareIconSize} round={isRounded}/>
              <p>Pinterest</p>
            </div>
          </PinterestShareButton>
        </div>
        </div>
      </div>
    </BackDrop>:null 
  )
}
export default ShareModal;