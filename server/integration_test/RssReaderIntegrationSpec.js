/* eslint max-nested-callbacks: [2, 5] */
"use strict";

import request from "supertest";
import server from "../../server";
import CouchSession from "../src/CouchSession";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import nock from "nock";
import { expect } from "chai";

describe("RssReaderIntegrationSpec", () => {
    describe("RssReaderRoutes", () => {
        it("responds to /rss-feeds with 401 if user is not logged in", (done) => {
            request(server)
                .get("/rss-feeds")
                .expect(HttpResponseHandler.codes.UNAUTHORIZED, done);
        });

        it("responds with /rss-feeds if user is logged in", (done) => {
            let data = "<rss version=\"2.0\"><channel><item>" +
                "<title>sample1</title><description>news cricket</description></item><item>" +
                "<title>sample2</title><description>news politics</description></item>" +
                "</channel></rss>";

            nock("http://www.thehindu.com/sport/cricket")
                .get("/")
                .reply(HttpResponseHandler.codes.OK, data);

            let expectedValues = {
                "items": [{ "title": "sample1", "description": "news cricket" },
                    { "title": "sample2", "description": "news politics" }
                ]
            };

            CouchSession.login("test", "test").then((token) => {
                request(server)
                    .get("/rss-feeds")
                    .query("url=http://www.thehindu.com/sport/cricket/")
                    .set("Cookie", token)
                    .expect(HttpResponseHandler.codes.OK)
                    .expect(function(result) {
                        let items = result.body.items;
                        let expectedItems = expectedValues.items;
                        expect(items.length).to.eq(expectedItems.length);
                        for(let index = 0; index < items.length; index += 1) {
                            expect(items[index].title).to.eq(expectedItems[index].title);
                            expect(items[index].description).to.eq(expectedItems[index].description);
                        }
                    })
                    .end(function(error) {
                        if(error) {
                            return done(error);
                        }
                        done();
                    });
            });
        });

        it("responds with 404 for /rss-feeds if rss fetch returns error", (done) => {
            nock("http://www.thehindu.com/sport/cricket")
                .get("/")
                .replyWithError("error");

            CouchSession.login("test", "test").then((token) => {
                request(server)
                    .get("/rss-feeds")
                    .query("url=http://www.thehindu.com/sport/cricket/")
                    .set("Cookie", token)
                    .expect(HttpResponseHandler.codes.NOT_FOUND)
                    .expect({ "message": "Request failed for http://www.thehindu.com/sport/cricket/" }, done);
            });
        });
    });
});
