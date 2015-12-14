/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import FacebookClient from "../../src/js/facebook/FacebookClient.js";
import AjaxClient from "../../src/js/utils/AjaxClient.js";

import sinon from "sinon";
import { assert } from "chai";
import "../helper/TestHelper.js";

describe("FacebookClient", () => {
    let nodeName = null, serverUrl = null, accessToken = null, response = null;
    before("FacebookClient", () => {
        nodeName = "thehindu";
        serverUrl = "/facebook-posts";
        accessToken = "test-access-token";
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

    it("should fetch facebook posts from the given node(page/user/..etc)", (done) => {
        let ajaxClient = new AjaxClient(serverUrl);
        let ajaxInstanceStub = sinon.stub(AjaxClient, "instance");
        ajaxInstanceStub.withArgs(serverUrl).returns(ajaxClient);
        let ajaxGetMock = sinon.mock(ajaxClient).expects("get");
        ajaxGetMock.withArgs({ "accessToken": accessToken, "nodeName": nodeName }).returns(Promise.resolve(response));

        let facebookClient = new FacebookClient(accessToken);
        facebookClient.fetchPosts(nodeName).then(posts => {
            assert.strictEqual("test-link1", posts.posts[0].link);
            assert.strictEqual("test-link2", posts.posts[1].link);
            assert.strictEqual("test-name1", posts.posts[0].name);
            assert.strictEqual("test-name2", posts.posts[1].name);
            ajaxGetMock.verify();
            AjaxClient.instance.restore();
            ajaxClient.get.restore();
            done();
        });
    });

    it("should reject with the error if the fetching of feeds from the node is failed", (done) => {
        let ajaxClient = new AjaxClient(serverUrl);
        let ajaxInstanceStub = sinon.stub(AjaxClient, "instance");
        ajaxInstanceStub.withArgs(serverUrl).returns(ajaxClient);
        let ajaxGetMock = sinon.mock(ajaxClient).expects("get");
        ajaxGetMock.withArgs({ "accessToken": accessToken, "nodeName": nodeName }).returns(Promise.reject("error while fetching posts"));

        let facebookClient = new FacebookClient(accessToken);
        facebookClient.fetchPosts(nodeName).catch(error => {
            assert.strictEqual("error while fetching posts", error);
            ajaxGetMock.verify();
            AjaxClient.instance.restore();
            ajaxClient.get.restore();
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
            assert.strictEqual(error, "page name can not be empty");
            done();
        });
    });

});
