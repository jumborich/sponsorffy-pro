import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/auth.css";
import {BsArrowLeft} from 'react-icons/bs';
// import MoonLoader from "react-spinners/MoonLoader";
import { FaUserLock } from "react-icons/fa";

const ForgotPassword = (props) => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState("");
  const _handleSubmit = (e) => {
    e.preventDefault();
    //validate email and password
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-navbar">
          <p>Sponsorffy</p>
        </div>
        <div className="auth-form-container">
          <div className="auth-form-top">
            <FaUserLock size={70} />

            <p>Trouble Logging In?</p>
            <span  className="auth-form-des">
              Enter your <span>email </span>or  <span> phone number</span> and we'll send you a link to get
              back into your account.
            </span>
          </div>
          <div className="auth-form-content">
            <input
              onChange={(e) => setCredentials(e.target.value)}
              value={credentials}
              type="text"
              placeholder="email or phone number"
            />

            <button 
            onClick={(e) => _handleSubmit(e) }
            className="submit-btn">
             <p>  Send </p>
            </button>

            <span className="divider-form">or</span>
            <button 
            onClick={() => navigate('/signup')}
            className="submit-btn">
            <p>   Create Account</p>
            </button>

            <div
              onClick={() => navigate('/')}
             className="auth-prev-btn">
            <BsArrowLeft/>
              <p>Back to Login</p>
            </div>

          </div>
        </div>
        <footer>
        &#169; {new Date().getFullYear()} sponsorffy Inc.
        </footer>
      </div>
    </div>
  );
};

export default ForgotPassword;
