import CouchClient from "../CouchClient";
import DateUtil from "../util/DateUtil";

export async function bookmarkTheDocument(authSession, docId, status) {
    const couchClient = CouchClient.instance(authSession);
    const documentObj = await couchClient.getDocument(docId);
    documentObj.bookmark = typeof status === "boolean" ? status : !documentObj.bookmark;

    if(documentObj.bookmark) {
        documentObj.bookmarkedDate = DateUtil.getCurrentTime();
    }

    if(documentObj.sourceDeleted && !documentObj.bookmark) {
        documentObj._deleted = true;
    }

    return await couchClient.saveDocument(docId, documentObj);
}

export async function getBookmarkedFeeds(authSession, offset) {
    const couchClient = CouchClient.instance(authSession);
    const selector = {
        "selector": {
            "docType": {
                "$eq": "feed"
            },
            "bookmark": {
                "$eq": true
            },
            "bookmarkedDate": {
                "$gt": null
            }
        },
        "sort": [{ "bookmarkedDate": "desc" }],
        "skip": offset
    };
    return await couchClient.findDocuments(selector);
}
