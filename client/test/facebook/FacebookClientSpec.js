/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import FacebookClient from "../../src/js/facebook/FacebookClient.js";
import LoginPage from "../../src/js/login/pages/LoginPage.jsx";
import AjaxClient from "../../src/js/utils/AjaxClient.js";

import sinon from "sinon";
import { assert } from "chai";
import "../helper/TestHelper.js";

describe("FacebookClient", () => {

    let accessToken = null, serverUrl = null;
    describe("fetchPosts", () => {
        let webUrl = null, response = null, sandbox = null, userName = "test1";
        before("FacebookClient", () => {
            webUrl = "https://www.facebook.com/thehindu";
            serverUrl = "/facebook-posts";
            accessToken = "123";
            response = {
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

        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(LoginPage, "getUserName").returns(userName);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should fetch facebook posts from the given node(page/user/..etc)", (done) => {
            let ajaxClient = new AjaxClient(serverUrl);
            let ajaxInstanceStub = sandbox.stub(AjaxClient, "instance");
            ajaxInstanceStub.withArgs(serverUrl).returns(ajaxClient);
            let ajaxGetMock = sandbox.mock(ajaxClient).expects("get");
            ajaxGetMock.withArgs({ "webUrl": webUrl, "userName": userName }).returns(Promise.resolve(response));

            let facebookClient = new FacebookClient(accessToken);
            facebookClient.fetchPosts(webUrl).then(posts => {
                assert.strictEqual("test-link1", posts.posts[0].link);
                assert.strictEqual("test-link2", posts.posts[1].link);
                assert.strictEqual("test-name1", posts.posts[0].name);
                assert.strictEqual("test-name2", posts.posts[1].name);
                ajaxGetMock.verify();
                done();
            });
        });

        it("should reject with the error if the fetching of feeds from the node is failed", (done) => {
            let ajaxClient = new AjaxClient(serverUrl);
            let ajaxInstanceStub = sandbox.stub(AjaxClient, "instance");
            ajaxInstanceStub.withArgs(serverUrl).returns(ajaxClient);
            let ajaxGetMock = sandbox.mock(ajaxClient).expects("get");
            ajaxGetMock.withArgs({ "webUrl": webUrl, "userName": userName }).returns(Promise.reject("error while fetching posts"));

            let facebookClient = new FacebookClient(accessToken);
            facebookClient.fetchPosts(webUrl).catch(error => {
                assert.strictEqual("error while fetching posts", error);
                ajaxGetMock.verify();
                done();
            });

        });

        it("throw error if the access token is empty", () => {
            let facebookClientFun = () => {
                return new FacebookClient(null);
            };
            assert.throw(facebookClientFun, Error, "access token can not be empty");
        });

        it("reject with error if the node url is empty", (done) => {
            let facebookClient = new FacebookClient(accessToken);
            facebookClient.fetchPosts(null).catch(error => {
                assert.strictEqual(error, "web url cannot be empty");
                done();
            });
        });
    });

    describe("setLongLivedToken", () => {
        let url = "/facebook-set-token", sandbox = null, userName = "test2";

        beforeEach(() => {
            accessToken = "123";
            sandbox = sinon.sandbox.create();
            sandbox.stub(LoginPage, "getUserName").returns(userName);
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should call ajax post for long lived token", () => {
            let ajaxClient = new AjaxClient(url);
            let ajaxInstanceStub = sandbox.stub(AjaxClient, "instance");
            ajaxInstanceStub.withArgs(url).returns(ajaxClient);
            let ajaxPostMock = sandbox.mock(ajaxClient).expects("post");
            const headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            ajaxPostMock.withArgs(headers, { "accessToken": accessToken, "userName": userName }).returns(Promise.resolve("12345"));

            let facebookClient = new FacebookClient(accessToken);
            facebookClient.setLongLivedToken();
            ajaxPostMock.verify();
        });
    });

    describe("getBatchPosts", ()=> {
        before("getPosts", () => {
            accessToken = "test-access-token";
        });

        it("should get all posts from the batch of urls", (done)=> {
            serverUrl = "/facebook-batch-posts";
            let postData = {
                "data": [
                    { "id": "fbid1", "url": "@Bangalore since:2016-01-02", "timestamp": 123456 },
                    { "id": "fbid2", "url": "@Chennai since:2016-01-02", "timestamp": 123456 }
                ]
            };

            let ajaxPostData = {
                "data": [
                    { "id": "fbid1", "url": "@Bangalore since:2016-01-02", "timestamp": 123456 },
                    { "id": "fbid2", "url": "@Chennai since:2016-01-02", "timestamp": 123456 }
                ],
                "accessToken": accessToken
            };

            let fbPostMap = {
                "fbid1": [
                    { "name": "test name1" }
                ],
                "fbid2": [
                    { "name": "test name2" }
                ]
            };
            let requestHeader = { "Accept": "application/json", "Content-type": "application/json" };
            let ajaxClient = new AjaxClient(serverUrl);
            let ajaxInstanceStub = sinon.stub(AjaxClient, "instance");
            ajaxInstanceStub.withArgs(serverUrl).returns(ajaxClient);
            let ajaxPostMock = sinon.mock(ajaxClient).expects("post");
            ajaxPostMock.withArgs(requestHeader, ajaxPostData).returns(Promise.resolve(fbPostMap));

            let facebookClient = new FacebookClient(accessToken);
            facebookClient.fetchBatchPosts(postData).then(posts => {
                assert.deepEqual(posts, fbPostMap);
                ajaxPostMock.verify();
                AjaxClient.instance.restore();
                ajaxClient.post.restore();
                done();
            });
        });
    });
});

