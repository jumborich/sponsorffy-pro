import { useEffect } from 'react';
import TestLeft from './TestLeft';
import TestRight from './TestRight';
import TestNav from './TestNav';
import RenderTestType from './RenderTestType';
import TestContextProvider from './TestContextProvider';
import './styles/testStyles.css';

const Test = () => {

  useEffect(()=>{

    // 3. Disabling the mouse right click event  to avoid users copy/paste in test writings:WHILE ON PRODUCTION
    // const testBody=document.getElementById("test-container");
    // testBody.oncontextmenu=()=>false //Cancels mouse right click to view page source
    // testBody.onselectstart=()=>false; //Cancels selecting to copy
    // testBody.ondragstart=()=>false; //cancels dragging 
    // testBody.onpaste=()=>false; //cancels pasting of any sort
  });

  return (
    <div className="test-top-level-wrapper">
      <div id="test-container">
        <TestLeft />
        <div className="whole-page-container">
          <TestNav />
          <div className="test-middle-right-container">

            <TestContextProvider>
              <RenderTestType/>
            </TestContextProvider>

            <TestRight/>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;