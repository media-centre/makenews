/* eslint react/display-name:0 react/jsx-wrap-multilines:0*/
import App from "./App";
import LoginPage from "./login/pages/LoginPage";
import AllCategories from "./config/components/AllCategories";
import CategoryPage from "./config/components/Category";
import TwitterSuccess from "./main/pages/TwitterSuccess";
import UserSession from "./user/UserSession";
import UserProfile from "./user/UserProfile";
import Help from "./help/Help";
import DbSession from "./db/DbSession";
import React from "react";
import { Route } from "react-router";
import FacebookConfigure from "./config/components/FacebookConfigure";
import DisplayFeeds from "../js/newsboard/components/DisplayFeeds";
import Header from "./header/components/MainHeader";
import ScanNews from "./newsboard/components/ScanNews";
import WriteAStory from "./storyboard/components/WriteAStory";
import ConfigureURLs from "./../js/config/components/ConfigureURLs";

export function renderRoutes() {
    return (
        <Route component={App}>
            <Route path="/" component={LoginPage} onEnter={showLoginPage}/>
            <Route path="/main" component={Header} onEnter={isLoggedIn}>

                <Route path="/configure" component={ConfigureURLs}>
                    <Route path="/configure/categories" component={AllCategories} />
                    <Route path="/configure/facebook" component={FacebookConfigure}/>
                    <Route path="/configure/category/:categoryId/:categoryName" component={CategoryPage}/>
                </Route>
                <Route path="/newsboard" component={ScanNews} />
                <Route path="/newsboard/trending" component={DisplayFeeds} />
                <Route path="/storyBoard" component={WriteAStory} />
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
        replaceState("/");
    }

}

function showLoginPage(nextState, replaceState) {
    let userSession = UserSession.instance();
    if(userSession.isActiveContinuously()) {
        userSession.setLastAccessedTime();
        replaceState("/configure/facebook");
    }
}

function dbSync() {
    DbSession.instance();
}
