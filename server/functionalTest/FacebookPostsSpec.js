/* eslint max-nested-callbacks: [2, 5] handle-callback-err: 0 */
"use strict";

import request from "supertest";
import argv from "yargs";
import { assert } from "chai";
import config from "../config/application.json";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import CouchSession from "../src/CouchSession";

let env = argv.client_environment || "qa";
describe("FacbookPosts", () => {
    let accessToken = null;
    before("FacbookPosts", (done)=> {
        CouchSession.login("test", "test").then((token) => {
            accessToken = token;
            done();
        });
    });

    describe("FacbookRoutes", () => {
        it("responds to /facebook-feeds with 401 if user is not logged in", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .post("/facebook-posts")
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.UNAUTHORIZED, res.statusCode);
                    done();
                });
        });

        it("should return feeds for public page", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .get("/facebook-posts?webUrl=https://www.facebook.com/thehindu&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.OK, res.statusCode);
                    assert.strictEqual("test news 1", res.body.posts[0].message);
                    assert.strictEqual("test news 2", res.body.posts[1].message);
                    done();
                });
        });

        it("should reject with error if the facebook page is not available", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .get("/facebook-posts?webUrl=https://www.facebook.com/doNotRespond&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, res.statusCode);
                    assert.strictEqual("error fetching facebook feeds of web url = https://www.facebook.com/doNotRespond", res.body);
                    done();
                });
        });

        it("should timeout if the response takes more than 2 seconds while fetching facebook id of a page", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .get("/facebook-posts?webUrl=https://www.facebook.com/idtimeout&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, res.statusCode);
                    assert.strictEqual("error fetching facebook id of web url = https://www.facebook.com/idtimeout", res.body);
                    done();
                });
        });

        it("should timeout if the response takes more than 2 seconds while fetching feeds of a facebook page", (done) => {
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .get("/facebook-posts?webUrl=https://www.facebook.com/feedtimeout&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, res.statusCode);
                    assert.strictEqual("error fetching facebook feeds of web url = https://www.facebook.com/feedtimeout", res.body);
                    done();
                });
        });

    });
});
