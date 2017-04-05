import * as FBActions from "../../src/js/config/actions/FacebookConfigureActions";
import { expect } from "chai";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";
import "../helper/TestHelper";
import mockStore from "../helper/ActionHelper";
import {
    FETCHING_SOURCE_RESULTS,
    FETCHING_SOURCE_RESULTS_FAILED
} from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";
import { FB_DEFAULT_SOURCES } from "./../../src/js/utils/Constants";

describe("Facebook Configure Actions", () => {
    describe("fetch facebook sources", () => {
        it("should return type FACEBOOK_GOT_SOURCES action", () => {
            const response = {
                "data": [{ "name": "Profile1" }, { "name": "Profile2" }],
                "paging": {}
            };
            const currentTab = FBActions.PAGES;
            const sources = { "data": [{ "name": "Profile1" }, { "name": "Profile2" }], "paging": {}, "keyword": "keyword" };
            const facebookConfigureAction = { "type": FBActions.FACEBOOK_GOT_SOURCES, "sources": sources, currentTab };
            expect(facebookConfigureAction).to.deep.equal(FBActions.facebookSourcesReceived(response, "keyword", currentTab));
        });
    });

    describe("fetchFacebookSources", () => {
        let sandbox = sinon.sandbox.create(), ajaxClient = null, ajaxClientMock = null;
        const currentTab = FBActions.PAGES;
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        afterEach("fetchFacebookSources", () => {
            sandbox.restore();
        });

        it(`should dispatch ${FBActions.FACEBOOK_GOT_SOURCES} action after getting fb profiles`, (done) => {
            const serverUrl = "/facebook-sources";
            const response = { "data": [{ "name": "testProfile" }, { "name": "testProfile2" }], "paging": {} };
            const sources = { "data": [{ "name": "testProfile" }, { "name": "testProfile2" }], "paging": {}, "keyword": "testProfile" };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post");
            ajaxClientMock.withArgs(headers, { "keyword": "testProfile", "type": "profile", "paging": {} })
                .returns(Promise.resolve(response));

            const actions = [
                { "type": FETCHING_SOURCE_RESULTS },
                { "type": FBActions.FACEBOOK_GOT_SOURCES, "sources": sources, currentTab }
            ];
            const store = mockStore({ "configuredSources": { "pages": [] }, "sourceResults": { "data": [] } }, actions, done);
            store.dispatch(FBActions.fetchFacebookSources("testProfile", "profile", FBActions.PAGES));
        });

        it("fetch pages when requested source type is pages", (done) => {
            const serverUrl = "/facebook-sources";
            const pageName = "testPage";
            const data = [{ "name": "testProfile" }, { "name": "testProfile2" }];
            const response = { "data": data, "paging": {} };
            const sources = { "data": data, "paging": {}, "keyword": pageName };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post").withArgs(headers, {
                "keyword": pageName, "type": "page", "paging": {}
            });
            ajaxClientMock.returns(Promise.resolve(response));

            const actions = [
                { "type": FETCHING_SOURCE_RESULTS },
                { "type": "FACEBOOK_GOT_SOURCES", "sources": sources, currentTab }
            ];
            const store = mockStore(() => ({ "configuredSources": { "pages": [] }, "sourceResults": { "data": [] } }), actions, done);
            store.dispatch(FBActions.fetchFacebookSources(pageName, "page", FBActions.PAGES));
        });

        it("should dispatch configured pages with added property", (done) => {
            let serverUrl = "/facebook-sources";
            let pageName = "testPage";
            let fbResponse = {
                "data": [{ "id": 1, "name": "testProfile" },
                    { "id": 2, "name": "testProfile2" }],
                "paging": {}
            };
            let sources = {
                "data":
                [{ "id": 1, "name": "testProfile", "added": true },
                    { "id": 2, "name": "testProfile2" }],
                "paging": {},
                "keyword": pageName
            };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post").withArgs(headers, {
                "keyword": pageName, "type": "page", "paging": {} });
            ajaxClientMock.returns(Promise.resolve(fbResponse));
            let actions = [
                { "type": FETCHING_SOURCE_RESULTS },
                { "type": "FACEBOOK_GOT_SOURCES", "sources": sources, currentTab }
            ];

            const getStore = () => ({
                "configuredSources": {
                    "pages": [
                        { "_id": 1 },
                        { "_id": 3 }
                    ]
                },
                "sourceResults": {
                    "data": []
                }
            });

            let store = mockStore(getStore, actions, done);
            store.dispatch(FBActions.fetchFacebookSources(pageName, "page", FBActions.PAGES));
        });

        it(`should dispatch ${FETCHING_SOURCE_RESULTS_FAILED} when the sources are empty`, (done) => {
            let serverUrl = "/facebook-sources";
            let pageName = "testPage";
            let fbResponse = { "data": [], "paging": {} };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post").withArgs(headers, {
                "keyword": pageName, "type": "page", "paging": {} });
            ajaxClientMock.returns(Promise.resolve(fbResponse));
            let actions = [
                { "type": FETCHING_SOURCE_RESULTS },
                { "type": FETCHING_SOURCE_RESULTS_FAILED, "keyword": pageName }
            ];

            const getStore = () => ({
                "configuredSources": {
                    "pages": [
                        { "_id": 1 },
                        { "_id": 3 }
                    ]
                },
                "sourceResults": {
                    "data": []
                }
            });

            let store = mockStore(getStore, actions, done);
            store.dispatch(FBActions.fetchFacebookSources(pageName, "page", FBActions.PAGES));
        });

        it(`should dispatch ${FBActions.FACEBOOK_GOT_SOURCES} for Default results`, (done) => {
            const type = "page";
            let paging; //eslint-disable-line init-declarations
            const keyword = "";
            const sources = { "data": FB_DEFAULT_SOURCES[type].data, paging, keyword };
            let actions = [
                { "type": FETCHING_SOURCE_RESULTS },
                { "type": FBActions.FACEBOOK_GOT_SOURCES, "sources": sources, currentTab }
            ];

            let store = mockStore({ "configuredSources": { "pages": [] }, "sourceResults": { "data": [] } }, actions, done);
            store.dispatch(FBActions.fetchFacebookSources(keyword, "page", FBActions.PAGES));
        });
    });
});
