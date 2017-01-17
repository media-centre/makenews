import CouchClient from "../CouchClient";

export async function bookmarkTheDocument(authSession, docId, status) {
    let couchClient = CouchClient.instance(authSession);
    let documentObj = await couchClient.getDocument(docId);
    documentObj.bookmark = typeof status === "boolean" ? status : !documentObj.bookmark;
    return await couchClient.saveDocument(docId, documentObj);
}

export async function getBookmarkedFeeds(authSession, offset) {
    let couchClient = CouchClient.instance(authSession);
    let selector = {
        "selector": {
            "docType": {
                "$eq": "feed"
            },
            "bookmark": {
                "$eq": true
            }
        },
        "skip": offset
    };
    return await couchClient.findDocuments(selector);
}
