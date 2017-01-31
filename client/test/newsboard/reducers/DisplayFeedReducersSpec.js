import {
    fetchedFeeds,
    newsBoardCurrentSourceTab,
    selectedArticle,
    fetchingWebArticle
} from "../../../src/js/newsboard/reducers/DisplayFeedReducers";
import { NEWS_BOARD_CURRENT_TAB, DISPLAY_ARTICLE } from "./../../../src/js/newsboard/actions/DisplayFeedActions";
import { BOOKMARKED_ARTICLE, WEB_ARTICLE_REQUESTED, WEB_ARTICLE_RECEIVED } from "./../../../src/js/newsboard/actions/DisplayArticleActions";
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

        it("should return feeds when action type is paginated fetched feeds", () => {
            let state = [{
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

            let modifiedState = [{
                "_id": "123",
                "sourceType": "rss",
                "docType": "feed",
                "sourceUrl": "http://www.test.com/rss",
                "bookmark": true
            }, {
                "_id": "1234",
                "sourceType": "rss",
                "docType": "feed",
                "sourceUrl": "http://www.test3.com/rss"
            }];

            let action = { "type": BOOKMARKED_ARTICLE, "articleId": "123", "bookmarkStatus": true };
            expect(fetchedFeeds(state, action)).to.deep.equal(modifiedState);
        });
    });

    describe("NewsBoard Current Source Tab", () => {

        it("should return twitter as current tab when action type is newsboard current tab with tab as twitter", () => {
            let action = { "type": NEWS_BOARD_CURRENT_TAB, "currentTab": "twitter" };
            expect(newsBoardCurrentSourceTab([], action)).to.deep.equal("twitter");
        });

        it("should return web as current tab when newsBoardCurrentSourceTab called without any action type", () => {
            expect(newsBoardCurrentSourceTab()).to.deep.equal("trending");
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

        it("should update the bookmark status when it receives BOOKMARKED_ARTICLE", () => {
            const action = { "type": BOOKMARKED_ARTICLE, "bookmarkStatus": true };
            const bookmarkedArticle = {
                "_id": "id", "title": "title", "bookmark": true
            };
            expect(selectedArticle({ "_id": "id", "title": "title" }, action)).to.deep.equals(bookmarkedArticle);
        });

        it("should clear description when WEB_ARTICLE_REQUESTED is dispatched", () => {
            const action = { "type": WEB_ARTICLE_REQUESTED, "desc": "" };
            expect(selectedArticle({}, action)).to.deep.equals({ "desc": "" });
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
});
