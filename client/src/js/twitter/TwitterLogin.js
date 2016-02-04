"use strict";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler.js";
import AppWindow from "../utils/AppWindow.js";
import LoginPage from "../login/pages/LoginPage.jsx";
import FacebookTwitterDb from "../socialAccounts/FacebookTwitterDb.js";

export default class TwitterLogin {
    static instance() {
        return new TwitterLogin();
    }

    login() {
        return new Promise((resolve) => {
            this.isAuthenticated().then((authenticated) => {
                if(authenticated) {
                    resolve();
                } else {
                    this.requestToken().then((response) => {
                        window.open(response.authenticateUrl, "twitterWindow", "location=0,status=0,width=800,height=600");
                        resolve();
                    });
                }
            });
        });
    }

    requestToken() {
        let appServerUrl = AppWindow.instance().get("serverUrl");
        let serverCallbackUrl = appServerUrl + "/twitter-oauth-callback";
        let clientCallbackUrl = appServerUrl + "/#/twitterSuccess";
        return TwitterRequestHandler.requestToken(clientCallbackUrl, serverCallbackUrl, LoginPage.getUserName());
    }

    isAuthenticated() {
        return new Promise((resolve) => {
            FacebookTwitterDb.getTokenDocument().then((document) => {
                resolve(document.twitterAuthenticated === true);
            }).catch(() => {
                resolve(false);
            });
        });
    }
}
