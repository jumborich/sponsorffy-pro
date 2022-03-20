import BackDrop from "../backdrop"; 
import {useSelector} from 'react-redux';
import { motion } from "framer-motion";
import { RiCoinsLine,RiAccountCircleLine } from "react-icons/ri";
import {useNavigate} from 'react-router-dom';
import {BiCheckShield,BiLockAlt} from 'react-icons/bi';
import {BsClipboard} from 'react-icons/bs';
import { AiOutlineLogout,AiOutlineInfoCircle} from "react-icons/ai";
import DrawerItem from "./drawer_item";
import {IoIosHelpCircleOutline} from 'react-icons/io';
import {SiAirplayvideo} from "react-icons/si"
import { AVATAR } from "../../../utils/imageParams" 

const variants = {
  visible: {
    x:"-250px",
    opacity:1,
    transition:{
      // duration:0.34,
      ease:"easeInOut"
    }
  },
  hidden: {
   x:"250px",
   opacity:0,
   ease:"easeInOut"
  },
};

const Drawer = (props) => {
  const navigate = useNavigate();
  const{user} = useSelector(state => state.user);

  return (
    <BackDrop isModal={props.isModal} handleModal={props.handleModal}>
      <motion.div 
        animate={props.isModal ? "visible":"hidden"}
       variants={variants}
       className="drawer-nav-container">
        <div className="drawer-nav-contents">
          <div className="drawer-nav-contents-top">
            <div
            onClick={()=>{
              const profileUrl =user.username.split(" ").join("");
              navigate(`/${profileUrl}`,{state:{id:user._id}});
            }}
             className="drawer-nav-profile">
              <AVATAR src={user.photo} alt={`Avatar of ${user.username}`} isLargeAvatar={true}/>
              <p>{user.fullname}</p>
            </div>
          </div>
          <div className="drawer-nav-extra">
            <div className="drawer-nav-items">
              <DrawerItem to="/sponsorfy-tv" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <SiAirplayvideo />
                  </span>
                  <p>sponsorffy.Tv</p>
                </div>
              </DrawerItem>

              <DrawerItem to="/coins" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <RiCoinsLine/>
                  </span>
                  <p>Buy Coins</p>
                </div>
              </DrawerItem>
    
              <DrawerItem to="/settings" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <RiAccountCircleLine />
                  </span>
                  <p>Account</p>
                </div>
              </DrawerItem>
              <DrawerItem to="/settings/change" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <BiLockAlt />
                  </span>
                  <p>Password Change</p>
                </div>
              </DrawerItem>
              <DrawerItem to="/privacy" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <BiCheckShield size={20} />
                  </span>
                  <p>Privacy Policy</p>
                </div>
              </DrawerItem>
              <DrawerItem to="/terms" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <BsClipboard />
                  </span>
                  <p> Terms and Conditions</p>
                </div>
              </DrawerItem>
              <DrawerItem to="/FAQs" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <AiOutlineInfoCircle />
                  </span>
                  <p> FAQ</p>
                </div>
              </DrawerItem>

              <DrawerItem to="/entertainment" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <IoIosHelpCircleOutline size={20} />
                  </span>
                  <p> Help Center</p>
                </div>
              </DrawerItem>

              <DrawerItem to="/" handleModal={props.handleModal}>
                <div className="drawer-nav-item">
                  <span>
                    <AiOutlineLogout  />
                  </span>
                  <p>Logout</p>
                </div>
              </DrawerItem>
            </div>
          </div>
        </div>
      </motion.div>
    </BackDrop>
  );
};

export default Drawer;
