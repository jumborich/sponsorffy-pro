import {useContext} from 'react';
import { useSelector } from "react-redux";
import TaskOne from './TaskOne';
import TaskTwo from './TaskTwo';
import {TestContext} from '../TestContextProvider';
import useStateTemplate from "../children/utils/stateTemplate";
import SingleAnswerMultipleChoice from "../children/question_blocks/multiple_choice/singleAnswer";
import SummaryCompletion from "../children/question_blocks/summary_completion/summaryCompletion";
import NoteCompletion from "../children/question_blocks/note_completion/noteCompletion";
import HeadingMatching from "../children/question_blocks/heading_matching/headingMatching";
import ParagraphMatching from "../children/question_blocks/paragraph_matching/paragraphMatching";
import SentenceMatching from "../children/question_blocks/sentence_matching/sentenceMatching";
import TrueFalse from "../children/question_blocks/true_false/trueFalse";

// Will get the right component for a given section
const SectionComp = (props) =>{
  switch(props.section.type){

    case "multiple_choice":
    return <SingleAnswerMultipleChoice {...props}/>;

    case "summary_completion":
    return <SummaryCompletion {...props}/>;

    case "note_completion":
    return <NoteCompletion {...props}/>;

    case "heading_matching":
    return <HeadingMatching {...props}/>;

    case "paragraph_matching":
    return <ParagraphMatching {...props}/>;

    case "sentence_matching":
    return <SentenceMatching {...props}/>;

    case "true_false":
    return <TrueFalse {...props}/>;

    default:return
  }
}

const Reading = () =>{
  const{ activePage } = useSelector(state => state.test);
  const {questions, setDefaultValues} = useContext(TestContext);
  const{ passage, totalQuestions } = questions.Reading.task_1;
  const{ answers } = useSelector(state => state.test.answerObj)
  const stateTemplate = useStateTemplate(totalQuestions);

  const renderTask = () =>{
    if(activePage === 'one'){
      return(
        <TaskOne 
        answers={answers}
        SectionComp={SectionComp}
        stateTemplate={stateTemplate}
        setDefaultValues={setDefaultValues}
        questions={questions.Reading.task_1} 
        />
      )
    }

    if(activePage  === 'two'){
      return(
        <TaskTwo 
        answers={answers}
        SectionComp={SectionComp}
        stateTemplate={stateTemplate}
        setDefaultValues={setDefaultValues}
        questions={questions.Reading.task_1} 
        />
      )
    };
  };

  const renderPassage = (type, paragraph) =>{
    switch(type){
      case "plain":
        return paragraph;

      case "lettered":
        return(
          <>
            <span>{paragraph.paragraph}</span>
            <br></br>
            {paragraph.value}
          </>
        )
      default:return;
    }
  }

  return(
    <div id="reading">
      <article id="readingPassage">
        <div id="readingHeader">
          <h1>{passage.title}</h1>
          <img alt="Sponsorffy reading" src={passage.img}/>
        </div>
        <div>
        {passage.paragraphs.map((paragraph,index)=>(
          <p key={index.toString()}>
            {renderPassage(passage.type, paragraph)}
          </p>
        ))}
        </div>
      </article>
      {renderTask()}
    </div>
  )
}
export default Reading;