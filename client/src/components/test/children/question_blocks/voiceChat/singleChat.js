import SectionHeader from "../../utils/sectionHeader";
import SelectionTable from "../../utils/selectionTable";
import SingleChatBox from "../../utils/singleChatBox";

const SingleChat = ({ article,section, setState, saveOnBlur, useTaskTwo,renderSpeech, isRecordingId }) =>{
  return(
    <section>
    
    <SectionHeader
    section={section}
    />

    <SelectionTable
    section={section}
    />

    <div className="question-block">
    {section.question_blocks.map((question, index)=>{
      return(
        <SingleChatBox
        article={article}
        setState={setState}
        saveOnBlur={saveOnBlur}
        section={section}
        question={question}
        key={index.toString()}
        useTaskTwo={useTaskTwo}
        renderSpeech={renderSpeech}
        isRecordingId={isRecordingId}
        />
      )
    })}
    </div>
  </section>
  )
}
 
export default SingleChat;