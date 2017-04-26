import CouchClient from "../CouchClient";
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

export async function deleteCollection(authSession, collectionId) {
    const couchClient = CouchClient.instance(authSession);

    const collectionFeedDocs = await _getCollectionFeedDocs(couchClient, collectionId);
    const collectionDoc = await couchClient.getDocument(collectionId);

    await couchClient.deleteBulkDocuments([...collectionFeedDocs, collectionDoc]);
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

export async function deleteFeedFromCollection(authSession, intermediateDocId) {
    const couchClient = CouchClient.instance(authSession);
    try {
        let response = { "ok": true, "deleteFeed": intermediateDocId };

        const intermediateDoc = await couchClient.getDocument(intermediateDocId);
        await couchClient.deleteDocument(intermediateDocId, intermediateDoc._rev);

        RouteLogger.instance().info("CollectionFeedRequestHandler:: Successfully deleted article from collection");
        return response;
    } catch (err) {
        const error = { "message": "Unexpected response from db" };
        RouteLogger.instance().error(`CollectionFeedRequestHandler:: Failed deleting article from collection with error ${JSON.stringify(err)}`);
        throw error;
    }
}
