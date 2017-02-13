import {
    bookmarkArticle,
    bookmarkedArticleAction,
    displayWebArticle,
    addToCollection,
    BOOKMARKED_ARTICLE,
    WEB_ARTICLE_RECEIVED,
    WEB_ARTICLE_REQUESTED,
    ADD_TO_COLLECTION_STATUS,
    ADD_ARTICLE_TO_COLLECTION
} from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import { NEWS_BOARD_CURRENT_TAB, PAGINATED_FETCHED_FEEDS } from "./../../../src/js/newsboard/actions/DisplayFeedActions";
import sinon from "sinon";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import { expect } from "chai";
import Toast from "./../../../src/js/utils/custom_templates/Toast";

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

            let ajaxClientInstance = AjaxClient.instance("/bookmarks");
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
            sandbox.useFakeTimers();
        });

        afterEach("displayWebArticle", () => {
            sandbox.restore();
        });

        it("should dispatch article Received action after successful fetching article", (done) => {
            let article = "Some Article";
            let response = { "markup": article };
            let ajaxClientInstance = AjaxClient.instance("/article");
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClientInstance);
            let getMock = sandbox.mock(ajaxClientInstance).expects("get")
                .withArgs({ "url": "some url" }).returns(Promise.resolve(response));

            let store = mockStore({}, [{ "type": WEB_ARTICLE_REQUESTED }, {
                "type": WEB_ARTICLE_RECEIVED,
                "article": article,
                "isHTML": true
            }], done);
            store.dispatch(displayWebArticle({ "link": "some url" }));

            getMock.verify();
        });

        /* TODO: not able to fail the test with reason, when toastMock fails */ //eslint-disable-line
        it("should dispatch fetchingArticleFailed action ", (done) => {
            let ajaxClientInstance = AjaxClient.instance("/article");
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClientInstance);
            let getMock = sandbox.mock(ajaxClientInstance).expects("get").returns(Promise.reject("some"));
            let toastMock = sandbox.mock(Toast).expects("show")
                .withArgs("Unable to get the article contents");

            let store = mockStore({}, [{ "type": WEB_ARTICLE_REQUESTED }, {
                "type": WEB_ARTICLE_RECEIVED,
                "article": "some desc",
                "isHTML": false
            }], done, () => {
                toastMock.verify();
            });
            store.dispatch(displayWebArticle({ "link": "something", "description": "some desc" }));
            getMock.verify();
        });
    });

    describe("addToCollection", () => {
        let sandbox = null, collection = null, docId = null, article = null, body = null, ajaxClientInstance = null,
            headers = null, response = null;

        beforeEach("addToCollection", () => {
            sandbox = sinon.sandbox.create();
            collection = "collectionName";
            docId = "article id";
            article = { "id": docId, "sourceType": "facebook" };
            body = { "collection": collection, "docId": docId, "isNewCollection": false };
            ajaxClientInstance = AjaxClient.instance("/collection", true);
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            sandbox.mock(AjaxClient).expects("instance")
                .returns(ajaxClientInstance);
            response = { "ok": true };
        });

        afterEach("addToCollection", () => {
            sandbox.restore();
        });

        it("should dispatch newsBoardTabSwitch, handleMessage, addArticleToCollection when response is success and there is docId", (done) => {
            let store = mockStore({}, [{ "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "Successfully added feed to collection" } },
                { "type": NEWS_BOARD_CURRENT_TAB, "currentTab": "facebook" },
                { "type": ADD_ARTICLE_TO_COLLECTION,
                    "addArticleToCollection": { "id": "", "sourceType": "" } },
                { "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "" } }], done);

            let ajaxPutMock = sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            store.dispatch(addToCollection(collection, article));
            ajaxPutMock.verify();
        });

        it("should dispatch addArticleToCollection and handleMessage with failed message on bad request", (done) => {
            response = { "error": "unexpected response" };
            let store = mockStore({}, [{ "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "Failed add feed to collection" } },
                { "type": ADD_ARTICLE_TO_COLLECTION,
                    "addArticleToCollection": { "id": "", "sourceType": "" } },
                { "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "" } }], done);

            let ajaxPutMock = sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            store.dispatch(addToCollection(collection, article));
            ajaxPutMock.verify();
        });

        it("should dispatch handleMessage, paginatedFeeds, addArticleToCollection on success reponse and there is no doc id", (done) => {
            body = { "collection": collection, "docId": "", "isNewCollection": false };
            let store = mockStore({}, [
                { "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "Successfully added collection" } },
                { "type": PAGINATED_FETCHED_FEEDS, "feeds": [{ "collection": collection, "_id": collection }] },
                { "type": ADD_ARTICLE_TO_COLLECTION,
                    "addArticleToCollection": { "id": "", "sourceType": "" } },
                { "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "" } }
            ], done);

            let ajaxPutMock = sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            store.dispatch(addToCollection(collection, { "id": "", "sourceType": "" }));
            ajaxPutMock.verify();
        });

        it("should dispatch handleMessage, addArticleToCollection when there is message in response", (done) => {
            response = { "message": "Collection already exists with this name" };
            let store = mockStore({}, [
                { "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "Collection already exists with this name" } },
                { "type": NEWS_BOARD_CURRENT_TAB, "currentTab": "facebook" },
                { "type": ADD_ARTICLE_TO_COLLECTION,
                    "addArticleToCollection": { "id": "", "sourceType": "" } },
                { "type": ADD_TO_COLLECTION_STATUS, "status": { "message": "" } }
            ], done);

            let ajaxPutMock = sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            store.dispatch(addToCollection(collection, article));
            ajaxPutMock.verify();
        });
    });
});
