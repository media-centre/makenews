/* eslint react/display-name:0 react/jsx-wrap-multilines:0*/
import App from "./App";
import LoginPage from "./login/pages/LoginPage";
import TwitterSuccess from "./main/pages/TwitterSuccess";
import UserSession from "./user/UserSession";
import UserProfile from "./user/UserProfile";
import React from "react";
import { Route } from "react-router";
import ConfigureSourcesPage from "./config/components/ConfigureSourcesPage";
import Header from "./header/components/MainHeader";
import ScanNews from "./newsboard/components/ScanNews";
import StoryBoard from "./storyboard/components/StoryBoard";
import ConfigureURLs from "./../js/config/components/ConfigureURLs";
import AddUrl from "./../js/config/components/AddUrl";
import StoryBoardCards from "./storyboard/components/StoryBoardCards";
import WriteStory from "./storyboard/components/WriteStory";
import EditStory from "./storyboard/components/EditStory";

export function renderRoutes() {
    return (
        <Route component={App}>
            <Route path="/" component={LoginPage} onEnter={showLoginPage}/>
            <Route path="/main" component={Header} onEnter={isLoggedIn}>

                <Route path="/configure" component={ConfigureURLs}>
                    <Route path="/configure/addurl" component={AddUrl} />
                    <Route path="/configure/:sourceType(/:sourceSubType)" component={ConfigureSourcesPage}/>
                </Route>

                <Route path="/newsBoard" component={ScanNews} />
                <Route path="/story-board" component={StoryBoard}>
                    <Route path="/story-board/stories" component={StoryBoardCards} />
                    <Route path="/story-board/story" component={WriteStory} />
                    <Route path="/story-board/story/edit/:storyId" component={EditStory}/>
                </Route>
                <Route path="/twitterSuccess" component={TwitterSuccess} />
                <Route path="/profile" component={UserProfile} />
            </Route>
        </Route>
    );

}

function isLoggedIn(nextState, replaceState) {
    let userSession = UserSession.instance();
    if(!userSession.isActiveContinuously()) {
        replaceState("/");
    }

}

function showLoginPage(nextState, replaceState) {
    let userSession = UserSession.instance();
    if(userSession.isActiveContinuously()) {
        userSession.setLastAccessedTime();
        replaceState("/configure/web");
    }
}
