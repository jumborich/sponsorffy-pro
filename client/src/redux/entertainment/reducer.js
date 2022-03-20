import {FETCH_POSTS,NEXT_CURSOR, POSTS_FINISHED,SAVE_POST_IDS, SHOW_ALERT,SAVE_SCROLL_POSITION} from '../utils/postActionTypes';

const initialEntState = {
    loading: false,
    nextCursor:"",
    postsFinished:false,
    posts: [],
    postIdSaver:[], //this is used to push the id of every post the current user upvotes - This will enable the simulation of upvote-to-upvoted instead of relying on DB.
    scrollPosition:0,
    sharePost:{isModal:false,postDetails:{}}, //To be used by all post screens to show shareModal.
    alertMessage:{
      main:"",
      subMain:"",
      alertName:"", //either upload or bonus alert, etc.
      onclick:null //Will be a callback  function if passed
    }
}

const entReducer = (state = initialEntState, action) =>{
  switch (action.type){

    case `${FETCH_POSTS}_ENTERTAINMENT`:
      return {
        ...state,
        posts:action.payload,
        loading:false
      }

    case `${NEXT_CURSOR}_ENTERTAINMENT`:
      return {
        ...state,
        nextCursor: action.payload
      }

    case `${POSTS_FINISHED}_ENTERTAINMENT`:
      return {
        ...state,
        postsFinished:action.payload
      }

    case `${SAVE_POST_IDS}_ENTERTAINMENT`:
      return {
        ...state,
        postIdSaver:action.payload
      }

    case `${SHOW_ALERT}_ENTERTAINMENT`:
      return {
        ...state,
        alertMessage:action.payload
      }

    case `${SAVE_SCROLL_POSITION}_ENTERTAINMENT`:
      return {
        ...state,
        scrollPosition:action.payload
      }

    case "SHARE_POST":return {...state, sharePost:action.payload}
    
    default:return state
  }

}
export default entReducer;