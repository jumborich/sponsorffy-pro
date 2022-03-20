import { useState, useEffect } from "react";
import { useSelector, useDispatch} from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./../Modal/confirmation_modal";
import _useAxios from "../../utils/_useAxios";
import handleMedia from "../../utils/handleMediaUpload";
import { fetchUserSuccess } from "../../redux/user/UserAction";
import { AVATAR, defaultAvatar } from "../../utils/imageParams";

const Account = ( ) => {
  let { user } = useSelector((state) => state.user);
  // const DESTINATIONS = ["Australia", "Canada", "UK", "USA"];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isModal, setIsModal] = useState(false);

  //   user info
  const [avatarUrl, setAvatarUrl] = useState(user.photo);
  let   [avatarFile, setAvatarFile] = useState("");
  const [uploadResp, setUploadResp] = useState({error: "", success: ""});
  const [updateResp, setUpdateResp] = useState({error: "", success: ""});
  const [formValues, setFormValues] = useState({});
  const [username, setUserName] = useState(user.username);
  const [fullname, setFullName] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [countryTo, setCountryTo] = useState(user.countryTo);
  const [countryFrom, setCountryFrom] = useState(user.countryFrom);

  // logout user
  useEffect(() => {
    if (isLoggedOut) {
      setIsLoggedOut(false);

      // 2) Push user to the login page :if(!isUserLoggedIn):
      navigate("/login", { replace: true });
    }
  });

  const removeWarning =()=>{
    setUploadResp({});
    setUpdateResp({});
  }
  // Upload error
  useEffect(() => {
    if(!updateResp.success && !uploadResp.success) return;

    const timerId = setTimeout(() => {
      removeWarning();
      clearTimeout(timerId);
    },3100);

    if(uploadResp.success){
      const {media_id, fileType} = uploadResp.success;
      setFormValues(prevFormVals => ({ ...prevFormVals, media_id, fileType}))
    }

    return() =>clearTimeout(timerId);
  },[uploadResp, updateResp.success]);

  // Image upload
  const onImageUpload = (e)=>{
    const imgFile = e.target.files[0];
    if(!imgFile) return;

    removeWarning();

    handleMedia(imgFile, "avatar", setUploadResp);

    const imgUrl = window.URL.createObjectURL(imgFile);
    setAvatarUrl(imgUrl);
    setAvatarFile(imgFile)
  }

  const trackFormChanges = ({ name, value }) =>{

    if(name === "countryTo") return; //Add select tag for DESTINATION on new app version
    const initVal = user[name];

    if(value === "") value = initVal;

    // Set new value changes to state
    setFormValues(prevFormVals =>{
      return {...prevFormVals, [name]:value }
    })

    // Remove unchanged values from state
    if(value.toLowerCase() === initVal.toLowerCase()){
      setFormValues(prevFormVals =>{
        const newState = {...prevFormVals};
        delete newState[name];
        return newState 
      })
    }
  };

  const saveChanges = ()=>{
    // Check for form Change or avatar change
    if(Object.keys(formValues).length > 0){

      // Remove defaultAvatar val in formValues if it exists
      if(avatarUrl !== defaultAvatar && formValues.defaultAvatar){
        delete formValues.defaultAvatar
      }

      _useAxios("PATCH", formValues, "users/updateMe").then((resp) =>{
        setUpdateResp({error:"", success:true});
        setFormValues({})
        dispatch(fetchUserSuccess(resp.data.user));

      }).catch((err) => setUpdateResp({error:err.response.data.message, success:""}));
    }
  }

  return (
    <div className="account-wrapper">
      <div className="account-container">
        <div className="account-top">
          {
            avatarFile ? 
            <img src={avatarUrl} alt={`Avatar of ${user.username}`}/> : 
            <AVATAR src={avatarUrl} alt={`Avatar of ${user.username}`} isLargeAvatar={true}/>
          }
          <div className="account-top-btn">
            <label htmlFor="uploadAvatar">
              <AiOutlineCamera size={18} />
              change avatar
            </label>
            <input
              type="file"
              id="uploadAvatar"
              accept="image/*"
              name="media"
              onChange={onImageUpload}
              onClick={(e)=>e.target.value = null}
            />
          </div>
          {
            avatarUrl === defaultAvatar? null:
            <button 
            className="account-top-remove"
            onClick={()=>{
              setAvatarUrl(defaultAvatar);
              removeWarning();
              // Only add to form if user doesn't use default avatar
              if(user.photo !== defaultAvatar){
                setFormValues(prev => ({...prev, defaultAvatar}))
              }
            }}>
            Remove
            </button>

          }
        </div>

        { uploadResp.error && <div className="change-avatar-error">{uploadResp.error}</div> }
        { updateResp.success && <div className="feed-upload-success update-profile-success">Profile updated!</div> }
        { updateResp.error && <div className="change-avatar-error">{updateResp.error}</div> }

        <div className="account-forms">
          <form onChange={({target })=>trackFormChanges(target)}>
            <div className="account-form-input">
              <label htmlFor="username">Username</label>
              <input
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                name="username"
              />
            </div>
            <div className="account-form-input">
              <label htmlFor="fullname">fullname</label>
              <input
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                name="fullname"
              />
            </div>
            <div className="account-form-input">
              <label htmlFor="email">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
              />
            </div>
            <div className="account-form-input">
              <label htmlFor="phone">Phone Number</label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                name="phone"
              />
            </div>
            <div className="account-form-input">
              <label htmlFor="countryFrom">Current Country</label>
              <input
                value={countryFrom}
                onChange={(e) => setCountryFrom(e.target.value)}
                type="text"
                name="countryFrom"
              />
            </div>
            <div className="account-form-input">
              <label htmlFor="countryTo">Destination</label>
              <input
                value={countryTo}
                onChange={(e) => setCountryTo(e.target.value)}
                type="text"
                name="countryTo"
              />
            </div>
          </form>
          <div className="account-del-bottom">
            <h6>Delete Account</h6>
            <div className="account-del-action">
              <p>
                Lorem ipsum dolor sit, amet consectetur fficia aliquam suscipit
                praesentium voluptatibus vel voluptates rem quaerat illo nam b
                landitiis nisi rerum excepturi perspiciatis?
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsModal(true);
                }}
              >
                Delete Account
              </button>
            </div>
          </div>

          <div className="account-changes-btn">
            <button onClick={saveChanges} disabled={uploadResp.error? true:false}>
              <p>Save Changes</p>
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal isModal={isModal} handleModal={setIsModal} />
    </div>
  );
};

export default Account;