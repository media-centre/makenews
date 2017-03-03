import CouchClient from "../CouchClient";
import R from "ramda"; //eslint-disable-line id-length
import { DOCS_PER_REQUEST } from "../util/Constants";

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

export async function getCollectionFeedIds(couchClient, feeds = [], skipValue = 0) { // eslint-disable-line no-magic-numbers

    const collectionFeedDocs = await getCollectionFeedDocs(couchClient, skipValue);
    const feedsAccumulator = feeds.concat(collectionFeedDocs);

    if(collectionFeedDocs.length === DOCS_PER_REQUEST) {
        return await getCollectionFeedIds(couchClient, feedsAccumulator, skipValue + DOCS_PER_REQUEST);
    }

    return R.map(feed => feed.feedId)(feedsAccumulator);
}

async function getCollectionFeedDocs(couchClient, skipvalue) {
    const selector = {
        "selector": {
            "docType": {
                "$eq": "collectionFeed"
            }
        },
        "fields": ["feedId"],
        "skip": skipvalue
    };
    const collectionFeedDocs = await couchClient.findDocuments(selector);
    return collectionFeedDocs.docs;
}
