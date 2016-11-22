import { facebookGetProfiles, facebookProfilesReceived, getConfiguredProfiles, configuredProfilesReceived, FACEBOOK_GOT_PROFILES, FACEBOOK_GOT_CONFIGURED_PROFILES } from "../../src/js/config/actions/FacebookConfigureActions";
import { expect } from "chai";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";
import LoginPage from "../../src/js/login/pages/LoginPage";
import "../helper/TestHelper";
import UserSession from "../../src/js/user/UserSession";
import DbParameters from "../../src/js/db/DbParameters";
import mockStore from "../helper/ActionHelper";

describe("Facebook Configure Actions", () => {
    describe("fetch facebook profiles", () => {
        let profiles = null, sandbox = null;

        beforeEach("fetch facebook profiles", () => {
            profiles = [{ "name": "testProfile" }];
            sandbox = sinon.sandbox.create();
        });

        afterEach("fetch facebook profiles", () => {
            sandbox.restore();
        });

        it("should return type FACEBOOK_GOT_PROFILES action", () => {
            let facebookConfigureAction = { "type": FACEBOOK_GOT_PROFILES, "profiles": profiles };
            expect(facebookConfigureAction).to.deep.equal(facebookProfilesReceived(profiles));
        });

        it("should dispatch FACEBOOK_GOT_PROFILES action after getting fb profiles", (done) => {
            let userName = "user";
            let serverUrl = "/facebook-profiles";

            sandbox.mock(UserSession).expects("instance").returns({
                "continueSessionIfActive": () => {}
            });
            sandbox.mock(LoginPage).expects("getUserName").returns(userName);

            let ajaxClient = AjaxClient.instance(serverUrl, false);
            sandbox.mock(AjaxClient).expects("instance").withArgs(serverUrl, false).returns(ajaxClient);
            let ajaxClientGetMock = sandbox.mock(ajaxClient).expects("get").withArgs({ "userName": userName });
            ajaxClientGetMock.returns(Promise.resolve({ "profiles": profiles }));

            let store = mockStore({}, [{ "type": "FACEBOOK_GOT_PROFILES", "profiles": profiles }], done);
            store.dispatch(facebookGetProfiles());
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
            let action = configuredProfilesReceived(profiles);
            expect(action.type).to.equal(FACEBOOK_GOT_CONFIGURED_PROFILES);
            expect(action.profiles).to.deep.equal(profiles);
        });

        it("should dispatch FACEBOOK_GOT_CONFIGURED_PROFILES once it gets the configured profiles", (done) => {
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
            store.dispatch(getConfiguredProfiles());
        });
    });
});
