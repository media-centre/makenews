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
        return new Promise((resolve, reject) => {
            this.isAuthenticated().then((authenticated) => {
                if(authenticated) {
                    resolve();
                } else {
                    this.requestToken().then((response) => {
                        let twitterWindow = window.open(response.authenticateUrl, "twitterWindow", "location=0,status=0,width=800,height=600");
                        let maxIterations = 150, iteration = 0;
                        let timer = setInterval(() => { //eslint-disable-line max-nested-callbacks
                            if(iteration > maxIterations) {
                                clearInterval(timer);
                                reject(false);
                            }
                            if(twitterWindow.closed) {
                                clearInterval(timer);
                                let appWindow = AppWindow.instance();
                                if(appWindow.get("twitterLoginSucess")) {
                                    appWindow.set("twitterLoginSucess", false);
                                    resolve(true);
                                } else {
                                    reject(false);
                                }
                            }
                            iteration += 1;
                        }, TwitterLogin.getWaitTime());
                    });
                }
            });
        });
    }
    static getWaitTime() {
        let twoSeconds = 2000;
        return twoSeconds;
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
