import "./../../styles/auth.css";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isLoggedIn } from "../../redux/auth/AuthAction";
import { fetchUserSuccess } from "../../redux/user/UserAction";
import checkEmail from "../../utils/CheckEmail";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import MoonLoader from "react-spinners/MoonLoader";
import axios from "axios";
import BaseUrl from "../../config/BaseUrl";
import { LOG_IN } from "../../config/EndPoints";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");

  const [showPassword, setShowPassword] = useState("");
  const [authErrorMessage, setAuthErrorMessage] = useState(""); //Sets error message on login failure.

  const _handleSubmit = (e) => {
    e.preventDefault();
    let _emailErrorMsg = checkEmail(email).message;

    if (authErrorMessage) setAuthErrorMessage("");

    if (_emailErrorMsg) {
      setErrorMessageEmail(_emailErrorMsg);
    } else {
      setErrorMessageEmail("");
    }
    if (!password.length) {
      setErrorMessagePassword("password must not be empty.");
    } else {
      setErrorMessagePassword("");
    }
    if(!checkEmail(email).error && password.length){
      setIsLoading(true);

      // Send off axios POST request to the server
      sendLoginRequest();
    }
  };

  const sendLoginRequest = () => {
    //1) Server side authentication
    axios({
      method: "POST",
      url: `${BaseUrl}${LOG_IN}`,
      data: { email, password},
      withCredentials: true,
    })
    .then((response) =>{
      if (response.data.status === "success"){

        // 1a) Set user object
        dispatch(fetchUserSuccess(response.data.user));

        // 1b) Set auth_key identifier
        typeof window !== "undefined" && localStorage.setItem("auth_key", "#Judithmbonu"); //

        // 2) Set login status
        dispatch(isLoggedIn(true));
        
        // 3) Set loading to false
        setIsLoading(false);

        // 4) Log user in
        navigate("/home", { replace: true});
      }
    })
    .catch((err) => {
      // 5) Stop spinner
      setIsLoading(false);

      // 6) Set the error message
      setAuthErrorMessage(err?.response?.data?.message);

      // 7) Dispatch login status
      dispatch(isLoggedIn(false));
    });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-navbar">
          <p>sponsorffy</p>
        </div>
        <div className="auth-form-container">
          <div className="auth-form-top">
            <p>We will sponsor you to your choice country overseas!</p>
          </div>
          <div className="auth-form-content">
            <div className="form-inputfield">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                name="email"
              />
              <small className="form-inputfield-error">{errorMessageEmail}</small>
            </div>

            <div className="form-inputfield">
              <label htmlFor="password">Password</label>
              <div id="input-pas">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={!showPassword ? "password" : "text"}
                  name="password"
                />
                <div
                  className="show-password-a"
                  onClick={() => setShowPassword(showPassword ? false : true)}
                >
                  {!showPassword ? (
                    <BsEyeSlash size={23} />
                  ) : (
                    <BsEye size={23} />
                  )}
                </div>
              </div>
              <small className="form-inputfield-error">{errorMessagePassword}</small>

              <small className="form-inputfield-error">{authErrorMessage}</small>
            </div>

            <div className="loading-auth">
              {isLoading ? <MoonLoader size={30} color={"#122d7b"} /> : null}
            </div>
          
            <button onClick={e=>_handleSubmit(e)} className="submit-btn login-btn">
              <p>Log in</p>
            </button>
                  
            <p className="OR-delimiter">OR</p>
            
            <NavLink to={{ pathname: '/signup'}}>
              <button className="submit-btn login-btn creat-btn">
              <p>Sign up</p>
              </button>
            </NavLink>

            <div className="auth-contents-ext">
          <div className="forgot-password-a">
              <NavLink to={{ pathname: '/fp'}}> Forgot Password?</NavLink>
          </div>
          </div>
          </div>   
        </div>
        <footer>&#169; {new Date().getFullYear()} sponsorffy Inc.</footer>
      </div>
    </div>
  );
};
export default Login;