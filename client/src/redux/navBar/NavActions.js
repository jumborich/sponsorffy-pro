import {SET_UPLOAD, SET_CURRENT_COMPONENT, SET_ERR_MESSAGE, SET_UPLOAD_RESPONSE} from './NavActionTypes';

export const setUpload = (upload) => ({
  type: SET_UPLOAD,
  upload
});

export const setUploadResponse = (response={}) => ({
  type: SET_UPLOAD_RESPONSE,
  payload: response
});

export const setCurrentComponent = (component) => { 
  return {
    type:SET_CURRENT_COMPONENT,
    component
  }
};

export const setModal = (modalType,payload)=>{
  return {
    type:`SET_${modalType.toUpperCase()}_MODAL`,
    payload
  }
};

export const setErrMesage = (payload)=>{
  return {
    type:SET_ERR_MESSAGE,
    payload
  }
};