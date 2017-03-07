import CouchClient from "../CouchClient";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import { DOCS_PER_REQUEST } from "../util/Constants";

export default class CollectionRequestHandler {
    static instance() {
        return new CollectionRequestHandler();
    }

    async updateCollection(authSession, collectionName, isNewCollection, docId, sourceId) {
        const couchClient = CouchClient.instance(authSession);
        let collectionDoc = await this.getCollectionDoc(couchClient, collectionName);
        let collectionDocId = collectionDoc.docs.length ? collectionDoc.docs[0]._id : 0; //eslint-disable-line no-magic-numbers

        if(isNewCollection && collectionDocId) {
            return { "message": "collection already exists with this name" };
        }

        if(!docId && !collectionDocId) {
            return await this.createCollection(couchClient, collectionName);
        }

        if(docId && collectionDocId) {
            return await this.createCollectionFeedDoc(couchClient, collectionDocId, docId, sourceId);
        }
        collectionDocId = await this.createCollection(couchClient, collectionName);
        return await this.createCollectionFeedDoc(couchClient, collectionDocId, docId, sourceId);
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
