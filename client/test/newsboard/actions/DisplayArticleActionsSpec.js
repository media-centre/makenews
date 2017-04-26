import {
    bookmarkArticle,
    updateBookmarkStatus,
    displayWebArticle,
    addToCollection,
    addArticleToCollection,
    UPDATE_BOOKMARK_STATUS,
    WEB_ARTICLE_RECEIVED,
    WEB_ARTICLE_REQUESTED,
    ADD_ARTICLE_TO_COLLECTION,
    UNBOOKMARK_THE_ARTICLE
} from "./../../../src/js/newsboard/actions/DisplayArticleActions";
import { NEWS_BOARD_CURRENT_TAB, PAGINATED_FETCHED_FEEDS } from "./../../../src/js/newsboard/actions/DisplayFeedActions";
import sinon from "sinon";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import { expect, assert } from "chai";
import Toast from "./../../../src/js/utils/custom_templates/Toast";
import { newsBoardSourceTypes } from "./../../../src/js/utils/Constants";
import Locale from "./../../../src/js/utils/Locale";

describe("DisplayArticleActions", () => {
    const sandbox = sinon.sandbox.create();

    beforeEach("DisplayArticleActions", () => {
        const newsBoardStrings = {
            "collection": {
                "defaultMessage": "No feeds added to collection",
                "allCollections": "All Collections",
                "selectCollection": "SELECT A COLLECTION",
                "createCollection": "Create new collection",
                "readMoreButton": "Read More",
                "backButton": "BACK",
                "saveButton": "SAVE",
                "confirmDelete": "Do you really want to delete collection",
                "deleteFaliure": "Could not able to delete collection",
                "addToCollectionMessages": {
                    "createCollectionSuccess": "Successfully created collection",
                    "createCollectionFailure": "Failed to create collection",
                    "addFeedToCollectionFailure": "Failed to add feed to collection",
                    "addFeedToCollectionSuccess": "Added to"
                }
            },
            "article": {
                "defaultMessage": "",
                "backButton": "back",
                "addToCollection": "Add to Collection",
                "bookmark": "Bookmark",
                "bookmarked": "Bookmarked",
                "readOriginalArticle": "Read the Original Article",
                "deleteFaliure": "Could not able to delete article",
                "fetchingArticleFailure": "Unable to get the article contents"
            },
            "bookmarkSuccess": "Successfully bookmarked"
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "newsBoard": newsBoardStrings
            }
        });
    });

    afterEach("DisplayArticleActions", () => {
        sandbox.restore();
    });

    describe("updateBookmarkStatus", () => {
        it("should dispatch articleId and bookmarkStatus", () => {
            const expected = { "type": UPDATE_BOOKMARK_STATUS, "articleId": "id", "bookmarkStatus": true };
            expect(updateBookmarkStatus("id", true)).to.deep.equals(expected);
        });
    });

    describe("bookmarkArticle", () => {
        const article = {
            "_id": "id",
            "title": "title"
        };
        const docId = "id";
        let postMock = null;

        beforeEach("bookmarkArticle", () => {
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };

            const ajaxClientInstance = AjaxClient.instance("/bookmarks");
            sandbox.mock(AjaxClient).expects("instance")
                .returns(ajaxClientInstance);

            postMock = sandbox.mock(ajaxClientInstance).expects("post")
                .withArgs(headers, { "docId": docId }).returns(Promise.resolve({ "ok": true }));
        });

        afterEach("bookmarkArticle", () => {
            sandbox.restore();
        });

        it("should dispatch bookmarked Article action after successfully bookmarking the article", (done) => {
            const toastSpy = sandbox.spy(Toast, "show");
            toastSpy.withArgs("Successfully bookmarked", "bookmark");
            const verify = () => {
                assert.isTrue(toastSpy.withArgs("Successfully bookmarked", "bookmark").calledOnce, "Toast Mock should be called");
            };

            const store = mockStore({}, [{ "type": UPDATE_BOOKMARK_STATUS, "articleId": article._id, "bookmarkStatus": true }], done, verify);
            store.dispatch(bookmarkArticle(article));

            postMock.verify();
        });

        it("should dispatch update bookmarked article on success response and the tab is bookmark", (done) => {
            const toastSpy = sandbox.spy(Toast, "show");
            toastSpy.withArgs("Successfully bookmarked", "bookmark");
            const verify = () => {
                assert.isTrue(toastSpy.withArgs("Successfully bookmarked", "bookmark").calledOnce, "Toast Mock should be called");
            };
            const currentTab = newsBoardSourceTypes.bookmark;
            const store = mockStore({}, [{ "type": UNBOOKMARK_THE_ARTICLE, "articleId": article._id }], done, verify);
            store.dispatch(bookmarkArticle(article, currentTab));

            postMock.verify();
        });
    });

    describe("displayWebArticle", () => {

        beforeEach("displayWebArticle", () => {
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
        let collection = null, docId = null, article = null, body = null, ajaxClientInstance = null,
            headers = null, response = null;

        beforeEach("addToCollection", () => {
            collection = "collectionName";
            docId = "article id";
            article = { "id": docId, "sourceType": "facebook", "sourceId": "177547780", "selectedTextDoc": {} };
            body = { "collection": collection, "docId": docId, "isNewCollection": false, "sourceId": "177547780", "selectedTextDoc": {} };
            ajaxClientInstance = AjaxClient.instance("/collection", true);
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            sandbox.mock(AjaxClient).expects("instance")
                .returns(ajaxClientInstance);
            response = { "ok": true, "_id": "1234" };
        });

        afterEach("addToCollection", () => {
            sandbox.restore();
        });

        it("should dispatch newsBoardTabSwitch, addArticleToCollection when response is success and there is docId", (done) => {
            const ajaxPutMock = sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            const store = mockStore({}, [
                { "type": NEWS_BOARD_CURRENT_TAB, "currentTab": "facebook" },
                { "type": ADD_ARTICLE_TO_COLLECTION,
                    "addArticleToCollection": { "id": "", "sourceType": "", "sourceId": "", "selectedTextDoc": {} } }], done);

            store.dispatch(addToCollection(collection, article));
            ajaxPutMock.verify();
        });

        it("should show toast message of unable to create collection if failed message on bad request", async () => {
            response = { "error": "unexpected response" };
            sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            const toastMock = sandbox.mock(Toast).expects("show")
                .withExactArgs("Failed to create collection");

            await addToCollection(collection, article, true)(() => {});

            toastMock.verify();
        });

        it("should show toast message of unable to add article if failed message on bad request", async () => {
            response = { "error": "unexpected response" };

            sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            const toastMock = sandbox.mock(Toast).expects("show")
                .withExactArgs("Failed to add feed to collection");

            await addToCollection(collection, article)(() => {});

            toastMock.verify();
        });

        it("should dispatch handleMessage, paginatedFeeds, addArticleToCollection on success response and there is no doc id", (done) => {
            body = { "collection": collection, "docId": "", "isNewCollection": true, "sourceId": "", "selectedTextDoc": {} };
            const store = mockStore({}, [
                { "type": PAGINATED_FETCHED_FEEDS, "feeds": [{ "collection": collection, "_id": "1234" }] },
                { "type": ADD_ARTICLE_TO_COLLECTION,
                    "addArticleToCollection": { "id": "", "sourceType": "", "sourceId": "", "selectedTextDoc": {} } }
            ], done);

            const ajaxPutMock = sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            store.dispatch(addToCollection(collection, { "id": "", "sourceType": "", "sourceId": "", "selectedTextDoc": {} }, true));
            ajaxPutMock.verify();
        });

        it("should dispatch handleMessage, addArticleToCollection when there is message in response", (done) => {
            response = { "message": "Collection already exists with this name" };
            const store = mockStore({}, [
                { "type": NEWS_BOARD_CURRENT_TAB, "currentTab": "facebook" },
                { "type": ADD_ARTICLE_TO_COLLECTION,
                    "addArticleToCollection": { "id": "", "sourceType": "", "sourceId": "", "selectedTextDoc": {} } }
            ], done);

            const ajaxPutMock = sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, body)
                .returns(response);

            store.dispatch(addToCollection(collection, article));
            ajaxPutMock.verify();
        });
    });

    describe("addArticleToCollection", () => {
        it("should dispatch addArticleToCollectionObject", () => {
            const selectedTextDoc = { "title": "title", "description": "description" };
            const expected = { "type": ADD_ARTICLE_TO_COLLECTION,
                "addArticleToCollection": { "id": "id", "sourceType": "web", "sourceId": "sourceId", selectedTextDoc } };

            expect(addArticleToCollection("id", "web", "sourceId", selectedTextDoc)).to.deep.equals(expected);
        });
    });
});
