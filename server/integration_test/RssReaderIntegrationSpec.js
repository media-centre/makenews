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
            let data = "<rss><item>" +
                "<title>sample1</title></item><item>" +
                "<title>sample2</title></item></rss>";

            nock("http://www.thehindu.com/sport/cricket")
                .get("/")
                .reply(HttpResponseHandler.codes.OK, data);

            CouchSession.login("test", "test").then((token) => {
                request(server)
                    .get("/rss-feeds")
                    .query("url=http://www.thehindu.com/sport/cricket/")
                    .set("Cookie", token)
                    .expect(HttpResponseHandler.codes.OK)
                    .expect({ "rss": { "item": [{ "title": ["sample1"] }, { "title": ["sample2"] }] } }, done);
            });
        });
    });
});
