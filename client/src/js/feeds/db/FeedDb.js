/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";
import DateTimeUtil from "../../utils/DateTimeUtil.js";
import AppWindow from "../../utils/AppWindow.js";

export default class FeedDb {
    static fetchSurfFeedsAndCategoriesWithSource(options = { "include_docs": true, "descending": true }) {
        return PouchClient.fetchLinkedDocuments("category/allFeedsAndCategoriesWithSource", options);
    }

    static fetchParkFeeds(options = { "include_docs": true, "descending": true }) {
        return PouchClient.fetchLinkedDocuments("category/parkedFeeds", options);
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

    static fetchPastFeeds(numberOfDays) {
        let dateBeforeGivenDays = DateTimeUtil.getCurrentTimeStamp().subtract(numberOfDays, "days").toISOString();
        return PouchClient.fetchDocuments("category/latestFeeds", { "include_docs": true, "descending": true, "startkey": dateBeforeGivenDays });
    }

    static deletePastFeeds() {
        return new Promise((resolve, reject) => {
            let maxSurfFeedsLifeInDays = AppWindow.instance().get("maxSurfFeedsLifeInDays");
            if(!maxSurfFeedsLifeInDays) {
                return resolve("maxSurfFeedsLifeInDays is null or empty. Ignoring the action.");
            }
            FeedDb.fetchPastFeeds(maxSurfFeedsLifeInDays).then(pastFeeds => {
                PouchClient.bulkDelete(pastFeeds).then(() => {
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
}
