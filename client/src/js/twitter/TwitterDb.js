/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient.js";

export default class TwitterDb {
    static addTweets(feeds) {
        PouchClient.bulkDocuments(feeds);
    }
}
