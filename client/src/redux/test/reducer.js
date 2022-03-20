import {SET_ACTIVATE_PAGE,SET_CURRENT_TYPE,SET_ANSWERS,SET_STATE_TEMPLATE} from './ActionTypes';

const initState = {
  activePage:'one',
  currentType:'reading',
  stateTemplate:[], //used by testLeft comp to track saved answers

  //user's saved answers
  answerObj:{
    isNewAnswer:false, //Only update db if user added a new answer and not on comp mount
    answers:{
      reading_ans:{
        task_1:[],
        task_2:[]
      },
  
      listening_ans:{
        task_1:[],
        task_2:[]
      },
  
      writing_ans:{
        task_1:[],
        task_2:[]
      },
  
      speaking_ans:{
        task_1:[],
        task_2:[]
      }
    }
  }
};

const testReducer = (state = initState, action) =>{
  switch (action.type){
    case SET_ACTIVATE_PAGE:
      return {
        ...state,
        activePage: action.payload
      }

    case SET_CURRENT_TYPE:
      return {
        ...state,
        currentType: action.payload
      }

    case SET_ANSWERS:
      return {
        ...state,
        answerObj: action.payload
      }

    case SET_STATE_TEMPLATE:
      return {
        ...state,
        stateTemplate: action.payload
      }

    case "RESE_TEST_STATE":
      return {
        activePage:'one',
        currentType:'reading',
        stateTemplate:[],
        answerObj:{}
      }
      
    default:return state
  }
};
export default testReducer;