/* eslint no-undef:0 */

"use strict";

export default class FacebookLogin {

    static instance() {
        return new FacebookLogin();
    }

    constructor() {
        this.initialize();
    }

    initialize() {
        window.fbAsyncInit = () => {
            FB.init({ "appId": "939803976108942",
                "cookie": true,
                "xfbml": true,
                "version": "v2.5"
            });

            FB.getLoginStatus((response) => {
                this.setLoginStatus(response);
            });
        };
        this.loadSDK(document, "script", "facebook-jssdk");
    }

    loadSDK(document, source, id) {
        let js = null, fjs = document.getElementsByTagName(source)[0];
        if (!document.getElementById(id)) {
            js = document.createElement(source); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }
    }

    isLoggedIn() {
        return this.status === "connected";
    }

    setLoginStatus(response) {
        this.status = response.status;
    }

    login(callback) {
        FB.login((response) => {
            if (response.authResponse) {
                return (callback(response.authResponse));
            }
            return (callback(null, response.error));
        }, { "scope": "public_profile, email, user_friends, user_likes" });
    }


}
