import AppWindow from "../utils/AppWindow";
import AjaxClient from "../utils/AjaxClient";

export default class TwitterLogin {
    static instance() {
        return new TwitterLogin();
    }

    login() {
        return new Promise((resolve, reject) => {
            const twitterWindow = window.open("", "twitterWindow", "location=0,status=0,width=800,height=600");
            this.requestToken().then((response) => {
                twitterWindow.location = response.authenticateUrl;
                const maxIterations = 150;
                let iteration = 0;
                const timer = setInterval(() => { //eslint-disable-line max-nested-callbacks
                    if(iteration > maxIterations) {
                        clearInterval(timer);
                        reject(false);
                    }
                    if(twitterWindow.closed) {
                        clearInterval(timer);
                        const appWindow = AppWindow.instance();
                        if(appWindow.get("twitterLoginSucess")) {
                            appWindow.set("twitterLoginSucess", false);
                            this.authenticated = true;
                            resolve(true);
                        } else {
                            reject(false);
                        }
                    }
                    iteration += 1; // eslint-disable-line no-magic-numbers
                }, TwitterLogin.getWaitTime());
            });
        });
    }
    static getWaitTime() {
        const twoSeconds = 2000;
        return twoSeconds;
    }

    requestToken() {
        const appServerUrl = AppWindow.instance().get("serverUrl");
        const serverCallbackUrl = appServerUrl + "/twitter-oauth-callback";
        const clientCallbackUrl = appServerUrl + "/#/twitterSuccess";
        const ajaxClient = AjaxClient.instance("/twitter-request-token");
        return ajaxClient.get({ "clientCallbackUrl": clientCallbackUrl,
            "serverCallbackUrl": serverCallbackUrl });
    }
}
