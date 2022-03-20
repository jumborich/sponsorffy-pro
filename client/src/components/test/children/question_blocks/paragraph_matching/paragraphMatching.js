import SectionHeader from "../../utils/sectionHeader";

const ParagraphMatching = ({section, passage, setState, saveOnBlur}) => {
  return(
    <section>
    
      <SectionHeader
      section={section}
      />

      <div className="question-block">
        {section.question_blocks.map((question,index)=>{
          return(
            <p key={index.toString()} className="inline-question">
              <strong>{question.question_number}</strong>
              {question.heading}
              <span>
              <select id={question.question_number} className="question-description select-box" data-focusable="true"
              onBlur={saveOnBlur} 
              defaultValue={"select"}
              onChange={(e) =>setState(question.question_number,e.target.value)}
              >
              <option value="select" disabled>select</option>
                {passage.paragraphs.map((paragraph,index)=>{
                  return(
                    <option key={index.toString()} value={paragraph.paragraph} className="r-14lw9ot">
                      {paragraph.paragraph}
                    </option>
                  )
                })}
              </select>
              </span>
            </p>
          )
        })}
      </div>
    </section> 
  )
}
 
export default ParagraphMatching;