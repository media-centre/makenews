"use strict";
import StringUtil from "../../../../common/src/util/StringUtil.js";

export default class TwitterDocument {

    static getSourceUrlDocument(categoryId, title, url, status) {
        if(StringUtil.isEmptyString(categoryId) || StringUtil.isEmptyString(url)) {
            throw new Error("category id or url can not be empty");
        }
        let rssDoc = {
            "docType": "source",
            "sourceType": title,
            "url": url,
            "categoryIds": [categoryId],
            "status": status
        };
        return rssDoc;
    }

    static getAllFeedsDocument(sourceId, feeds = []) {
        if(StringUtil.isEmptyString(sourceId)) {
            throw new Error("source id can not be empty");
        }

        let resultFeeds = [];
        feeds.forEach((feed)=> {
            resultFeeds.push(TwitterDocument.parseFeed(feed, sourceId));
        });
        return resultFeeds;
    }

    static parseFeed(feed, sourceId) {
        let feedObj = {
            "_id": feed.id_str,
            "docType": "feed",
            "sourceId": sourceId,
            "type": "description",
            "feedType": "twitter",
            "content": feed.text,
            "tags": TwitterDocument.hashTags(feed)
        };
        let media = feed.entities.media;
        if(media && media.length > 0) {
            if(media.length === 1) {
                feedObj.type = "imagecontent";
                feedObj.url = media[0].media_url_https;
            } else {
                feedObj.type = "gallery";
                feedObj.images = [];
                media.forEach(item => {
                    feedObj.images.push({ "url": item.media_url_https });
                });
            }
        }
        return feedObj;
    }

    static hashTags(feed) {
        let tagsArray = [];
        tagsArray.push(feed.created_at);
        feed.entities.hashtags.forEach(tag => {
            tagsArray.push(tag.text);
        });
        return tagsArray;
    }
}
