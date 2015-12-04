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

        it("return feeds from sources", () => {
            let sources = [
                {
                    "_id": "sourceId1",
                    "docType": "source",
                    "type": "rss",
                    "url": "www.hindu.com/rss",
                    "categoryIds": ["sportsCategoryId"],
                    "categoryNames": ["sportsCategory"],
                    "feedItems": [{
                        "title": "cricket",
                        "description": "feed1 description"
                    }, {
                        "title": "football",
                        "description": "feed2 description"
                    }]
                },
                {
                    "_id": "sourceId2",
                    "docType": "source",
                    "type": "rss",
                    "url": "www.guardian.com/rss",
                    "categoryIds": ["politicsCategoryId"],
                    "categoryNames": ["politicsCategory"],
                    "feedItems": [{
                        "title": "Tamilnadu",
                        "description": "tn desc"
                    }, {
                        "title": "Andra",
                        "description": "AP desc"
                    }]
                }
            ];
            let action = { "type": DISPLAY_ALL_FEEDS, "sources": sources };
            let expectedfeeds = {
                "feeds": [{
                    "content": "feed1 description",
                    "type":"description",
                    "feedType": "rss",
                    "name": "sportsCategory",
                    "tags": []
                }, {
                    "content": "feed2 description",
                    "type":"description",
                    "feedType": "rss",
                    "name": "sportsCategory",
                    "tags": []
                }, {
                    "content": "tn desc",
                    "type":"description",
                    "feedType": "rss",
                    "name": "politicsCategory",
                    "tags": []
                }, {
                    "content": "AP desc",
                    "type":"description",
                    "feedType": "rss",
                    "name": "politicsCategory",
                    "tags": []
                }]
            };
            expect(expectedfeeds).to.deep.equal(allFeeds(undefined, action));
        });

    });
});
