import CouchClient from "../CouchClient";
import { getCollectionFeedIds } from "../collection/CollectionFeedsRequestHandler";
import { DOCS_PER_REQUEST } from "../util/Constants";

export default class DeleteSourceHandler {
    static instance() {
        return new DeleteSourceHandler();
    }

    async deleteSources(sources = [], accessToken) {
        let couchClient = CouchClient.instance(accessToken);
        let collectionFeedIds = await getCollectionFeedIds(couchClient);
        let sourceDocuments = [];

        if(sources.length === 0) { //eslint-disable-line no-magic-numbers
            sourceDocuments = await this._fetchHashtagSources(couchClient);
            sources = sourceDocuments.map((hashtag) => { //eslint-disable-line no-param-reassign
                return hashtag._id;
            });
        } else {
            sourceDocuments = await this.fetchSourceDocuments(couchClient, sources);
        }

        let feedDocuments = await this._getFeedsFromSources(couchClient, sources, collectionFeedIds);
        let docsToBeDeleted = feedDocuments.concat(sourceDocuments);
        return await this._deleteDocuments(couchClient, docsToBeDeleted);
    }

    async _getFeedsFromSources(couchClient, sources, collectionFeedIds) {
        let selector = {
            "selector": {
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
            "skip": 0
        };

        return await this._findDocuments(couchClient, selector);
    }

    async _fetchHashtagSources(couchClient) {
        let selector = {
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
        let selector = {
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

    async _findDocuments(couchClient, selector) {
        let allDocs = [], docsObject = {};

        do {    //eslint-disable-line no-loops/no-loops
            docsObject = await couchClient.findDocuments(selector);
            allDocs = allDocs.concat(docsObject.docs);
            selector.skip += DOCS_PER_REQUEST;
        } while (docsObject.docs.length === DOCS_PER_REQUEST);

        return allDocs;
    }

    async _deleteDocuments(couchClient, allDocs) {

        let deletedDocuments = allDocs.map((doc) => {
            doc._deleted = true;
            return doc;
        });

        return await couchClient.saveBulkDocuments({ "docs": deletedDocuments });
    }
}
