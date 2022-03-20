import {SET_ACTIVATE_PAGE,SET_CURRENT_TYPE,SET_ANSWERS,SET_STATE_TEMPLATE} from './ActionTypes';

export const setActivePage = (page) =>({
  type: SET_ACTIVATE_PAGE,
  payload: page
});

export const setCurrentType = (currType) =>({
  type: SET_CURRENT_TYPE,
  payload: currType
});

// User's Saved answers
export const setAnswers = (answers,isNewAnswer) =>({
  type: SET_ANSWERS,
  payload: {answers, isNewAnswer}
});


// User's Saved state template
export const setStateTemplate = (stateTemplate) =>({
  type: SET_STATE_TEMPLATE,
  payload: stateTemplate
});
