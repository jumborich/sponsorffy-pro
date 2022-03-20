import SectionHeader from "../../utils/sectionHeader";
import SelectionTable from "../../utils/selectionTable";
import WritingBox from "./../writing/writingBox";

const AudioSummary = ({ taskOne, setState, saveOnBlur, section, shouldDisplay, renderSpeech, getWriteUpAnswers})=>{
return(
  <section>

    <SectionHeader
    section={section}
    />

    <SelectionTable
    section={section}
    />

    <div className="question-block">
      <div className="inline-question">
        <div className="writing-box-all" style={{ display:shouldDisplay("writeUp")? "inline-block" :"none"}}>
          {getWriteUpAnswers().length && getWriteUpAnswers().map(({answer},index)=>{
            return(
              <span key={index.toString()}>
                { answer } <br/> <br/>
              </span>
            )
          })}
          <div className="speaking-record-text" style={{ display:shouldDisplay("audio")? "inline-block" :"none"}}>
              {renderSpeech(taskOne.length)}
          </div>
        </div>
      </div>

      {section.question_blocks.map((block, index)=>{
        return(
          <WritingBox
          setState={setState}
          saveOnBlur={saveOnBlur}
          key={index.toString()}
          question_number={block.question_number}
          value={taskOne[block.question_number-1].answer}
          />
        )
      })}
    </div>
 </section>
)
}
 
export default AudioSummary;