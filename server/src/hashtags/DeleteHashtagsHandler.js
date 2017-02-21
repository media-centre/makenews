import CouchClient from "../CouchClient";
const DOCS_PER_REQUEST = 25;

export default class DeleteHashtagsHandler {
    static instance() {
        return new DeleteHashtagsHandler();
    }

    async deleteHashtags(accessToken) {
        let couchClient = CouchClient.instance(accessToken);
        let allHashtagDocs = [];
        let hashtagDocs = [];
        let skipValue = 0;

        do { //eslint-disable-line no-loops/no-loops
            hashtagDocs = await this._getHashtagDocuments(couchClient, skipValue);
            allHashtagDocs = allHashtagDocs.concat(hashtagDocs);
            skipValue += DOCS_PER_REQUEST;
        } while(hashtagDocs.length === DOCS_PER_REQUEST);

        allHashtagDocs = allHashtagDocs.map((doc) => {
            doc._deleted = true;
            return doc;
        });

        await couchClient.saveBulkDocuments({ "docs": allHashtagDocs });
    }

    async _getHashtagDocuments(couchClient, skipValue) {
        let selector = {
            "selector": {
                "hashtag": {
                    "$eq": true
                }
            },
            "skip": skipValue
        };
        let response = await couchClient.findDocuments(selector);
        return response.docs;
    }
}
