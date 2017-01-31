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
    NO_MORE_SOURCE_RESULTS,
    FETCHING_SOURCE_RESULTS,
    FETCHING_SOURCE_RESULTS_FAILED
} from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("TwitterConfigureActions", () => {
    describe("gotTwitterSourceResults", () => {

        it("should return source and type object", () => {
            let pageNumber = 1, twitterPreFirstId = 123, keyword = "india";
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
            let result = gotTwitterSourceResults(sources, keyword);
            assert.equal(result.type, TWITTER_GOT_SOURCE_RESULTS);
            assert.deepEqual(result.sources.data, data);
            assert.equal(result.sources.paging, pageNumber);
            assert.equal(result.sources.twitterPreFirstId, twitterPreFirstId);
            assert.equal(result.sources.keyword, keyword);
        });
    });

    describe("fetchTwitterSources", () => {
        let sandbox = null, keyword = "the";
        let ajaxClient = null, ajaxGetMock = null, twitterPreFirstId = null, paging = null, sourceDocs = null;

        beforeEach("fetchSources", () => {
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient("/twitter-handles");
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
                    "twitterPreFirstId": twitterPreFirstId,
                    "keyword": keyword
                }
            };

            let store = mockStore({ "configuredSources": { "twitter": [] } }, [{ "type": FETCHING_SOURCE_RESULTS }, gotTwitterSourcesActionObj, { "type": HAS_MORE_SOURCE_RESULTS }], done);
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
                    "twitterPreFirstId": twitterPreFirstId,
                    "keyword": keyword
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
            let store = mockStore(getStore, [{ "type": FETCHING_SOURCE_RESULTS }, gotWebSourcesActionObj, { "type": HAS_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
            ajaxGetMock.verify();
        });

        it(`should dispatch ${NO_MORE_SOURCE_RESULTS} if sources are empty`, (done) => {
            let result = { "docs": [], "paging": {}, "twitterPreFirstId": 0 };
            sandbox.mock(SearchResultsSetOperations).expects("intersectionWith");
            ajaxGetMock.returns(Promise.resolve(result));

            let store = mockStore({}, [{ "type": FETCHING_SOURCE_RESULTS }, { "type": NO_MORE_SOURCE_RESULTS }, { "type": FETCHING_SOURCE_RESULTS_FAILED }], done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
        });

        it(`should dispatch ${{ "type": FETCHING_SOURCE_RESULTS_FAILED }} if  fetching handle reject with error`, (done) => {
            ajaxGetMock.returns(Promise.reject("error"));

            let store = mockStore({}, [{ "type": FETCHING_SOURCE_RESULTS }, { "type": FETCHING_SOURCE_RESULTS_FAILED }], done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
        });
    });
});
