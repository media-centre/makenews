/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";

export default class FeedDb {
    static fetchSurfFeedsAndCategoriesWithSource() {
        return PouchClient.fetchLinkedDocuments("category/allFeedsAndCategoriesWithSource", { "include_docs": true });
    }

    static fetchParkFeeds() {
        return PouchClient.fetchLinkedDocuments("category/parkedFeeds", { "include_docs": true });
    }

    static updateFeed(feedDoc) {
        return PouchClient.updateDocument(feedDoc);
    }

    static parkedFeedsCount() {
        return new Promise((resolve, reject) => {
            PouchClient.fetchDocuments("category/parkedFeedsCount", { "reduce": true }).then(countArray => {
                resolve(countArray[0]);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static surfFeeds(sourceId) {
        return PouchClient.fetchDocuments("category/surfFeeds", { "include_docs": true, "key": sourceId });
    }

    static sourceParkFeeds(sourceId) {
        return PouchClient.fetchDocuments("category/sourceParkFeeds", { "include_docs": true, "key": sourceId });
    }
}
