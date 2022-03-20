import { useEffect, useState } from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {IoMdCheckmarkCircleOutline} from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import {  FaMarker } from "react-icons/fa";
import BackDrop from "./../Modal/backdrop";
import _useAxios from "../../utils/_useAxios";
import ProfileAction from "../../redux/profile/action";
import { AVATAR } from "../../utils/imageParams";
import { setAnswers } from "../../redux/test/Actions";

const MarkTest = () =>{
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const profileAction = new ProfileAction(dispatch);

  const[timerIDs, setTimerIDs] = useState([]) 
  const[isModal, setIsModal]= useState(true);
  const[textContent, setTextContent]= useState("Marking in progress")
  const[isDoneMarking,setIsDoneMarking]= useState(false);
  const{user} = useSelector(state => state.user);

  const gettingGrades =()=>{
    let timerId = setTimeout(() =>{
      setTextContent("Getting Grades Ready");
      markingDone()
    }, 4500);

    setTimerIDs((prevIds) =>[...prevIds,timerId])
  }

  const markingDone = () => {
    let timerId = setTimeout(() =>{
      setIsDoneMarking(true);
      setTextContent("Marking done");
      viewResult()
    }, 4500);

    setTimerIDs((prevIds) =>[...prevIds,timerId])
  }

  const viewResult =()=>{
    const timerId = setTimeout(() =>{
      // 1.Negate modal opening
      setIsModal(false);
      
      //2. Reset redux and navigate to view test results
      dispatch({type:"RESE_TEST_STATE"})

      const profileUrl = user.username.split(" ").join("");
      navigate(
        `/${profileUrl}`,
       {
        state:{
          id:user._id,
          profileTab:"test"
        }
       }
      );
    },1000);

    setTimerIDs((prevIds) =>[...prevIds,timerId])
  }

  useEffect(() => {
    if(!(location.state && location.state.testId)){
      navigate(-1);

    }else{
      // Reset test redux 
      setAnswers({reading_ans:{task_1:[]}, listening_ans:{task_1:[]}, writing_ans:{task_1:[]},speaking_ans:{task_1:[]}}, false);

      const {version, testId, candidateId} = location.state;
      _useAxios("POST",{version, testId, candidateId},"tests/markTest")
      .then((response)=>{
        if(response.data){
          // Set largeView for test results viewing
          profileAction.setIsModal(true, response.data.gradedTest);

          // Show marking indicator
          gettingGrades();
        }
      })
      .catch((error)=>console.log(error.response))
    }

    return() => timerIDs.forEach((timerId) =>clearTimeout(timerId));
  },[]);

  return(
    location.state && location.state.testId?
    <BackDrop isModal={isModal} handleModal={() =>setIsModal(true)}>
      <div id="mark-test">
        <div className="marking-container-top">
          <button className="marking-closeBtn" onClick={() => navigate("/home/academia", {replace: true, state:{}})}>
            <AiOutlineClose size={20}/>
          </button>
          <div className="marking-brand-name">
            <p>Sponsorffy</p>
          </div>
          <div className="marking-user">
            <AVATAR src={user.photo} alt={`Avatar of ${user.username}`}/>
          </div>
        </div>
        <div className="notify-marking-process">
        <span className="progress-txt">{textContent}</span>
        {
          isDoneMarking?<IoMdCheckmarkCircleOutline size={40} color="#1d3d9e"/>:
          <div id="indicator" className="progress-dots">
            <span className="p-dot-1">.</span>
            <span className="p-dot-2">.</span>
            <span className="p-dot-3">.</span>
            <span className="Fa-Marker">
              <FaMarker color={"white"} size={70}/>
            </span>
          </div>
        }
        </div>
      </div>
    </BackDrop>
    :null
  )
}
export default MarkTest;