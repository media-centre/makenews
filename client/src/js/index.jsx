"use strict";
import { Provider } from "react-redux";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage/MainPage.jsx";
import ConfigurePage from "./pages/MainPage/ConfigurePage.jsx";
import SurfPage from "./pages/MainPage/SurfPage.jsx";
import ParkPage from "./pages/MainPage/ParkPage.jsx";
import contentDiscoveryApp from "./Reducers.js";
import ReactDOM from "react-dom";
import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import "babel/polyfill";

import Router, { Route } from "react-router";

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

let store = createStoreWithMiddleware(contentDiscoveryApp);

function renderRoutes() {
    return (
    <Route component={App}>
      <Route path="/" component={LoginPage} />
      <Route path="/main" component={MainPage}>
          <Route path="/" component={ConfigurePage} />
          <Route path="/configure" component={ConfigurePage} />
          <Route path="/surf" component={SurfPage} />
          <Route path="/park" component={ParkPage} />
      </Route>
    </Route>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <Router>{renderRoutes()}</Router>
  </Provider>,
  document.getElementById("main")
);
