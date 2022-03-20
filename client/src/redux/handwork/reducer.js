import {FETCH_POSTS,NEXT_CURSOR, POSTS_FINISHED,SAVE_POST_IDS, SHOW_ALERT,SAVE_SCROLL_POSITION} from '../utils/postActionTypes';

const initState = {
    loading: false,
    nextCursor:"",
    postsFinished:false,
    posts: [],
    postIdSaver:[], //this is used to push the id of every post the current user upvotes - This will enable the simulation of upvote-to-upvoted instead of relying on DB.
    scrollPosition:0,
    alertMessage:{
      main:"",
      subMain:"",
      onclick:null //Will be a callback  function if passed
    }
}

const handworkReducer = (state =initState, action) =>{

    switch (action.type){

        case `${FETCH_POSTS}_HANDWORK`:
            return {
                ...state,
                posts:action.payload,
                loading:false
            }

        case `${NEXT_CURSOR}_HANDWORK`:
            return {
                ...state,
                nextCursor: action.payload
            }

        case `${POSTS_FINISHED}_HANDWORK`:
            return {
                ...state,
                postsFinished:action.payload
            }

        case `${SAVE_POST_IDS}_HANDWORK`:
            return {
                ...state,
                postIdSaver:action.payload
            }

        case `${SHOW_ALERT}_HANDWORK`:
          return {
            ...state,
            alertMessage:action.payload
          }

        case `${SAVE_SCROLL_POSITION}_HANDWORK`:
            return {
                ...state,
                scrollPosition:action.payload
            }

        default:return state
    }

}

export default handworkReducer;