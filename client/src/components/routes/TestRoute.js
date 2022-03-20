import AuthContext from "./AuthContext";

const Protector = ({ children, isTakingTest, pathname, useEffect, navigate}) =>{

  useEffect(() => {
    if(!isTakingTest) return navigate("/home", { replace: true});

  },[pathname])

  // Keep user here if has testSession
  const render=() =>{
    if(isTakingTest) return children

    return null
  };

 return render()
};

const TestAuth = ({ children }) => <AuthContext Protector={Protector}>{children}</AuthContext>
export default TestAuth