import CouchClient from "../CouchClient";

export default class FeedsRequestHandler {
    static instance() {
        return new FeedsRequestHandler();
    }

    async fetchFeeds(authSession, offset, filter) {
        let couchClient = CouchClient.instance(authSession);
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "feed"
                },
                "sourceDeleted": {
                    "$or": [
                        {
                            "$exists": false
                        },
                        {
                            "$exists": true,
                            "$eq": false
                        }
                    ]
                },
                "pubDate": {
                    "$gt": null
                }
            },
            "fields": ["_id", "title", "description", "link", "sourceType", "bookmark", "tags", "pubDate", "videos", "images", "sourceId"],
            "sort": [{ "pubDate": "desc" }],
            "skip": offset
        };
        if(filter && filter.sources) {
            let sourceFilters = [];
            this.prepareSourceFilter("web", filter.sources, sourceFilters);
            this.prepareSourceFilter("facebook", filter.sources, sourceFilters);
            this.prepareSourceFilter("twitter", filter.sources, sourceFilters);
            selector.selector.$or = sourceFilters;
        }
        return await couchClient.findDocuments(selector);
    }

    prepareSourceFilter(sourceType, sources = {}, sourceFilters) {
        var sourceIds = sources[sourceType];
        if(sourceIds) {
            let sourceFilter = { "sourceType": { "$eq": sourceType } };
            let [sourceId] = sourceIds;
            if(sourceId) {
                sourceFilter.sourceId = { "$in": sourceIds };
            }
            sourceFilters.push(sourceFilter);
        }
    }
}
