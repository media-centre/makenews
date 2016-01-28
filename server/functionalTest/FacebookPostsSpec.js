/* eslint max-nested-callbacks: [2, 5] handle-callback-err: 0 */
"use strict";

import request from "supertest";
import { assert } from "chai";
import ApplicationConfig from "../src/config/ApplicationConfig.js";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import CouchSession from "../src/CouchSession";

describe("FacbookPosts", () => {
    let accessToken = null, applicationConfig = null, serverIp = null;
    before("FacbookPosts", (done)=> {
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
            .post("/facebook-posts")
            .end((err, res) => {
                assert.strictEqual(HttpResponseHandler.codes.UNAUTHORIZED, res.statusCode);
                done();
            });
        });

        it("should return feeds for public page", (done) => {
            request(serverIp)
                .get("/facebook-posts?webUrl=https://www.facebook.com/thehindu&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.OK, res.statusCode);
                    assert.strictEqual("test news 1", res.body.posts[0].message);
                    assert.strictEqual("test news 2", res.body.posts[1].message);
                    done();
                });
        });

        it("should reject with error if the facebook page is not available", (done) => {
            request(serverIp)
                .get("/facebook-posts?webUrl=https://www.facebook.com/doNotRespond&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, res.statusCode);
                    assert.strictEqual("error fetching facebook feeds of web url = https://www.facebook.com/doNotRespond", res.body);
                    done();
                });
        });

        xit("should timeout if the response takes more than 2 seconds while fetching facebook id of a page", (done) => {
            request(serverIp)
                .get("/facebook-posts?webUrl=https://www.facebook.com/idtimeout&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, res.statusCode);
                    assert.strictEqual("error fetching facebook feeds of web url = https://www.facebook.com/idtimeout", res.body);
                    done();
                });
        });

        xit("should timeout if the response takes more than 2 seconds while fetching feeds of a facebook page", (done) => {
            request(serverIp)
                .get("/facebook-posts?webUrl=https://www.facebook.com/feedtimeout&userName=test&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, res.statusCode);
                    assert.strictEqual("error fetching facebook feeds of web url = https://www.facebook.com/feedtimeout", res.body);
                    done();
                });
        });

    });
});
