"use strict";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler.js";
import AppWindow from "../utils/AppWindow.js";

export default class TwitterLogin {
    static instance() {
        return new TwitterLogin();
    }

    requestToken(clientCallbackUrl) {
        let serverCallbackUrl = AppWindow.instance().get("serverUrl") + "/twitter-oauth-callback";
        return TwitterRequestHandler.requestToken(clientCallbackUrl, serverCallbackUrl);
    }
}