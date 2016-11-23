/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

import { parkedFeeds } from "../../../src/js/park/reducers/ParkReducer";
import { DISPLAY_PARKED_FEEDS } from "../../../src/js/park/actions/ParkActions";
import { assert } from "chai";
import sinon from "sinon";
import Locale from "../../../src/js/utils/Locale";

describe("Park Reducer", () => {
    describe("parkedFeeds", () => {
        let sandbox = null;
        beforeEach("", () => {
            sandbox = sinon.sandbox.create();
            let locale = sandbox.stub(Locale, "applicationStrings");
            locale.returns({ "messages": {
                "parkPage": { }
            } });
        });

        afterEach("", () => {
            sandbox.restore();
        });

        it("default state should return empty list", () => {
            assert.deepEqual({ "messages": {} }, parkedFeeds());
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

            assert.deepEqual({ "messages": { }, "parkedItems": feeds }, parkedFeeds(undefined, action));
        });
    });
});
