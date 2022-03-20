import {SIGN_UP, LOG_IN, IS_LOGGED_IN, LOG_OUT, FORGOT_PASSWORD, RESET_PASSWORD, UPDATE_PASSWORD} from './AuthActionType';

// Action Creators: Functions that return an object with a type property

export const logIn = (user) =>({
    type:LOG_IN,
    payload:user
});

export const isLoggedIn = (boolType) => {
    return {
        type:IS_LOGGED_IN,
        payload: boolType
    }
}

export const logOut = () => ({
    type:LOG_OUT,
    payload:false  //Will be used to 
})