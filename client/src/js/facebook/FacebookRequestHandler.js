"use strict";
import FacebookClient from "./FacebookClient.js";

export default class FacebookRequestHandler {

    static getPosts(accessToken, nodeUrl) {
        return new Promise((resolve, reject) => {
            let facebookClient = FacebookClient.instance(accessToken);
            facebookClient.fetchPosts(nodeUrl).then(originalFeeds => {
                resolve(originalFeeds.posts);
            }).catch(error => { // eslint-disable-line
                reject([]);
            });
        });
    }

    static getBatchPosts(accessToken, nodeUrl) {

    }
}

