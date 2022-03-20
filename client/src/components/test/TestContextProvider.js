import { useEffect, useState, createContext } from 'react';
import {useSelector,useDispatch} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import {BiChevronsRight, BiChevronsLeft} from 'react-icons/bi';
import renderLoader from "../../utils/Loader";
import TestModal from "../Modal/testModal";
import {setActivePage, setCurrentType,setAnswers} from '../../redux/test/Actions';
import FooterNav from './FooterNav';
import TestQuery from "./testQuery";
import StateActions from "./stateActions";

export const TestContext = createContext({});

const TestContextProvider = ({ children }) =>{
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const{user} = useSelector(state => state.user);
  const testQuery = new TestQuery(user, dispatch, navigate);
  const stateActions = new StateActions(user, dispatch, navigate);

  const[questions,setQuestions] = useState({});
  const [isTestModal,setTestModal] = useState(false);
  const _useModal =() => ({isTestModal, closeModal:()=>setTestModal(false)});

  const{activePage, currentType} = useSelector(state => state.test);
  const type = `${currentType}_ans`;

  const{ answers, isNewAnswer } = useSelector(state => state.test.answerObj);//User's current answers gotten from redux/db
  const answersToSave = answers[type]["task_1"];

  // Replaces BOLD() and INPUT() tags in question
  const parsing_rule = [
    {pattern: /BOLD\((.*?)\)/g, replacement: `<b>$1</b>`},
    {pattern: /INPUT\((.*?)\)/g, replacement: `<input type="text" class="listening-input"/>`}
  ];

  useEffect(() =>{
    // Gets test questions from db
    testQuery.getNewTest(setQuestions);

    // Gets user's saved answers from db
    if(user.testSession.testId){
      testQuery.getUserSavedAnsDB(setAnswers)
    }
  },[]);
    

  const testMain = typeof window !== "undefined" && window['test-main'];
  useEffect(()=> {

    //Ensures answer isn't sent to db immediately page change
    dispatch(setAnswers(answers, false));

    // Enables scroll to top on each navigation to new page
    testMain && testMain.scrollTo(0,0);
    // activePage,currentType
  },[currentType]);

  // Saves user's answers to db as they come in
  useEffect(() => {
    // console.log("answersToSave: ", answersToSave)
    if(!answersToSave.length || !isNewAnswer) return; //Ensures empty array of answers isn't saved to db

    testQuery.saveAnswers(type,"task_1",answersToSave);

  },[answersToSave])
  
  // Makes all the replacement needed in the question titles
  useEffect(() => {
    document.querySelectorAll('.question-description').forEach(function(tag){
      let innerHTML = tag.innerHTML;
      parsing_rule.forEach((rule)=>{
        if(innerHTML.match(rule.pattern)){
          innerHTML = innerHTML.replace(rule.pattern, rule.replacement);
          tag.innerHTML = innerHTML;
        }
      })
    })
  });
  
  return(
    questions.Reading? 
      <TestContext.Provider value={{questions, setDefaultValues: stateActions.setDefaultValues}}>
        <div id="test-main">
        <h2 className="test-section-header">{currentType.toUpperCase()}</h2>
          { children }
          <div onClick={()=>setTestModal(true)} className="page-type-item submit-test" 
            style={{display:currentType==="speaking"?"block":"none"}}>
            SUBMIT TEST
          </div>
          <div id="pagination-footer">
            <div id="page-number">
              <span className="page-number-item"
              onClick={() =>{
                stateActions.onPrevious(
                  currentType,
                  setCurrentType, 
                  setActivePage
                )
              }}
              >
              <span><BiChevronsLeft color='#122d7b' size={25}/></span>
              </span>
              {
                currentType === "reading"?
                <>
                  <span className="page-number-item" onClick={() =>dispatch(setActivePage('one'))} style={{borderLeft:'none',color:activePage === 'one' ? 'white':'black',backgroundColor:activePage === 'one' ? '#122d7b':'white', borderColor:activePage === 'one'?'#122d7b':null}}>1</span>
                  <span className="page-number-item" onClick={() =>dispatch(setActivePage('two'))} style={{borderRight:'none', borderLeft:'none',color:activePage === 'two' ? 'white':'black',backgroundColor:activePage === 'two' ? '#122d7b':'white',borderColor:activePage === 'two'?'#122d7b':null}}>2</span>
                </>:
                <span className="page-number-item" style={{borderLeft:"none",color:"white",backgroundColor:"#122d7b", borderColor:"#122d7b"}}>1</span>
              }
              <span className="page-number-item"
              onClick={()=> {
                stateActions.onNext(
                  currentType,
                  setCurrentType, 
                  setActivePage
                )
              }}
              >
                <span><BiChevronsRight color='#122d7b' size={25}/></span>
              </span>
            </div>
            <FooterNav id='page-type-ROW'/>
          </div>
        </div>
        {isTestModal?<TestModal {...{...stateActions.testModalOpts(), _useModal}}/>:null}
    </TestContext.Provider>
    :
    renderLoader()
  )
}
export default TestContextProvider;