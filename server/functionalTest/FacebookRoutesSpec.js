/* eslint max-nested-callbacks: [2, 5] react/jsx-wrap-multilines:0 */
/* eslint handle-callback-err: 0 no-magic-numbers:0 */

import request from "supertest";
import { assert } from "chai";
import ApplicationConfig from "../src/config/ApplicationConfig";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import CouchSession from "../src/CouchSession";

describe("FacebookRoutesSpec", () => {
    let accessToken = null, applicationConfig = null, serverIp = null;
    before("FacebookRoutesSpec", (done)=> {
        applicationConfig = new ApplicationConfig();
        serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
        CouchSession.login("test", "test").then((token) => {
            accessToken = token;
            done();
        });
    });

    describe("FacbookRoutes", () => {
        it("responds to /facebook-feeds with 401 if user is not logged in", (done) => {
            request(serverIp)
            .get("/facebook-posts")
            .end((err, res) => {
                assert.strictEqual(res.statusCode, HttpResponseHandler.codes.UNAUTHORIZED);
                done();
            });
        });

        it("should return feeds for public page", (done) => {
            request(serverIp)
                .get("/facebook-posts?webUrl=https://www.facebook.com/thehindu&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.OK, res.statusCode);
                    assert.strictEqual("test news 1", res.body.posts[0].description);
                    assert.strictEqual("test news 2", res.body.posts[1].description);
                    done();
                });
        });

        it("should reject with error if the facebook page is not available", (done) => {
            request(serverIp)
                .get("/facebook-posts?webUrl=https://www.facebook.com/doNotRespond&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.BAD_REQUEST, res.statusCode);
                    assert.deepEqual({ "message": "bad request" }, res.body);
                    done();
                });
        });

        it("should timeout if the response takes more than 2 seconds while fetching facebook id of a page", (done) => {
            request(serverIp)
                .get("/facebook-posts?webUrl=https://www.facebook.com/idtimeout&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.BAD_REQUEST, res.statusCode);
                    assert.deepEqual({ "message": "bad request" }, res.body);
                    done();
                });
        });

        it("should timeout if the response takes more than 2 seconds while fetching feeds of a facebook page", (done) => {
            request(serverIp)
                .get("/facebook-posts?webUrl=https://www.facebook.com/feedtimeout&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.BAD_REQUEST, res.statusCode);
                    assert.deepEqual({ "message": "bad request" }, res.body);
                    done();
                });
        });

        it("should fetch feeds for multiple facebook urls", (done) => {
            let expectedResponse = {
                "posts": {
                    "95B3612A-B090-4185-93CC-49877FD97201": [
                        {
                            "_id": "163974433696568_647858557641482",
                            "description": "ur1 1 message 1",
                            "docType": "feed",
                            "images": [],
                            "link": "https://www.facebook.com/163974433696568/posts/647858557641482",
                            "sourceType": "facebook",
                            "tags": [],
                            "title": "",
                            "type": "description",
                            "videos": []
                        },
                        {
                            "_id": "163974433696568_647858557641482",
                            "description": "ur1 1 message 2",
                            "docType": "feed",
                            "images": [],
                            "link": "https://www.facebook.com/163974433696568/posts/647858557641482",
                            "sourceType": "facebook",
                            "tags": [],
                            "title": "",
                            "type": "description",
                            "videos": []
                        }
                    ],
                    "A524A8C4-B6F9-7932-921A-22E1B120D277": [
                        {
                            "_id": "163974433696568_657858557641482",
                            "description": "ur1 2 message 1",
                            "docType": "feed",
                            "images": [],
                            "link": "https://www.facebook.com/163974433696568/posts/657858557641482",
                            "sourceType": "facebook",
                            "tags": [],
                            "title": "",
                            "type": "description",
                            "videos": []
                        },
                        {
                            "_id": "163974433696568_657858557641482",
                            "description": "ur1 2 message 2",
                            "docType": "feed",
                            "images": [],
                            "link": "https://www.facebook.com/163974433696568/posts/657858557641482",
                            "sourceType": "facebook",
                            "tags": [],
                            "title": "",
                            "type": "description",
                            "videos": []
                        }
                    ]
                }
            };
            request(serverIp)
                .post("/facebook-batch-posts")
                .send({
                    "userName": "test",
                    "data": [
                        {
                            "timestamp": "2016-02-03T22:09:38+00:00",
                            "url": "https://www.facebook.com/BatchFacebookUrl1",
                            "id": "95B3612A-B090-4185-93CC-49877FD97201"
                        },
                        {
                            "timestamp": "2016-02-03T08:43:40+00:00",
                            "url": "https://www.facebook.com/BatchFacebookUrl2",
                            "id": "A524A8C4-B6F9-7932-921A-22E1B120D277"
                        }
                    ]
                })
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedResponse);
                    assert.strictEqual(HttpResponseHandler.codes.OK, res.statusCode);
                    done();
                });
        });
    });
});
