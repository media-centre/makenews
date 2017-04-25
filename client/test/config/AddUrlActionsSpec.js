import { addRssUrl, addFacebookPage, addTwitterHandle, ADD_URL_STATUS } from "./../../src/js/config/actions/AddUrlActions";
import * as FBAction from "./../../src/js/config/actions/FacebookConfigureActions";
import * as TwitterAction from "./../../src/js/config/actions/TwitterConfigureActions";
import { WEB_ADD_SOURCE } from "./../../src/js/config/actions/WebConfigureActions";
import AjaxClient from "./../../src/js/utils/AjaxClient";
import mockStore from "./../helper/ActionHelper";
import sinon from "sinon";
import Toast from "./../../src/js/utils/custom_templates/Toast";
import Locale from "./../../src/js/utils/Locale";

describe("AddUrl Actions", () => {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    let showAddurlPopup = true;
    const sandbox = sinon.sandbox.create();
    beforeEach("AddUrl Actions", () => {
        const configurePage = {
            "header": {},
            "addCustomUrl": {
                "name": "Add custom url",
                "messages": {
                    "validateUrl": "Please enter proper url",
                    "success": "Added Successfully"
                }
            },
            "addAll": "Add All"
        };

        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "configurePage": configurePage
            }
        });
    });

    afterEach("AddUrl Actions", () => {
        sandbox.restore();
    });

    describe("AddRssUrl", () => {
        let message = null, url = null;
        let ajaxClientInstance = null, ajaxClientMock = null, postMock = null;

        beforeEach("AddRssUrl", () => {
            ajaxClientInstance = AjaxClient.instance("/add-url", true);
            ajaxClientMock = sandbox.mock(AjaxClient);
            ajaxClientMock.expects("instance").returns(ajaxClientInstance);
            postMock = sandbox.mock(ajaxClientInstance);
        });

        afterEach("AddRssUrl", () => {
            sandbox.restore();
        });

        it("should return successful message", (done) => {
            const name = "NewsClick Economy";
            url = "http://newsclick.in/taxonomy/term/economy/feed";

            postMock.expects("post").withArgs(headers, { url })
                .returns(Promise.resolve({ url, name }));

            const action = [
                { "type": WEB_ADD_SOURCE, "sources": [{ name, url }] },
                { "type": ADD_URL_STATUS, "status": showAddurlPopup }];
            const store = mockStore([], action, done);
            store.dispatch(addRssUrl(url, () => {
                ajaxClientMock.verify();
                postMock.verify();
            }));
        });

        it("should return already exist message if url is exist in database", (done) => {
            url = "http://newsclick.in/taxonomy/term/economy/feed";
            postMock.expects("post").withArgs(headers, { "url": url })
                .returns(Promise.reject({ message }));

            const action = [{ "type": ADD_URL_STATUS, "status": showAddurlPopup }];
            const store = mockStore([], action, done);
            store.dispatch(addRssUrl(url, () => {
                ajaxClientMock.verify();
                postMock.verify();
            }));
        });

        it("should return invalid message if url is invalid", (done) => {
            url = "http://x.com";
            postMock.expects("post").withArgs(headers, { "url": url }).returns(Promise.reject({ message }));

            const action = [{ "type": ADD_URL_STATUS, "status": showAddurlPopup }];
            const store = mockStore([], action, done);
            store.dispatch(addRssUrl(url, () => {
                ajaxClientMock.verify();
                postMock.verify();
            }));
        });
    });

    describe("AddFacebookPage", () => {
        let ajaxClientInstance = null;

        afterEach("AddFacebookPage", () => {
            sandbox.restore();
        });

        it("should return successful message", (done) => {
            showAddurlPopup = false;
            const pageUrl = "https://www.facebook.com/test";
            ajaxClientInstance = AjaxClient.instance("/configure-facebook-page");
            sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
            sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, { pageUrl }).returns(Promise.resolve({ "id": 1, "name": "page name" }));
            sandbox.stub(FBAction, "fetchFacebookSources").returns({ "type": FBAction.FACEBOOK_GOT_SOURCES });
            const action = [
                { "type": FBAction.FACEBOOK_ADD_PAGE, "sources": [{ "id": 1, "name": "page name" }] },
                { "type": FBAction.FACEBOOK_GOT_SOURCES },
                { "type": ADD_URL_STATUS, "status": showAddurlPopup }];
            const store = mockStore([], action, done);
            store.dispatch(addFacebookPage(pageUrl));
        });

        it("should should show toast message if an error occurs while adding the page", (done) => {
            const pageUrl = "test";
            showAddurlPopup = true;
            ajaxClientInstance = AjaxClient.instance("/configure-facebook-page");
            sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("unable to add the url");
            sandbox.mock(ajaxClientInstance).expects("put").withExactArgs(headers, { pageUrl })
                .returns(Promise.reject({ "message": "unable to add the url" }));
            const action = [{ "type": ADD_URL_STATUS, "status": showAddurlPopup }];
            const store = mockStore([], action, done);

            store.dispatch(addFacebookPage(pageUrl, () => {
                toastMock.verify();
            }));
        });
    });

    describe("AddTwitterHandle", () => {
        let ajaxClientInstance = null;

        afterEach("AddTwitterHandle", () => {
            sandbox.restore();
        });

        it("should return successful message", (done) => {
            const twitterHandle = "@test";
            showAddurlPopup = false;
            ajaxClientInstance = AjaxClient.instance("/configure-twitter-handle");
            sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
            sandbox.mock(ajaxClientInstance).expects("put")
                .withExactArgs(headers, { twitterHandle }).returns(Promise.resolve({ "id": 1, "name": "handle name" }));
            sandbox.stub(TwitterAction, "fetchTwitterSources").returns({ "type": TwitterAction.TWITTER_GOT_SOURCE_RESULTS });

            const action = [
                { "type": TwitterAction.TWITTER_ADD_SOURCE, "sources": [{ "id": 1, "name": "handle name" }] },
                { "type": TwitterAction.TWITTER_GOT_SOURCE_RESULTS },
                { "type": ADD_URL_STATUS, "status": showAddurlPopup }];
            const store = mockStore([], action, done);
            store.dispatch(addTwitterHandle(twitterHandle));
        });

        it("should should show toast message if an error occurs while adding the handle", (done) => {
            showAddurlPopup = true;
            const twitterHandle = "blaw";
            ajaxClientInstance = AjaxClient.instance("/configure-twitter-handle");
            sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
            const toastMock = sandbox.mock(Toast).expects("show").withExactArgs("unable to add the url");
            sandbox.mock(ajaxClientInstance).expects("put").withExactArgs(headers, { twitterHandle })
                .returns(Promise.reject({ "message": "unable to add the url" }));
            const action = [{ "type": ADD_URL_STATUS, "status": showAddurlPopup }];
            const store = mockStore([], action, done);

            store.dispatch(addTwitterHandle(twitterHandle, () => {
                toastMock.verify();
            }));
        });
    });
});
