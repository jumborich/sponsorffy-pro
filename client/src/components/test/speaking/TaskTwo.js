import {useState,useEffect,useContext} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { AiOutlineAudio} from 'react-icons/ai';
import {MdCancel} from 'react-icons/md';
import {speechContext} from "./speakingContext";
import RecordingIndicator from "../children/utils/recordingIndicator";
import SingleChat from "../children/question_blocks/voiceChat/singleChat";
import {setAnswers, setStateTemplate} from '../../../redux/test/Actions'

const TaskTwo = ({questions, setDefaultValues}) => {
  let{
    recordingSecs,
    recordingMins,
    isRecordingId,
    toggleRecordMode,
    recordAudio,
    setIsRecordingId,
    setToggleRecordMode
  } = useContext(speechContext);
  
  const dispatch = useDispatch();
  const{article,sections,totalQuestions} = questions;
  const{answers} = useSelector(state => state.test.answerObj)
  
  const getStateTemplate = [...Array(totalQuestions)].map((q,index)=>{
    return {
      question_num: ++index, 
      answer:{option:'',audioUrl:"",blob:"",audioDuration:0}, 
      mark:0
    }
  })
  const[taskTwo, setTaskTwo] = useState(getStateTemplate);
  const [isAudioQuestion, setIsAudioQuestion] = useState(false);

  // Sets previous task answers saved in db
  useEffect(() =>{
    answers && 
    answers.speaking_ans.task_1.length &&
    setTaskTwo(answers.speaking_ans.task_1)
  },[answers.speaking_ans.task_1]);
 
  useEffect(() =>{
    // updates testLeft comp. on every question attempt
    dispatch(setStateTemplate(taskTwo));

    // Only run if question involves recording to avoid multiple db saving
    if(isAudioQuestion){
      setIsAudioQuestion(false);
      saveOnBlur()
    }
  },[taskTwo]);

  // Enables saving user's answers to db only once
  const saveOnBlur = ()=>{
    answers.speaking_ans.task_1 = taskTwo;
    dispatch(setAnswers(answers,true));

  };

  // Sets the values of the input tags that have been replaced with regex
  useEffect(() =>setDefaultValues(taskTwo,"speaking_ans_2"));

  const setState =(question_number,value,isAudioUrl)=>{
    setTaskTwo(prevTaskTwo =>{
      if(isAudioUrl){ 
        //sets audio url and blob file
        prevTaskTwo[question_number - 1].answer.audioUrl= value.audioUrl;
        prevTaskTwo[question_number - 1].answer.blob= value.blob?value.blob:"";

        setIsAudioQuestion(true)
      }
      else{ 
        //sets option chosen from question
        prevTaskTwo[question_number - 1].answer.option= value !== 'pick response' ? value : undefined
      };

      return[...prevTaskTwo]
    })
  }

  // Getters for audioUrl and options in taskTwo Array
  const useTaskTwo={
    getOption:(question_number)=>taskTwo[question_number-1].answer.option 
    ,
    getAudioUrl:(question_number)=>taskTwo[question_number-1].answer.audioUrl,

  }
  const renderSpeech = (question_number) => {
   let audioId="Q"+question_number //Just an identifier for each audio been recorded

    // Shows this if recording is ongoing toggleRecordMode
    if(toggleRecordMode && isRecordingId === audioId){
      return(
        <RecordingIndicator
        recordingSecs={recordingSecs}
        recordingMins={recordingMins}
        />
      )
    };

    // The recorded audio is displayed here question_number::taskTwo[audioId].audio::{taskTwo[audioId].audio}
    if(useTaskTwo.getAudioUrl(question_number)){
      return(
        <div className="chat-right-recorded">
          <audio className="chat-box-audio" controls 
          src={useTaskTwo.getAudioUrl(question_number)}
          />
          <span onClick={() => setState(question_number,"","isAudioUrl")}>
           <MdCancel color="red" size={30}/>
          </span>
        </div>
      )
    } 

    // Returns this as default
    return(
      <div 
      className="record-item" 
      onClick={() => {
        if(isRecordingId) return; //Ensures only one recording is occuring at any single time
        toggleRecordMode = 1;
        setToggleRecordMode(toggleRecordMode);
        setIsRecordingId(audioId)
        recordAudio(question_number, setState);
      }}
      >
      <span className="icon-container">
        <AiOutlineAudio className="AiOutlineAudio"/>
      </span>
     </div>
    )
  }

  const renderSections = ()=>{
    return sections.map((section, index)=>{
      if(section.type==="single_user"){
        return(
          <SingleChat
          article={article}
          section={section}
          setState={setState}
          saveOnBlur={saveOnBlur}
          key={index.toString()}
          useTaskTwo={useTaskTwo}
          renderSpeech={renderSpeech}
          isRecordingId={isRecordingId}
          />
        )
      }
    })
  }
    
  return(
    <div id="speaking-task-one"> 
      {renderSections()}  
    </div> 
  )
};
export default TaskTwo;