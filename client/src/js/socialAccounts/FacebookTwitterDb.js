/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient.js";

const socialAccountId = "socialAccounts";
export default class FacebookTwitterDb {
    static getTokenDocument() {
        return new Promise((resolve, reject) => {
            PouchClient.getDocument(socialAccountId).then((document) => {
                resolve(document);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static createOrUpdateTokenDocument(paramsObj) {
        PouchClient.getDocument(socialAccountId).then((document) => {
            PouchClient.updateDocument(Object.assign({}, document, paramsObj));
        }).catch(() => {
            let document = { "_id": socialAccountId, "facebookExpiredAfter": paramsObj.facebookExpiredAfter, "twitterAuthenticated": paramsObj.twitterAuthenticated || false };
            PouchClient.createDocument(document);
        });
    }
}
