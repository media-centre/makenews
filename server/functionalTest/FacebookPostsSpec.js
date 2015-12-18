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
                .expect(HttpResponseHandler.codes.UNAUTHORIZED, done);
        });

        it("should return feeds for public page", (done) => {
            let expectedValues = {
                "data":
                    [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
                        { "message": "test news 2", "id": "163974433696568_957850670975603" }]
            };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .get("/facebook-posts?nodeName=thehindu&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.equal(res.statusCode, HttpResponseHandler.codes.OK);
                    assert.strictEqual("test news 1", expectedValues.data[0].message);
                    assert.strictEqual("test news 2", expectedValues.data[1].message);
                    done();
                });
        });

        it("should reject with error if the facebook page is not available", (done) => {

            let expectedValues = {
                "data":
                    [{
                        "code": "ETIMEDOUT",
                        "errno": "ETIMEDOUT",
                        "syscall": "connect",
                        "address": "65.19.157.235",
                        "port": 443
                    }]
            };
            request(config[env].serverIpAddress + ":" + config[env].serverPort)
                .get("/facebook-posts?nodeName=doNotRespond&accessToken=" + accessToken)
                .set("Cookie", accessToken)
                .end((err, res) => {
                    let timeOutPort = 443;
                    assert.equal(res.statusCode, HttpResponseHandler.codes.NOT_FOUND);
                    assert.strictEqual("ETIMEDOUT", expectedValues.data[0].code);
                    assert.strictEqual(timeOutPort, expectedValues.data[0].port);
                    done();
                });
        });

    });
});
