import { useSelector, useDispatch} from "react-redux";
import { setModal } from "../../../redux/navBar/NavActions";
import Drawer from "./drawer";

export default function Index(){
  const dispatch = useDispatch();
  
  const { isDrawerModal } = useSelector(state => state.navBar);
  const closeModal = () =>dispatch(setModal("drawer", false));

  return(
    isDrawerModal && <Drawer isModal={isDrawerModal} handleModal ={closeModal}/>
  )
}