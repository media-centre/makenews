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
    FETCHING_SOURCE_RESULTS,
    FETCHING_SOURCE_RESULTS_FAILED,
    TWITTER
} from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("TwitterConfigureActions", () => {
    const currentTab = TWITTER;
    describe("gotTwitterSourceResults", () => {
        it("should return source and type object", () => {
            const pageNumber = 1;
            const twitterPreFirstId = 123;
            const keyword = "india";
            const data = [{
                "id": 8640348,
                "name": "testUser",
                "location": "andhra"
            }, {
                "id": 8640347,
                "name": "testUser3",
                "location": "andhrapradesh"
            }];
            const sources = {
                "docs": data,
                "paging": pageNumber,
                "twitterPreFirstId": twitterPreFirstId
            };
            const result = gotTwitterSourceResults(sources, keyword, currentTab);
            assert.equal(result.type, TWITTER_GOT_SOURCE_RESULTS);
            assert.deepEqual(result.sources.data, data);
            assert.equal(result.sources.paging, pageNumber);
            assert.equal(result.sources.twitterPreFirstId, twitterPreFirstId);
            assert.equal(result.sources.keyword, keyword);
        });
    });

    describe("fetchTwitterSources", () => {
        let sandbox = null;
        let keyword = "the";
        let ajaxClient = null;
        let ajaxGetMock = null;
        let twitterPreFirstId = null;
        let paging = null;
        let sourceDocs = null;

        beforeEach("fetchSources", () => {
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient("/twitter-handles");
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

        it(`should dispatch ${TWITTER_GOT_SOURCE_RESULTS} after getting sources`, (done) => {
            const result = {
                "docs": sourceDocs,
                "paging": paging,
                "twitterPreFirstId": twitterPreFirstId
            };
            ajaxGetMock.returns(Promise.resolve(result));

            const gotTwitterSourcesActionObj = {
                "type": TWITTER_GOT_SOURCE_RESULTS,
                "sources": {
                    "data": sourceDocs,
                    "paging": paging,
                    "twitterPreFirstId": twitterPreFirstId,
                    "keyword": keyword
                },
                currentTab
            };

            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClient);

            const store = mockStore({ "configuredSources": { "twitter": [] } }, [{ "type": FETCHING_SOURCE_RESULTS }, gotTwitterSourcesActionObj], done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
            ajaxGetMock.verify();
        });

        it(`should dispatch ${TWITTER_GOT_SOURCE_RESULTS} after getting sources with added=true property`, (done) => {
            const result = {
                "docs": sourceDocs,
                "paging": paging,
                "twitterPreFirstId": twitterPreFirstId
            };
            ajaxGetMock.returns(Promise.resolve(result));

            const gotWebSourcesActionObj = {
                "type": TWITTER_GOT_SOURCE_RESULTS,
                "sources": {
                    "data": sourceDocs,
                    "paging": paging,
                    "twitterPreFirstId": twitterPreFirstId,
                    "keyword": keyword
                },
                currentTab
            };

            const getStore = {
                "configuredSources": {
                    "twitter": [{
                        "name": "testUser3",
                        "_id": 8640347
                    }]
                }
            };
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClient);
            const store = mockStore(getStore, [{ "type": FETCHING_SOURCE_RESULTS }, gotWebSourcesActionObj], done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
            ajaxGetMock.verify();
        });

        it(`should dispatch ${FETCHING_SOURCE_RESULTS_FAILED} if sources are empty`, (done) => {
            const result = { "docs": [], "paging": {}, "twitterPreFirstId": 0 };
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClient);
            sandbox.mock(SearchResultsSetOperations).expects("intersectionWith");
            ajaxGetMock.returns(Promise.resolve(result));

            const store = mockStore({}, [{ "type": FETCHING_SOURCE_RESULTS },
                { "type": FETCHING_SOURCE_RESULTS_FAILED, keyword }],
            done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
        });

        it(`should dispatch ${FETCHING_SOURCE_RESULTS_FAILED} if  fetching handle reject with error`, (done) => {
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClient);
            ajaxGetMock.returns(Promise.reject("error"));

            const store = mockStore({}, [{ "type": FETCHING_SOURCE_RESULTS },
                { "type": FETCHING_SOURCE_RESULTS_FAILED, keyword }],
            done);
            store.dispatch(fetchTwitterSources(keyword, paging, twitterPreFirstId));
        });

        it("should create instance with followings when there is no keyword", () => {
            keyword = "";
            const ajaxInstance = sandbox.mock(AjaxClient).expects("instance").withExactArgs("/twitter-followings");
            fetchTwitterSources();

            ajaxInstance.verify();
        });
    });
});
