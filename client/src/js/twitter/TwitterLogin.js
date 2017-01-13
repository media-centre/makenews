import AppWindow from "../utils/AppWindow";
import AjaxClient from "../utils/AjaxClient";

export default class TwitterLogin {
    static instance() {
        return new TwitterLogin();
    }

    login() {
        return new Promise((resolve, reject) => {
            let twitterWindow = window.open("", "twitterWindow", "location=0,status=0,width=800,height=600");
            this.requestToken().then((response) => {
                twitterWindow.location = response.authenticateUrl;
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
                            this.authenticated = true;
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    }
                    iteration += 1;  // eslint-disable-line no-magic-numbers
                }, TwitterLogin.getWaitTime());
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
        let ajaxClient = AjaxClient.instance("/twitter-request-token");
        return ajaxClient.get({ "clientCallbackUrl": clientCallbackUrl,
            "serverCallbackUrl": serverCallbackUrl });
    }
}
