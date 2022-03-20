import {useContext} from 'react';
import TaskOne from './TaskOne';
import {TestContext} from '../TestContextProvider';

const Writing = () =>{
  const {questions, setDefaultValues} = useContext(TestContext);
  return(
    <div id="reading">
      <TaskOne
      setDefaultValues={setDefaultValues}
      type={questions.Writing.type}
      questions={questions.Writing.task_1} 
      />
    </div>
  )
}
export default Writing;