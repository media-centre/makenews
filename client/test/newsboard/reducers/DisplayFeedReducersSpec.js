import {
    fetchedFeeds,
    newsBoardCurrentSourceTab,
    selectedArticle,
    fetchingWebArticle,
    fetchingFeeds
} from "../../../src/js/newsboard/reducers/DisplayFeedReducers";
import { DELETE_COLLECTION, RENAMED_COLLECTION } from "../../../src/js/newsboard/actions/DisplayCollectionActions";
import {
    NEWS_BOARD_CURRENT_TAB,
    DISPLAY_ARTICLE,
    FETCHING_FEEDS,
    SEARCHED_FEEDS,
    CLEAR_ARTICLE
} from "./../../../src/js/newsboard/actions/DisplayFeedActions";
import {
    UPDATE_BOOKMARK_STATUS,
    WEB_ARTICLE_REQUESTED,
    WEB_ARTICLE_RECEIVED,
    UNBOOKMARK_THE_ARTICLE
} from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import { expect } from "chai";

describe("DisplayFeedReducer", () => {
    let feeds = null;

    describe("Fetched Feeds", () => {
        beforeEach("Fetched Feeds", () => {
            feeds = [{
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
        });

        it("should return an empty list when fetched feeds called without any action type", () => {
            expect(fetchedFeeds()).to.deep.equal([]);
        });

        it("should return feeds when action type is paginated fetched feeds", () => {
            const action = { "type": "PAGINATED_FETCHED_FEEDS", feeds };
            expect(fetchedFeeds([], action)).to.deep.equal(feeds);
        });

        it("should return feeds when action type is bookmarked_article feeds", () => {
            const state = feeds;
            const modifiedState = feeds;

            const action = { "type": UPDATE_BOOKMARK_STATUS, "articleId": "123", "bookmarkStatus": true };
            expect(fetchedFeeds(state, action)).to.deep.equal(modifiedState);
        });

        it("should delete the feed when it is un bookmarked", () => {
            const state = feeds;
            const modifiedFeeds = [{
                "_id": "1234",
                "sourceType": "rss",
                "docType": "feed",
                "sourceUrl": "http://www.test3.com/rss"
            }];
            const action = { "type": UNBOOKMARK_THE_ARTICLE, "articleId": "123" };
            expect(fetchedFeeds(state, action)).to.deep.equal(modifiedFeeds);
        });

        it("should return feeds when type searched feeds", () => {
            const action = { "type": SEARCHED_FEEDS, feeds };
            expect(fetchedFeeds([], action)).to.deep.equal(feeds);
        });

        it("should return updated collections when action type is DELETE_COLLECTION", () => {
            const state = [{
                "_id": "123",
                "collectionName": "collection1",
                "docType": "collection"
            }, {
                "_id": "1234",
                "collectionName": "colletction2",
                "docType": "collection"
            }];
            const updatedCollection = [{
                "_id": "123",
                "collectionName": "collection1",
                "docType": "collection"
            }];
            const action = { "type": DELETE_COLLECTION, "collection": "1234" };
            expect(fetchedFeeds(state, action)).to.deep.equal(updatedCollection);
        });

        it("should return feeds when type searched feeds", () => {
            const action = { "type": SEARCHED_FEEDS, feeds };
            expect(fetchedFeeds([], action)).to.deep.equal(feeds);
        });

        it("should return updated collections when action type is DELETE_COLLECTION", () => {
            const state = [{
                "_id": "123",
                "collectionName": "collection1",
                "docType": "collection"
            }, {
                "_id": "1234",
                "collectionName": "colletction2",
                "docType": "collection"
            }];
            const updatedCollection = [{
                "_id": "123",
                "collectionName": "collection1",
                "docType": "collection"
            }];
            const action = { "type": DELETE_COLLECTION, "collection": "1234" };
            expect(fetchedFeeds(state, action)).to.deep.equal(updatedCollection);
        });

        it("should change the collection name when the RENAMED_COLLECTION action happens", () => {
            const state = [{ "_id": 1, "collection": "title" }, { "_id": 2, "collection": "title2" }];
            const expectedState = [{ "_id": 1, "collection": "new title" }, { "_id": 2, "collection": "title2" }];

            const action = { "type": RENAMED_COLLECTION, "collectionId": 1, "newCollectionName": "new title" };

            expect(fetchedFeeds(state, action)).to.deep.equal(expectedState);
        });
    });

    describe("NewsBoard Current Source Tab", () => {

        it("should return twitter as current tab when action type is newsboard current tab with tab as twitter", () => {
            const action = { "type": NEWS_BOARD_CURRENT_TAB, "currentTab": "twitter" };
            expect(newsBoardCurrentSourceTab([], action)).to.deep.equal("twitter");
        });

        it("should return web as current tab when newsBoardCurrentSourceTab called without any action type", () => {
            expect(newsBoardCurrentSourceTab()).to.deep.equal("web");
        });
    });

    describe("selectedArticle", () => {
        it("should return empty object by default", () => {
            expect(selectedArticle()).to.deep.equals({});
        });

        it("should return article when DISPLAY_ARTICLE is dispatched", () => {
            const action = { "type": DISPLAY_ARTICLE, "article": { "_id": "id", "title": "title" } };
            expect(selectedArticle({}, action)).to.deep.equals(action.article);
        });

        it("should update the bookmark status when it receives UPDATE_BOOKMARK_STATUS", () => {
            const action = { "type": UPDATE_BOOKMARK_STATUS, "bookmarkStatus": true };
            const bookmarkedArticle = {
                "_id": "id", "title": "title", "bookmark": true
            };
            expect(selectedArticle({ "_id": "id", "title": "title" }, action)).to.deep.equals(bookmarkedArticle);
        });

        it("should clear description when WEB_ARTICLE_REQUESTED is dispatched", () => {
            const action = { "type": WEB_ARTICLE_REQUESTED, "desc": "" };
            expect(selectedArticle({}, action)).to.deep.equals({ "desc": "" });
        });

        it("should clear article", () => {
            const action = { "type": CLEAR_ARTICLE };
            expect(selectedArticle({}, action)).to.deep.equals({});
        });
    });

    describe("fetchingWebArticle", () => {
        it("should return true when it is fetching the article", () => {
            const action = { "type": WEB_ARTICLE_REQUESTED };
            expect(fetchingWebArticle(false, action)).to.be.true; // eslint-disable-line no-unused-expressions
        });

        it("should return false when article is received", () => {
            const action = { "type": WEB_ARTICLE_RECEIVED };
            expect(fetchingWebArticle(false, action)).to.be.false; // eslint-disable-line no-unused-expressions
        });

        it("should return false as default", () => {
            expect(fetchingWebArticle(false, {})).to.be.false; // eslint-disable-line no-unused-expressions
        });
    });

    describe("fetchingFeeds", () => {

        it("should return default state on default", () => {
            expect(fetchingFeeds()).to.be.false; // eslint-disable-line no-unused-expressions
        });

        it("should return action state", () => {
            const action = { "type": FETCHING_FEEDS, "isFetching": true };
            expect(fetchingFeeds(false, action)).to.be.true; // eslint-disable-line no-unused-expressions
        });
    });
});
