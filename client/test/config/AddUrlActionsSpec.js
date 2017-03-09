import { addRssUrl, RSS_ADD_URL_STATUS } from "./../../src/js/config/actions/AddUrlActions";
import AjaxClient from "./../../src/js/utils/AjaxClient";
import mockStore from "./../helper/ActionHelper";
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
        const name = "NewsClick Economy";
        url = "http://newsclick.in/taxonomy/term/economy/feed";
        const added = true;

        postMock.expects("post").withArgs(headers, { url })
            .returns(Promise.resolve({ url, name }));

        const action = [{ "type": "WEB_ADD_SOURCE", "sources": [{ name, url }] },
            { "type": RSS_ADD_URL_STATUS, "status": { added } }];
        const store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, () => {
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });

    it("should return already exist message if url is exist in database", (done) => {
        url = "http://newsclick.in/taxonomy/term/economy/feed";
        const added = false;
        postMock.expects("post").withArgs(headers, { "url": url })
            .returns(Promise.reject({ message }));

        const action = [{ "type": RSS_ADD_URL_STATUS, "status": { added } }];
        const store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, () => {
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });

    it("should return invalid message if url is invalid", (done) => {
        url = "http://x.com";
        const added = false;

        postMock.expects("post").withArgs(headers, { "url": url }).returns(Promise.reject({ message }));

        const action = [{ "type": RSS_ADD_URL_STATUS, "status": { added } }];
        const store = mockStore([], action, done);
        store.dispatch(addRssUrl(url, () => {
            ajaxClientMock.verify();
            postMock.verify();
        }));
    });
});
