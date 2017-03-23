import App from "./App";
import LoginPage from "./login/pages/LoginPage";
import TwitterSuccess from "./main/pages/TwitterSuccess";
import UserSession from "./user/UserSession";
import ChangePassword from "./user/ChangePassword";
import React from "react";
import { Route } from "react-router";
import ConfigureSourcesPage from "./config/components/ConfigureSourcesPage";
import Main from "./header/components/Main";
import ScanNews from "./newsboard/components/ScanNews";
import StoryBoard from "./storyboard/components/StoryBoard";
import ConfigureURLs from "./../js/config/components/ConfigureURLs";
import AddUrl from "./../js/config/components/AddUrl";
import StoryCards from "./storyboard/components/StoryCards";
import EditStory from "./storyboard/components/EditStory";
import WelcomePage from "./welcome/WelcomePage";
import ConfigurationIntro from "./welcome/ConfigurationIntro";

export function renderRoutes(store) {
    return (
        <Route component={App}>
            <Route path="/" component={LoginPage} onEnter={(nextState, replaceState) => showLoginPage(store, replaceState)}/>
            <Route path="/main" onEnter={(nextState, replaceState) => isLoggedIn(store, replaceState)}>
                <Route path="/onboard" component={WelcomePage} />
                <Route path="/configure-intro" component={ConfigurationIntro}/>
                <Route component={Main}>
                    <Route path="/configure" component={ConfigureURLs}>
                        <Route path="/configure/addurl" component={AddUrl} />
                        <Route path="/configure/:sourceType(/:sourceSubType)" component={ConfigureSourcesPage}/>
                    </Route>

                    <Route path="/newsBoard" component={ScanNews} />
                    <Route path="/story-board" component={StoryBoard}>
                        <Route path="/story-board/stories" component={StoryCards} />
                        <Route path="/story-board/story" component={EditStory} />
                        <Route path="/story-board/story/edit/:storyId" component={EditStory}/>
                    </Route>
                    <Route path="/twitterSuccess" component={TwitterSuccess} />
                    <Route path="/change-password" component={ChangePassword} />
                </Route>
            </Route>
        </Route>
    );
}

function isLoggedIn(store, replaceState) {
    const userSession = UserSession.instance();
    if(userSession.isActiveContinuously()) {
        userSession.init(store.dispatch);
    } else {
        replaceState("/");
    }
}

function showLoginPage(store, replaceState) {
    const userSession = UserSession.instance();
    if(userSession.isActiveContinuously()) {
        userSession.init(store.dispatch);
        replaceState("/newsBoard");
    }
}
