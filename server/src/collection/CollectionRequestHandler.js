import CouchClient from "../CouchClient";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import { COLLECTION_PER_REQUEST } from "../util/Constants";

export default class CollectionRequestHandler {
    static instance() {
        return new CollectionRequestHandler();
    }

    async updateCollection(authSession, collectionName, isNewCollection, docId, sourceId) {
        const couchClient = CouchClient.instance(authSession);
        let collectionDocs = await this.getCollectionDoc(couchClient, collectionName);
        let collectionDocId = "";

        if(collectionDocs.docs.length) {
            let [collectionDoc] = collectionDocs.docs;
            collectionDocId = collectionDoc._id;
        }

        if(isNewCollection && collectionDocId) {
            return { "message": "collection already exists with this name" };
        } else if(!docId && !collectionDocId) {
            collectionDocId = await this.createCollection(couchClient, collectionName);
        } else if(docId && collectionDocId) {
            await this.createCollectionFeedDoc(couchClient, collectionDocId, docId, sourceId);
        } else {
            collectionDocId = await this.createCollection(couchClient, collectionName);
            await this.createCollectionFeedDoc(couchClient, collectionDocId, docId, sourceId);
        }
        return { "ok": true, "_id": collectionDocId };
    }

    async createCollection(couchClient, collectionName) {
        const collectionDoc = {
            "docType": "collection",
            "collection": collectionName
        };

        const response = await couchClient.updateDocument(collectionDoc);
        return response.id;
    }

    async createCollectionFeedDoc(couchClient, collectionId, feedId, sourceId) {
        const collectionFeedDoc = {
            "docType": "collectionFeed",
            feedId,
            collectionId,
            sourceId
        };

        const feedCollectionId = feedId + collectionId;
        try {
            return await couchClient.saveDocument(feedCollectionId, collectionFeedDoc);
        } catch(error) {
            if(HttpResponseHandler.codes.CONFLICT === error.status) {
                return { "message": "article already added to that collection" };
            }
            throw error;
        }
    }

    async getCollectionDoc(couchClient, collectionName) {
        const selector = {
            "selector": {
                "docType": {
                    "$eq": "collection"
                },
                "collection": {
                    "$eq": collectionName
                }
            }
        };
        return await couchClient.findDocuments(selector);
    }

    async getAllCollections(authSession) {
        let couchClient = CouchClient.instance(authSession);
        let allCollections = [];
        let skipValue = 0;
        let collectionsDoc = null;
        do { //eslint-disable-line no-loops/no-loops
            collectionsDoc = await this.getCollectionQuery(couchClient, skipValue);
            allCollections = allCollections.concat(collectionsDoc.docs);
            skipValue += COLLECTION_PER_REQUEST;
        } while(collectionsDoc.docs.length === COLLECTION_PER_REQUEST);

        return { "docs": allCollections };
    }

    async getCollectionQuery(couchClient, skipValue) {
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "collection"
                }
            },
            "skip": skipValue
        };
        return await couchClient.findDocuments(selector);
    }
}
