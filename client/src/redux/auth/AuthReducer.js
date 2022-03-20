import {IS_LOGGED_IN, LOG_IN, LOG_OUT, SIGN_UP, FORGOT_PASSWORD, RESET_PASSWORD, UPDATE_PASSWORD} from './AuthActionType'

const initAuthState = {
  isUserLoggedIn: false,
  user:{}
};

 const authReducer = (state = initAuthState, action)=>{

  switch(action.type) {
    case IS_LOGGED_IN:
      return {
        ...state,
        isUserLoggedIn:action.payload
      };

    case LOG_IN:
      return {
        ...state,
        user:action.payload
      };

    case LOG_OUT:
      return {
        ...state,
        isUserLoggedIn:action.payload
      }

    default:return state;
  }
};

export default authReducer