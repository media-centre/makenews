import CouchClient from "../CouchClient";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
const DOCS_PER_REQUEST = 25;

export default class CollectionRequestHandler {
    static instance() {
        return new CollectionRequestHandler();
    }

    async updateCollection(authSession, docId, collectionName, isNewCollection) {
        let couchClient = CouchClient.instance(authSession);
        let collectionDoc = await this.getCollectionDoc(couchClient, collectionName);
        let collectionDocId = collectionDoc.docs.length ? collectionDoc.docs[0]._id : 0; //eslint-disable-line no-magic-numbers

        if(isNewCollection && collectionDocId) {
            return { "message": "collection already exists with this name" };
        }
        return await this.createCollection(couchClient, docId, collectionName, collectionDocId); /* TODO:split the create collection and create intermediate doc*/ //eslint-disable-line
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
        try {
            if (docId && collectionDocId) {
                feedCollectionId = docId + collectionDocId;
                await couchClient.saveDocument(feedCollectionId, collectionFeedDoc);
            } else if (docId) {
                let response = await couchClient.updateDocument(collectionDoc); /* TODO: change the updateDoc to createDoc*/ //eslint-disable-line
                feedCollectionId = docId + response.id;
                await couchClient.saveDocument(feedCollectionId, collectionFeedDoc);
            } else {
                await couchClient.updateDocument(collectionDoc);
            }
            return { "ok": true };
        } catch(error) {
            if(HttpResponseHandler.codes.CONFLICT === error.status) {
                return { "message": "article already added to that collection" };
            }
            throw error;
        }
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

    async getAllCollections(authSession) {
        let couchClient = CouchClient.instance(authSession);
        let allCollections = [];
        let skipValue = 0;
        let collectionsDoc = null;
        do { //eslint-disable-line no-loops/no-loops
            collectionsDoc = await this.getCollectionQuery(couchClient, skipValue);
            allCollections = allCollections.concat(collectionsDoc.docs);
            skipValue += DOCS_PER_REQUEST;
        } while(collectionsDoc.docs.length === DOCS_PER_REQUEST);

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
