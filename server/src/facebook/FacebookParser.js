/* eslint no-empty:0 */

import StringUtil from "../../../common/src/util/StringUtil.js";
//import DateTimeUtil from "../../../client/src/js/utils/DateTimeUtil.js";

export default class FacebookParser {

    static parsePosts(posts = []) {
        let feedDocuments = [];
        posts.forEach((post)=> {
            try {
                feedDocuments.push(FacebookParser.parsePost(post));
            } catch(error) {
                //no handling
            }
        });
        return feedDocuments;

    }
    static parsePost( post) {
        var facebookRegex = /^https:\/\/www\.facebook\.com/;
        var postId = null;
        postId = post.id.split("_");
        let feedDocument = {
            "_id": post.id,
            "docType": "feed",
            "type": "description",
            "title": post.name || "",
            "sourceType": "facebook",
            "link": facebookRegex.test(post.link) ? post.link : ("https://www.facebook.com/" + postId[0] + "/posts/" + postId[1]),          //eslint-disable-line no-magic-numbers
            "description": post.message || "",
            "pubDate": post.created_time,
            "tags": []
        };

        if(StringUtil.validString(post.picture)) {
            feedDocument.images = [];
            post.url = post.picture;
            feedDocument.images[0] = post;                      //eslint-disable-line no-magic-numbers
            // feedDocument.url = post.picture;
        }

        return feedDocument;
    }
}
