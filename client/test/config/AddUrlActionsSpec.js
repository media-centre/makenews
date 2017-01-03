import { addRssUrl, invalidRssUrl, RSS_ADD_URL_STATUS } from "./../../src/js/config/actions/AddUrlActions";
import AjaxClient from "./../../src/js/utils/AjaxClient";
import mockStore from "./../helper/ActionHelper";
import { assert } from "chai";
import sinon from "sinon";

describe("AddUrl Actions", () => {
    let message = null, url = null;
    let ajaxClientInstance = null, ajaxClientMock = null, postMock = null;
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    beforeEach("AddUrl Actions", () => {
        ajaxClientInstance = AjaxClient.instance("/add-url", true);
        ajaxClientMock = sinon.mock(AjaxClient);
        ajaxClientMock.expects("instance").returns(ajaxClientInstance);
        postMock = sinon.mock(ajaxClientInstance);
    });

    afterEach("AddUrl Actions", () => {
        ajaxClientMock.restore();
        postMock.restore();
    });

    it("should return successful message", (done) => {
        let name = "NewsClick Economy";
        url = "http://newsclick.in/taxonomy/term/economy/feed";
        message = "Added successfully";
        let added = true;

        postMock.expects("post").withArgs(headers, { url })
            .returns(Promise.resolve({ url, name }));

        let action = [{ "type": "WEB_ADD_SOURCE", "sources": [{ name, url }] },
            { "type": RSS_ADD_URL_STATUS, "status": { message, added } }];
        let store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, () => {
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });

    it("should return already exist message if url is exist in database", (done) => {
        message = "URL already exist";
        url = "http://newsclick.in/taxonomy/term/economy/feed";
        let added = false;
        postMock.expects("post").withArgs(headers, { "url": url })
            .returns(Promise.reject({ message }));

        let action = [{ "type": RSS_ADD_URL_STATUS, "status": { message, added } }];
        let store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, () => {
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });

    it("should return invalid message if url is invalid", (done) => {
        message = "Invalid RSS URL. Please check the URL";
        url = "http://x.com";
        let added = false;

        postMock.expects("post").withArgs(headers, { "url": url }).returns(Promise.reject({ message }));

        let action = [{ "type": RSS_ADD_URL_STATUS, "status": { message, added } }];
        let store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, () => {
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });

    describe("invalid RssUrl", () => {
        it("should return message", () => {
            message = "Please enter proper url.";
            let added = false;
            let action = { "type": RSS_ADD_URL_STATUS, "status": { message, added } };

            assert.deepEqual(invalidRssUrl(), action);
        });
    });
});
