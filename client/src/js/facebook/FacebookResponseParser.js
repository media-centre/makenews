/* eslint no-empty:0 */

import StringUtil from "../../../../common/src/util/StringUtil";
import DateTimeUtil from "../utils/DateTimeUtil";

export default class FacebookResponseParser {

    static parsePosts(sourceId, posts = []) {
        let feedDocuments = [];
        posts.forEach((post)=> {
            try {
                feedDocuments.push(FacebookResponseParser.parsePost(sourceId, post));
            } catch(error) {
                //no handling
            }
        });
        return feedDocuments;

    }
    static parsePost(sourceId, post) {
        var facebookRegex = /^https:\/\/www\.facebook\.com/;
        var postId = null;
        if(!post || StringUtil.isEmptyString(sourceId)) {
            throw new Error("post and source id can not be empty");
        }
        postId = post.id.split("_");
        let feedDocument = {
            "_id": post.id,
            "docType": "feed",
            "sourceId": sourceId,
            "type": "description",
            "title": post.name || "",
            "feedType": "facebook",
            "link": facebookRegex.test(post.link) ? post.link : ("https://www.facebook.com/" + postId[0] + "/posts/" + postId[1]),          //eslint-disable-line no-magic-numbers
            "content": post.message || "",
            "postedDate": post.created_time ? DateTimeUtil.getUTCDateAndTime(post.created_time) : null,
            "tags": []
        };

        if(StringUtil.validString(post.picture)) {
            feedDocument.type = "imagecontent";
            feedDocument.images = [];
            post.url = post.picture;
            feedDocument.images[0] = post;                      //eslint-disable-line no-magic-numbers
           // feedDocument.url = post.picture;
        }

        return feedDocument;
    }
}
