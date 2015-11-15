"use strict";
import { renderRoutes } from "./Routers.js";
import { Provider } from "react-redux";
import contentDiscoveryApp from "./Reducers.js";
import ReactDOM from "react-dom";
import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import "babel/polyfill";
import Router from "react-router";

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

let store = createStoreWithMiddleware(contentDiscoveryApp);

ReactDOM.render(
  <Provider store={store}>
    <Router>{renderRoutes()}</Router>
  </Provider>,
  document.getElementById("main")
);
