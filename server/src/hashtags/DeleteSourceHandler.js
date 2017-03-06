import CouchClient from "../CouchClient";
import { getCollectionFeedIds } from "../collection/CollectionFeedsRequestHandler";
import { FEED_LIMIT_TO_DELETE_IN_QUERY } from "../util/Constants";

export default class DeleteSourceHandler {
    static instance() {
        return new DeleteSourceHandler();
    }

    async deleteSources(sources = [], accessToken) {
        const couchClient = CouchClient.instance(accessToken);
        let sourceDocuments = [];

        if (sources.length) {
            sourceDocuments = await this.fetchSourceDocuments(couchClient, sources);
        } else {
            sourceDocuments = await this._fetchHashtagSources(couchClient);
            sources = sourceDocuments.map(hashtag => hashtag._id); //eslint-disable-line no-param-reassign
        }
        const collectionFeedIds = await getCollectionFeedIds(couchClient, sources);

        let feedDocuments = await this._getFeedsFromSources(couchClient, sources, collectionFeedIds);
        let docsToBeDeleted = feedDocuments.concat(sourceDocuments);
        return await this._deleteDocuments(couchClient, docsToBeDeleted);
    }

    async _getFeedsFromSources(couchClient, sources, collectionFeedIds) {
        const selector = {
            "selector": {
                "docType": {
                    "$eq": "feed"
                },
                "sourceId": {
                    "$in": sources
                },
                "bookmark": {
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
                "_id": {
                    "$nin": collectionFeedIds
                }
            },
            "skip": 0,
            "limit": FEED_LIMIT_TO_DELETE_IN_QUERY
        };

        return await this._findDocuments(couchClient, selector);
    }

    async _fetchHashtagSources(couchClient) {
        const selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                },
                "hashtag": {
                    "$eq": true
                }
            },
            "skip": 0
        };

        return await this._findDocuments(couchClient, selector);
    }

    async fetchSourceDocuments(couchClient, sources) {
        const selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                },
                "_id": {
                    "$in": sources
                }
            },
            "skip": 0
        };

        return await this._findDocuments(couchClient, selector);
    }

    async _findDocuments(couchClient, selector, docs = []) {
        const docsInReq = await couchClient.findDocuments(selector);

        if(docsInReq.docs.length === FEED_LIMIT_TO_DELETE_IN_QUERY) {
            const updatedSelector = Object.assign({}, selector, { "skip": selector.skip + FEED_LIMIT_TO_DELETE_IN_QUERY });
            return await this._findDocuments(couchClient, updatedSelector, docs.concat(docsInReq.docs));
        }

        return docs.concat(docsInReq.docs);
    }

    async _deleteDocuments(couchClient, allDocs) {
        const deletedDocuments = allDocs.map((doc) => {
            doc._deleted = true;
            return doc;
        });

        return await couchClient.saveBulkDocuments({ "docs": deletedDocuments });
    }
}
