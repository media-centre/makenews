"use strict";
import StringUtil from "../../../../common/src/util/StringUtil.js";
import DateTimeUtil from "../utils/DateTimeUtil.js";
import RssDb from "./RssDb.js";

const NEGATIVE_INDEX = -1;
export default class RssFeeds {

    static instance(feeds) {
        return new RssFeeds(feeds);
    }
    constructor(feeds) {
        if(!feeds) {
            throw new Error("feeds can not be null");
        }
        this.feeds = feeds;
    }

    parse() {
        if(this.feeds.length === 0) {
            return true;
        }
        let parsedFeeds = [];
        this.feeds.forEach((feed)=> {
            parsedFeeds.push(this._parseFeed(feed));
        });
        this.feeds = parsedFeeds;

        return this.feeds.length > 0;
    }

    save(sourceId) {
        if(StringUtil.isEmptyString(sourceId)) {
            return Promise.reject("source id can not be empty");
        }
        this.feeds.forEach((feed)=> {
            feed.sourceId = sourceId;
        });
        return RssDb.addRssFeeds(this.feeds);
    }

    _parseFeed(feed) {
        let feedObj = {
            "_id": feed.guid,
            "docType": "feed",
            "type": "description",
            "title": feed.title,
            "link": feed.link,
            "feedType": "rss",
            "content": feed.description,
            "postedDate": feed.pubDate ? DateTimeUtil.getUTCDateAndTime(feed.pubDate) : null,
            "tags": [""]
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
