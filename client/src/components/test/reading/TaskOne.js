import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setAnswers, setStateTemplate} from '../../../redux/test/Actions'

const TaskOne = ({answers, questions, SectionComp, stateTemplate, setDefaultValues}) =>{
  const dispatch = useDispatch();
  const{passage,sections} = questions;
  const[taskAnswers, setTaskAnswers] = stateTemplate

  // scroll up On initial mount
  useEffect(()=>typeof window !== 'undefined' && window["test-main"] && window["test-main"].scrollTo(0,0), []);

  // Sets previous task answers saved in db
  useEffect(() => {
    answers && 
    answers.reading_ans.task_1.length && 
    setTaskAnswers(answers.reading_ans.task_1)
  },[answers.reading_ans.task_1])

  // updates task asnwers for testLeft on every question attempt
  useEffect(()=>dispatch(setStateTemplate(taskAnswers)), [taskAnswers]);

  // Enables saving user's answers to db only once
  const saveOnBlur = () =>{
    answers.reading_ans.task_1 = taskAnswers;
    dispatch(setAnswers(answers, true));
  }

  // Sets the values of the input tags that have been replaced with regex
  useEffect(() =>setDefaultValues(taskAnswers));


  const setState =(question_number,value)=>{

    setTaskAnswers(prevTaskOne =>{
      prevTaskOne[question_number - 1].answer = value;

      return [...prevTaskOne];
    });

  }
  
  return(
    <div id="reading-task-one">
      {
        sections.pageOne.map((section,index)=>(
          <SectionComp 
          passage={passage}
          section={section}
          setState={setState}
          saveOnBlur={saveOnBlur}
          key={index.toString()}
          />
        ))
      }
    </div> 
  )
};

export default TaskOne;