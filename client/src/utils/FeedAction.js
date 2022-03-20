import _useAxios from "./_useAxios";
import {savePostIds} from "../redux/utils/postActions";
import { setErrMesage } from "../redux/navBar/NavActions";

/**
 * The FeedAction constructor func exposes methods needed for interracting  
 * 
 * with the buttons below a feed/post item. I.e (upvote,upvoted,share) etc.
 * 
 */
export default class FeedAction {
  constructor(postIdSaver,parentName,dispatch){
    this.dispatch = dispatch;
    this.postIdSaver = postIdSaver;
    this.parentName = parentName;
  }

  // This creates upvote on a post given the postId
  createUpvote({ _id:postId }){
    // 1) initialize array to save the currently upvoted postid by the user in redux
    let storePostId = [];
    storePostId.push(postId);

    // 2) Dispatch the saved id to enable realtime upvote-to-upvoted
    const payload =[...this.postIdSaver,...storePostId];
    this.dispatch(savePostIds(payload, this.parentName));

    _useAxios("POST",{},`posts/${postId}/upvotes`)
    .then(()=>{})
    .catch(err => this.dispatch(setErrMesage({type:"upvote", message:err.response.data.message, errAction:false})));
  }

  // Toggles the upvote/upvoted button textContent
  hasUpVoted(upvotesArray,postId,currentUserId){
    let hasAlreadyVoted = false;
    const upvotesArrLen = upvotesArray && upvotesArray.length;
    if(upvotesArrLen) {
      for(let i=0; i<upvotesArrLen; i++){
        if(upvotesArray[i].voterId === currentUserId){
          hasAlreadyVoted = !hasAlreadyVoted;
        }
      }
    }
    return hasAlreadyVoted  || this.postIdSaver.includes(postId);
  };

  // Sets modal for sharing
  sharePost({_id,fileUrl,fileType,creator, countryTo}){
    const postDetails={ _id,fileUrl,fileType,creator,countryTo}
    this.dispatch({
      type:"SHARE_POST",
      payload:{
        isModal:true,
        postDetails
      }
    })
  }
}