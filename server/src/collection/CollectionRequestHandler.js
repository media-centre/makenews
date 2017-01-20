import CouchClient from "../CouchClient";
export default class CollectionRequestHandler {
    static instance() {
        return new CollectionRequestHandler();
    }

    async updateCollection(authSession, docId, collectionName) {
        let couchClient = CouchClient.instance(authSession);
        let response = docId ? this.addToCollection(couchClient, docId, collectionName)
            : this.createCollection(couchClient, collectionName);
        return response;
    }

    async createCollection(couchClient, collectionName) {
        let document = { "docType": "collection", "feeds": [] };
        let response = await couchClient.saveDocument(collectionName, document);
        return response;
    }

    async addToCollection(couchClient, docId, collectionName) {
        let document = await couchClient.getDocument(collectionName);
        let collection = document.error ? { "docType": "collection", "feeds": [] } : document;
        collection.feeds.push(docId);
        return couchClient.saveDocument(collectionName, collection);
    }
}
