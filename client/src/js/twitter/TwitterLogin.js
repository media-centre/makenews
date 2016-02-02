"use strict";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler.js";
import AppWindow from "../utils/AppWindow.js";

export default class TwitterLogin {
    static instance() {
        return new TwitterLogin();
    }

    requestToken() {
        var appServerUrl = AppWindow.instance().get("serverUrl");
        let serverCallbackUrl = appServerUrl + "/twitter-oauth-callback";
        let clientCallbackUrl = appServerUrl + "/#/twitterSuccess";
        return TwitterRequestHandler.requestToken(clientCallbackUrl, serverCallbackUrl);
    }
}
