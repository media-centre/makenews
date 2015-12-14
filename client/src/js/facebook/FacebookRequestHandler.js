"use strict";
import FacebookClient from "./FacebookClient.js";
import FacebookResponseParser from "./FacebookResponseParser.js";

export default class FacebookRequestHandler {

    static getPosts(sourceId, accessToken, nodeUrl) {
        return new Promise((resolve, reject) => {
            let facebookClient = FacebookClient.instance(accessToken);
            facebookClient.fetchPosts(nodeUrl).then(originalFeeds => {
                let feedDocuments = FacebookResponseParser.parsePosts(sourceId, originalFeeds.posts);
                resolve(feedDocuments);
            }).catch(error => { // eslint-disable-line
                reject([]);
            });
        });
    }
}

