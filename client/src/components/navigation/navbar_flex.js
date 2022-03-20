import { BiTrendingUp } from "react-icons/bi";
import {CgMenuLeftAlt} from 'react-icons/cg';
import NavLink from "./navLink";
import { useDispatch } from "react-redux";
import { setModal } from '../../redux/navBar/NavActions';

const Navbar_Flex=()=>{
  const dispatch = useDispatch();

  return (
    <div className="navbar-flex">
      <div className="navbar-flex-item drawer-nav-logo">
        <h3>Sponsorffy</h3>
      </div>
      <div className="navbar-flex-item navbar-flex-r-item">
      <NavLink
      to="/leaderboard"
      className="search-profile-mob">
        <BiTrendingUp/>
      </NavLink>
      <div
      onClick={() =>dispatch(setModal("drawer", true))}
      className="search-profile-mob">
        <CgMenuLeftAlt />
      </div>
      </div>
    </div>
  )
}
export default Navbar_Flex