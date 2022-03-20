import SectionHeader from "../../utils/sectionHeader";

const SentenceCompletion = ({section, setState, saveOnBlur}) => {
  return(
    <section >
    
      <SectionHeader
      section={section}
      />

      {section.question_blocks.map((block, index)=>(
        <div key={index.toString()}  className="question-block">
          <p id={block.question_number} className="inline-question question-description" 
          tabIndex={index}
          onBlur={saveOnBlur}
          onKeyDown={(e)=>{
            if(e.target.type){
              e.target.addEventListener("blur",(e)=>setState(block.question_number,e.target.value))
            }
          }}>
            <strong>{block.question_number}.</strong>
            {block.heading}
          </p>
        </div>
      ))}
   </section>
  )
}
 
export default SentenceCompletion;