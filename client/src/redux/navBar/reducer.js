import {SET_UPLOAD,SET_TEST_MODAL,SET_UPLOAD_MODAL, SET_DRAWER_MODAL, SET_CURRENT_COMPONENT,SET_ERR_MESSAGE, SET_UPLOAD_RESPONSE} from './NavActionTypes';

const initState ={
  upload:'', //File from user device
  uploadResponse:{error:"", success:{video:null, image:null, thumb:false}}, //Response from file upload (server and client)
  component:'',
  error:{type:"", message:"", errAction:false},
  isTestModal:false,
  isUploadModal:false,
  isDrawerModal:false
};

const navReducer = (state = initState, action) =>{
  switch (action.type) {
    case SET_UPLOAD:
      return {
        ...state,
        upload: action.upload
      }

    case SET_UPLOAD_RESPONSE: //Payload is an object
      const keys = Object.keys(action.payload), key = keys[0];
      const value = action.payload[key];
      let { uploadResponse } = state;

      if(keys.length > 1){
       uploadResponse = {...uploadResponse, ...action.payload} //If both err and success provided

      }
      else{
        if(key === "success"){
          uploadResponse.success = {
            ...uploadResponse.success, 
            ...value
          }
        }
        else{
          uploadResponse.error= value
        }
      };
      
      return {...state, uploadResponse};

    case SET_TEST_MODAL:
      return {
        ...state,
        isTestModal:action.payload
      }

    case SET_UPLOAD_MODAL:
      return {
        ...state,
        isUploadModal:action.payload
      }
        
    case SET_DRAWER_MODAL:
      return {
        ...state,
        isDrawerModal:action.payload
      }
        
    case SET_CURRENT_COMPONENT:
      return {
        ...state,
        component: action.component
      }

    case SET_ERR_MESSAGE:
      return {
        ...state,
        error: action.payload
      }
        
    default:
      return state;
  }
};
export default navReducer