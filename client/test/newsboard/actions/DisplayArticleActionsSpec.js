import { bookmarkArticle, bookmarkedArticleAction, displayWebArticle,
    BOOKMARKED_ARTICLE, WEB_ARTICLE_RECEIVED, FETCHING_ARTICLE_FAILED,
    WEB_ARTICLE_REQUESTED
} from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import sinon from "sinon";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import { expect } from "chai";

describe("DisplayArticleActions", () => {

    describe("bookmarkedArticleAction", () => {
        it("should dispatch articleId and bookmarkstatus", () => {
            const expected = { "type": BOOKMARKED_ARTICLE, "articleId": "id", "bookmarkStatus": true };
            expect(bookmarkedArticleAction("id", true)).to.deep.equals(expected);
        });
    });

    describe("bookmarkArticle", () => {
        let sandbox = sinon.sandbox.create();

        afterEach("bookmarkArticle", () => {
            sandbox.restore();
        });

        it("should dispatch bookmarked Article action after successfully bookmarking the article", (done) => {
            let article = {
                "_id": "id",
                "title": "title"
            };
            let docId = "id";
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };

            let ajaxClientInstance = AjaxClient.instance("/bookmarks", false);
            sandbox.mock(AjaxClient).expects("instance")
                .returns(ajaxClientInstance);
            let postMock = sandbox.mock(ajaxClientInstance).expects("post")
                .withArgs(headers, { "docId": docId }).returns(Promise.resolve({ "ok": true }));

            let store = mockStore({}, [{ "type": "BOOKMARKED_ARTICLE", "articleId": article._id, "bookmarkStatus": true }], done);
            store.dispatch(bookmarkArticle(article));

            postMock.verify();
        });
    });

    describe("displayWebArticle", () => {
        let sandbox = null;

        beforeEach("displayWebArticle", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("displayWebArticle", () => {
            sandbox.restore();
        });

        it("should dispatch article Received action after successful fetching article", (done) => {
            let article = "Some Article";
            let response = { "markup": article };
            let ajaxClientInstance = AjaxClient.instance("/article", false);
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClientInstance);
            let postMock = sandbox.mock(ajaxClientInstance).expects("get").returns(Promise.resolve(response));

            let store = mockStore({}, [{ "type": WEB_ARTICLE_REQUESTED }, { "type": WEB_ARTICLE_RECEIVED, "article": article }], done);
            store.dispatch(displayWebArticle("some url"));

            postMock.verify();
        });

        it("should dispatch fetchingArticleFailed action ", async () => {
            let ajaxClientInstance = AjaxClient.instance("/article", false);
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClientInstance);
            let postMock = sandbox.mock(ajaxClientInstance).expects("get").returns(Promise.reject("some"));

            let store = mockStore({}, [{ "type": WEB_ARTICLE_REQUESTED }, { "type": FETCHING_ARTICLE_FAILED }]);
            store.dispatch(displayWebArticle("some url"));

            postMock.verify();
        });
    });
});
