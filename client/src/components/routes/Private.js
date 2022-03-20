import AuthContext from "./AuthContext";

const Protector= ({ children, isTakingTest, pathname, useEffect, navigate }) =>{

  useEffect(() => {
    if(isTakingTest) return navigate("/test",{replace: true});

  },[pathname])

  // Keep user on this route  if not in test session.
  const render=() =>{    
    if(!isTakingTest) return children;

    return null
  };

 return(render())
}

const Private = ({ children }) => <AuthContext Protector={Protector}>{children}</AuthContext>
export default Private