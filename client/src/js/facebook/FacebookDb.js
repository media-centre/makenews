/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient.js";
import FacebookDocument from "../facebook/FacebookDb.js";

export default class FacebookDb {
    static addFacebookFeeds(feeds) {
        PouchClient.createBulkDocuments(feeds);
    }
}
