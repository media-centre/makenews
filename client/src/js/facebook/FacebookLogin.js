/* eslint no-undef:0 */
import FacebookRequestHandler from "./FacebookRequestHandler";
import UserInfo from "../user/UserInfo";
import AppWindow from "../../js/utils/AppWindow";
import R from "ramda"; // eslint-disable-line id-length

export default class FacebookLogin {

    static instance() {
        return new FacebookLogin();
    }

    constructor() {
        this.initialize();
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

    showLogin(callback) { //eslint-disable-line
        if (FB) {
            FB.login((response) => {
                if (response.authResponse) {
                    return (callback(response.authResponse));
                }
                return (callback(null, response));
            }, { "scope": "public_profile, email, user_friends, user_likes, user_photos, user_posts, user_actions.news, user_actions.video" });
        } else {
            return callback(null, "");
        }
    }


    login() {
        return new Promise((resolve, reject) => {
            this.showLogin((response, error) => {
                if(response) {
                    FacebookRequestHandler.setToken(response.accessToken).then(res => {
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                    });
                } else {
                    reject(error);
                }
            });
        });
    }

    static getCurrentTime() {
        return new Date().getTime();
    }

    static isTokenExpired() {
        return new Promise((resolve) => {
            UserInfo.getUserDocument().then((document) => {
                if (!document.facebookExpiredAfter) {
                    resolve(true);
                }
                resolve(FacebookLogin.getCurrentTime() > document.facebookExpiredAfter);
            }).catch(() => {
                resolve(true);
            });
        });
    }
}
