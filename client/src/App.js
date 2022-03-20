import {Routes,Route} from 'react-router-dom';
import ReRoute from "./components/routes/ReRoute";
import Private from "./components/routes/Private";
import Public from "./components/routes/Public"; 
import Login from  "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import Signup from "./components/auth/Signup";
import SponsorfyTv from "./components/media/sponsorfy_ty";
import Pricing from "./components/pricing/pricing";
import Account from "./components/settings/account";
import PasswordChange from "./components/settings/password_change";
import Settings from "./components/settings/settings";
import Profile from "./components/profile/profile";
import Test from "./components/test/Test";
import MarkTest from "./components/test/markTest";
import LeaderBoardMobile from "./components/leaderboard/leaderboard_small";
import Home from "./components/home/home";
import FeedLargeView from "./components/feed/feedLargeView";
import FeedIndex from "./components/feed/index";
import TestAuth from "./components/routes/TestRoute"

// import PrivacyPolicy from './components/company/privacy_policy';
// import FAQs from './components/company/FAQs';
// import Terms from './components/company/terms';
// import AboutUs from './components/AboutUs';
// import TermsOfService from './components/TermsOfService';
// import HowItWorks from './components/how/HowItWorks';
// import ContactUs from './components/ContactUs';
// <Route path="/test/marktest" element={<Private> <MarkTest/> </Private>}/>
const App = () =>(
  <Routes>
    <Route path="/test" element={ <TestAuth> <Test/> </TestAuth>}/>
    <Route path="/test/marktest" element={<MarkTest/>}/>

    <Route path="/home" element={<Private> <Home/> </Private>}>
      <Route path="/home/" element={<ReRoute to="/home/talent"/>}/>
      <Route path="/home/academia" element={<FeedIndex parentName="academia"/>}/>
      <Route path="/home/talent" element={<FeedIndex parentName="entertainment"/>}/>
      <Route path="/home/sports" element={<FeedIndex parentName="sports"/>}/>
      <Route path="/home/handwork" element={<FeedIndex parentName="handwork"/>}/>
    </Route>

    <Route path="/settings" element={<Private> <Settings/> </Private>}>
      <Route path="/settings/" element={<Account/>}/>
      <Route path="/settings/change" element={<PasswordChange/>}/>
    </Route>

    <Route path="/uploads/:postId" element={<Private> <FeedLargeView/> </Private>}/>
    <Route path="/:username" element={<Private> <Profile/> </Private>}/>

    <Route path="/leaderboard" element={<Private> <LeaderBoardMobile/> </Private>}/>
    <Route path="/sponsorfy-tv" element={<Private> <SponsorfyTv/> </Private>}/>
    <Route path="/coins" element={<Private> <Pricing/> </Private>}/>

    <Route path="/signup" element={<Public> <Signup/> </Public>}/>
    <Route path="/fp" element={<Public> <ForgotPassword/> </Public>}/>
    <Route path="/" element={<Public> <Login/> </Public>}/>
  </Routes>
);

export default App;