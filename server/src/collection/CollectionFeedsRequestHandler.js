import CouchClient from "../CouchClient";
import R from "ramda"; //eslint-disable-line id-length
import { FEED_LIMIT_TO_DELETE_IN_QUERY } from "../util/Constants";
import RouteLogger from "../routes/RouteLogger";

export async function getCollectedFeeds(authSession, collection, offset) {
    const couchClient = CouchClient.instance(authSession);
    const feedIds = await getFeedIds(couchClient, collection, offset);
    return await getFeeds(couchClient, feedIds.docs);
}

async function getFeeds(couchClient, feedIds) {
    const feedPromises = feedIds.map(async (collection) => {
        try {
            return await couchClient.getDocument(collection.feedId);
        } catch(error) {
            return {};
        }
    });
    const feeds = await Promise.all(feedPromises);
    return R.reject(R.isEmpty, feeds);
}

/*TODO: rename this functions to resemble it's original responsibility*/ //eslint-disable-line
async function getFeedIds(couchClient, collection, offset) {
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

export async function deleteFeedFromCollection(authSession, feedId, collectionId) {
    const couchClient = CouchClient.instance(authSession);

    try {
        const collectionFeedDoc = await couchClient.getDocument(feedId + collectionId);
        const feedDoc = await couchClient.getDocument(feedId);

        let docsToDelete = [collectionFeedDoc];

        if (feedDoc.sourceDeleted) {
            docsToDelete.push(feedDoc);
        }
        await couchClient.deleteBulkDocuments(docsToDelete);
        RouteLogger.instance().info("CollectionFeedRequestHandler:: Successfully deleted article from collection");
        return { "ok": true };
    } catch (err) {
        const error = { "message": "Unexpected response from db" };
        RouteLogger.instance().error(`CollectionFeedRequestHandler:: Failed deleting article from collection with error ${JSON.stringify(err)}`);
        throw error;
    }
}
