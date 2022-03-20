import {FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE, FETCH_USER_LOGOUT} from './UserActionType';


const initialState = {
  loading: false,
  user: {
    testSession:{
      candidateId:"kddd" //used in TestRoute comp
    }
  },
  error:""
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true
      }

    case FETCH_USER_SUCCESS:
      return { 
        ...state, 
        loading: false,
        user: action.payload
      }

    case FETCH_USER_FAILURE:
      return {
        ...state, 
        loading: false,
        user: {},
        error: action.payload
      }

  case FETCH_USER_LOGOUT:
    return {
      ...state,
      user: {},
    }

    default:return state;
  }
}

export default userReducer;