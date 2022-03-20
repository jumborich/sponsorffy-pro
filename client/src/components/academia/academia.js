import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { BsPencil,BsFileText } from 'react-icons/bs';
import {IoTrendingUpOutline} from 'react-icons/io5';
import Format from "../../utils/Format";
import TestModal from "../Modal/testModal";
import { canContest } from "../../utils/verify";
import { fetchUserSuccess } from "../../redux/user/UserAction";
import {setModal, setErrMesage, setCurrentComponent} from '../../redux/navBar/NavActions';

const Academia = ()=> {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const format  = new Format();
  const{user} = useSelector(state => state.user);
  const { isTestModal, error } = useSelector((state) => state.navBar);

  // Tells NavBar what component is in display
  useEffect(() => {
    dispatch(setCurrentComponent('academia'));

    let timerId;
    // used this for programmatically calling modal
    if(error.errAction){
      timerId = setTimeout(()=>{
        document
        .querySelector("label[for='doc_uploads']")
        .click();

        dispatch(setErrMesage({type:"", message:"", errAction:false}));
      },5);
    }

    return () =>{
      dispatch(setCurrentComponent(undefined));
      clearTimeout(timerId);
    }
  },[]);

  const closeModal = ()=> dispatch(setModal("test", false));;

  const _useModal = () => ({isTestModal, closeModal})

  const modalOptions = {
    header:"Test Mode Confirmation", //Text to display as the header of modal
    subHeader:"Please choose the mode/type of test to take below.", //Text to display as sub-header of Modal
    choice:["Practice","Contest"], //Users options to choose from
    choiceParams:["practice","contest"], //Parameters to be passed to functions of the users choice option
    callback: navToTest
  };

  function navToTest(testMode){
    closeModal(); // close the modal
    
    // Check user's coin availability
    if(testMode === "contest"){
      if(!canContest(user.coins, dispatch)) return;
    };

    // clean user testSession incase of prev saved session
    dispatch(
      fetchUserSuccess({
        ...user,
        testSession:{
          candidateId:"kddd" //used in TestRoute comp
        }
      })
    )
    // Set mode to localStorage 
    localStorage.setItem("testMode", testMode);

    navigate('/test', {state:{ testMode }, replace:true});
  };

  return (
    <div id="academia">
    <div className="academia-item">
      <h3 className="academia-item-title">Stats</h3>
      <div className="academia-test-stats-container">
        <div className="academia-test-stats-item">
          <span>{(user.points && format.points(user.points.academia)) || 0 }</span>
          <p>Avgerage Total</p>
        </div>

        <div className="academia-test-stats-item">
          <span>{(user.testSession && format.points(user.testSession.recentScore)) || 0 }</span>
          <p>Recent Score</p>
        </div>

        <div className="academia-test-stats-item">
          <span>{(user.ranks && format.rank(user.ranks.academia)) || 0 }</span>
          <p>Ranking</p>
        </div>
      </div>
    </div>
    <div className="academia-item">
      <h3 className="academia-item-title">FACTS</h3>

      <div className="academia-test-facts">
        <div className="academia-test-facts-item">
        <div className="test-facts-item-header"> 
        <span className="icon"><BsFileText/></span> 
        <span className="">Coverage</span>
        </div>
        <ul>
          <li>Writing</li>
          <li>Reading</li>
          <li>Speaking</li>
          <li>Listening</li>
        </ul>
    </div>

      <div className="academia-test-facts-item">
      <div className="test-facts-item-header"> 
      <span className="icon"><IoTrendingUpOutline/></span> 
      <span className="">Difficulty</span>
      </div>
      <ul>
        <li>Answerable</li>
        <li>~2hrs Duration</li>
        <li>15Q per section</li>
        <li>Unlimited trials</li>
      </ul>
      </div>

      <div className="academia-test-facts-item">
        <div className="test-facts-item-header"> 
        <span className="icon"><BsPencil/></span> 
        <span className="" id="sit-mode">Sit-Mode</span>
        </div>

        <ul>
          <li>Short answers</li>
          <li>Multiple choice</li>
          <li>Voice recording</li>
        </ul>
      </div>
      </div>
    </div>
    <label  className="feed-float-btn" htmlFor="doc_uploads">
      <span><BsPencil size={28} color="#ffffff"/></span>
    </label>

    {isTestModal?<TestModal {...{...modalOptions, _useModal}}/>:null}
    </div>
  )
}
export default Academia;