import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import { COLLECTION_PER_REQUEST } from "../util/Constants";

export default class CollectionRequestHandler {
    constructor(couchClient) {
        this.couchClient = couchClient;
    }

    static instance(couchClient) {
        return new CollectionRequestHandler(couchClient);
    }

    async updateCollection(collectionName, isNewCollection, docId, sourceId) {
        let collectionDocs = await this.getCollectionDoc(collectionName);
        let collectionDocId = "";
        if(collectionDocs.docs.length) {
            let [collectionDoc] = collectionDocs.docs;
            collectionDocId = collectionDoc._id;
        }

        if(isNewCollection && collectionDocId) {
            return { "message": "collection already exists with this name" };
        } else if(!docId && !collectionDocId) {
            collectionDocId = await this.createCollection(collectionName);
        } else if(docId && collectionDocId) {
            await this.createCollectionFeedDoc(collectionDocId, docId, sourceId);
        } else {
            collectionDocId = await this.createCollection(collectionName);
            await this.createCollectionFeedDoc(collectionDocId, docId, sourceId);
        }
        return { "ok": true, "_id": collectionDocId };
    }

    async createCollection(collectionName) {
        const collectionDoc = {
            "docType": "collection",
            "collection": collectionName
        };

        const response = await this.couchClient.updateDocument(collectionDoc);
        return response.id;
    }

    async createCollectionFeedDoc(collectionId, feedId, sourceId) {
        const collectionFeedDoc = {
            "docType": "collectionFeed",
            feedId,
            collectionId,
            sourceId
        };

        const feedCollectionId = feedId + collectionId;
        try {
            return await this.couchClient.saveDocument(feedCollectionId, collectionFeedDoc);
        } catch(error) {
            if(HttpResponseHandler.codes.CONFLICT === error.status) {
                return { "message": "article already added to that collection" };
            }
            throw error;
        }
    }

    async renameCollection(collectionId, collectionName) {
        const collections = await this.getCollectionDoc(collectionName);
        if (collections.docs.length) {
            throw `There is already a collection with the name ${collectionName}`; //eslint-disable-line no-throw-literal
        } else {
            try {
                const collection = await this.couchClient.getDocument(collectionId);
                const updatedCollection = Object.assign({}, collection, { "collection": collectionName });
                await this.couchClient.saveDocument(collectionId, updatedCollection);
                return { "ok": true };
            } catch (err) {
                throw `unable to rename the collection ${collectionName}`; //eslint-disable-line no-throw-literal
            }
        }
    }

    async getCollectionDoc(collectionName) {
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
        return await this.couchClient.findDocuments(selector);
    }

    async getAllCollections() {
        let allCollections = [];
        let skipValue = 0;
        let collectionsDoc = null;
        do { //eslint-disable-line no-loops/no-loops
            collectionsDoc = await this.getCollectionQuery(skipValue);
            allCollections = allCollections.concat(collectionsDoc.docs);
            skipValue += COLLECTION_PER_REQUEST;
        } while(collectionsDoc.docs.length === COLLECTION_PER_REQUEST);

        return { "docs": allCollections };
    }

    async getCollectionQuery(skipValue) {
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "collection"
                }
            },
            "skip": skipValue
        };
        return await this.couchClient.findDocuments(selector);
    }
}
