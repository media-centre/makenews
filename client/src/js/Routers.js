/* eslint react/display-name:0 */
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
import UserProfile from "./user/UserProfile.jsx";
import Help from "./help/Help.jsx";
import DbSession from "./db/DbSession";
import React from "react";
import { Route } from "react-router";
import FacebookConfigure from "./config/components/FacebookConfigure";


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

                <Route path="/surf" component={SurfPage} />
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
