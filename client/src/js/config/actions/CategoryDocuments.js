"use strict";
import StringUtil from "../../../../../common/src/util/StringUtil.js";

export const STATUS_VALID = "valid", STATUS_INVALID = "invalid";
const NEGATIVE_INDEX = -1;
export class CategoryDocument {
    static getNewCategoryDocument(categoryName) {
        if(StringUtil.isEmptyString(categoryName)) {
            throw new Error("category name can not be empty");
        }

        return {
            "docType": "category",
            "name": categoryName,
            "createdTime": CategoryDocument._getCreatedTime()
        };
    }

    static _getCreatedTime() {
        return new Date().getTime();
    }

    static getNewRssDocumnet(categoryId, url, status) {
        if(StringUtil.isEmptyString(categoryId) || StringUtil.isEmptyString(url)) {
            throw new Error("category id or url can not be empty");
        }
        let rssDoc = {
            "docType": "source",
            "sourceType": "rss",
            "url": url,
            "categoryIds": [categoryId],
            "status": status
        };
        return rssDoc;
    }

    static getNewFeedDocuments(sourceId, feeds) {
        if(StringUtil.isEmptyString(sourceId) || (typeof feeds === "undefined" || feeds.length === 0)) {
            throw new Error("source id or feeds can not be empty");
        }

        let resultFeeds = [];
        feeds.forEach((feed)=> {
            resultFeeds.push(CategoryDocument.createFeed(feed, sourceId));
        });
        return resultFeeds;
    }

    static getDateAndTime(dateString) {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let date = new Date(dateString);
        return months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() + "    " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

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
            "tags": feed.pubDate ? [CategoryDocument.getDateAndTime(feed.pubDate)] : [""]
        };
        if(feed.enclosures && feed.enclosures.length > 0) {
            if(feed.enclosures.length === 1) {
                feedObj.type = "imagecontent";
                if(feed.enclosures[0].type.indexOf("image") !== NEGATIVE_INDEX) {
                    feedObj.url = feed.enclosures[0].url;
                }
            } else {
                feedObj.type = "gallery";
                feedObj.images = [];
                feed.enclosures.forEach(item => {
                    if(item.type === "image/jpeg") {
                        feedObj.images.push(item);
                    }
                });
            }
        }
        return feedObj;
    }
}
