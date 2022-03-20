import {useRef, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import { showAlert } from "../../redux/utils/postActions";

const Toast = ({ parentName, className, alertType, timeOut}) =>{
  const dispatch = useDispatch();
  const {main, subMain, onClick, alertName} = useSelector(state => state[parentName].alertMessage);

  let timerId = useRef({});
  useEffect(()=>{
    if(!main  || !subMain) return;
    
    timerId.current = setTimeout(() =>{
      dispatch(showAlert({main:"", subMain:"", alertName:"", onClick:null},parentName));
    },timeOut);

    return () => clearTimeout(timerId.current);
  },[main, subMain, parentName]);

  const renderToast = () => {
    return(
      <div className={className ? className : "feed-upload-success"}
      onClick={() =>{
        if(!onClick) return;
        onClick();
        clearTimeout(timerId.current);
        dispatch(showAlert({main:"", subMain:"", alertName:"", onClick:null},parentName));
      }}>
        { main } <span>{ subMain }</span>
      </div>
    )
  }

  return(
    alertType === alertName && renderToast()
  )
}

export default Toast;