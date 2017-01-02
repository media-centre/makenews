import { gotTwitterSourceResults, TWITTER_GOT_SOURCE_RESULTS, fetchTwitterSources } from "../../src/js/config/actions/TwitterConfigureActions";
import { assert } from "chai";
import sinon from "sinon";
import AjaxClient from "./../../src/js/utils/AjaxClient";
import mockStore from "../helper/ActionHelper";
import { HAS_MORE_SOURCE_RESULTS, NO_MORE_SOURCE_RESULTS } from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("TwitterConfigureActions", () => {
    describe("gotWebSourceResults", () => {
        it("should return source and type object", () => {
           let sources = [{
                "id": 8640348,
               "name": "testUser",
               "location": "andhra"
           },
           {
               "id": 8640347,
               "name": "testUser3",
               "location": "andhrapradesh"
           }];
            let result = gotTwitterSourceResults(sources);
            assert.equal(result.type, TWITTER_GOT_SOURCE_RESULTS);
        });
    });

    describe("fetchTwitterSources", () => {
        let sandbox = null, keyword = "the";
        let ajaxClient = null, ajaxGetMock = null;

        beforeEach("fetchSources", () => {
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient("/twitter-followers");
            sandbox.mock(AjaxClient).expects("instance").returns(ajaxClient);
            ajaxGetMock = sandbox.mock(ajaxClient).expects("get").withArgs({ keyword });
        });

        afterEach("fetchSources", () => {
            sandbox.restore();
        });

        it(`should dispatch ${TWITTER_GOT_SOURCE_RESULTS}, ${HAS_MORE_SOURCE_RESULTS} after getting sources`, (done) => {
            let result = [{
                "id": 8640348,
                "name": "testUser",
                "location": "andhra"
            },
                {
                    "id": 8640347,
                    "name": "testUser3",
                    "location": "andhrapradesh"
                }];
            ajaxGetMock.returns(Promise.resolve(result));

            let gotTwitterSourcesActionObj = {
                "type": TWITTER_GOT_SOURCE_RESULTS,
                "sources": { "data": result, "paging": result.paging }
            };

            let store = mockStore({ "configuredSources": { "twitter": [] } }, [gotTwitterSourcesActionObj, { "type": HAS_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchTwitterSources(keyword));
            ajaxGetMock.verify();
        });

        it.only(`should dispatch ${TWITTER_GOT_SOURCE_RESULTS}, ${HAS_MORE_SOURCE_RESULTS} after getting sources with added=true property`, (done) => {
            let result =  [{
                "id": 8640348,
                "name": "testUser",
                "location": "andhra"
            },
                {
                    "id": 8640347,
                    "name": "testUser3",
                    "location": "andhrapradesh"
                }];
            ajaxGetMock.returns(Promise.resolve(result));

            let gotWebSourcesActionObj = {
                "type": TWITTER_GOT_SOURCE_RESULTS,
                "sources": {
                    "data":  [{
                    "id": 8640348,
                    "name": "testUser",
                    "location": "andhra"
                },
                    {
                        "id": 8640347,
                        "name": "testUser3",
                        "location": "andhrapradesh",
                        "added": true
                    }],
                    "paging": result.paging }
            };

            const getStore = { "configuredSources": {
                "twitter": [{
                    "name": "testUser3",
                    "id": 8640347
                }]
            } };

            let store = mockStore(getStore, [gotWebSourcesActionObj, { "type": HAS_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchTwitterSources(keyword));
            ajaxGetMock.verify();
        });

        it(`should dispatch ${NO_MORE_SOURCE_RESULTS} if sources are empty`, (done) => {
            let result = { "docs": [], "paging": { "offset": "25" } };
            ajaxGetMock.returns(Promise.resolve(result));

            let store = mockStore({}, [{ "type": NO_MORE_SOURCE_RESULTS }], done);
            store.dispatch(fetchTwitterSources(keyword));
        });
    });
});
