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
}
