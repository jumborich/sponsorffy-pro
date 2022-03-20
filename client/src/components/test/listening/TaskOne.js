import  {useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import useStateTemplate from "../children/utils/stateTemplate";
import {setAnswers, setStateTemplate} from '../../../redux/test/Actions'

const TaskOne = ({questions, setDefaultValues, SectionComp}) =>{

  const dispatch = useDispatch();
  const{sections,totalQuestions} = questions;
  const{answers}=useSelector(state => state.test.answerObj);
  const[taskOne, setTaskOne] = useStateTemplate(totalQuestions);

 // Sets previous task answers saved in db
  useEffect(() => {
    answers &&
    answers.listening_ans.task_1.length &&
    setTaskOne(answers.listening_ans.task_1)
  },[answers.listening_ans.task_1]);

  // updates task asnwers in redux on every question attempt
  useEffect(()=>dispatch(setStateTemplate(taskOne)), [taskOne]);

  // Enables saving user's answers to db only once
  const saveOnBlur = () =>{
    answers.listening_ans.task_1 = taskOne;
    dispatch(setAnswers(answers,true));
  };

  // Sets the values of the input tags that have been replaced with regex
  useEffect(()=>setDefaultValues(taskOne));

  const setState =(question_number,value)=>{
    // question_number - 1: Adjusts for array index starting at 0
    setTaskOne(prevTaskOne =>{
      prevTaskOne[question_number - 1].answer = value;
      return [...prevTaskOne];
    })
  }
    
  return(
    <div id="writing-task-one">  
      {sections.map((section, index)=>(
        <SectionComp
        section={section}
        setState={setState}
        saveOnBlur={saveOnBlur}
        key={index.toString()}
        />
      ))}
    </div> 
  )
}
export default TaskOne;