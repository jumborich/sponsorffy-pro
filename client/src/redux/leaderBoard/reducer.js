import {SET_LEADERS,SET_PAGES,SET_LEADER_COUNT,SET_BOARD_ItEMS} from './LBActionTypes';

const initState = {

    // Defines list of leaders categorically
    leaders:{
        all:[],
        academia:[],
        entertainment:[],
        handwork:[],
        sports:[],
    },

    // used for paginating results categorically
    pages:{
        all:1,
        academia:1,
        entertainment:1,
        handwork:1,
        sports:1,
    },

    //Used for counting total leaders in a category
    leaderCount:{
        all:{total:0,retrieved:0},
        academia:{total:0,retrieved:0},
        entertainment:{total:0,retrieved:0},
        handwork:{total:0,retrieved:0},
        sports:{total:0,retrieved:0}
    },

    //Toggles between score and leader boards
    boardItems:{
        boardType:"",
        countDownTo:"",
        scoreboardData:{}
    }
}

const leaderboardReducer = (state = initState, action) => {
    switch(action.type) {

        case SET_BOARD_ItEMS:
            return {...state,boardItems:{...state.boardItems,...action.payload}}

        case SET_LEADERS:
            return { ...state,leaders:{...state.leaders,...action.payload} }

        case SET_PAGES:
            return { ...state, pages:{...state.pages,...action.payload} }
        
        case SET_LEADER_COUNT:
            return { ...state, leaderCount:{...state.leaderCount,...action.payload}}
  
        default:
            return state
    }
};

export default leaderboardReducer;