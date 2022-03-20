import React  from "react";
import App from "../src/App";
import { Provider } from 'react-redux';
import store from "../src/redux/store";
import ReactDomServer from "react-dom/server";
import { StaticRouter } from 'react-router-dom/server';
import axios from "axios";
import { baseURL } from "../src/utils/_useAxios";
import { fetchUserSuccess } from "../src/redux/user/UserAction";
const fs = require("fs");
const compression = require("compression");
const path = require("path");
const express = require("express");

// Create App
const app = express();

// Compress text-based files
app.use(compression({ level:9 }));

app.use(express.static(path.join(__dirname, "../build")))

app.get(/\.(js|css|map|ico|json|txt)$/, express.static(path.join(__dirname,"../build")))

// Read index.html from build/index.html
const htmlData = fs.readFileSync(path.join(__dirname, "../build/index.html"), {encoding: "utf8"});

// Check user's auth status and continue with middleware stack
app.get("/*", (req,res, next) =>{
  if(req.headers.cookie){
    axios(`${baseURL}users/me`, {headers: req.headers}).then(res =>{
      if(res){
        store.dispatch(fetchUserSuccess(res.data.user));
        store.dispatch({ type:"IS_LOGGED_IN", payload:true });
        next();
      }
    }).catch(err => {
      next();
    })
  }
  else  return next();
});


// Every other route serves the initial Html
app.get("*",(req, res) =>{

  // Render the app in client as a HTML stream  
  const context = {};
  const appHTML = ReactDomServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.originalUrl} context={context}>
          <App/>
      </StaticRouter>
    </Provider>
  );

    // // Put the App string into the bundled html file && Inject Store to html file
  let serverHtml  = htmlData.replace(`<div id="Judith-Mbonu"></div>`, `<div id="Judith-Mbonu">${appHTML}</div>`); //Judith-Mbonu

  // set header
  res.contentType("text/html");

  // // send back to user
  res.status(200).send(serverHtml)
});

// Configure this for production
const PORT = 3000;
app.listen(PORT, () => console.log("Server running on port ", PORT));