"use strict";
import AdminDbClient from "../db/AdminDbClient";

export default class FacebookAccessToken {

    static instance() {
        return new FacebookAccessToken();
    }

    getAccesToken(userName) {
        return new Promise((resolve, reject) => {
            AdminDbClient.instance().getDocument(userName + "_facebookToken").then((document) => {
                resolve(document.access_token);
            }).catch(() => {
                reject("access token not there");
            });
        });
    }
}
