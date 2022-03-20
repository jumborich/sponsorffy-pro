import {useSelector} from 'react-redux';
import { BsCheckAll } from 'react-icons/bs';

const GrideItem = ({item, qNumber}) =>{
  let colCriteria = item.answer && item.answer.hasOwnProperty("audioUrl")? item.answer.audioUrl:item.answer;
  return(
    <div className="grid-item-tile">
      <span>{qNumber}</span>
      <span>
        <BsCheckAll color={colCriteria? "black":"#f5f5f5"}/>
      </span>
    </div>
  )
}

const TestLeft = () =>{
	const{ stateTemplate } = useSelector(state => state.test);
	const{ testSession } = useSelector(state => state.user.user);
	return(
		<div id="testLeft">
			<div className="test-left-container">
        <nav id="test-left-nav">
          <span>Version :</span>{testSession.version}
        </nav>
      <div className="grid-container">
      {stateTemplate.length>0 && stateTemplate.map((item,index)=>(
        <GrideItem
        item={item}
        qNumber={item.question_num > index + 1 ? item.question_num : index + 1} //Taking account for Writing
        key={index.toString()}
        />
      ))
      }
			</div>
			</div>
		</div>
	);
};
export default TestLeft;