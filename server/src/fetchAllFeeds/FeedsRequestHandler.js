import CouchClient from "../CouchClient";
import { searchDocuments } from "./../LuceneClient";
import R from "ramda"; //eslint-disable-line id-length
import { userDetails } from "./../Factory";
const LIMIT_VALUE = 25;
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

    async searchFeeds(authSession, sourceType, searchKey, skip) {
        let result = { };
        const queryString = searchKey === "" ? "*/*" : `${searchKey}*`;
        const keyQuery = `title:${queryString} OR description:${queryString}`;

        const query = {
            "q": `sourceType:${sourceType} AND ${keyQuery}`,
            "limit": LIMIT_VALUE,
            skip,
            "include_docs": true
        };

        try {
            const dbName = userDetails.getUser(authSession).dbName;
            const response = await searchDocuments(dbName, "_design/feedSearch/by_document", query);

            result.docs = R.map(row => row.doc)(response.rows);
            result.paging = { "offset": (skip + LIMIT_VALUE) };
        } catch (error) {
            throw `No Search results found for this keyword "${searchKey}"`; //eslint-disable-line no-throw-literal
        }
        return result;
    }
}
