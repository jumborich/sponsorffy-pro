import {useSelector} from 'react-redux';
import { BiArrowBack } from "react-icons/bi";
import {useNavigate} from 'react-router-dom';
import { AVATAR } from "../../utils/imageParams";

const SponsorTv = () => {

  const navigate = useNavigate();
  const{user} = useSelector(state => state.user);

  return (
    <div className="media-wrapper">
      <div className="media-container">
        <div className="media-container-top">
          <div className="media-arrow-back">
            <button onClick={()=>{
              navigate(-1);
            }}>
              <BiArrowBack />
            </button>
          </div>
          <div className="media-logo">
            
          </div>
          <div className="media-user">
          <AVATAR
          src={user.photo} 
          alt={`Avatar of ${user.username}`}
          />
          </div>
        </div>
        <div className="media-video">
          <video controls autoPlay muted={true} playsInline={true} poster="https://images.unsplash.com/photo-1605310868366-50faea41f618?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" className="" src=""/>
        </div>
      </div>
    </div>
  );
};

export default SponsorTv;