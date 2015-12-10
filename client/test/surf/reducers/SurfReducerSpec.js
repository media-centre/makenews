/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

"use strict";
import { allFeeds } from "../../../src/js/surf/reducers/SurfReducer.js";
import { DISPLAY_ALL_FEEDS } from "../../../src/js/surf/actions/AllFeedsActions.js";
import { expect } from "chai";
import { List } from "immutable";

describe("Surf Reducer", () => {
    describe("allFeeds", () => {
        it("default state should return empty list", () => {
            expect({ "feeds": new List([]) }).to.deep.equal(allFeeds());
        });

        it("return feeds in required format", () => {
            let feeds = [
                {
                    "docType": "feed",
                    "title": "tn",
                    "description": "www.facebookpolitics1.com",
                    "sourceId": "rssId1",
                    "_id": "feedId1",
                    "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53",
                    "categoryNames": ["Sports"],
                    "pubDate": "Thu Dec 10 2015 14:27:37 GMT+0530 (IST)"
                },
                {
                    "docType": "feed",
                    "title": "tn",
                    "description": "www.facebookpolitics2.com",
                    "sourceId": "rssId1",
                    "_id": "feedId2",
                    "_rev": "1-e41ef125b2f5fbef4f20d8c896eeea53",
                    "categoryNames": ["Sports", "Politics"]
                }
            ];
            let action = { "type": DISPLAY_ALL_FEEDS, "feeds": feeds };
            let expectedfeeds = {
                "feeds": [
                    {
                        "content": "www.facebookpolitics1.com",
                        "feedType": "rss",
                        "name": "Sports",
                        "tags": [
                            "Dec 10 2015    14:27:37"
                        ],
                        "title": "tn",
                        "type": "description"
                    },
                    {
                        "content": "www.facebookpolitics2.com",
                        "feedType": "rss",
                        "name": "Sports, Politics",
                        "tags": [""],
                        "title": "tn",
                        "type": "description"
                    }
                ]
            };
            expect(expectedfeeds).to.deep.equal(allFeeds(undefined, action));
        });

    });
});
