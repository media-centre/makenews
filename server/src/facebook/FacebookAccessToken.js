"use strict";
import AdminDbClient from "../db/AdminDbClient";

let _token = null;
export default class FacebookAccessToken {

    static instance() {
        return new FacebookAccessToken();
    }

    getAccesToken() {
        return new Promise((resolve, reject) => {
            if(FacebookAccessToken.getToken()) {
                resolve(FacebookAccessToken.getToken());
            } else {
                AdminDbClient.instance().getDocument("facebookToken").then((document) => {
                    _token = document.access_token;
                    resolve(_token);
                }).catch(() => {
                    reject("access token not there");
                });
            }
        });
    }

    static getToken() {
        return _token;
    }
}
