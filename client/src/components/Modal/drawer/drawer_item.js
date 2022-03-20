import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Logout from "../../auth/Logout"

const DrawerItem = ({ children,to, handleModal}) => {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const goTo = ()=>{

    // Log user out
    if(to === "/"){
      Logout(dispatch,navigate);
    }
    
    navigate(to);
    handleModal(false);
  }

  return (
    <div
      className="drawer-item"
      onClick={goTo}
    >
      {children}
    </div>
  );
};

export default DrawerItem;
