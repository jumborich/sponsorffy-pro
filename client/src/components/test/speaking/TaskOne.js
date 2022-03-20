import {useState,useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { AiOutlineAudio, AiFillAudio} from 'react-icons/ai';
import {MdCancel} from 'react-icons/md';
import {speechContext} from "./speakingContext";
import RecordingIndicator from "../children/utils/recordingIndicator";
import AudioSummary from "../children/question_blocks/voiceChat/audioSummary";
import {setAnswers, setStateTemplate} from '../../../redux/test/Actions'

const TaskOne = ({questions, setDefaultValues}) =>{
  const dispatch = useDispatch();
  const{article, sections, totalQuestions} = questions;
  const{answers}=useSelector(state => state.test.answerObj);
  let{recordingSecs,recordingMins,toggleRecordMode,recordAudio,setToggleRecordMode} = useContext(speechContext)

  const getStateTemplate = [...Array(totalQuestions)].map((q,index)=>{
    let question_num = ++index;
  
    // return answer object with audioUrl prop for the last question with audio recording
    if(question_num === totalQuestions){
      return {question_num, answer:{audioUrl:"",blob:"",audioDuration:0}, mark:0}
    }
    else{
      return{question_num, answer:"", mark:0} 
    }

  })
  const [taskOne, setTaskOne] = useState(getStateTemplate);
  const [isAudioQuestion, setIsAudioQuestion] = useState(false);

  // Sets previous task answers saved in db
  useEffect(() => {
    answers && 
    answers.speaking_ans.task_1.length &&
    setTaskOne(answers.speaking_ans.task_1)
  },[answers.speaking_ans.task_1]);

  useEffect(() => {

    // updates task asnwers in redux on every question attempt
    dispatch(setStateTemplate(taskOne));

    // Only run if question involves recording to avoid multiple db saving
    if(isAudioQuestion){
      setIsAudioQuestion(false);
      saveOnBlur()
    }

  },[taskOne]);

  // Enables saving user's answers to db only once
  const saveOnBlur = ()=>{
    answers.speaking_ans.task_1 = taskOne;
    dispatch(setAnswers(answers,true));
  };

  // Sets the values of the input tags that have been replaced with regex
  useEffect(()=>setDefaultValues(taskOne));

  const setState =(question_number,value,isAudioUrl)=>{
    setTaskOne(prevTaskOne =>{
      if(!isAudioUrl){
        prevTaskOne[question_number - 1].answer = value;
      }
      else{
        prevTaskOne[question_number - 1].answer = {audioUrl:value.audioUrl, blob:value.blob};
        setIsAudioQuestion(true)
      }

      return [...prevTaskOne]
    })
  }

/**
 *  question_number= last question in the question block
 */
 const renderSpeech =(question_number)=>{
  // Shows this if recording is ongoing
  if(toggleRecordMode){
    return(
      <RecordingIndicator
      recordingSecs={recordingSecs}
      recordingMins={recordingMins}
      />
    )
  };

  // The recorded audio is displayed here: last question_num
  if(taskOne[question_number-1].answer.audioUrl){
    return(
      <div className="task-one-audio">
        <span onClick={()=>setState(question_number,"","isAudioUrl")}>
          <MdCancel size={24} color="red"/>
        </span>

        <span>
        <AiFillAudio size={30} />
        </span>

        <audio controls src={taskOne[question_number-1].answer.audioUrl}/> 
      </div>
    )
  } 

  // Returns this as default
  return(
    <div className="record-item" 
      onClick={()=>{
        setToggleRecordMode(1);
        recordAudio(question_number,setState);
      }}
    >
      <span className="icon-container">
        <AiOutlineAudio className="AiOutlineAudio" size={15} color="white"/>
      </span>
      <span id="record-a" style={{color:"white"}}>Record</span>
    </div>
  )
}

  /**
   * Shows record/audio if user has answered all input questions 
   * OR has previously recorded 
   */
  const shouldDisplay = (displayType)=>{
    let quests_answered =0,questionNum=1,first_condition;

    while(questionNum < totalQuestions){
      if(taskOne[questionNum - 1].answer.trim().length){
        quests_answered++;
      };
      questionNum++;
    };

    // && case or none
    if(displayType === "audio") first_condition = quests_answered === (totalQuestions -1);

    // either || case
    if(displayType === "writeUp") first_condition = quests_answered > 0;

    return first_condition || (taskOne[totalQuestions -1].answer.audioUrl)
  };

  /**
   * Joins all writeUp answers in a single text box.
   */
  const getWriteUpAnswers=()=>{
    return taskOne.filter((q)=>{
      if(!q.answer.hasOwnProperty("audioUrl")){
        return q.answer;
      }
    })
  }

  return(
    <div id="speaking-task-one">   
    <article id="readingPassage">
      <div id="readingHeader">
        <h1>{article.title}</h1>
        <img alt="Sponsorffy reading" src={article.img}/>
      </div>
    </article>
      {sections.map((section, i) =>(
        <AudioSummary
        key={i.toString()}
        taskOne={taskOne}
        section={section}
        setState={setState}
        saveOnBlur={saveOnBlur}
        renderSpeech={renderSpeech}
        shouldDisplay={shouldDisplay}
        getWriteUpAnswers={getWriteUpAnswers}
        />
      ))}
    </div> 
  )
};
export default TaskOne;