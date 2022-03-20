import {useEffect} from 'react';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import renderLoader from "../../utils/Loader";

const Public = ({ children }) => {
  const navigate = useNavigate();
  const{user} = useSelector((state) => state.user);
  const isTakingTest = user.testSession && user.testSession.candidateId;
  const auth_key = typeof window !=="undefined" && localStorage.getItem("auth_key"); //checks if user is logged in for user page refreshes

  // Push user to Home once logged in
  useEffect(() =>{
    if(auth_key && user._id){
      if(isTakingTest){
        return navigate('/test',{replace: true})
        
      }
      else{
        return navigate("/home", { replace: true })
      }
    }

  });

  const renderRoute=()=>{
    if(!auth_key){
      return  children 
    }

    return renderLoader();
  }

 return renderRoute()
}
export default Public;