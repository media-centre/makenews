import {
    displayCollectionFeeds,
    COLLECTION_FEEDS,
    NO_COLLECTION_FEEDS } from "./../../../src/js/newsboard/actions/DisplayCollectionActions";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import sinon from "sinon";

describe("DisplayCollectionAction", () => {
    let sandbox = null, collection = null;
    let ajaxClientInstance = null;

    beforeEach("DisplayCollectionAction", () => {
        collection = "test";
        sandbox = sinon.sandbox.create();

        ajaxClientInstance = AjaxClient.instance("/collectionFeeds");
        sandbox.mock(AjaxClient).expects("instance").returns(ajaxClientInstance);
    });

    afterEach("DisplayCollectionAction", () => {
        sandbox.restore();
    });

    it("should dispatch colletion feeds when successful fetch of feeds", (done) => {
        let feeds = [{ "_id": "id", "title": "someTitle" }];

        let getMock = sandbox.mock(ajaxClientInstance).expects("get")
            .withArgs({ "collection": collection }).returns(Promise.resolve(feeds));

        let store = mockStore([], [{ "type": COLLECTION_FEEDS, feeds }], done);
        store.dispatch(displayCollectionFeeds(collection));

        getMock.verify();
    });

    it("should dispatch no colletion feeds when failed to fetch the feeds", (done) => {
        let getMock = sandbox.mock(ajaxClientInstance).expects("get")
            .withArgs({ "collection": collection }).returns(Promise.reject("error"));

        let store = mockStore([], [{ "type": NO_COLLECTION_FEEDS }], done);
        store.dispatch(displayCollectionFeeds(collection));

        getMock.verify();
    });
});
