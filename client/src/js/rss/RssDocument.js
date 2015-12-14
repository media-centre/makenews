"use strict";
import StringUtil from "../../../../common/src/util/StringUtil.js";
import DateTimeUtil from "../utils/DateTimeUtil.js";

const NEGATIVE_INDEX = -1;
export default class RssDocument {
    static getNewFeedDocuments(sourceId, feeds) {
        if(StringUtil.isEmptyString(sourceId) || (typeof feeds === "undefined" || feeds.length === 0)) {
            throw new Error("source id or feeds can not be empty");
        }

        let resultFeeds = [];
        feeds.forEach((feed)=> {
            resultFeeds.push(RssDocument.createFeed(feed, sourceId));
        });
        return resultFeeds;
    }

    static createFeed(feed, sourceId) {
        let feedObj = {
            "_id": feed.guid,
            "docType": "feed",
            "sourceId": sourceId,
            "type": "description",
            "title": feed.title,
            "feedType": "rss",
            "content": feed.description,
            "tags": feed.pubDate ? [DateTimeUtil.getDateAndTime(feed.pubDate)] : [""]
        };
        if(feed.enclosures && feed.enclosures.length > 0) {
            if(feed.enclosures.length === 1) {
                feedObj.type = "imagecontent";
                if(feed.enclosures[0].type.indexOf("image") !== NEGATIVE_INDEX) {
                    feedObj.url = feed.enclosures[0].url;
                } else if(feed.enclosures[0].type.indexOf("video") !== NEGATIVE_INDEX) {
                    feedObj.url = feed.image.url;
                }
            } else {
                feedObj.type = "gallery";
                feedObj.images = [];
                feed.enclosures.forEach((item, index) => {
                    if(item.type.indexOf("image") !== NEGATIVE_INDEX) {
                        feedObj.images.push(feed.enclosures[index]);
                    } else if(item.type.indexOf("video") !== NEGATIVE_INDEX) {
                        feedObj.images.push({ "type": "video", "url": feed.image.url });
                    }
                });
            }
        }
        return feedObj;
    }
}
