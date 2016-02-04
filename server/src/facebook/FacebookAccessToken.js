"use strict";
import AdminDbClient from "../db/AdminDbClient";
import ApplicationConfig from "../config/ApplicationConfig";

export default class FacebookAccessToken {

    static instance() {
        return new FacebookAccessToken();
    }

    getAccessToken(userName) {
        return new Promise((resolve, reject) => {
            const adminDetails = ApplicationConfig.instance().adminDetails();
            AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db).then(dbInstance => {
                dbInstance.getDocument(userName + "_facebookToken").then((document) => {
                    resolve(document.access_token);
                }).catch(() => {
                    reject("access token not there");
                });
            });
        });
    }
}
