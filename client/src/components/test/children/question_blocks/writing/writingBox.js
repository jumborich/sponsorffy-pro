import { FiTrash } from "react-icons/fi";

const WritingBox = ({question_number, value, setState, saveOnBlur, del})=>(
  <p className="inline-question question-description">
    <strong>{String(question_number).substring(1)}</strong>
    <input 
      className="writing-box"
      type="text" 
      placeholder="type sentence..." 
      value={value || ""}
      onChange={(e)=>setState(question_number,e.target.value)}
      onBlur={saveOnBlur}
    />
    {del && <span className="delete-writing-box" onClick={() => del(question_number)}><FiTrash/></span>}
  </p>
);
 
export default WritingBox;