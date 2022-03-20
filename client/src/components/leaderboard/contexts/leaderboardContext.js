import {useState, useEffect,createContext} from "react";
import { useSelector, useDispatch } from "react-redux";
import FetchBoard from "../fetch/fetchBoard";
import {setBoardItems} from "../../../redux/leaderBoard/LBActions";
import {io} from "socket.io-client";
const socket = io("http://localhost:3001"); //Sponsorfy server url

export const BoardContext = createContext();

const BoardContextProvider =({children})=>{
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user)
  const boardState= useSelector(state => state.leaderboard);
  const{leaders,leaderCount,pages,boardItems} =boardState
  const { boardType } = boardItems;
  const [currentCategory,setCurrentCategory] = useState("all");
  const [shouldFetch, setShouldFetch] =useState(false);

  // Exposes methods for getting score/leader boards
  const fetch = new FetchBoard(dispatch,user);

  const toggleFetch =(BoardType)=>{

    // Query DB for user's scoreboard
    if(BoardType==="score"){
      fetch.getScoreboard(BoardType);
    }

    // Query Db for users leaderboard
    if(BoardType==="leader"){
      fetch.getLeaderboard(
        BoardType,
        pages,
        leaders,
        leaderCount,
        currentCategory
      );
    }
  }

  // Returns the event listener for socket event below
  const boardListener =({BoardType,countDownTo},callback)=>{

    // Fetch data for the given boardType
    toggleFetch(BoardType)

    // Update redux with board items
    dispatch(
      setBoardItems({
        boardType:BoardType,
        countDownTo
      })
    )

    callback(null)
  }

  // SOCKET EVENTS
  useEffect(() => {

    // When server calculates rank
    socket.on("changeBoard",boardListener);

    // When user refreshes page
    if(!boardType){
      socket.emit("getBoardType")
    }

    return () =>{
      socket.off("changeBoard",boardListener);
    }
  },[])

  // Fires when a user changes category
  useEffect(() => { 
    const category=currentCategory;
    const condition= !leaders[category].length || shouldFetch;
    if(condition && boardType==="leader"){
      fetch.getLeaderboard(
        "leader",
        pages,
        leaders,
        leaderCount,
        currentCategory
      );
      setShouldFetch(false)
    }

  },[currentCategory,pages[currentCategory]])

  return(
    <BoardContext.Provider value={{currentCategory,setCurrentCategory,setShouldFetch}}>
        {children}
    </BoardContext.Provider>
  )
}

export default BoardContextProvider