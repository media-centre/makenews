/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] no-undefined:0, no-magic-numbers:0*/

"use strict";
import FacebookRequestHandler from "../../src/js/facebook/FacebookRequestHandler.js";
import FacebookClient from "../../src/js/facebook/FacebookClient.js";
import FacebookResponseParser from "../../src/js/facebook/FacebookResponseParser.js";

import sinon from "sinon";
import { assert } from "chai";
import "../helper/TestHelper.js";

describe("FacebookRequestHandler", () => {
    describe("getPosts", () => {
        let nodeUrl = null, accessToken = null, facebookOriginalFeeds = null, sourceId = null;
        before("getPosts", () => {
            nodeUrl = "test-node-name";
            accessToken = "test-access-token";
            sourceId = "test-sourceId";
            facebookOriginalFeeds = {
                "posts": [
                    {
                        "link": "test-link1",
                        "message": "test-message1",
                        "picture": "test-picture-url1",
                        "name": "test-name1",
                        "caption": "thehindu.com",
                        "privacy": {
                            "value": "",
                            "description": "",
                            "friends": "",
                            "allow": "",
                            "deny": ""
                        },
                        "id": "test-id1"
                    },
                    {
                        "link": "test-link2",
                        "picture": "test-picture-url2",
                        "name": "test-name2",
                        "privacy": {
                            "value": "",
                            "description": "",
                            "friends": "",
                            "allow": "",
                            "deny": ""
                        },
                        "id": "test-id2"
                    }
                ]
            };
        });

        it("should fetch and parse the facebook posts which can be saved into the db directly", (done) => {
            let faceFacebookClient = new FacebookClient(accessToken);
            let facebookClientMock = sinon.mock(FacebookClient).expects("instance");
            facebookClientMock.withArgs(accessToken).returns(faceFacebookClient);
            let facebookFetchPostsMock = sinon.mock(faceFacebookClient).expects("fetchPosts");
            facebookFetchPostsMock.withArgs(nodeUrl).returns(Promise.resolve(facebookOriginalFeeds));
            let facebookResponseParsePostsMock = sinon.mock(FacebookResponseParser).expects("parsePosts");
            facebookResponseParsePostsMock.withArgs(sourceId, facebookOriginalFeeds.posts).returns([{}, {}, {}]);

            FacebookRequestHandler.getPosts(sourceId, accessToken, nodeUrl).then(posts => {
                assert.strictEqual(3, posts.length);
                facebookClientMock.verify();
                facebookFetchPostsMock.verify();
                facebookResponseParsePostsMock.verify();
                FacebookClient.instance.restore();
                faceFacebookClient.fetchPosts.restore();
                FacebookResponseParser.parsePosts.restore();
                done();
            });
        });

        it("should resolve to empty posts if there is any issue while fetching feeds from facebook", (done) => {
            let faceFacebookClient = new FacebookClient(accessToken);
            let facebookClientMock = sinon.mock(FacebookClient).expects("instance");
            facebookClientMock.withArgs(accessToken).returns(faceFacebookClient);
            let facebookFetchPostsMock = sinon.mock(faceFacebookClient).expects("fetchPosts");
            facebookFetchPostsMock.withArgs(nodeUrl).returns(Promise.reject("error"));

            FacebookRequestHandler.getPosts(sourceId, accessToken, nodeUrl).catch(posts => {
                assert.strictEqual(0, posts.length);
                facebookClientMock.verify();
                facebookFetchPostsMock.verify();
                FacebookClient.instance.restore();
                faceFacebookClient.fetchPosts.restore();
                done();
            });
        });

    });
});
