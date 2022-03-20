import {useEffect} from 'react';
import { useNavigate} from 'react-router-dom';

// This redirects from path to the specified to-path
const ReRoute = ({to}) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, {replace:true})
  },[to])
  
  return null;
}

export default ReRoute;