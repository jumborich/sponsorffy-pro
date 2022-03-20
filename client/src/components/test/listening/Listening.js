import {useContext, useRef, useEffect, useState} from 'react';
import {AiFillAudio} from 'react-icons/ai';
import TaskOne from './TaskOne';
import {TestContext} from '../TestContextProvider';
import TableCompletion from "../children/question_blocks/table_completion/tableCompletion";
import SingleAnswerMultipleChoice from "../children/question_blocks/multiple_choice/singleAnswer";
import SentenceCompletion from "../children/question_blocks/sentence_completion/sentenceCompletion";

const SectionComp = (props) =>{
  switch(props.section.type){

    case "multiple_choice":
    return <SingleAnswerMultipleChoice {...props}/>;

    case "table_completion":
    return <TableCompletion {...props}/>;

    case "sentence_completion":
    return <SentenceCompletion {...props}/>;

    default:return
  }
};

const Listening = () =>{
  const spanRef = useRef();
  const [canSee, setCanSee] = useState(true);
  const {questions, setDefaultValues} = useContext(TestContext);
  const { article } = questions.Listening.task_1;
  const scrollListener = () =>{
    const spanTop = spanRef.current && spanRef.current.getBoundingClientRect().top;
    if(spanTop <= 50){
      setCanSee(false);
    }
    else{
      setCanSee(true);
    }
  };

  const main = typeof window !== "undefined" && window["test-main"];
  useEffect(()=>{
    main && main.addEventListener("scroll", scrollListener);

    return()=>main && main.removeEventListener("scroll", scrollListener);
  });

  return(
    <div id="reading">
      <article id="readingPassage">
        <div id="readingHeader">
          <div className={canSee?"listening-audio":"audio-visible"}>
            {canSee && <section><AiFillAudio size={60}/></section>}
            <audio controls src={article.audio}/>
          </div>
          <span ref={spanRef}/>
        </div>
        <p className="sub-header"><strong>{article.title}</strong></p>
      </article>
      <TaskOne
        SectionComp={SectionComp}
        setDefaultValues={setDefaultValues}
        questions={questions.Listening.task_1} 
      />
    </div>
  )
}
export default Listening;