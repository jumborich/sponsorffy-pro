import {useState,useEffect,useRef,createContext} from 'react';
import {useSelector} from 'react-redux';
export const speechContext = createContext();

const SpeechContextProvider = ({ children }) => {
  const{prev_Location} = useSelector(state => state.test);
  const[isRecordingId, setIsRecordingId] = useState(''); //This holds the id of the current recording question
	let [ toggleRecordMode, setToggleRecordMode ] = useState(0); //This will determine when the user starts recording and when they end
	let [ recordingSecs, setRecordingSecs ] = useState('00'); // sets the recording duration in secs;
  let [ recordingMins, setRecordingMins ] = useState(0); // sets the recording duration in mins;
  let [ mediaRecorder, setMediaRecorder ] = useState("");

  //solves problem of stale closure in recordAudio
  let shouldRecord = useRef({});
  shouldRecord.current = toggleRecordMode;

  let timerIds = useRef({setIntervalID:0, addTimeoutId:0, removeTimeoutId:0}).current;

  // Stop recording if user navigates away
  useEffect(() => {
    if(mediaRecorder.state==="recording"){
      stopRecording(
        mediaRecorder
      )
    }
  },[prev_Location]);

  // Call this anytime the recording is cancelled.
  const stopRecording =(mediaRecorder)=>{
    let {setIntervalID, addTimeoutId, removeTimeoutId} = timerIds;

    setToggleRecordMode(0);
    setIsRecordingId('');
    setRecordingSecs('00');
    setRecordingMins(0);
    clearInterval(setIntervalID);
    clearTimeout(addTimeoutId)
    clearTimeout(removeTimeoutId)
    mediaRecorder.stop();
  };

  // start recording audio
  const startRecording =(mediaRecorder,recordIndicator,okayBtn)=>{
    mediaRecorder.start();

    let timeCount = 0; //in seconds
    timerIds.setIntervalID = setInterval(() => {
      timeCount++;
      if(timeCount.toString().length < 2){
        setRecordingSecs('0' + timeCount);

      }else{
        if(timeCount === 60){
          timeCount = 0;
          recordingMins = recordingMins + 1;
          recordingSecs = '00';
          // Makes sure recording does not go above a --3MIN-- Threshold
          if(recordingMins === 2){
            okayBtn && okayBtn.click();
          }
          setRecordingMins(recordingMins);
          setRecordingSecs(recordingSecs);
        }else{
          setRecordingSecs(timeCount);
        }
      };
    }, 1000);

    // Below code alternates the class of the red dot thereby making it look like its blinking
    const alternateAdd = () =>{
      recordIndicator && recordIndicator.classList.add('record-dot-display');
      timerIds.addTimeoutId = setTimeout(() =>alternateRemove(), 500);
    }
    const alternateRemove = () =>{
      recordIndicator && recordIndicator.classList.remove('record-dot-display');
      timerIds.removeTimeoutId = setTimeout(() =>alternateAdd(), 500);
    }
    alternateAdd();
  };

  // when recording is Checked Okay.
  const onRecordOkay=(mediaRecorder,question_number,setState)=>{
    stopRecording(mediaRecorder)
    let chunks = [];

    //Adding data from audio recording to the chunks array
    mediaRecorder.ondataavailable = (event) => { chunks.push(event.data)};

    //After the recording is done
    mediaRecorder.onstop = () =>{
      let blob = new Blob(chunks, { type: 'audio/*', quality: 'high' });
      chunks = [];
      let audioUrl = window.URL.createObjectURL(blob);
      setState(question_number,{audioUrl,blob},"isAudioUrl")
    };
  };

  // Audio recording initiator
  const recordAudio = (question_number, setState) =>{
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){

      navigator.mediaDevices.getUserMedia({audio: true}).then((mediaStream)=>{
        let mediaRecorder = new MediaRecorder(mediaStream);
        setMediaRecorder(mediaRecorder)

        // red-dot indicator & btn variables
        const recordIndicator = document.getElementById('record-dot');
        const okayBtn =document.getElementById('active-recording-check-item');
        const cancelBtn = document.getElementById('active-recording-cancel-item');
        
        //Starting the recording process
        if(shouldRecord){
          startRecording(
            mediaRecorder,
            recordIndicator,
            okayBtn
          )
        }
  
        //Stopping and deleting the recording after user clicks cancel button
        cancelBtn && cancelBtn.addEventListener('click',() =>{
          return stopRecording(
            mediaRecorder
          )
        });
  
        //Stopping and saving the recording after user clicks check button
        okayBtn && okayBtn.addEventListener('click',()=>{
          return onRecordOkay(
            mediaRecorder,
            question_number,
            setState
          )
        });
      })
      .catch((err) => console.log(err));
    }
    else{
      console.log("Your browser does not support getUserMedia")
    }
  };

  return(
    <speechContext.Provider value={{
      recordingSecs,
      recordingMins,
      isRecordingId,
      toggleRecordMode,
      recordAudio,
      setIsRecordingId,
      setToggleRecordMode
    }}
    >
      { children }
    </speechContext.Provider>
  )
}
export default SpeechContextProvider;