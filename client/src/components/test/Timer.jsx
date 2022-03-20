import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import countDownTimer from "../../utils/countDownTimer";
import StateActions from "./stateActions"

const Timer = ({isChangeStyle = false}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const [{days,hrs, mins, secs}, setTime] = useState({days:0,hrs:0, mins:0, secs:0});
  const tick = (days,hrs, mins, secs)=> setTime({days,hrs, mins, secs});
  useEffect(() => {
   const timerId = countDownTimer(user.testSession.duration_Millis,tick);

    // Submit test on time up
    // if(hrs === "00" && mins === "00" && secs === "00"){
      
    //   new StateActions(user,dispatch,navigate).onTestSubmit(true)
    // }
   return () => clearInterval(timerId);
  });

  return(
     <>
      {
        !isChangeStyle  ? (

          <div className="test-timer-panel-item">
            <h5>Time Remaining</h5>
            <div className="upvote-countdown-container">
              <div id="upvote-countdown-days-hours-container">
                <div id="upvote-days-container">
                  <div className="upvote-days-hours-container-item-1">
                  { days }
                  </div>
                  <div className="upvote-days-hours-container-item-2">DAYS</div>
                </div>

                <div id="upvote-hours-container">
                  <div className="upvote-days-hours-container-item-1">
                  { hrs }
                  </div>
                  <div className="upvote-days-hours-container-item-2">HRS</div>
                </div>
              </div>

              <div id="upvote-countdown-mins-secs-container">
                <div id="upvote-minutes-container">
                  <div className="upvote-minutes-seconds-container-item-1">
                  { mins }
                  </div>
                  <div className="upvote-minutes-seconds-container-item-2">
                    MINS
                  </div>
                </div>

                <div id="upvote-seconds-container">
                  <div className="upvote-minutes-seconds-container-item-1">
                  { secs }
                  </div>
                  <div className="upvote-minutes-seconds-container-item-2">
                    SECS
                  </div>
                </div>
              </div>
            </div>
          </div>

        ) : (
          <div className="timer-wrapper">

            <div className="timer-container">
              <div className="timer-container-panel">
                <div className="timer-panel-item">
                  <p>{ days }</p>
                  <small>Days</small>
                </div>
                <div className="timer-panel-item">
                  <p>  { hrs }</p>
                  <small>hrs</small>
                </div>
              </div>
              <div className="timer-container-panel">
                <div className="timer-panel-item">
                  <p>   { mins }</p>
                  <small>mins</small>
                </div>
                <div className="timer-panel-item">
                  <p>  { secs }</p>
                  <small>secs</small>
                </div>
              </div>
            </div>

          </div>
        )
      }

     </>
  );
}
export default Timer;