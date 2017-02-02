import CouchClient from "../CouchClient";

export default class FeedsRequestHandler {
    static instance() {
        return new FeedsRequestHandler();
    }

    async fetchFeeds(authSession, offset, sourceType, sources) {
        let couchClient = CouchClient.instance(authSession);
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "feed"
                },
                "sourceType": {
                    "$in": sourceType
                },
                "pubDate": {
                    "$gt": null
                }
            },
            "fields": ["_id", "title", "description", "link", "sourceType", "bookmark", "tags", "pubDate", "videos", "images", "sourceId"],
            "sort": [{ "pubDate": "desc" }],
            "skip": offset
        };
        if(sources) {
            let operator = "$eq";
            if(sources instanceof Array) {
                operator = "$in";
            }
            selector.selector.sourceId = {};
            selector.selector.sourceId[operator] = sources;

        }
        return await couchClient.findDocuments(selector);
    }
}
