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
        this.feeds = feeds.items;
        this.meta = feeds.meta;
    }

    parse() {
        if(this.feeds.length === 0) {
            return true;
        }
        let parsedFeeds = [];
        this.feeds.forEach((feed)=> {
            try {
                parsedFeeds.push(this._parseFeed(feed));
            } catch(error) {
                //no need to handle
            }
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

        if(!feed.guid || !feed.title || !feed.description) {
            throw new Error("id, title and description are mandatory");
        }

        let feedObj = {
            "_id": feed.guid,
            "docType": "feed",
            "type": "description",
            "title": feed.title,
            "link": feed.link,
            "feedType": "rss",
            "content": feed.description,
            "postedDate": feed.pubDate ? DateTimeUtil.getUTCDateAndTime(feed.pubDate) : null,
            "tags": [this.meta.title]
        };
        if(feed.enclosures && feed.enclosures.length > 0) {
            feedObj.type = "imagecontent";
            feedObj.images = [];
            feed.enclosures.forEach((item, index) => {
                if (!item.type || item.type.indexOf("image") !== NEGATIVE_INDEX) {
                    feedObj.images.push(feed.enclosures[index]);
                } else if (item.type.indexOf("video") !== NEGATIVE_INDEX) {
                    feedObj.images.push({ "type": "video", "url": feed.image.url });
                }
            });
        }
        return feedObj;
    }
}
