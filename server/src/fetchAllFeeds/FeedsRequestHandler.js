import CouchClient from "../CouchClient";

export default class FeedsRequestHandler {
    static instance() {
        return new FeedsRequestHandler();
    }

    async fetchFeeds(authSession) {
        let couchClient = await CouchClient.createInstance(authSession);
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "feed"
                }
            }
        };
        return await couchClient.findDocuments(selector);
    }
}
