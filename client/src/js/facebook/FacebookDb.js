/* eslint no-underscore-dangle:0, no-unused-vars:0 */


import PouchClient from "../db/PouchClient";

export default class FacebookDb {
    static addFacebookFeeds(feeds) {
        return PouchClient.bulkDocuments(feeds);
    }
}
