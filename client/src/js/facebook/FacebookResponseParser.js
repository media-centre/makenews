"use strict";
import StringUtil from "../../../../common/src/util/StringUtil.js";
import DateTimeUtil from "../utils/DateTimeUtil.js";

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
        if(!post || StringUtil.isEmptyString(sourceId)) {
            throw new Error("post and source id can not be empty");
        }
        let feedDocument = {
            "_id": post.id,
            "docType": "feed",
            "sourceId": sourceId,
            "type": "description",
            "title": post.name || "",
            "feedType": "facebook",
            "content": post.message || "",
            "postedDate": post.created_time ? DateTimeUtil.getUTCDateAndTime(post.created_time) : null,
            "tags": [""]
        };

        if(StringUtil.validString(post.picture)) {
            feedDocument.type = "imagecontent";
            feedDocument.url = post.picture;
        }

        return feedDocument;
    }
}
