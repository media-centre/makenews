/* eslint react/display-name:0 react/jsx-wrap-multilines:0*/
import App from "./App";
import LoginPage from "./login/pages/LoginPage";
import MainPage from "./main/pages/MainPage";
import ConfigurePage from "./config/pages/ConfigurePage";
import AllCategories from "./config/components/AllCategories";
import CategoryPage from "./config/components/Category";
import SurfPage from "./surf/pages/SurfPage";
import ParkPage from "./park/pages/ParkPage";
import TwitterSuccess from "./main/pages/TwitterSuccess";
import UserSession from "./user/UserSession";
import UserProfile from "./user/UserProfile";
import Help from "./help/Help";
import DbSession from "./db/DbSession";
import React from "react";
import { Route } from "react-router";
import FacebookConfigure from "./config/components/FacebookConfigure";
import Header from "./header/components/MainHeader";


export function renderRoutes() {

    return (
        <Route component={App}>
            <Route path="/" component={LoginPage} onEnter={showLoginPage}/>
            <Route path="/main" component={MainPage} onEnter={isLoggedIn}>

                <Route path="/configure" component={ConfigurePage}>
                    <Route path="/configure/categories" component={AllCategories} />
                    <Route path="/configure/facebook" component={FacebookConfigure}/>
                    <Route path="/configure/category/:categoryId/:categoryName" component={CategoryPage}/>
                </Route>

                <Route path="/surf" component={Header} />
                <Route path="/park" component={ParkPage} />
                <Route path="/twitterSuccess" component={TwitterSuccess} />
                <Route path="/profile" component={UserProfile} />
                <Route path="/help" component={Help} />
            </Route>
        </Route>
    );
}

function isLoggedIn(nextState, replaceState) {
    let userSession = UserSession.instance();
    if(userSession.isActiveContinuously()) {
        dbSync();
    } else {
        replaceState({ "nextPathname": nextState.location.pathname }, "/");
    }

}

function showLoginPage(nextState, replaceState) {
    let userSession = UserSession.instance();
    if(userSession.isActiveContinuously()) {
        userSession.setLastAccessedTime();
        replaceState({ "nextPathname": nextState.location.pathname }, "/surf");
    }
}

function dbSync() {
    DbSession.instance();
}
