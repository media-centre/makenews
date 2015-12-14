/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient.js";
import RssDocument from "../rss/RssDocument.js";

export default class RssDb {
    static createFeeds(feedDocuments) {
        return PouchClient.createBulkDocuments(feedDocuments);
    }

    static addRssFeeds(sourceId, feeds) {
        return RssDb.createFeeds(RssDocument.getNewFeedDocuments(sourceId, feeds));
    }
}
