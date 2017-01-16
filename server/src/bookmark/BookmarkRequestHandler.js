import CouchClient from "../CouchClient";

export default class BookmarkRequestHandler {
    static instance() {
        return new BookmarkRequestHandler();
    }

    async updateDocument(authSession, docId) {
        let couchClient = CouchClient.instance(authSession);
        let documentObj = await couchClient.getDocument(docId);
        documentObj.bookmark = true;
        return await couchClient.saveDocument(docId, documentObj);
    }

    async getFeeds(authSession, offSet) {
        let couchClient = CouchClient.instance(authSession);
        let limitValue = offSet * 50; //eslint-disable-line no-magic-numbers
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "feed"
                },
                "bookmark": {
                    "$eq": true
                }
            },
            "limit": limitValue
        };
        return await couchClient.findDocuments(selector);
    }
}
