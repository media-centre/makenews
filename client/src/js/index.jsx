"use strict";
import { Provider } from "react-redux";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage/MainPage.jsx";
import ConfigurePage from "./pages/MainPage/ConfigurePage.jsx";
import AllCategories from "./components/ConfigureComponents/AllCategories.jsx";
import CategoryPage from "./components/ConfigureComponents/Category.jsx";
import SurfPage from "./pages/MainPage/SurfPage.jsx";
import ParkPage from "./pages/MainPage/ParkPage.jsx";
import contentDiscoveryApp from "./Reducers.js";
import ReactDOM from "react-dom";
import React from "react";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import "babel/polyfill";
import Router, { Route } from "react-router";
import { dispalyAllCategoriesAsync, populateCategoryDetailsAsync } from "./Actions";

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

let store = createStoreWithMiddleware(contentDiscoveryApp);

function renderRoutes() {
    return (
    <Route component={App}>
      <Route path="/" component={LoginPage} onEnter={showLoginPage}/>
      <Route path="/main" component={MainPage} onEnter={isLoggedIn}>

          <Route path="/configure" component={ConfigurePage}>
              <Route path="/configure/categories" component={AllCategories} onEnter={()=>store.dispatch(dispalyAllCategoriesAsync())} />
                  <Route path="/configure/category/:categoryType" component={CategoryPage}/>
          </Route>

          <Route path="/surf" component={SurfPage} />
          <Route path="/park" component={ParkPage} />
      </Route>
    </Route>
  );
}

function isLoggedIn(nextState, replaceState) {
    if(localStorage.getItem("userInfo") !== "loggedIn") {
        replaceState({ nextPathname: nextState.location.pathname }, '/');
    }
}

function showLoginPage(nextState, replaceState) {
    if(localStorage.getItem("userInfo") === "loggedIn") {
        replaceState({ nextPathname: nextState.location.pathname }, '/main');
    }
}

ReactDOM.render(
  <Provider store={store}>
    <Router>{renderRoutes()}</Router>
  </Provider>,
  document.getElementById("main")
);
