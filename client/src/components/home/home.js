import "./../../styles/main.css";
import Panel from "./../shared/panel";
import Navbar from "../navigation/navbar";
import NavbarFlex  from "../navigation/navbar_flex";
import { Outlet } from "react-router-dom";
import LeaderboardLarge from "../leaderboard/leaderboard_large";
import Drawer from '../Modal/drawer/index';
import ErrorModal from '../Modal/errorModal'
import ShareModal from "../Modal/shareModal";
import UploadModal from "../Modal/uploadModal/index";
import BoardContextProvider from "./../leaderboard/contexts/leaderboardContext";
import { FulfillABR } from "../../utils/handleMediaUpload";

const Home = () => {
  return (
    <div className="wrapper">
      <ErrorModal/> {/**Keeping this here to avoid overriding float Btn in Academia */}
      <div className="home-container">
        <div className="home-container-left">
          <Panel />
        </div>
        <div className="home-container-right">
         <NavbarFlex/>
          <Navbar UploadModal={UploadModal}/>
          <div className="home-contents">
            <section className="home-contents-main">
            
            <Outlet />

            </section>
            <section className="home-contents-panel">
              <BoardContextProvider>
                <LeaderboardLarge/>
              </BoardContextProvider>
            </section>
          </div>
        </div>
      </div>
      <Drawer/>
      <ShareModal/>
      <UploadModal/>
      <FulfillABR/>
    </div> 
  );
};

export default Home;