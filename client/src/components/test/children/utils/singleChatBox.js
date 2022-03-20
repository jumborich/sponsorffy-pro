import React from 'react';
import {useSelector} from 'react-redux';

const SingleChatBox = ({article, section, saveOnBlur, useTaskTwo, setState, question,renderSpeech, isRecordingId}) => {

  const {user} = useSelector(state => state.user);

  return(
    <div className="inline-question speaking-audio-container">
    <strong>{question.question_number}</strong>

    <div className="speaking-audio">
    <div className="speaking-audio-top">
      <div>
        <img  src={article.img} alt="user avatar"/>
         <audio className="" controls src={article.audios[question.question_number]}/>
      </div>
        <select  id={question.question_number} className="question-description select-audio-box"
        disabled={isRecordingId? true:false}  data-focusable="true" 
        onBlur={saveOnBlur}
        onChange={(e) =>setState(question.question_number,e.target.value)}
        >
          <option value="pick response" disabled>
            pick response
          </option>
        {section.table.table_items.map((item, index)=>{
          return(
            <option key={index.toString()} value={item.option} className="r-14lw9ot">
              {item.option}
            </option>
          )
        })}
       </select>
      </div>

    <div className="selected-item-container">
      <div className="select-selected-item" 
        style={{ 
          border:'none', 
          display:useTaskTwo.getOption(question.question_number)?'inline-block' :'none'
        }}>
        {useTaskTwo.getOption(question.question_number) &&
        section.table.table_items
        .filter(item => item.option === useTaskTwo.getOption(question.question_number))[0].value
        }
      </div>
      </div>

      <div className="speaking-audio-bottom" 
        style={{
          display: useTaskTwo.getOption(question.question_number) || useTaskTwo.getAudioUrl(question.question_number) ?"flex":"none"
        }}
        >
        {renderSpeech(question.question_number)}
        <img style={{width:"50px", height:"50px", borderRadius:"50%"}} src={user.photo} alt="user avatar"/>
      </div>
    </div>
   </div>
  )
}
 
export default SingleChatBox;