/**Serves as a parent for all private routes */
import {useEffect} from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

const Context = ({ children }) =>{
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const{isUserLoggedIn} = useSelector((state) => state.auth);
  const{testSession} = useSelector((state) => state.user.user);
  const auth_key = typeof window !=="undefined" && localStorage.getItem("auth_key"); //checks if user is logged in for user page refreshes
  const isTakingTest = testSession && testSession.candidateId;

  useEffect(() => {
    // Log user out to enable cookie deletion
    if(!auth_key) return navigate("/", { replace: true});

    if(isTakingTest) return navigate('/test',{replace: true})
    

  },[pathname])

  // Keep user on this route  if logged in.
  const render=() =>{    
    if(isUserLoggedIn){

      return children(useEffect, navigate, isTakingTest, pathname)
    }

    return null
  };

 return render()
};

export default function AuthContext({ children, Protector }){
  return(
    <Context>
      {
        (useEffect, navigate, isTakingTest, pathname) =>(
          <Protector isTakingTest={isTakingTest} pathname={pathname} useEffect={useEffect} navigate={navigate}>
            {children}
          </Protector>
        )
      }
    </Context>
  )
};