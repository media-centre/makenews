import DateUtil from "../util/DateUtil";
import { map } from "ramda";

const hashTags = map(tag => tag.text);

export function parseHandle(handles) {
    return handles.map(handle =>
        ({
            "id": handle.id_str,
            "picture": {
                "data": {
                    "url": handle.profile_image_url_https
                }
            },
            "name": handle.name
        })
    );
}

export function parseTweets(sourceId, tweets = []) {
    return tweets.map(tweet => parseTweet(sourceId, tweet));
}

function parseTweet(sourceId, tweet) {
    const images = (tweet.entities.media || []).map(
        image => ({ "url": image.media_url_https, "thumbnail": `${image.media_url_https}:thumb` })
    );

    const media = tweet.extended_entities ? tweet.extended_entities.media : [];
    const videos = media.map(video => ({ "thumbnail": `${video.media_url_https}:thumb` }));

    return {
        "_id": tweet.id_str,
        "docType": "feed",
        "sourceType": "twitter",
        "title": tweet.full_text,
        "link": `https://twitter.com/${sourceId}/status/${tweet.id_str}`,
        "pubDate": tweet.created_at ? DateUtil.getUTCDateAndTime(tweet.created_at) : null,
        "tags": [tweet.user.name].concat(hashTags(tweet.entities.hashtags || [])),
        images,
        videos,
        sourceId
    };
}
