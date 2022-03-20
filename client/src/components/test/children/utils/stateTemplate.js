import {useState} from "react";

/**
 * A custom hook that returns an array of {question_num:1...n, answer:"", mark:0}
 * where n = totalQuestions in a task
 * params: totalQuestions & testType & task
 */
const useStateTemplate=(totalQuestions)=>{

  const stateTemplate = [...Array(totalQuestions)].map((q,index)=>{

    return { question_num: ++index, answer:"", mark:0 }
  });

  return useState(stateTemplate);
}

export default useStateTemplate