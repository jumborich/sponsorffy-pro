const SectionHeader = ({ section }) =>(
  <>
    {section.heading && <h4>{section.heading}</h4> }
    {section.sub_heading.map((subHeading,index)=>{
      return(
        <p key={index.toString()} className="question-description font-italic">
          {subHeading}
        </p>
      )
    })}
  </>
);
 
export default SectionHeader;