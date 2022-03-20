import {SET_LEADERS,SET_PAGES,SET_LEADER_COUNT,SET_BOARD_ItEMS} from "./LBActionTypes";


// boardItems
export const setBoardItems=(payload)=>{
    return({
        type:SET_BOARD_ItEMS,
        payload
    })
}

// Leaders
export const setLeaders =(leaders,category)=>_useHelper(SET_LEADERS,leaders,category);

// Page counts
export const setPages =(page,category)=>_useHelper(SET_PAGES,page,category);


// Leader list length
export const setLeaderCount =(leaderCount,category)=>_useHelper(SET_LEADER_COUNT,leaderCount,category);

// Helper
const _useHelper = (type,data,category)=>{
    if(category === "all") return {type,payload:{all:data}};
    if(category === "academia") return {type,payload:{academia:data}};
    if(category === "entertainment") return {type,payload:{entertainment:data}};
    if(category === "handwork") return {type,payload:{handwork:data}};
    if(category === "sports") return {type,payload:{sports:data}}
}