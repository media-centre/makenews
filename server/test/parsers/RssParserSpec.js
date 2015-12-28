/* eslint max-nested-callbacks: [2, 5] */
"use strict";

import RssParser from "../../src/rss/RssParser";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import { expect } from "chai";
import nock from "nock";
import restRequest from "request";

describe("RssParser", () => {
    it("should reject if the url is not a feed", (done) => {
        let data = `<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
        <TITLE>302 Moved</TITLE></HEAD><BODY>
        <H1>302 Moved</H1>
        The document has moved
        <A HREF="http://www.google.co.in/?gfe_rd=cr&amp;ei=h91eVqj4N-my8wexop6oAg">here</A>.
        </BODY></HTML>`;

        nock("http://www.google.com")
            .get("/users")
            .reply(HttpResponseHandler.codes.OK, data);
        let url = "http://www.google.com/users";

        restRequest(url).on("response", function(res) {
            let rssParser = new RssParser(res);
            rssParser.parse().catch((error) => {
                expect(error).to.eq("Not a feed");
                done();
            });
        });
    });

    it("should resolve with parsed items for proper url", (done) => {
        let data = `<rss version="2.0"><channel>
        <title>hindu</title>
        <link>http://hindu.com</link>
        <description>from hindu</description>
            <item>
                <title>test</title>
                <description>news cricket</description>
            </item>
        </channel></rss>`;
        let url = "http://www.thehindu.com/sport/cricket/?service=rss";

        nock("http://www.thehindu.com/sport/cricket")
            .get("/?service=rss")
            .reply(HttpResponseHandler.codes.OK, data);

        let expectedFeeds = {
            "items": [{ "title": "test",
                "description": "news cricket" }]
        };

        restRequest(url).on("response", function(res) {
            let rssParser = new RssParser(res);
            rssParser.parse().then((feedJson) => {
                let items = feedJson.items;
                if(items) {
                    let expectedItems = expectedFeeds.items;
                    expect(items.length).to.eq(expectedItems.length);
                    for(let index = 0; index < items.length; index += 1) {
                        expect(items[index].title).to.eq(expectedItems[index].title);
                        expect(items[index].description).to.eq(expectedItems[index].description);
                    }
                }
                done();
            });
        });
    });
});
