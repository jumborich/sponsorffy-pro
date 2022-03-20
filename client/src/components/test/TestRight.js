import FooterNav from "./FooterNav";
import Timer from "./Timer";

const TestRight = () => {
  return (
    <div id="testRight">
      <div className="testRight-container">
        <div className="test-timer-panel-container">
	      	<Timer/>
        </div>
        <FooterNav id="test-right-catergory"></FooterNav>
      </div>
    </div>
  );
};

export default TestRight;
