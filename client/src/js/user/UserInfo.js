/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient.js";

const userInfoId = "userInfo";
export default class UserInfo {
    static getUserDocument() {
        return new Promise((resolve, reject) => {
            PouchClient.getDocument(userInfoId).then((document) => {
                resolve(document);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static createOrUpdateUserDocument(paramsObj) {
        return PouchClient.getDocument(userInfoId).then((document) => {
            return PouchClient.updateDocument(Object.assign({}, document, paramsObj));
        }).catch(() => {
            let document = { "_id": userInfoId, "facebookExpiredAfter": paramsObj.facebookExpiredAfter, "twitterAuthenticated": paramsObj.twitterAuthenticated || false, "takenTour": paramsObj.takenTour || false };
            return PouchClient.createDocument(document);
        });
    }
}
