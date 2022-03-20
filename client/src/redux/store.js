import {createStore, combineReducers} from 'redux';
import userReducer from './user/reducer'
import profileReducer from './profile/reducer';
import authReducer from './auth/AuthReducer';
import entReducer from './entertainment/reducer';
import handworkReducer from './handwork/reducer';
import sportsReducer from './sports/reducer';
import testReducer from './test/reducer';
import navReducer from './navBar/reducer';
import leaderboardReducer from "./leaderBoard/reducer"

const rootReducer = combineReducers({
  auth:authReducer,
  user:userReducer,
  profile:profileReducer,
  entertainment:entReducer,
  handwork:handworkReducer,
  sports:sportsReducer,
  test:testReducer,
  navBar:navReducer,
  leaderboard:leaderboardReducer
});

export default createStore(rootReducer);
