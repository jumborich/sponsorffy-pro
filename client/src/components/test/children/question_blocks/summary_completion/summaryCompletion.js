import SectionHeader from "../../utils/sectionHeader";

const SummaryCompletion = ({section, setState, saveOnBlur}) => {
  return(
    <section>

      <SectionHeader
      section={section}
      />

      <div className="question-block">
        <p className="summary-q">
        {section.question_blocks.map((question,index)=>{
          return(
            <span id={question.question_number} className="question-description" key={index.toString()} 
            tabIndex={0}
            onBlur={saveOnBlur}
            onKeyDown={(e)=>{
              if(e.target.type) {
                // input.value="Check this question";
                e.target.addEventListener("blur", (e)=> {
                  setState(question.question_number,e.target.value)
                })
              }
            }}
          >
            {question.heading}
          </span>
          )

        })}
        </p>
      </div>
    </section>
  )
}
 
export default SummaryCompletion;