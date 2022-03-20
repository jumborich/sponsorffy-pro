import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch} from "react-redux";
import {setErrMesage} from "./../../redux/navBar/NavActions";
import TestModal from "../Modal/testModal";

const ErrorModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector(state => state.navBar);

  const closeModal = ()=> dispatch(setErrMesage({type:"", message:"", errAction:""}));

  const _useModal = () => ({isTestModal:error.message, closeModal})

  const options = {
    upvote:{
      header:"NOT A CONTESTANT!", //Text to display as the header of modal
      subHeader:error.message, //Text to display as sub-header of Modal
      choice:["UPLOAD","TAKE TEST"], //Users options to choose from
      choiceParams:["upload","test"], //Parameters to be passed to functions of the users choice option
      callback: handleUpvoteErr
    },
    
    balance:{
      header:"INSUFFICIENT COIN BALANCE",
      subHeader:error.message, 
      choice:["Buy coins","Cancel"],
      choiceParams:["coins","cancel"],
      callback: handleBalanceErr
    }
  };

  function handleUpvoteErr(choiceParam){
    closeModal(); // close the modal

    dispatch(setErrMesage({type:"", message:"", errAction:true}));

    if(choiceParam === "test") navigate("/home/academia", {replace: true})

    if(choiceParam === "upload"){
      document
      .querySelector("label[for='doc_uploads']")
      .click();

      dispatch(setErrMesage({type:"", message:"", errAction:false}));
    }

  };

  function handleBalanceErr(choiceParam){
    closeModal(); // close the modal

    if(choiceParam ==="coins") navigate("/coins");

    // Both cancel and coins will need modal closed
    dispatch(setErrMesage({type:"", message:"", errAction:false}));
  }

  return(
    <>
      {error.message ?<TestModal {...{...options[error.type], _useModal}}/>:null}
    </>
  );
}
 
export default ErrorModal;

//<label  className="feed-float-btn" htmlFor="doc_uploads"/>