import * as FBActions from "../../src/js/config/actions/FacebookConfigureActions";
import { expect } from "chai";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";
import LoginPage from "../../src/js/login/pages/LoginPage";
import "../helper/TestHelper";
import UserSession from "../../src/js/user/UserSession";
import mockStore from "../helper/ActionHelper";
import AppWindow from "../../src/js/utils/AppWindow";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import nock from "nock";
import { HAS_MORE_SOURCE_RESULTS, NO_MORE_SOURCE_RESULTS } from "./../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("Facebook Configure Actions", () => {
    describe("fetch facebook sources", () => {
        it("should return type FACEBOOK_GOT_SOURCES action", () => {
            let sources = [{ "name": "Profile1" }, { "name": "Profile2" }];
            let facebookConfigureAction = { "type": FBActions.FACEBOOK_GOT_SOURCES, "sources": sources };
            expect(facebookConfigureAction).to.deep.equal(FBActions.facebookSourcesReceived(sources));
        });
    });

    describe("switch current Tab", () => {
        it("should return the FACEBOOK_CHANGE_CURRENT_TAB action", () => {
            let currentTab = "Profiles";
            let facebookSourceTabSwitch = FBActions.facebookSourceTabSwitch(currentTab);
            expect(facebookSourceTabSwitch.type).to.equal(FBActions.FACEBOOK_CHANGE_CURRENT_TAB);
            expect(facebookSourceTabSwitch.currentTab).to.equal(currentTab);
        });
    });

    describe("get Sources of", () => {
        let sandbox = null, ajaxClient = null, ajaxClientMock = null, userName = null;
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        beforeEach("get Sources of", () => {
            userName = "user";
            sandbox = sinon.sandbox.create();
            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });
            sandbox.mock(LoginPage).expects("getUserName").returns(userName);
        });

        afterEach("get Sources of", () => {
            sandbox.restore();
        });

        it(`should dispatch ${FBActions.FACEBOOK_GOT_SOURCES}, ${HAS_MORE_SOURCE_RESULTS} action after getting fb profiles`, (done) => {
            let serverUrl = "/facebook-sources";
            let sources = { "data": [{ "name": "testProfile" }, { "name": "testProfile2" }] };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post");
            ajaxClientMock.withArgs(headers, { "userName": userName, "keyword": "testProfile", "type": "profile", "paging": {} }).returns(Promise.resolve(sources));

            let actions = [
                { "type": FBActions.FACEBOOK_CHANGE_CURRENT_TAB, "currentTab": "Profiles" },
                { "type": FBActions.FACEBOOK_GOT_SOURCES, "sources": sources },
                { "type": HAS_MORE_SOURCE_RESULTS }
            ];
            let store = mockStore({ "configuredSources": { "profiles": [] } }, actions, done);
            store.dispatch(FBActions.getSourcesOf(FBActions.PROFILES, "testProfile"));
        });

        it("fetch pages when requested source type is pages", (done) => {
            let serverUrl = "/facebook-sources";
            let pageName = "testPage";
            let sources = { "data": [{ "name": "testProfile" }, { "name": "testProfile2" }] };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post").withArgs(headers, {
                "userName": userName, "keyword": pageName, "type": "page", "paging": {}
            });
            ajaxClientMock.returns(Promise.resolve(sources));

            let actions = [
                { "type": "FACEBOOK_CHANGE_CURRENT_TAB", "currentTab": FBActions.PAGES },
                { "type": "FACEBOOK_GOT_SOURCES", "sources": sources },
                { "type": HAS_MORE_SOURCE_RESULTS }
            ];
            let store = mockStore(() => ({ "configuredSources": { "pages": [] } }), actions, done);
            store.dispatch(FBActions.getSourcesOf(FBActions.PAGES, pageName));
        });

        it("should dispatch configured pages with added property", (done) => {
            let serverUrl = "/facebook-sources";
            let pageName = "testPage";
            let fbResponse = { "data": [{ "id": 1, "name": "testProfile" },
                { "id": 2, "name": "testProfile2" }] };
            let sources = { "data": [{ "id": 1, "name": "testProfile", "added": true },
                { "id": 2, "name": "testProfile2" }] };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post").withArgs(headers, {
                "userName": userName, "keyword": pageName, "type": "page", "paging": {} });
            ajaxClientMock.returns(Promise.resolve(fbResponse));
            let actions = [
                { "type": "FACEBOOK_CHANGE_CURRENT_TAB", "currentTab": FBActions.PAGES },
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
            store.dispatch(FBActions.getSourcesOf(FBActions.PAGES, pageName, {}));
        });

        it(`should dispatch ${NO_MORE_SOURCE_RESULTS} when the sources are empty`, (done) => {
            let serverUrl = "/facebook-sources";
            let pageName = "testPage";
            let fbResponse = { "data": [] };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientMock = sandbox.mock(ajaxClient).expects("post").withArgs(headers, {
                "userName": userName, "keyword": pageName, "type": "page", "paging": {} });
            ajaxClientMock.returns(Promise.resolve(fbResponse));
            let actions = [
                { "type": "FACEBOOK_CHANGE_CURRENT_TAB", "currentTab": FBActions.PAGES },
                { "type": NO_MORE_SOURCE_RESULTS }
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
            store.dispatch(FBActions.getSourcesOf(FBActions.PAGES, pageName, {}));
        });
    });
    
    describe("add source to configured list", () => {
        let sandbox = null, sources = null;

        beforeEach("add source to configred list", () => {
            sources = [{ "name": "something", "id": "432455" }];
            sandbox = sinon.sandbox.create();
        });

        afterEach("add source to configred list", () => {
            sandbox.restore();
        });
        
        it(`should dispatch ${FBActions.FACEBOOK_ADD_PROFILE} when requested for adding profile`, (done) => {
            let appWindow = new AppWindow();
            sandbox.mock(AppWindow).expects("instance").returns(appWindow);
            sandbox.stub(appWindow, "get").withArgs("serverUrl").returns("http://localhost");

            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });

            nock("http://localhost")
                .put("/facebook/configureSource")
                .reply(HttpResponseHandler.codes.OK, { "ok": true });

            let store = mockStore({}, [{ "type": FBActions.FACEBOOK_ADD_PROFILE, "sources": sources }], done);
            store.dispatch(FBActions.addSourceToConfigureListOf(FBActions.PROFILES, ...sources));
        });

        it(`should dispatch ${FBActions.FACEBOOK_ADD_PAGE} when requested for adding page`, (done) => {
            let appWindow = new AppWindow();
            sandbox.mock(AppWindow).expects("instance").returns(appWindow);
            sandbox.stub(appWindow, "get").withArgs("serverUrl").returns("http://localhost");

            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });

            nock("http://localhost")
                .put("/facebook/configureSource")
                .reply(HttpResponseHandler.codes.OK, { "ok": true });

            let store = mockStore({}, [{ "type": FBActions.FACEBOOK_ADD_PAGE, "sources": sources }], done);
            store.dispatch(FBActions.addSourceToConfigureListOf(FBActions.PAGES, ...sources));
        });

        it(`should dispatch ${FBActions.FACEBOOK_ADD_GROUP} when requested for adding group`, (done) => {
            let appWindow = new AppWindow();
            sandbox.mock(AppWindow).expects("instance").returns(appWindow);
            sandbox.stub(appWindow, "get").withArgs("serverUrl").returns("http://localhost");

            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });

            nock("http://localhost")
                .put("/facebook/configureSource")
                .reply(HttpResponseHandler.codes.OK, { "ok": true });

            let store = mockStore({}, [{ "type": FBActions.FACEBOOK_ADD_GROUP, "sources": sources }], done);
            store.dispatch(FBActions.addSourceToConfigureListOf(FBActions.GROUPS, ...sources));
        });

        it(`should dispatch ${FBActions.FACEBOOK_ADD_PROFILE} by default`, () => {
            let event = FBActions.addSourceToConfigureListOf("", { "name": "something" });
            expect(event.type).to.equal(FBActions.FACEBOOK_ADD_PROFILE);
            expect(event.sources).to.deep.equal([{ "name": "something" }]);
        });
    });
});
