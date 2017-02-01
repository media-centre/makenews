import CouchClient from "../CouchClient";

export async function getCollectedFeeds(authSession, collectionName, offset) {
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
    let feeds = await couchClient.findDocuments(selector);
    return feeds;
}
