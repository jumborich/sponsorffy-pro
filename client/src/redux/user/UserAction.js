import { FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE,FETCH_USER_LOGOUT }from './UserActionType'

// Action Creators
export const fetchUserRequest = ()=>({
  type: FETCH_USER_REQUEST ,
  payload: true
})
export const fetchUserSuccess = (user)=>({
  type: FETCH_USER_SUCCESS ,
  payload: user
})

export const fetchUserFailure = (error)=>({
  type: FETCH_USER_FAILURE ,
  payload:error
})

export const fetchUserLogOut = ()=>({
  type: FETCH_USER_LOGOUT
})