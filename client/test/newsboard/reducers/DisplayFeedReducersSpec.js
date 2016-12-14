import { fetchedFeeds } from "../../../src/js/newsboard/reducers/DisplayFeedReducers";
import { expect } from "chai";

describe("DisplayFeedReducer", () => {
    describe("Fetched Feeds", () => {
        it("should return an empty list when fetched feeds called without any action type", () => {
            expect([]).to.deep.equal(fetchedFeeds());
        });

        it("should return feeds when action type is display fetched feeds", () => {
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
});
