import {logOut} from '../../redux/auth/AuthAction';
import {fetchUserLogOut} from '../../redux/user/UserAction';
import BaseUrl from '../../config/BaseUrl';
import {LOG_OUT} from '../../config/EndPoints';
import axios from 'axios';

const Logout = (dispatch,navigate) => {
  axios({ method:'GET',  url:`${BaseUrl}${LOG_OUT}`,  withCredentials:true })
  .then(resp=>{})
  .catch(err=>{ if(err)alert('error', 'Error logging out! Try again.')});

  dispatch(logOut()); 
  dispatch(fetchUserLogOut());
  localStorage.removeItem("auth_key");
  navigate("/", { replace: true});
};

export default Logout