import { renderRoutes } from "./Routers";
import { Provider } from "react-redux";
import contentDiscoveryApp from "./Reducers";
import ReactDOM from "react-dom";
import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { Router } from "react-router";
import History from "./History";

const store = createStore(contentDiscoveryApp, applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <Router history={History.getHistory()}>{renderRoutes()}</Router>
  </Provider>,
  document.getElementById("main")
);
