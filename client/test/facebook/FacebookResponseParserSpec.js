/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] no-undefined:0*/

"use strict";
import FacebookResponseParser from "../../src/js/facebook/FacebookResponseParser.js";

import { assert } from "chai";
import "../helper/TestHelper.js";

describe("FacebookResponseParser", () => {
    describe("parsePost", () => {
        let post = null, sourceId = null;
        before("parsePost", () => {
            sourceId = "test-source-id";
        });

        it("should parse the facebook posts and save as db document format of type description", () => {
            post = {
                "link": "test-link1",
                "message": "test-message1",
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
            };

            let dbFormatDocument = FacebookResponseParser.parsePost(sourceId, post);
            assert.strictEqual("test-id1", dbFormatDocument._id);
            assert.strictEqual("feed", dbFormatDocument.docType);
            assert.strictEqual("description", dbFormatDocument.type);
            assert.strictEqual("test-name1", dbFormatDocument.title);
            assert.strictEqual("test-message1", dbFormatDocument.content);
            assert.strictEqual("facebook", dbFormatDocument.feedType);
        });

        it("should parse the facebook posts and save as db document format of type image content", () => {
            post = {
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
            };

            let dbFormatDocument = FacebookResponseParser.parsePost(sourceId, post);
            assert.strictEqual("test-id1", dbFormatDocument._id);
            assert.strictEqual("feed", dbFormatDocument.docType);
            assert.strictEqual("imagecontent", dbFormatDocument.type);
            assert.strictEqual("test-name1", dbFormatDocument.title);
            assert.strictEqual("test-message1", dbFormatDocument.content);
            assert.strictEqual("facebook", dbFormatDocument.feedType);
            assert.strictEqual("test-picture-url1", dbFormatDocument.images[0].url);
        });

        it("post should not be empty object", () => {
            let parsePostFun = () => {
                FacebookResponseParser.parsePost(sourceId, undefined);
            };
            assert.throw(parsePostFun, Error, "post and source id can not be empty");
        });

        it("source id should not be empty", () => {
            let parsePostFun = () => {
                FacebookResponseParser.parsePost(undefined, post);
            };
            assert.throw(parsePostFun, Error, "post and source id can not be empty");
        });

    });
    describe("parsePosts", () => {
        let posts = null, sourceId = null;
        before("parsePosts", () => {
            sourceId = "test-source-d";
            posts = [
                {
                    "link": "https://www.facebook.com/test-link1",
                    "message": "test-message1",
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
                    "message": "test-message2",
                    "picture": "test-picture-url2",
                    "name": "test-name2",
                    "caption": "thehindu.com",
                    "privacy": {
                        "value": "",
                        "description": "",
                        "friends": "",
                        "allow": "",
                        "deny": ""
                    },
                    "id": "test-id2"
                },
                {
                    "link": "facebook.com/test-link3",
                    "message": "test-message3",
                    "name": "test-name3",
                    "caption": "thehindu.com",
                    "privacy": {
                        "value": "",
                        "description": "",
                        "friends": "",
                        "allow": "",
                        "deny": ""
                    },
                    "id": "test-id3_post"
                }
            ];
        });
        it("should use the post link in the feed document if the link starts with https://www.facebook.com/ else use postid", () => {
            let feedDocuments = FacebookResponseParser.parsePosts(sourceId, posts);
            assert.strictEqual("description", feedDocuments[0].type);
            assert.strictEqual("imagecontent", feedDocuments[1].type);
            assert.strictEqual("test-id1", feedDocuments[0]._id);
            assert.strictEqual("test-id2", feedDocuments[1]._id);
            assert.strictEqual("https://www.facebook.com/test-link1", feedDocuments[0].link);
            assert.strictEqual("https://www.facebook.com/test-id3/posts/post", feedDocuments[2].link);


        });

        it("should covert facebook posts to db feed format", () => {
            let feedDocuments = FacebookResponseParser.parsePosts(sourceId, posts);
            assert.strictEqual("description", feedDocuments[0].type);
            assert.strictEqual("imagecontent", feedDocuments[1].type);
            assert.strictEqual("test-id1", feedDocuments[0]._id);
            assert.strictEqual("test-id2", feedDocuments[1]._id);
        });

        it("should continue with other posts if there is issue with one of the post while parsing", () => {
            posts = [
                undefined,
                {
                    "link": "test-link2",
                    "message": "test-message2",
                    "picture": "test-picture-url2",
                    "name": "test-name2",
                    "caption": "thehindu.com",
                    "privacy": {
                        "value": "",
                        "description": "",
                        "friends": "",
                        "allow": "",
                        "deny": ""
                    },
                    "id": "test-id2"
                }
            ];

            let feedDocuments = FacebookResponseParser.parsePosts(sourceId, posts);
            assert.strictEqual(1, feedDocuments.length);
            assert.strictEqual("imagecontent", feedDocuments[0].type);
            assert.strictEqual("test-id2", feedDocuments[0]._id);

        });
    });
});
