import React from 'react';

const SelectionTable = ({ section }) => {
  return(
    <div className="selection-table selection-table-WR">
      <div>{section.table.heading}</div>
      {section.table.table_items.map((item, index)=>{
        return(
          <div key={index.toString()} className="tb-item">
            <span>{item.option}</span> 
            <span>{item.value}</span>
          </div>
        )
      })}	
   </div>
  )
}
 
export default SelectionTable;