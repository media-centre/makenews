import CouchClient from "../CouchClient";
import ApplicationConfig from "../config/ApplicationConfig";
import { searchDocuments } from "./../LuceneClient";
import R from "ramda"; //eslint-disable-line id-length

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

    async searchFeeds(sourceType, searchKey, skip) {
        let result = { };
        let queryString = searchKey === "" ? "*/*" : `${searchKey}*`;
        try {
            let query = {
                "q": `title:${queryString}`,
                "limit": LIMIT_VALUE,
                skip
            };
            let dbName = ApplicationConfig.instance().adminDetails().db;
            dbName = "db_f7c905535b6a74667a913bb9f346b4db7e4d161c54c407f1f6c7bd8d59ef83e3";
            let response = await searchDocuments(dbName, "_design/feedSearch/by_title", query);

            result.docs = R.map(row => row.fields)(response.rows);
            result.paging = { "offset": (skip + LIMIT_VALUE) };

        } catch (error) {
            this.handleRequestError(searchKey, error);
        }
        return result;
    }
}
