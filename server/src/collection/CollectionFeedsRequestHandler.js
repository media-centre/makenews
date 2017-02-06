import CouchClient from "../CouchClient";
import R from "ramda"; //eslint-disable-line id-length

export async function getCollectedFeeds(authSession, collectionName, offset) {
    const couchClient = CouchClient.instance(authSession);
    let feedIds = await getFeedIds(couchClient, collectionName, offset);
    return await getFeeds(couchClient, feedIds.docs);
}

async function getFeeds(couchClient, feedIds) {
    let feedPromises = feedIds.map(async (collection) => {
        try {
            return await couchClient.getDocument(collection.feedId);
        } catch(error) {
            return {};
        }
    });
    let feeds = await Promise.all(feedPromises);
    return R.reject(R.isEmpty, feeds);
}

async function getFeedIds(couchClient, collectionName, offset) {
    let selector = {
        "selector": {
            "docType": {
                "$eq": "collectionFeed"
            }, "collection": {
                "$eq": collectionName
            }
        },
        "skip": offset
    };
    return await couchClient.findDocuments(selector);
}
