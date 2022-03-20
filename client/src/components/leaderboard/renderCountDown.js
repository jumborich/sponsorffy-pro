import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import { VscInfo } from "react-icons/vsc";
import countDownTimer from "../../utils/countDownTimer";

const RenderCountDown=()=>{
  const {boardItems}= useSelector(state => state.leaderboard);
  const {countDownTo} =boardItems;

  // Below is for setting the countdown timer
  const [ days, setDays ] = useState("00");
  const [ hours, setHours ] = useState("00");
  const [ minutes, setMinutes ] = useState("00");
  const [ seconds, setSeconds ] = useState("00");

  useEffect(() =>{
    const timeId=countDownTimer(
      countDownTo,
      (days,hours,minutes,seconds)=>{
        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      }
    )
    return () =>{
      //Clearing countdown timer
      clearInterval(timeId);
    }
  },[countDownTo]);
  
  return(
    <p className="contest-timer">
    <span>
        {days}
        <span className="timer-letters">days</span>
    </span> 
    <span className="countdown-dot">&middot;</span> 

    <span>
        {hours}
        <span className="timer-letters">hrs</span>
    </span> 
    <span className="countdown-dot">&middot;</span> 

    <span>
        {minutes}
        <span className="timer-letters">min</span>
    </span>
    <span className="countdown-dot">&middot;</span> 

    <span>
    {seconds}
    <span className="timer-letters">sec</span>
    </span>
    <span className="display-info"><VscInfo size={14}/></span>
    </p>
  )
}

export default RenderCountDown;