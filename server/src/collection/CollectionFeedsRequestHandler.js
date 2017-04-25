import CouchClient from "../CouchClient";
import R from "ramda"; //eslint-disable-line id-length
import { FEED_LIMIT_TO_DELETE_IN_QUERY } from "../util/Constants";
import RouteLogger from "../routes/RouteLogger";

export async function getCollectedFeeds(authSession, collection, offset) {
    const couchClient = CouchClient.instance(authSession);
    const intermediateFeeds = await getIntermediateDocs(couchClient, collection, offset);
    const feedIds = getFeedIds(intermediateFeeds.docs);
    return await getFeeds(couchClient, feedIds);
}

function getFeedIds(intermediateFeeds) {
    return intermediateFeeds.map((intermediateDoc) => {
        return intermediateDoc.selectText ? intermediateDoc._id : intermediateDoc.feedId;
    });
}

async function getFeeds(couchClient, feedIds) {
    const query = {
        "selector": {
            "_id": {
                "$in": feedIds
            }
        }
    };

    const response = await couchClient.findDocuments(query);
    return response.docs;
}

async function getIntermediateDocs(couchClient, collection, offset) {
    const selector = {
        "selector": {
            "docType": {
                "$eq": "collectionFeed"
            }, "collectionId": {
                "$eq": collection
            }
        },
        "skip": offset
    };
    return await couchClient.findDocuments(selector);
}

export async function getCollectionFeedIds(couchClient, sourceIds, feeds = [], skipValue = 0) { // eslint-disable-line no-magic-numbers
    const collectionFeedDocs = await getCollectionFeedDocs(couchClient, skipValue, sourceIds);
    const feedsAccumulator = feeds.concat(collectionFeedDocs);

    if(collectionFeedDocs.length === FEED_LIMIT_TO_DELETE_IN_QUERY) {
        return await getCollectionFeedIds(couchClient, sourceIds, feedsAccumulator, skipValue + FEED_LIMIT_TO_DELETE_IN_QUERY);
    }

    return R.map(feed => feed.feedId, feedsAccumulator);
}

async function getCollectionFeedDocs(couchClient, skipValue, sources) {
    const selector = {
        "selector": {
            "docType": {
                "$eq": "collectionFeed"
            },
            "sourceId": {
                "$in": sources
            }
        },
        "fields": ["feedId"],
        "skip": skipValue,
        "limit": FEED_LIMIT_TO_DELETE_IN_QUERY
    };
    const collectionFeedDocs = await couchClient.findDocuments(selector);
    return collectionFeedDocs.docs;
}

export async function deleteCollection(authSession, collectionId) {
    const couchClient = CouchClient.instance(authSession);
    const collectionFeedDocs = await _getCollectionFeedDocs(couchClient, collectionId);
    const collectionDoc = await couchClient.getDocument(collectionId);

    const feedsToDelete = R.map(collectionFeed => collectionFeed.feedId)(collectionFeedDocs);
    const deletedFeeds = await _getSourceDeletedFeeds(couchClient, feedsToDelete);

    await couchClient.deleteBulkDocuments([...collectionFeedDocs, collectionDoc, ...deletedFeeds]);
    return { "ok": true };
}

async function _getCollectionFeedDocs(couchClient, collectionId) {
    const interMediateDocQuery = {
        "selector": {
            "collectionId": {
                "$eq": collectionId
            }
        },
        "limit": FEED_LIMIT_TO_DELETE_IN_QUERY
    };
    const collectionFeedDocs = await couchClient.findDocuments(interMediateDocQuery);
    return collectionFeedDocs.docs;
}

async function _getSourceDeletedFeeds(couchClient, feedsToDelete) {
    const feedsToDeleteQuery = {
        "selector": {
            "_id": {
                "$in": feedsToDelete
            },
            "sourceDeleted": {
                "$eq": true
            }
        },
        "limit": FEED_LIMIT_TO_DELETE_IN_QUERY
    };
    const deletedFeeds = await couchClient.findDocuments(feedsToDeleteQuery);
    return deletedFeeds.docs;
}

export async function deleteFeedFromCollection(authSession, intermediateDocId, feedId) {
    const couchClient = CouchClient.instance(authSession);
    try {
        let response = { "ok": true, "deleteFeed": intermediateDocId };

        const intermediateDoc = await couchClient.getDocument(intermediateDocId);
        let docsToDelete = [intermediateDoc];

        if(!intermediateDoc.selectText) {
            response.deleteFeed = intermediateDoc.feedId;
        }

        if(feedId) {
            const selector = {
                "selector": {
                    "docType": {
                        "$in": ["collectionFeed", "feed"]
                    },
                    "$or": [
                        {
                            "feedId": {
                                "$eq": feedId
                            }
                        },
                        {
                            "_id": {
                                "$eq": feedId
                            }
                        }
                    ]
                }
            };

            const allDocs = await couchClient.findDocuments(selector);

            if(allDocs.docs.length === 2) { //eslint-disable-line no-magic-numbers
                const [feedDoc] = allDocs.docs.filter(doc => doc._id === feedId);
                docsToDelete.push(feedDoc);
            }
        }
        await couchClient.deleteBulkDocuments(docsToDelete);
        RouteLogger.instance().info("CollectionFeedRequestHandler:: Successfully deleted article from collection");
        return response;
    } catch (err) {
        const error = { "message": "Unexpected response from db" };
        RouteLogger.instance().error(`CollectionFeedRequestHandler:: Failed deleting article from collection with error ${JSON.stringify(err)}`);
        throw error;
    }
}
