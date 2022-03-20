import SectionHeader from "../../utils/sectionHeader";

const TrueFalse = ({section, setState, saveOnBlur}) => {
  return(
    <section>

      <SectionHeader
      section={section}
      />

      <p className="font-italic true-false">
      {section.sub_heading_2.map((subHeading_2,index)=>{
        return(
          <span key={index.toString()}>
            <span>{subHeading_2.option}</span>
            {subHeading_2.value}<br />
          </span>
        )
      })}
      </p>

      <div  className="question-block">
      {section.question_blocks.map((question,index)=>{
        return(
          <p key={index.toString()} className="inline-question">
          <strong>{question.question_number}</strong>
              {question.heading}
          <span>
            <select id={question.question_number} className="question-description select-box"  
            onBlur={saveOnBlur}
            defaultValue={"select"}
            onChange={(e) =>setState(question.question_number,e.target.value)}>
            <option value={"select"} disabled>select</option>
              {section.sub_heading_2.map((subHeading_2,index)=>{
                return(
                  <option key={index.toString()} value={subHeading_2.option} className="r-14lw9ot">
                    {subHeading_2.option}
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
 
export default TrueFalse;