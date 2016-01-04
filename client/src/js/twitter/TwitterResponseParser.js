"use strict";
import DateTimeUtil from "../utils/DateTimeUtil.js";

export default class TwitterResponseParser {

    static parseTweets(sourceId, tweets = []) {
        let feedDocuments = [];
        tweets.forEach((post)=> {
            try {
                feedDocuments.push(TwitterResponseParser.parseTweet(sourceId, post));
            } catch(error) {
                //no handling
            }
        });
        return feedDocuments;

    }

    static parseTweet(sourceId, tweet) {
        let feedObj = {
            "_id": tweet.id_str,
            "docType": "feed",
            "sourceId": sourceId,
            "type": "description",
            "feedType": "twitter",
            "content": tweet.text,
            "link": "https://twitter.com/" + sourceId + "/status/" + tweet.id_str,
            "postedDate": tweet.created_at ? DateTimeUtil.getUTCDateAndTime(tweet.created_at) : null,
            "tags": TwitterResponseParser.hashTags(tweet)
        };
        let media = tweet.entities.media;
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

    static hashTags(tweet) {
        let tagsArray = [];
        tweet.entities.hashtags.forEach(tag => {
            tagsArray.push(tag.text);
        });
        return tagsArray;
    }
}
