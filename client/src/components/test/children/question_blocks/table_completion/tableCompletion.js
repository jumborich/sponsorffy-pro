import SectionHeader from "../../utils/sectionHeader";

const TableCompletion = ({section, setState, saveOnBlur}) =>{
  return(
    <section>
    
      <SectionHeader
      section={section}
      />

      <table className="listen-table" border=".1" cellSpacing="0" cellPadding="4">
        <tbody>
          <tr className="question-description">
            <td colSpan={2}>
              <p style={{textAlign:'center', fontWeight:'bold'}}>
                {section.table.heading}
              </p>
            </td>
          </tr>
        {section.table.table_items.map((item, index)=>{
          return(
            <tr id={item.question_number} key={index.toString()} className="question-description" 
              tabIndex={0}
              onBlur={saveOnBlur}
              onKeyDown={(e) => { //used keyDown to capture keyboard events like TABBING
                if(e.target.type){
                  e.target.addEventListener("blur",(e)=>{ //input
                    setState(item.question_number,e.target.value);
                  })
                }
              }}>
              <td style={{verticalAlign:'top',width:'30%'}}><p>{item.item_1}</p></td>
              <td style={{verticalAlign:'top',width:'70%'}}><p>{item.item_2}</p></td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </section>
  )
}
 
export default TableCompletion;