import { gotWebSourceResults, WEB_GOT_SOURCE_RESULTS, fetchWebSources } from "./../../src/js/config/actions/WebConfigureActions";
import { assert } from "chai";
import sinon from "sinon";
import AjaxClient from "./../../src/js/utils/AjaxClient";
import mockStore from "../helper/ActionHelper";
import { HAS_MORE_SOURCE_RESULTS, NO_MORE_SOURCE_RESULTS } from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("WebConfigureActions", () => {

    describe("gotWebSourceResults", () => {
        it("should return source and type object", () => {
            let source = [{
                "name": "The Hindu - International",
                "url": "http://www.thehindu.com/news/international/?service=rss"
            },
                {
                    "name": "The Hindu - Sport",
                    "url": "http://www.thehindu.com/sport/?service=rss"
                }];
            let result = gotWebSourceResults(source);
            assert.strictEqual(result.sources.data, source);
            assert.equal(result.type, WEB_GOT_SOURCE_RESULTS);
        });
    });

    describe("fetchSources", () => {
        let sandbox = null, keyword = "the";
        let ajaxClient = null, ajaxGetMock = null;

        beforeEach("fetchSources", () => {
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient("/search-all-urls");
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClient);
            ajaxGetMock = sandbox.mock(ajaxClient).expects("get").withArgs({ "key": keyword });
        });

        afterEach("fetchSources", () => {
            sandbox.restore();
        });

        it(`should dispatch ${WEB_GOT_SOURCE_RESULTS}, ${HAS_MORE_SOURCE_RESULTS} after getting sources`, (done) => {
            let result = { "docs": [{
                "name": "The Hindu - International",
                "url": "http://www.thehindu.com/news/international/?service=rss"
            },
                {
                    "name": "The Hindu - Sport",
                    "url": "http://www.thehindu.com/sport/?service=rss"
                }] };
            ajaxGetMock.returns(Promise.resolve(result));

            let gotWebSourcesActionObj = {
                "type": WEB_GOT_SOURCE_RESULTS,
                "sources": { "data": result.docs, "paging": {} }
            };

            let store = mockStore({}, [gotWebSourcesActionObj, { "type": HAS_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchWebSources(keyword));
        });

        it(`should dispatch ${NO_MORE_SOURCE_RESULTS} if sources are empty`, (done) => {
            let result = { "docs": [] };
            ajaxGetMock.returns(Promise.resolve(result));

            let store = mockStore({}, [{ "type": NO_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchWebSources(keyword));
        });
    });
});
