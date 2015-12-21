/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

"use strict";
import { parkedFeeds } from "../../../src/js/park/reducers/ParkReducer.js";
import { DISPLAY_PARKED_FEEDS } from "../../../src/js/park/actions/ParkActions.js";
import { assert } from "chai";

describe("Park Reducer", () => {
    describe("parkedFeeds", () => {
        it("default state should return empty list", () => {
            assert.deepEqual({ "parkedItems": [] }, parkedFeeds());
        });

        it("should return given feeds", () => {
            let feeds = [
                {
                    "content": "www.facebookpolitics1.com",
                    "feedType": "rss",
                    "name": "Sports",
                    "status": "park",
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
                    "status": "park",
                    "tags": [""],
                    "title": "tn",
                    "type": "description"
                }
            ];
            let action = { "type": DISPLAY_PARKED_FEEDS, "parkedItems": feeds };

            assert.deepEqual({ "parkedItems": feeds }, parkedFeeds(undefined, action));
        });
    });
});
