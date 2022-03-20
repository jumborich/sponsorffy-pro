import SectionHeader from "../../utils/sectionHeader";

const NoteCompletion = ({section, setState, saveOnBlur }) =>{
  return(
    <section>
    
      <SectionHeader
      section={section}
      />

      <div className="selection-table-reading">
        <div>{section.table.heading}</div>
        {section.table.table_items.map((item,index)=>(
          <div key={index.toString()} className="tb-item">
            <span>{item.option}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="question-block">
        {section.question_blocks.map((question,index)=>{
          return(
            <p key={index.toString()} className="inline-question">
              <strong>{question.question_number}</strong>
              {question.heading}
              <select id={question.question_number} className="question-description select-box" data-focusable="true"
              onBlur={saveOnBlur}
              defaultValue={"select"}
              onChange={(e)=>setState(question.question_number,e.target.value)}>
              <option value="select" disabled>select</option>
              {section.table.table_items.map((item,index )=>{
                return(
                  <option key={index.toString()} value={item.option} className="r-14lw9ot">
                  {item.option}
                  </option>
                )
              })}
              </select>
            </p>
          )
        })}
      </div>
    </section>
  )
}

export default NoteCompletion;