import * as FBActions from "../../src/js/config/actions/FacebookConfigureActions";
import { expect } from "chai";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";
import "../helper/TestHelper";
import UserSession from "../../src/js/user/UserSession";
import mockStore from "../helper/ActionHelper";
import {
    HAS_MORE_SOURCE_RESULTS,
    NO_MORE_SOURCE_RESULTS,
    CHANGE_CURRENT_SOURCE_TAB,
    FETCHING_SOURCE_RESULTS,
    FETCHING_SOURCE_RESULTS_FAILED
} from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("Facebook Configure Actions", () => {
    describe("fetch facebook sources", () => {
        it("should return type FACEBOOK_GOT_SOURCES action", () => {
            let response = {
                "data": [{ "name": "Profile1" }, { "name": "Profile2" }],
                "paging": {}
            };
            let sources = { "data": [{ "name": "Profile1" }, { "name": "Profile2" }], "paging": {}, "keyword": "keyword" };
            let facebookConfigureAction = { "type": FBActions.FACEBOOK_GOT_SOURCES, "sources": sources };
            expect(facebookConfigureAction).to.deep.equal(FBActions.facebookSourcesReceived(response, "keyword"));
        });
    });

    describe("fetchFacebookSources", () => {
        let sandbox = null, ajaxClient = null, ajaxClientMock = null;
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        beforeEach("fetchFacebookSources", () => {
            sandbox = sinon.sandbox.create();
            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });
        });

        afterEach("fetchFacebookSources", () => {
            sandbox.restore();
        });

        it(`should dispatch ${FBActions.FACEBOOK_GOT_SOURCES}, ${HAS_MORE_SOURCE_RESULTS} action after getting fb profiles`, (done) => {
            let serverUrl = "/facebook-sources";
            let response = { "data": [{ "name": "testProfile" }, { "name": "testProfile2" }], "paging": {} };
            let sources = { "data": [{ "name": "testProfile" }, { "name": "testProfile2" }], "paging": {}, "keyword": "testProfile" };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post");
            ajaxClientMock.withArgs(headers, { "keyword": "testProfile", "type": "profile", "paging": {} })
                .returns(Promise.resolve(response));

            let actions = [
                { "type": FETCHING_SOURCE_RESULTS },
                { "type": CHANGE_CURRENT_SOURCE_TAB, "currentTab": "profiles" },
                { "type": FBActions.FACEBOOK_GOT_SOURCES, "sources": sources },
                { "type": HAS_MORE_SOURCE_RESULTS }
            ];
            let store = mockStore({ "configuredSources": { "profiles": [] } }, actions, done);
            store.dispatch(FBActions.fetchFacebookSources("testProfile", "profile", FBActions.PROFILES));
        });

        it("fetch pages when requested source type is pages", (done) => {
            let serverUrl = "/facebook-sources";
            let pageName = "testPage";
            let data = [{ "name": "testProfile" }, { "name": "testProfile2" }];
            let response = { "data": data, "paging": {} };
            let sources = { "data": data, "paging": {}, "keyword": pageName };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post").withArgs(headers, {
                "keyword": pageName, "type": "page", "paging": {}
            });
            ajaxClientMock.returns(Promise.resolve(response));

            let actions = [
                { "type": FETCHING_SOURCE_RESULTS },
                { "type": CHANGE_CURRENT_SOURCE_TAB, "currentTab": FBActions.PAGES },
                { "type": "FACEBOOK_GOT_SOURCES", "sources": sources },
                { "type": HAS_MORE_SOURCE_RESULTS }
            ];
            let store = mockStore(() => ({ "configuredSources": { "pages": [] } }), actions, done);
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
                { "type": CHANGE_CURRENT_SOURCE_TAB, "currentTab": FBActions.PAGES },
                { "type": "FACEBOOK_GOT_SOURCES", "sources": sources },
                { "type": HAS_MORE_SOURCE_RESULTS }
            ];

            const getStore = () => ({
                "configuredSources": {
                    "pages": [
                        { "_id": 1 },
                        { "_id": 3 }
                    ]
                }
            });

            let store = mockStore(getStore, actions, done);
            store.dispatch(FBActions.fetchFacebookSources(pageName, "page", FBActions.PAGES));
        });

        it(`should dispatch ${NO_MORE_SOURCE_RESULTS} when the sources are empty`, (done) => {
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
                { "type": CHANGE_CURRENT_SOURCE_TAB, "currentTab": FBActions.PAGES },
                { "type": NO_MORE_SOURCE_RESULTS },
                { "type": FETCHING_SOURCE_RESULTS_FAILED, "keyword": pageName }
            ];

            const getStore = () => ({
                "configuredSources": {
                    "pages": [
                        { "_id": 1 },
                        { "_id": 3 }
                    ]
                }
            });

            let store = mockStore(getStore, actions, done);
            store.dispatch(FBActions.fetchFacebookSources(pageName, "page", FBActions.PAGES));
        });
    });
});
