/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

import { allFeeds } from "../../../src/js/surf/reducers/SurfReducer";
import Locale from "../../../src/js/utils/Locale";
import { DISPLAY_ALL_FEEDS, DISPLAY_EXISTING_FEEDS } from "../../../src/js/surf/actions/SurfActions";
import { expect } from "chai";
import sinon from "sinon";

describe("Surf Reducer", () => {
    let messages = { "fetchingFeeds": "Fetching feeds...", "noFeeds": "No feeds available" };
    before("Surf Reducer", () => {
        sinon.stub(Locale, "applicationStrings").returns({ "messages": { "surfPage": messages } });
    });

    after("Surf Reducer", () => {
        Locale.applicationStrings.restore();
    });


    describe("allFeeds", () => {
        it("default state should return empty list", () => {
            expect({ "messages": messages }).to.deep.equal(allFeeds());
        });

        it("should return given feeds", () => {
            let feeds = [
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
            ];
            let action = { "type": DISPLAY_ALL_FEEDS, "feeds": feeds, "refreshState": false, "progressPercentage": 0, "hasMoreFeeds": false, "lastIndex": 0 };

            expect({ "feeds": feeds, "messages": messages, "refreshState": false, "progressPercentage": 0, "hasMoreFeeds": false, "lastIndex": 0 }).to.deep.equal(allFeeds(undefined, action));
        });

        it("should return previous state feeds", () => {
            let feeds = [
                {
                    "content": "www.facebookpolitics1.com",
                    "feedType": "rss",
                    "name": "Sports",
                    "tags": [
                        "Dec 10 2015    14:27:37"
                    ],
                    "title": "tn",
                    "type": "description"
                }
            ];
            let prevState = { "feeds": feeds, "messages": messages, "refreshState": false, "progressPercentage": 0 };
            let action = { "type": DISPLAY_EXISTING_FEEDS, "feeds": [], "refreshState": true, "progressPercentage": 100 };

            expect({ "feeds": feeds, "messages": messages, "refreshState": true, "progressPercentage": 100 }).to.deep.equal(allFeeds(prevState, action));
        });
    });
});
