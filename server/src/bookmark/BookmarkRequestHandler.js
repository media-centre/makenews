import CouchClient from "../CouchClient";

export default class BookmarkRequestHandler {
    static instance() {
        return new BookmarkRequestHandler();
    }

    async updateDocument(authSession, docId) {
        let couchClient = CouchClient.instance(authSession);
        let documentObj = await couchClient.getDocument(docId);
        documentObj.bookmark = true;
        return await couchClient.saveDocument(docId, documentObj);
    }
}
