/* eslint max-nested-callbacks: [2, 5] handle-callback-err:0*/
"use strict";

import request from "supertest";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import ApplicationConfig from "../src/config/ApplicationConfig.js";
import { assert, expect } from "chai";
import CouchSession from "../src/CouchSession";

describe("RssReaderSpec", () => {
    describe("RssReaderSpec", () => {
        let accessToken = null, applicationConfig = null, serverIp = null;
        before("RssReaderSpec", (done)=> {
            applicationConfig = new ApplicationConfig();
            serverIp = applicationConfig.serverIpAddress() + ":" + applicationConfig.serverPort();
            CouchSession.login("test", "test").then((token) => {
                accessToken = token;
                done();
            });
        });

        it("should return status OK if the url is empty", (done) => {
            request(serverIp)
                .get("/rss-feeds")
                .query("url=")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, res.statusCode);
                    done();
                });
        });

        it("should return data if the url is valid", (done) => {
            let expectedValues = {
                "items": [{ "title": "sample1", "description": "news cricket" },
                    { "title": "sample2", "description": "news politics" }
                ]
            };

            request(serverIp)
                .get("/rss-feeds")
                .query("url=http://localhost:3000/thehindu/rss-feeds/")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, res.statusCode);
                    let items = res.body.items;
                    let expectedItems = expectedValues.items;
                    expect(items.length).to.eq(expectedItems.length);
                    for(let index = 0; index < items.length; index += 1) {
                        expect(items[index].title).to.eq(expectedItems[index].title);
                        expect(items[index].description).to.eq(expectedItems[index].description);
                    }
                    done();
                });
        });

        it("responds with 501 for /rss-feeds if rss fetch returns error", (done) => {
            request(serverIp)
                .get("/rss-feeds")
                .query("url=http://localhost:3000/thehindu/error-feeds/")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, res.statusCode);
                    assert.strictEqual("Bad status code", res.body.message);
                    done();
                });
        });

        xit("should timeout if fetching rss feeds exceeds time out", (done) => {
            request(serverIp)
                .get("/rss-feeds")
                .query("url=http://localhost:3000/gardian/timeout-feeds/")
                .set("Cookie", accessToken)
                .end((err, res) => {
                    assert.strictEqual(HttpResponseHandler.codes.NOT_FOUND, res.statusCode);
                    assert.strictEqual("Bad status code", res.body.message);
                    done();
                });
        });
    });
});

