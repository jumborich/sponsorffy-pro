import _useAxios from "./_useAxios";
import {useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';
import { setUploadResponse } from "../redux/navBar/NavActions";
const endPoint = "posts/media/upload";

const handleMedia = (file, fieldName, dispatch) =>{

  const {size="", type=""} = file;

  // <-------- IMAGE ------------>
  if(type.startsWith("image")){

    // Check file type for only jpeg/jpg and png,webp
    const supportedMimes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if(!supportedMimes.includes(type)){
      return dispatch(setUploadResponse({error:"We only support png, webp and jpg/jpeg"})) 
    };
  
    // Check file size for less than 20mb
    if(size > 20 * 1000 * 1000){
      return dispatch(setUploadResponse({error:"Too large! Image must not exceed 20mb"}))
    };
    // Upload file to server here...
    uploadToServer(file, fieldName, dispatch)
  }

  // <-------- VIDEO ------------>
  if(type.startsWith("video")){
    
    // Mime type check
    const supportedMimes = ["video/mp4"];
    if(!supportedMimes.includes(type)){
      return dispatch(setUploadResponse({error:"We only support mp4"}))
    };

    // file size check: max=100mb
    if(size > 100 * 1000 * 1000){
      return dispatch(setUploadResponse({error:"Too large! video must be less than 100mb."}))
    };
    
    // file duration check :duration must not exceed 35secs
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file)
    video.ondurationchange = () =>{
      URL.revokeObjectURL(video.src);
      const duration = Math.floor(video.duration);
      
      if(duration < 5 || duration > 30){
        return dispatch(setUploadResponse({error:"Your video must be between 5 and 30 seconds"})) 
      }else{
        // Upload file to server here...
        dispatch(setUploadResponse({ success:{thumb:true} })); 
        uploadToServer(file, fieldName, dispatch)
      }
    }
  };
}

// Uploads media file to server
export const uploadToServer = (file, fieldName, dispatch, req)=>{
  let formData;
  if(req && req.ORDER === "FINAL"){ //Video processing phase 2
    formData = {media_id:req.media_id, post_id:req.post_id};
  }
  else{
    if(!req){
      formData = new FormData();
      formData.append("media", file, fieldName);
    }
  }

  _useAxios("POST", formData, endPoint).then((res) =>{
    if(res){
      if(res.data.video && res.data.video.ORDER === "FINAL")  return null; //No response needed for this phase
      dispatch(
        setUploadResponse({ success:res.data })
      )
    }
  })
  .catch((err) =>{
    if(err && err.response){
      console.log(err)
      console.log(err.response)
      dispatch(
        setUploadResponse({error:err.response?.data?.message})
      )
    }
  });
};

// Will handle callback request for video ABR transcoding
export const FulfillABR =()=> {
  const dispatch = useDispatch();
  const { uploadResponse} = useSelector(state => state.navBar);

  useEffect(() =>{
    const { video } = uploadResponse.success;
    if( video && video.ORDER === "FINALE"){
      uploadToServer("", "", dispatch, {media_id:video.media_id, post_id:video.post_id, ORDER:"FINAL"});

      // Reset uploadResponse
      dispatch(setUploadResponse({ error:"", success:{video:null, image:null, thumb:""}})) 
    }
  }, [uploadResponse.success])

  return null;
}

export default handleMedia;