import { addRssUrl, invalidRssUrl, MESSAGE } from "./../../src/js/config/actions/AddUrlActions";
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
        message = "URL added Successfully";
        url = "http://newsclick.in/taxonomy/term/economy/feed";

        postMock.expects("post").withArgs(headers, { "url": url }).returns(Promise.resolve(message));

        let action = [{ "type": MESSAGE, message }];
        let store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, (result) => {
            assert.deepEqual(result, message);
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });

    it("should return already exist message if url is exist in databse", (done) => {
        message = "URL already exist";
        url = "http://newsclick.in/taxonomy/term/economy/feed";

        postMock.expects("post").withArgs(headers, { "url": url }).returns(Promise.resolve(message));

        let action = [{ "type": MESSAGE, message }];
        let store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, (result) => {
            assert.deepEqual(result, message);
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });

    it("should return invalid message if url is invalid", (done) => {
        message = "Invalid RSS URL. Please check the URL";
        url = "http://x.com";

        postMock.expects("post").withArgs(headers, { "url": url }).returns(Promise.reject(message));

        let action = [{ "type": MESSAGE, message }];
        let store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, (result) => {
            assert.deepEqual(result, message);
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });

    describe("invalid RssUrl", () => {
        it("should return message", () => {
            message = "Please enter proper url.";
            let action = [{ "type": MESSAGE, message }];

            let store = mockStore([], action);

            store.dispatch(invalidRssUrl(url, (result) => {
                assert.deepEqual(result, message);
            }));
        });
    });
});
