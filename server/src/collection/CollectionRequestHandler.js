import CouchClient from "../CouchClient";

export default class CollectionRequestHandler {
    static instance() {
        return new CollectionRequestHandler();
    }

    async updateCollection(authSession, docId, collectionName, isNewCollection) {
        let couchClient = CouchClient.instance(authSession);
        let collectionDoc = await this.getCollectionDoc(couchClient, collectionName);
        let collectionDocId = collectionDoc.docs.length ? collectionDoc.docs[0]._id : 0; //eslint-disable-line no-magic-numbers

        if(isNewCollection && collectionDocId) {
            return { "message": "collection already exist" };
        }
        return await this.createCollection(couchClient, docId, collectionName, collectionDocId);
    }

    async createCollection(couchClient, docId, collectionName, collectionDocId) {
        let collectionDoc = {
            "docType": "collection",
            "collection": collectionName };
        let collectionFeedDoc = {
            "docType": "collectionFeed",
            "feedId": docId,
            "collection": collectionName };
        let feedCollectionId = null;

        if(docId && collectionDocId) {
            feedCollectionId = docId + collectionDocId;
            await couchClient.saveDocument(feedCollectionId, collectionFeedDoc);
        }else if(docId) {
            let response = await couchClient.updateDocument(collectionDoc);
            feedCollectionId = docId + response.id;
            await couchClient.saveDocument(feedCollectionId, collectionFeedDoc);
        } else {
            await couchClient.updateDocument(collectionDoc);
        }
        return { "ok": true };
    }

    async getCollection(authSession) {
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "collection"
                }
            }
        };
        let couchClient = CouchClient.instance(authSession);
        return await couchClient.findDocuments(selector);
    }

    async getCollectionDoc(couchClient, collectionName) {
        let selector = {
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
}
