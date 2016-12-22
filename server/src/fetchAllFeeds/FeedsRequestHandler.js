import CouchClient from "../CouchClient";

export default class FeedsRequestHandler {
    static instance() {
        return new FeedsRequestHandler();
    }

    async fetchFeeds(authSession, lastIndex, sourceType) {
        let couchClient = await CouchClient.createInstance(authSession);
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "feed"
                },
                "sourceType": {
                    "$eq": sourceType
                },
                "pubDate": {
                    "$gt": null
                }
            },
            "fields": ["title", "description", "sourceType", "tags", "pubDate", "videos", "images"],
            "sort": [{ "pubDate": "desc" }],
            "skip": lastIndex
        };
        return await couchClient.findDocuments(selector);
    }
}
