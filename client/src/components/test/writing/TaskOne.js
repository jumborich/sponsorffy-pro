import {useEffect, useState, useRef} from 'react';
import { FiTrash2 } from "react-icons/fi";
import {useDispatch, useSelector} from 'react-redux';
import SectionHeader from "../children/utils/sectionHeader";
import WritingBox from "../children/question_blocks/writing/writingBox";
import {setAnswers, setStateTemplate} from '../../../redux/test/Actions';

// Returns a schema for every question's ans: (e.g - {question_num:1 , answer:"", mark:0} )
const getTemplate=(paragraphs)=>{
  let stateTemp = [];
  paragraphs.forEach((par)=>{
    const template = [...Array(par.length)].map((q,lineI)=>({question_num: par[lineI] , answer:"", mark:0}));
    stateTemp = [...stateTemp, ...template];
  });
  return stateTemp;
};

const TaskOne =({questions})=>{
  const dispatch = useDispatch();
  const{answers} = useSelector(state => state.test.answerObj);
  const{article, sections} = questions;
  const choiceSentence = sections[0]?.table?.table_items?.length; //Total available sentences in question to choose from 
  const[taskOne, setTaskOne] = useState([
    { paraCount:1, sentCount:1, paragraphs:[[11]] }, //paragraphs: Each paragraph holds reference to its sentences
    [{question_num:11 , answer:"", mark:0}]  //Will hold all sentences created by user
  ]);
  console.log("taskOne: ", taskOne)
  const[para, setPara] = useState(taskOne[0]);
  const taskRef = useRef(); //Used for storing lines in redux on unmount

  // Gets the input value for a given line
  const getVal = (ref) =>taskOne[1].find((line) => line.question_num === ref);

  // Sets previous task answers saved in db
  useEffect(() =>{
    if(answers.writing_ans.task_1.length > 0){
      setTaskOne(answers.writing_ans.task_1);
      setPara(answers.writing_ans.task_1[0])
    };
  },[answers.writing_ans]);

  // Update redux on component unmount
  useEffect(()=>()=> {
    if(taskRef.current){
      answers.writing_ans.task_1 = taskRef.current;
      dispatch(setAnswers(answers,false));
    };
  },[]);

  // updates task answers for testLeft on every question attempt
  useEffect(()=>dispatch(setStateTemplate(taskOne[1])), [taskOne]);

  // Enables saving user's answers to db only once
  const saveOnBlur = () =>{
    answers.writing_ans.task_1 = taskOne;
    dispatch(setAnswers(answers,true));
  };

  const setState =(question_number,value)=>{
    setTaskOne(prevTaskOne =>{
      prevTaskOne[1].map(q => q.question_num === question_number ? q.answer = value : q);
      return [...prevTaskOne]
    });
  };

  // Updates lines and task data when user adds new line or paragraph
  const updateTaskLines = (updatedPara) =>{

    let template = getTemplate(updatedPara.paragraphs);
    for(let i = 0; i < template.length; i++){
      const qNum = template[i].question_num;
      taskOne[1].forEach((line) => {
        if(line.question_num === qNum) template[i] = line;
      });
    };
    taskRef.current = [ {...updatedPara}, [...template] ];
    setTaskOne([ {...updatedPara}, [...template] ]);
  };

  // Re-compute paragraphs
  const computePar = (prevPar, parIndex) =>{
    let{ paragraphs } = prevPar;

    // Get reference to paragraph needing new line insertion
    let refPara = paragraphs[parIndex];
    let lastItem = refPara[refPara.length - 1];
    if(String(lastItem).includes("9")) lastItem = (parIndex + 1) * 100 + 9;
    
    return paragraphs.map((par, i) => parIndex === i?[...par, lastItem + 1] : par)
  };

  const addWriteBox =(type, parIndex)=>{

    if(para.sentCount === choiceSentence) return;
    setPara((prevPar) =>{
      const sentCount = para.sentCount;
      let updatedPara = {...prevPar, sentCount:sentCount + 1};

      if(type === "line") updatedPara = {...updatedPara, paragraphs:computePar(prevPar, parIndex)}

      if(type === "paragraph"){
        const paraCount = prevPar.paraCount + 1;
        const paragraphs  = [...prevPar.paragraphs, [ (paraCount * 10 ) + 1]];
        updatedPara = {...updatedPara, paraCount, paragraphs}
      };

      // Update task and line  data
      updateTaskLines(updatedPara)
      return updatedPara;
    });
  };

  const removeWriteBox = (Qnum=undefined, parIndex) =>{
    if(Qnum){ // Deleting a line

      // Get the index of the paragraph this line belongs to
      const pIndex = (String(Qnum).split("")[0] * 1) - 1;
      const currPar = para.paragraphs[pIndex];

      // Re-compute line numbers
      let updatedPar = [];
      for(let i = 0; i < currPar.length; i++){
        if(currPar[i] === Qnum) continue;
        if(currPar[i] > Qnum){
          const diff = currPar[i] - Qnum;
          if(diff === 1){
            currPar[i] = Qnum;
          } 
          else{
            currPar[i] = Qnum + (diff - 1);
          }
        };
        updatedPar = [...updatedPar,currPar[i]];
      };
      para.paragraphs[pIndex] = updatedPar;
      para.sentCount -= 1;
      setTaskOne(prevTask=>{
        prevTask[1] = prevTask[1].filter((line) =>{
        if(line.question_num !== Qnum){
          if(line.question_num - Qnum === 1) line.question_num = Qnum;
          return line;
        }
       });
       return [{...para}, [...prevTask[1]]];
      })
      updateTaskLines(para);
    };

    if(parIndex){ // Deleting a paragrapgh
      const currPar = para.paragraphs[parIndex];
      para.paraCount -= 1;
      para.sentCount -= currPar.length;
      para.paragraphs = para.paragraphs.filter((par,i) => i !== parIndex && par);
      updateTaskLines(para);
    }
  }

  const renderSections=()=>{
    return sections.map((section, index)=>{ 
      return(
        <section key={index.toString()}>
          <SectionHeader
          section={section}
          />

          <div className="selection-table selection-table-WR">
            <div>{section.table.heading}</div>
            {section.table.table_items.map((item, index)=>(
              <div key={index.toString()} className="tb-item">
                <span>{item.option}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>

          {para.paragraphs.map((par, i) =>(
            <div className="question-block" key={i.toString()}>
              <p className="writing-paragraph">
              Par {i + 1}.
              {(para.paragraphs.length === i+1 && i !== 0) && <span className="delete-paragraph" onClick={() =>removeWriteBox("", i)}><FiTrash2 /></span>}
              </p>
                {par.map((ref,j) =>{
                  return(
                    <WritingBox
                    setState={setState}
                    saveOnBlur={saveOnBlur}
                    key={j.toString()}
                    question_number={ref}
                    del={ref !== par[0] && removeWriteBox}
                    value={(getVal(ref) && getVal(ref).answer) || ""}
                    />
                  )
                })}
                {para.sentCount < choiceSentence && <p className="add-sentence" onClick={() =>addWriteBox("line", i)}>Add Line</p>}
            </div>
          ))}
          <div className="question-block">
            {para.sentCount < choiceSentence && <p className="add-paragraph" onClick={() =>addWriteBox("paragraph")}>Add Paragraph</p>}
          </div>
        </section>
      )
    })
  };

  return(
    <div id="writing-task">   
      <article id="readingPassage">
        {article.sentences.map((sentence,i)=> <strong key={i.toString()}> { sentence } </strong> )}
      </article>
      {renderSections()}
    </div> 
  )
};
export default TaskOne;