import * as FBActions from "../../src/js/config/actions/FacebookConfigureActions";
import { expect } from "chai";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";
import LoginPage from "../../src/js/login/pages/LoginPage";
import "../helper/TestHelper";
import UserSession from "../../src/js/user/UserSession";
import DbParameters from "../../src/js/db/DbParameters";
import mockStore from "../helper/ActionHelper";
import AppWindow from "../../src/js/utils/AppWindow";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import nock from "nock";

describe("Facebook Configure Actions", () => {
    describe("fetch facebook sources", () => {
        it("should return type FACEBOOK_GOT_SOURCES action", () => {
            let sources = [{ "name": "Profile1" }, { "name": "Profile2" }];
            let facebookConfigureAction = { "type": FBActions.FACEBOOK_GOT_SOURCES, "sources": sources };
            expect(facebookConfigureAction).to.deep.equal(FBActions.facebookSourcesReceived(sources));
        });
    });

    describe("configured facebook profiles", () => {
        let sandbox = null;

        beforeEach("configured facebook profiles", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("configured facebook profiles", () => {
            sandbox.restore();
        });

        it("should return FACEBOOK_GOT_CONFIGURED_PROFILES action when it receives configured profiles", () => {
            let profiles = [{ "name": "Profile1" }, { "name": "Profile2" }];
            let action = FBActions.configuredProfilesReceived(profiles);
            expect(action.type).to.equal(FBActions.FACEBOOK_GOT_CONFIGURED_PROFILES);
            expect(action.profiles).to.deep.equal(profiles);
        });

        it("should dispatch FACEBOOK_GOT_CONFIGURED_PROFILES once it gets the configured profiles from server", (done) => {
            let data = { "profiles": [{ "name": "profile1" }, { "name": "profile2" }] };
            let dbParams = new DbParameters();
            sandbox.mock(DbParameters).expects("instance").returns(dbParams);
            sandbox.stub(dbParams, "getLocalDbUrl").returns(Promise.resolve("dbName"));

            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });
            let ajaxClient = AjaxClient.instance("/facebook/configured/profiles", false);
            sandbox.mock(AjaxClient).expects("instance").withArgs("/facebook/configured/profiles", false).returns(ajaxClient);
            sandbox.stub(ajaxClient, "get").withArgs({ "dbName": "dbName" }).returns(Promise.resolve(data));

            let store = mockStore({}, [{ "type": "FACEBOOK_GOT_CONFIGURED_PROFILES", "profiles": data.profiles }], done);
            store.dispatch(FBActions.getConfiguredProfiles());
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
        let sandbox = null, ajaxClient = null, ajaxClientGetMock = null, userName = null;

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

        it("should dispatch FACEBOOK_GOT_SOURCES action after getting fb profiles ", (done) => {
            let serverUrl = "/facebook-profiles";
            let profiles = [{ "name": "testProfile" }];

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientGetMock = sandbox.mock(ajaxClient).expects("get");
            ajaxClientGetMock.withArgs({ "userName": userName }).returns(Promise.resolve(profiles));

            let actions = [{ "type": "FACEBOOK_CHANGE_CURRENT_TAB", "currentTab": "Profiles" }, { "type": "FACEBOOK_GOT_SOURCES", "sources": profiles }];
            let store = mockStore({}, actions, done);
            store.dispatch(FBActions.getSourcesOf(FBActions.PROFILES));
        });

        it("fetch pages when requested source type is pages", (done) => {
            let serverUrl = "/facebook-pages";
            let pageName = "testPage";
            let sources = { "data": [{ "name": "testProfile" }, { "name": "testProfile2" }] };

            ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            ajaxClientGetMock = sandbox.mock(ajaxClient).expects("get").withArgs({ "userName": userName, "pageName": pageName });
            ajaxClientGetMock.returns(Promise.resolve(sources));

            let actions = [{ "type": "FACEBOOK_CHANGE_CURRENT_TAB", "currentTab": FBActions.PAGES }, { "type": "FACEBOOK_GOT_SOURCES", "sources": sources.data }];
            let store = mockStore({}, actions, done);
            store.dispatch(FBActions.getSourcesOf(FBActions.PAGES, pageName));
        });
    });
    
    describe("add source to configred list", () => {
        let sandbox = null;

        beforeEach("add source to configred list", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("add source to configred list", () => {
            sandbox.restore();
        });
        
        it(`should dispatch ${FBActions.FACEBOOK_ADD_PROFILE} when requested for adding profile`, () => {
            let event = FBActions.addSourceToConfigureListOf(FBActions.PROFILES, { "name": "something" });
            expect(event.type).to.equal(FBActions.FACEBOOK_ADD_PROFILE);
            expect(event.source).to.deep.equal({ "name": "something" });
        });

        it(`should dispatch ${FBActions.FACEBOOK_ADD_PAGE} when requested for adding profile`, (done) => {
            let source = { "name": "something", "id": "id_" };

            let dbParams = new DbParameters();
            sandbox.mock(DbParameters).expects("instance").returns(dbParams);
            sandbox.stub(dbParams, "getLocalDbUrl").returns(Promise.resolve("dbName"));

            let appWindow = new AppWindow();
            sandbox.mock(AppWindow).expects("instance").returns(appWindow);
            sandbox.stub(appWindow, "get").withArgs("serverUrl").returns("http://localhost");

            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });

            nock("http://localhost")
                .put("/facebook/configuredSource")
                .reply(HttpResponseHandler.codes.OK, { "ok": true });

            let store = mockStore({}, [{ "type": "FACEBOOK_ADD_PAGE", "source": source }], done);
            store.dispatch(FBActions.addSourceToConfigureListOf(FBActions.PAGES, source));
        });

        it(`should dispatch ${FBActions.FACEBOOK_ADD_PROFILE} by default`, () => {
            let event = FBActions.addSourceToConfigureListOf("", { "name": "something" });
            expect(event.type).to.equal(FBActions.FACEBOOK_ADD_PROFILE);
            expect(event.source).to.deep.equal({ "name": "something" });
        });
    });
});
