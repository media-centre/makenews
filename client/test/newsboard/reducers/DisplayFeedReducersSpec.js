import { fetchedFeeds, newsBoardCurrentSourceTab } from "../../../src/js/newsboard/reducers/DisplayFeedReducers";
import { expect } from "chai";

describe("DisplayFeedReducer", () => {
    describe("Fetched Feeds", () => {
        it("should return an empty list when fetched feeds called without any action type", () => {
            expect(fetchedFeeds()).to.deep.equal([]);
        });

        it("should return feeds when action type is paginated fetched feeds", () => {
            let feeds = [{
                "_id": "123",
                "sourceType": "rss",
                "docType": "feed",
                "sourceUrl": "http://www.test.com/rss"
            }, {
                "_id": "1234",
                "sourceType": "rss",
                "docType": "feed",
                "sourceUrl": "http://www.test3.com/rss"
            }];
            let action = { "type": "PAGINATED_FETCHED_FEEDS", feeds };
            expect(fetchedFeeds([], action)).to.deep.equal(feeds);
        });
    });
    describe("NewsBoard Current Source Tab", () => {

        it("should return twitter as current tab when action type is newsboard current tab with tab as twitter", () => {
            let action = { "type": "NEWSBOARD_CURRENT_TAB", "currentTab": "twitter" };
            expect(newsBoardCurrentSourceTab([], action)).to.deep.equal("twitter");
        });

        it("should return web as current tab when newsBoardCurrentSourceTab called without any action type", () => {
            expect(newsBoardCurrentSourceTab()).to.deep.equal("web");
        });
    });
});
