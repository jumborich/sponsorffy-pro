import { useState } from "react";
import {NavLink,useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import MoonLoader from "react-spinners/MoonLoader";
import checkPassword from "../../utils/CheckPassword";
import checkEmail from "../../utils/CheckEmail";
import {BsArrowLeft} from 'react-icons/bs';
import axios from 'axios';
import BaseUrl from '../../config/BaseUrl';
import {SIGN_UP} from '../../config/EndPoints';
import {fetchUserSuccess} from '../../redux/user/UserAction';
import {isLoggedIn} from '../../redux/auth/AuthAction';
import {RiArrowRightSLine} from 'react-icons/ri';
import {BsEyeSlash, BsEye} from 'react-icons/bs';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const[next, setNext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [errorMessageFullname, setErrorMessageFullname] = useState("");

  const [errorMessageUsername, setErrorMessageUsername] = useState("");
  const [errorMessagePhone, setErrorMessagePhone] = useState("");
  const [errorMessageCountry, setErrorMessageCountry] = useState("");

  const[showPassword, setShowPassword] = useState("");

  const _handleSubmit = (e) => {
    e.preventDefault();
    
    //validate email and password
    let _passwordErrorMsg = checkPassword(password) && checkPassword(password).message;
   
    // checkPassword(password).error
    setErrorMessagePassword(_passwordErrorMsg);
    // setErrorMessageEmail(_emailErrorMsg);
    if(!phone.length) {
      setErrorMessagePhone('phone number must not be empty.');
    } else {
      setErrorMessagePhone('');
    }
    if(!country.length) {
      setErrorMessageCountry('Select the country you live in.');
    } else {
      setErrorMessageCountry('');

    }
    if(phone.length && country.length && !_passwordErrorMsg){
      setIsLoading(true);

      try {

        sendSignupRequest();

      } catch (error) {
        console.log('trycatchErr:=:',error);
      };
    }
  };

  const sendSignupRequest = () =>{
    axios({
      method: "POST",
      url: `${BaseUrl}${SIGN_UP}`,
      data:{
        email,
        password,
        fullname,
        username,
        phone,
        countryFrom:country
      },
      withCredentials: true
    }).then((response) =>{
      if(response.data.status === 'success'){
        dispatch(fetchUserSuccess(response.data.user));

        localStorage.setItem("auth_key", "Judithmbonu");

        dispatch(isLoggedIn(true));

        // 3) Set loading to false
        setIsLoading(false);

        // 4) Log user in 
        navigate("/home");
      }
    }).catch((error) => {
      console.log('error:==:',error);
    })
  }

  const handleNext = () => {
    // Error check for email, fullname and username
    let _emailErrorMsg = checkEmail(email).message;
    setErrorMessageEmail(_emailErrorMsg);

    if(!fullname.length) {
      setErrorMessageFullname('fullname must not be empty.');
    } else {
      setErrorMessageFullname('');
    }
    if(!username.length) {
      setErrorMessageUsername('username must not be empty.');
    } else {
      setErrorMessageUsername('');
    }

    if(!checkEmail(email).error && username.length && fullname.length) {
      setErrorMessageEmail('');
      setNext(true)
    }
  }

  return (
    <div className="auth-wrapper">
    <div className="auth-container">
      <div className="auth-navbar">
        <p>sponsorffy</p>
      </div>
      {!next ? (
        <div className="auth-form-container form-container-up">
        <div className="auth-form-top">
        <p className="form-step">Signup  1 of 2</p>
        </div>
        <div className="auth-form-content">
          <div className="form-inputfield">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              name="email"
            />
            <small className="form-inputfield-error">{errorMessageEmail}</small>
          </div>

          <div className="form-inputfield">
            <label htmlFor="fullname">Fullname</label>
          
              <input
                name="fullname"
                onChange={(e) => setFullname(e.target.value)}
                value={fullname}
                type="text"
              />
            <small className="form-inputfield-error">{errorMessageFullname}</small>
          </div>

          <div className="form-inputfield">
            <label htmlFor="username">Username</label>
          
              <input
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
              />
            <small className="form-inputfield-error">{errorMessageUsername}</small>
          </div>

          <button 
          type="submit"
           onClick={() => handleNext()}
           className="submit-btn next-btn">
          <p> Next</p>
         <RiArrowRightSLine/>
          </button>
          <div className="auth-contents-ext">
       
        <div className="create-acc-a">
              <p>Have an Account?<span>
              <NavLink to={{ pathname: "/"}}>  Log in</NavLink>
              </span> </p>    
        </div>
        </div>
        </div>   
      </div>

      ):
      (

        <div className="auth-form-container form-container-up">
          <div className="auth-form-top">
          <div className="auth-signup-back"
           onClick={e=>{
            e.preventDefault();
            setNext(!next);
          }}
          >
          <BsArrowLeft/>
          </div>
          <p className="form-step">Signup  2 of 2</p>
          </div>
          <div className="auth-form-content">
            <div className="form-inputfield">
              <label htmlFor="phone">Phone Nunber</label>
              <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="text"
              name="phone"
              />
              <small className="form-inputfield-error">{errorMessagePhone}</small>
            </div>

            <div className="form-inputfield">
              <label htmlFor="phone">Country</label>
              <select className="signup-select-a" defaultValue={'DEFAULT'} data-focusable="true" onChange={(e) => setCountry(e.target.value)}>
		 						<option   disabled value="DEFAULT" disabled >Select the country you live in</option>
              	<option value="Åland Islands">Åland Islands</option><option value="Albania">Albania</option><option value="Algeria">Algeria</option><option value="American Samoa">American Samoa</option><option value="Andorra">Andorra</option><option value="Angola">Angola</option><option value="Afghanistan">Afghanistan</option><option value="Anguilla">Anguilla</option><option value="Antigua &amp; Barbuda">Antigua &amp; Barbuda</option><option value="Argentina">Argentina</option><option value="Armenia">Armenia</option><option value="Aruba">Aruba</option><option value="Australia">Australia</option><option value="Austria">Austria</option><option value="Azerbaijan">Azerbaijan</option><option value="Bahamas">Bahamas</option><option value="Bahrain">Bahrain</option><option value="Bangladesh">Bangladesh</option><option value="Barbados">Barbados</option><option value="Belarus">Belarus</option><option value="Belgium">Belgium</option><option value="Belize">Belize</option><option value="Benin">Benin</option><option value="Bermuda">Bermuda</option><option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option><option value="Bosnia &amp; Herzegovina">Bosnia &amp; Herzegovina</option><option value="Botswana">Botswana</option><option value="Bouvet Island">Bouvet Island</option><option value="Brazil">Brazil</option><option value="British Indian Ocean Territory">British Indian Ocean Territory</option><option value="Brunei">Brunei</option><option value="Bulgaria">Bulgaria</option><option value="Burkina Faso">Burkina Faso</option><option value="Burundi">Burundi</option><option value="Cambodia">Cambodia</option><option value="Cameroon">Cameroon</option><option value="Canada">Canada</option><option value="Cape Verde">Cape Verde</option><option value="Caribbean Netherlands">Caribbean Netherlands</option><option value="Cayman Islands">Cayman Islands</option><option value="Central African Republic">Central African Republic</option><option value="Chad">Chad</option><option value="Chile">Chile</option><option value="Christmas Island">Christmas Island</option><option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option><option value="Colombia">Colombia</option><option value="Comoros">Comoros</option><option value="Congo - Brazzaville">Congo - Brazzaville</option><option value="Congo - Kinshasa">Congo - Kinshasa</option><option value="Cook Islands">Cook Islands</option><option value="Costa Rica">Costa Rica</option><option value="Côte d’Ivoire">Côte d’Ivoire</option><option value="Croatia">Croatia</option><option value="Cuba">Cuba</option><option value="Curaçao">Curaçao</option><option value="Cyprus">Cyprus</option><option value="Czechia">Czechia</option><option value="Denmark">Denmark</option><option value="Djibouti">Djibouti</option><option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option><option value="Ecuador">Ecuador</option><option value="Egypt">Egypt</option><option value="El Salvador">El Salvador</option><option value="Equatorial Guinea">Equatorial Guinea</option><option value="Eritrea">Eritrea</option><option value="Estonia">Estonia</option><option value="Ethiopia">Ethiopia</option><option value="Falkland Islands">Falkland Islands</option><option value="Faroe Islands">Faroe Islands</option><option value="Fiji">Fiji</option><option value="Finland">Finland</option><option value="France">France</option><option value="French Guiana">French Guiana</option><option value="French Polynesia">French Polynesia</option><option value="French Southern Territories">French Southern Territories</option><option value="Gabon">Gabon</option><option value="Gambia">Gambia</option><option value="Georgia">Georgia</option><option value="Germany">Germany</option><option value="Ghana">Ghana</option><option value="Gibraltar">Gibraltar</option><option value="Greece">Greece</option><option value="Greenland">Greenland</option><option value="Grenada">Grenada</option><option value="Guadeloupe">Guadeloupe</option><option value="Guam">Guam</option><option value="Guatemala">Guatemala</option><option value="Guernsey">Guernsey</option><option value="Guinea">Guinea</option><option value="Guinea-Bissau">Guinea-Bissau</option><option value="Guyana">Guyana</option><option value="Haiti">Haiti</option><option value="Honduras">Honduras</option><option value="Hong Kong SAR China">Hong Kong SAR China</option><option value="Hungary">Hungary</option><option value="Iceland">Iceland</option><option value="India">India</option><option value="Indonesia">Indonesia</option><option value="Iran">Iran</option><option value="Iraq">Iraq</option><option value="Ireland">Ireland</option><option value="Isle of Man">Isle of Man</option><option value="Israel">Israel</option><option value="Italy">Italy</option><option value="Jamaica">Jamaica</option><option value="Japan">Japan</option><option value="Jersey">Jersey</option><option value="Jordan">Jordan</option><option value="Kazakhstan">Kazakhstan</option><option value="Kenya">Kenya</option><option value="Kiribati">Kiribati</option><option value="Kosovo">Kosovo</option><option value="Kuwait">Kuwait</option><option value="Kyrgyzstan">Kyrgyzstan</option><option value="Laos">Laos</option><option value="Latvia">Latvia</option><option value="Lebanon">Lebanon</option><option value="Lesotho">Lesotho</option><option value="Liberia">Liberia</option><option value="Libya">Libya</option><option value="Liechtenstein">Liechtenstein</option><option value="Lithuania">Lithuania</option><option value="Luxembourg">Luxembourg</option><option value="Macau SAR China">Macau SAR China</option><option value="Macedonia">Macedonia</option><option value="Madagascar">Madagascar</option><option value="Malawi">Malawi</option><option value="Malaysia">Malaysia</option><option value="Maldives">Maldives</option><option value="Mali">Mali</option><option value="Malta">Malta</option><option value="Marshall Islands">Marshall Islands</option><option value="Martinique">Martinique</option><option value="Mauritania">Mauritania</option><option value="Mauritius">Mauritius</option><option value="Mayotte">Mayotte</option><option value="Mexico">Mexico</option><option value="Micronesia">Micronesia</option><option value="Moldova">Moldova</option><option value="Monaco">Monaco</option><option value="Mongolia">Mongolia</option><option value="Montenegro">Montenegro</option><option value="Montserrat">Montserrat</option><option value="Morocco">Morocco</option><option value="Mozambique">Mozambique</option><option value="Namibia">Namibia</option><option value="Nauru">Nauru</option><option value="Nepal">Nepal</option><option value="Netherlands">Netherlands</option><option value="New Caledonia">New Caledonia</option><option value="New Zealand">New Zealand</option><option value="Nicaragua">Nicaragua</option><option value="Niger">Niger</option><option value="Nigeria">Nigeria</option><option value="Niue">Niue</option><option value="Norfolk Island">Norfolk Island</option><option value="Northern Mariana Islands">Northern Mariana Islands</option><option value="Norway">Norway</option><option value="Oman">Oman</option><option value="Pakistan">Pakistan</option><option value="Palau">Palau</option><option value="Palestinian Territories">Palestinian Territories</option><option value="Panama">Panama</option><option value="Papua New Guinea">Papua New Guinea</option><option value="Paraguay">Paraguay</option><option value="Peru">Peru</option><option value="Philippines">Philippines</option><option value="Pitcairn Islands">Pitcairn Islands</option><option value="Poland">Poland</option><option value="Portugal">Portugal</option><option value="Puerto Rico">Puerto Rico</option><option value="Qatar">Qatar</option><option value="Réunion">Réunion</option><option value="Romania">Romania</option><option value="Russia">Russia</option><option value="Rwanda">Rwanda</option><option value="Samoa">Samoa</option><option value="San Marino">San Marino</option><option value="São Tomé &amp; Príncipe">São Tomé &amp; Príncipe</option><option value="Saudi Arabia">Saudi Arabia</option><option value="Senegal">Senegal</option><option value="Serbia">Serbia</option><option value="Seychelles">Seychelles</option><option value="Sierra Leone">Sierra Leone</option><option value="Singapore">Singapore</option><option value="Sint Maarten">Sint Maarten</option><option value="Slovakia">Slovakia</option><option value="Slovenia">Slovenia</option><option value="Solomon Islands">Solomon Islands</option><option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option><option value="South Georgia &amp; South Sandwich Islands">South Georgia &amp; South Sandwich Islands</option><option value="South Korea">South Korea</option><option value="Spain">Spain</option><option value="Sri Lanka">Sri Lanka</option><option value="St. Barthélemy">St. Barthélemy</option><option value="St. Helena">St. Helena</option><option value="St. Kitts &amp; Nevis">St. Kitts &amp; Nevis</option><option value="St. Lucia">St. Lucia</option><option value="St. Martin">St. Martin</option><option value="St. Pierre &amp; Miquelon">St. Pierre &amp; Miquelon</option><option value="St. Vincent &amp; Grenadines">St. Vincent &amp; Grenadines</option><option value="Suriname">Suriname</option><option value="Swaziland">Swaziland</option><option value="Sweden">Sweden</option><option value="Switzerland">Switzerland</option><option value="Taiwan">Taiwan</option><option value="Tajikistan">Tajikistan</option><option value="Tanzania">Tanzania</option><option value="Thailand">Thailand</option><option value="Timor-Leste">Timor-Leste</option><option value="Togo">Togo</option><option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option><option value="Trinidad &amp; Tobago">Trinidad &amp; Tobago</option><option value="Tunisia">Tunisia</option><option value="Turkey">Turkey</option><option value="Turkmenistan">Turkmenistan</option><option value="Turks &amp; Caicos Islands">Turks &amp; Caicos Islands</option><option value="Tuvalu">Tuvalu</option><option value="U.S. Virgin Islands">U.S. Virgin Islands</option><option value="Uganda">Uganda</option><option value="Ukraine">Ukraine</option><option value="United Arab Emirates">United Arab Emirates</option><option value="United Kingdom">United Kingdom</option><option value="United States">United States</option><option value="Uruguay">Uruguay</option><option value="Uzbekistan">Uzbekistan</option><option value="Vanuatu">Vanuatu</option><option value="Vatican City">Vatican City</option><option value="Venezuela">Venezuela</option><option value="Vietnam">Vietnam</option><option value="Wallis &amp; Futuna">Wallis &amp; Futuna</option><option value="Yemen">Yemen</option><option value="Zimbabwe">Zimbabwe</option>
              </select>
              <small className="form-inputfield-error">{errorMessageCountry}</small>
            </div>
            <div className="form-inputfield">
              <label htmlFor="email">Password</label>
              <div id="input-pas">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={!showPassword ? "password" : "text"}
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
            </div>

            <div className="loading-auth">
              {isLoading && <MoonLoader size={30} color={"#122d7b"} />}
            </div>

            <button className="submit-btn sign-up-btn" type="submit" onClick={(e) => _handleSubmit(e)}>
              <p>Sign up</p>
            </button>
            <div className="auth-contents-ext">
            <p className="signup-agreement-a">
                  By signing up, you agree to our 
                <NavLink 
                target="_blank" 
                 to={{ pathname: '/tos', state: { prevPath: 'signup' } }}
                  >
                  <span>  Terms of Service</span></NavLink> and 
                  <NavLink 
                  target="_blank" 
                to={{ pathname: '/privacy', state: { prevPath: 'signup' } }}
                  ><span> Privacy Policy.</span></NavLink> 
                </p>
          </div>
          </div>   
        </div>
      )
      }
      <footer>&#169; {new Date().getFullYear()} sponsorffy Inc.</footer>
    </div>
  </div>
  );
};

export default Signup;