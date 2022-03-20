import {useContext} from 'react';
import TaskOne from './TaskOne';
import TaskTwo from './TaskTwo';
import {TestContext} from '../TestContextProvider';
import SpeechContextProvider from "./speakingContext";

const SectionComp = (props) =>{
  switch(props.type){
    case "summary_speaking":
    return <TaskOne {...props}/>;

    case "one_on_one":
    return <TaskTwo {...props}/>;

    default:return
  }
}

const Speaking = () => {
  const {questions, setDefaultValues} = useContext(TestContext);
  return(
    <SpeechContextProvider>
      <div id="reading">
        <SectionComp
          type={questions.Speaking.type}
          questions={questions.Speaking.task_1} 
          setDefaultValues={setDefaultValues}
        />
      </div>
    </SpeechContextProvider>
  )
}
export default Speaking;