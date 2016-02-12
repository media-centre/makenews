/* eslint react/display-name:0 */
"use strict";
import App from "./App.jsx";
import LoginPage from "./login/pages/LoginPage.jsx";
import MainPage from "./main/pages/MainPage.jsx";
import ConfigurePage from "./config/pages/ConfigurePage.jsx";
import AllCategories from "./config/components/AllCategories.jsx";
import CategoryPage from "./config/components/Category.jsx";
import SurfPage from "./surf/pages/SurfPage.jsx";
import ParkPage from "./park/pages/ParkPage.jsx";
import TwitterSuccess from "./main/pages/TwitterSuccess.jsx";
import UserSession from "./user/UserSession";
import DbSession from "./db/DbSession.js";
import History from "./History";
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
                    <Route path="/configure/category/:categoryId/:categoryName" component={CategoryPage}/>
                </Route>

                <Route path="/surf" component={SurfPage} />
                <Route path="/park" component={ParkPage} />
                <Route path="/twitterSuccess" component={TwitterSuccess} />
            </Route>
        </Route>
    );
}

function isLoggedIn(nextState, replaceState) {
    let userSession = UserSession.instance(History.getHistory());
    if(userSession.isActiveContinuously()) {
        dbSync();
    } else {
        replaceState({ "nextPathname": nextState.location.pathname }, "/");
    }

}

function showLoginPage(nextState, replaceState) {
    let userSession = UserSession.instance(History.getHistory());
    if(userSession.isActiveContinuously()) {
        userSession.startSlidingSession();
        replaceState({ "nextPathname": nextState.location.pathname }, "/surf");
    }
}

function dbSync() {
    DbSession.instance();
}
