/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient.js";
import FacebookDocument from "../facebook/FacebookDb.js";

export default class FacebookDb {
    static addFacebookFeeds(feeds) {
        return PouchClient.bulkDocuments(feeds);
    }

    static getTokenDocument() {
        return new Promise((resolve, reject) => {
            PouchClient.getDocument("facebookTokenExpiration").then((document) => {
                resolve(document);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static updateTokenDocument(document) {
        PouchClient.updateDocument(document);
    }

    static createTokenDocument(expiredAfter) {
        let document = { "_id": "facebookTokenExpiration", "expiredAfter": expiredAfter };
        PouchClient.createDocument(document);
    }
}
