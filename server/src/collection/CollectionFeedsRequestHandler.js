import CouchClient from "../CouchClient";
import R from "ramda"; //eslint-disable-line id-length

export async function getCollectedFeeds(authSession, collectionName, offset) {
    let feedIds = await getFeedIds(authSession, collectionName, offset);
    return await getFeeds(authSession, feedIds.docs);
}

async function getFeeds(authSession, feedIds) {
    let couchClient = CouchClient.instance(authSession);

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

async function getFeedIds(authSession, collectionName, offset) {
    let couchClient = CouchClient.instance(authSession);
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
