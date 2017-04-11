import CouchClient from "../CouchClient";
import { searchDocuments } from "./../LuceneClient";
import R from "ramda"; //eslint-disable-line id-length
import { userDetails } from "./../Factory";
import { NEWSBOARD_SOURCE_TYPES } from "./../util/Constants";
import RouteLogger from "./../routes/RouteLogger";
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

    getQuery(sourceType, searchKey) {
        const queryString = searchKey === "" ? "*/*" : `${searchKey}*`;
        switch(sourceType) {
        case NEWSBOARD_SOURCE_TYPES.trending:
            return `title:${queryString} OR description:${queryString}`;
        case NEWSBOARD_SOURCE_TYPES.bookmark:
            return `bookmark:true AND (title:${queryString} OR description:${queryString})`;
        default:
            return `sourceType:${sourceType} AND (title:${queryString} OR description:${queryString})`;
        }
    }

    async searchFeeds(authSession, sourceType, searchKey, skip) {
        const query = {
            "q": this.getQuery(sourceType, searchKey),
            "sort": "\\pubDate<date>",
            "limit": LIMIT_VALUE,
            skip,
            "include_docs": true
        };

        try {
            const dbName = userDetails.getUser(authSession).dbName;
            const response = await searchDocuments(dbName, "_design/feedSearch/by_document", query);

            let result = {};
            result.docs = response.rows.map((row) => {
                if(sourceType === NEWSBOARD_SOURCE_TYPES.bookmark) {
                    return row.doc;
                }else if(row.doc.sourceDeleted !== true) {
                    return row.doc;
                }
                return {};
            });

            let empty = doc => !R.isEmpty(doc);
            result.docs = R.filter(empty, result.docs);
            result.paging = { "offset": (skip + LIMIT_VALUE) };
            return result;
        } catch (error) {
            RouteLogger.instance().warn(`Search Feeds:: request with : ${searchKey} failed with error: [${JSON.stringify(error)}]`);
            throw `No Search results found for this keyword "${searchKey}"`; //eslint-disable-line no-throw-literal
        }
    }
}
