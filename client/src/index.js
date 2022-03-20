import {useEffect, StrictMode} from 'react';
import { hydrate,render } from 'react-dom';
import App from './App';
import renderLoader from "./utils/Loader";
import {fetchUserSuccess} from "./redux/user/UserAction";
import { Provider } from 'react-redux';
import _useAxios from "./utils/_useAxios";
import store  from './redux/store';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';

//checks if user is logged in for user page refreshes/first visit
function AppRoot(){
  const auth_key = typeof window !== "undefined" && localStorage.getItem("auth_key");

  useEffect(() =>{
    renderLoader();

    if(auth_key){
      _useAxios("GET",{},"users/me").then(res=>{
        
        store.dispatch(fetchUserSuccess(res.data.user));

        store.dispatch({ type:"IS_LOGGED_IN", payload:true });
  
      })
      .catch(err=>{
        if(err.response){
          const{status, statusText} = err.response;
          // const{message} = err.response.data;
          if(status===401 && statusText ==="Unauthorized"){
            localStorage.removeItem("auth_key")
          }
  
          store.dispatch({ type:"IS_LOGGED_IN", payload:false});
        } else{
          console.log(err)
          // alert("Check your Internet connection")
        }
      })
    }
  },[]);

  return(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>
    </StrictMode>   
  )
};

render(<AppRoot/>, document.getElementById("Judith-Mbonu"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

  // "@testing-library/jest-dom": "^5.11.5",
  // "@testing-library/react": "^11.1.1",
  // "@testing-library/user-event": "^12.2.0",
  // --include=dev 