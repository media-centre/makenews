import App from "./App";
import LoginPage from "./login/pages/LoginPage";
import TwitterSuccess from "./main/pages/TwitterSuccess";
import TwitterFailed from "./main/pages/TwitterFailed";
import UserSession from "./user/UserSession";
import ChangePassword from "./user/ChangePassword";
import React from "react";
import { Route } from "react-router";
import ConfigureSourcesPage from "./config/components/ConfigureSourcesPage";
import Main from "./header/components/Main";
import ScanNews from "./newsboard/components/ScanNews";
import StoryBoard from "./storyboard/components/StoryBoard";
import Portfolio from "./storyboard/components/Portfolio";
import StoryCards from "./storyboard/components/StoryCards";
import EditStory from "./storyboard/components/EditStory";
import WelcomePage from "./welcome/WelcomePage";
import ConfigurationIntro from "./welcome/ConfigurationIntro";
import Help from "./user/Help";

export function renderRoutes(store) { /*eslint-disable react/jsx-no-bind*/
    return (
        <Route component={App}>
            <Route path="/" component={LoginPage} onEnter={(nextState, replaceState) => showLoginPage(store, replaceState)}/>
            <Route path="/main" onEnter={(nextState, replaceState) => isLoggedIn(store, replaceState)}>
                <Route path="/onboard" component={WelcomePage} />
                <Route path="/configure-intro" component={ConfigurationIntro}/>
                <Route component={Main}>
                    <Route path="/configure/:sourceType(/:sourceSubType)" component={ConfigureSourcesPage}/>

                    <Route path="/newsBoard" component={ScanNews} />
                    <Route path="/story-board" component={StoryBoard}>
                        <Route path="/story-board/stories" component={StoryCards} />
                        <Route path="/story-board/story" dispatch={store.dispatch} component={EditStory} />
                        <Route path="/story-board/story/edit/:storyId" dispatch={store.dispatch} component={EditStory}/>
                    </Route>
                    <Route path="/portfolio" component={Portfolio} />

                    <Route path="/twitterSuccess" component={TwitterSuccess} />
                    <Route path="/twitterFailed" component={TwitterFailed} />
                    <Route path="/change-password" component={ChangePassword} />
                    <Route path="/help" component={Help} />
                </Route>
            </Route>
        </Route>
    );
    /*eslint-enable react/jsx-no-bind*/
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
