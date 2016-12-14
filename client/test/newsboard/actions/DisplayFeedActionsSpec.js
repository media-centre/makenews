import { paginatedFeeds, displayFeedsByPage, PAGINATED_FETCHED_FEEDS } from "../../../src/js/newsboard/actions/DisplayFeedActions";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import { assert } from "chai";
import sinon from "sinon";

describe.only("DisplayFeedActions", () => {
    describe("displayFetchedFeeds", () => {
        it("should return type DISPLAY_FETCHED_FEEDS action ", () => {
            let feeds = [
                { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed" },
                { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed" }
            ];
            let paginatedFeedsAction = { "type": PAGINATED_FETCHED_FEEDS, "feeds": feeds };
            assert.deepEqual(paginatedFeeds(feeds), paginatedFeedsAction);
        });
    });

    describe("displayFeedsByPage", () => {
        it("dispatch displayFetchedFeedAction action with feeds on successful fetch", (done) => {
            let defaultIndex = 0;
            let feeds = { "docs": [
                { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed" },
                { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed" }
            ] };
            let ajaxClientInstance = AjaxClient.instance("/fetch-all-feeds", true);
            let ajaxClientMock = sinon.mock(AjaxClient);
            ajaxClientMock.expects("instance").returns(ajaxClientInstance);
            let postMock = sinon.mock(ajaxClientInstance);
            postMock.expects("post").returns(Promise.resolve(feeds));
            let store = mockStore([], [{ "type": PAGINATED_FETCHED_FEEDS, "feeds": feeds.docs }], done);
            store.dispatch(displayFeedsByPage(defaultIndex, (result)=> {
                assert.deepEqual(result, { "docsLenght": 2, "hasMoreFeeds": false });
                ajaxClientMock.verify();
                postMock.verify();
            }));
        });

        it.only("dispatch displayFetchedFeedAction action with no feeds on successful fetch", (done) => {
            let feeds = { "docs": [] };
            let ajaxClientInstance = AjaxClient.instance("/fetch-all-feeds", true);
            let ajaxClientMock = sinon.mock(AjaxClient);
            ajaxClientMock.expects("instance").returns(ajaxClientInstance);
            let postMock = sinon.mock(ajaxClientInstance);
            postMock.expects("post").returns(Promise.resolve(feeds));
            let store = mockStore([], [{ "type": PAGINATED_FETCHED_FEEDS, "feeds": feeds.docs }], done);
            store.dispatch(displayFeedsByPage(0, (result)=> {
                assert.deepEqual(result, { "docsLenght": 0, "hasMoreFeeds": false });
                ajaxClientMock.verify();
                postMock.verify();
            }));
        });
    });
});
