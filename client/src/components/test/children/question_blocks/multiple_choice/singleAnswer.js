import SectionHeader from "../../utils/sectionHeader";

const SingleAnswerMultipleChoice = ({ section, setState, saveOnBlur }) =>{
  return(
    <section>
      <SectionHeader
      section={section}
      />
      
      {section.question_blocks.map((question,index)=>{
        return(
          <div key={index.toString()} className="question-block">
            <p className="inline-question">
              <strong>{question.question_number}</strong>
              {question.heading}
            </p>
            <div className="answer-options">
            <form>
              {question.answer_options.map((option,i)=>{
                return(
                  <label id={question.question_number} key={i.toString()} className="container question-description">
                    <span>{option.option}</span>
                    <input  
                    className={question.question_number} 
                    type="radio" name={question.question_number} 
                    value={option.option}
                    onBlur={saveOnBlur}
                    // onClick={saveOnBlur}
                    onChange={(e) => setState(question.question_number,e.target.value)}
                    />
                    <span className="checkmark" />
                    {option.value}
                </label>
                )
              })}
            </form>
          </div>
        </div>
        )
      })
      }
   </section>
  )
}
 
export default SingleAnswerMultipleChoice;