/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] no-undefined:0, no-magic-numbers:0*/

"use strict";
import FacebookRequestHandler from "../../src/js/facebook/FacebookRequestHandler.js";
import FacebookClient from "../../src/js/facebook/FacebookClient.js";

import sinon from "sinon";
import { assert } from "chai";
import "../helper/TestHelper.js";

describe("FacebookRequestHandler", () => {
    describe("getPosts", () => {
        let nodeUrl = null, accessToken = null, facebookOriginalFeeds = null;
        before("getPosts", () => {
            nodeUrl = "test-node-name";
            accessToken = "test-access-token";
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

            FacebookRequestHandler.getPosts(accessToken, nodeUrl).then(posts => {
                assert.strictEqual(2, posts.length);
                facebookClientMock.verify();
                facebookFetchPostsMock.verify();
                FacebookClient.instance.restore();
                faceFacebookClient.fetchPosts.restore();
                done();
            });
        });

        it("should resolve to empty posts if there is any issue while fetching feeds from facebook", (done) => {
            let faceFacebookClient = new FacebookClient(accessToken);
            let facebookClientMock = sinon.mock(FacebookClient).expects("instance");
            facebookClientMock.withArgs(accessToken).returns(faceFacebookClient);
            let facebookFetchPostsMock = sinon.mock(faceFacebookClient).expects("fetchPosts");
            facebookFetchPostsMock.withArgs(nodeUrl).returns(Promise.reject("error"));

            FacebookRequestHandler.getPosts(accessToken, nodeUrl).catch(posts => {
                assert.strictEqual(0, posts.length);
                facebookClientMock.verify();
                facebookFetchPostsMock.verify();
                FacebookClient.instance.restore();
                faceFacebookClient.fetchPosts.restore();
                done();
            });
        });

    });

    describe("setToken", () => {
        let sandbox = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should fetch and parse the facebook posts which can be saved into the db directly", () => {
            const accessToken1 = "12345";
            let faceFacebookClient = new FacebookClient(accessToken1);
            let facebookClientMock = sandbox.mock(FacebookClient).expects("instance");
            facebookClientMock.withArgs(accessToken1).returns(faceFacebookClient);
            let facebookSetTokenMock = sandbox.mock(faceFacebookClient).expects("setLongLivedToken");

            FacebookRequestHandler.setToken(accessToken1);
            facebookClientMock.verify();
            facebookSetTokenMock.verify();

        });
    });

    describe("getBatchPosts", ()=> {
        let accessToken = null;
        before("getPosts", () => {
            accessToken = "test-access-token";
        });

        it("should get all posts from the batch of urls", (done)=> {

            let postData = {
                "data": [
                    { "id": "fbid1", "url": "@Bangalore since:2016-01-02", "timestamp": 123456 },
                    { "id": "fbid2", "url": "@Chennai since:2016-01-02", "timestamp": 123456 }
                ]
            };

            let fbPostMap = {
                "fbid1": [
                    { "name": "test name1" }
                ],
                "fbid2": [
                    { "name": "test name2" }
                ]
            };


            let faceFacebookClient = new FacebookClient(accessToken);
            let facebookClientMock = sinon.mock(FacebookClient).expects("instance");
            facebookClientMock.withArgs(accessToken).returns(faceFacebookClient);

            let facebookFetchPostsMock = sinon.mock(faceFacebookClient).expects("fetchBatchPosts");
            facebookFetchPostsMock.withArgs(postData).returns(Promise.resolve(fbPostMap));

            FacebookRequestHandler.getBatchPosts(accessToken, postData).then(() => {
                facebookClientMock.verify();
                facebookFetchPostsMock.verify();

                FacebookClient.instance.restore();
                faceFacebookClient.fetchBatchPosts.restore();
                done();
            });
        });
    });
});
