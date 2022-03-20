import{ 
  FETCH_USER_POST,
  FETCH_USER_TEST,
  SET_USER_POST_CURSOR, 
  SET_USER_TEST_CURSOR, 
  IS_FETCHING_POST,
  IS_FETCHING_TEST,
  SAVE_POST_IDS, 
  SET_IS_MODAL,
} from "./ActionType"

const initState = {
  shared: {isModal:false,modalItem:{}},

  test:{nextCursor: null, tests: [], isfecthing: true},

  post:{nextCursor: null, posts: [], postIdSaver:[], isfecthing: true},
};

const profileReducer = (state =initState, action)=>{
  switch (action.type) {

    case FETCH_USER_POST:
      return{
        ...state, post:{...state.post, posts:action.payload}
      }
  
    case FETCH_USER_TEST:
      return{
        ...state, test:{...state.test, tests:action.payload}
      }
    
    case IS_FETCHING_POST:
      return{
      ...state, post:{...state.post, isFetching:action.payload}
      }

    case IS_FETCHING_TEST:
      return{
      ...state, test:{...state.test, isFetching:action.payload}
      }

    case SET_USER_POST_CURSOR:
      return{
        ...state, post:{...state.post, nextCursor:action.payload}
      }
    
    case SET_USER_TEST_CURSOR:
      return{
        ...state, test:{...state.test, nextCursor:action.payload}
      }
    
    case `${SAVE_POST_IDS}_PROFILE`:
      return{
        ...state, post:{...state.post,postIdSaver:action.payload }
      }

    case SET_IS_MODAL:
      return{
        ...state, 
        shared:{
          ...state.shared,
          isModal:action.payload.isModal, 
          modalItem:action.payload.modalItem
        }
      }
    default:return state;
  }
}

export default profileReducer;