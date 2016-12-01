import CouchClient from "../CouchClient";

export default class FeedsClient {
    static instance() {
        return new FeedsClient();
    }

    async getFeeds(authSession) {
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
