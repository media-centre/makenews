/* eslint max-nested-callbacks: [2, 5] */
"use strict";

import request from "supertest";
import server from "../../server";
import CouchSession from "../src/CouchSession";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import nock from "nock";

describe("RssReaderIntegrationSpec", () => {
    describe("RssReaderRoutes", () => {
        it("responds to /rss-feeds with 401 if user is not logged in", (done) => {
            request(server)
                .get("/rss-feeds")
                .expect(HttpResponseHandler.codes.UNAUTHORIZED, done);
        });

        it("responds with /rss-feeds if user is logged in", (done) => {
            let data = "<rss version=\"2.0\"><channel><item>" +
                "<title>sample1</title></item><item>" +
                "<title>sample2</title></item></channel></rss>";

            nock("http://www.thehindu.com/sport/cricket")
                .get("/")
                .reply(HttpResponseHandler.codes.OK, data);

            CouchSession.login("test", "test").then((token) => {
                request(server)
                    .get("/rss-feeds")
                    .query("url=http://www.thehindu.com/sport/cricket/")
                    .set("Cookie", token)
                    .expect(HttpResponseHandler.codes.OK)
                    .expect({ "rss": { "$": { "version": "2.0" }, "channel": [{ "item": [{ "title": ["sample1"] }, { "title": ["sample2"] }] }] } }, done);
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
                    .expect({ "message": new Error("error") }, done);
            });
        });
    });
});
