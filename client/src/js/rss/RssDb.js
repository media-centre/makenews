/* eslint no-underscore-dangle:0, no-unused-vars:0 */


import PouchClient from "../db/PouchClient";

export default class RssDb {
    static addRssFeeds(feedDocuments) {
        return PouchClient.bulkDocuments(feedDocuments);
    }
}
