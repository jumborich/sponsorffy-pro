import {useState, useEffect, useRef} from "react";
import BackDrop from "../backdrop";
import { AiOutlineClose } from "react-icons/ai";
import _useAxios from "../../../utils/_useAxios";
import { UploadSpinner } from "../../../utils/Loader";
import { useNavigate } from "react-router-dom"
import {useSelector,useDispatch} from 'react-redux';
import ProfileAction from "../../../redux/profile/action";
import { uploadToServer } from "../../../utils/handleMediaUpload";
import { fetchPosts, showAlert } from "../../../redux/utils/postActions";
import { fetchUserSuccess } from "../../../redux/user/UserAction"
import {setUpload,setModal, setUploadResponse} from "../../../redux/navBar/NavActions";

const getMedia = (type,url,videoRef)=>{
  if(type){
    switch(type.split('/')[0]){
      case "image":
        return <img src={url} alt="user post"/>;

      default:
        return  <video ref={videoRef} controls muted   playsInline  src={url}/>
    }
  }
  return ""
};

const selectOptions = (component) => {
  const entOpt = ['Singing', 'Rap', 'Dance', 'Comedy', 'Acting', 'Modeling', 'Poetry', 'Any Other']
  const handworkOpt = ['Cooking', 'Driving', 'Fishing','Farming','Fashion Design','Visual Arts','Photography','Hair','Any Other']
  const sportsOpt = ['Athletics', 'Soccer', 'BasketBall', 'Tennis', 'Fitness', 'VolleyBall', 'Any Other'];
  if(component === "entertainment") return entOpt;
  if(component === "handwork") return handworkOpt;
  if(component === "sports") return sportsOpt;
  return []
};

const DisplayUploadError =()=>{
  const { uploadResponse } = useSelector(state => state.navBar);
  return(
    uploadResponse.error? 
    <div className="media-upload-error">
      WARNING: { uploadResponse.error }
    </div>
    :null
  )
};

const FORM = ({ closeModal, setIsSubmitted }) =>{
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [postBody, setPostBody] = useState(null);

  const [formFieldErr, setFormFieldErr] = useState({subCategory:false,title:false, message:""});
  const { user } = useSelector(state => state.user);
  const { uploadResponse, component} = useSelector(state => state.navBar);
  const { posts } = useSelector((state) => component && component !=="academia" ? state[component]:{});
  const {error, success} = uploadResponse;
  const [title, setTitle] = useState("");
  const [isFocus, setIsFocus] = useState("");

  useEffect(()=>{
    dispatch(
      setUploadResponse({...uploadResponse, error:formFieldErr.message})
    )
  },[formFieldErr.message]);

  // Only createPost when media_ids are ready
  useEffect(() => {
    if(postBody !== null){
      let body = {};
      if(success.thumb){
        if(success.video && success.image){ // Video uploads
          body = {
            ...postBody,
            fileType:"video",
            media_id:{video:success.video.media_id, image:success.image.media_id},
            ORDER:success.video.ORDER, //Determines video compression phase
          };
  
          uploadPloast(body)
        }
      }
      else{
        if(success.image){ // Image uploads
          body = {
            ...postBody,
            fileType:"image",
            media_id:{image:success.image.media_id}
          }
  
          uploadPloast(body)
        }
      }    
    }
  }, [uploadResponse.success, postBody]);

  const uploadPloast = (postBody) =>{
    _useAxios("POST", postBody, "posts").then(res =>{  
      
      setPostBody(null) // reset upload body
      setSubmitted(false) //Used by current comp.
      setIsSubmitted(false) //For Parent component

      // Merge created post with already cached posts
      dispatch(fetchPosts([res.data.post, ...posts], component.toUpperCase()));

      // Update user's isContestant in local cache 
      dispatch(fetchUserSuccess({...user, isContestant: true}));

      const toastCallBack = () =>{
        // Set largeView for test results viewing
        new ProfileAction(dispatch).setIsModal(true, res.data.post);

        const profileUrl = user.username.split(" ").join("");
        navigate(
          `/${profileUrl}`,
        {
          state:{
            id:user._id,
            profileTab:"post"
          }
        }
        );
      }

      closeModal();

      // Go for the final phase of video transcoding
      if(res.data.ORDER === "INIT"){
        dispatch(setUploadResponse({ error:"", success:{video:{ORDER:"FINALE", media_id:res.data.media_id, post_id:res.data.post.id}}}))
      }else{
        dispatch(setUploadResponse({ error:"", success:{video:null, image:null, thumb:""}})) // Reset uploadResponse
      }

      dispatch(showAlert({main:"Post uploaded.", subMain:"View", alertName:"upload", onClick:toastCallBack}, component));
    
    }).catch(err =>{
      setFormFieldErr(prev => ({...prev, message: err.response.data.message}))
    });
  }

  const handleSubmit = (e) =>{
    e.preventDefault()

    const{ subCategory } = e.target;

    if(!title && subCategory.value ==="Default"){
      return setFormFieldErr({title:true,subCategory:true, message:"Category and title fields are required!"})
    }
    else{
      setFormFieldErr({title:false,subCategory:false, message:""})
    };

    if(subCategory.value ==="Default") return setFormFieldErr({title:false,subCategory:true, message:"Category is required!"})

    if(!title) return setFormFieldErr({title:true,subCategory:false, message:"Title is required!"});

    setSubmitted(true) //Used by current comp.
    setIsSubmitted(true) //For Parent component
    setPostBody({
      title,
      category:component,
      subCategory:subCategory.value
    });
  };

  const handleFormErr =(e)=>{
    const { name } = e.target;
    setFormFieldErr(prev =>{
      prev = { ...prev, [name]:false}
      if(!prev.title && !prev.subCategory) prev.message=""; 
      return prev
    })
  }

  return(
    <form onSubmit={handleSubmit} onChange={handleFormErr}>
    <div className="uploadModal-formInputs">
      <select 
      name="subCategory" 
      disabled={(submitted)? true:false}
      className={formFieldErr.subCategory? "empty-field":null}
      defaultValue={"Default"}
      >
        <option value="Default" disabled>Select category</option>
        {selectOptions(component).map((option, index) =><option key={index.toString()} value={option.toLocaleLowerCase()}>{option}</option>)}
      </select>
      <input 
      type="text" 
      name="title"
      value={title} 
      placeholder="Add a title" 
      onFocus={() => setIsFocus(true)}
      onChange={({ target }) =>{
        if(target.value.length > 30) return; 
        setTitle(target.value)
      }}
      disabled={submitted? true:false}
      className={formFieldErr.title? "empty-field":null} 
      />
      </div>
      {isFocus? <div className={`post-title-char-count ${title.length >29? "char-count-red":null}`}> {title.length}/30 </div> :null}
      <div className="uploadModal-formBtn">
        <button disabled={(error || submitted)? true:false}>
        <p>Submit</p>
        </button>
      </div>
    </form>
  )
};

// Will process video files
const HandleVidUpload = ({ videoRef, src }) =>{
  const dispatch = useDispatch();
  const { uploadResponse } = useSelector(state => state.navBar);
  const video = document.createElement("video"); //Create vid elem for grabbing thumbnail

  if(uploadResponse.success.thumb){
    getPoster();
  }

  // Grabs uploaded video thumbnail and sends to server 
  function onVideoLoad({ target }){
    const canvas = document.createElement("canvas");
    canvas.width = target?.videoWidth
    canvas.height = target?.videoHeight;
    canvas.getContext("2d").drawImage(target, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob =>{
      if(!videoRef.current || videoRef.current.blob) return  //Avoids double-run
      videoRef.current.blob = blob;
      uploadToServer(blob, "video-thumb", dispatch); // Send to server

      video?.removeEventListener("loadeddata",onVideoLoad);
    }), "image/jpeg", .27);
  }

  function getPoster(){
    video.preload = "metadata";
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.play().then(() =>{}).catch(e =>{});
    video.addEventListener("loadeddata",onVideoLoad);
  };

  return null
}

const UploadModal = ({ isUploadModal }) => {
  const dispatch = useDispatch();
  const upload = useSelector(state => state.navBar.upload);
  const [submitted, setIsSubmitted ] = useState(false);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");

  const videoRef = useRef(null);

  useEffect(() => {
    if(upload){ 
      setType(upload.type)
      setUrl(URL.createObjectURL(upload))
    };
  },[upload]);

  const closeModal = () => {
    URL.revokeObjectURL(url);
    dispatch(setUpload(""));
    dispatch(setModal("upload", false));
    dispatch(setUploadResponse({error:"", success:{}}));
  };

  return (
    <BackDrop isModal={isUploadModal} handleModal={closeModal} overflow={submitted?"backdrop-overflow":null}>
      <div className="uploadModal-container">
        <div className="uploadModal-closeBtn" onClick={closeModal}>
          <button onClick={closeModal}>
            <AiOutlineClose size={20}/>
          </button>
        </div>
        <div className="uploadModal-contents">
          <DisplayUploadError/>
          <div className="uploadModal-media">
          {upload ? getMedia(type, url, videoRef): ""}
          </div>
          <div className="uploadModal-forms">
          <FORM closeModal={closeModal} setIsSubmitted={setIsSubmitted}/>
          </div>
        </div>
      </div>
      <UploadSpinner canSpin={submitted}/> 
      {type ==="video/mp4"?<HandleVidUpload videoRef={videoRef} src={url}/>: null}
    </BackDrop>
  );
};
export default UploadModal;