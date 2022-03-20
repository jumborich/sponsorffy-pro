import React from 'react';
import {MdCancel} from 'react-icons/md';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

const RecordingIndicator =({ recordingMins,recordingSecs })=>{
  return(
    <div className="active-recording-container">
    <div id="active-recording-cancel-item" className="active-recording-cancel-item">
      <MdCancel color="red" size={35} />
    </div>
    <div className="active-recording-timer-item">
      <span id="record-dot" className="record-dot"/>
      <span>{recordingMins}</span>
      <span>:</span>
      <span>{recordingSecs}</span>
    </div>
    <div id="active-recording-check-item" className="active-recording-check-item">
      <IoIosCheckmarkCircleOutline color="lightgreen" size={35} />
    </div>
  </div>
  ) 
}
 
export default RecordingIndicator;