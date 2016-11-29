/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] max-len:0*/


import RssParser from "../../src/rss/RssParser";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import nock from "nock";
import { assert } from "chai";
import request from "request";

describe("RssParser", () => {

    describe("parse", () => {
        it("should return error when parser returns error", (done) => {
            nock("http://mytest.com")
                .get("/rss1")
                .reply(HttpResponseHandler.codes.OK, { "data": "error" });
            request.get({
                "uri": "http://mytest.com/rss1"
            },
                (error, response) => {
                    let rssParser = new RssParser(response);
                    rssParser.parse().catch(err => {
                        assert.strictEqual(err, "Not a feed");
                        done();
                    });
                });
        });

        it("should return feeds when parser able to parse the feed", (done) => {
            nock("http://mytest.com")
                .get("/rss2")
                .reply(HttpResponseHandler.codes.OK, `<rss version="2.0">
                <channel>
                    <title>My Test</title>
                    <item>
                        <title>
                <![CDATA[Sensex surges 260 points, Nifty above 8,000 ]]>
            </title>
                        <author>
                <![CDATA[PTI]]>
            </author>
                        <link>http://www.mytest.com/the_news</link>
                        <description>
                <![CDATA[
            Sample description
            ]]>
            </description>
                        <pubDate>
                <![CDATA[Tue, 22 Nov 2016 10:14:51]]>
            </pubDate>
                    </item>
            </channel></rss>`);


            let requestToUrl = request.get({
                "uri": "http://mytest.com/rss2"
            });
            let url = "http://www.mytest.com/the_news_source";

            requestToUrl.on("response", function() {
                let rssParser = new RssParser(this);
                rssParser.parse(url).then(feed => {
                    const zero = 0;
                    let feedItem = feed.items[zero];
                    assert.strictEqual(feedItem.title, "Sensex surges 260 points, Nifty above 8,000");
                    assert.strictEqual(feedItem.description, "Sample description");
                    assert.strictEqual(feedItem.link, "http://www.mytest.com/the_news");
                    assert.equal(feedItem.pubDate.toString(), "Tue Nov 22 2016 10:14:51 GMT+0530 (IST)");
                    assert.equal(feedItem.sourceUrl, "http://www.mytest.com/the_news_source");
                    done();
                }).catch(err => {
                    done(err);
                });
            });

        });
    });
});
