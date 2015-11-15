"use strict";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage/MainPage.jsx";
import ConfigurePage from "./pages/MainPage/ConfigurePage.jsx";
import AllCategories from "./components/ConfigureComponents/AllCategories.jsx";
import CategoryPage from "./components/ConfigureComponents/Category.jsx";
import SurfPage from "./pages/MainPage/SurfPage.jsx";
import ParkPage from "./pages/MainPage/ParkPage.jsx";
import React from "react";
import "babel/polyfill";
import { Route } from "react-router";

export function renderRoutes() {
    return (
        <Route component={App}>
            <Route path="/" component={LoginPage} onEnter={showLoginPage}/>
            <Route path="/main" component={MainPage} onEnter={isLoggedIn}>

                <Route path="/configure" component={ConfigurePage}>
                    <Route path="/configure/categories" component={AllCategories} />
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
        replaceState({ "nextPathname": nextState.location.pathname }, "/");
    }
}

function showLoginPage(nextState, replaceState) {
    if(localStorage.getItem("userInfo") === "loggedIn") {
        replaceState({ "nextPathname": nextState.location.pathname }, "/main");
    }
}
