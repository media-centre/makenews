import CouchClient from "../CouchClient";

export default class FeedsRequestHandler {
    static instance() {
        return new FeedsRequestHandler();
    }

    async fetchFeeds(authSession, lastIndex) {
        let couchClient = await CouchClient.createInstance(authSession);
        let selector = {
            "selector": {
                "sourceUrl": {
                    "$gt": null
                },
                "docType": {
                    "$eq": "feed"
                },
                "pubDate": {
                    "$gt": null
                }
            },
            "fields": ["title", "description", "sourceType", "tags", "pubDate", "enclosures", "images"],
            "sort": [{ "pubDate": "desc" }],
            "skip": lastIndex
        };
        let feeds = await couchClient.findDocuments(selector);
        return feeds;
    }
}
