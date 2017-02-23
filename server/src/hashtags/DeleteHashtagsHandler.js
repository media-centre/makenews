import CouchClient from "../CouchClient";
import R from "ramda"; //eslint-disable-line id-length
import { getCollectionFeedIds } from "../collection/CollectionFeedsRequestHandler";
const DOCS_PER_REQUEST = 25;

export default class DeleteHashtagsHandler {
    static instance() {
        return new DeleteHashtagsHandler();
    }

    async deleteHashtags(accessToken) {
        let couchClient = CouchClient.instance(accessToken);
        let allHashtagDocs = [], hashtagDocs = [], skipValue = 0;

        let collectionFeedIds = await getCollectionFeedIds(couchClient);

        do { //eslint-disable-line no-loops/no-loops
            hashtagDocs = await this._getHashtagDocuments(couchClient, collectionFeedIds, skipValue);
            allHashtagDocs = allHashtagDocs.concat(hashtagDocs);
            skipValue += DOCS_PER_REQUEST;
        } while (hashtagDocs.length === DOCS_PER_REQUEST);

        allHashtagDocs = allHashtagDocs.map((doc) => {
            doc._deleted = true;
            return doc;
        });

        return await couchClient.saveBulkDocuments({ "docs": allHashtagDocs });
    }

    async _getHashtagDocuments(couchClient, collectionFeedIds, skipValue) {
        let selector = {
            "selector": {
                "hashtag": {
                    "$eq": true
                },
                "bookmark": {
                    "$or": [
                        {
                            "$exists": false
                        },
                        {
                            "$exists": true,
                            "$eq": false
                        }
                    ]
                },
                "_id": {
                    "$nin": collectionFeedIds
                }
            },
            "skip": skipValue
        };
        let response = await couchClient.findDocuments(selector);
        return response.docs;
    }
}
