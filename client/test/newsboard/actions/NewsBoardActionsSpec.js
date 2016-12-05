import { displayFetchedFeeds, displayAllConfiguredFeeds, DISPLAY_FETCHED_FEEDS } from "../../../src/js/newsboard/actions/NewsBoardActions";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import { assert } from "chai";
import sinon from "sinon";

describe.only("NewsBoardActions", () => {
    describe("displayFetchedFeeds", () => {
        it("should return type DISPLAY_FETCHED_FEEDS action ", () => {
            let feeds = [
                { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed" },
                { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed" }
            ];
            let displayFetchedFeedAction = { "type": DISPLAY_FETCHED_FEEDS, "feeds": feeds };
            assert.deepEqual(displayFetchedFeeds(feeds), displayFetchedFeedAction);
        });
    });

    describe("displayFetchedFeedAction", () => {
        it("dispatch displayFetchedFeedAction action with feeds on successful fetch", async () => {
            let feeds = [
                { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed" },
                { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed" }
            ];
            let ajaxClientInstance = AjaxClient.instance("/fetch-all-feeds", true);
            let ajaxClientMock = sinon.mock(AjaxClient);
            ajaxClientMock.expects("instance").returns(ajaxClientInstance);
            let postMock = sinon.mock(ajaxClientInstance);
            postMock.expects("post").returns(Promise.resolve(feeds));
            let store = mockStore([], [{ "type": DISPLAY_FETCHED_FEEDS, "feeds": feeds }]);
            store.dispatch(displayAllConfiguredFeeds());
            ajaxClientMock.verify();
            postMock.verify();
        });
    });
});
