import Navbar from "./../navigation/navbar";
import {FiExternalLink} from 'react-icons/fi';
import { Outlet } from "react-router-dom";
import NavLink from "./../navigation/navLink";
import Drawer from '../Modal/drawer/index';

const Settings = () => {
  return (
    <div className="settings-wrapper">
      <Navbar/>
      <div className="settings-container">
        <div className="settings-panel">
          <h4>Settings</h4>
          <div className="settings-panel-nav">
            <NavLink
              to="/settings"
              inActiveClassName="nav-item-settings"
              activeClassName="nav-item-settings-active"
            >
              <div className="nav-item-settings-content">
                <p>Account</p>
              </div>
            </NavLink>
            <NavLink
              to="/settings/change"
              inActiveClassName="nav-item-settings"
              activeClassName="nav-item-settings-active"
            >
              <div className="nav-item-settings-content">
                <p>Password</p>
              </div>
            </NavLink>

            <h6>General</h6>
            <NavLink
              to="/privacy"
              inActiveClassName="nav-item-settings"
              activeClassName="nav-item-settings-active"
            >
              <div className="nav-item-settings-content">
                <p>Privacy</p>
                <FiExternalLink/>
             
              </div>
            </NavLink>
            <NavLink
              to="/terms"
              inActiveClassName="nav-item-settings"
              activeClassName="nav-item-settings-active"
            >
              <div className="nav-item-settings-content">
                <p>Term and Conditions</p>
               
                <FiExternalLink/>
              
              </div>
            </NavLink>
            <NavLink
              to="/FAQs"
              inActiveClassName="nav-item-settings"
              activeClassName="nav-item-settings-active"
            >
              <div className="nav-item-settings-content">
                <p>FAQs</p>
                <FiExternalLink/>
              </div>
            </NavLink>
            <NavLink
              to="/help"
              inActiveClassName="nav-item-settings"
              activeClassName="nav-item-settings-active">
              <div className="nav-item-settings-content">
                <p>Help Center</p>
                <FiExternalLink/>
              </div>
            </NavLink>
          </div>
        </div>
        <div className="settings-contents">
          <Outlet />
        </div>
      </div>
      <Drawer/>
    </div>
  );
};

export default Settings;
