"use strict";
import { getUrl } from "../../src/js/utils/FeedUtils.js"; //eslint-disable-line no-unused-vars
import { assert } from "chai";

describe("getUrl", function() {
    it("should get rss url for the rss feed", () =>{
        let expectedUrl = "http://www.thehindu.com/news/national/tamil-nadu/chennai-patient-receives-heart-from-braindead-man-in-cmc/article8039635.ece?utm_source=RSS_Feed&utm_medium=RSS&utm_campaign=RSS_Syndication";
        let category = {
            "_id": "78435DSKJHIUERWDCIURWU",
            "feedType": "rss",
            "sourceId": "967E965A-1990-2FB6-A085-1018C28B5DB0",
            "link": "http://www.thehindu.com/news/national/tamil-nadu/chennai-patient-receives-heart-from-braindead-man-in-cmc/article8039635.ece?utm_source=RSS_Feed&utm_medium=RSS&utm_campaign=RSS_Syndication"
        };
        let url = getUrl(category);
        assert.strictEqual(url, expectedUrl);
    });

    it("should get facebook url for the facebook feed", () =>{
        let expectedUrl = "https://www.facebook.com/89723498723n42938472c429847";
        let category = {
            "_id": "89723498723n42938472c429847",
            "feedType": "facebook",
            "sourceId": "967E965A-1990-wqe89n-213qeqsd-12"
        };
        let url = getUrl(category);
        assert.strictEqual(url, expectedUrl);
    });

    it("should get twitter url for the twitter feed", () =>{
        let expectedUrl = "https://twitter.com/9E1B7EE2-F495-197A-B35F-0116996B08FB/status/681710919336902660";
        let category = {
            "_id": "681710919336902660",
            "feedType": "twitter",
            "sourceId": "9E1B7EE2-F495-197A-B35F-0116996B08FB"
        };
        let url = getUrl(category);
        assert.strictEqual(url, expectedUrl);
    });
});
