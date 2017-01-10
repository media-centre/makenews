import DateTimeUtil from "../../../client/src/js/utils/DateTimeUtil";
export default class TwitterParser {
    static instance() {
        return new TwitterParser();
    }

    parseHandle(handles) {
        return handles.map(handle => {
            return {
                "id": handle.id,
                "id_str": handle.id_str,
                "picture": {
                    "data": {
                        "url": handle.profile_image_url_https
                    }
                },
                "name": handle.name
            };
        });
    }

    parseTweets(sourceId, tweets = []) {
        return tweets.map(tweet => { //eslint-disable-line consistent-return
            try {
                return this.parseTweet(sourceId, tweet);
            } catch(error) {
                //no handling
            }
        });
    }

    parseTweet(sourceId, tweet) {
        let feedObj = {
            "_id": tweet.id_str,
            "docType": "feed",
            "sourceType": "twitter",
            "description": tweet.text,
            "title": "",
            "link": "https://twitter.com/" + sourceId + "/status/" + tweet.id_str,
            "pubDate": tweet.created_at ? DateTimeUtil.getUTCDateAndTime(tweet.created_at) : null,
            "tags": this.hashTags(tweet),
            "images": [],
            "videos": []
        };
        let images = tweet.entities.media;
        if(images && images.length > 0) { // eslint-disable-line no-magic-numbers
            images.forEach(item => {
                feedObj.images.push({ "url": item.media_url_https });
            });
        }

        let videos = tweet.extended_entities ? tweet.extended_entities.media : [];
        if(videos && videos.length > 0) { // eslint-disable-line no-magic-numbers
            videos.forEach(item => {
                feedObj.videos.push({ "thumbnail": item.media_url_https });
            });
        }
        return feedObj;
    }

    hashTags(tweet) {
        let tagsArray = [];
        tweet.entities.hashtags.forEach(tag => {
            tagsArray.push(tag.text);
        });
        return tagsArray;
    }
}
