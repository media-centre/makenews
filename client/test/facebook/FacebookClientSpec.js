/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import FacebookClient from "../../src/js/facebook/FacebookClient";
import FacebookLogin from "../../src/js/facebook/FacebookLogin";
import LoginPage from "../../src/js/login/pages/LoginPage";
import UserSession from "../../src/js/user/UserSession";
import AjaxClient from "../../src/js/utils/AjaxClient";

import sinon from "sinon";
import { assert } from "chai";
import "../helper/TestHelper";

describe("FacebookClient", () => {
    let sandbox = null;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        let userSession = new UserSession();
        sandbox.stub(UserSession, "instance").returns(userSession);
        sandbox.stub(userSession, "continueSessionIfActive");
    });

    afterEach(() => {
        sandbox.restore();
    });

    let serverUrl = null;
    describe("fetchPosts", () => {
        let webUrl = null, response = null, userName = "test1";
        before("FacebookClient", () => {
            webUrl = "https://www.facebook.com/thehindu";
            serverUrl = "/facebook-posts";
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
            sandbox.stub(LoginPage, "getUserName").returns(userName);
            sandbox.stub(FacebookLogin, "instance").returns({ "login": () => {
                return Promise.resolve(true);
            } });
        });

        it("should fetch facebook posts from the given node(page/user/..etc)", (done) => {
            let ajaxClient = new AjaxClient(serverUrl);
            let ajaxInstanceStub = sandbox.stub(AjaxClient, "instance");
            ajaxInstanceStub.withArgs(serverUrl).returns(ajaxClient);
            let ajaxGetMock = sandbox.mock(ajaxClient).expects("get");
            ajaxGetMock.withArgs({ "webUrl": webUrl, "userName": userName }).returns(Promise.resolve(response));

            let facebookClient = new FacebookClient();
            facebookClient.fetchPosts(webUrl).then(posts => {
                assert.strictEqual("test-link1", posts.posts[0].link); //eslint-disable-line no-magic-numbers
                assert.strictEqual("test-link2", posts.posts[1].link); //eslint-disable-line no-magic-numbers
                assert.strictEqual("test-name1", posts.posts[0].name); //eslint-disable-line no-magic-numbers
                assert.strictEqual("test-name2", posts.posts[1].name); //eslint-disable-line no-magic-numbers
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

            let facebookClient = new FacebookClient();
            facebookClient.fetchPosts(webUrl).catch(error => {
                assert.strictEqual("error while fetching posts", error);
                ajaxGetMock.verify();
                done();
            });

        });

        it("reject with error if the node url is empty", (done) => {
            let facebookClient = new FacebookClient();
            facebookClient.fetchPosts(null).catch(error => {
                assert.strictEqual(error, "web url cannot be empty");
                done();
            });
        });
    });

    describe("setLongLivedToken", () => {
        let url = "/facebook-set-token", userName = "test2", accessToken = "123";

        beforeEach(() => {
            sandbox.stub(LoginPage, "getUserName").returns(userName);
            sandbox.stub(FacebookLogin, "instance").returns({ "login": () => {
                return Promise.resolve(true);
            } });
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
            ajaxPostMock.withArgs(headers, { "accessToken": accessToken }).returns(Promise.resolve("12345"));

            let facebookClient = new FacebookClient(accessToken);
            facebookClient.setLongLivedToken();
            ajaxPostMock.verify();
        });
    });

    describe("getBatchPosts", ()=> {
        let user = "test2";
        beforeEach("getPosts", () => {
            sandbox.stub(LoginPage, "getUserName").returns(user);
            sandbox.stub(FacebookLogin, "instance").returns({ "login": () => {
                return Promise.resolve(true);
            } });
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
                "userName": user
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
            let ajaxInstanceStub = sandbox.stub(AjaxClient, "instance");
            ajaxInstanceStub.withArgs(serverUrl).returns(ajaxClient);
            let ajaxPostMock = sandbox.mock(ajaxClient).expects("post");
            ajaxPostMock.withArgs(requestHeader, ajaxPostData).returns(Promise.resolve(fbPostMap));
            let facebookClient = new FacebookClient();
            facebookClient.fetchBatchPosts(postData).then(posts => {
                assert.deepEqual(posts, fbPostMap);
                ajaxPostMock.verify();
                done();
            });
        });
    });
});

