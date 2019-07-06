/* eslint no-undef:0 */
import AppWindow from "../../js/utils/AppWindow";
import AjaxClient from "../utils/AjaxClient";
import R from "ramda"; // eslint-disable-line id-length

export default class FacebookLogin {

    static instance() {
        return new FacebookLogin();
    }

    constructor() {
        //this.initialize(); // todo it was activated and blocked the stream, so now we get the feed
    }

    initialize() {
        this.loadSDK(document, "script", "facebook-jssdk");

        window.fbAsyncInit = () => {
            FB.init({
                "appId": new AppWindow().get("facebookAppId"),
                "cookie": true,
                "xfbml": true,
                "version": "v2.8"
            });
        };
    }

    loadSDK(document, source, id) {
        let js = null, fjs = R.head(document.getElementsByTagName(source));
        if (!document.getElementById(id)) {
            js = document.createElement(source); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }
    }

    login() {
        return new Promise((resolve, reject) => {
            if (FB) {
                FB.login((response) => {
                    if (response.authResponse) {
                        const headers = {
                            "Accept": "application/json",
                            "Content-type": "application/json"
                        };
                        let ajaxClient = AjaxClient.instance("/facebook-set-token");
                        ajaxClient.post(headers, { "accessToken": response.authResponse.accessToken }).then(res => {
                            resolve(res.expires_after);
                        });
                    } else {
                        reject(response);
                    }
                }, { "scope": "public_profile, email, user_friends, user_likes, user_photos, user_posts, user_actions.news, user_actions.video" });
            } else {
                reject();
            }
        });
    }
}
