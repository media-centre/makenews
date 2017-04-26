import CouchClient from "../CouchClient";
import { FEED_LIMIT_TO_DELETE_IN_QUERY } from "../util/Constants";
import DateUtil from "../util/DateUtil";
import R from "ramda"; //eslint-disable-line id-length
import Logger from "../logging/Logger";

export default class DeleteSourceHandler {
    constructor(accessToken) {
        this.couchClient = CouchClient.instance(accessToken);
    }
    static instance(accessToken) {
        return new DeleteSourceHandler(accessToken);
    }

    static logger() {
        return Logger.instance("DeleteSourceHandler");
    }

    async deleteSources(sources = []) {
        let sourceDocuments = [];
        if (sources.length) {
            sourceDocuments = await this.fetchSourceDocuments(sources);
            await this.deleteFeeds(sourceDocuments);
        }
        return { "ok": true };
    }

    async deleteHashTags() {
        let sourceDocuments = await this._fetchHashtagSources();
        await this.deleteFeeds(sourceDocuments);
    }

    async deleteFeeds(sources) {
        let sourceIds = sources.map(source => source._id);
        const feedDocuments = await this._getFeedsFromSources(sourceIds);
        let toBeDeleted = [];
        let toBeMarked = [];
        let currentFeedDoc = {};
        let updatedCollectionFeedDocs = [];

        feedDocuments.forEach((feedDoc) => {
            if(feedDoc.docType === "feed") {
                currentFeedDoc = feedDoc;

                if(feedDoc.bookmark) {
                    toBeMarked.push(feedDoc);
                } else {
                    toBeDeleted.push(feedDoc);
                }
            } else {
                delete feedDoc.sourceId;
                delete feedDoc.feedId;

                feedDoc.title = currentFeedDoc.title;
                feedDoc.description = currentFeedDoc.description;
                feedDoc.link = currentFeedDoc.link;
                feedDoc.tags = currentFeedDoc.tags;
                feedDoc.sourceType = currentFeedDoc.sourceType;
                feedDoc.pubDate = currentFeedDoc.pubDate;
                feedDoc.selectText = true;
                feedDoc.sourceDeleted = true;

                updatedCollectionFeedDocs.push(feedDoc);
            }
        });

        let docsToBeDeleted = toBeDeleted.concat(sources);
        await this.couchClient.deleteBulkDocuments(docsToBeDeleted);
        try {
            const markedFeeds = await this.markAsSourceDeleted(toBeMarked);
            updatedCollectionFeedDocs.concat(markedFeeds);
            await this.couchClient.saveBulkDocuments({ "docs": updatedCollectionFeedDocs });
        } catch(err) {
            DeleteSourceHandler.logger().error(`Error making feeds as source deleted, Error:: ${JSON.stringify(err)}`);
        }
    }

    async _getFeedsFromSources(sources) {
        const selector = {
            "selector": {
                "docType": {
                    "$in": ["feed", "collectionFeed"]
                },
                "sourceId": {
                    "$in": sources
                }
            },
            "skip": 0,
            "limit": FEED_LIMIT_TO_DELETE_IN_QUERY
        };

        return await this._findDocuments(selector);
    }

    async _fetchHashtagSources() {
        const selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                },
                "hashtag": {
                    "$eq": true
                }
            },
            "skip": 0
        };

        return await this._findDocuments(selector);
    }

    async fetchSourceDocuments(sources) {
        const selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                },
                "_id": {
                    "$in": sources
                }
            },
            "skip": 0
        };
        return await this._findDocuments(selector);
    }

    async _findDocuments(selector, docs = []) {
        const docsInReq = await this.couchClient.findDocuments(selector);
        if(docsInReq.docs.length === FEED_LIMIT_TO_DELETE_IN_QUERY) {
            const updatedSelector = Object.assign({}, selector, { "skip": selector.skip + FEED_LIMIT_TO_DELETE_IN_QUERY });
            return await this._findDocuments(updatedSelector, docs.concat(docsInReq.docs));
        }
        return docs.concat(docsInReq.docs);
    }

    async markAsSourceDeleted(feeds) {
        const markedFeeds = R.map(feed => {
            feed.sourceDeleted = true;
            return feed;
        })(feeds);

        return markedFeeds;
    }

    async deleteOldFeeds() {
        let selector = null, docsObject = {}, docs = [], MONTH_DAYS = 30;
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - MONTH_DAYS);
        let deleteDate = DateUtil.getUTCDateAndTime(currentDate);
        do { //eslint-disable-line no-loops/no-loops
            selector = {
                "selector": {
                    "pubDate": {
                        "$lt": deleteDate
                    }
                }
            };
            docsObject = await this.couchClient.findDocuments(selector);
            docs = docsObject.docs;

            if(docs.length) {
                await this.couchClient.deleteBulkDocuments(docs);
            }
        }
        while (docs.length);
    }
}
