/* eslint max-nested-callbacks: [2, 5] max-len:0*/
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
        let data = `<?xml version="1.0" encoding="utf-8" ?>
                     <rss version="2.0" xml:base="http://www.nasa.gov/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:media="http://search.yahoo.com/mrss/"> <channel>
                    <item>
                     <title>NASA Administrator Remembers Apollo-Era Astronaut Edgar Mitchell</title>
                     <link>http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell</link>
                     <description>The following is a statement from NASA Administrator Charles Bolden on the passing of NASA astronaut Edgar Mitchell:</description>
                    </item>

                    <item>
                     <title>NASA Television to Air Russian Spacewalk</title>
                     <link>http://www.nasa.gov/press-release/nasa-television-to-air-russian-spacewalk</link>
                     <description>NASA Television will broadcast live coverage of a 5.5-hour spacewalk by two Russian cosmonauts aboard the International Space Station beginning at 7:30 a.m. EST Wednesday, Feb. 3.</description>
                    </item>
                    </channel>
                    </rss>`;
        let url = "http://www.nasa.com/images/?service=rss";

        nock("http://www.nasa.com/images")
            .get("/?service=rss")
            .reply(HttpResponseHandler.codes.OK, data);

        let expectedFeeds = {
            "items":
                [{
                    "guid": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                    "title": "NASA Administrator Remembers Apollo-Era Astronaut Edgar Mitchell",
                    "link": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                    "description": "The following is a statement from NASA Administrator Charles Bolden on the passing of NASA astronaut Edgar Mitchell:",
                    "pubDate": null,
                    "enclosures": [],
                    "image": {}
                },
                    {
                        "guid": "http://www.nasa.gov/press-release/nasa-television-to-air-russian-spacewalk",
                        "title": "NASA Television to Air Russian Spacewalk",
                        "link": "http://www.nasa.gov/press-release/nasa-television-to-air-russian-spacewalk",
                        "description": "NASA Television will broadcast live coverage of a 5.5-hour spacewalk by two Russian cosmonauts aboard the International Space Station beginning at 7:30 a.m. EST Wednesday, Feb. 3.",
                        "pubDate": null,
                        "enclosures": [],
                        "image": {}
                    }]
        };

        restRequest(url).on("response", function(res) {
            let rssParser = new RssParser(res);
            rssParser.parse().then((feedJson) => {
                expect(feedJson).deep.equal(expectedFeeds);
                done();
            });
        });
    });
});
