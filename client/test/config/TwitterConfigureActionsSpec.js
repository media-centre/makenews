import {
    gotTwitterSourceResults,
    TWITTER_GOT_SOURCE_RESULTS,
    fetchTwitterSources
} from "../../src/js/config/actions/TwitterConfigureActions";
import { assert } from "chai";
import sinon from "sinon";
import AjaxClient from "./../../src/js/utils/AjaxClient";
import mockStore from "../helper/ActionHelper";
import * as SearchResultsSetOperations from "../../src/js/utils/SearchResultsSetOperations";
import {
    HAS_MORE_SOURCE_RESULTS,
    NO_MORE_SOURCE_RESULTS
} from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("TwitterConfigureActions", () => {
    describe("gotTwitterSourceResults", () => {

        it("should return source and type object", () => {
            let pageNumber = 1, twitterPreFirstId = 123;
            let data = [{
                "id": 8640348,
                "name": "testUser",
                "location": "andhra"
            },
                {
                    "id": 8640347,
                    "name": "testUser3",
                    "location": "andhrapradesh"
                }];
            let sources = {
                "docs": data,
                "paging": pageNumber,
                "twitterPreFirstId": twitterPreFirstId
            };
            let result = gotTwitterSourceResults(sources);
            assert.equal(result.type, TWITTER_GOT_SOURCE_RESULTS);
            assert.deepEqual(result.sources.data, data);
            assert.equal(result.sources.paging, pageNumber);
            assert.equal(result.sources.twitterPreFirstId, twitterPreFirstId);
        });
    });

    describe("fetchTwitterSources", () => {
        let sandbox = null, keyword = "the";
        let ajaxClient = null, ajaxGetMock = null, twitterPreFirstId = null, paging = null, sourceDocs = null;

        beforeEach("fetchSources", () => {
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient("/twitter-followers");
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClient);
            twitterPreFirstId = 123; //eslint-disable-line no-magic-numbers
            paging = { "page": 2 };
            sourceDocs = [{
                "id": 8640348,
                "name": "testUser",
                "location": "andhra"
            },
            {
                "id": 8640347,
                "name": "testUser3",
                "location": "andhrapradesh"
            }];
            ajaxGetMock = sandbox.mock(ajaxClient).expects("get");
        });

        afterEach("fetchSources", () => {
            sandbox.restore();
        });

        it(`should dispatch ${TWITTER_GOT_SOURCE_RESULTS}, ${HAS_MORE_SOURCE_RESULTS} after getting sources`, (done) => {
            let result = {
                "docs": sourceDocs,
                "paging": paging,
                "twitterPreFirstId": twitterPreFirstId

            };
            ajaxGetMock.returns(Promise.resolve(result));

            let gotTwitterSourcesActionObj = {
                "type": TWITTER_GOT_SOURCE_RESULTS,
                "sources": {
                    "data": sourceDocs,
                    "paging": paging,
                    "twitterPreFirstId": twitterPreFirstId
                }
            };

            let store = mockStore({ "configuredSources": { "twitter": [] } }, [gotTwitterSourcesActionObj, { "type": HAS_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
            ajaxGetMock.verify();
        });

        it(`should dispatch ${TWITTER_GOT_SOURCE_RESULTS}, ${HAS_MORE_SOURCE_RESULTS} after getting sources with added=true property`, (done) => {
            let result = {
                "docs": sourceDocs,
                "paging": paging,
                "twitterPreFirstId": twitterPreFirstId
            };

            ajaxGetMock.returns(Promise.resolve(result));

            let gotWebSourcesActionObj = {
                "type": TWITTER_GOT_SOURCE_RESULTS,
                "sources": {
                    "data": sourceDocs,
                    "paging": paging,
                    "twitterPreFirstId": twitterPreFirstId
                }
            };

            const getStore = {
                "configuredSources": {
                    "twitter": [{
                        "name": "testUser3",
                        "_id": 8640347
                    }]
                }
            };
            let store = mockStore(getStore, [gotWebSourcesActionObj, { "type": HAS_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
            ajaxGetMock.verify();
        });

        it(`should dispatch ${NO_MORE_SOURCE_RESULTS} if sources are empty`, (done) => {
            let result = { "docs": [], "paging": {}, "twitterPreFirstId": 0 };
            sandbox.mock(SearchResultsSetOperations).expects("intersectionWith");
            ajaxGetMock.returns(Promise.resolve(result));

            let store = mockStore({}, [{ "type": NO_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
        });
    });
});
